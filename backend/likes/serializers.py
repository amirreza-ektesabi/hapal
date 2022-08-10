from rest_framework import serializers
from likes.models import Like
from lists.models import List
from posts.models import Post
from comments.models import Comment
from baseapp.serializers import SharedObjectActionSerializer
from lists.serializers import ListSimpleSerializer
from posts.serializers.post import PostSimpleSerializer
from comments.serializers import CommentSimpleSerializer


class LikeSerializer(SharedObjectActionSerializer):
    class Meta(SharedObjectActionSerializer.Meta):
        model = Like
        fields = SharedObjectActionSerializer.Meta.fields + [
            'liked',
        ]

    liked = serializers.SerializerMethodField()

    object_name = 'liked'

    shared_object_models_switch = {
        'list': List,
        'post': Post,
        'comment': Comment,
    }

    shared_object_serializers_switch = {
        List: ListSimpleSerializer,
        Post: PostSimpleSerializer,
        Comment: CommentSimpleSerializer,
    }

    def get_liked(self, obj):
        return self.get_object(obj)
