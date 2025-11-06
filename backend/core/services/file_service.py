import os
from uuid import uuid1


def upload_car_photo(instance, filename:str)->str:
    ext=filename.split('.')[-1]
    return os.path.join(instance.car_shop.name, f'{uuid1()}.{ext}')
