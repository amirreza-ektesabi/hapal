from follows.models import Follow
from baseapp.admin import link_to_objectpage
from django.contrib import admin
from django.db.models import QuerySet
from django.http import HttpRequest


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    fields = [
        'user',
        'followed',
        'created',
    ]
    list_display = [
        'id',
        'follower',
        'followed_',
    ]
    list_per_page = 25
    list_select_related = [
        'user'
    ]

    def has_add_permission(self, request: HttpRequest) -> bool:
        return False

    def has_change_permission(self, request: HttpRequest, obj=None) -> bool:
        return False

    @admin.display(ordering='user_id', description='follower')
    def follower(self, follow: Follow):
        return link_to_objectpage(
            str(follow.user),
            follow.user.app_model_label,
            follow.user.id,
        )

    @admin.display(ordering='followed_id', description='followed')
    def followed_(self, follow: Follow):
        return link_to_objectpage(
            str(follow.followed),
            follow.followed.app_model_label,
            follow.followed_id,
        )

    def get_queryset(self, request: HttpRequest) -> QuerySet:
        return super().get_queryset(request).prefetch_related('followed')
