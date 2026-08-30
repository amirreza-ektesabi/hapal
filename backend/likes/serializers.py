from likes.models import Like
from lists.models import List
from posts.models import Post
from comments.models import Comment
from lists.serializers import ListSubviewSerializer
from posts.serializers.post import PostSubviewSerializer
from comments.serializers import CommentSubviewSerializer
from baseapp.serializers import SharedObjectActionSerializer

from django.db.models import Model
from rest_framework import serializers


class LikeSerializer(SharedObjectActionSerializer):
    class Meta:
        model = Like
        fields = [
            'type',
            'user',
            'created',
            'liked',
        ]

    liked = serializers.SerializerMethodField()

    object_name = 'liked'

    related_objects_serializer_class = {
        List: ListSubviewSerializer,
        Post: PostSubviewSerializer,
        Comment: CommentSubviewSerializer,
    }

    def get_liked(self, obj: Like) -> Model:
        return self.get_related_object(obj)
