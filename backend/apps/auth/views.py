from django.contrib.auth import get_user_model, authenticate
from rest_framework.generics import  get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken
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


UserModel = get_user_model()

class ActivateUserView(APIView):
    permission_classes = (AllowAny,)
    def activate_user(self, token):
        if not token:
            return Response(
                {'detail': 'Token is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = JWTService.verify_token(token, ActivateToken)
            if user.is_active:
                return Response(
                    {'detail': 'Account already activated.'},
                    status=status.HTTP_200_OK
                )
            user.is_active = True
            user.save()
            serializer = UserSerializer(user)
            # logger.info(f"User {user.email} activated successfully.")
            return Response(
                {
                    'detail': 'Account activated successfully!',
                    'user': serializer.data
                },
                status=status.HTTP_200_OK
            )
        except JWTException:
            return Response(
                {'detail': 'Invalid or expired token.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except NotFound:
            return Response(
                {'detail': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:

            return Response(
                {'detail': 'Something went wrong.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    def patch(self, request, *args, **kwargs):
        token = kwargs.get('token')
        return self.activate_user(token)

    def get(self, request, *args, **kwargs):
        token = kwargs.get('token')
        return redirect(f"http://localhost:3000/activate/{token}/")

class RecoveryRequestView(GenericAPIView):
    permission_classes = (AllowAny,)
    def post(self, *args, **kwargs):
        data=self.request.data
        serializer = EmailSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user=get_object_or_404(UserModel,  email=serializer.data['email'])
        EmailService.recovery(user)
        return Response({'details': 'Link send to email'}, status.HTTP_200_OK)


class RecoveryPasswordView(GenericAPIView):
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

    # def get(self, request, *args, **kwargs):
    #     token = kwargs.get("token")
    #     frontend_url = f"http://localhost:3000/"
    #     return redirect(frontend_url)


class SocketTokenView(GenericAPIView):
    permission_classes = (IsAuthenticated,)
    def get(self, *args, **kwargs):
        token=JWTService.create_token(user=self.request.user,token_class=SocketToken)
        return Response({'token': str(token)}, status.HTTP_200_OK)


class RegisterAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(is_active=True)
        return Response(UserSerializer(user).data, status.HTTP_201_CREATED)

class LoginAPIView(GenericAPIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        username = request.data.get('username') or request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token = JWTService.create_token(user=user, token_class=AccessToken)
            return Response({"access": str(token)}, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class CurrentUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        data = {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "accountType": user.account_type,
            "is_active": user.is_active,
            "profile": {
                "name": user.profile.name,
                "surname": user.profile.surname,
                "age": user.profile.age,
                "avatarUrl": user.profile.avatar.url if user.profile.avatar else None,
            }
        }

        return Response(data)
