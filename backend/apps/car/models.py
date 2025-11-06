from typing import Any

from django.core import validators as V
from django.db import models
from django.db.models import JSONField

from core.enums.regex_enum import RegexEnum
from core.models import BaseModel
from core.services.file_service import upload_car_photo

from ..car_shops.models import carShopModel
from .managers import carManager


class DayChoice(models.TextChoices):
    MONDAY = 'Monday'
    TUESDAY = 'Tuesday'
    WEDNESDAY = 'Wednesday'
    THURSDAY = 'Thursday'
    FRIDAY = 'Friday'
    SATURDAY = 'Saturday'
    SUNDAY = 'Sunday'
class carModel(BaseModel):
    class Meta:
        db_table = 'car'
    name = models.CharField(max_length=30,validators=[V.RegexValidator(RegexEnum.NAME.pattern, RegexEnum.NAME.msg)])
    price = models.FloatField()
    size = models.IntegerField(validators=[V.MinValueValidator(1), V.MaxValueValidator(100)])
    ingredients: JSONField | Any =models.JSONField(default=list)
    day = models.CharField(max_length=9, choices=DayChoice.choices)
    time_prepared = models.IntegerField()
    car_shop=models.ForeignKey(carShopModel, on_delete=models.CASCADE, related_name='cars')
    photo=models.ImageField(upload_to=upload_car_photo, blank=True)
    objects = carManager()
