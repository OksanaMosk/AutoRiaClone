from django.db import models


class carShopModel(models.Model):
    class Meta:
        db_table = 'car_shops'
    name=models.CharField(max_length=30)
