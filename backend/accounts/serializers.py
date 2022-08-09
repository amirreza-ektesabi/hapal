from accounts.models import Account
from rest_framework import serializers
from djoser.serializers import UserCreateSerializer as DjoserUserCreateSerializer
from django.urls import reverse
from djoser.conf import settings


class UserCreateSerializer(DjoserUserCreateSerializer):
    class Meta(DjoserUserCreateSerializer.Meta):
        fields = tuple(DjoserUserCreateSerializer.Meta.model.REQUIRED_FIELDS) + (
            settings.LOGIN_FIELD,
            "password",
        )


class AccountBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            'type',
            'url'
        ]

    type = serializers.SerializerMethodField()

    url = serializers.SerializerMethodField()

    def get_type(self, obj: Account):
        return self.Meta.model._meta.model_name

    def get_url(self, obj: Account):
        return reverse('{}_page'.format(self.get_type(obj)), args=[obj.username])


class AccountSerializer(AccountBaseSerializer):
    class Meta(AccountBaseSerializer.Meta):
        fields = AccountBaseSerializer.Meta.fields + [
            'name',
            'username',
            'avatar',
        ]


class ProfileSerializer(AccountBaseSerializer):
    class Meta(AccountBaseSerializer.Meta):
        fields = AccountBaseSerializer.Meta.fields + [
            'name',
            'username',
            'avatar',
            'bio',
            'joined',
            'followers_count',
            'following_count',
        ]

    joined = serializers.DateTimeField(
        format='%Y-%m-%d',
        source='date_joined',
        read_only=True
    )

    followers_count = serializers.IntegerField(
        source='followers.count',
        read_only=True
    )

    following_count = serializers.IntegerField(
        source='followings.count',
        read_only=True
    )
