from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('view_budget/', views.view_budget, name='view_budget'),
    path('view_budget/<date_start>/<date_finish>', views.view_budget, name='view_budget'),
    path('add_record/<date_start>/<date_finish>', views.add_record, name='add_record'),
    path('add_class/<date_start>/<date_finish>', views.new_transaction_class, name='add_class'),
    path('add_class/', views.new_transaction_class, name='add_class'),
    path('view_chart/<date_start>/<date_finish>', views.view_chart, name='view_chart')
]

