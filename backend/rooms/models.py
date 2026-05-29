from django.db import models

class LaagRoom(models.Model):
    room_code = models.CharField(max_length=100, unique=True, primary_key=True)
    laag_date = models.CharField(max_length=255, default='Saturday', blank=True)
    participants = models.CharField(max_length=255, default='murag 5 persons haha', blank=True)
    service = models.CharField(max_length=255, default='3 motors', blank=True)
    meetup_area = models.CharField(max_length=255, default='TBA HAHA', blank=True)
    meetup_time = models.CharField(max_length=255, default='8:00 AM – Meet up daw forsure 9 nasad ka abot haha', blank=True)
    food_items = models.JSONField(default=list, blank=True)
    foods = models.JSONField(default=list, blank=True) # Supporting simple food lists from other files
    active_users = models.JSONField(default=list, blank=True)  # List of {"nickname": "...", "last_seen": "ISO timestamp"}
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'laag_rooms' # Maintain database table naming consistency

    def __str__(self):
        return f"{self.room_code} - Last updated: {self.updated_at}"

