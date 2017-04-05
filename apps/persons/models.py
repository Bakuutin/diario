from django.db import models


class Person(models.Model):
    name = models.CharField(max_length=128, unique=True)
    text = models.TextField(default='', blank=True)

    def __str__(self):
        return self.name
