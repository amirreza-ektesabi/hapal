from accounts.models import Account
from lists.models import List
from posts.models import Post
from follows.models import Follow
from follows.tests.test_follows import AbstractTestFollow, AbstractTestUnfollow, AbstractTestRetrieveListOfFollowers
from random import choice
import pytest
from model_bakery import baker
from rest_framework import status
from rest_framework.test import APIClient


@pytest.mark.django_db
class TestRetrieveListOfLists:
    def do(self, user: APIClient, username='testuser2'):
        return user.get(f'/{username}/lists/')

    def test_if_user_doesnt_exist_returns_404(self, anonymous_user: APIClient):
        response = self.do(anonymous_user)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_200(self, anonymous_user: APIClient):
        object = baker.make(Account)
        posts = baker.make(List, user=object, _quantity=10)

        response = self.do(anonymous_user, object.username)

        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestRetrieveListOfPosts:
    def do(self, user: APIClient, username='testuser2'):
        return user.get(f'/{username}/posts/')

    def test_if_user_doesnt_exist_returns_404(self, anonymous_user: APIClient):
        response = self.do(anonymous_user)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_200(self, anonymous_user: APIClient):
        object = baker.make(Account)
        posts = baker.make(Post, user=object, _quantity=10)

        response = self.do(anonymous_user, object.username)

        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestFollow(AbstractTestFollow):
    followed_model = Account
    followed_model_name = 'account'


@pytest.mark.django_db
class TestUnfollow(AbstractTestUnfollow):
    followed_model = Account
    followed_model_name = 'account'


@pytest.mark.django_db
class TestRetrieveListOfFollowers(AbstractTestRetrieveListOfFollowers):
    followed_model = Account
    followed_model_name = 'account'


@pytest.mark.django_db
class TestRetrieveListOfFollowing:
    def do(self, user: APIClient, username='testuser2'):
        return user.get(f'/{username}/following/')

    def test_if_user_doesnt_exist_returns_404(self, anonymous_user: APIClient):
        response = self.do(anonymous_user)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_200(self, anonymous_user: APIClient):
        user = baker.make(Account)
        for _ in range(10):
            followed = baker.make(choice((List, Account)))
            baker.make(Follow, user=user, followed=followed)

        response = self.do(anonymous_user, user.username)

        assert response.status_code == status.HTTP_200_OK
