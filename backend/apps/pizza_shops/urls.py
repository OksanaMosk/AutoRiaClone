from django.urls import path

from apps.pizza_shops.views import PizzaShopAddPizzaView, PizzaShopsListCreateView

urlpatterns = [
    path('', PizzaShopsListCreateView.as_view()),
    path('/<int:pk>/pizzas', PizzaShopAddPizzaView.as_view()),
]