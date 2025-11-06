from django.urls import path

from apps.car.consumer import carConsumer

websocket_urlpatterns = [
    path('', carConsumer.as_asgi()),
]
