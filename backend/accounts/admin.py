from accounts.models import Account
from baseapp.admin import link_to_listpage
from django.contrib import admin
from django.db.models import QuerySet, Count, Q
from django.contrib.contenttypes.models import ContentType
from django.http import HttpRequest


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    fields = [
        'username',
        'password',
        'name',
        'bio',
        'email',
        'phone_number',
        'location',
        'birth_date',
        'avatar',
        'header',
        'access_level',
        'birth_date_access_level',
        'is_superuser',
        'is_staff',
        'date_joined',
    ]
    readonly_fields = [
        'is_superuser',
        'date_joined',
    ]
    list_display = [
        'username',
        'followers_',
        'followings_',
        'lists_',
        'posts_',
        'comments_',
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
    def followers_(self, account: Account):
        return link_to_listpage(
            account.followers_count,
            'follows_follow',
            followed_id=account.id,
            followed_type=ContentType.objects.get_for_model(self.model).id,
        )

    @admin.display(ordering='followings_count', description='followings')
    def followings_(self, account: Account):
        return link_to_listpage(
            account.followings_count,
            'follows_follow',
            user__id=account.id,
        )

    @admin.display(ordering='lists_count', description='lists')
    def lists_(self, account: Account):
        return link_to_listpage(
            account.lists_count,
            'lists_list',
            user_id=account.id,
        )

    @admin.display(ordering='posts_count', description='posts')
    def posts_(self, account: Account):
        return link_to_listpage(
            account.posts_count,
            'posts_post',
            user_id=account.id,
        )

    @admin.display(ordering='comments_count', description='comments')
    def comments_(self, account: Account):
        return link_to_listpage(
            account.comments_count,
            'comments_comment',
            user_id=account.id,
        )

    def get_queryset(self, request: HttpRequest) -> QuerySet:
        return super().get_queryset(request).annotate(
            followers_count=Count('followers', distinct=True),
            followings_count=Count('followings', distinct=True),
            lists_count=Count(
                'lists',
                distinct=True,
                filter=Q(lists__deleted_at__isnull=True)
            ),
            posts_count=Count(
                'posts',
                distinct=True,
                filter=Q(posts__deleted_at__isnull=True)
            ),
            comments_count=Count(
                'comments',
                distinct=True,
                filter=Q(comments__deleted_at__isnull=True)
            ),
        )
