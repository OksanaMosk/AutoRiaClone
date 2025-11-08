import os

from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.user.serializers import UserSerializer
from apps.user.permissions import IsAdmin

UserModel = get_user_model()

class UserListCreateAPIView(ListCreateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # реєстрація доступна для всіх

class BlockUserAPIView(RetrieveUpdateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
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
    permission_classes = [IsAdmin]
    lookup_field = "pk"

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        if not user.is_active:
            user.is_active = True
            user.save()
        return Response(self.get_serializer(user).data, status=status.HTTP_200_OK)

class PromoteUserToAdminAPIView(RetrieveUpdateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    lookup_field = "pk"

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        if not user.is_staff:
            user.is_staff = True
            user.is_superuser = True
            user.save()
        return Response(self.get_serializer(user).data, status=status.HTTP_200_OK)

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






# import os
#
# from django.contrib.auth import get_user_model
# from django.core.mail import EmailMultiAlternatives
# from django.template.loader import get_template
#
# from rest_framework import status
# from rest_framework.generics import GenericAPIView, ListCreateAPIView
# from rest_framework.permissions import AllowAny
# from rest_framework.response import Response
#
# from apps.user.serializers import UserSerializer
#
# UserModel=get_user_model()
#
# class UserListCreateApiView(ListCreateAPIView):
#     queryset = UserModel.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]
#
# class BlockUserView(GenericAPIView):
#
#     def get_queryset(self):
#         return UserModel.objects.all().exclude(id=self.request.user.id)
#
#     def patch(self, *args, **kwargs):
#         user=self.get_object()
#         if user.is_active:
#             user.is_active=False
#             user.save()
#         serializer=UserSerializer(user)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#
# class UnBlockUserView(GenericAPIView):
#     def get_queryset(self):
#         return UserModel.objects.all().exclude(id=self.request.user.id)
#
#     def patch(self, *args, **kwargs):
#         user=self.get_object()
#         if not user.is_active:
#             user.is_active=True
#             user.save()
#         serializer=UserSerializer(user)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#
# class UserToAdminView(ListCreateAPIView):
#     def get_queryset(self):
#         return UserModel.objects.all().exclude(id=self.request.user.id)
#
#     def patch(self, *args, **kwargs):
#         user=self.get_object()
#         if not user.is_staff:
#             user.is_staff=True
#             user.save()
#         serializer=UserSerializer(user)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#
# class SendEmailTestView(GenericAPIView):
#     permission_classes = (AllowAny,)
#     def get(self,*args,**kwargs):
#         template=get_template('test_email.html')
#         html_content=template.render({'name':'DJANGO'})
#         msg=EmailMultiAlternatives(
#             subject='Test Email',
#             from_email=os.environ.get('EMAIL_HOST_USER'),
#             to=['codyaliev@gmail.com'],
#         )
#         msg.attach_alternative(html_content, "text/html")
#         msg.send()
#         return Response({'message':'Email send!!!!'}, status=status.HTTP_200_OK)
