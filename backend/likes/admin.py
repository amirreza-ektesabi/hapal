from likes.models import Like
from baseapp.admin import link_to_objectpage
from django.contrib import admin
from django.db.models import QuerySet
from django.http import HttpRequest


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    fields = [
        'user',
        'liked',
        'created',
    ]
    list_display = [
        'id',
        'user_',
        'liked_',
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

    @admin.display(ordering='user_id', description='user')
    def user_(self, like: Like):
        opts = like.user._meta
        return link_to_objectpage(
            str(like.user),
            '{}_{}'.format(opts.app_label, opts.model_name),
            like.user.id,
        )

    @admin.display(ordering='liked_id', description='liked')
    def liked_(self, like: Like):
        return link_to_objectpage(
            str(like.liked),
            like.liked.app_model_label,
            like.liked_id,
        )

    def get_queryset(self, request: HttpRequest) -> QuerySet:
        return super().get_queryset(request).prefetch_related('liked')
