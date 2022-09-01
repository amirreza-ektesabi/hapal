from baseapp.models import SharedBaseModel
from baseapp.views import ListCreateRelatedAPIView
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.request import Request
from rest_framework.views import APIView


class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: SharedBaseModel):
        return request.method in SAFE_METHODS or request.user == obj.user


class IsRelatedOwnerOrReadOnly(BasePermission):
    def has_permission(self, request: Request, view: ListCreateRelatedAPIView):
        return request.method in SAFE_METHODS or request.user == view.get_related_object_or_404().user
