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

    def post(self, request, *args, **kwargs):
        if self.get_queryset().filter(user=request.user).exists():
            return Response({'detail': 'Already liked.'}, status=status.HTTP_302_FOUND)
        return super().post(request, *args, **kwargs)

    def get_filter_field_name_condition(self):
        return self.kwargs['shared_object_type'] == 'account'

    def delete(self, request, *args, **kwargs):
        ''' unlike '''
        queryset = self.get_queryset().filter(user=request.user)
        if not queryset.exists():
            return Response({'detail': 'Already not liked.'}, status=status.HTTP_404_NOT_FOUND)
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
