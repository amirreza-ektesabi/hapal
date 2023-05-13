from baseapp.models import SharedBaseModel

from django.db.models import QuerySet, Count, Q
from django.contrib.contenttypes.models import ContentType
from django.contrib import admin
from django.http import HttpRequest
from django.utils.safestring import SafeString
from django.urls import reverse
from django.utils.html import format_html, urlencode

from typing import Any, Tuple


def link_to_listpage(text_to_show: Any, app_model_label: str, **kwargs) -> SafeString:
    href = (
        reverse('admin:{}_changelist'.format(app_model_label))
        + '?' + urlencode(kwargs)
    )
    return format_html('<a href="{}">{}</a>', href, str(text_to_show))


def link_to_objectpage(text_to_show: Any, app_model_label: str, *args) -> SafeString:
    href = reverse('admin:{}_change'.format(app_model_label), args=args)
    return format_html('<a href="{}">{}</a>', href, str(text_to_show))


class SharedBaseAdmin(admin.ModelAdmin):
    readonly_fields = [
        'user',
        'uuid',
    ]
    actions = [
        'delete_selected'
    ]
    list_select_related = [
        'user'
    ]
    list_filter = [
        'updated',
    ]
    list_per_page = 25

    def has_add_permission(self, request: HttpRequest) -> bool:
        return False

    def has_change_permission(self, request: HttpRequest, obj=None) -> bool:
        return False

    def has_delete_permission(self, request: HttpRequest, obj=None) -> bool:
        return False

    def __init__(self, model, admin_site):
        super().__init__(model, admin_site)
        self.opts = self.model._meta

    @admin.display(ordering='user__username', description='owner')
    def owner(self, object: SharedBaseModel) -> SafeString:
        user_opts = object.user._meta
        return link_to_objectpage(
            str(object.user),
            '{}_{}'.format(user_opts.app_label, user_opts.model_name),
            object.user.id,
        )

    @admin.display(ordering='comments_count', description='comments')
    def comments_(self, object: SharedBaseModel) -> SafeString:
        return link_to_listpage(
            object.comments_count,
            'comments_comment',
            replied_to_id=object.id,
            replied_to_type=ContentType.objects.get_for_model(
                self.model).id,
        )

    @admin.display(ordering='likes_count', description='likes')
    def likes_(self, object: SharedBaseModel) -> SafeString:
        return link_to_listpage(
            object.likes_count,
            'likes_like',
            liked_id=object.id,
            liked_type=ContentType.objects.get_for_model(
                self.model).id,
        )

    def get_queryset(self, request: HttpRequest) -> QuerySet:
        return super().get_queryset(request).annotate(
            likes_count=Count('likes', distinct=True),
            comments_count=Count(
                'comments',
                distinct=True,
                filter=Q(comments__deleted_at__isnull=True),
            ),
        )
