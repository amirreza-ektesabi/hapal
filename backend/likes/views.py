from likes.models import Like
from likes.serializers import LikeSerializer
from baseapp.views import PageNumberPaginationWithSize
from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response


class ObjectPageLikes(ListCreateAPIView):
    queryset = Like.objects.select_related('user'). \
        prefetch_related('liked', 'liked__user')
    serializer_class = LikeSerializer
    pagination_class = PageNumberPaginationWithSize(40)

    def get_filter_field_name(self):
        object_type = self.kwargs['object_type']
        return 'user' if object_type == 'account' else \
               'liked_{}'.format(object_type)

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

    def delete(self, request, *args, **kwargs):
        ''' unlike '''
        self.get_queryset().filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
