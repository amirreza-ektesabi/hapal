from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import fields as contenttypes_fields
from django.utils.translation import gettext_lazy as _


class Like(models.Model):
    user = models.ForeignKey(
        'accounts.Account',
        models.PROTECT,
        editable=False,
        related_name='likes',
    )

    liked_limit_choices = models.Q(app_label='lists', model='List') | \
                          models.Q(app_label='posts', model='Post') | \
                          models.Q(app_label='comments', model='Comment')
    liked_type = models.ForeignKey(
        ContentType,
        models.PROTECT,
        editable=False,
        limit_choices_to=liked_limit_choices,
        related_name='likes',
    )
    liked_id = models.PositiveIntegerField()
    liked = contenttypes_fields.GenericForeignKey('liked_type', 'liked_id')

    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('like')
        verbose_name_plural = _('likes')
    
    def __str__(self) -> str:
        return '{} - {}'.format(self._meta.model_name.title(), self.id)

    @property
    def app_model_label(self) -> str:
        return '{}_{}'.format(self._meta.app_label, self._meta.model_name)
