from typing import Any

from django.core import validators as V
from django.db import models
from django.db.models import JSONField

from core.enums.regex_enum import RegexEnum
from core.models import BaseModel
from core.services.file_service import upload_pizza_photo

from ..pizza_shops.models import PizzaShopModel
from .managers import PizzaManager


class DayChoice(models.TextChoices):
    MONDAY = 'Monday'
    TUESDAY = 'Tuesday'
    WEDNESDAY = 'Wednesday'
    THURSDAY = 'Thursday'
    FRIDAY = 'Friday'
    SATURDAY = 'Saturday'
    SUNDAY = 'Sunday'
class PizzaModel(BaseModel):
    class Meta:
        db_table = 'pizza'
    name = models.CharField(max_length=30,validators=[V.RegexValidator(RegexEnum.NAME.pattern, RegexEnum.NAME.msg)])
    price = models.FloatField()
    size = models.IntegerField(validators=[V.MinValueValidator(1), V.MaxValueValidator(100)])
    ingredients: JSONField | Any =models.JSONField(default=list)
    day = models.CharField(max_length=9, choices=DayChoice.choices)
    time_prepared = models.IntegerField()
    pizza_shop=models.ForeignKey(PizzaShopModel, on_delete=models.CASCADE, related_name='pizzas')
    photo=models.ImageField(upload_to=upload_pizza_photo, blank=True)
    objects = PizzaManager()