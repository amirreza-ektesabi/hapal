from posts.views.post import PostPage
from posts.views.property import PostPageProperties
from comments.views import ObjectPageComments
from likes.views import ObjectPageLikes

from django.urls import path, include


post_urls = [
    path('', PostPage.as_view(), name='post_page'),
    path('properties/', PostPageProperties.as_view(), name='post_properties'),
    path('comments/', ObjectPageComments.as_view(), name='post_comments'),
    path('likes/', ObjectPageLikes.as_view(), name='post_likes'),
]

urlpatterns = [
    path('<str:uuid>/', include(post_urls), kwargs={'type': 'post'}),
]
