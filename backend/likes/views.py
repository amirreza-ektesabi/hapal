from likes.models import Like
from likes.serializers import LikeSerializer
from baseapp.views import PageNumberPaginationWithSize, SharedObjectPageAction
from rest_framework import status
from rest_framework.response import Response


class ObjectPageLikes(SharedObjectPageAction):
    queryset = Like.objects.select_related('user'). \
        prefetch_related('liked', 'liked__user')
    serializer_class = LikeSerializer
    pagination_class = PageNumberPaginationWithSize(40)

    object_name = serializer_class.object_name
    shared_object_models_switch = serializer_class.shared_object_models_switch

    def get_filter_field_name_condition(self):
        return self.kwargs['shared_object_type'] == 'account'

    def delete(self, request, *args, **kwargs):
        ''' unlike '''
        self.get_queryset().filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
