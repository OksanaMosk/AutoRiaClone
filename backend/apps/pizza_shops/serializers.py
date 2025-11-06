from rest_framework import serializers

from ..pizza.serializers import PizzaSerializer
from ..pizza_shops.models import PizzaShopModel


class PizzaShopSerializer(serializers.ModelSerializer):
    pizzas=PizzaSerializer(many=True, read_only=True)
    class Meta:
        model=PizzaShopModel
        fields=('id','name','pizzas')

