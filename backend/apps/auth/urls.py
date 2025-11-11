from django.urls import path, re_path

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.auth.views import ActivateUserView, CurrentUserAPIView, RecoveryPasswordView, RecoveryRequestView, SocketTokenView,RegisterAPIView, LoginAPIView


urlpatterns = [
    path('', TokenObtainPairView.as_view(), name='auth_login'),
    path('refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('socket/', SocketTokenView.as_view(), name='socket-token'),
    re_path(r'^activate/(?P<token>[\w\.-]+)/$', ActivateUserView.as_view(), name='activate-user'),
    path('recovery/', RecoveryRequestView.as_view(), name='recovery-request'),
    re_path(r'^recovery/(?P<token>.+)/$', RecoveryPasswordView.as_view(), name='recovery-password'),
    path('me/', CurrentUserAPIView.as_view(), name='current_user'),
]
