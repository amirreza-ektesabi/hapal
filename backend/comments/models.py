from django.db import models
from django.db.models import Q
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import fields as contenttypes_fields
from django.utils.translation import gettext_lazy as _

from baseapp.models import SharedBaseModel


class Comment(SharedBaseModel):
    body = models.CharField(max_length=1023, blank=True)

    replied_to_limit_choices = Q(app_label='lists', model='List') | \
                               Q(app_label='posts', model='Post') | \
                               Q(app_label='comments', model='Comment')
    replied_to_type = models.ForeignKey(
        ContentType,
        models.DO_NOTHING,
        editable=False,
        limit_choices_to=replied_to_limit_choices,
        related_name='comments',
    )
    replied_to_id = models.PositiveIntegerField(editable=False)
    replied_to = contenttypes_fields.GenericForeignKey('replied_to_type', 'replied_to_id')
    
    class Meta:
        verbose_name = _('comment')
        verbose_name_plural = _('comments')
        ordering = ['-id']
