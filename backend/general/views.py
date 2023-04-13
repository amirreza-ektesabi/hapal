from baseapp.views import (
    CheckObjectFollowedByCurrentUserMixin,
    CheckObjectLikedByCurrentUserMixin,
    CheckObjectUserFollowedByCurrentUserMixin
)
from lists.models import List
from lists.serializers import ListPreviewSerializer

from django.db.models import Count
from rest_framework.generics import ListAPIView


class Explore(CheckObjectLikedByCurrentUserMixin,
              CheckObjectFollowedByCurrentUserMixin,
              CheckObjectUserFollowedByCurrentUserMixin,
              ListAPIView):
    queryset = List.objects \
        .prefetch_related('posts', 'comments', 'followers', 'likes') \
        .annotate(likes_count=Count('likes')) \
        .order_by('-likes_count', '-created')[:3]
    serializer_class = ListPreviewSerializer
