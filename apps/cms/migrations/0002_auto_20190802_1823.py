# Generated by Django 2.2 on 2019-08-02 10:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='banner',
            options={'ordering': ['priority']},
        ),
        migrations.AlterField(
            model_name='banner',
            name='priority',
            field=models.IntegerField(default=1),
        ),
    ]
