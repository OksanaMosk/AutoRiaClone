from django.urls import path

from .views import carAddPhotoView, carListCreateView, carRetrieveUpdateDestroyView

urlpatterns = [
path('', carListCreateView.as_view()),
path('/<int:pk>', carRetrieveUpdateDestroyView.as_view()),
path('/<int:pk>/photos', carAddPhotoView.as_view()),
]
