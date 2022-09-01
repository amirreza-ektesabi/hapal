from lists.models import List
from baseapp.serializers import SharedObjectSerializer, SharedObjectBaseSerializer
from rest_framework import serializers


class ListSimpleSerializer(SharedObjectBaseSerializer):
    class Meta(SharedObjectBaseSerializer.Meta):
        model = List
        fields = SharedObjectBaseSerializer.Meta.fields + [
            'title'
        ]


class ListSerializer(SharedObjectSerializer):
    class Meta(SharedObjectSerializer.Meta):
        model = List
        fields = SharedObjectSerializer.Meta.fields + [
            'followers_count',
            'posts_count',
            'title',
            'header',
            'description',
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
