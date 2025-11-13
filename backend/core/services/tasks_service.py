from celery import shared_task
import datetime

from apps.car.models import get_private_bank_exchange_rate, Car


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
                car.save(update_fields=["price_usd", "price_eur", "last_exchange_update"])
                updated += 1

        print(f"Курс валют оновлено! Оновлено {updated} авто.")
    except Exception as e:
        print(f"Помилка оновлення курсу валют: {e}")