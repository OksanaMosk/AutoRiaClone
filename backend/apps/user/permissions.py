from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    message = "You must be an administrator (staff + superuser) to perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
            and request.user.is_superuser
        )

class IsManager(BasePermission):
    message = "You must be a manager to perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == request.user.Role.MANAGER
        )

class IsSeller(BasePermission):
    message = "You must be a seller to perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == request.user.Role.SELLER
        )

class IsBuyer(BasePermission):
    message = "You must be a buyer to perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == request.user.Role.BUYER
        )





#
#
# class IsSuperUser(BaseException):
#     def has_permission(self, request, view):
#         return bool(request.user and request.user.is_staff and request.user.is_superuser)

