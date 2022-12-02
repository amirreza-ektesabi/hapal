from django.db.models import QuerySet, Exists, OuterRef, Value
from django.apps import apps
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import AnonymousUser, AbstractUser

from softdelete.models import SoftDeleteManager, SoftDeleteQuerySet
from typing import Dict, Union


class GenericRelationQuerySet:
    '''
    annotate a field that check if current user has done the 
    related action to model or not. set false if user is not
    authenticated.
    '''

    def annotate_action_generic_relation_exists(self, action_model: Dict[str, str], relation_name: str,
                                                user: Union[AbstractUser, AnonymousUser]) -> QuerySet:
        if user.is_authenticated:
            sub_query = apps.get_model(**action_model).objects.filter(**{
                'user': user,
                f'{relation_name}_id': OuterRef('id'),
                f'{relation_name}_type': ContentType.objects.get_for_model(self.model),
            })
            queryset = self.annotate(
                **{f'is_{relation_name}': Exists(sub_query)})
        else:
            queryset = self.annotate(**{f'is_{relation_name}': Value(False)})

        return queryset


class FollowableQuerySetMixin:
    def annotate_is_followed(self, user: Union[AbstractUser, AnonymousUser]) -> QuerySet:
        action_model = dict(app_label='follows', model_name='follow')
        relation_name = 'followed'
        return GenericRelationQuerySet.annotate_action_generic_relation_exists(
            self, action_model, relation_name, user
        )


class LikableQuerySetMixin:
    def annotate_is_liked(self, user: Union[AbstractUser, AnonymousUser]) -> QuerySet:
        action_model = dict(app_label='likes', model_name='like')
        relation_name = 'liked'
        return GenericRelationQuerySet.annotate_action_generic_relation_exists(
            self, action_model, relation_name, user
        )


class SharedBaseQuerySet(LikableQuerySetMixin, SoftDeleteQuerySet):
    ...


class SharedBaseManager(SoftDeleteManager):
    _queryset_class = SharedBaseQuerySet

    def get_queryset(self):
        qs = super().get_queryset()
        if not issubclass(qs.__class__, self._queryset_class):
            qs.__class__ = self._queryset_class
        return qs
