from django.core.mail import send_mail


def get_user_cars(user, user_id):
    from apps.car.models import CarModel
    if user.role in ['admin', 'manager']:
        return CarModel.objects.filter(seller__id=user_id)
    if user.role == 'seller' and user.id == user_id:
        return CarModel.objects.filter(seller__id=user_id)
    return CarModel.objects.none()

def notify_manager(car):
    send_mail(
        subject='Car listing needs attention',
        message=f'The car listing with ID {car.id} has failed the profanity check 3 times.',
        from_email='no-reply@platform.com',
        recipient_list=['manager@example.com']
    )