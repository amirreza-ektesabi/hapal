from lists.models import List
from posts.models import Post, Property
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.request import Request
from rest_framework.views import APIView


class ObjectPostsPermission(BasePermission):
    def has_permission(self, request: Request, view: APIView):
        added_to = List.objects.filter(uuid=view.kwargs[view.kwargs['lookup_field']]).first()
        return request.method in SAFE_METHODS or (added_to and request.user == added_to.user)

    def has_object_permission(self, request: Request, view: APIView, obj: Post):
        return request.method in SAFE_METHODS or request.user == obj.added_to.user


class PropertyPermission(BasePermission):
    def has_permission(self, request: Request, view: APIView):
        post = Post.objects.filter(uuid=view.kwargs[view.kwargs['lookup_field']]).first()
        return request.method in SAFE_METHODS or (post and request.user == post.user)

    def has_object_permission(self, request: Request, view: APIView, obj: Property):
        return request.method in SAFE_METHODS or request.user == obj.post.user
