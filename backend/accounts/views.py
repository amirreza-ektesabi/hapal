from accounts.models import Account
from accounts.serializers import ProfileSerializer
from baseapp.views import CheckObjectFollowedByCurrentUserMixin

from rest_framework.generics import RetrieveAPIView


class ProfilePage(CheckObjectFollowedByCurrentUserMixin, RetrieveAPIView):
    queryset = Account.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = 'username'
