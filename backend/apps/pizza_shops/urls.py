from django.urls import path

from apps.car_shops.views import carShopAddcarView, carShopsListCreateView

urlpatterns = [
    path('', carShopsListCreateView.as_view()),
    path('/<int:pk>/cars', carShopAddcarView.as_view()),
]
