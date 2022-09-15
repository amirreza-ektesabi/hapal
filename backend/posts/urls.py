from posts.views.post import PostPage
from posts.views.property import PostPageProperties, PropertyView
from comments.views import ObjectPageComments
from likes.views import ObjectPageLikes
from django.urls import path, include


property_urls = [
    path('', PostPageProperties.as_view(), name='post_properties'),
    path('<uuid:puuid>/', PropertyView.as_view(), name='property_page'),
]

post_urls = [
    path('', PostPage.as_view(), name='post_page'),
    path('comments/', ObjectPageComments.as_view(), name='post_comments'),
    path('likes/', ObjectPageLikes.as_view(), name='post_likes'),
    path('properties/', include(property_urls)),
]

urlpatterns = [
    path('<uuid:uuid>/', include(post_urls), kwargs={'type': 'post'}),
]
