# Generated by Django 2.2 on 2019-07-27 02:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0005_auto_20190727_1007'),
    ]

    operations = [
        migrations.AddField(
            model_name='comments',
            name='is_master',
            field=models.BooleanField(default=False),
        ),
    ]
