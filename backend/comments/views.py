from comments.models import Comment
from comments.serializers import CommentSerializer
from baseapp.views import PageNumberPaginationWithSize
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView


class CommentPage(RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.select_related('user'). \
        prefetch_related('replied_to', 'replied_to__user', 'comments', 'likes')
    serializer_class = CommentSerializer
    lookup_field = 'uuid'


class ObjectPageComments(ListCreateAPIView):
    queryset = Comment.objects.select_related('user'). \
        prefetch_related('replied_to', 'replied_to__user', 'comments', 'likes')
    serializer_class = CommentSerializer
    pagination_class = PageNumberPaginationWithSize(10)

    def get_filter_field_name(self):
        object_type = self.kwargs['object_type']
        return 'user' if object_type == 'account' else \
               'replied_to_{}'.format(object_type)

    def get_queryset(self):
        field_name = self.get_filter_field_name()
        lookup_field = self.kwargs['lookup_field']
        value = self.kwargs[lookup_field]

        return super().get_queryset().filter(
            **{'{}__{}'.format(field_name, lookup_field): value}
        ).order_by('-created')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update(dict(
            user_id=self.request.user.id,
            lookup_field_value=self.kwargs[self.kwargs['lookup_field']],
            object_type=self.kwargs['object_type'],
        ))
        return context
