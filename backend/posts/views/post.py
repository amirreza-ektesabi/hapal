from accounts.models import Account
from posts.models import Post
from lists.models import List
from posts.serializers.post import PostSerializer
from posts.permissions import ObjectPostsPermission
from baseapp.views import PageNumberPaginationWithSize
from baseapp.permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.exceptions import NotFound


class PostPage(RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.select_related('user', 'added_to', 'added_to__user'). \
        prefetch_related('comments', 'likes')
    serializer_class = PostSerializer
    lookup_field = 'uuid'
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]


class ListPagePosts(ListCreateAPIView):
    queryset = Post.objects.select_related('user', 'added_to', 'added_to__user'). \
        prefetch_related('comments', 'likes')
    serializer_class = PostSerializer
    pagination_class = PageNumberPaginationWithSize(10)
    permission_classes = [IsAuthenticatedOrReadOnly, ObjectPostsPermission]

    def check_added_to_exists(self):
        lookup_field = self.kwargs['lookup_field']
        value = self.kwargs[lookup_field]

        if not List.objects.filter(**{lookup_field: value}).exists():
            raise NotFound()

    def initial(self, request, *args, **kwargs):
        self.check_added_to_exists()
        return super().initial(request, *args, **kwargs)

    def get_queryset(self):
        lookup_field = self.kwargs['lookup_field']
        value = self.kwargs[lookup_field]

        return super().get_queryset().filter(
            **{'added_to__{}'.format(lookup_field): value}
        ).order_by('-created')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update(dict(
            user_id=self.request.user.id,
            added_to_uuid=self.kwargs[self.kwargs['lookup_field']],
        ))
        return context


class ProfilePagePosts(ListAPIView):
    queryset = Post.objects.select_related('user', 'added_to', 'added_to__user'). \
        prefetch_related('comments', 'likes')
    serializer_class = PostSerializer
    pagination_class = PageNumberPaginationWithSize(10)

    def check_user_exists(self):
        lookup_field = self.kwargs['lookup_field']
        value = self.kwargs[lookup_field]

        if not Account.objects.filter(**{lookup_field: value}).exists():
            raise NotFound()

    def initial(self, request, *args, **kwargs):
        self.check_user_exists()
        return super().initial(request, *args, **kwargs)

    def get_queryset(self):
        lookup_field = self.kwargs['lookup_field']
        value = self.kwargs[lookup_field]

        return super().get_queryset().filter(
            **{'user__{}'.format(lookup_field): value}
        ).order_by('-created')
