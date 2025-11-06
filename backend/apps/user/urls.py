from django.urls import path

from apps.user.views import BlockUserView, SendEmailTestView, UnBlockUserView, UserListCreateApiView, UserToAdminView

urlpatterns = [
    path('', UserListCreateApiView.as_view(), name='user_list_create'),
    path('/<int:pk>/block', BlockUserView.as_view(), name='user_block'),
    path('/<int:pk>/unblock', UnBlockUserView.as_view(), name='user_unblock'),
    path('/<int:pk>/to_admin',UserToAdminView.as_view(), name='user_admin'),
    path('/test', SendEmailTestView.as_view(), name='test_email'),
]