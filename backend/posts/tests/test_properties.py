from posts.models import Post, Property, Pair, PROPERTY_TYPES
import uuid
import pytest
from model_bakery import baker
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse


@pytest.mark.django_db
class TestUpdateProperty:
    def do(self, user: APIClient, uuid: str, puuid: str, data: dict = {}):
        return user.patch(
            reverse('property_page', kwargs={'uuid': uuid, 'puuid': puuid}),
            data, format='json'
        )

    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        object = baker.make(Property)
        response = self.do(anonymous_user, object.post.uuid, object.puuid)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_user_is_not_owner_of_post_returns_403(self, authenticated_user: APIClient):
        object = baker.make(Property)
        response = self.do(authenticated_user, object.post.uuid, object.puuid)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_post_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, str(uuid.uuid4()), str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_property_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        post = baker.make(Post, user=user)
        response = self.do(authenticated_user, post.uuid, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_if_successes_returns_200(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(Property, post__user=user, type=0)

        data = {
            'key': 'new property key',
            'pairs': [
                {'key': 'first key', 'value': 'first value'},
                {'key': 'second key', 'value': 'second value'},
                {'key': 'third key', 'value': 'third value'},
                {'key': 'fourth key', 'value': 'fourth value'}
            ]
        }
        response = self.do(authenticated_user, object.post.uuid, object.puuid, data)

        assert response.status_code == status.HTTP_200_OK
        assert Property.objects.filter(
            puuid=object.puuid,
            type=object.type,
            post=object.post,
        ).exists()
        value_model, fields_switch = PROPERTY_TYPES[object.type]
        for order_number, pair in enumerate(data['pairs'], 1):
            assert Pair.objects.filter(
                property__puuid=object.puuid,
                key=pair['key'],
                order_number=order_number,
            ).exists()
            assert value_model.objects.filter(**{
                fields_switch['value']: pair['value'],
                'pair__order_number': order_number,
                'pair__property__puuid': object.puuid,
            }).exists()
        assert all(response.data[key] == data[key] for key in data.keys())


@pytest.mark.django_db
class TestDestroyProperty:
    def do(self, user: APIClient, uuid: str, puuid: str):
        return user.delete(
            reverse('property_page', kwargs={'uuid': uuid, 'puuid': puuid})
        )

    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        object = baker.make(Property)
        response = self.do(anonymous_user, object.post.uuid, object.puuid)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_user_is_not_owner_of_post_returns_403(self, authenticated_user: APIClient):
        object = baker.make(Property)
        response = self.do(authenticated_user, object.post.uuid, object.puuid)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_post_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, str(uuid.uuid4()), str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_property_doesnt_exist_returns_403(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        post = baker.make(Post, user=user)
        response = self.do(authenticated_user, post.uuid, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_if_successes_returns_204(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(Property, post__user=user)
        pairs = baker.make(Pair, property=object, _quantity=10)

        response = self.do(authenticated_user, object.post.uuid, object.puuid)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Property.objects.filter(
            puuid=object.puuid,
            post=object.post
        ).exists()
        assert all(not Pair.objects.prefetch_related('property').filter(
            property__puuid=object.puuid,
            property__post=object.post,
            order_number=pair.order_number,
        ).exists() for pair in pairs)


@pytest.mark.django_db
class TestRetrieveProperty:
    def do(self, user: APIClient, uuid: str, puuid: str):
        return user.get(
            reverse('property_page', kwargs={'uuid': uuid, 'puuid': puuid})
        )

    def test_if_post_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, str(uuid.uuid4()), str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_property_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        post = baker.make(Post)
        response = self.do(authenticated_user, post.uuid, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_if_successes_returns_200(self, anonymous_user: APIClient):
        object = baker.make(Property)

        response = self.do(anonymous_user, object.post.uuid, object.puuid)

        assert response.status_code == status.HTTP_200_OK
