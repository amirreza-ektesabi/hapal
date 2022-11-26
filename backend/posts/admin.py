from posts.models import Post
from baseapp.admin import SharedBaseAdmin, link_to_objectpage

from django.contrib import admin
from django.db.models import QuerySet, Count
from django.http import HttpRequest
from django.utils.safestring import SafeString


@admin.register(Post)
class PostAdmin(SharedBaseAdmin):
    fields = [
        'user',
        'uuid',
        'added_to',
        'title',
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
        'properties_',
        'comments_',
        'likes_',
    ]
    search_fields = [
        'title__icontains',
    ]
    list_select_related = [
        'user',
        'added_to',
    ]

    @admin.display(ordering='added_to__id', description='list')
    def list_added_to(self, post: Post) -> SafeString:
        return link_to_objectpage(
            str(post.added_to),
            post.added_to.app_model_label,
            post.added_to.id,
        )
    
    @admin.display(ordering='properties_count', description='properties')
    def properties_(self, object: Post) -> int:
        return object.properties_count

    def get_queryset(self, request: HttpRequest) -> QuerySet:
        return super().get_queryset(request).annotate(
            properties_count=Count('properties', distinct=True),
        )
