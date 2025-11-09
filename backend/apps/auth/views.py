
from django.contrib.auth import get_user_model, authenticate

from rest_framework.generics import GenericAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken

from core.services.email_service import EmailService
from core.services.jwt_service import RecoveryToken, SocketToken

from apps.auth.serializers import EmailSerializer, PasswordSerializer
from apps.user.serializers import UserSerializer

from django.shortcuts import redirect
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from core.services.jwt_service import JWTService, ActivateToken
from core.exceptions.jwt_exception import JWTException

import logging

UserModel = get_user_model()


logger = logging.getLogger(__name__)


class ActivateUserView(GenericAPIView):
    permission_classes = (AllowAny,)

    def patch(self, request, *args, **kwargs):
        token = kwargs.get('token')

        try:
            # Перевірка токену
            user = JWTService.verify_token(token, ActivateToken)
            logger.info(f"User found: {user.email}")

            if user.is_active:
                logger.info(f"User {user.email} is already activated.")
                return Response({'detail': 'Account is already activated.'}, status=status.HTTP_200_OK)

            # Активуємо користувача
            user.is_active = True
            user.save()

            # Серіалізація користувача після активації
            serializer = UserSerializer(user)

            # Логуємо успішну активацію
            logger.info(f"User {user.email} activated successfully.")

            # Повертаємо серіалізовані дані користувача після активації
            return Response(serializer.data, status=status.HTTP_200_OK)

        except JWTException as e:
            logger.error(f"Invalid or expired token: {e}")  # Лог для помилки токену
            return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Unexpected error: {e}")  # Лог для інших помилок
            return Response({'detail': 'Something went wrong.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




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
    def post(self, *args, **kwargs):
        data=self.request.data
        serializer = PasswordSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        token=kwargs['token']
        user=JWTService.verify_token(token,RecoveryToken)
        user.set_password(serializer.data['password'])
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)

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


# class ActivateUserView(GenericAPIView):
#     permission_classes = (AllowAny,)
#
#     def patch(self, request, *args, **kwargs):
#         token = kwargs['token']
#
#
#         try:
#             # Перевірка токену
#             user = JWTService.verify_token(token, ActivateToken)
#             logger.info(f"User found: {user.email}")
#
#             if user.is_active:
#                 logger.info(f"User {user.email} is already activated.")
#                 return Response({'detail': 'Account is already activated.'}, status=status.HTTP_200_OK)
#
#             # Активуємо користувача
#             user.is_active = True
#             user.save()
#
#             # Серіалізація користувача після активації
#             serializer = UserSerializer(user)
#
#             # Логуємо успішну активацію
#             logger.info(f"User {user.email} activated successfully.")
#
#             # Перевіряємо роль користувача та редіректимо на відповідну сторінку
#             if user.role == 'seller':
#                 logger.info(f"Redirecting to seller dashboard for {user.email}")
#                 return redirect(f"http://localhost:3000/seller?activated=true")
#             elif user.role == 'buyer':
#                 logger.info(f"Redirecting to buyer dashboard for {user.email}")
#                 return redirect(f"http://localhost:3000/buyer?activated=true")
#             else:
#                 logger.info(f"Redirecting to default dashboard for {user.email}")
#                 return redirect(f"http://localhost:3000?activated=true")
#
#
#
#         except JWTException as e:
#             logger.error(f"Invalid or expired token: {e}")  # Лог для помилки токену
#             return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)
#
#         except Exception as e:
#             logger.error(f"Unexpected error: {e}")  # Лог для інших помилок
#             return Response({'detail': 'Something went wrong.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
