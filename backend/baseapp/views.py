from typing import Dict, Union
from django.db.models import Model
from rest_framework.generics import ListAPIView, CreateAPIView, GenericAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import NotFound


def PageNumberPaginationWithSize(page_size: int) -> type:
    return type(
        'PageNumberPagination{}'.format(page_size),
        (PageNumberPagination,),
        {'page_size': page_size}
    )


class RelatedAPIView(GenericAPIView):
    relateds: Dict[str, Dict[str, Union[str, Model]]]

    def initial(self, request, *args, **kwargs):
        self.related = self.relateds[kwargs['type']]
        return super().initial(request, *args, **kwargs)

    def get_related_object_or_404(self):
        try:
            return self.related['model'].objects.get(**{
                self.related['lookup_field']: self.kwargs[self.related['lookup_field']]
            })
        except:
            raise NotFound()
    
    def get_queryset(self):
        return super().get_queryset().filter(
            **{self.related['related_query_name']: self.get_related_object_or_404()}
        )


class ListRelatedAPIView(RelatedAPIView, ListAPIView):
    ...


class ListCreateRelatedAPIView(RelatedAPIView, ListAPIView, CreateAPIView):
    def perform_create(self, serializer):
        serializer.save(**{
            'user_id': self.request.user.id,
            self.related['related_field']: self.get_related_object_or_404(),
        })
