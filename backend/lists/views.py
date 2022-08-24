from accounts.models import Account
from lists.models import List
from lists.serializers import ListSerializer
from baseapp.permissions import IsOwnerOrReadOnly
from baseapp.views import PageNumberPaginationWithSize
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.generics import RetrieveUpdateDestroyAPIView, CreateAPIView, ListAPIView
from rest_framework.exceptions import NotFound


class ListPage(RetrieveUpdateDestroyAPIView):
    queryset = List.objects.select_related('user'). \
        prefetch_related('posts', 'comments', 'followers', 'likes')
    serializer_class = ListSerializer
    lookup_field = 'uuid'
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]


class CreateList(CreateAPIView):
    queryset = List.objects.all()
    serializer_class = ListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        lookup_field = self.kwargs['lookup_field']
        value = self.kwargs[lookup_field]

        return super().get_queryset().filter(
            **{'user__{}'.format(lookup_field): value}
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update(dict(
            user_id=self.request.user.id,
        ))
        return context


class ProfilePageLists(ListAPIView):
    queryset = List.objects.select_related('user'). \
        prefetch_related('posts', 'comments', 'followers', 'likes')
    serializer_class = ListSerializer
    pagination_class = PageNumberPaginationWithSize(10)

    def check_user_exists(self):
        lookup_field = self.kwargs['lookup_field']
        value = self.kwargs[lookup_field]

        if not Account.objects.filter(**{lookup_field: value}).exists():
            raise NotFound()

    def initial(self, request, *args, **kwargs):
        self.check_user_exists()
        return super().initial(request, *args, **kwargs)

    def get_queryset(self):
        lookup_field = self.kwargs['lookup_field']
        value = self.kwargs[lookup_field]

        return super().get_queryset().filter(
            **{'user__{}'.format(lookup_field): value}
        ).order_by('-created')
