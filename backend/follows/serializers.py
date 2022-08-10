from accounts.models import Account
from lists.models import List
from follows.models import Follow
from baseapp.serializers import SharedObjectActionSerializer
from accounts.serializers import AccountSerializer
from lists.serializers import ListSimpleSerializer
from rest_framework import serializers


class FollowSerializer(SharedObjectActionSerializer):
    class Meta(SharedObjectActionSerializer.Meta):
        model = Follow
        fields = SharedObjectActionSerializer.Meta.fields + [
            'followed',
        ]

    followed = serializers.SerializerMethodField()

    object_name = 'followed'

    shared_object_models_switch = {
        'list': List,
        'account': Account,
    }

    shared_object_serializers_switch = {
        Account: AccountSerializer,
        List: ListSimpleSerializer,
    }

    def get_followed(self, obj):
        return self.get_object(obj)
