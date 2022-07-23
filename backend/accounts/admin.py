from django.db.models import QuerySet, Count, Q
from django.contrib.contenttypes.models import ContentType
from django.contrib import admin, messages
from django.http import HttpRequest, HttpResponseRedirect
from django.urls import reverse
from django.utils.translation import ngettext, gettext_lazy as _
from django.contrib.admin.utils import model_ngettext

from .models import Account
from baseapp.admin import link_to_listpage


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    exclude = [
        'deleted'
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

    def delete_view(self, request: HttpRequest, object_id: int, extra_context=None):
        queryset = self.model.objects.filter(pk=object_id)
        obj_display = queryset.first()
        queryset.update(deleted=True)

        self.message_user(
            request,
            _("The %(name)s “%(obj)s” was deleted successfully.") % {
                'name': self.opts.verbose_name,
                'obj': obj_display,
            },
            messages.SUCCESS,
        )
        return HttpResponseRedirect(reverse('admin:{}_{}_changelist'.format(self.opts.app_label, self.opts.model_name)))

    @admin.action(description='Delete selected items')
    def delete_selected(self, request: HttpRequest, queryset: QuerySet):
        deleted_count = queryset.update(deleted=True)

        msg = ngettext(
            '%(count)s %(name)s was deleted successfully.',
            '%(count)s %(name)s were deleted successfully.',
            deleted_count,
        ) % {
            'count': deleted_count,
            'name': model_ngettext(self.opts, deleted_count),
        }
        self.message_user(request, msg, messages.SUCCESS)

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
            deleted=False,
        )

    @admin.display(ordering='posts_count', description='posts')
    def posts(self, account: Account):
        return link_to_listpage(
            account.posts_count,
            'posts_post',
            user_id=account.id,
            deleted=False,
        )

    @admin.display(ordering='comments_count', description='comments')
    def comments(self, account: Account):
        return link_to_listpage(
            account.comments_count,
            'comments_comment',
            user_id=account.id,
            deleted=False,
        )

    def get_queryset(self, request: HttpRequest) -> QuerySet:
        return super().get_queryset(request).filter(deleted=False).annotate(
            followers_count=Count('followers', distinct=True),
            followings_count=Count('followings', distinct=True),
            lists_count=Count('lists', distinct=True,
                              filter=Q(lists__deleted=False)),
            posts_count=Count('posts', distinct=True,
                              filter=Q(posts__deleted=False)),
            comments_count=Count('comments', distinct=True,
                                 filter=Q(comments__deleted=False)),
        )
