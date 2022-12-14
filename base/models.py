from statistics import mode
from zoneinfo import available_timezones
from django.db import models
# from django.core.validators import MaxValueValidator, MinValueValidator


# Create your models here.

class RoomMember(models.Model):
    name = models.CharField(max_length=200)
    uid = models.CharField(max_length=1000)
    room_name = models.CharField(max_length=200)
    insession = models.BooleanField(default=True)

    def __str__(self):
        return self.name



class Room(models.Model):
    RoomName = models.CharField(max_length=200)
    Available = models.BooleanField(default=True)
    max = models.IntegerField()

    def __str__(self):
        return self.RoomName
