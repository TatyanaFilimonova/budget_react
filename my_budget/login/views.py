from django.shortcuts import render
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponseRedirect
from datetime import date, timedelta, datetime
from django.db.models import Sum
from django.db import transaction
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
import json



def create_user(username, password):
    user = User(
        username=username,
        is_staff=False,
        is_superuser=False,
    )
    user.set_password(password)
    user.save()
    return user

# Create your views here.
@login_required(login_url='/login/')
def index(request):
    return HttpResponseRedirect('login_user')

def valid_credentials(request):
    username = request.POST['Username']
    password = request.POST['Password']
    if not username:
        messages.add_message(request, messages.ERROR, 'Username is mandatory field')
    if not password:
        messages.add_message(request, messages.ERROR, 'Password is mandatory field')
    return username, password


def login_user(request):
    if request.method == 'GET':
        return render(request, 'log.html')
    username, password = valid_credentials(request)
    if not messages:
        return render(request, 'log.html')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponseRedirect('/budget_review/view_budget/')
    else:
        messages.add_message(request, messages.ERROR, 'Username or password is incorrect')
        return render(request, 'log.html')


def register(request):
    if request.method == 'GET':
        return render(request, 'register.html')
    username, password = valid_credentials(request)
    if not messages:
        return render(request, 'register.html')
    user_exists = User.objects.filter(username=username).exists()
    if user_exists:
        messages.add_message(request, messages.ERROR, 'Username already exists')
        return render(request, 'register.html')

    # create user
    with transaction.atomic():
        user = create_user(username, password)

    return HttpResponseRedirect('/login/')

@login_required(login_url='/login/')
def logout_user(request):
    logout(request)
    print("Logout was made")
    return render(request, 'log.html')