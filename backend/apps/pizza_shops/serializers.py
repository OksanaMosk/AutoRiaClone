from rest_framework import serializers

from ..car.serializers import carSerializer
from ..car_shops.models import carShopModel


class carShopSerializer(serializers.ModelSerializer):
    cars=carSerializer(many=True, read_only=True)
    class Meta:
        model=carShopModel
        fields=('id','name','cars')

