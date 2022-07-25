from django.contrib import admin
from django.http import HttpRequest

from baseapp.admin import SharedBaseAdmin, link_to_objectpage
from .models import Post


@admin.register(Post)
class PostAdmin(SharedBaseAdmin):
    fields = [
        'user',
        'uuid',
        'added_to',
        'title',
        'access_level',
        'who_reply',
        'created',
    ]
    readonly_fields = [
        'user',
        'uuid',
        'added_to',
        'created',
    ]
    list_display = [
        'uuid',
        'owner',
        'list_added_to',
        'title',
        'comments_count',
        'likes_count',
    ]
    search_fields = [
        'title__icontains',
    ]
    list_select_related = [
        'user',
        'added_to',
    ]

    def has_add_permission(self, request: HttpRequest, obj=None):
        return False

    @admin.display(ordering='added_to__id', description='list')
    def list_added_to(self, post: Post):
        return link_to_objectpage(
            str(post.added_to),
            post.added_to.app_model_label,
            post.added_to.id,
        )
