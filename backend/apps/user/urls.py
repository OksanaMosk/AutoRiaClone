from django.urls import path

from apps.car.views import CarUserListView
from apps.user.views import (
    BlockUserAPIView,
    SendEmailTestAPIView,
    UnblockUserAPIView,
    UserListCreateAPIView,
    ChangeUserRoleAPIView, ChangeUserAccountTypeAPIView, UpdateUserAPIView, DeleteUserAPIView,
    ChangeUserDealershipAPIView, UserFilterSortAPIView
)

urlpatterns = [
    path('', UserListCreateAPIView.as_view(), name='user_list_create'),
    path('<int:pk>/block/', BlockUserAPIView.as_view(), name='user_block'),
    path('<int:pk>/unblock/', UnblockUserAPIView.as_view(), name='user_unblock'),
    path('change-role/<int:user_id>/', ChangeUserRoleAPIView.as_view(), name='change-user-role'),
    path('change-account-type/<int:user_id>/', ChangeUserAccountTypeAPIView.as_view(), name='change-user-account-type'),
    path('<int:pk>/update/', UpdateUserAPIView.as_view(), name='user_update'),
    path('<int:pk>/delete/', DeleteUserAPIView.as_view(), name='user_delete'),
    path('<int:user_id>/change-dealership/', ChangeUserDealershipAPIView.as_view(), name='change-user-dealership'),
    path('test/', SendEmailTestAPIView.as_view(), name='test_email'),
    path('filter-sort/', UserFilterSortAPIView.as_view(), name='filter_sort'),
    path('<int:user_id>/cars/', CarUserListView.as_view(), name='user_car_list'),
]
