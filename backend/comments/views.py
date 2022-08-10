from comments.models import Comment
from comments.serializers import CommentSerializer
from baseapp.views import PageNumberPaginationWithSize, SharedObjectPageAction
from baseapp.permissions import IsOwnerOrReadOnly
from rest_framework.generics import RetrieveUpdateDestroyAPIView


class CommentPage(RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.select_related('user'). \
        prefetch_related('replied_to', 'replied_to__user', 'comments', 'likes')
    serializer_class = CommentSerializer
    lookup_field = 'uuid'
    permission_classes = [IsOwnerOrReadOnly]


class ObjectPageComments(SharedObjectPageAction):
    queryset = Comment.objects.select_related('user'). \
        prefetch_related('replied_to', 'replied_to__user', 'comments', 'likes')
    serializer_class = CommentSerializer
    pagination_class = PageNumberPaginationWithSize(10)

    object_name = serializer_class.object_name
    shared_object_models_switch = serializer_class.shared_object_models_switch

    def get_filter_field_name_condition(self):
        return self.kwargs['shared_object_type'] == 'account'
