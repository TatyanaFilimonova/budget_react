import os

from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponseRedirect
from datetime import date, timedelta, datetime
from . models import TransactionClassifier, GrossBook
from django.db.models import Sum
from django.db import transaction
from django.contrib.auth.decorators import login_required
from django.contrib import messages
import json

# Create your views here.


@login_required(login_url='/login')
def view_budget(request, date_start=None, date_finish=None):
    if request.method == 'POST' and 'date_start' in request.POST.keys():
        date_start = request.POST['date_start']
        date_finish = request.POST['date_finish']
    if date_start is None or date_start == "" :
        date_start = (date.today()-timedelta(days=1)).strftime('%Y-%m-%d')
    if date_finish is None or date_finish == "":
        date_finish = date.today().strftime('%Y-%m-%d')

    open_balance = GrossBook.objects.filter(
        transaction_date__lte=date_start,
        user=request.user
    ).aggregate(
        Sum('amount')
    )

    close_balance = GrossBook.objects.filter(
        transaction_date__lte=date_finish,
        user=request.user
    ).aggregate(
        Sum('amount')
    )

    grossbook = GrossBook.objects.filter(
        transaction_date__range=sorted([date_start, date_finish], key = lambda x: datetime.strptime(x,'%Y-%m-%d')),
        user=request.user
        ).only(
            'transaction_date',
            'record_type',
            'record_class',
            'amount'
        ).order_by(
            'transaction_date',
            'amount')

    record_classes = TransactionClassifier.objects.filter(
        user=request.user
    ).only(
        'id',
        'class_type',
        'record_class',
    ).order_by(
        'class_type'
    )

    debit = 0
    credit = 0
    for g in grossbook:
        if g.record_type == 1:
            credit += g.amount
        else:
            debit += g.amount
    return render(
                    request,
                    'index.html',
                    context={'grossbook_js': list(grossbook.values()),
                             'grossbook': grossbook,
                             'date_start': date_start,
                             'date_finish': date_finish,
                             'open_balance': open_balance['amount__sum'],
                             'close_balance': close_balance['amount__sum'],
                             'debit': debit,
                             'credit': credit,
                             'record_classes': record_classes,
                             'record_classes_js': json.dumps(list(record_classes.values()))},
                 )


@login_required(login_url='/admin/')
def add_record(request, date_start, date_finish):
    if request.method == 'POST':
        record_class = get_object_or_404(TransactionClassifier, id=request.POST['record_class'], user=request.user)
        try:
            amount = float(request.POST['amount'])
        except:
            messages.add_message(request, messages.ERROR, 'Wrong value for amount')
            return redirect(
                f'/budget_review/view_budget/{date_start}/{date_finish}',
                date_start=date_start,
                date_finish=date_finish
            )
        if (int(record_class.class_type) < 0 and amount > 0) or (int(record_class.class_type) > 0 and amount < 0):
            amount = 0. - amount
        with transaction.atomic():
            record = GrossBook(
                transaction_date=request.POST['transaction_date'],
                user=request.user,
                record_type=request.POST['record_type'],
                record_class=record_class,
                amount=amount,
            )
            record.save()
            return redirect(
                f'/budget_review/view_budget/{date_start}/{date_finish}',
                date_start=date_start,
                date_finish=date_finish
            )
    else:
        return redirect(f'/budget_review/view_budget/')


@login_required(login_url='/admin/')
def new_transaction_class(request, date_start=None, date_finish=None):
    if request.method == 'GET':
        record_classes = TransactionClassifier.objects.filter(
            user=request.user
        ).only(
            'id',
            'class_type',
            'record_class',
        ).order_by(
            'class_type'
        )
        return render(
            request,
            'add_class.html',
            context={'record_classes': record_classes,
                     'date_start': date_start,
                     'date_finish': date_finish,
                     'record_classes_js': list(record_classes.values())},
        )
    else:
        with transaction.atomic():
            test_classes = TransactionClassifier.objects.filter(
                user=request.user,
                record_class=request.POST['class_name']
            ).exists()

            if not test_classes:
                class_ = TransactionClassifier(
                    user=request.user,
                    class_type=request.POST['class_type'],
                    record_class=request.POST['class_name'],
                )
                class_.save()
                return redirect(
                    f'/budget_review/view_budget/{date_start}/{date_finish}',
                    date_start=date_start,
                    date_finish=date_finish
                )
            else:
                messages.add_message(request, messages.ERROR, 'Transaction class already exist')
                record_classes = TransactionClassifier.objects.filter(
                    user=request.user
                ).only(
                    'id',
                    'class_type',
                    'record_class',
                ).order_by(
                    'class_type'
                )
                return render(
                    request,
                    'add_class.html',
                    context={'record_classes': record_classes,
                             'date_start': date_start,
                             'date_finish': date_finish,
                             'record_classes_js': list(record_classes.values())},
                )


@login_required(login_url='/admin/')
def index(request):
    return HttpResponseRedirect('view_budget/')


@login_required(login_url='/admin/')
def view_chart(request, date_start, date_finish):
    raw_data = GrossBook.objects.filter(
        user=request.user,
        transaction_date__range=[date_start, date_finish]
    )
    sum_by_classes = raw_data.values('record_class__record_class',
                                     ).annotate(sum_=Sum('amount'))
    open_balance = GrossBook.objects.filter(
        transaction_date__lte=date_start,
        user=request.user
    ).aggregate(
        Sum('amount')
    )
    day_balance = {date_start: float(open_balance['amount__sum'])}
    for date_ in range(
            1, (datetime.strptime(date_finish, '%Y-%m-%d'
                                  ) - datetime.strptime(date_start, '%Y-%m-%d')).days+1):
        curr_date = datetime.strptime(date_start, '%Y-%m-%d') + timedelta(days=date_)
        prev_day_balance = day_balance[(curr_date - timedelta(days=1)).strftime('%Y-%m-%d')]
        current_day_balance = GrossBook.objects.filter(
            transaction_date=curr_date,
            user=request.user
        ).aggregate(
            Sum('amount')
        )
        if current_day_balance['amount__sum'] is not None:
            day_balance[curr_date.strftime('%Y-%m-%d')] = prev_day_balance + float(current_day_balance['amount__sum'])
        else:
            day_balance[curr_date.strftime('%Y-%m-%d')] = prev_day_balance

    data_classes_expenses = []
    data_classes_incomes = []
    labels_for_classes_expenses = []
    labels_for_classes_incomes = []
    for record in sum_by_classes:
        if float(record['sum_']) < 0:
            data_classes_expenses.append(float(record['sum_']))
            labels_for_classes_expenses.append(record['record_class__record_class'])
        else:
            data_classes_incomes.append(float(record['sum_']))
            labels_for_classes_incomes.append(record['record_class__record_class'])
    return render(
        request,
        'view_chart.html',
        context={
            'data_classes_expenses': data_classes_expenses,
            'labels_for_classes_expenses': labels_for_classes_expenses,
            'data_classes_incomes': data_classes_incomes,
            'labels_for_classes_incomes': labels_for_classes_incomes,
            'day_balance': list(day_balance.values()),
            'labels_for_day_balance': list(day_balance.keys()),
            'date_start': date_start,
            'date_finish': date_finish,
        },
    )
