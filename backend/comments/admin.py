from comments.models import Comment
from baseapp.admin import SharedBaseAdmin, link_to_objectpage
from django.forms import Textarea
from django.contrib import admin
from django.db.models import QuerySet
from django.http import HttpRequest


@admin.register(Comment)
class CommentAdmin(SharedBaseAdmin):
    fields = [
        'user',
        'uuid',
        'body',
        'access_level',
        'who_reply',
        'replied_to',
        'created',
        'updated',
    ]
    readonly_fields = [
        'user',
        'uuid',
        'created',
        'updated',
        'replied_to',
    ]
    list_display = [
        'uuid',
        'owner',
        'truncated_body',
        'replied_to',
        'comments_',
        'likes_',
    ]
    search_fields = [
        'body__icontains',
    ]
    list_select_related = [
        'user',
        'replied_to_type',
    ]

    def has_add_permission(self, request: HttpRequest, obj=None):
        return False

    def get_form(self, request: HttpRequest, obj=None, **kwargs):
        kwargs['widgets'] = {'body': Textarea}
        return super().get_form(request, obj, **kwargs)

    @admin.display(description='body')
    def truncated_body(self, comment: Comment):
        return '{}...'.format(comment.body[:85]) if len(comment.body) > 90 else \
               comment.body

    @admin.display(description='reply to')
    def replied_to(self, comment: Comment):
        return link_to_objectpage(
            str(comment.replied_to),
            comment.replied_to.app_model_label,
            comment.replied_to_id,
        )

    def get_queryset(self, request: HttpRequest) -> QuerySet:
        return super().get_queryset(request).prefetch_related('replied_to')
