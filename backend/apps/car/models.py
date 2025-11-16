import datetime
from decimal import Decimal

from better_profanity import profanity
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.db import models
from rest_framework.exceptions import ValidationError
import requests
from brands_models import BRANDS, MODELS_BY_BRAND
from core.services.file_service import upload_car_photo
from locations import LOCATION_CHOICES


def get_private_bank_exchange_rate():
    response = requests.get("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5")
    response.raise_for_status()
    data = response.json()

    usd_rate = next((item for item in data if item['ccy'] == 'USD'), None)
    eur_rate = next((item for item in data if item['ccy'] == 'EUR'), None)

    if not usd_rate or not eur_rate:
        raise ValidationError("Failed to retrieve USD or EUR exchange rate from PrivatBank.")

    return {
        'USD': float(usd_rate['buy']),
        'EUR': float(eur_rate['buy']),
    }

class carModel(models.Model):
    class Meta:
        db_table = 'car'

    def __str__(self):
        return f"{self.brand} {self.model} ({self.year})"

    seller = models.ForeignKey(get_user_model(), related_name='cars', on_delete=models.CASCADE, default=1)
    brand = models.CharField(max_length=50, choices=[(b, b) for b in BRANDS], default=BRANDS[0])
    model = models.CharField(max_length=50, default='')
    photo = models.ImageField(upload_to=upload_car_photo, blank=True)
    year = models.PositiveIntegerField(default=1990)
    mileage = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, choices=[('USD', 'USD'), ('EUR', 'EUR'), ('UAH', 'UAH')])
    price_usd = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=1)
    price_eur = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=1)
    condition = models.CharField(max_length=10, choices=[('new', 'New'), ('used', 'Used')])
    max_speed = models.PositiveIntegerField(help_text="Max speed km/h", default=1)
    seats_count = models.PositiveIntegerField(help_text="Number of seats", default=1)
    engine_volume = models.DecimalField(max_digits=3, decimal_places=1, help_text="Engine vol/l", default=1)
    has_air_conditioner = models.BooleanField(default=False, help_text="Conditioning")
    fuel_type = models.CharField(
        max_length=20,
        choices=[('diesel', 'Diesel'), ('petrol', 'Petrol'), ('electric', 'Electric'), ('hybrid', 'Hybrid')],
        help_text="Fuel type"
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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    edit_attempts = models.PositiveIntegerField(default=0)
    exchange_rate_id = models.CharField(max_length=50, help_text="ID or source of the exchange rate", default="")
    last_exchange_update = models.DateField(null=True, blank=True, default=0)

    def update_prices(self, rates=None):
        current_date = datetime.date.today()
        if self.last_exchange_update == current_date:
            return

        if rates is None:
            rates = get_private_bank_exchange_rate()

        self.exchange_rate_id = f"Privatbank_{current_date}"

        if self.currency == 'USD':
            self.price_usd = Decimal(self.price).quantize(Decimal('0.01'))
            self.price_eur = (Decimal(self.price) * Decimal(rates['EUR']) / Decimal(rates['USD'])).quantize(
                Decimal('0.01'))
        elif self.currency == 'EUR':
            self.price_eur = Decimal(self.price).quantize(Decimal('0.01'))
            self.price_usd = (Decimal(self.price) * Decimal(rates['USD']) / Decimal(rates['EUR'])).quantize(
                Decimal('0.01'))
        else:
            self.price_usd = (Decimal(self.price) / Decimal(rates['USD'])).quantize(Decimal('0.01'))
            self.price_eur = (Decimal(self.price) / Decimal(rates['EUR'])).quantize(Decimal('0.01'))

        self.last_exchange_update = current_date



    def add_photo(self, photo_file):
        if self.photos.count() >= 5:
            raise ValidationError("Cannot add more than 5 photos per car.")
        CarPhoto.objects.create(car=self, photo=photo_file)

    def get_photos(self):
        return self.photos.all()

    def clean(self):
        if profanity.contains_profanity(self.description):
            self.status = 'pending'
            if self.edit_attempts >= 3:
                self.status = 'inactive'
                self.notify_manager()
                raise ValidationError("You have failed to edit your description 3 times. The ad has been deactivated.")
            else:
                self.edit_attempts += 1
                raise ValidationError("Description contains prohibited words. Please edit.")
        else:
            if not hasattr(self, '_status_from_request'):
                self.status = 'active'

    def notify_manager(self):
        send_mail(
            subject="Car listing needs attention",
            message=f"The car listing with ID {self.id} has failed the profanity check 3 times.",
            from_email="no-reply@platform.com",
            recipient_list=["manager@example.com"]
        )

    def save(self, *args, **kwargs):
        self.update_prices()
        self.full_clean()
        super().save(*args, **kwargs)

class CarPhoto(models.Model):
    car = models.ForeignKey(carModel, related_name="photos", on_delete=models.CASCADE)
    photo = models.ImageField(upload_to=upload_car_photo)

    class Meta:
        db_table = "car_photos"
