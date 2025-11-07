from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from core.models import BaseModel

from apps.user.managers import UserManager


class UserModel(AbstractBaseUser, PermissionsMixin, BaseModel):
    class Meta:
        db_table = 'auth_user'
        ordering = ['-id']
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    objects = UserManager()

class ProfileModel(BaseModel):
    class Meta:
        db_table = 'profile'
        ordering = ['-id']
    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=20)
    age = models.IntegerField()
    user=models.OneToOneField(UserModel, on_delete=models.CASCADE,related_name='profile')
    objects = models.Manager()


#
# from sqlalchemy import Column, Integer, String, Enum
# from app.database import Base
# import enum
#
# class Role(str, enum.Enum):
#     ADMIN = "admin"
#     MANAGER = "manager"
#     SELLER = "seller"
#     BUYER = "buyer"
#
# class AccountType(str, enum.Enum):
#     BASIC = "basic"
#     PREMIUM = "premium"
#
# class User(Base):
#     __tablename__ = "users"
#
#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True)
#     hashed_password = Column(String)
#     role = Column(Enum(Role), default=Role.BUYER)
#     account_type = Column(Enum(AccountType), default=AccountType.BASIC)
