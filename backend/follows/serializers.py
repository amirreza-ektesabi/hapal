from follows.models import Follow
from lists.models import List
from lists.serializers import ListSimpleSerializer
from accounts.models import Account
from accounts.serializers import AccountSerializer
from baseapp.serializers import SharedObjectActionSerializer
from rest_framework import serializers


class FollowSerializer(SharedObjectActionSerializer):
    class Meta(SharedObjectActionSerializer.Meta):
        model = Follow
        fields = SharedObjectActionSerializer.Meta.fields + [
            'followed',
        ]

    followed = serializers.SerializerMethodField()

    object_name = 'followed'

    related_objects_serializer_class = {
        Account: AccountSerializer,
        List: ListSimpleSerializer,
    }

    def get_followed(self, obj):
        return self.get_related_object(obj)
