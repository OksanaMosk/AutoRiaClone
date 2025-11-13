from django_filters.rest_framework import DjangoFilterBackend, FilterSet, NumberFilter, CharFilter
from rest_framework import generics
from .models import carModel
from .serializers import CarSerializer

class CarFilter(FilterSet):
    price_min = NumberFilter(field_name="price", lookup_expr='gte')
    price_max = NumberFilter(field_name="price", lookup_expr='lte')
    year_min = NumberFilter(field_name="year", lookup_expr='gte')
    year_max = NumberFilter(field_name="year", lookup_expr='lte')
    mileage_min = NumberFilter(field_name="mileage", lookup_expr='gte')
    mileage_max = NumberFilter(field_name="mileage", lookup_expr='lte')
    brand = CharFilter(field_name="brand", lookup_expr='iexact')
    model = CharFilter(field_name="model", lookup_expr='iexact')
    condition = CharFilter(field_name="condition", lookup_expr='iexact')

    class Meta:
        model = carModel
        fields = []

class CarListView(generics.ListAPIView):
    queryset = carModel.objects.all()
    serializer_class = CarSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CarFilter

    def get_queryset(self):
        qs = super().get_queryset()
        sort = self.request.query_params.get('sort')
        if sort:
            sort_fields = sort.split(',')
            qs = qs.order_by(*sort_fields)
        return qs