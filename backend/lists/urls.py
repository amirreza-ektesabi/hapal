from lists.views import ListPage
from posts.views.post import ObjectPagePosts
from comments.views import ObjectPageComments
from likes.views import ObjectPageLikes
from follows.views import ObjectPageFollows
from django.urls import path


path_kwargs = {'object_type': 'list', 'lookup_field': 'uuid'}

urlpatterns = [
    path('<uuid:uuid>/', ListPage.as_view(), name='list_page'),
    path('<uuid:uuid>/posts/', ObjectPagePosts.as_view(), path_kwargs),
    path('<uuid:uuid>/comments/', ObjectPageComments.as_view(), path_kwargs),
    path('<uuid:uuid>/likes/', ObjectPageLikes.as_view(), path_kwargs),
    path('<uuid:uuid>/followers/', ObjectPageFollows.as_view(),
         {**path_kwargs, 'side': 'followers'}),
]
