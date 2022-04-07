from django.db import models
from django.contrib.postgres import fields
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

from django.utils.translation import gettext_lazy as _

from .username_validation import validate_username


class Account(AbstractBaseUser):
    @staticmethod
    def get_sentinel_user():
        return Account.objects.get_or_create(username='deleted')[0]
    
    username = fields.CICharField(
        unique=True,
        max_length=32,
        validators=[validate_username],
        error_messages={
            'unique': _("A user with this username already exists."),
        },
    )
    # validators:
    #   min_length=5
    #   just contain a-z, A-Z, 0-9 and _ characters
    #   start with a letter character
    #   can't contain restricted words like 'admin'

    password = models.CharField(max_length=128)
    # validators
    #   min_length=8
    #   check with common passwords
    #   can't be entirely numeric

    name = models.CharField(blank=True, max_length=50)
    bio = models.CharField(blank=True, max_length=140)
    email = fields.CIEmailField(
        unique=True,
        error_messages={
            'unique': _("A user with this email already exists."),
        },
    )
    phone_number = PhoneNumberField(
        blank=True,
        unique=True,
        error_messages={
            'unique': _("A user with this phone number already exists."),
        },
    )
    location = models.CharField(blank=True, max_length=100)
    birth_date = models.DateField(null=True)
    
    avatar = models.ImageField(upload_to='account_avatars', null=True)
    header = models.ImageField(upload_to='account_headers', null=True)
    
    class AccessLevel(models.IntegerChoices):
        PUBLIC = 0
        PRIVATE = 1
        
    access_level = models.IntegerField(
        choices=AccessLevel.choices,
        default=AccessLevel.PUBLIC
    )

    class BirthDateAccessLevel(models.IntegerChoices):
        JUST_USER = 0
        PUBLIC_YEAR = 1
        PUBLIC_ALL = 2

    birth_date_access_level = models.IntegerField(
        choices=BirthDateAccessLevel.choices,
        default=BirthDateAccessLevel.JUST_USER
    )

    joined = models.DateTimeField(auto_now_add=True)
    signup_ip = models.GenericIPAddressField(editable=False)
    
    """
    followers
    followings
    owned_lists
    posts
    comments
    relists
    likes
    other_follow_requests
    follow_requests
    bookmarks
    blocked_users
    blocked_by_users
    muted_users
    muted_by_users
    security_alerts
    notifications
    others_bell_notifications
    bell_notifications
    logins
    """
    
    class Meta:
        verbose_name = _('account')
        verbose_name_plural = _('accounts')
        
    def __str__(self):
        return self.username


class AccountLogin(models.Model):
    user = models.ForeignKey(
        'Account', on_delete=models.CASCADE, editable=False, related_name='logins'
    )
    ip = models.GenericIPAddressField(editable=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('account login')
        verbose_name_plural = _('account logins')
    
    def __str__(self):
        return '{} ip:{} time:{}'.format(self.user.username, self.ip, self.timestamp)