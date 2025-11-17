from better_profanity import profanity
from django.core.exceptions import PermissionDenied
from django.db.models import Avg
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from core.pagination import PagePagination
from .filter import CarFilter
from .models import carModel, get_private_bank_exchange_rate
from .serializers import CarPhotoSerializer, CarSerializer, CarAveragePriceSerializer, CarStatsSerializer
from rest_framework.generics import CreateAPIView, DestroyAPIView
from .models import CarPhoto
from ..user.permissions import IsSellerOrAdminOrManager, IsSellerOrAdmin


class carListCreateView(ListCreateAPIView):
    serializer_class = CarSerializer
    queryset = carModel.objects.all()
    filterset_class = CarFilter
    permission_classes =(AllowAny,)
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
    permission_classes = [IsSellerOrAdmin]

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        new_edit_attempts = instance.edit_attempts + 1
        serializer.save(edit_attempts=new_edit_attempts)
        description = serializer.validated_data.get('description')
        if description and profanity.contains_profanity(description):
            instance.status = "pending"
            if new_edit_attempts >= 3:
                instance.status = "inactive"
                instance.save(update_fields=['status'])
                instance.notify_manager()
                raise ValidationError(
                    "You have failed to edit your description 3 times. The ad has been deactivated."
                )
            instance.save(update_fields=['status'])
            raise ValidationError("Description contains prohibited words. Please edit.")
        return Response(serializer.data)


class CarPhotoCreateView(CreateAPIView):
    serializer_class = CarPhotoSerializer
    permission_classes = [IsSellerOrAdmin]

    def perform_create(self, serializer):
        car_id = self.kwargs['car_id']
        serializer.save(car_id=car_id)


class CarPhotoDeleteView(DestroyAPIView):
    serializer_class = CarPhotoSerializer
    queryset = CarPhoto.objects.all()
    permission_classes = [IsSellerOrAdminOrManager]

class CarStatsView(APIView):
    permission_classes = [IsSellerOrAdmin]
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
    permission_classes = [IsSellerOrAdmin]
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
    permission_classes = [IsSellerOrAdmin]
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

class ExchangeRateView(APIView):
    permission_classes =(AllowAny,)
    def get(self, request, *args, **kwargs):
        try:
            rates = get_private_bank_exchange_rate()
            return Response(rates, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CarUserListView(APIView):
    permission_classes = [IsSellerOrAdminOrManager]
    def get(self, request, user_id, *args, **kwargs):
        user = request.user

        for permission in self.permission_classes:
            if not permission().has_permission(request, self):
                raise PermissionDenied("You do not have permission to view this user's listings.")
        if user.is_staff or user.id == user_id:
            cars = carModel.objects.filter(seller__id=user_id)
        else:
            cars = carModel.objects.filter(seller__id=user_id)
        serializer = CarSerializer(cars, many=True)
        return Response({"cars": serializer.data})
