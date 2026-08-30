from django.core.exceptions import ValidationError
from django.db import models
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import fields as contenttypes_fields
from django.utils.translation import gettext_lazy as _


class Follow(models.Model):
    user = models.ForeignKey(
        'accounts.Account',
        models.CASCADE,
        editable=False,
        related_name='followings',
    )

    followed_limit_choices = (
        models.Q(app_label='accounts', model='account') |
        models.Q(app_label='lists', model='list')
    )

    followed_type = models.ForeignKey(
        ContentType,
        models.CASCADE,
        editable=False,
        limit_choices_to=followed_limit_choices,
        related_name='followers',
    )

    followed_id = models.PositiveIntegerField()

    followed = contenttypes_fields.GenericForeignKey(
        'followed_type',
        'followed_id'
    )

    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('follow')
        verbose_name_plural = _('follows')

        unique_together = ('user', 'followed_type', 'followed_id')

    def save(self, *args, **kwargs):
        # The API layer rejects self-follows with a 403; this guards direct
        # ORM usage. Must not be a CheckConstraint: resolving the Account
        # ContentType requires a DB query, which is impossible at model
        # import time on a fresh database.
        if self.followed_type_id and self.followed_id == self.user_id \
                and self.followed_type.model == 'account':
            raise ValidationError('Can not follow yourself.')
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return '{} - {}'.format(self._meta.model_name.title(), self.id)

    @property
    def app_model_label(self) -> str:
        return '{}_{}'.format(self._meta.app_label, self._meta.model_name)
