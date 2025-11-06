from rest_framework import serializers

from .models import carModel


class carSerializer(serializers.ModelSerializer):
    class Meta:
        model = carModel
        fields = ('id', 'name', 'price', 'size', 'ingredients', 'time_prepared', 'day', 'created_at', 'updated_at')

    def create(self, validated_data):
        return carModel.objects.create(**validated_data, car_shop_id=1)

        # extra_kwargs = {
        #     "car_shop_id": {"read_only": True},
        # }
    # def validate_price(self, price):
    #     if price <= 0:
    #         raise serializers.ValidationError('Price must be greater than 0')
    #     return price
    #
    # def validate(self, attrs):
    #     price = attrs.get('price')
    #     size = attrs.get('size')
    #     if price == size:
    #         raise serializers.ValidationError('Price cannot be equal to size')
    #     return attrs

class carPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = carModel
        fields=('photo',)
