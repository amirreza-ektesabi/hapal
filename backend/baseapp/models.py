from accounts.models import Account
from likes.models import Like

from django.db import DEFAULT_DB_ALIAS, models
from django.db.models import QuerySet, Exists, OuterRef, Value
from django.contrib.contenttypes import fields as contenttypes_fields
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import AnonymousUser

from softdelete.models import SoftDeleteObject, SoftDeleteManager, SoftDeleteQuerySet
from uuid import uuid4
from typing import Union


class GenericRelationWithoutCommentAsRelatedObject(contenttypes_fields.GenericRelation):
    '''
    in delete page of SharedBaseModel's objects, comments
    of the object were shown as related objects that will
    be deleted, while they are not among the deleted ones.
    '''

    def bulk_related_objects(self, objs, using=DEFAULT_DB_ALIAS) -> QuerySet:
        qs = super().bulk_related_objects(objs, using)
        if self.related_model._meta.model_name == 'comment':
            qs = qs.none()
        return qs


class SharedBaseQuerySet(SoftDeleteQuerySet):
    def annotate_is_liked_by_current_user(self, user: Union[Account, AnonymousUser]) -> QuerySet:
        if user.is_authenticated:
            liked_by_user = Like.objects.filter(
                user=user,
                liked_id=OuterRef('id'),
                liked_type=ContentType.objects.get_for_model(self.model),
            )
            queryset = self.annotate(is_liked=Exists(liked_by_user))
        else:
            queryset = self.annotate(is_liked=Value(False))
        
        return queryset


class SharedBaseManager(SoftDeleteManager):
    def get_queryset(self):
        qs = super().get_queryset().filter(
            deleted_at__isnull=True)
        if not issubclass(qs.__class__, SharedBaseQuerySet):
            qs.__class__ = SharedBaseQuerySet
        return qs
    

class SharedBaseModel(SoftDeleteObject):
    objects = SharedBaseManager()

    uuid = models.UUIDField(
        unique=True,
        default=uuid4,
        editable=False,
        db_index=True,
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
