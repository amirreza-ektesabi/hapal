from posts.models import Post
from posts.serializers.post import PostSerializer
from lists.models import List
from accounts.models import Account
from baseapp.views import PageNumberPaginationWithSize, ListCreateRelatedAPIView, ListRelatedAPIView
from baseapp.permissions import IsOwnerOrReadOnly, IsRelatedOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.generics import RetrieveUpdateDestroyAPIView


class PostPage(RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.select_related('user', 'added_to', 'added_to__user') \
        .prefetch_related('comments', 'likes')
    serializer_class = PostSerializer
    lookup_field = 'uuid'
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]


class ListPagePosts(ListCreateRelatedAPIView):
    queryset = Post.objects.select_related('user', 'added_to', 'added_to__user') \
        .prefetch_related('comments', 'likes') \
            .order_by('-created')
    serializer_class = PostSerializer
    pagination_class = PageNumberPaginationWithSize(10)
    permission_classes = [IsAuthenticatedOrReadOnly, IsRelatedOwnerOrReadOnly]
    relateds = {
        'list': {
            'lookup_field': 'uuid',
            'model': List,
            'related_field': 'added_to',
            'related_query_name': 'added_to'
        }
    }


class ProfilePagePosts(ListRelatedAPIView):
    queryset = Post.objects.select_related('user', 'added_to', 'added_to__user') \
        .prefetch_related('comments', 'likes') \
            .order_by('-created')
    serializer_class = PostSerializer
    pagination_class = PageNumberPaginationWithSize(10)
    relateds = {
        'account': {
            'lookup_field': 'username',
            'model': Account,
            'related_field': 'user',
            'related_query_name': 'user'
        }
    }
