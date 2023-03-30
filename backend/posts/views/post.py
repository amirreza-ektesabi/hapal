from lists.models import List
from posts.models import Post
from accounts.models import Account
from posts.serializers.post import PostFullviewSerializer
from posts.serializers.post_set import PostSetSerializer
from baseapp.views import (
    ListCreateRelatedAPIView, ListRelatedAPIView,
    CheckObjectLikedByCurrentUserMixin, CheckObjectUserFollowedByCurrentUserMixin
)
from baseapp.permissions import IsOwnerOrReadOnly, IsRelatedOwnerOrReadOnly

from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.mixins import UpdateModelMixin


class PostPage(CheckObjectLikedByCurrentUserMixin,
               CheckObjectUserFollowedByCurrentUserMixin,
               RetrieveUpdateDestroyAPIView, UpdateModelMixin):
    queryset = Post.objects.select_related('added_to', 'added_to__user') \
        .prefetch_related('comments', 'likes')
    lookup_field = 'uuid'
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return PostFullviewSerializer
        else:
            return PostSetSerializer


class ListPagePosts(CheckObjectLikedByCurrentUserMixin,
                    CheckObjectUserFollowedByCurrentUserMixin,
                    ListCreateRelatedAPIView):
    queryset = Post.objects.select_related('added_to', 'added_to__user') \
        .prefetch_related('comments', 'likes') \
        .order_by('-created')
    permission_classes = [IsAuthenticatedOrReadOnly, IsRelatedOwnerOrReadOnly]
    relateds = {
        'list': {
            'lookup_field': 'uuid',
            'model': List,
            'related_field': 'added_to',
            'related_query_name': 'added_to'
        }
    }

    def get_serializer_class(self):
        if self.request.method == "GET":
            return PostFullviewSerializer
        else:
            return PostSetSerializer


class ProfilePagePosts(CheckObjectLikedByCurrentUserMixin,
                       CheckObjectUserFollowedByCurrentUserMixin,
                       ListRelatedAPIView):
    queryset = Post.objects.select_related('added_to', 'added_to__user') \
        .prefetch_related('comments', 'likes') \
        .order_by('-created')
    serializer_class = PostFullviewSerializer
    relateds = {
        'account': {
            'lookup_field': 'username',
            'model': Account,
            'related_field': 'user',
            'related_query_name': 'user'
        }
    }
