from baseapp.models import SharedBaseModel
from accounts.serializers import AccountSerializer, SharedObjectUserSerializer

from django.db.models import Model
from django.urls import reverse
from rest_framework import serializers

from typing import Dict


class SharedObjectSubviewSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()

    def get_type(self, obj: SharedBaseModel) -> str:
        return self.Meta.model._meta.model_name

    def to_representation(self, instance: SharedBaseModel) -> dict:
        if instance.deleted_at is None:
            return super().to_representation(instance)
        return {'deleted': True}


class SharedObjectPreviewSerializer(SharedObjectSubviewSerializer):
    user = SharedObjectUserSerializer(read_only=True)

    created = serializers.DateTimeField(
        read_only=True
    )

    comments_count = serializers.IntegerField(
        source='comments.count',
        read_only=True
    )

    likes_count = serializers.IntegerField(
        source='likes.count',
        read_only=True
    )

    is_liked = serializers.BooleanField(
        read_only=True
    )


class SharedObjectFullviewSerializer(SharedObjectPreviewSerializer):
    updated = serializers.DateTimeField(
        read_only=True
    )


class SharedObjectActionSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()

    user = AccountSerializer(read_only=True)

    created = serializers.DateTimeField(
        read_only=True
    )

    object_name: str

    related_objects_serializer_class: Dict[str, Model]

    def get_type(self, obj: Model) -> str:
        return self.Meta.model._meta.model_name

    def get_related_object(self, obj: Model) -> dict:
        related_object_instance = getattr(obj, self.object_name)
        kwargs = {'instance': related_object_instance}
        related_object_serializer_class = self.related_objects_serializer_class[
            related_object_instance._meta.model]
        return related_object_serializer_class().to_representation(**kwargs)
