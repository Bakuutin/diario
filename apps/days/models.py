from django.db import models


class Day(models.Model):
    date = models.DateField(primary_key=True, unique=True)
    text = models.TextField(default='', blank=True)
    title = models.CharField(default='', blank=True, max_length=128)

    class Meta:
        ordering = ['date']

    def __str__(self):
        return f'{self.date} {self.title}'.strip()
