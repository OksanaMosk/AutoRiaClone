from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the home page!")
urlpatterns = [
    path('', home),
    path('api/cars/', include('apps.car.urls')),
    path('api/car_shops/', include('apps.car_shops.urls')),
    path('api/auth/', include('apps.auth.urls')),
    path('api/users/', include('apps.user.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

