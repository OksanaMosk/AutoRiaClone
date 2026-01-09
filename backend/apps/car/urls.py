from django.urls import path

from .views import (
    CarAveragePriceByRegionView,
    CarAveragePriceCountryView,
    CarListCreateView,
    CarPhotoCreateView,
    CarPhotoDeleteView,
    CarRetrieveUpdateDestroyView,
    CarStatsView,
    ExchangeRateView,
    car_constants,
)

urlpatterns = [
path('', CarListCreateView.as_view()),
path('<int:pk>/', CarRetrieveUpdateDestroyView.as_view()),
path('<int:car_id>/photos/', CarPhotoCreateView.as_view(), name='car_add_photo'),
path('photos/<int:pk>/', CarPhotoDeleteView.as_view(), name='car_delete_photo'),
path('<int:car_id>/stats/', CarStatsView.as_view(), name='car_stats'),
path('stats/average/', CarAveragePriceByRegionView.as_view(), name='car_average_region'),
path('stats/average-country/', CarAveragePriceCountryView.as_view(), name='car_average_country'),
path('exchange-rates/', ExchangeRateView.as_view(), name='exchange_rates'),
path('constants/', car_constants, name='car_constants'),
]
