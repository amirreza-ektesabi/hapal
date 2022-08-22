from follows.models import Follow
from follows.serializers import FollowSerializer
from baseapp.views import PageNumberPaginationWithSize, SharedObjectPageAction
from rest_framework import status
from rest_framework.response import Response
from rest_framework import exceptions, status


class ObjectPageFollows(SharedObjectPageAction):
    queryset = Follow.objects.select_related('user'). \
        prefetch_related('followed')
    serializer_class = FollowSerializer
    pagination_class = PageNumberPaginationWithSize(40)

    object_name = serializer_class.object_name
    shared_object_models_switch = serializer_class.shared_object_models_switch

    def _allowed_methods(self):
        return [m.upper() for m in self.http_method_names if hasattr(self, m) and (self.kwargs['side'] == 'followers' or m != ('delete', 'get'))]

    def post(self, request, *args, **kwargs):
        if self.get_queryset().filter(user=request.user).exists():
            return Response({'detail': 'Already followed.'}, status=status.HTTP_302_FOUND)
        return super().post(request, *args, **kwargs)

    def get_filter_field_name_condition(self):
        return self.kwargs['side'] == 'following'

    def delete(self, request, *args, **kwargs):
        ''' unfollow '''
        queryset = self.get_queryset().filter(user=request.user)
        if not queryset.exists():
            return Response({'detail': 'Already not followed.'}, status=status.HTTP_404_NOT_FOUND)
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
