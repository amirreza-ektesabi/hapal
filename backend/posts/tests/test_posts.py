from posts.models import Post, Property, Pair, PROPERTY_TYPES
from comments.tests.test_comments import AbstractTestAddComment, AbstractTestRetrieveListOfComments
from likes.tests.test_likes import AbstractTestLike, AbstractTestUnlike, AbstractTestRetrieveListOfLikes

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.response import Response

import uuid
import pytest
from model_bakery import baker


@pytest.mark.django_db
class TestUpdatePost:
    def do(self, user: APIClient, uuid: str, data: dict = {}) -> Response:
        return user.patch(
            reverse('post_page', kwargs={'uuid': uuid}),
            data, format='json'
        )

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
        def check_pair(pair_data, value_model, fields_switch):
            pair_queryset = Pair.objects.filter(
                key=pair_data['key']
            )
            assert pair_queryset.exists()
            pair = pair_queryset.get()
            value_data = {
                model_field: pair_data[serializer_field]
                for serializer_field, model_field in fields_switch.items()
            }
            value_model.objects.filter(
                **value_data,
                pair=pair
            ).exists()

        def check_property(property_data):
            property_queryset = Property.objects.filter(
                key=property_data['key'],
                post__uuid=response.data['uuid']
            )
            assert property_queryset.exists()
            property = property_queryset.get()

            value_model, fields_switch = PROPERTY_TYPES[property.type]
            for pair_data in property_data['pairs']:
                check_pair(pair_data, value_model, fields_switch)
        
        user = authenticated_user.handler._force_user
        object = baker.make(Post, user=user)
        properties = baker.make(Property, post=object)

        data = {
            'title': 'test post title',
            'properties': [
                {
                    'key': 'property 1',
                    'pairs': [
                        {'key': 'pair 1', 'value': 'value 1'},
                        {'key': 'pair 2', 'value': 'value 2'},
                        {'key': 'pair 3', 'value': 'value 3'}
                    ]
                },
                {
                    'key': 'property 2',
                    'pairs': [
                        {'key': 'pair 4', 'value': 'value 4'},
                        {'key': 'pair 5', 'value': 'value 5'},
                        {'key': 'pair 6', 'value': 'value 6'}
                    ]
                }
            ]
        }
        response = self.do(authenticated_user, object.uuid, data)

        assert response.status_code == status.HTTP_200_OK
        assert Post.objects.filter(
            uuid=object.uuid,
            user=user,
        ).exists()
        for property_data in data['properties']:
            check_property(property_data)


@pytest.mark.django_db
class TestDestroyPost:
    def do(self, user: APIClient, uuid: str) -> Response:
        return user.delete(
            reverse('post_page', kwargs={'uuid': uuid})
        )

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
    def do(self, user: APIClient, uuid: str) -> Response:
        return user.get(
            reverse('post_page', kwargs={'uuid': uuid})
        )

    def test_if_post_doesnt_exist_returns_404(self, anonymous_user: APIClient):
        response = self.do(anonymous_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_200(self, anonymous_user: APIClient):
        object = baker.make(Post)

        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestRetrieveListOfProperties:
    def do(self, user: APIClient, uuid: str) -> Response:
        return user.get(
            reverse('post_properties', kwargs={'uuid': uuid})
        )

    def test_if_post_doesnt_exist_returns_404(self, anonymous_user: APIClient):
        response = self.do(anonymous_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_201(self, anonymous_user: APIClient):
        object = baker.make(Post)
        properties = baker.make(Property, post=object, _quantity=10)

        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestAddComment(AbstractTestAddComment):
    replied_to_model = Post
    replied_to_model_name = 'post'


@pytest.mark.django_db
class TestRetrieveListOfComments(AbstractTestRetrieveListOfComments):
    replied_to_model = Post
    replied_to_model_name = 'post'


@pytest.mark.django_db
class TestLike(AbstractTestLike):
    liked_model = Post
    liked_model_name = 'post'


@pytest.mark.django_db
class TestUnlike(AbstractTestUnlike):
    liked_model = Post
    liked_model_name = 'post'


@pytest.mark.django_db
class TestRetrieveListOfLikes(AbstractTestRetrieveListOfLikes):
    liked_model = Post
    liked_model_name = 'post'
