from posts.serializers.post import PostSubviewSerializer
from posts.models import Property, Pair, PROPERTY_TYPES

from rest_framework import serializers


class PairSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pair
        fields = [
            'key',
            'value'
        ]

    value = serializers.CharField()

    def create(self, validated_data):
        property = validated_data.get('property')
        value_model, fields_switch = PROPERTY_TYPES[property.type]

        value_data = {
            model_field: validated_data[serializer_field]
            for serializer_field, model_field in fields_switch.items()
        }
        validated_data['value'] = value_model.objects.create(**value_data)
        
        return super().create(validated_data)

    def to_representation(self, instance: Pair) -> dict:
        ret = super().to_representation(instance)
        ret['value'] = instance.value.value
        return ret


class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            'puuid',
            'type',
            'order',
            'key',
            'pairs',
            'post',
        ]

    order = serializers.IntegerField(source='order_number', read_only=True)

    post = PostSubviewSerializer(read_only=True)

    type = serializers.ChoiceField(Property.Type.labels, read_only=True)

    pairs = PairSerializer(many=True, required=False)

    def add_pairs(self, instance, pair_list):
        serializer_class = PairSerializer()

        for order_number, validated_data in enumerate(pair_list, 1):
            validated_data.update(dict(
                property=instance,
                order_number=order_number
            ))
            serializer_class.create(validated_data)

    def create(self, validated_data):
        pair_list = validated_data.pop('pairs', [])
        validated_data['type'] = Property.Type.Text

        instance = super().create(validated_data)

        self.add_pairs(instance, pair_list)

        return instance

    def to_representation(self, instance: Property) -> dict:
        ret = super().to_representation(instance)
        ret['type'] = instance.get_type_display()
        return ret
