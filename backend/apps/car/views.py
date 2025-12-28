from better_profanity import profanity
from django.core.exceptions import PermissionDenied
from django.db.models import Avg
from django.conf import settings
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
from .serializers import CarPhotoSerializer, CarSerializer, CarStatsSerializer
from rest_framework.generics import CreateAPIView, DestroyAPIView
from .models import CarPhoto
from ..user.permissions import IsSellerOrAdminOrManager, IsSellerOrAdmin
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from .utils import update_car_stats
from core.services.email_service import EmailService

@method_decorator(name='get', decorator=swagger_auto_schema(security=[]))
class carListCreateView(ListCreateAPIView):
    """
    get:
        Get all cars
    post:
        Create a new car
    """

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

        description = serializer.validated_data.get('description', '')
        if description and profanity.contains_profanity(description):
            serializer.save(seller=user, status="pending", edit_attempts=1)
        else:
            serializer.save(seller=user, status="active", edit_attempts=0)


class carRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    """
    get:
        Retrieve a car by ID
    put:
        Update a car by ID
    patch:
        Partially update a car by ID
    delete:
        Delete a car by ID
    """

    serializer_class = CarSerializer
    queryset = carModel.objects.all()
    http_method_names = ['get', 'put', 'patch', 'delete']

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsSellerOrAdminOrManager()]

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.method == 'GET' and request.accepted_renderer.format == 'json':
            update_car_stats(instance, request)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.edit_attempts >= 3 and request.user.role not in ["manager", "admin"]:
            raise ValidationError("This ad is locked and cannot be edited.")

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        description = serializer.validated_data.get('description')

        if request.user.role in ["manager", "admin"] and serializer.validated_data.get("status") == "active":
            instance.edit_attempts = 0
            instance.save(update_fields=["edit_attempts"])

        if description and profanity.contains_profanity(description):
            instance.edit_attempts += 1
            instance.status = "inactive" if instance.edit_attempts >= 3 else "pending"
            instance.save(update_fields=["edit_attempts", "status"])

            if instance.edit_attempts == 3:
                EmailService._EmailService__send_email(
                    to=settings.MANAGER_EMAIL,
                    template_name='manager_email.html',
                    context={
                        'ad_id': instance.id,
                        'frontend_url': f"{settings.BASE_URL}/ads/{instance.id}"
                    },
                    subject='Ad requires review'
                )

            raise ValidationError("Description contains prohibited words.")

        serializer.save()
        return Response(serializer.data)

class CarPhotoCreateView(CreateAPIView):
    """
    post:
        Upload a photo for a car
    """
    serializer_class = CarPhotoSerializer
    permission_classes = [IsSellerOrAdmin]

    def perform_create(self, serializer):
        car_id = self.kwargs['car_id']
        serializer.save(car_id=car_id)


class CarPhotoDeleteView(DestroyAPIView):
    """
    delete:
        Delete a car photo by ID
    """
    serializer_class = CarPhotoSerializer
    queryset = CarPhoto.objects.all()
    permission_classes = [IsSellerOrAdminOrManager]


class CarStatsView(APIView):
    """
    get:
        Retrieve statistics for a specific car by its ID.
        Only accessible to authenticated users with a premium account.
    """
    permission_classes = [IsSellerOrAdmin]
    def get(self, request, car_id):
        user = request.user
        if not user.is_authenticated or user.account_type != 'premium':
            return Response({"detail": "Premium account required"}, status=status.HTTP_403_FORBIDDEN)

        try:
            car = carModel.objects.get(id=car_id)
        except carModel.DoesNotExist:
            return Response({"detail": "Car not found"}, status=status.HTTP_404_NOT_FOUND)

        stats = {
            "total_views": car.views,
            "daily_views": car.daily_views,
            "weekly_views": car.weekly_views,
            "monthly_views": car.monthly_views
        }
        serializer = CarStatsSerializer(instance=stats)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CarAveragePriceByRegionView(APIView):
    """
    get:
        Retrieve the average price of cars by region.
        Only accessible to authenticated users with a premium account.
    """

    permission_classes = [IsSellerOrAdmin]

    def get(self, request):
        user = request.user
        if not user.is_authenticated or user.account_type != 'premium':
            return Response({"detail": "Premium account required"}, status=status.HTTP_403_FORBIDDEN)

        region = request.query_params.get("region")
        if not region:
            return Response({"detail": "Region is required"}, status=status.HTTP_400_BAD_REQUEST)

        cars = carModel.objects.filter(location__iexact=region)
        model_name = request.query_params.get("model")
        if model_name:
            cars = cars.filter(model__iexact=model_name.strip())

        avg_usd = cars.aggregate(avg_price_usd=Avg("price_usd"))["avg_price_usd"] or 0
        avg_eur = cars.aggregate(avg_price_eur=Avg("price_eur"))["avg_price_eur"] or 0
        avg_uah = cars.aggregate(avg_price_uah=Avg("price"))["avg_price_uah"] or 0

        data = {
            "region": region,
            "model": model_name if model_name else "all",
            "average_price": {
                "USD": round(avg_usd, 2),
                "EUR": round(avg_eur, 2),
                "UAH": round(avg_uah, 2)
            }
        }

        return Response(data)

class CarAveragePriceCountryView(APIView):
    """
    get:
        Retrieve the average price of all cars in the country.
        Only accessible to authenticated users with a premium account.
        Returns average prices in USD, EUR, and UAH.
    """

    permission_classes = [IsSellerOrAdmin]

    def get(self, request):
        user = request.user
        if not user.is_authenticated or user.account_type != 'premium':
            return Response({"detail": "Premium account required"}, status=status.HTTP_403_FORBIDDEN)

        model_name = request.query_params.get("model")
        if not model_name:
            return Response({"detail": "Model is required"}, status=status.HTTP_400_BAD_REQUEST)

        cars = carModel.objects.filter(model__iexact=model_name.strip())

        avg_usd = cars.aggregate(avg_price_usd=Avg("price_usd"))["avg_price_usd"] or 0
        avg_eur = cars.aggregate(avg_price_eur=Avg("price_eur"))["avg_price_eur"] or 0
        avg_uah = cars.aggregate(avg_price_uah=Avg("price"))["avg_price_uah"] or 0

        data = {
            "model": model_name,
            "average_price": {
                "USD": round(avg_usd, 2),
                "EUR": round(avg_eur, 2),
                "UAH": round(avg_uah, 2)
            }
        }

        return Response(data)
class ExchangeRateView(APIView):
    """
    get:
        Retrieve current exchange rates from the private bank.
        Accessible to all users (no authentication required).
    """
    permission_classes =(AllowAny,)
    def get(self, request, *args, **kwargs):
        try:
            rates = get_private_bank_exchange_rate()
            return Response(rates, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CarUserListView(APIView):
    """
    get:
        Retrieve a list of cars belonging to the authenticated user.
        Only accessible to logged-in users.
    """

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
