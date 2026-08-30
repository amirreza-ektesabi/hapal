from general.views import Explore

from django.urls import path


urlpatterns = [
    path('explore/', Explore.as_view(), name='top_lists'),
]
