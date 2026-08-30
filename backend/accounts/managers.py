from baseapp.managers import FollowableQuerySetMixin

from django.contrib.auth.models import UserManager

from softdelete.models import SoftDeleteManager, SoftDeleteQuerySet


class AccountQueryset(FollowableQuerySetMixin, SoftDeleteQuerySet):
    ...


class AccountManager(SoftDeleteManager, UserManager):
    _queryset_class = AccountQueryset
