from posts.models import Post
from posts.serializers.post import PostSerializer
from baseapp.views import PageNumberPaginationWithSize
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView


class PostPage(RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.select_related('user', 'added_to', 'added_to__user'). \
        prefetch_related('comments', 'likes')
    serializer_class = PostSerializer
    lookup_field = 'uuid'


class ObjectPagePosts(ListCreateAPIView):
    queryset = Post.objects.select_related('user', 'added_to', 'added_to__user'). \
        prefetch_related('comments', 'likes')
    serializer_class = PostSerializer
    pagination_class = PageNumberPaginationWithSize(10)

    def get_queryset(self):
        lookup_field = self.kwargs['lookup_field']
        object_type = self.kwargs['object_type']
        field_name = 'user' if object_type == 'account' else 'added_to'
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
