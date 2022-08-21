from posts.models import Post, Property, Pair, PROPERTY_TYPES
import uuid
import pytest
from model_bakery import baker
from rest_framework import status
from rest_framework.test import APIClient


@pytest.mark.django_db
class TestUpdatePost:
    def do(self, user: APIClient, uuid: str, data: dict = {}):
        return user.patch(f'/post/{uuid}/', data)

    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        object = baker.make(Post)
        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_user_is_not_owner_of_post_returns_403(self, authenticated_user: APIClient):
        object = baker.make(Post)
        response = self.do(authenticated_user, object.uuid)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_post_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_title_size_exceeded_returns_400(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(Post, user=user)

        data = {
            'title': 'h' * 300
        }
        response = self.do(authenticated_user, object.uuid, data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_if_successes_returns_200(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(Post, user=user)

        data = {
            'title': 'test post title',
        }
        response = self.do(authenticated_user, object.uuid, data)

        assert response.status_code == status.HTTP_200_OK
        assert Post.objects.filter(
            uuid=object.uuid,
            user=user,
            **data
        ).exists()
        assert all(response.data[key] == data[key] for key in data.keys())


@pytest.mark.django_db
class TestDestroyPost:
    def do(self, user: APIClient, uuid: str):
        return user.delete(f'/post/{uuid}/')

    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        object = baker.make(Post)
        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_user_is_not_owner_of_post_returns_403(self, authenticated_user: APIClient):
        object = baker.make(Post)
        response = self.do(authenticated_user, object.uuid)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_post_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_204(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(Post, user=user)

        response = self.do(authenticated_user, object.uuid)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Post.objects.filter(
            uuid=object.uuid,
            user=user,
        ).exists()


@pytest.mark.django_db
class TestRetrievePost:
    def do(self, user: APIClient, uuid: str):
        return user.get(f'/post/{uuid}/')

    def test_if_post_doesnt_exist_returns_404(self, anonymous_user: APIClient):
        response = self.do(anonymous_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_200(self, anonymous_user: APIClient):
        object = baker.make(Post)

        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestAddProperty:
    def do(self, user: APIClient, uuid: str, data: dict = {}):
        return user.post(f'/post/{uuid}/properties/', data, format='json')
    
    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        object = baker.make(Post)
        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_user_is_not_owner_of_post_returns_403(self, authenticated_user: APIClient):
        object = baker.make(Post)
        response = self.do(authenticated_user, object.uuid)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_post_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_type_is_not_provided_returns_400(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(Post, user=user)

        response = self.do(authenticated_user, object.uuid)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_if_successes_returns_201(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(Post, user=user)

        data = {
            'type': 'Text',
            'key': 'test property key',
            'pairs': [
                {'key': 'first key', 'value': 'first value'},
                {'key': 'second key', 'value': 'second value'},
                {'key': 'third key', 'value': 'third value'},
                {'key': 'fourth key', 'value': 'fourth value'}
            ]
        }
        response = self.do(authenticated_user, object.uuid, data)

        assert response.status_code == status.HTTP_201_CREATED
        assert Property.objects.filter(
            puuid=response.data['puuid'],
            type=Property.Type[data['type']],
            post=object,
        ).exists()
        value_model, fields_switch = PROPERTY_TYPES[Property.Type[data['type']]]
        for order_number, pair in enumerate(data['pairs'], 1):
            assert Pair.objects.filter(
                property__puuid=response.data['puuid'],
                key=pair['key'],
                order_number=order_number,
            ).exists()
            assert value_model.objects.filter(**{
                fields_switch['value']: pair['value'],
                'pair__order_number': order_number,
                'pair__property__puuid': response.data['puuid'],
            }).exists()
        assert all(response.data[key] == data[key] for key in data.keys())


@pytest.mark.django_db
class TestRetrieveListOfProperties:
    def do(self, user: APIClient, uuid: str):
        return user.get(f'/post/{uuid}/properties/')

    def test_if_post_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_201(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(Post, user=user)
        properties = baker.make(Property, post=object, _quantity=10)

        response = self.do(authenticated_user, object.uuid)

        assert response.status_code == status.HTTP_200_OK
