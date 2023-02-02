from lists.models import List
from posts.models import Post
from comments.models import Comment
from comments.serializers import CommentFullviewSerializer
from baseapp.views import (
    ListCreateRelatedAPIView, CheckObjectLikedByCurrentUserMixin,
    CheckObjectUserFollowedByCurrentUserMixin, PageNumberPaginationWithSize
)
from baseapp.permissions import IsOwnerOrReadOnly

from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.generics import RetrieveUpdateDestroyAPIView


class CommentPage(CheckObjectLikedByCurrentUserMixin,
                  CheckObjectUserFollowedByCurrentUserMixin,
                  RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects \
        .prefetch_related('replied_to', 'replied_to__user', 'comments', 'likes')
    serializer_class = CommentFullviewSerializer
    lookup_field = 'uuid'
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]


class ObjectPageComments(CheckObjectLikedByCurrentUserMixin,
                         CheckObjectUserFollowedByCurrentUserMixin,
                         ListCreateRelatedAPIView):
    queryset = Comment.objects \
        .prefetch_related('replied_to', 'replied_to__user', 'comments', 'likes') \
        .order_by('-created')
    serializer_class = CommentFullviewSerializer
    pagination_class = PageNumberPaginationWithSize(10)
    permission_classes = [IsAuthenticatedOrReadOnly]
    relateds = {
        'list': {
            'lookup_field': 'uuid',
            'model': List,
            'related_field': 'replied_to',
            'related_query_name': 'replied_to_list'
        },
        'post': {
            'lookup_field': 'uuid',
            'model': Post,
            'related_field': 'replied_to',
            'related_query_name': 'replied_to_post'
        },
        'comment': {
            'lookup_field': 'uuid',
            'model': Comment,
            'related_field': 'replied_to',
            'related_query_name': 'replied_to_comment'
        }
    }
