from lists.models import List
from follows.models import Follow
from accounts.models import Account
from lists.serializers import ListSubviewSerializer
from accounts.serializers import AccountSerializer
from baseapp.serializers import SharedObjectActionSerializer

from django.db.models import Model
from rest_framework import serializers


class FollowSerializer(SharedObjectActionSerializer):
    class Meta:
        model = Follow
        fields = [
            'type',
            'user',
            'created',
            'followed',
        ]

    followed = serializers.SerializerMethodField()

    object_name = 'followed'

    related_objects_serializer_class = {
        Account: AccountSerializer,
        List: ListSubviewSerializer,
    }

    def get_followed(self, obj: Follow) -> Model:
        return self.get_related_object(obj)
