from accounts.models import Account
from accounts.serializers import ProfileSerializer

from rest_framework.generics import RetrieveAPIView


class ProfilePage(RetrieveAPIView):
    queryset = Account.objects.prefetch_related('followers', 'followings')
    serializer_class = ProfileSerializer
    lookup_field = 'username'
