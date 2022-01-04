from django.contrib import admin

# Register your models here.

from .models import TransactionClassifier, GrossBook
admin.site.register(TransactionClassifier)
admin.site.register(GrossBook)
