# -*- coding: utf-8 -*-
# Generated by Django 1.11b1 on 2017-03-23 16:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('days', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='day',
            name='title',
            field=models.CharField(blank=True, default='', max_length=128),
        ),
    ]
