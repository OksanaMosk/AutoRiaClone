import datetime

from celery import shared_task

from apps.car.services.exchange_service import get_private_bank_exchange_rate


@shared_task
def update_exchange_rate():
    try:
        rates = get_private_bank_exchange_rate()
        today = datetime.date.today()

        cars = Car.objects.all()
        updated = 0

        for car in cars:
            if car.last_exchange_update != today:
                car.update_prices(rates)
                car.save(update_fields=['price_usd', 'price_eur', 'last_exchange_update'])
                updated += 1


    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f'Error updating exchange rates: {e}')
