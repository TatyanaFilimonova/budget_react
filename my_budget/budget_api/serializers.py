from rest_framework import serializers
from budget_review.models import GrossBook, TransactionClassifier
from django.contrib.auth.models import User

class TransactionClassifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionClassifier
        fields = ('user', 'class_type', 'record_class')

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionClassifier
        fields = ('record_class', 'class_type', 'id')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class DebitCredit(serializers.Field):

    def to_representation(self, value):
        return 'Debit' if value.record_type >= 0 else 'Credit'

    def to_internal_value(self, data):
        return {"record_type": 1} if data == 'Debit' else {"record_type": -1}


class GrossBookSerializer(serializers.ModelSerializer):
    record_class = TransactionSerializer()
    user = UserSerializer()
    record_type = DebitCredit(source='*')
    class Meta:
        model = GrossBook
        fields = ('user', 'id', 'transaction_date', 'record_type', 'amount', 'record_class',)


class BalanceSerializer(serializers.ModelSerializer):
   balance = serializers.DecimalField(10, 2)

   class Meta:
        model = GrossBook
        fields = ('user','balance',)


class GrossBookPOSTSerializer(serializers.ModelSerializer):
    record_type = DebitCredit(source='*')
    class Meta:
        model = GrossBook
        fields = ('transaction_date', 'record_type', 'amount', 'record_class', 'user')