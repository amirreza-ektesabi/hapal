from accounts.models import Account
from lists.models import List
from posts.models import Post
from .serializers import ProfileSerializer, ProfileAboutSerializer
from lists.serializers import ListSerializer
from posts.serializers.post import PostSerializer
from math import ceil
from dal import autocomplete
from rest_framework.generics import RetrieveUpdateDestroyAPIView, RetrieveAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpRequest
from django.urls import reverse


class AccountAutocomp(autocomplete.Select2QuerySetView):
    def get_queryset(self):
        qs = Account.objects.all()
        if self.q:
            qs = qs.filter(username__istartswith=self.q)
        return qs


class ProfilePage(RetrieveUpdateDestroyAPIView):
    queryset = Account.objects.prefetch_related(
        'followers',
        'followings',
        'lists',
        'posts',
        'comments',
        'likes'
    )
    serializer_class = ProfileSerializer
    lookup_field = 'username'

    def get_queryset(self):
        username = self.kwargs[self.lookup_field]
        return super().get_queryset().filter(
            username=username
        )


class ProfilePageAbout(RetrieveAPIView):
    queryset = Account.objects.all()
    serializer_class = ProfileAboutSerializer
    lookup_field = 'username'

    def get_queryset(self):
        username = self.kwargs[self.lookup_field]
        return super().get_queryset().filter(
            username=username
        )


@api_view(['GET'])
def profile_page_timeline(request: HttpRequest, **kwargs):
    def invalid_page():
        return Response({"detail": "Invalid page."}, status.HTTP_404_NOT_FOUND)

    page_size = 10

    username = kwargs['username']
    page = request.GET.get('page', 1)
    if not page.isdecimal():
        return invalid_page()
    page = int(page)

    posts_queryset = Post.objects.select_related('user', 'added_to', 'added_to__user'). \
        prefetch_related('comments', 'likes'). \
        filter(user__username=username)
    lists_queryset = List.objects.select_related('user'). \
        prefetch_related('posts', 'comments', 'followers', 'likes'). \
        filter(user__username=username)

    created_values = posts_queryset.union(lists_queryset). \
        order_by('-created').values('created')

    results_count = created_values.count()
    number_of_pages = ceil(results_count / page_size)
    if not 1 <= page <= number_of_pages:
        return invalid_page()

    created_range = (
        created_values[min(results_count, page * page_size) - 1]['created'],
        created_values[(page - 1) * page_size]['created']
    )

    data = {
        'count': results_count,
        'next': '{}?page={}'.format(reverse('account_page_timeline', args=[username]), page + 1) if page != number_of_pages else None,
        'previous': '{}?page={}'.format(reverse('account_page_timeline', args=[username]), page - 1) if page != 1 else None,
        'results': [],
    }

    data['results'].extend(PostSerializer(posts_queryset.filter(
        created__range=created_range), many=True).data)
    data['results'].extend(ListSerializer(lists_queryset.filter(
        created__range=created_range), many=True).data)
    data['results'].sort(key=lambda x: x['created'], reverse=True)

    return Response(data)
