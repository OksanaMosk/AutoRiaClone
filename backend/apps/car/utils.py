from django.core.cache import cache
from django.utils import timezone

def get_client_ip(request):
    django_request = request._request
    x_forwarded_for = django_request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = django_request.META.get('REMOTE_ADDR')
    return ip

def update_car_stats(car, request):
    now = timezone.now()
    ip = get_client_ip(request)
    cache_key = f"car_view:{car.id}:{ip}:{now.date()}"

    if cache.get(cache_key):
        return

    if car.updated_at.date() != now.date():
        car.daily_views = 0
    if car.updated_at.isocalendar()[1] != now.isocalendar()[1]:
        car.weekly_views = 0
    if car.updated_at.month != now.month:
        car.monthly_views = 0

    car.views += 1
    car.daily_views += 1
    car.weekly_views += 1
    car.monthly_views += 1
    car.updated_at = now
    car.save()

    cache.set(cache_key, True, timeout=24*60*60)