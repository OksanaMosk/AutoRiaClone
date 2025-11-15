import os

from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView, DestroyAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from apps.user.models import Dealership
from apps.user.serializers import UserSerializer
from apps.user.permissions import IsAdmin, IsManager, IsAdminOrManager

UserModel = get_user_model()

class UserListCreateAPIView(ListCreateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class BlockUserAPIView(RetrieveUpdateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrManager]
    lookup_field = "pk"

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        if user.is_active:
            user.is_active = False
            user.save()
        return Response(self.get_serializer(user).data, status=status.HTTP_200_OK)

class UnblockUserAPIView(RetrieveUpdateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrManager]
    lookup_field = "pk"

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        if not user.is_active:
            user.is_active = True
            user.save()
        return Response(self.get_serializer(user).data, status=status.HTTP_200_OK)

class UpdateUserAPIView(RetrieveUpdateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    lookup_field = "pk"

class DeleteUserAPIView(DestroyAPIView):
    queryset = UserModel.objects.all()
    permission_classes = [IsAuthenticated, IsAdmin | IsManager]
    lookup_field = "pk"


class ChangeUserRoleAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, user_id):
        if not request.user.is_superuser:
            raise PermissionDenied("You do not have permission to change user roles.")

        try:
            user = UserModel.objects.get(id=user_id)
        except UserModel.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)

        new_role = request.data.get("role")
        if new_role not in [UserModel.Role.BUYER, UserModel.Role.SELLER, UserModel.Role.MANAGER, UserModel.Role.ADMIN]:
            return Response({"detail": "Invalid role."}, status=400)

        user.role = new_role
        user.save()
        return Response(UserSerializer(user).data, status=200)


class SendEmailTestAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        template = get_template('test_email.html')
        html_content = template.render({'name': 'DJANGO'})
        msg = EmailMultiAlternatives(
            subject='Test Email',
            from_email=os.environ.get('EMAIL_HOST_USER'),
            to=[request.user.email if request.user.is_authenticated else 'example@example.com'],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        return Response({'message': 'Email sent!'}, status=status.HTTP_200_OK)


class ChangeUserAccountTypeAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, user_id):
        if not request.user.is_superuser:
            raise PermissionDenied("You do not have permission to change user account types.")

        try:
            user = UserModel.objects.get(id=user_id)
        except UserModel.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)

        new_account_type = request.data.get("account_type")
        if new_account_type not in [
            UserModel.AccountType.BASIC,
            UserModel.AccountType.PREMIUM,
        ]:
            return Response({"detail": "Invalid account type."}, status=400)

        user.account_type = new_account_type
        user.save()

        return Response(UserSerializer(user).data, status=200)

class ChangeUserDealershipAPIView(APIView):
    permission_classes = [IsAdmin]
    def patch(self, request, user_id):
        try:
            user = UserModel.objects.get(id=user_id)
        except UserModel.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)
        dealership_id = request.data.get("dealership_id")
        if dealership_id is not None:
            try:
                dealership = Dealership.objects.get(id=dealership_id)
            except Dealership.DoesNotExist:
                return Response({"detail": "Dealership not found"}, status=404)
            user.dealership = dealership
        else:
            user.dealership = None  # від’єднати від салону
        user.save()
        return Response(UserSerializer(user).data, status=200)


class UserFilterSortAPIView(APIView):
    permission_classes = [IsAuthenticated, IsManager | IsAdmin]

    def get(self, request):
        is_active = request.query_params.get('is_active', None)
        account_type = request.query_params.get('account_type', None)
        role = request.query_params.get('role', None)
        sort_by = request.query_params.get('sort_by', 'id')
        sort_order = request.query_params.get('sort_order', 'asc')
        valid_roles = ['buyer', 'seller', 'manager', 'admin']
        if role and role not in valid_roles:
            return Response({"detail": "Invalid role."}, status=400)
        users = UserModel.objects.all()
        if is_active is not None:
            if is_active.lower() not in ['true', 'false']:
                return Response({"detail": "Invalid value for 'is_active' parameter."}, status=400)
            is_active = is_active.lower() == 'true'
            users = users.filter(is_active=is_active)
        if account_type:
            users = users.filter(account_type=account_type)
        if role:
            users = users.filter(role=role)
        valid_sort_fields = ['id', 'username', 'email', 'role', 'account_type', 'is_active']
        if sort_by not in valid_sort_fields:
            return Response({"detail": "Invalid sort field."}, status=400)
        if sort_order == 'asc':
            users = users.order_by(sort_by)
        else:
            users = users.order_by(f'-{sort_by}')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)