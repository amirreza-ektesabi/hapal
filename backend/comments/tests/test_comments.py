from comments.models import Comment
from likes.tests.test_likes import AbstractTestLike, AbstractTestUnlike, AbstractTestRetrieveListOfLikes
import uuid
import pytest
from model_bakery import baker
from rest_framework import status
from rest_framework.test import APIClient


@pytest.mark.django_db
class TestUpdatePost:
    def do(self, user: APIClient, uuid: str, data: dict = {}):
        return user.patch(f'/comment/{uuid}/', data)

    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        object = baker.make(Comment)
        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_user_is_not_owner_of_comment_returns_403(self, authenticated_user: APIClient):
        object = baker.make(Comment)
        response = self.do(authenticated_user, object.uuid)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_comment_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_body_size_exceeded_returns_400(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(Comment, user=user)

        data = {
            'body': 'h' * 1100
        }
        response = self.do(authenticated_user, object.uuid, data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_if_successes_returns_200(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        replied_to = baker.make(Comment)
        object = baker.make(Comment, user=user, replied_to=replied_to)

        data = {
            'body': 'some nice comment about me',
        }
        response = self.do(authenticated_user, object.uuid, data)

        assert response.status_code == status.HTTP_200_OK
        assert Comment.objects.filter(
            uuid=object.uuid,
            user=user,
            **data
        ).exists()
        assert all(response.data[key] == data[key] for key in data.keys())


@pytest.mark.django_db
class TestDestroyComment:
    def do(self, user: APIClient, uuid: str):
        return user.delete(f'/comment/{uuid}/')

    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        object = baker.make(Comment)
        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_user_is_not_owner_of_comment_returns_403(self, authenticated_user: APIClient):
        object = baker.make(Comment)
        response = self.do(authenticated_user, object.uuid)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_comment_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_204(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        replied_to = baker.make(Comment)
        object = baker.make(Comment, user=user, replied_to=replied_to)

        response = self.do(authenticated_user, object.uuid)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Comment.objects.filter(
            uuid=object.uuid,
            user=user,
        ).exists()


@pytest.mark.django_db
class TestRetrievePost:
    def do(self, user: APIClient, uuid: str):
        return user.get(f'/comment/{uuid}/')

    def test_if_comment_doesnt_exist_returns_404(self, anonymous_user: APIClient):
        response = self.do(anonymous_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_200(self, anonymous_user: APIClient):
        replied_to = baker.make(Comment)
        object = baker.make(Comment, replied_to=replied_to)

        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_200_OK


class AbstractTestAddComment:
    replied_to_model = None
    replied_to_model_name = ''

    def do(self, user: APIClient, uuid: str, data: dict = {}):
        return user.post(f'/{self.replied_to_model_name}/{uuid}/comments/', data)

    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        object = baker.make(self.replied_to_model)
        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_replied_to_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_201(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(self.replied_to_model)

        data = {
            'body': 'ommmmm => nice nice nice test',
        }
        response = self.do(authenticated_user, object.uuid, data)

        assert response.status_code == status.HTTP_201_CREATED
        assert Comment.objects.filter(
            uuid=response.data['uuid'],
            user=user,
            **{'replied_to_{}'.format(self.replied_to_model_name): object},
            **data,
        ).exists()
        assert all(response.data[key] == data[key] for key in data.keys())


class AbstractTestRetrieveListOfComments:
    replied_to_model = None
    replied_to_model_name = ''

    def do(self, user: APIClient, uuid: str):
        return user.get(f'/{self.replied_to_model_name}/{uuid}/comments/')

    def test_if_replied_to_doesnt_exist_returns_404(self, anonymous_user: APIClient):
        response = self.do(anonymous_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_200(self, anonymous_user: APIClient):
        object = baker.make(self.replied_to_model)
        comments = baker.make(Comment, replied_to=object, _quantity=10)

        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_200_OK



@pytest.mark.django_db
class TestAddComment(AbstractTestAddComment):
    replied_to_model = Comment
    replied_to_model_name = 'comment'


@pytest.mark.django_db
class TestRetrieveListOfComments(AbstractTestRetrieveListOfComments):
    replied_to_model = Comment
    replied_to_model_name = 'comment'


@pytest.mark.django_db
class TestLike(AbstractTestLike):
    liked_model = Comment
    liked_model_name = 'comment'


@pytest.mark.django_db
class TestUnlike(AbstractTestUnlike):
    liked_model = Comment
    liked_model_name = 'comment'


@pytest.mark.django_db
class TestRetrieveListOfLikes(AbstractTestRetrieveListOfLikes):
    liked_model = Comment
    liked_model_name = 'comment'
