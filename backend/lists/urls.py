from lists.views import ListPage, CreateList
from posts.views.post import ListPagePosts
from comments.views import ObjectPageComments
from likes.views import ObjectPageLikes
from follows.views import ObjectPageFollows

from django.urls import path, include


list_urls = [
    path('', ListPage.as_view(), name='list_page'),
    path('posts/', ListPagePosts.as_view(), name='list_posts'),
    path('comments/', ObjectPageComments.as_view(), name='list_comments'),
    path('likes/', ObjectPageLikes.as_view(), name='list_likes'),
    path('followers/', ObjectPageFollows.as_view(), name='list_followers'),
]

urlpatterns = [
    path('create/', CreateList.as_view(), name='list_create'),
    path('<uuid:uuid>/', include(list_urls), kwargs={'type': 'list'}),
]