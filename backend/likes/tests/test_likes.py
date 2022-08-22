from likes.models import Like
import uuid
from model_bakery import baker
from rest_framework import status
from rest_framework.test import APIClient


class AbstractTestLike:
    liked_model = None
    liked_model_name = ''

    def do(self, user: APIClient, uuid: str):
        return user.post(f'/{self.liked_model_name}/{uuid}/likes/')

    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        object = baker.make(self.liked_model)
        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_liked_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, str(uuid.uuid4()))

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
    liked_model = None
    liked_model_name = ''

    def do(self, user: APIClient, uuid: str):
        return user.delete(f'/{self.liked_model_name}/{uuid}/likes/')

    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        object = baker.make(self.liked_model)
        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_liked_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, str(uuid.uuid4()))

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
    liked_model = None
    liked_model_name = ''

    def do(self, user: APIClient, uuid: str):
        return user.get(f'/{self.liked_model_name}/{uuid}/likes/')

    def test_if_liked_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_200(self, anonymous_user: APIClient):
        object = baker.make(self.liked_model)
        likes = baker.make(Like, liked=object, _quantity=10)

        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_200_OK
