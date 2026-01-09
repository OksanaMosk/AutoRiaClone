from brands_models import BRANDS, MODELS_BY_BRAND
from locations import LOCATION_CHOICES


def get_car_constants():
    if not BRANDS or not MODELS_BY_BRAND or not LOCATION_CHOICES:
        raise ValueError('One or more constants are empty.')

    return {
        'brands': BRANDS,
        'models_by_brand': MODELS_BY_BRAND,
        'locations': [loc for loc, _ in LOCATION_CHOICES],
    }