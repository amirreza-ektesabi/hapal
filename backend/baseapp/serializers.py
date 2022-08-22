from baseapp.models import SharedBaseModel
from accounts.serializers import AccountSerializer
from rest_framework import serializers
from django.urls import reverse


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

    def get_type(self, obj):
        return self.Meta.model._meta.model_name

    def get_object(self, obj):
        object = getattr(obj, self.object_name)
        kwargs = {'instance': object}
        shared_object_serializer = self.shared_object_serializers_switch[object._meta.model]
        return shared_object_serializer().to_representation(**kwargs)

    def create(self, validated_data: dict):
        shared_object_model = self.shared_object_models_switch[self.context['shared_object_type']]
        object = shared_object_model.objects.get(**{
            self.context['lookup_field']: self.context['lookup_field_value']
        })
        validated_data.update({
            'user_id': self.context['user_id'],
            self.object_name: object,
        })
        return super().create(validated_data)
