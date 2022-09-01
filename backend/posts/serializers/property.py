from posts.models import Property, Pair, PROPERTY_TYPES
from itertools import zip_longest
from rest_framework import serializers


class PairSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pair
        fields = [
            'key',
            'value'
        ]

    value = serializers.CharField()

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['value'] = instance.value.value
        return ret


class PropertyListCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            'puuid',
            'type',
            'key',
            'pairs',
        ]

    type = serializers.ChoiceField(Property.Type.labels)

    pairs = PairSerializer(many=True, required=False)

    def add_pairs(self, instance: Property, pairs_data: list, property_type: int):
        value_model, fields_switch = PROPERTY_TYPES[property_type]

        for pair_order_number, pair_data in enumerate(pairs_data, 1):
            value_data = {model_field: pair_data[serializer_field]
                           for serializer_field, model_field in fields_switch.items()}
            value = value_model.objects.create(**value_data)
            Pair.objects.create(
                property=instance,
                order_number=pair_order_number,
                key=pair_data['key'],
                value=value
            )
    
    def create(self, validated_data: dict):
        pairs_data = validated_data.pop('pairs', [])
        validated_data['type'] = Property.Type[validated_data['type']]
        
        order_number = Property.objects.filter(post=validated_data['post']).count() + 1
        validated_data.update({
            'order_number': order_number,
        })

        instance: Property = super().create(validated_data)
        
        self.add_pairs(instance, pairs_data, validated_data['type'])

        return instance

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['type'] = instance.get_type_display()
        return ret


class PropertyUpdateSerializer(PropertyListCreateSerializer):
    type = serializers.ChoiceField(Property.Type.labels, read_only=True)

    def update(self, instance: Property, validated_data: dict):
        pairs_data = validated_data.pop('pairs', [])

        super().update(instance, validated_data)

        value_model, fields_switch = PROPERTY_TYPES[instance.type]
        for pair_order_number, (pair, pair_data) in enumerate(zip_longest(instance.pairs.all(), pairs_data), 1):
            if pair_data is None:
                pair.delete()

            else:
                value_datas = {model_field: pair_data[serializer_field]
                               for serializer_field, model_field in fields_switch.items()}
                value = value_model.objects.create(**value_datas)
                Pair.objects.update_or_create(
                    property=instance,
                    order_number=pair_order_number,
                    defaults=dict(
                        key=pair_data['key'],
                        value=value
                    )
                )

        return instance
