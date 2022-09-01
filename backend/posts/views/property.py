from posts.models import Post
from posts.models import Property
from baseapp.permissions import IsRelatedOwnerOrReadOnly
from posts.serializers.property import PropertyListCreateSerializer, PropertyUpdateSerializer
from baseapp.views import PageNumberPaginationWithSize, RelatedAPIView, ListCreateRelatedAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from django.db.models import F


class PropertyView(RelatedAPIView, RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.select_related('post') \
        .prefetch_related('pairs')
    serializer_class = PropertyUpdateSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsRelatedOwnerOrReadOnly]
    lookup_field = 'puuid'
    relateds = {
        'post': {
            'lookup_field': 'uuid',
            'model': Post,
            'related_field': 'post',
            'related_query_name': 'post'
        }
    }

    def perform_destroy(self, instance: Property):
        deleted_order_number = instance.order_number
        instance.delete()
        Property.objects.filter(post=instance.post, order_number__gt=deleted_order_number) \
            .update(order_number=F('order_number')-1)


class PostPageProperties(ListCreateRelatedAPIView):
    queryset = Property.objects.select_related('post') \
        .prefetch_related('pairs') \
            .order_by('order_number')
    serializer_class = PropertyListCreateSerializer
    pagination_class = PageNumberPaginationWithSize(10)
    permission_classes = [IsAuthenticatedOrReadOnly, IsRelatedOwnerOrReadOnly]
    relateds = {
        'post': {
            'lookup_field': 'uuid',
            'model': Post,
            'related_field': 'post',
            'related_query_name': 'post'
        }
    }

    def perform_create(self, serializer):
        serializer.save(**{
            self.related['related_field']: self.get_related_object_or_404(),
        })
