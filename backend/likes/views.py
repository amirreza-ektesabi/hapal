from likes.models import Like
from likes.serializers import LikeSerializer
from comments.models import Comment
from posts.models import Post
from lists.models import List
from baseapp.views import PageNumberPaginationWithSize, ListCreateRelatedAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly


class ObjectPageLikes(ListCreateRelatedAPIView):
    queryset = Like.objects.select_related('user') \
        .prefetch_related('liked', 'liked__user')
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = PageNumberPaginationWithSize(40)
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
    
    def post(self, request, *args, **kwargs):
        if self.get_queryset().filter(user=request.user).exists():
            return Response({'detail': 'Already liked.'}, status=status.HTTP_302_FOUND)
        return super().post(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        ''' unlike '''
        queryset = self.get_queryset().filter(user=request.user)
        if not queryset.exists():
            return Response({'detail': 'Already not liked.'}, status=status.HTTP_404_NOT_FOUND)
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
