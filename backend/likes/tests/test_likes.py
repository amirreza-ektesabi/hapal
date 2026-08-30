from baseapp.uuid_generator import uuid_generator
from likes.models import Like

from django.urls import reverse
from django.db.models import Model
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.response import Response

from model_bakery import baker


class AbstractTestLike:
    liked_model: Model
    liked_model_name: str

    def do(self, user: APIClient, uuid: str) -> Response:
        return user.post(
            reverse(f'{self.liked_model_name}_likes', kwargs={'uuid': uuid})
        )

    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        object = baker.make(self.liked_model)
        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_liked_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, uuid_generator())

        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_if_liked_returns_302(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(self.liked_model)
        follow = baker.make(Like, user=user, liked=object)

        response = self.do(authenticated_user, object.uuid)

        assert response.status_code == status.HTTP_302_FOUND
    
    def test_if_successes_returns_201(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(self.liked_model)

        response = self.do(authenticated_user, object.uuid)

        assert response.status_code == status.HTTP_201_CREATED
        assert Like.objects.filter(**{
            'user': user,
            'liked_{}'.format(self.liked_model_name): object,
        }).exists()


class AbstractTestUnlike:
    liked_model: Model
    liked_model_name: str

    def do(self, user: APIClient, uuid: str) -> Response:
        return user.delete(
            reverse(f'{self.liked_model_name}_likes', kwargs={'uuid': uuid})
        )

    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        object = baker.make(self.liked_model)
        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_liked_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, uuid_generator())

        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_if_not_liked_returns_404(self, authenticated_user: APIClient):
        object = baker.make(self.liked_model)
        
        response = self.do(authenticated_user, object.uuid)

        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_if_successes_returns_204(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(self.liked_model)
        like = baker.make(Like, user=user, liked=object)

        response = self.do(authenticated_user, object.uuid)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Like.objects.filter(**{
            'user': user,
            'liked_{}'.format(self.liked_model_name): object,
        }).exists()


class AbstractTestRetrieveListOfLikes:
    liked_model: Model
    liked_model_name: str

    def do(self, user: APIClient, uuid: str) -> Response:
        return user.get(
            reverse(f'{self.liked_model_name}_likes', kwargs={'uuid': uuid})
        )

    def test_if_liked_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, uuid_generator())

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_200(self, anonymous_user: APIClient):
        object = baker.make(self.liked_model)
        likes = baker.make(Like, liked=object, _quantity=10)

        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_200_OK
