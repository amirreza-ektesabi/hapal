from django.contrib import admin
from django.db.models import QuerySet, Q
from django.http import HttpRequest

from .models import Like
from baseapp.admin import link_to_objectpage


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    fields = [
        'user',
        'liked',
        'created',
    ]
    list_display = [
        'id',
        'like_user',
        'liked',
    ]
    list_per_page = 25
    list_select_related = [
        'user',
        'liked_type',
    ]

    def has_add_permission(self, request: HttpRequest) -> bool:
        return False

    def has_change_permission(self, request: HttpRequest, obj=None) -> bool:
        return False

    @admin.display(ordering='user__id', description='user')
    def like_user(self, like: Like):
        opts = like.user._meta
        return link_to_objectpage(
            str(like.user),
            '{}_{}'.format(opts.app_label, opts.model_name),
            like.user.id,
        )

    @admin.display(description='liked')
    def liked(self, like: Like):
        return link_to_objectpage(
            str(like.liked),
            like.liked.app_model_label,
            like.liked_id,
        )

    def get_queryset(self, request: HttpRequest) -> QuerySet:
        return super().get_queryset(request).prefetch_related('liked').filter(
            Q(liked_list__deleted=False) |
            Q(liked_post__deleted=False) |
            Q(liked_comment__deleted=False)
        )