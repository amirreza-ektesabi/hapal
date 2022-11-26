from posts.models import Post
from lists.serializers import ListSubviewSerializer
from baseapp.serializers import (
    SharedObjectSubviewSerializer,
    SharedObjectPreviewSerializer,
    SharedObjectFullviewSerializer
)


class PostSubviewSerializer(SharedObjectSubviewSerializer):
    class Meta:
        model = Post
        fields = [
            'type',
            'uuid',
            'url',
            'title',
        ]


class PostPreviewSerializer(SharedObjectPreviewSerializer):
    class Meta:
        model = Post
        fields = [
            'type',
            'uuid',
            'url',
            'user',
            'added_to',
            'title',
            'comments_count',
            'likes_count',
            'is_liked',
            'created',
        ]
    
    added_to = ListSubviewSerializer(read_only=True)


class PostFullviewSerializer(SharedObjectFullviewSerializer):
    class Meta:
        model = Post
        fields = [
            'type',
            'uuid',
            'url',
            'user',
            'added_to',
            'title',
            'comments_count',
            'likes_count',
            'is_liked',
            'created',
            'updated',
        ]

    added_to = ListSubviewSerializer(read_only=True)
