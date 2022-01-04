from django.http import HttpResponseRedirect


def index(request):
    return HttpResponseRedirect('/budget_review/view_budget/')