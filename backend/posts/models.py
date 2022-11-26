from baseapp.models import SharedBaseModel

from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import fields as contenttypes_fields
from django.utils.translation import gettext_lazy as _

from uuid import uuid4


class Post(SharedBaseModel):
    title = models.CharField(
        max_length=255,
        blank=True
    )
    
    added_to = models.ForeignKey(
        'lists.List',
        models.DO_NOTHING,
        editable=False,
        related_name='posts',
    )

    class Meta:
        verbose_name = _('post')
        verbose_name_plural = _('posts')
        ordering = ['-id']


class Property(models.Model):
    class Type(models.IntegerChoices):
        Text = 0
    
    post = models.ForeignKey(
        'Post',
        models.CASCADE,
        editable=False,
        related_name='properties',
    )

    puuid = models.UUIDField(
        default=uuid4,
        editable=False
    )
    
    order_number = models.PositiveIntegerField()
    
    key = models.CharField(
        max_length=50,
        blank=True
    )

    type = models.PositiveSmallIntegerField(
        choices=Type.choices,
    )

    class Meta:
        verbose_name = _('property')
        verbose_name_plural = _('properties')

        unique_together = (('post', 'order_number'),
                           ('post', 'puuid'))

    def __str__(self) -> str:
        return 'Property - {}'.format(self.id)


class Pair(models.Model):
    property = models.ForeignKey(
        'Property',
        models.CASCADE,
        editable=False,
        related_name='pairs',
    )

    order_number = models.PositiveIntegerField()

    key = models.CharField(
        max_length=50,
        blank=True
    )

    value_limit_choices = models.Q(app_label='post', model='TextValue')

    value_type = models.ForeignKey(
        ContentType,
        models.CASCADE,
        editable=False,
        limit_choices_to=value_limit_choices,
        related_name='pairs',
    )
    
    value_id = models.PositiveIntegerField()
    
    value = contenttypes_fields.GenericForeignKey(
        'value_type',
        'value_id'
    )

    class Meta:
        verbose_name = _('pair')
        verbose_name_plural = _('pairs')

        unique_together = ('property', 'order_number')

    def __str__(self) -> str:
        return 'Pair - {}'.format(self.id)


class PairValueBaseModel(models.Model):
    pair = contenttypes_fields.GenericRelation(
        Pair,
        content_type_field='value_type',
        object_id_field='value_id',
        related_query_name='%(class)s_value',
    )

    class Meta:
        abstract = True

    def __str__(self) -> str:
        return '{} - {}'.format(self._meta.model_name.title(), self.id)


class TextValue(PairValueBaseModel):
    text = models.CharField(
        max_length=1023,
        blank=True
    )

    @property
    def value(self) -> str:
        return self.text

    class Meta:
        verbose_name = _('text value')
        verbose_name_plural = _('text values')


PROPERTY_TYPES = (
    (TextValue, {'value': 'text'}),
)
