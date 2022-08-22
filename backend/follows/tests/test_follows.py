from follows.models import Follow
from lists.models import List
import uuid
from model_bakery import baker
from rest_framework import status
from rest_framework.test import APIClient


class AbstractTestFollow:
    followed_model = None
    followed_model_name = ''

    def get_followed_part(self, followed):
        if self.followed_model == List:
            return str(uuid.uuid4()) if followed is None else f'{self.followed_model_name}/{followed.uuid}'
        else:
            return 'testuser2' if followed is None else followed.username
    
    def do(self, user: APIClient, followed=None):
        return user.post(f'/{self.get_followed_part(followed)}/followers/')

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
    followed_model = None
    followed_model_name = ''

    def get_followed_part(self, followed):
        if self.followed_model == List:
            return str(uuid.uuid4()) if followed is None else f'{self.followed_model_name}/{followed.uuid}'
        else:
            return 'testuser2' if followed is None else followed.username
    
    def do(self, user: APIClient, followed=None):
        return user.delete(f'/{self.get_followed_part(followed)}/followers/')

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
    followed_model = None
    followed_model_name = ''

    def get_followed_part(self, followed):
        if self.followed_model == List:
            return str(uuid.uuid4()) if followed is None else f'{self.followed_model_name}/{followed.uuid}'
        else:
            return 'testuser2' if followed is None else followed.username
    
    def do(self, user: APIClient, followed=None):
        return user.get(f'/{self.get_followed_part(followed)}/followers/')

    def test_if_followed_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_200(self, anonymous_user: APIClient):
        object = baker.make(self.followed_model)
        followers = baker.make(Follow, followed=object, _quantity=10)

        response = self.do(anonymous_user, object)

        assert response.status_code == status.HTTP_200_OK
