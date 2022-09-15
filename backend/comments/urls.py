from comments.views import CommentPage, ObjectPageComments
from likes.views import ObjectPageLikes
from django.urls import path, include


comment_urls = [
    path('', CommentPage.as_view(), name='comment_page'),
    path('comments/', ObjectPageComments.as_view(), name='comment_comments'),
    path('likes/', ObjectPageLikes.as_view(), name='comment_likes'),
]

urlpatterns = [
    path('<uuid:uuid>/', include(comment_urls), kwargs={'type': 'comment'}),
]
