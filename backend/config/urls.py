from django.contrib import admin
from django.urls import path, re_path, include

from accounts.views import AccountAutocomp


admin.site.site_header = 'Hapal Admin'
admin.site.index_title = 'Admin Panel'

urlpatterns = [
    re_path(
        r'^admin/account-autocomplete/$',
        AccountAutocomp.as_view(),
        name='account-autocomplete',
    ),
    path('admin/', admin.site.urls),
    path('__debug__/', include('debug_toolbar.urls')),
]
