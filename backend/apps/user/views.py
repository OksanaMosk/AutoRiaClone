from django.contrib.auth import get_user_model

from rest_framework import filters
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import DestroyAPIView, ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django_filters.rest_framework import DjangoFilterBackend

from apps.user.permissions import IsAdmin, IsAdminOrManager
from apps.user.serializers import (
    UserAccountTypeUpdateSerializer,
    UserActiveSerializer,
    UserRoleSerializer,
    UserSerializer,
    UserUpdateSerializer,
)
from apps.user.services import UserService

UserModel = get_user_model()

class UserListCreateAPIView(ListCreateAPIView):
    """
    get:
        Retrieve a list of all users.
        Requires authentication and appropriate permissions.

    post:
        Create a new user.
        Provide user details (e.g., username, email, password) in the request body.
    """
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated(), IsAdminOrManager()]

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['role', 'account_type', 'is_active']
    ordering_fields = ['id', 'email', 'role', 'account_type', 'is_active']
    ordering = ['id']


class UpdateUserActiveAPIView(RetrieveUpdateAPIView):
    """
    PATCH:
        Change the 'is_active' status of a user.
        - Admins can change anyone.
        - Managers can change only BUYER's and SELLERs, cannot deactivate admins or managers.
    """
    queryset = UserModel.objects.all()
    serializer_class = UserActiveSerializer
    permission_classes = [IsAdminOrManager]
    lookup_field = 'pk'

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        current_user = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if current_user.role == UserModel.Role.MANAGER:
            if user.role in [UserModel.Role.ADMIN, UserModel.Role.MANAGER]:
                raise PermissionDenied('Managers cannot change active status of admins or managers.')

        user = UserService.toggle_user_active_status(user, serializer.validated_data['is_active'])
        return Response(UserActiveSerializer(user).data)

class UpdateUserAPIView(RetrieveUpdateAPIView):
    """
    get:
        Retrieve information about a specific user by ID.
        Requires authentication and appropriate permissions.
    patch:
        Update user details partially.
        Provide the fields to update in the request body (e.g., username, email).
    """
    queryset = UserModel.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    lookup_field = "pk"

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)

class DeleteUserAPIView(DestroyAPIView):
    """
    DELETE:
        Delete a specific user by ID.
        - Admins can delete anyone.
        - Managers can delete only BUYER's and SELLERs.
    """
    queryset = UserModel.objects.all()
    permission_classes = [IsAdminOrManager]
    lookup_field = 'pk'

    def destroy(self, request, *args, **kwargs):
        user_to_delete = self.get_object()
        current_user = request.user
        if current_user.role == UserModel.Role.MANAGER:
            if user_to_delete.role in [UserModel.Role.ADMIN, UserModel.Role.MANAGER]:
                raise PermissionDenied('Managers cannot delete admins or other managers.')

        return super().destroy(request, *args, **kwargs)


class ChangeUserRoleAPIView(APIView):
    """
    PATCH:
        Change the role of a specific user.
        Requires admin permissions and superuser status.
        Validates 'role' field via UserRoleSerializer.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, user_id):
        serializer = UserRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = UserService.change_user_role(request.user, user_id, serializer.validated_data['role'])
        return Response(UserSerializer(user).data)


class ChangeUserAccountTypeAPIView(APIView):
    """
    PATCH:
        Change the account type of specific user.
        Requires admin permissions and superuser status.
        Validates 'account_type' field via ChangeUserAccountTypeSerializer.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, user_id):
        serializer = UserAccountTypeUpdateSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)

        user = UserService.change_user_account_type(
            request.user,
            user_id,
            serializer.validated_data['account_type']
        )

        return Response(UserSerializer(user).data)


class ChangeUserDealershipAPIView(APIView):
    """
    patch:
        Change the dealership associated with a specific user.
        Requires the requesting user to be authenticated and an admin.
        Provide 'dealership_id' field in the request body.
    """

    permission_classes = [IsAdmin]

    def patch(self, request, user_id):
        dealership_id = request.data.get('dealership_id')
        user = UserService.change_user_dealership(user_id, dealership_id)
        return Response(UserSerializer(user).data)
