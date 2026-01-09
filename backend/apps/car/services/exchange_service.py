import datetime
from decimal import Decimal

from rest_framework.exceptions import ValidationError
import requests


def get_private_bank_exchange_rate():
    response = requests.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
    response.raise_for_status()
    data = response.json()

    usd_rate = next((item for item in data if item['ccy'] == 'USD'), None)
    eur_rate = next((item for item in data if item['ccy'] == 'EUR'), None)

    if not usd_rate or not eur_rate:
        raise ValidationError('Failed to retrieve USD or EUR exchange rate from PrivatBank.')

    return {
        'USD': float(usd_rate['buy']),
        'EUR': float(eur_rate['buy']),
    }


def update_car_prices(car, rates=None):
    current_date = datetime.date.today()
    if car.last_exchange_update == current_date:
        return

    if rates is None:
        rates = get_private_bank_exchange_rate()

    car.exchange_rate_id = f'Privatbank_{current_date}'

    if car.currency == 'USD':
        car.price_usd = Decimal(car.price).quantize(Decimal('0.01'))
        car.price_eur = (Decimal(car.price) * Decimal(rates['EUR']) / Decimal(rates['USD'])).quantize(
            Decimal('0.01'))
    elif car.currency == 'EUR':
        car.price_eur = Decimal(car.price).quantize(Decimal('0.01'))
        car.price_usd = (Decimal(car.price) * Decimal(rates['USD']) / Decimal(rates['EUR'])).quantize(
            Decimal('0.01'))
    else:
        car.price_usd = (Decimal(car.price) / Decimal(rates['USD'])).quantize(Decimal('0.01'))
        car.price_eur = (Decimal(car.price) / Decimal(rates['EUR'])).quantize(Decimal('0.01'))

    car.last_exchange_update = current_date