from rest_framework import serializers

from ..models import Person


class PersonSerializer(serializers.ModelSerializer):
    names = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = ['primary_name', 'text', 'id', 'names']

    def get_names(self, person):
        return person.names.values_list('name', flat=True)
