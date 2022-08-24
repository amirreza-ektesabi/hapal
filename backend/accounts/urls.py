from accounts.views import ProfilePage
from lists.views import ProfilePageLists
from posts.views.post import ProfilePagePosts
from follows.views import ObjectPageFollows
from django.urls import path


path_kwargs = {'shared_object_type': 'account', 'lookup_field': 'username'}

urlpatterns = [
    path('', ProfilePage.as_view(), name='account_page'),

    path('lists/', ProfilePageLists.as_view(),
         path_kwargs),
    path('posts/', ProfilePagePosts.as_view(),
         path_kwargs),
    path('followers/', ObjectPageFollows.as_view(),
         {**path_kwargs, 'side': 'followers'}),
    path('following/', ObjectPageFollows.as_view(),
         {**path_kwargs, 'side': 'following'}),
]
