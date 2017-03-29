from django.db import models


class Day(models.Model):
    date = models.DateField()
    text = models.TextField(default='', blank=True)
    title = models.CharField(default='', blank=True, max_length=128)

    class Meta:
        ordering = ['date']
