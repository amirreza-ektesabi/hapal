from lists.models import List
from posts.models import Post
from comments.models import Comment
from lists.serializers import ListSubviewSerializer
from posts.serializers.post import PostSubviewSerializer
from baseapp.serializers import (
    SharedObjectSubviewSerializer,
    SharedObjectFullviewSerializer,
    SharedObjectActionSerializer
)

from django.db.models import Model
from rest_framework import serializers


class CommentSubviewSerializer(SharedObjectSubviewSerializer):
    class Meta:
        model = List
        fields = [
            'type',
            'uuid'
        ]


class CommentFullviewSerializer(SharedObjectFullviewSerializer, SharedObjectActionSerializer):
    class Meta:
        model = Comment
        fields = [
            'type',
            'uuid',
            'user',
            'body',
            'replied_to',
            'comments_count',
            'likes_count',
            'is_liked',
            'created',
            'updated',
        ]
    
    replied_to = serializers.SerializerMethodField()

    object_name = 'replied_to'

    related_objects_serializer_class = {
        List: ListSubviewSerializer,
        Post: PostSubviewSerializer,
        Comment: CommentSubviewSerializer,
    }

    def get_replied_to(self, obj: Comment) -> Model:
        return self.get_related_object(obj)
