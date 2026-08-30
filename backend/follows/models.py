from django.db import models
from django.db.models import Q, F
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
        constraints = [
            models.CheckConstraint(
                check=~Q(followed_id=F('user_id'),
                         followed_type_id=ContentType.objects.get(app_label='accounts', model='account').id),
                name='prevent_self_following'
            )
        ]

    def __str__(self) -> str:
        return '{} - {}'.format(self._meta.model_name.title(), self.id)

    @property
    def app_model_label(self) -> str:
        return '{}_{}'.format(self._meta.app_label, self._meta.model_name)
