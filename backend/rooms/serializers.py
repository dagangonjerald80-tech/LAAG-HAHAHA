from rest_framework import serializers
from .models import LaagRoom

class LaagRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaagRoom
        fields = [
            'room_code',
            'laag_date',
            'participants',
            'service',
            'meetup_area',
            'meetup_time',
            'food_items',
            'foods',
            'updated_at'
        ]
        read_only_fields = ['updated_at']
