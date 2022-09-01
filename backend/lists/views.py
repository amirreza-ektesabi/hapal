from lists.models import List
from lists.serializers import ListSerializer
from accounts.models import Account
from baseapp.permissions import IsOwnerOrReadOnly
from baseapp.views import PageNumberPaginationWithSize, ListRelatedAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.generics import RetrieveUpdateDestroyAPIView, CreateAPIView


class ListPage(RetrieveUpdateDestroyAPIView):
    queryset = List.objects.select_related('user') \
        .prefetch_related('posts', 'comments', 'followers', 'likes')
    serializer_class = ListSerializer
    lookup_field = 'uuid'
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]


class CreateList(CreateAPIView):
    queryset = List.objects.all()
    serializer_class = ListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(**{
            'user_id': self.request.user.id,
        })


class ProfilePageLists(ListRelatedAPIView):
    queryset = List.objects.select_related('user') \
        .prefetch_related('posts', 'comments', 'followers', 'likes') \
            .order_by('-created')
    serializer_class = ListSerializer
    pagination_class = PageNumberPaginationWithSize(10)
    relateds = {
        'account': {
            'lookup_field': 'username',
            'model': Account,
            'related_field': 'user',
            'related_query_name': 'user'
        }
    }
