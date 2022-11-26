from django.db.models import QuerySet, Model
from rest_framework.generics import ListAPIView, CreateAPIView, GenericAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.serializers import ModelSerializer
from rest_framework.exceptions import NotFound
from rest_framework.request import Request
from rest_framework.views import APIView

from typing import Dict, Union, NoReturn


def PageNumberPaginationWithSize(page_size: int) -> type:
    return type(
        'PageNumberPagination{}'.format(page_size),
        (PageNumberPagination,),
        {'page_size': page_size}
    )


class RelatedAPIView(GenericAPIView):
    relateds: Dict[str, Dict[str, Union[str, Model]]]

    def initial(self, request: Request, *args, **kwargs) -> None:
        self.related = self.relateds[kwargs['type']]
        return super().initial(request, *args, **kwargs)

    def get_related_object_or_404(self) -> Union[Model, NoReturn]:
        try:
            return self.related['model'].objects.get(**{
                self.related['lookup_field']: self.kwargs[self.related['lookup_field']]
            })
        except:
            raise NotFound()

    def get_queryset(self) -> QuerySet:
        return super().get_queryset().filter(
            **{self.related['related_query_name']: self.get_related_object_or_404()}
        )


class ListRelatedAPIView(RelatedAPIView, ListAPIView):
    ...


class ListCreateRelatedAPIView(RelatedAPIView, ListAPIView, CreateAPIView):
    def perform_create(self, serializer: ModelSerializer) -> None:
        serializer.save(**{
            'user_id': self.request.user.id,
            self.related['related_field']: self.get_related_object_or_404(),
        })


class CheckObjectLikedByCurrentUserMixin:
    def get_queryset(self: APIView):
        return super().get_queryset() \
            .annotate_is_liked_by_current_user(user=self.request.user)
