
from rest_framework.generics import RetrieveUpdateDestroyAPIView, UpdateAPIView, ListCreateAPIView
from rest_framework.permissions import AllowAny

from .filter import carFilter
from .models import carModel
from .serializers import carPhotoSerializer, carSerializer


class carListCreateView(ListCreateAPIView):
    serializer_class = carSerializer
    queryset = carModel.objects.all()
    filterset_class = carFilter
    permission_classes =(AllowAny,)


class carRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = carSerializer
    queryset = carModel.objects.all()
    http_method_names = ['get', 'put', 'patch', 'delete']

class carAddPhotoView(UpdateAPIView):
    serializer_class = carPhotoSerializer
    queryset = carModel.objects.all()
    http_method_names = ['put']
    permission_classes = (AllowAny,)

    def perform_update(self, serializer):
        car= self.get_object()
        car.photo.delete()
        super().perform_update(serializer)
