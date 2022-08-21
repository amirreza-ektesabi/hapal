from posts.models import Post
from baseapp.views import PageNumberPaginationWithSize
from posts.models import Property
from posts.permissions import PropertyPermission
from posts.serializers.property import PropertyCreateSerializer, PropertyUpdateSerializer
from django.db.models import F
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.exceptions import NotFound


class PropertyView(RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.select_related('post'). \
        prefetch_related('pairs')
    serializer_class = PropertyUpdateSerializer
    lookup_field = 'puuid'
    permission_classes = [IsAuthenticatedOrReadOnly, PropertyPermission]

    def check_added_to_exists(self):
        if not Post.objects.filter(uuid=self.kwargs['uuid']).exists() or \
           not Property.objects.filter(puuid=self.kwargs['puuid']).exists():
            raise NotFound()

    def initial(self, request, *args, **kwargs):
        self.check_added_to_exists()
        return super().initial(request, *args, **kwargs)

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

    def check_added_to_exists(self):
        if not Post.objects.filter(uuid=self.kwargs['uuid']).exists():
            raise NotFound()

    def initial(self, request, *args, **kwargs):
        self.check_added_to_exists()
        return super().initial(request, *args, **kwargs)

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
