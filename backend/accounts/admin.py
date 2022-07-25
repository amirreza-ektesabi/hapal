from django.db.models import QuerySet, Count
from django.contrib.contenttypes.models import ContentType
from django.contrib import admin
from django.http import HttpRequest

from .models import Account
from baseapp.admin import link_to_listpage


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    exclude = [
        'deleted_at'
    ]
    list_display = [
        'username',
        'followers',
        'following',
        'lists',
        'posts',
        'comments',
    ]
    actions = [
        'delete_selected'
    ]
    list_per_page = 25
    search_fields = [
        'username',
    ]

    def __init__(self, model, admin_site):
        super().__init__(model, admin_site)
        self.opts = self.model._meta

    @admin.display(ordering='followers_count', description='followers')
    def followers(self, account: Account):
        return link_to_listpage(
            account.followers_count,
            'follows_follow',
            followed_id=account.id,
            followed_type=ContentType.objects.get_for_model(
                self.model).id,
        )

    @admin.display(ordering='followings_count', description='followings')
    def following(self, account: Account):
        return link_to_listpage(
            account.followings_count,
            'follows_follow',
            follower__id=account.id,
        )

    @admin.display(ordering='lists_count', description='lists')
    def lists(self, account: Account):
        return link_to_listpage(
            account.lists_count,
            'lists_list',
            user_id=account.id,
        )

    @admin.display(ordering='posts_count', description='posts')
    def posts(self, account: Account):
        return link_to_listpage(
            account.posts_count,
            'posts_post',
            user_id=account.id,
        )

    @admin.display(ordering='comments_count', description='comments')
    def comments(self, account: Account):
        return link_to_listpage(
            account.comments_count,
            'comments_comment',
            user_id=account.id,
        )

    def get_queryset(self, request: HttpRequest) -> QuerySet:
        return super().get_queryset(request).annotate(
            followers_count=Count('followers', distinct=True),
            followings_count=Count('followings', distinct=True),
            lists_count=Count('lists', distinct=True),
            posts_count=Count('posts', distinct=True),
            comments_count=Count('comments', distinct=True),
        )
