from django.db import models
from django.contrib.contenttypes import fields as contenttypes_fields
from django.utils.translation import ngettext, gettext_lazy as _

from uuid import uuid4


class SharedBaseModel(models.Model):
    uuid = models.UUIDField(
        unique=True, default=uuid4, editable=False
    )
    user = models.ForeignKey(
        'accounts.Account',
        models.PROTECT,
        editable=False,
        related_name='%(class)ss',
        verbose_name=_("user"),
    )

    class AccessLevel(models.IntegerChoices):
        PUBLIC = 0
        PRIVATE = 1

    access_level = models.PositiveSmallIntegerField(
        choices=AccessLevel.choices,
        default=AccessLevel.PUBLIC
    )

    class WhoReply(models.IntegerChoices):
        EVERY_ONE = 0
        JUST_ME = 1

    who_reply = models.PositiveSmallIntegerField(
        choices=WhoReply.choices,
        default=WhoReply.EVERY_ONE
    )

    comments = contenttypes_fields.GenericRelation(
        'comments.Comment',
        content_type_field='replied_to_type',
        object_id_field='replied_to_id',
        related_query_name='replied_to_%(class)s',
    )

    likes = contenttypes_fields.GenericRelation(
        'likes.Like',
        content_type_field='liked_type',
        object_id_field='liked_id',
        related_query_name='liked_%(class)s',
    )
    
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    deleted = models.BooleanField(default=False)

    class Meta:
        abstract = True

    def __str__(self) -> str:
        return 'Deleted' if self.deleted else '{} - {}'.format(self._meta.model_name.title(), self.id)

    @property
    def app_model_label(self) -> str:
        return '{}_{}'.format(self._meta.app_label, self._meta.model_name)
