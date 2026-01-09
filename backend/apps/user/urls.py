from django.urls import path

from apps.car.views import CarUserListView
from apps.user.views import (
    ChangeUserAccountTypeAPIView,
    ChangeUserDealershipAPIView,
    ChangeUserRoleAPIView,
    DeleteUserAPIView,
    UpdateUserActiveAPIView,
    UpdateUserAPIView,
    UserListCreateAPIView,
)

urlpatterns = [
    path('', UserListCreateAPIView.as_view(), name='user_list_create'),
    path('<int:pk>/active/', UpdateUserActiveAPIView.as_view(), name='user_active'),
    path('change-role/<int:user_id>/', ChangeUserRoleAPIView.as_view(), name='change_user_role'),
    path('change-account-type/<int:user_id>/', ChangeUserAccountTypeAPIView.as_view(), name='change_user_account_type'),
    path('<int:pk>/update/', UpdateUserAPIView.as_view(), name='user_update'),
    path('<int:pk>/delete/', DeleteUserAPIView.as_view(), name='user_delete'),
    path('<int:user_id>/change-dealership/', ChangeUserDealershipAPIView.as_view(), name='change_user_dealership'),
    path('<int:user_id>/cars/', CarUserListView.as_view(), name='user_car_list'),
]
