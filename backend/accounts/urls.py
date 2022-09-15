from accounts.views import ProfilePage
from lists.views import ProfilePageLists
from posts.views.post import ProfilePagePosts
from follows.views import ObjectPageFollows, ProfilePageFollowing
from django.urls import path, include


account_urls = [
    path('', ProfilePage.as_view(), name='account_page'),
    path('lists/', ProfilePageLists.as_view(), name='account_lists'),
    path('posts/', ProfilePagePosts.as_view(), name='account_posts'),
    path('followers/', ObjectPageFollows.as_view(), name='account_followers'),
    path('following/', ProfilePageFollowing.as_view(), name='account_following'),
]

urlpatterns = [
    path('<str:username>/', include(account_urls), kwargs={'type': 'account'}),
]
