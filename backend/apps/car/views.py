from django.db.models import Avg
from djangochannelsrestframework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from core.pagination import PagePagination
from .filter import CarFilter
from .models import carModel
from .serializers import CarPhotoSerializer, CarSerializer, CarAveragePriceSerializer, CarStatsSerializer
from rest_framework.generics import CreateAPIView, DestroyAPIView
from .models import CarPhoto
from ..user.permissions import IsSeller, IsAdmin


class carListCreateView(ListCreateAPIView):
    serializer_class = CarSerializer
    queryset = carModel.objects.all()
    filterset_class = CarFilter
    permission_classes =(IsAuthenticated & (IsSeller | IsAdmin))
    pagination_class = PagePagination

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated:
            raise ValidationError("Authentication required")

        if getattr(user, "account_type", None) == "basic" and carModel.objects.filter(seller=user).exists():
            raise ValidationError("Sorry, update account to Premium")

        serializer.save(seller=user)

class carRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = CarSerializer
    queryset = carModel.objects.all()
    http_method_names = ['get', 'put', 'patch', 'delete']

class CarPhotoCreateView(CreateAPIView):
    serializer_class = CarPhotoSerializer
    permission_classes = (AllowAny,)

    def perform_create(self, serializer):
        car_id = self.kwargs['car_id']
        serializer.save(car_id=car_id)


class CarPhotoDeleteView(DestroyAPIView):
    serializer_class = CarPhotoSerializer
    queryset = CarPhoto.objects.all()
    permission_classes = (AllowAny,)

class CarStatsView(APIView):
    def get(self, request, car_id):
        user = request.user
        if not user.is_authenticated or user.account_type != 'premium':
            return Response({"detail": "Premium account required"}, status=status.HTTP_403_FORBIDDEN)

        try:
            car = carModel.objects.get(id=car_id)
        except carModel.DoesNotExist:
            return Response({"detail": "Car not found"}, status=status.HTTP_404_NOT_FOUND)

        data = {
            "total_views": car.views,
            "daily_views": car.daily_views,
            "weekly_views": car.weekly_views,
            "monthly_views": car.monthly_views
        }
        serializer = CarStatsSerializer(data)
        return Response(serializer.data)


class CarAveragePriceByRegionView(APIView):
    def get(self, request):
        user = request.user
        if not user.is_authenticated or user.account_type != 'premium':
            return Response({"detail": "Premium account required"}, status=status.HTTP_403_FORBIDDEN)

        region = request.query_params.get("region")
        if not region:
            return Response({"detail": "Region is required"}, status=status.HTTP_400_BAD_REQUEST)

        cars = carModel.objects.filter(location__iexact=region)
        avg_usd = cars.aggregate(avg_price_usd=Avg("price_usd"))["avg_price_usd"] or 0
        avg_eur = cars.aggregate(avg_price_eur=Avg("price_eur"))["avg_price_eur"] or 0
        avg_uah = cars.aggregate(avg_price_uah=Avg("price"))["avg_price_uah"] or 0

        data = {
            "region": region,
            "average_price": {
                "USD": round(avg_usd, 2),
                "EUR": round(avg_eur, 2),
                "UAH": round(avg_uah, 2)
            }
        }
        serializer = CarAveragePriceSerializer(data)
        return Response(serializer.data)


class CarAveragePriceCountryView(APIView):
    def get(self, request):
        user = request.user
        if not user.is_authenticated or user.account_type != 'premium':
            return Response({"detail": "Premium account required"}, status=status.HTTP_403_FORBIDDEN)

        cars = carModel.objects.all()
        avg_usd = cars.aggregate(avg_price_usd=Avg("price_usd"))["avg_price_usd"] or 0
        avg_eur = cars.aggregate(avg_price_eur=Avg("price_eur"))["avg_price_eur"] or 0
        avg_uah = cars.aggregate(avg_price_uah=Avg("price"))["avg_price_uah"] or 0

        data = {
            "average_price": {
                "USD": round(avg_usd, 2),
                "EUR": round(avg_eur, 2),
                "UAH": round(avg_uah, 2)
            }
        }
        serializer = CarAveragePriceSerializer(data)
        return Response(serializer.data)