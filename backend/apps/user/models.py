from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from core.models import BaseModel
from apps.user.managers import UserManager

class UserModel(AbstractBaseUser, PermissionsMixin, BaseModel):
    class Role(models.TextChoices):
        BUYER = "buyer", "Buyer"
        SELLER = "seller", "Seller"
        MANAGER = "manager", "Manager"
        ADMIN = "admin", "Administrator"

    class AccountType(models.TextChoices):
        BASIC = "basic", "Basic"
        PREMIUM = "premium", "Premium"

    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.BUYER
    )
    account_type = models.CharField(
        max_length=20,
        choices=AccountType.choices,
        default=AccountType.BASIC
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        db_table = 'auth_user'
        ordering = ['-id']

    def __str__(self):
        return self.email

class ProfileModel(BaseModel):
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    age = models.IntegerField(null=True, blank=True)
    user = models.OneToOneField(
        UserModel,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    class Meta:
        db_table = 'profile'
        ordering = ['-id']

    def __str__(self):
        return f"{self.name} {self.surname}"
