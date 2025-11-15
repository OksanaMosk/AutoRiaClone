
from rest_framework import serializers
from .models import carModel, CarPhoto

class CarPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarPhoto
        fields = ('id', 'photo', 'car')

class CarSerializer(serializers.ModelSerializer):
    photos = CarPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = carModel
        fields = (
            'id', 'brand', 'model', 'year', 'mileage', 'price', 'currency',
            'condition', 'max_speed', 'seats_count', 'engine_volume',
            'has_air_conditioner', 'fuel_type', 'location', 'description',
            'status', 'views', 'daily_views', 'weekly_views', 'monthly_views',
            'created_at', 'updated_at', 'edit_attempts', 'photos'
        )

class CarStatsSerializer(serializers.Serializer):
    total_views = serializers.IntegerField()
    daily_views = serializers.IntegerField()
    weekly_views = serializers.IntegerField()
    monthly_views = serializers.IntegerField()

class CarAveragePriceSerializer(serializers.Serializer):
    region = serializers.CharField(required=False)
    average_price = serializers.DictField(child=serializers.FloatField())

