from django.urls import path

from .views import carListCreateView, carRetrieveUpdateDestroyView, CarPhotoDeleteView, \
    CarPhotoCreateView, CarStatsView, CarAveragePriceByRegionView, CarAveragePriceCountryView

urlpatterns = [
path('', carListCreateView.as_view()),
path('<int:pk>', carRetrieveUpdateDestroyView.as_view()),
path('<int:car_id>/photos/', CarPhotoCreateView.as_view(), name='car-add-photo'),
path('photos/<int:pk>/', CarPhotoDeleteView.as_view(), name='car-delete-photo'),
path('<int:car_id>/stats/', CarStatsView.as_view(), name='car-stats'),
path('stats/average/', CarAveragePriceByRegionView.as_view(), name='car-average-region'),
path('stats/average-country/', CarAveragePriceCountryView.as_view(), name='car-average-country'),
]
