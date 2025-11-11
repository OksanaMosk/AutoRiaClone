from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db.transaction import atomic
from rest_framework import serializers
from core.services.email_service import EmailService
from apps.user.models import ProfileModel
UserModel = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileModel
        fields = (
            'id',
            'name',
            'surname',
            'age',
            'created_at',
            'updated_at'
        )


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = UserModel
        fields = (
            'id',
            'email',
            'password',
            'role',
            'account_type',
            'is_active',
            'is_staff',
            'is_superuser',
            'last_login',
            'created_at',
            'updated_at',
            'profile'
        )
        read_only_fields = ('id',  'is_active', 'is_staff', 'is_superuser', 'last_login', 'created_at', 'updated_at')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_role(self, value):
        if value not in [UserModel.Role.BUYER, UserModel.Role.SELLER, UserModel.Role.MANAGER, UserModel.Role.ADMIN]:
            raise serializers.ValidationError("Invalid role.")
        return value


    @atomic
    def create(self, validated_data: dict):
        profile_data = validated_data.pop('profile')
        password = validated_data.pop('password', None)


        validated_data['is_active'] = False

        user = UserModel.objects.create_user(
            password=password,
            **validated_data
        )

        ProfileModel.objects.create(user=user, **profile_data)

        EmailService.register(user)

        return user