from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from brands_models import BRANDS, MODELS_BY_BRAND
from locations import LOCATION_CHOICES

@api_view(['GET'])
@permission_classes([AllowAny])
def car_constants(_):
    try:
        if not BRANDS or not MODELS_BY_BRAND or not LOCATION_CHOICES:
            raise ValueError("Одні з констант порожні.")

        return Response({
            'brands': BRANDS,
            'models_by_brand': MODELS_BY_BRAND,
            'locations': [loc for loc, _ in LOCATION_CHOICES],
        })
    except Exception as e:
        print(f"Error: {str(e)}")
        return Response({"detail": "Error CONSTANTS."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)