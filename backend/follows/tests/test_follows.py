from follows.models import Follow
from lists.models import List

from django.urls import reverse
from django.db.models import Model
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.response import Response

import uuid
from model_bakery import baker


class AbstractTestFollow:
    followed_model: Model
    followed_model_name: str

    def get_kwargs(self, followed) -> dict:
        if self.followed_model == List:
            return {'uuid': str(uuid.uuid4()) if followed is None else followed.uuid}
        else:
            return {'username': 'testuser2' if followed is None else followed.username}
    
    def do(self, user: APIClient, followed=None) -> Response:
        return user.post(
            reverse(f'{self.followed_model_name}_followers', kwargs=self.get_kwargs(followed))
        )

    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        object = baker.make(self.followed_model)
        response = self.do(anonymous_user, object)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_followed_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user)

        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_if_followed_returns_302(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(self.followed_model)
        follow = baker.make(Follow, user=user, followed=object)

        response = self.do(authenticated_user, object)

        assert response.status_code == status.HTTP_302_FOUND

    def test_if_successes_returns_201(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(self.followed_model)

        response = self.do(authenticated_user, object)

        assert response.status_code == status.HTTP_201_CREATED
        assert Follow.objects.filter(**{
            'user': user,
            'followed_{}'.format(self.followed_model_name): object,
        }).exists()


class AbstractTestUnfollow:
    followed_model: Model
    followed_model_name: str

    def get_kwargs(self, followed) -> dict:
        if self.followed_model == List:
            return {'uuid': str(uuid.uuid4()) if followed is None else followed.uuid}
        else:
            return {'username': 'testuser2' if followed is None else followed.username}
    
    def do(self, user: APIClient, followed=None) -> Response:
        return user.delete(
            reverse(f'{self.followed_model_name}_followers', kwargs=self.get_kwargs(followed))
        )

    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        object = baker.make(self.followed_model)
        response = self.do(anonymous_user, object)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_followed_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user)

        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_if_not_followed_returns_404(self, authenticated_user: APIClient):
        object = baker.make(self.followed_model)
        
        response = self.do(authenticated_user, object)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_204(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(self.followed_model)
        follow = baker.make(Follow, user=user, followed=object)

        response = self.do(authenticated_user, object)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Follow.objects.filter(**{
            'user': user,
            'followed_{}'.format(self.followed_model_name): object,
        }).exists()


class AbstractTestRetrieveListOfFollowers:
    followed_model: Model
    followed_model_name: str

    def get_kwargs(self, followed) -> dict:
        if self.followed_model == List:
            return {'uuid': str(uuid.uuid4()) if followed is None else followed.uuid}
        else:
            return {'username': 'testuser2' if followed is None else followed.username}
    
    def do(self, user: APIClient, followed=None) -> Response:
        return user.get(
            reverse(f'{self.followed_model_name}_followers', kwargs=self.get_kwargs(followed))
        )

    def test_if_followed_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_200(self, anonymous_user: APIClient):
        object = baker.make(self.followed_model)
        followers = baker.make(Follow, followed=object, _quantity=10)

        response = self.do(anonymous_user, object)

        assert response.status_code == status.HTTP_200_OK
