from django.urls import path
from  channels.routing import URLRouter
from apps.chat.routing import websocket_urlpatterns as chat_routing
from apps.car.routing import websocket_urlpatterns as car_routing

websocket_urlpatterns = [
    path('api/chat/', URLRouter(chat_routing)),
    path('api/cars/', URLRouter(car_routing))
]
