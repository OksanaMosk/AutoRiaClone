from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from django.http import HttpResponse
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.permissions import AllowAny

schema_view = get_schema_view(
    openapi.Info(
        title="AutoRia Clone",
        default_version='v1',
        description="AutoRia Clone",
        contact=openapi.Contact(email="ksenjap124@gmail.com"),
    ),
    public=True,
    permission_classes=[AllowAny],

)


def home(request):
    return HttpResponse("Welcome to the home page!")
urlpatterns = [
    path('', home),
    path('api/cars/', include('apps.car.urls')),
    path('api/auth/', include('apps.auth.urls')),
    path('api/users/', include('apps.user.urls')),
    path('api/dog/', schema_view.with_ui('swagger'), name='schema-swagger'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

