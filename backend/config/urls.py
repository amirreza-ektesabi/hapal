from accounts.views import AccountAutocomp
from django.contrib import admin
from django.urls import path, include
from django.contrib.staticfiles.storage import staticfiles_storage
from django.views.generic.base import RedirectView


admin.site.site_header = 'Hapal Admin'
admin.site.index_title = 'Admin Panel'

urlpatterns = [
    path(
        'admin/account-autocomplete/',
        AccountAutocomp.as_view(),
        name='account-autocomplete',
    ),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('admin/', admin.site.urls),
    path('__debug__/', include('debug_toolbar.urls')),
    path('favicon.ico/',
         RedirectView.as_view(url=staticfiles_storage.url('img/favicon.ico'))),

    path('<str:username>/', include('accounts.urls')),
    path('list/', include('lists.urls')),
    path('post/', include('posts.urls')),
    path('comment/', include('comments.urls')),
]
