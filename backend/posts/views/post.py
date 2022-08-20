from posts.models import Post
from lists.models import List
from posts.serializers.post import PostSerializer
from posts.permissions import ObjectPostsPermission
from baseapp.views import PageNumberPaginationWithSize
from baseapp.permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.exceptions import NotFound


class PostPage(RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.select_related('user', 'added_to', 'added_to__user'). \
        prefetch_related('comments', 'likes')
    serializer_class = PostSerializer
    lookup_field = 'uuid'
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]


class ObjectPagePosts(ListCreateAPIView):
    queryset = Post.objects.select_related('user', 'added_to', 'added_to__user'). \
        prefetch_related('comments', 'likes')
    serializer_class = PostSerializer
    pagination_class = PageNumberPaginationWithSize(10)
    permission_classes = [IsAuthenticatedOrReadOnly, ObjectPostsPermission]

    def check_added_to_exists(self):
        if not List.objects.filter(uuid=self.kwargs['uuid']).exists():
            raise NotFound()

    def initial(self, request, *args, **kwargs):
        self.check_added_to_exists()
        return super().initial(request, *args, **kwargs)

    def get_queryset(self):
        lookup_field = self.kwargs['lookup_field']
        shared_object_type = self.kwargs['shared_object_type']
        field_name = 'user' if shared_object_type == 'account' else 'added_to'
        value = self.kwargs[lookup_field]

        return super().get_queryset().filter(
            **{'{}__{}'.format(field_name, lookup_field): value}
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update(dict(
            user_id=self.request.user.id,
            added_to_uuid=self.kwargs[self.kwargs['lookup_field']],
        ))
        return context
