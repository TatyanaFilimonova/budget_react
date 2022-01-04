from budget_review.models import GrossBook, TransactionClassifier
from rest_framework.pagination import PageNumberPagination
from django_filters import rest_framework as filters
from rest_framework.exceptions import APIException
from rest_framework import status


class NoContent(APIException):
    status_code = status.HTTP_204_NO_CONTENT
    default_detail = ('No content by your request')
    default_code = 'no_content'


class BadRequest(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = ('Bad request')
    default_code = 'bad_request'


class TransactionClassFilter(filters.FilterSet):
    record_class__record_class = filters.CharFilter()

    class Meta:
        model = GrossBook
        fields = ['record_class__record_class']


class PaginationGrossBook(PageNumberPagination):
    page_size = 5
    max_page_size = 10