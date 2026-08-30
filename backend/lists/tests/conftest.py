from accounts.models import Account

from rest_framework.test import APIClient

import pytest


@pytest.fixture
def anonymous_user() -> APIClient:
    return APIClient()


@pytest.fixture
def authenticated_user() -> APIClient:
    client = APIClient()
    client.force_authenticate(Account.objects.get_or_create(username='testuser')[0])
    return client
