

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from core.models import BaseModel
from apps.user.managers import UserManager

class Dealership(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'dealership'
        ordering = ['name']

    def __str__(self):
        return self.name


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
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.BUYER)
    account_type = models.CharField(max_length=20, choices=AccountType.choices, default=AccountType.BASIC)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    dealership = models.ForeignKey(
        Dealership,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="user"
    )

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
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
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
