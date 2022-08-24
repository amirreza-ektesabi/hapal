from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.generics import ListCreateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import NotFound
from django.shortcuts import get_object_or_404


def PageNumberPaginationWithSize(page_size: int) -> type:
    return type(
        'PageNumberPagination{}'.format(page_size),
        (PageNumberPagination,),
        {'page_size': page_size}
    )


class SharedObjectPageAction(ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    shared_object_models_switch = None
    
    def get_shared_object(self):
        lookup_field = self.kwargs['lookup_field']
        value = self.kwargs[lookup_field]
        shared_object_type = self.kwargs['shared_object_type']
        shared_object_model = self.shared_object_models_switch[shared_object_type]
        return get_object_or_404(shared_object_model, **{lookup_field: value})

    def get_filter_field_name_condition(self):
        raise NotImplementedError(
            '{cls}.get_filter_field_name_condition() must be implemented.'.format(
                cls=self.__class__.__name__,
            )
        )

    def get_filter_field_name(self):
        shared_object_type = self.kwargs['shared_object_type']
        return 'user' if self.get_filter_field_name_condition() else \
               '{}_{}'.format(self.object_name, shared_object_type)

    def check_shared_object_exists(self):
        lookup_field = self.kwargs['lookup_field']
        value = self.kwargs[lookup_field]
        shared_object_type = self.kwargs['shared_object_type']
        shared_object_model = self.shared_object_models_switch[shared_object_type]
        if not shared_object_model.objects.filter(**{lookup_field: value}).exists():
            raise NotFound()

    def initial(self, request, *args, **kwargs):
        self.check_shared_object_exists()
        return super().initial(request, *args, **kwargs)

    def get_queryset(self):
        return super().get_queryset().filter(
            **{self.get_filter_field_name(): self.get_shared_object()}
        ).order_by('-created')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update(dict(
            user_id=self.request.user.id,
            lookup_field=self.kwargs['lookup_field'],
            lookup_field_value=self.kwargs[self.kwargs['lookup_field']],
            shared_object_type=self.kwargs['shared_object_type'],
        ))
        return context
