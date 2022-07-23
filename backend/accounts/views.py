from django.shortcuts import render

from dal import autocomplete

from accounts.models import Account


class AccountAutocomp(autocomplete.Select2QuerySetView):
    def get_queryset(self):
        qs = Account.objects.all()
        if self.q:
            qs = qs.filter(username__istartswith=self.q)
        return qs
