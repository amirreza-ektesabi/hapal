from accounts.models import Account

from django.urls import reverse
from rest_framework import serializers
from djoser.conf import settings
from djoser.serializers import UserCreateSerializer as DjoserUserCreateSerializer


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
            'type'
        ]

    type = serializers.SerializerMethodField()

    def get_type(self, obj: Account) -> str:
        return self.Meta.model._meta.model_name


class AccountSerializer(AccountBaseSerializer):
    class Meta(AccountBaseSerializer.Meta):
        fields = AccountBaseSerializer.Meta.fields + [
            'name',
            'username',
            'avatar',
        ]


class SharedObjectUserSerializer(AccountBaseSerializer):
    is_followed = serializers.BooleanField(
        read_only=True
    )

    class Meta(AccountBaseSerializer.Meta):
        fields = AccountBaseSerializer.Meta.fields + [
            'name',
            'username',
            'avatar',
            'is_followed',
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
            'lists_count',
            'is_followed',
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

    lists_count = serializers.IntegerField(
        source='lists.count',
        read_only=True,
    )

    is_followed = serializers.BooleanField(
        read_only=True
    )
