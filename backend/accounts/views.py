from accounts.models import Account
from accounts.serializers import ProfileSerializer
from lists.models import List
from posts.models import Post
from lists.serializers import ListSerializer
from posts.serializers.post import PostSerializer
from math import ceil
from dal import autocomplete
from rest_framework.generics import RetrieveAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpRequest
from django.urls import reverse


class ProfilePage(RetrieveAPIView):
    queryset = Account.objects.prefetch_related(
        'followers',
        'followings',
    )
    serializer_class = ProfileSerializer
    lookup_field = 'username'


@api_view(['GET'])
def profile_page_timeline(request: HttpRequest, **kwargs):
    page_size = 10
        
    def invalid_page_response():
        return Response(
            {"detail": "Invalid page."},
            status.HTTP_404_NOT_FOUND,
        )
    
    username = kwargs['username']
    page = request.GET.get('page', '1')
    if not page.isdecimal():
        return invalid_page_response()
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
        return invalid_page_response()

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


class AccountAutocomp(autocomplete.Select2QuerySetView):
    def get_queryset(self):
        qs = Account.objects.all()
        if self.q:
            qs = qs.filter(username__istartswith=self.q)
        return qs
