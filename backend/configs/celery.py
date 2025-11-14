import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'configs.settings')

app = Celery('settings')
app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.beat_schedule = {
    'update-exchange-rate-daily': {
        'task': 'core.tasks.update_exchange_rate',
        'schedule': crontab(hour=0, minute=0),
    },
}
