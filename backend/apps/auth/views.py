from django.contrib.auth import get_user_model, authenticate
from rest_framework.generics import  get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from core.services.email_service import EmailService
from core.services.jwt_service import RecoveryToken, SocketToken
from apps.auth.serializers import EmailSerializer, PasswordSerializer
from apps.user.serializers import UserSerializer
from core.services.jwt_service import JWTService, ActivateToken
from core.exceptions.jwt_exception import JWTException
from rest_framework.generics import GenericAPIView
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
import logging


UserModel = get_user_model()
logger = logging.getLogger(__name__)

class ActivateUserView(GenericAPIView):
    """
    get:
        Activate a user account using the activation token provided in the URL.
    """

    permission_classes = (AllowAny,)
    serializer_class = UserSerializer
    def activate_user(self, token):
        if not token:
            return Response({'detail': 'Token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        print(f"Received token: {token}")

        try:
            user = JWTService.verify_token(token, ActivateToken)
            print(f"User found: {user.email}")
            if user.is_active:
                print(f"User {user.email} is already activated.")
                return Response({'detail': 'Account is already activated.'}, status=status.HTTP_200_OK)
            user.is_active = True
            user.save()
            print(f"User {user.email} has been activated.")
            serializer = UserSerializer(user)
            logger.info(f"User {user.email} activated successfully.")
            return Response({'detail': 'Account activated successfully!', 'user': serializer.data}, status=status.HTTP_200_OK)

        except JWTException as e:
            print(f"Invalid or expired token: {e}")
            return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)
        except NotFound as e:
            print(f"User not found: {e}")
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Unexpected error: {e}")
            logger.error(f"Unexpected error: {e}")
            return Response({'detail': 'Something went wrong.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def patch(self, request, *args, **kwargs):
        token = kwargs.get('token')
        return self.activate_user(token)

    def get(self, request, *args, **kwargs):
        token = kwargs.get('token')
        response = self.activate_user(token)

        if response.status_code == 200:
            return redirect("http://localhost:3000/login?activated=true")
        return response

class RecoveryRequestView(GenericAPIView):
    """
    post:
        Request a password recovery for a user account.
        Provide the user's email in the request body.
    """

    def get_serializer(self):
        return None

    permission_classes = (AllowAny,)
    def post(self, *args, **kwargs):
        data=self.request.data
        serializer = EmailSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user=get_object_or_404(UserModel,  email=serializer.data['email'])
        EmailService.recovery(user)
        return Response({'details': 'Link send to email'}, status.HTTP_200_OK)


class RecoveryPasswordView(GenericAPIView):
    """
    post:
        Reset the user's password using the provided token and new password.
        Provide 'token' and 'new_password' in the request body.
    """

    permission_classes = (AllowAny,)
    serializer_class = PasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = PasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = kwargs['token']
        user = JWTService.verify_token(token, RecoveryToken)
        user.set_password(serializer.validated_data['password'])
        user.save()
        return Response(UserSerializer(user).data, status.HTTP_200_OK)

class SocketTokenView(GenericAPIView):
    """
    get:
        Generate a socket token for the authenticated user.
    """

    def get_serializer(self):
        return None

    permission_classes = (IsAuthenticated,)
    def get(self, *args, **kwargs):
        token=JWTService.create_token(user=self.request.user,token_class=SocketToken)
        return Response({'token': str(token)}, status.HTTP_200_OK)


@method_decorator(name='post', decorator=swagger_auto_schema(security=[]))
class RegisterAPIView(GenericAPIView):
    """
    post:
        Register a new user account.
        Provide required user details (e.g., username, email, password) in the request body.
    """
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(is_active=True)
        return Response(UserSerializer(user).data, status.HTTP_201_CREATED)

class LoginAPIView(APIView):
    """
    post:
        Authenticate a user and return an access token.
        Provide 'username' and 'password' in the request body.
    """
    permission_classes = (AllowAny,)
    def post(self, request, *args, **kwargs):
        username = request.data.get('username') or request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            print(f"User role: {user.role}")
            role = user.role
            token = JWTService.create_token(user=user, token_class=AccessToken)
            refresh_token = JWTService.create_token(user=user, token_class=RefreshToken)
            return Response({
                "access": str(token),
                "refresh": str(refresh_token),
                "role": role
            }, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class CurrentUserAPIView(APIView):
    """
    get:
        Retrieve information about the currently authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = getattr(user, "profile", None)

        data = {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "accountType": user.account_type,
            "is_active": user.is_active,
            "profile": {
                "name": getattr(profile, "name", None),
                "surname": getattr(profile, "surname", None),
                "age": getattr(profile, "age", None),
                "avatarUrl": profile.avatar.url if getattr(profile, "avatar", None) else None,
            } if profile else None
        }
        return Response(data)
