from lists.models import List
from baseapp.serializers import (
    SharedObjectSubviewSerializer,
    SharedObjectPreviewSerializer,
    SharedObjectFullviewSerializer
)

from rest_framework import serializers


class ListSubviewSerializer(SharedObjectSubviewSerializer):
    class Meta:
        model = List
        fields = [
            'type',
            'uuid',
            'title',
        ]


class ListPreviewSerializer(SharedObjectPreviewSerializer):
    class Meta:
        model = List
        fields = [
            'type',
            'uuid',
            'user',
            'title',
            'header',
            'description',
            'posts_count',
            'comments_count',
            'likes_count',
            'is_liked',
            'is_followed',
            'created',
        ]
    
    posts_count = serializers.IntegerField(
        source='posts.count',
        read_only=True,
    )

    header = serializers.ImageField(
        read_only=True,
    )
    
    is_followed = serializers.BooleanField(
        read_only=True
    )


class ListFullviewSerializer(SharedObjectFullviewSerializer):
    class Meta:
        model = List
        fields = [
            'type',
            'uuid',
            'user',
            'title',
            'header',
            'description',
            'comments_count',
            'likes_count',
            'followers_count',
            'posts_count',
            'is_liked',
            'is_followed',
            'created',
            'updated',
        ]

    followers_count = serializers.IntegerField(
        source='followers.count',
        read_only=True,
    )

    posts_count = serializers.IntegerField(
        source='posts.count',
        read_only=True,
    )

    header = serializers.ImageField(
        read_only=True,
    )

    is_followed = serializers.BooleanField(
        read_only=True
    )
