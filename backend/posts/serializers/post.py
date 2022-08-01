from lists.models import List
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

    def create(self, validated_data):
        validated_data.update(dict(
            user_id=self.context['user_id'],
            added_to_id=List.objects.get(uuid=self.context['added_to_uuid']).id
        ))
        instance: Post = super().create(validated_data)
        return instance
