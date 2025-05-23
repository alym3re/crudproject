# Generated by Django 5.2 on 2025-04-21 14:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crudapp', '0002_remove_item_description_remove_item_quantity_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='item',
            name='background_color',
        ),
        migrations.RemoveField(
            model_name='item',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='item',
            name='head',
        ),
        migrations.RemoveField(
            model_name='item',
            name='mouth',
        ),
        migrations.AddField(
            model_name='item',
            name='background',
            field=models.CharField(default='background1.png', max_length=100),
        ),
        migrations.AddField(
            model_name='item',
            name='clothes',
            field=models.CharField(default='clothes1.png', max_length=100),
        ),
        migrations.AddField(
            model_name='item',
            name='hat',
            field=models.CharField(default='hat1.png', max_length=100),
        ),
        migrations.AddField(
            model_name='item',
            name='skin',
            field=models.CharField(default='skin1.png', max_length=100),
        ),
    ]
