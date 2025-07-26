from rest_framework import serializers
from .models import EventFile

class EventFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventFile
        fields = ['id', 'file', 'uploaded_at']
