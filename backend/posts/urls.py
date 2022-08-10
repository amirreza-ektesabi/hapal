from posts.views.post import PostPage
from posts.views.property import PostPageProperties, PropertyView
from comments.views import ObjectPageComments
from likes.views import ObjectPageLikes
from django.urls import path


path_kwargs = {'shared_object_type': 'post', 'lookup_field': 'uuid'}

urlpatterns = [
    path('<uuid:uuid>/', PostPage.as_view(), name='post_page'),
    path('<uuid:uuid>/comments/', ObjectPageComments.as_view(), path_kwargs),
    path('<uuid:uuid>/likes/', ObjectPageLikes.as_view(), path_kwargs),
    
    path('<uuid:uuid>/properties/', PostPageProperties.as_view(), path_kwargs),
    path('<uuid:uuid>/properties/<uuid:puuid>/', PropertyView.as_view(), path_kwargs),
]
