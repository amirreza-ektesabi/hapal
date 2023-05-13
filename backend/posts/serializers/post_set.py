from posts.models import Post
from posts.serializers.property import PropertySerializer
from lists.serializers import ListSubviewSerializer
from baseapp.serializers import SharedObjectFullviewSerializer

from django.db.transaction import atomic

class PostSetSerializer(SharedObjectFullviewSerializer):
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
            'properties',
        ]
        
    added_to = ListSubviewSerializer(read_only=True)

    properties = PropertySerializer(many=True, required=False, write_only=True)

    def add_properties(self, instance, property_list):
        serializer_class = PropertySerializer()

        for order_number, validated_data in enumerate(property_list, 1):
            validated_data.update(dict(
                post=instance,
                order_number=order_number
            ))
            serializer_class.create(validated_data)

    @atomic
    def create(self, validated_data):
        property_list = validated_data.pop('properties', [])
        
        instance = super().create(validated_data)
        
        self.add_properties(instance, property_list)

        return instance
    
    @atomic
    def update(self, instance, validated_data):
        property_list = validated_data.pop('properties', [])
        
        instance = super().update(instance, validated_data)

        instance.properties.all().delete()
        self.add_properties(instance, property_list)

        return instance
