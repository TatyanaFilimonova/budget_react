import datetime

import django
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.db.models import Sum

# Create your models here.


class TransactionClassifier(models.Model):

    class DebitCredit(models.IntegerChoices):
        Debit = 1, _('Debit')
        Credit = -1, _('Credit')

    class_type = models.IntegerField(
        choices=DebitCredit.choices,
        help_text='Choose from enumerate list the type of transaction for help us to prepare the valid classifier'
    )

    record_class = models.CharField(
        max_length=200,
        unique=True,
        help_text='Should be unique for each debit or credit operation type'
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Owner of classes",
        on_delete=models.CASCADE,
        related_name='classes',
    )


class GrossBook(models.Model):
    class DebitCredit(models.IntegerChoices):
        Debit = 1, _('Debit')
        Credit = -1, _('Credit')

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="Owner of budget",
        on_delete=models.CASCADE,
        related_name='budget',
    )

    transaction_date = models.DateField(
        default=datetime.date.today(),
        help_text='If date does not set - current date would be used '
    )
    record_type = models.IntegerField(
        choices=DebitCredit.choices,
        help_text='Choose from enumerate list the type of transaction for help us to prepare the valid classifier'
    )
    record_class = models.ForeignKey(
        TransactionClassifier, on_delete=models.CASCADE,
        help_text='Record class you could choose from the list. If you doesnt find suitable class, please create one'
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text='Please use ONE currency for all your records'
    )

    def __str__(self):
        return f'| User {str(self.user)[0:10]}' + \
               f'class {self.record_class} |' + \
               f'amount {str(self.amount)[0:8]}'  # NOQA