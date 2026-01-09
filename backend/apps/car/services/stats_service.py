from django.conf import settings
from django.core.cache import cache
from django.utils import timezone

from rest_framework.exceptions import PermissionDenied, ValidationError

from better_profanity import profanity

from core.services.email_service import EmailService

from apps.car.models import CarModel


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

def create_car_with_logic(user, serializer):

    if getattr(user, 'account_type', None) == 'basic' and CarModel.objects.filter(seller=user).exists():
        raise PermissionDenied('Upgrade account to Premium to add more cars')

    description = serializer.validated_data.get('description', '')
    if description and profanity.contains_profanity(description):
        serializer.save(seller=user, status='pending', edit_attempts=1)
    else:
        serializer.save(seller=user, status="active", edit_attempts=0)


def handle_car_update_profanity(car, serializer, user):
    description = serializer.validated_data.get('description')
    if car.edit_attempts >= 3 and user.role not in ['manager', 'admin']:
        raise ValidationError('This ad is locked and cannot be edited.')

    if user.role in ['manager', 'admin'] and serializer.validated_data.get('status') == 'active':
        car.edit_attempts = 0
        car.save(update_fields=['edit_attempts'])

    if description and profanity.contains_profanity(description):
        car.edit_attempts += 1
        car.status = 'inactive' if car.edit_attempts >= 3 else 'pending'
        car.save(update_fields=['edit_attempts', 'status'])

        if car.edit_attempts == 3:
            EmailService._EmailService__send_email(
                to=settings.MANAGER_EMAIL,
                template_name='manager_email.html',
                context={
                    'ad_id': car.id,
                    'frontend_url': f"{settings.BASE_URL}/ads/{car.id}"
                },
                subject='Ad requires review'
            )

        raise ValidationError('Description contains prohibited words.')

def get_car_stats_for_user(car_id, user):
    if not user.is_authenticated or user.account_type != 'premium':
        raise PermissionDenied('Premium account required')
    try:
        car = CarModel.objects.get(id=car_id)
    except CarModel.DoesNotExist:
        raise CarModel.DoesNotExist('Car not found')

    return {
        'total_views': car.views,
        'daily_views': car.daily_views,
        'weekly_views': car.weekly_views,
        'monthly_views': car.monthly_views
    }
