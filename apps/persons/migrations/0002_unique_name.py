# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-05 19:04
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('persons', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='person',
            name='name',
            field=models.CharField(max_length=128, unique=True),
        ),
    ]
