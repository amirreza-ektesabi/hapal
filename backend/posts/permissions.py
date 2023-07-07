from baseapp.views import ListCreateRelatedAPIView

from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.request import Request

from lists.models import List


class IsAllowedToAddPostOrReadOnly(BasePermission):
    def has_permission(self, request: Request, view: ListCreateRelatedAPIView) -> bool:
        list_object: List = view.get_related_object_or_404()
        return (
            request.method in SAFE_METHODS
            or list_object.who_can_add_post == List.WhoCanAddPost.EVERYONE
            or request.user == list_object.user
        )
