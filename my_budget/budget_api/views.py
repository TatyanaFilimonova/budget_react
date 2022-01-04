import http


from rest_framework.generics import ListAPIView, mixins, CreateAPIView
from .serializers import \
    GrossBookSerializer, \
    TransactionSerializer, \
    GrossBookPOSTSerializer, \
    TransactionClassifierSerializer, \
    BalanceSerializer
from budget_review.models import GrossBook, TransactionClassifier
from datetime import datetime, timedelta
from .services import BadRequest, NoContent, PaginationGrossBook, TransactionClassFilter
from rest_framework.exceptions import NotFound, APIException
#from django.core.exceptions import BadRequest
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.db.models import Sum
from rest_framework.authtoken.views import ObtainAuthToken


class GrossBookFeed(ListAPIView,
                    mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin):

    """GrossBook list with backend filter by transaction class"""

    serializer_class = GrossBookSerializer
    filter_backends = (DjangoFilterBackend,)
    pagination_class = PaginationGrossBook
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


    def get_queryset(self):

        queryset = GrossBook.objects.select_related().filter(user=self.request.user).order_by('transaction_date')
        return queryset



class GrossBookOps(CreateAPIView):

    """GrossBook list with backend filter by transaction class"""

    serializer_class = GrossBookPOSTSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = GrossBook.objects.select_related().filter(user=self.request.user).order_by('transaction_date')
        return queryset

    def post(self, request, *args, **kwargs):
        print("REQUEST DATA: ", request.data)
        return self.create(request, *args, **kwargs)


class TransactionClassOps(CreateAPIView):

    """GrossBook list with backend filter by transaction class"""

    serializer_class = TransactionClassifierSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = TransactionClassifier.objects.select_related().filter(user=self.request.user)
        return queryset

    def post(self, request, *args, **kwargs):
        print("REQUEST DATA: ", request.data)
        return self.create(request, *args, **kwargs)


class AccountBalance(ListAPIView):
    serializer_class = BalanceSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if 'start_period' in self.request.query_params.keys() and 'end_period' in self.request.query_params.keys():
            start_period = self.request.query_params['start_period']
            end_period = self.request.query_params['end_period']
            open_balance = GrossBook.objects.filter(
                transaction_date__lte=start_period,
                user=self.request.user
            ).aggregate(
                Sum('amount'))
            close_balance = GrossBook.objects.filter(
                transaction_date__lte=end_period,
                user=self.request.user
            ).aggregate(
                Sum('amount'))
            return Response({"open_balance": open_balance['amount__sum'],
                             "close_balance": close_balance['amount__sum'],

                             })
        else:
            raise BadRequest('Invalid request. Parameters [start_period], [end_period] should be present in request')

class GrossBookBounded(ListAPIView):

    """Return transaction in bounded period"""

    serializer_class = GrossBookSerializer
    filter_backends = (DjangoFilterBackend,)
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print(self.request.query_params.keys())
        if 'start_period' in self.request.query_params.keys() and 'end_period' in self.request.query_params.keys():
            start_period = self.request.query_params['start_period']
            end_period = self.request.query_params['end_period']
            if start_period and end_period:
                start_period = datetime.strptime(start_period, '%Y-%m-%d')
                end_period = datetime.strptime(end_period, '%Y-%m-%d')
                queryset = GrossBook.objects.select_related().filter(transaction_date__gte=start_period
                                                ).filter(transaction_date__lte=end_period
                                                         ).filter(user=self.request.user)

                if queryset:
                    return queryset
            else:
                    raise  BadRequest('Invalid request. [start_period], [end_period] shouldnt be empty')
        else:
            raise BadRequest('Invalid request. Parameters [start_period], [end_period] should be present in request')

class TransactionClasses(ListAPIView):

    """GrossBook list with backend filter by transaction class"""

    serializer_class = TransactionSerializer
    filter_backends = (DjangoFilterBackend,)
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = TransactionClassifier.objects.filter(user=self.request.user).select_related()
        return queryset


class ExampleView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({'user': user.username, 'user_id': user.id, 'token': token.key})

class DailyBalance(ListAPIView):
    serializer_class = BalanceSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if 'start_period' in self.request.query_params.keys() and 'end_period' in self.request.query_params.keys():
            start_period = self.request.query_params['start_period']
            end_period = self.request.query_params['end_period']
            balances=[]
            for day in range(0, (datetime.strptime(end_period, '%Y-%m-%d') - datetime
                    .strptime(start_period, '%Y-%m-%d')).days + 1):
                current_date = datetime.date(datetime.strptime(start_period, '%Y-%m-%d') + timedelta(days=day))
                if not balances:
                    balance = GrossBook.objects.filter(
                    transaction_date__lte =current_date,
                    user=self.request.user
                      ).aggregate(
                          Sum('amount'))

                    if balance['amount__sum'] is not None:
                        balances.append({'date': current_date,
                                     'balance': balance['amount__sum']})

                else:
                    balance = GrossBook.objects.filter(
                        transaction_date=current_date,
                        user=self.request.user
                    ).aggregate(
                        Sum('amount'))
                    balances.append({'date': current_date,
                        'balance': balances[-1]['balance']+ (balance['amount__sum'] if balance['amount__sum'] else 0)})

            return Response({'balances': balances})
        else:
            raise BadRequest('Invalid request. Parameters [start_period], [end_period] should be present in request')


class TransactionByClass(ListAPIView):
    serializer_class = GrossBookSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if 'start_period' in self.request.query_params.keys() and 'end_period' in self.request.query_params.keys():
            start_period = self.request.query_params['start_period']
            end_period = self.request.query_params['end_period']
            expenses = GrossBook.objects.filter(
                    transaction_date__gte=start_period,
                    transaction_date__lte=end_period,
                    user=self.request.user
                      ).select_related().values('record_type', 'record_class__record_class').annotate(Sum('amount')).order_by('record_type')

            return Response({'expenses': expenses})
        else:
            raise BadRequest('Invalid request. Parameters [start_period], [end_period] should be present in request')