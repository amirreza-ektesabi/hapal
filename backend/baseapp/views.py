from rest_framework.pagination import PageNumberPagination


def PageNumberPaginationWithSize(page_size: int) -> type:
    return type(
        'PageNumberPagination{}'.format(page_size),
        (PageNumberPagination,),
        {'page_size': page_size}
    )
