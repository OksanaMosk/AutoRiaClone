from rest_framework.decorators import api_view
from rest_framework.response import Response
from brands_models import BRANDS, MODELS_BY_BRAND
from locations import LOCATION_CHOICES

@api_view(['GET'])
def car_constants(request):
    return Response({
        'brands': BRANDS,
        'models_by_brand': MODELS_BY_BRAND,
        'locations': [loc for loc, _ in LOCATION_CHOICES],
    })