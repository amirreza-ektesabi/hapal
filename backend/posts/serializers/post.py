from posts.models import Post
from lists.serializers import ListSubviewSerializer
from baseapp.serializers import (
    SharedObjectSubviewSerializer,
    SharedObjectFullviewSerializer
)


class PostSubviewSerializer(SharedObjectSubviewSerializer):
    class Meta:
        model = Post
        fields = [
            'type',
            'uuid',
            'title',
        ]


class PostFullviewSerializer(SharedObjectFullviewSerializer):
    class Meta:
        model = Post
        fields = [
            'type',
            'uuid',
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
