from lists.models import List
from baseapp.models import SharedBaseModel
from accounts.serializers import AccountSerializer
from rest_framework import serializers
from django.db.models import Model
from django.urls import reverse
from typing import Dict


class SharedObjectBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedBaseModel
        fields = [
            'type',
            'uuid',
            'user',
            'created',
            'updated',
            'url',
        ]

    type = serializers.SerializerMethodField()

    url = serializers.SerializerMethodField()

    user = AccountSerializer(read_only=True)

    created = serializers.DateTimeField(
        format='%Y-%m-%d %H:%M:%S',
        read_only=True
    )

    updated = serializers.DateTimeField(
        format='%Y-%m-%d %H:%M:%S',
        read_only=True
    )

    def get_type(self, obj: SharedBaseModel) -> str:
        return self.Meta.model._meta.model_name

    def get_url(self, obj: SharedBaseModel):
        return reverse('{}_page'.format(self.get_type(obj)), args=[obj.uuid])

    def to_representation(self, instance: SharedBaseModel) -> dict:
        if instance.deleted_at is None:
            return super().to_representation(instance)
        return {'deleted': True}


class SharedObjectSerializer(SharedObjectBaseSerializer):
    class Meta(SharedObjectBaseSerializer.Meta):
        fields = SharedObjectBaseSerializer.Meta.fields + [
            'comments_count',
            'likes_count',
        ]

    comments_count = serializers.IntegerField(
        source='comments.count',
        read_only=True
    )

    likes_count = serializers.IntegerField(
        source='likes.count',
        read_only=True
    )


class SharedObjectActionSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            'type',
            'user',
            'created',
        ]

    type = serializers.SerializerMethodField()

    user = AccountSerializer(read_only=True)

    created = serializers.DateTimeField(
        format='%Y-%m-%d %H:%M:%S',
        read_only=True
    )

    object_name: str

    related_objects_serializer_class: Dict[str, Model]

    def get_type(self, obj):
        return self.Meta.model._meta.model_name

    def get_related_object(self, obj):
        related_object_instance = getattr(obj, self.object_name)
        kwargs = {'instance': related_object_instance}
        related_object_serializer_class = self.related_objects_serializer_class[related_object_instance._meta.model]
        return related_object_serializer_class().to_representation(**kwargs)
