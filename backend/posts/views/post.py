from lists.models import List
from posts.models import Post
from accounts.models import Account
from posts.serializers.post import PostPreviewSerializer, PostFullviewSerializer
from baseapp.views import (
    ListCreateRelatedAPIView, ListRelatedAPIView,
    CheckObjectLikedByCurrentUserMixin, CheckObjectUserFollowedByCurrentUserMixin,
    PageNumberPaginationWithSize
)
from baseapp.permissions import IsOwnerOrReadOnly, IsRelatedOwnerOrReadOnly

from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.generics import RetrieveUpdateDestroyAPIView


class PostPage(CheckObjectLikedByCurrentUserMixin,
               CheckObjectUserFollowedByCurrentUserMixin,
               RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.select_related('added_to', 'added_to__user') \
        .prefetch_related('comments', 'likes')
    serializer_class = PostPreviewSerializer
    lookup_field = 'uuid'
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]


class ListPagePosts(CheckObjectLikedByCurrentUserMixin,
                    CheckObjectUserFollowedByCurrentUserMixin,
                    ListCreateRelatedAPIView):
    queryset = Post.objects.select_related('added_to', 'added_to__user') \
        .prefetch_related('comments', 'likes') \
        .order_by('-created')
    serializer_class = PostFullviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsRelatedOwnerOrReadOnly]
    relateds = {
        'list': {
            'lookup_field': 'uuid',
            'model': List,
            'related_field': 'added_to',
            'related_query_name': 'added_to'
        }
    }


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
