from django.utils.decorators import method_decorator

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter
from rest_framework.generics import CreateAPIView, DestroyAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from core.pagination import PagePagination
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema

from apps.car.services.car_service import get_user_cars
from apps.car.services.exchange_service import get_private_bank_exchange_rate
from apps.car.services.pricing_service import get_average_price_by_model, get_average_price_by_region
from apps.car.services.stats_service import (
    create_car_with_logic,
    get_car_stats_for_user,
    handle_car_update_profanity,
    update_car_stats,
)

from ..user.permissions import IsSellerOrAdmin, IsSellerOrAdminOrManager
from .models import CarModel, CarPhoto
from .serializers import CarPhotoSerializer, CarSerializer, CarStatsSerializer
from .services.car_constans import get_car_constants


@method_decorator(name='get', decorator=swagger_auto_schema(security=[]))
class CarListCreateView(ListCreateAPIView):
    """
    get:
        Get all cars (with filtering and ordering)
    post:
        Create a new car
    """
    serializer_class = CarSerializer
    queryset = CarModel.objects.all()
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['brand', 'model', 'condition', 'year', 'price', 'location']
    ordering_fields = ['price', 'year', 'mileage', 'max_speed', 'location', 'seats_count', 'condition', 'engine_volume', 'created_at']
    ordering = ['-created_at']
    permission_classes = (IsAuthenticatedOrReadOnly,)
    pagination_class = PagePagination

    def perform_create(self, serializer):
        user = self.request.user
        create_car_with_logic(user, serializer)


class CarRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
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
    queryset = CarModel.objects.all()
    http_method_names = ['get', 'put', 'patch', 'delete']

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsSellerOrAdminOrManager()]

    def get_serializer(self, *args, **kwargs):
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.accepted_renderer.format == 'json':
            update_car_stats(instance, request)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        handle_car_update_profanity(instance, serializer, request.user)
        serializer.save()
        return Response(serializer.data)


class CarPhotoCreateView(CreateAPIView):
    """
    post:
        Upload a photo for a car
    """
    serializer_class = CarPhotoSerializer
    permission_classes = [IsSellerOrAdminOrManager]

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
        stats = get_car_stats_for_user(car_id, request.user)
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
            return Response({'detail': 'Premium account required'}, status=status.HTTP_403_FORBIDDEN)

        region = request.query_params.get('region')
        if not region:
            return Response({'detail': 'Region is required'}, status=status.HTTP_400_BAD_REQUEST)


        model_name = request.query_params.get('model')

        try:
            data = get_average_price_by_region(region, model_name)
        except ValueError as e:
            return Response({'detail': str(e)}, status=400)
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
            return Response({'detail': 'Premium account required'}, status=status.HTTP_403_FORBIDDEN)

        model_name = request.query_params.get('model')
        if not model_name:
            return Response({'detail': 'Model is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = get_average_price_by_model(model_name)
        except ValueError as e:
            return Response({'detail': str(e)}, status=400)

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
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CarUserListView(APIView):
    """
    get:
        Retrieve a list of cars belonging to the authenticated user.
        Only accessible to logged-in users.
    """

    permission_classes = [IsSellerOrAdminOrManager]

    def get(self, request, user_id):
        cars = get_user_cars(request.user, user_id)
        serializer = CarSerializer(cars, many=True)
        return Response({'cars': serializer.data})


@api_view(['GET'])
@permission_classes([AllowAny])
def car_constants(request):
    try:
        constants = get_car_constants()
        if not constants:
            return Response({'detail': 'Constants not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(constants, status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except KeyError as e:
        return Response({'detail': f'Missing key: {e}'}, status=status.HTTP_400_BAD_REQUEST)
