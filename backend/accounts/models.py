from softdelete.models import SoftDeleteObject, SoftDeleteManager
from accounts.validators.username import username_validators_list

from django.db import models
from django.contrib.postgres import fields
from django.contrib.auth.models import AbstractUser, AbstractBaseUser, UserManager
from django.contrib.contenttypes import fields as contenttypes_fields
from django.utils.translation import gettext_lazy as _


class UserSoftDeleteManager(SoftDeleteManager, UserManager):
    ...


class Account(SoftDeleteObject, AbstractUser):
    def __init__(self, *args, **kwargs):
        models.Model.__init__(self, *args, **kwargs)
        self.__dirty = False

    def save(self, *args, **kwargs) -> None:
        AbstractBaseUser.save(self, *args, **kwargs)
        if self.__dirty:
            self.__dirty = False
            if not self.deleted:
                self.undelete()
            else:
                self.delete()

    username = fields.CICharField(
        unique=True,
        max_length=32,
        validators=[*username_validators_list],
        error_messages={
            'unique': _("A user with this username already exists."),
        },
    )
    '''
    validators:
        min_length=5
        just contain a-z, A-Z, 0-9 and _ characters
        start with a letter character
        can't contain restricted words like 'admin'
    '''

    password = models.CharField(max_length=128)
    '''
    validators
        min_length=8
        check with common passwords
        can't be entirely numeric
    '''

    name = models.CharField(blank=True, max_length=50)

    bio = models.CharField(blank=True, max_length=140)

    email = fields.CIEmailField(
        unique=True,
        error_messages={
            'unique': _("A user with this email already exists."),
        },
    )

    avatar = models.ImageField(
        upload_to='images/account_avatars',
        null=True, blank=True, default=None,
    )

    followers = contenttypes_fields.GenericRelation(
        'follows.Follow',
        content_type_field='followed_type',
        object_id_field='followed_id',
        related_query_name='followed_account',
    )

    first_name = None
    last_name = None

    objects = UserSoftDeleteManager()

    class Meta:
        verbose_name = _('account')
        verbose_name_plural = _('accounts')

        ordering = ['-id']

    def __str__(self):
        return 'Deleted' if self.deleted_at else \
               '@{}'.format(self.username)

    @property
    def app_model_label(self) -> str:
        return '{}_{}'.format(self._meta.app_label, self._meta.model_name)

    def delete(self, *args, **kwargs) -> None:
        super().delete(*args, **kwargs)

        self.followers.clear()

    def get_full_name(self) -> str:
        return self.name

    get_short_name = get_full_name
