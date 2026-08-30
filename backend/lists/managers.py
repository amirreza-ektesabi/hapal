from baseapp.managers import SharedBaseManager, SharedBaseQuerySet, FollowableQuerySetMixin


class ListQueryset(FollowableQuerySetMixin, SharedBaseQuerySet):
    ...


class ListManager(SharedBaseManager):
    _queryset_class = ListQueryset
