from likes.models import Like
from lists.models import List
from posts.models import Post
from comments.models import Comment
from likes.serializers import LikeSerializer
from baseapp.views import ListCreateRelatedAPIView

from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.request import Request


class ObjectPageLikes(ListCreateRelatedAPIView):
    queryset = Like.objects.select_related('user') \
        .prefetch_related('liked', 'liked__user') \
        .order_by('-created')
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    relateds = {
        'list': {
            'lookup_field': 'uuid',
            'model': List,
            'related_field': 'liked',
            'related_query_name': 'liked_list'
        },
        'post': {
            'lookup_field': 'uuid',
            'model': Post,
            'related_field': 'liked',
            'related_query_name': 'liked_post'
        },
        'comment': {
            'lookup_field': 'uuid',
            'model': Comment,
            'related_field': 'liked',
            'related_query_name': 'liked_comment'
        }
    }

    def post(self, request: Request, *args, **kwargs) -> Response:
        if self.get_queryset().filter(user=request.user).exists():
            return Response({'detail': 'Already liked.'}, status=status.HTTP_302_FOUND)
        return super().post(request, *args, **kwargs)

    def delete(self, request: Request, *args, **kwargs) -> Response:
        ''' unlike '''
        queryset = self.get_queryset().filter(user=request.user)
        if not queryset.exists():
            return Response({'detail': 'Already not liked.'}, status=status.HTTP_404_NOT_FOUND)
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
