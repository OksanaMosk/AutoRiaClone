from datetime import date
from decimal import Decimal

from rest_framework import serializers

from brands_models import BRANDS
from locations import LOCATION_CHOICES

from .models import CarModel, CarPhoto


class CarPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarPhoto
        fields = ('id', 'photo', 'car')


class CarSerializer(serializers.ModelSerializer):
    photos = CarPhotoSerializer(many=True, read_only=True)
    year = serializers.IntegerField(min_value=1980, max_value=date.today().year, required=True)
    mileage = serializers.IntegerField(min_value=0, required=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('0.00'), required=True)
    max_speed = serializers.IntegerField(min_value=0, required=True)
    seats_count = serializers.IntegerField(min_value=1, required=True)
    engine_volume = serializers.DecimalField(max_digits=4, decimal_places=1, min_value=Decimal('0.1'), required=True)
    brand = serializers.ChoiceField(choices=BRANDS, required=True)
    condition = serializers.ChoiceField(choices=[('new', 'New'), ('used', 'Used')], required=True)
    fuel_type = serializers.ChoiceField(choices=[('diesel', 'Diesel'),
                                                 ('petrol', 'Petrol'),
                                                 ('electric', 'Electric'),
                                                 ('hybrid', 'Hybrid')], required=True)
    location = serializers.ChoiceField(choices=LOCATION_CHOICES, required=True)
    has_air_conditioner = serializers.BooleanField(required=True)
    description = serializers.CharField(max_length=500, required=True, allow_blank=True)

    class Meta:
        model = CarModel
        fields = (
            'id', 'brand', 'model', 'year', 'mileage', 'price', 'currency',
            'condition', 'max_speed', 'seats_count', 'engine_volume',
            'has_air_conditioner', 'fuel_type', 'location', 'description',
            'status', 'views', 'daily_views', 'weekly_views', 'monthly_views',
            'created_at', 'updated_at', 'edit_attempts', 'photos', 'seller_id'
        )

    def validate(self, attrs):
        invalid = False
        if 'year' in attrs and (attrs['year'] < 1980 or attrs['year'] > date.today().year):
            invalid = True
        if 'mileage' in attrs and attrs['mileage'] < 0:
            invalid = True
        if 'price' in attrs and attrs['price'] < 0:
            invalid = True
        if invalid:
            raise serializers.ValidationError(
                'You must provide valid values for the car.'
            )
        return attrs


class CarStatsSerializer(serializers.Serializer):
    total_views = serializers.IntegerField()
    daily_views = serializers.IntegerField()
    weekly_views = serializers.IntegerField()
    monthly_views = serializers.IntegerField()


class CarAveragePriceSerializer(serializers.Serializer):
    region = serializers.CharField(required=True)
    average_price = serializers.DictField(child=serializers.FloatField())

