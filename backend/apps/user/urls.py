from django.urls import path
from apps.user.views import (
    BlockUserAPIView,
    SendEmailTestAPIView,
    UnblockUserAPIView,
    UserListCreateAPIView,
    PromoteUserToAdminAPIView
)

urlpatterns = [
    path('', UserListCreateAPIView.as_view(), name='user_list_create'),
    path('<int:pk>/block/', BlockUserAPIView.as_view(), name='user_block'),
    path('<int:pk>/unblock/', UnblockUserAPIView.as_view(), name='user_unblock'),
    path('<int:pk>/to_admin/', PromoteUserToAdminAPIView.as_view(), name='user_promote_admin'),
    path('test/', SendEmailTestAPIView.as_view(), name='test_email'),
]
