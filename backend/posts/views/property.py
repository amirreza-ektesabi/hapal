from baseapp.views import PageNumberPaginationWithSize
from posts.models import Property
from posts.permissions import PropertyPermission
from posts.serializers.property import PropertyCreateSerializer, PropertyUpdateSerializer
from django.db.models import F
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView


class PropertyView(RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.select_related('post'). \
        prefetch_related('pairs')
    serializer_class = PropertyUpdateSerializer
    lookup_field = 'puuid'
    permission_classes = [IsAuthenticatedOrReadOnly, PropertyPermission]

    def get_queryset(self):
        post_uuid = self.kwargs['uuid']
        property_uuid = self.kwargs['puuid']

        return super().get_queryset().filter(
            post__uuid=post_uuid, puuid=property_uuid
        )

    def perform_destroy(self, instance: Property):
        deleted_order_number = instance.order_number
        instance.delete()
        Property.objects.filter(post=instance.post, order_number__gt=deleted_order_number). \
            update(order_number=F('order_number')-1)


class PostPageProperties(ListCreateAPIView):
    queryset = Property.objects.select_related('post'). \
        prefetch_related('pairs')
    serializer_class = PropertyCreateSerializer
    pagination_class = PageNumberPaginationWithSize(10)
    permission_classes = [IsAuthenticatedOrReadOnly, PropertyPermission]

    def get_queryset(self):
        post_uuid = self.kwargs['uuid']

        return super().get_queryset().filter(
            post__uuid=post_uuid
        ).order_by('order_number')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update(dict(
            post_uuid=self.kwargs['uuid'],
        ))
        return context
