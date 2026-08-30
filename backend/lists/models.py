from lists.managers import ListManager
from baseapp.models import SharedBaseModel

from django.db import models
from django.contrib.contenttypes import fields as contenttypes_fields
from django.utils.translation import gettext_lazy as _


class List(SharedBaseModel):
    class WhoCanAddPost(models.IntegerChoices):
        JUST_ME = 1
        EVERYONE = 2

    title = models.CharField(
        max_length=255,
        blank=True
    )
    
    description = models.CharField(
        max_length=500,
        blank=True
    )
    
    header = models.ImageField(
        upload_to='images/list_headers',
        null=True, blank=True, default=None,
    )

    followers = contenttypes_fields.GenericRelation(
        'follows.Follow',
        content_type_field='followed_type',
        object_id_field='followed_id',
        related_query_name='followed_list',
    )

    who_can_add_post = models.PositiveSmallIntegerField(
        choices=WhoCanAddPost.choices,
        default=WhoCanAddPost.JUST_ME,
    )

    objects = ListManager()

    class Meta:
        verbose_name = _('list')
        verbose_name_plural = _('lists')
        ordering = ['-id']

    def delete(self, *args, **kwargs) -> None:
        super().delete(*args, **kwargs)

        self.followers.clear()
