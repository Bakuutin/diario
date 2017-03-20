from django.db import models


class Day(models.Model):
    date = models.DateField()
    text = models.TextField(default='', blank=True)
