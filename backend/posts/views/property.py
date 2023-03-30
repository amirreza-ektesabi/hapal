from posts.models import Post, Property
from posts.serializers.property import PropertySerializer
from baseapp.views import ListRelatedAPIView
from baseapp.permissions import IsRelatedOwnerOrReadOnly

from rest_framework.permissions import IsAuthenticatedOrReadOnly


class PostPageProperties(ListRelatedAPIView):
    queryset = Property.objects.select_related('post') \
        .prefetch_related('pairs') \
        .order_by('order_number')
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsRelatedOwnerOrReadOnly]
    relateds = {
        'post': {
            'lookup_field': 'uuid',
            'model': Post,
            'related_field': 'post',
            'related_query_name': 'post'
        }
    }
