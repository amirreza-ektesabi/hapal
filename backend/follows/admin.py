from django.contrib import admin
from django.db.models import QuerySet
from django.http import HttpRequest

from .models import Follow
from baseapp.admin import link_to_objectpage


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    fields = [
        'follower',
        'followed',
        'created',
    ]
    list_display = [
        'id',
        'follower_user',
        'followed',
    ]
    list_per_page = 25
    list_select_related = [
        'follower'
    ]

    def has_add_permission(self, request: HttpRequest) -> bool:
        return False

    def has_change_permission(self, request: HttpRequest, obj=None) -> bool:
        return False

    @admin.display(ordering='follower__id', description='follower')
    def follower_user(self, follow: Follow):
        return link_to_objectpage(
            str(follow.follower),
            follow.follower.app_model_label,
            follow.follower.id,
        )

    @admin.display(ordering='followed_id', description='followed')
    def followed(self, follow: Follow):
        return link_to_objectpage(
            str(follow.followed),
            follow.followed.app_model_label,
            follow.followed_id,
        )

    def get_queryset(self, request: HttpRequest) -> QuerySet:
        return super().get_queryset(request).prefetch_related('followed')
