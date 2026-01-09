from django.contrib.auth import get_user_model

from rest_framework import serializers

from apps.user.models import Dealership, ProfileModel
from apps.user.services import UserService

UserModel = get_user_model()


class DealershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dealership
        fields = ['id', 'name', 'address', 'phone']


class ProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.ReadOnlyField(source='user.id')
    class Meta:
        model = ProfileModel
        fields = (
            'id',
            'user_id',
            'name',
            'surname',
            'age',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('created_at', 'updated_at', 'user_id')


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    role = serializers.ChoiceField(
        choices=[UserModel.Role.BUYER, UserModel.Role.SELLER],
        required=False
    )

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
            'profile',
            'dealership',
        )
        read_only_fields = ('id',  'is_active', 'is_staff', 'is_superuser', 'last_login', 'created_at', 'updated_at')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_role(self, value):
        """
        Ensure only BUYER or SELLER can be assigned during registration.
        """
        if value not in [UserModel.Role.BUYER, UserModel.Role.SELLER]:
            raise serializers.ValidationError('You cannot assign this role.')
        return value

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        return UserService.create_user_with_profile(validated_data, profile_data)


class UserRoleSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=[
        UserModel.Role.BUYER,
        UserModel.Role.SELLER,
        UserModel.Role.MANAGER,
        UserModel.Role.ADMIN
    ])


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = (
            'email',

        )
        extra_kwargs = {
            'email': {'required': False},
        }


class UserActiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('is_active',)

    def update(self, instance, validated_data):
        instance.is_active = validated_data['is_active']
        instance.save()
        return instance


class UserRoleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('role',)

    def validate_role(self, value):
        request = self.context.get('request')
        current_user = getattr(request, 'user', None)


        if value in [UserModel.Role.MANAGER, UserModel.Role.ADMIN]:
            if not current_user or not current_user.is_superuser:
                raise serializers.ValidationError(
                    'Only admins can assign MANAGER or ADMIN roles.'
                )
        if current_user and current_user.role == UserModel.Role.MANAGER:
            if value not in [UserModel.Role.BUYER, UserModel.Role.SELLER]:
                raise serializers.ValidationError(
                    'Managers can only assign BUYER or SELLER roles.'
                )

        return value

    def update(self, instance, validated_data):
        instance.role = validated_data['role']
        instance.save()
        return instance


class UserAccountTypeUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('account_type',)

    def validate_account_type(self, value):
        request = self.context.get('request')
        current_user = getattr(request, 'user', None)

        if not current_user or current_user.role != UserModel.Role.ADMIN:
            raise serializers.ValidationError(
                'Only admins can change the account type.'
            )

        if value not in [UserModel.AccountType.BASIC, UserModel.AccountType.PREMIUM]:
            raise serializers.ValidationError('Invalid account type.')

        return value

    def update(self, instance, validated_data):
        instance.account_type = validated_data['account_type']
        instance.save()
        return instance