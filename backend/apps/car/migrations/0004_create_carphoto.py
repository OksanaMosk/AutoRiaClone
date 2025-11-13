from django.db import migrations, models
import core.services.file_service

class Migration(migrations.Migration):

    dependencies = [
        ('car', '0003_alter_carphoto_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='CarPhoto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo', models.ImageField(upload_to=core.services.file_service.upload_car_photo)),
                ('car', models.ForeignKey(to='car.carModel', related_name='photos', on_delete=models.CASCADE)),
            ],
            options={
                'db_table': 'car_photos',
            },
        ),
    ]