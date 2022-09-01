from comments.views import CommentPage, ObjectPageComments
from likes.views import ObjectPageLikes
from django.urls import path


path_kwargs = {'type': 'comment'}

urlpatterns = [
    path('<uuid:uuid>/', CommentPage.as_view(), name='comment_page'),
    path('<uuid:uuid>/comments/', ObjectPageComments.as_view(), path_kwargs),
    path('<uuid:uuid>/likes/', ObjectPageLikes.as_view(), path_kwargs),
]
