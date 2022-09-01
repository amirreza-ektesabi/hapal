from posts.models import Post
from baseapp.serializers import SharedObjectSerializer, SharedObjectBaseSerializer
from lists.serializers import ListSimpleSerializer


class PostSimpleSerializer(SharedObjectBaseSerializer):
    class Meta(SharedObjectBaseSerializer.Meta):
        model = Post
        fields = SharedObjectBaseSerializer.Meta.fields + [
            'title'
        ]


class PostSerializer(SharedObjectSerializer):
    class Meta(SharedObjectSerializer.Meta):
        model = Post
        fields = SharedObjectSerializer.Meta.fields + [
            'title',
            'added_to'
        ]

    added_to = ListSimpleSerializer(read_only=True)
