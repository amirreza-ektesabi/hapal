from lists.models import List
from baseapp.admin import SharedBaseAdmin, link_to_listpage
from django.contrib import admin
from django.db.models import QuerySet, Count, Q
from django.contrib.contenttypes.models import ContentType
from django.forms import Textarea
from django.http import HttpRequest


@admin.register(List)
class ListAdmin(SharedBaseAdmin):
    fields = [
        'user',
        'uuid',
        'title',
        'description',
        'header',
        'created',
    ]
    readonly_fields = [
        'user',
        'uuid',
        'created',
    ]
    list_display = [
        'uuid',
        'title',
        'owner',
        'followers_',
        'posts_',
        'comments_',
        'likes_',
    ]
    search_fields = [
        'title__icontains',
        'description__icontains',
    ]

    def get_form(self, request: HttpRequest, obj=None, **kwargs):
        kwargs['widgets'] = {'description': Textarea}
        return super().get_form(request, obj, **kwargs)

    @admin.display(ordering='followers_count', description='followers')
    def followers_(self, list: List):
        return link_to_listpage(
            list.followers_count,
            'follows_follow',
            followed_id=list.id,
            followed_type=ContentType.objects.get_for_model(
                self.model).id,
        )

    @admin.display(ordering='posts_count', description='posts')
    def posts_(self, list: List):
        return link_to_listpage(
            list.posts_count,
            'posts_post',
            added_to_id=list.id,
        )

    def get_queryset(self, request: HttpRequest) -> QuerySet:
        return super().get_queryset(request).annotate(
            followers_count=Count('followers', distinct=True),
            posts_count=Count(
                'posts',
                distinct=True,
                filter=Q(posts__deleted_at__isnull=True)
            ),
        )
