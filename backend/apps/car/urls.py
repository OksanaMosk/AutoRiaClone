from django.urls import path

from .api_views import car_constants
from .views import carListCreateView, carRetrieveUpdateDestroyView, CarPhotoDeleteView, CarPhotoCreateView, \
    CarStatsView, CarAveragePriceByRegionView, CarAveragePriceCountryView, ExchangeRateView,\
    CarUserListView

urlpatterns = [
path('', carListCreateView.as_view()),
path('<int:pk>', carRetrieveUpdateDestroyView.as_view()),
path('<int:car_id>/photos/', CarPhotoCreateView.as_view(), name='car-add-photo'),
path('photos/<int:pk>/', CarPhotoDeleteView.as_view(), name='car-delete-photo'),
path('<int:car_id>/stats/', CarStatsView.as_view(), name='car-stats'),
path('stats/average/', CarAveragePriceByRegionView.as_view(), name='car-average-region'),
path('stats/average-country/', CarAveragePriceCountryView.as_view(), name='car-average-country'),
path('exchange-rates/', ExchangeRateView.as_view(), name='exchange-rates'),
path('constants/', car_constants, name='car-constants'),
]
