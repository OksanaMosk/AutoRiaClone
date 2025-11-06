from rest_framework import status
from rest_framework.generics import GenericAPIView, ListCreateAPIView
from rest_framework.response import Response

from apps.car.serializers import carSerializer
from apps.car_shops.models import carShopModel
from apps.car_shops.serializers import carShopSerializer


class carShopsListCreateView(ListCreateAPIView):
    serializer_class = carShopSerializer
    queryset = carShopModel.objects.all()

class carShopAddcarView(GenericAPIView):
    queryset = carShopModel.objects.all()
    def post(self, request, *args, **kwargs):
        car_shop=self.get_object()
        data=self.request.data
        serializer = carSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(car_shop=car_shop)
        shop_serializer = carShopSerializer(car_shop)
        return Response(shop_serializer.data,status=status.HTTP_201_CREATED)

