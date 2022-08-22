import pytest
from rest_framework.test import APIClient
from accounts.models import Account


@pytest.fixture
def anonymous_user():
    return APIClient()


@pytest.fixture
def authenticated_user():
    client = APIClient()
    client.force_authenticate(Account.objects.get_or_create(username='testuser')[0])
    return client
