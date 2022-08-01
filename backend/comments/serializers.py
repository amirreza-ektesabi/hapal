from lists.models import List
from posts.models import Post
from comments.models import Comment
from baseapp.serializers import SharedObjectSerializer, SharedObjectBaseSerializer, SharedObjectActionSerializer
from lists.serializers import ListSimpleSerializer
from posts.serializers.post import PostSimpleSerializer
from rest_framework import serializers


class CommentSimpleSerializer(SharedObjectBaseSerializer):
    class Meta(SharedObjectBaseSerializer.Meta):
        model = Comment
        fields = SharedObjectBaseSerializer.Meta.fields


class CommentSerializer(SharedObjectSerializer, SharedObjectActionSerializer):
    class Meta(SharedObjectSerializer.Meta):
        model = Comment
        fields = SharedObjectSerializer.Meta.fields + [
            'body',
            'replied_to',
        ]

    replied_to = serializers.SerializerMethodField()

    object_name = 'replied_to'

    object_models_switch = {
        'list': List,
        'post': Post,
        'comment': Comment,
    }

    object_serializers_switch = {
        List: ListSimpleSerializer,
        Post: PostSimpleSerializer,
        Comment: CommentSimpleSerializer,
    }

    def get_replied_to(self, obj):
        return self.get_object(obj)
