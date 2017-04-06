from django.db import models
from django.contrib.postgres.fields import ArrayField


class Person(models.Model):
    names = ArrayField(models.CharField(max_length=128))
    text = models.TextField(default='', blank=True)

    def __str__(self):
        return self.names[0]
