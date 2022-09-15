from lists.models import List
from posts.models import Post
from comments.tests.test_comments import AbstractTestAddComment, AbstractTestRetrieveListOfComments
from likes.tests.test_likes import AbstractTestLike, AbstractTestUnlike, AbstractTestRetrieveListOfLikes
from follows.tests.test_follows import AbstractTestFollow, AbstractTestUnfollow, AbstractTestRetrieveListOfFollowers
import uuid
import pytest
from model_bakery import baker
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse


@pytest.mark.django_db
class TestCreateList:
    def do(self, user: APIClient, data: dict = {}):
        return user.post(
            reverse('list_create'),
            data
        )

    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        response = self.do(anonymous_user)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_title_size_exceeded_returns_400(self, authenticated_user: APIClient):
        data = {
            'title': 'h' * 300
        }
        response = self.do(authenticated_user, data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_if_description_size_exceeded_returns_400(self, authenticated_user: APIClient):
        data = {
            'description': 'h' * 1000
        }
        response = self.do(authenticated_user, data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_if_successes_returns_201(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user

        data = {
            'title': 'test list title',
            'description': 'long long description test',
        }
        response = self.do(authenticated_user, data)

        assert response.status_code == status.HTTP_201_CREATED
        assert List.objects.filter(
            uuid=response.data['uuid'],
            user=user,
            **data
        ).exists()
        assert all(response.data[key] == data[key] for key in data.keys())


@pytest.mark.django_db
class TestUpdateList:
    def do(self, user: APIClient, uuid: str, data: dict = {}):
        return user.patch(
            reverse('list_page', kwargs={'uuid': uuid}),
            data
        )

    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        object = baker.make(List)
        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_user_is_not_owner_of_list_returns_403(self, authenticated_user: APIClient):
        object = baker.make(List)
        response = self.do(authenticated_user, object.uuid)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_list_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_title_size_exceeded_returns_400(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(List, user=user)

        data = {
            'title': 'h' * 300
        }
        response = self.do(authenticated_user, object.uuid, data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_if_description_size_exceeded_returns_400(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(List, user=user)

        data = {
            'description': 'h' * 1000
        }
        response = self.do(authenticated_user, object.uuid, data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_if_successes_returns_200(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(List, user=user)

        data = {
            'title': 'test list title',
            'description': 'long long description test',
        }
        response = self.do(authenticated_user, object.uuid, data)

        assert response.status_code == status.HTTP_200_OK
        assert List.objects.filter(
            uuid=object.uuid,
            user=user,
            **data
        ).exists()
        assert all(response.data[key] == data[key] for key in data.keys())


@pytest.mark.django_db
class TestDestroyList:
    def do(self, user: APIClient, uuid: str):
        return user.delete(
            reverse('list_page', kwargs={'uuid': uuid})
        )

    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        object = baker.make(List)
        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_user_is_not_owner_of_list_returns_403(self, authenticated_user: APIClient):
        object = baker.make(List)
        response = self.do(authenticated_user, object.uuid)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_list_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_204(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(List, user=user)

        response = self.do(authenticated_user, object.uuid)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not List.objects.filter(
            uuid=object.uuid,
            user=user,
        ).exists()


@pytest.mark.django_db
class TestRetrieveList:
    def do(self, user: APIClient, uuid: str):
        return user.get(
            reverse('list_page', kwargs={'uuid': uuid})
        )

    def test_if_list_doesnt_exist_returns_404(self, anonymous_user: APIClient):
        response = self.do(anonymous_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_200(self, anonymous_user: APIClient):
        object = baker.make(List)

        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestAddPost:
    def do(self, user: APIClient, uuid: str, data: dict = {}):
        return user.post(
            reverse('list_posts', kwargs={'uuid': uuid}),
            data
        )

    def test_if_user_is_not_authenticated_returns_401(self, anonymous_user: APIClient):
        object = baker.make(List)
        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_if_user_is_not_owner_of_list_returns_403(self, authenticated_user: APIClient):
        object = baker.make(List)
        response = self.do(authenticated_user, object.uuid)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_if_list_doesnt_exist_returns_404(self, authenticated_user: APIClient):
        response = self.do(authenticated_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_201(self, authenticated_user: APIClient):
        user = authenticated_user.handler._force_user
        object = baker.make(List, user=user)

        data = {
            'title': 'test post title',
        }
        response = self.do(authenticated_user, object.uuid, data)

        assert response.status_code == status.HTTP_201_CREATED
        assert Post.objects.filter(
            uuid=response.data['uuid'],
            added_to=object,
            user=user,
            **data
        ).exists()
        assert all(response.data[key] == data[key] for key in data.keys())


@pytest.mark.django_db
class TestRetrieveListOfPosts:
    def do(self, user: APIClient, uuid: str):
        return user.get(
            reverse('list_posts', kwargs={'uuid': uuid})
        )

    def test_if_list_doesnt_exist_returns_404(self, anonymous_user: APIClient):
        response = self.do(anonymous_user, str(uuid.uuid4()))

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_if_successes_returns_200(self, anonymous_user: APIClient):
        object = baker.make(List)
        posts = baker.make(Post, added_to=object, user=object.user, _quantity=10)

        response = self.do(anonymous_user, object.uuid)

        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestAddComment(AbstractTestAddComment):
    replied_to_model = List
    replied_to_model_name = 'list'


@pytest.mark.django_db
class TestRetrieveListOfComments(AbstractTestRetrieveListOfComments):
    replied_to_model = List
    replied_to_model_name = 'list'


@pytest.mark.django_db
class TestLike(AbstractTestLike):
    liked_model = List
    liked_model_name = 'list'


@pytest.mark.django_db
class TestUnlike(AbstractTestUnlike):
    liked_model = List
    liked_model_name = 'list'


@pytest.mark.django_db
class TestRetrieveListOfLikes(AbstractTestRetrieveListOfLikes):
    liked_model = List
    liked_model_name = 'list'

@pytest.mark.django_db
class TestFollow(AbstractTestFollow):
    followed_model = List
    followed_model_name = 'list'


@pytest.mark.django_db
class TestUnfollow(AbstractTestUnfollow):
    followed_model = List
    followed_model_name = 'list'


@pytest.mark.django_db
class TestRetrieveListOfFollowers(AbstractTestRetrieveListOfFollowers):
    followed_model = List
    followed_model_name = 'list'
