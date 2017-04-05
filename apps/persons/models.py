from django.db import models


class Person(models.Model):
    primary_name = models.CharField(max_length=128, unique=True)
    text = models.TextField(default='', blank=True)

    def __str__(self):
        return self.name


class Name(models.Model):
    name = models.CharField(max_length=128)
    person = models.ForeignKey(Person, related_name='names')

    def __str__(self):
        return f'{self.name} ({self.person.primary_name})'
