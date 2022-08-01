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
            'header',
            'bio',
            'followers_count',
            'following_count',
            'lists_count',
            'posts_count',
            'comments_count',
        ]

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
        read_only=True
    )

    posts_count = serializers.IntegerField(
        source='posts.count',
        read_only=True
    )

    comments_count = serializers.IntegerField(
        source='comments.count',
        read_only=True
    )


class ProfileAboutSerializer(AccountBaseSerializer):
    class Meta(AccountBaseSerializer.Meta):
        fields = AccountBaseSerializer.Meta.fields + [
            'username',
            'email',
            'phone_number',
            'location',
            'birth_date',
            'joined'
        ]
