from django.contrib.auth import get_user_model
from django.db import models

from rest_framework.exceptions import ValidationError

from brands_models import BRANDS
from core.models import BaseModel
from core.services.file_service import upload_car_photo
from locations import LOCATION_CHOICES

from apps.car.services.car_service import notify_manager
from apps.car.services.exchange_service import update_car_prices


class CarModel(BaseModel):
    class Meta:
        db_table = 'car'

    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"

    seller = models.ForeignKey(get_user_model(), related_name='cars', on_delete=models.CASCADE, default=1)
    brand = models.CharField(max_length=50, choices=[(b, b) for b in BRANDS], default=BRANDS[0])
    model = models.CharField(max_length=50, default='')
    photo = models.ImageField(upload_to=upload_car_photo, blank=True)
    year = models.PositiveIntegerField()
    mileage = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=[('USD', 'USD'), ('EUR', 'EUR'), ('UAH', 'UAH')])
    price_usd = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=1)
    price_eur = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=1)
    condition = models.CharField(max_length=10, choices=[('new', 'New'), ('used', 'Used')])
    max_speed = models.PositiveIntegerField(help_text='Max speed km/h')
    seats_count = models.PositiveIntegerField(help_text='Number of seats')
    engine_volume = models.DecimalField(max_digits=4, decimal_places=1, help_text='Engine vol/l')
    has_air_conditioner = models.BooleanField(default=False, help_text='Conditioning')
    fuel_type = models.CharField(
        max_length=20,
        choices=[('diesel', 'Diesel'), ('petrol', 'Petrol'), ('electric', 'Electric'), ('hybrid', 'Hybrid')],
        help_text='Fuel type'
    )
    location = models.CharField(max_length=50, choices=LOCATION_CHOICES)
    description = models.TextField(max_length=500, default="")
    status = models.CharField(
        max_length=50,
        choices=[('active', 'Active'), ('inactive', 'Inactive'), ('pending', 'Pending')],
        default='pending'
    )
    views = models.PositiveIntegerField(default=0)
    daily_views = models.PositiveIntegerField(default=0)
    weekly_views = models.PositiveIntegerField(default=0)
    monthly_views = models.PositiveIntegerField(default=0)
    edit_attempts = models.PositiveIntegerField(default=0)
    exchange_rate_id = models.CharField(max_length=50, help_text='ID or source of the exchange rate', default="", blank=True,
    null=True)
    last_exchange_update = models.DateField(null=True, blank=True, default=0)

    def update_prices(self):
        update_car_prices(self)

    def add_photo(self, photo_file):
        if self.photos.count() >= 5:
            raise ValidationError('Cannot add more than 5 photos per car.')
        CarPhoto.objects.create(car=self, photo=photo_file)

    def get_photos(self):
        return self.photos.all()

    def notify_manager(self):
        notify_manager(self)

    def save(self, *args, **kwargs):
        self.update_prices()
        self.full_clean()
        super().save(*args, **kwargs)


class CarPhoto(models.Model):
    car = models.ForeignKey(CarModel, related_name='photos', on_delete=models.CASCADE)
    photo = models.ImageField(upload_to=upload_car_photo)

    class Meta:
        db_table = 'car_photos'

