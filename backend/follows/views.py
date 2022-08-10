from follows.models import Follow
from follows.serializers import FollowSerializer
from baseapp.views import PageNumberPaginationWithSize, SharedObjectPageAction
from rest_framework import status
from rest_framework.response import Response

class ObjectPageFollows(SharedObjectPageAction):
    queryset = Follow.objects.select_related('user'). \
        prefetch_related('followed')
    serializer_class = FollowSerializer
    pagination_class = PageNumberPaginationWithSize(40)

    object_name = serializer_class.object_name
    shared_object_models_switch = serializer_class.shared_object_models_switch

    def get_filter_field_name_condition(self):
        return self.kwargs['side'] == 'following'

    def delete(self, request, *args, **kwargs):
        ''' unfollow '''
        self.get_queryset().filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
