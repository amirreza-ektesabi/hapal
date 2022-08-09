from accounts.models import Account
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView


class AccountDetailsPermission(BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: Account):
        return True
