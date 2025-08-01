from django.db import models

class EventFile(models.Model):
    file = models.FileField(upload_to='events/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
