from lists.views import ListPage, CreateList
from posts.views.post import ListPagePosts
from comments.views import ObjectPageComments
from likes.views import ObjectPageLikes
from follows.views import ObjectPageFollows
from django.urls import path


path_kwargs = {'type': 'list'}

urlpatterns = [
    path('create/', CreateList.as_view()),
    path('<uuid:uuid>/', ListPage.as_view(), path_kwargs, name='list_page'),
    path('<uuid:uuid>/posts/', ListPagePosts.as_view(), path_kwargs),
    path('<uuid:uuid>/comments/', ObjectPageComments.as_view(), path_kwargs),
    path('<uuid:uuid>/likes/', ObjectPageLikes.as_view(), path_kwargs),
    path('<uuid:uuid>/followers/', ObjectPageFollows.as_view(), path_kwargs),
]
