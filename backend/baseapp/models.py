from uuid import uuid4
from softdelete.models import SoftDeleteObject
from django.db import DEFAULT_DB_ALIAS, models
from django.contrib.contenttypes import fields as contenttypes_fields
from django.utils.translation import gettext_lazy as _


class GenericRelationWithoutCommentAsRelatedObject(contenttypes_fields.GenericRelation):
    '''
    in delete page of SharedBaseModel's objects, comments
    of the object were shown as related objects that will
    be deleted, while they are not among the deleted ones.
    '''

    def bulk_related_objects(self, objs, using=DEFAULT_DB_ALIAS):
        qs = super().bulk_related_objects(objs, using)
        if self.related_model._meta.model_name == 'comment':
            qs = qs.none()
        return qs


class SharedBaseModel(SoftDeleteObject, models.Model):
    uuid = models.UUIDField(
        unique=True,
        default=uuid4,
        editable=False
    )

    user = models.ForeignKey(
        'accounts.Account',
        models.CASCADE,
        editable=False,
        related_name='%(class)ss',
        verbose_name=_("user"),
    )

    comments = GenericRelationWithoutCommentAsRelatedObject(
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

    class Meta:
        abstract = True

    def __str__(self) -> str:
        return 'Deleted' if self.deleted_at else \
               '{} - {}'.format(self._meta.model_name.title(), self.id)

    @property
    def app_model_label(self) -> str:
        return '{}_{}'.format(self._meta.app_label, self._meta.model_name)

    def delete(self, *args, **kwargs) -> None:
        super().delete(*args, **kwargs)

        self.likes.clear()
