from comments.models import Comment
from posts.models import Post
from posts.serializers.post import PostSimpleSerializer
from lists.models import List
from lists.serializers import ListSimpleSerializer
from baseapp.serializers import SharedObjectSerializer, SharedObjectBaseSerializer, SharedObjectActionSerializer
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

    related_objects_serializer_class = {
        List: ListSimpleSerializer,
        Post: PostSimpleSerializer,
        Comment: CommentSimpleSerializer,
    }

    def get_replied_to(self, obj):
        return self.get_related_object(obj)
