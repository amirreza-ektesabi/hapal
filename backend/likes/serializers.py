from likes.models import Like
from comments.models import Comment
from comments.serializers import CommentSimpleSerializer
from posts.models import Post
from posts.serializers.post import PostSimpleSerializer
from lists.models import List
from lists.serializers import ListSimpleSerializer
from baseapp.serializers import SharedObjectActionSerializer
from rest_framework import serializers


class LikeSerializer(SharedObjectActionSerializer):
    class Meta(SharedObjectActionSerializer.Meta):
        model = Like
        fields = SharedObjectActionSerializer.Meta.fields + [
            'liked',
        ]

    liked = serializers.SerializerMethodField()

    object_name = 'liked'

    related_objects_serializer_class = {
        List: ListSimpleSerializer,
        Post: PostSimpleSerializer,
        Comment: CommentSimpleSerializer,
    }

    def get_liked(self, obj):
        return self.get_related_object(obj)
