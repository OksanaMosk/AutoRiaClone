from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework.exceptions import PermissionDenied, ValidationError

from core.services.email_service import EmailService

from .models import Dealership, ProfileModel, UserModel


class UserService:
    @staticmethod
    @transaction.atomic
    def create_user_with_profile(user_data, profile_data):
        user_data['role'] = user_data.get('role', UserModel.Role.BUYER)
        user_data['is_active'] = False
        password = user_data.pop('password', None)
        user = UserModel.objects.create_user(password=password, **user_data)
        ProfileModel.objects.create(user=user, **profile_data)
        EmailService.register(user)
        return user

    @staticmethod
    def change_user_role(requesting_user, target_user_id, new_role):
        """
        Change the role of a target user.
        Only superusers are allowed.
        """
        if not requesting_user.is_superuser:
            raise PermissionDenied('You do not have permission to change user roles.')

        if new_role not in [UserModel.Role.BUYER, UserModel.Role.SELLER, UserModel.Role.MANAGER, UserModel.Role.ADMIN]:
            raise ValidationError('Unknown user role.')

        user = get_object_or_404(UserModel, id=target_user_id)
        user.role = new_role
        user.save(update_fields=['role'])
        return user

    @staticmethod
    def change_user_account_type(requesting_user, target_user_id, new_account_type):
        """
        Change the account type of target user.
        Only superusers are allowed.
        """
        if not requesting_user.is_superuser:
            raise PermissionDenied('You do not have permission to change account type.')

        if new_account_type not in [UserModel.AccountType.BASIC, UserModel.AccountType.PREMIUM]:
            raise ValidationError('Unknown account type.')

        user = get_object_or_404(UserModel, id=target_user_id)
        user.account_type = new_account_type
        user.save(update_fields=['account_type'])
        return user

    @staticmethod
    def change_user_dealership(target_user_id, dealership_id=None):
        """
        Assign or remove a dealership for a target user.
    """
        user = get_object_or_404(UserModel, id=target_user_id)

        if dealership_id:
            dealership = get_object_or_404(Dealership, id=dealership_id)
            user.dealership = dealership
        else:
            user.dealership = None

        user.save(update_fields=['dealership'])
        return user

    @staticmethod
    def toggle_user_active_status(target_user, is_active):
        """
        Toggle the active status of a target user.
        """
        if not isinstance(is_active, bool):
            raise ValidationError('is_active must be a boolean value.')

        target_user.is_active = is_active
        target_user.save(update_fields=['is_active'])
        return target_user
