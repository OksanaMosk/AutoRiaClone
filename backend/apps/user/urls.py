from django.urls import path
from apps.user.views import (
    BlockUserAPIView,
    SendEmailTestAPIView,
    UnblockUserAPIView,
    UserListCreateAPIView,
    ChangeUserRoleAPIView
)

urlpatterns = [
    path('', UserListCreateAPIView.as_view(), name='user_list_create'),
    path('<int:pk>/block/', BlockUserAPIView.as_view(), name='user_block'),
    path('<int:pk>/unblock/', UnblockUserAPIView.as_view(), name='user_unblock'),
    path('change-role/<int:user_id>/', ChangeUserRoleAPIView.as_view(), name='change-user-role'),
    path('test/', SendEmailTestAPIView.as_view(), name='test_email'),
]
