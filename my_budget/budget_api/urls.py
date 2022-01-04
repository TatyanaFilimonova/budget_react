from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from . import views

urlpatterns = [
path('grossbook/', views.GrossBookFeed.as_view()),
path('grossbook/balance/', views.AccountBalance.as_view()),
path('grossbook/balance/daily/', views.DailyBalance.as_view()),
path('grossbook/bounded/', views.GrossBookBounded.as_view()),
path('grossbook/classes/', views.TransactionClasses.as_view()),
path('grossbook/classes/ops/', views.TransactionClassOps.as_view()),
path('grossbook/ops/', views.GrossBookOps.as_view()),
path('grossbook/login/', views.ExampleView.as_view(), name='token'),
path('grossbook/by/class/', views.TransactionByClass.as_view()),

]