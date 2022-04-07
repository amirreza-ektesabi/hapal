from django.db import models

from django.utils.translation import gettext_lazy as _

from uuid import uuid4

from account.models import Account


class List(models.Model):
    uuid = models.UUIDField(
        unique=True, default=uuid4, editable=False
    )
    user = models.ForeignKey(
        'account.Account',
        on_delete=models.SET(Account.get_sentinel_user),
        editable=False,
        related_name='owned_lists'
    )
    title = models.CharField(max_length=50, blank=True)
    description = models.CharField(max_length=140, blank=True)

    header = models.ImageField(upload_to='list', null=True)

    class AccessLevel(models.IntegerChoices):
        PUBLIC = 0
        PRIVATE = 1

    access_level = models.IntegerField(
        choices=AccessLevel.choices,
        default=AccessLevel.PUBLIC
    )

    class WhoAdd(models.IntegerChoices):
        EVERY_ONE = 0
        JUST_USER = 1

    who_add = models.IntegerField(
        choices=WhoAdd.choices,
        default=WhoAdd.EVERY_ONE
    )

    class WhoReply(models.IntegerChoices):
        EVERY_ONE = 0
        JUST_USER = 1

    who_reply = models.IntegerField(
        choices=WhoReply.choices,
        default=WhoReply.EVERY_ONE
    )

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    """
    relists
    posts
    likes
    comments
    bell_notifications
    followers
    follow_requests
    bookmarks
    """
    
    class Meta:
        verbose_name = _('list')
        verbose_name_plural = _('lists')
    
    def __str__(self):
        return '{} owner:{}'.format(self.title, self.user.username)

