# Generated by Django 3.2.7 on 2021-10-21 19:11

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('budget_review', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grossbook',
            name='transaction_date',
            field=models.DateField(default=datetime.datetime(2021, 10, 21, 19, 11, 16, 985848, tzinfo=utc), help_text='If date does not set - current date would be used '),
        ),
    ]
