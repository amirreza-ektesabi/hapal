from .views import ProfilePage, profile_page_timeline
from comments.views import ObjectPageComments
from follows.views import ObjectPageFollows
from django.urls import path


path_kwargs = {'shared_object_type': 'account', 'lookup_field': 'username'}

urlpatterns = [
    path('', ProfilePage.as_view(), name='account_page'),

    path('followers/', ObjectPageFollows.as_view(),
         {**path_kwargs, 'side': 'followers'}),
    path('following/', ObjectPageFollows.as_view(),
         {**path_kwargs, 'side': 'following'}),

    path('timeline/', profile_page_timeline,
         path_kwargs, name='account_page_timeline'),
]
