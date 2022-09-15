from follows.models import Follow
from follows.serializers import FollowSerializer
from accounts.models import Account
from lists.models import List
from baseapp.views import PageNumberPaginationWithSize, ListCreateRelatedAPIView, ListRelatedAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly


class ObjectPageFollows(ListCreateRelatedAPIView):
    queryset = Follow.objects.select_related('user') \
        .prefetch_related('followed') \
            .order_by('-created')
    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = PageNumberPaginationWithSize(40)
    relateds = {
        'list': {
            'lookup_field': 'uuid',
            'model': List,
            'related_field': 'followed',
            'related_query_name': 'followed_list'
        },
        'account': {
            'lookup_field': 'username',
            'model': Account,
            'related_field': 'followed',
            'related_query_name': 'followed_account'
        }
    }
    
    def post(self, request, *args, **kwargs):
        if request.user == self.get_related_object_or_404():
            return Response({'detail': 'Can not follow yourself.'}, status=status.HTTP_403_FORBIDDEN)
        if self.get_queryset().filter(user=request.user).exists():
            return Response({'detail': 'Already followed.'}, status=status.HTTP_302_FOUND)
        return super().post(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        ''' unfollow '''
        queryset = self.get_queryset().filter(user=request.user)
        if not queryset.exists():
            return Response({'detail': 'Already not followed.'}, status=status.HTTP_404_NOT_FOUND)
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProfilePageFollowing(ListRelatedAPIView):
    queryset = Follow.objects.select_related('user') \
        .prefetch_related('followed') \
            .order_by('-created')
    serializer_class = FollowSerializer
    pagination_class = PageNumberPaginationWithSize(40)
    relateds = {
        'account': {
            'lookup_field': 'username',
            'model': Account,
            'related_field': 'user',
            'related_query_name': 'user'
        }
    }

    