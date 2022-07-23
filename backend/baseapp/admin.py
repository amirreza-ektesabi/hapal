from django import forms
from django.db.models import QuerySet, Count, Q
from django.contrib.contenttypes.models import ContentType
from django.contrib import admin, messages
from django.http import HttpRequest, HttpResponseRedirect
from django.utils.safestring import SafeString
from django.urls import reverse
from django.utils.html import format_html, urlencode
from django.utils.translation import ngettext, gettext_lazy as _
from django.contrib.admin.utils import model_ngettext

from dal import autocomplete

from uuid import UUID
from typing import Tuple, Any, Union

from baseapp.models import SharedBaseModel
from accounts.models import Account


def link_to_listpage(text_to_show: Any, app_model_label: str, **kwargs) -> SafeString:
    href = (
        reverse('admin:{}_changelist'.format(app_model_label))
        + '?' + urlencode(kwargs)
    )
    return format_html('<a href="{}">{}</a>', href, str(text_to_show))


def link_to_objectpage(text_to_show: Any, app_model_label: str, *args) -> SafeString:
    href = reverse('admin:{}_change'.format(app_model_label), args=args)
    return format_html('<a href="{}">{}</a>', href, str(text_to_show))


def string_to_UUID(as_string: str) -> Union[UUID, None]:
    try:
        return UUID(as_string.strip())
    except ValueError:
        return None


class CreateSharedBaseForm(forms.ModelForm):
    new_user = forms.ModelChoiceField(
        queryset=Account.objects.filter(deleted=False),
        required=True,
        label='User',
        widget=autocomplete.ModelSelect2(url='account-autocomplete'),
    )

    def clean_new_user(self):
        return self.cleaned_data['new_user']

    def save(self, commit: bool=True):
        if self.instance.pk:
            raise NotImplementedError(
                'Editing of existing Item is not allowed!')

        self.instance.user = self.cleaned_data['new_user']
        return super().save(commit)

    class Meta:
        model = SharedBaseModel
        fields = ['new_user']
        exclude = ['user']


class SharedBaseAdmin(admin.ModelAdmin):
    create_form = CreateSharedBaseForm

    readonly_fields = [
        'user',
        'uuid',
    ]
    actions = [
        'delete_selected'
    ]
    list_select_related = [
        'user'
    ]
    list_filter = [
        'updated',
        'access_level'
    ]
    list_per_page = 25

    def __init__(self, model, admin_site):
        super().__init__(model, admin_site)
        self.opts = self.model._meta

    def add_view(self, request: HttpRequest, form_url='', extra_context=None):
        self.fields[0] = ['new_user']
        return super().add_view(request, form_url, extra_context)

    def change_view(self, request: HttpRequest, object_id: int, form_url='', extra_context=None):
        self.fields[0] = ['user']
        return super().change_view(request, object_id, form_url, extra_context)

    def get_form(self, request: HttpRequest, obj=None, **kwargs):
        orig_self_form = self.form
        if not obj:
            self.form = self.create_form
        result = super().get_form(request, obj=obj, **kwargs)
        self.form = orig_self_form
        return result

    def delete_view(self, request: HttpRequest, object_id: int, extra_context=None):
        queryset = self.model.objects.filter(pk=object_id)
        obj_display = queryset.first()
        queryset.update(deleted=True)

        self.message_user(
            request,
            _("The %(name)s “%(obj)s” was deleted successfully.") % {
                'name': self.opts.verbose_name,
                'obj': obj_display,
            },
            messages.SUCCESS,
        )
        return HttpResponseRedirect(reverse('admin:{}_{}_changelist'.format(self.opts.app_label, self.opts.model_name)))

    @admin.action(description='Delete selected items')
    def delete_selected(self, request: HttpRequest, queryset: QuerySet):
        deleted_count = queryset.update(deleted=True)

        msg = ngettext(
            '%(count)s %(name)s was deleted successfully.',
            '%(count)s %(name)s were deleted successfully.',
            deleted_count,
        ) % {
            'count': deleted_count,
            'name': model_ngettext(self.opts, deleted_count),
        }
        self.message_user(request, msg, messages.SUCCESS)

    def get_search_results(self, request: HttpRequest, queryset: QuerySet, search_term: str) -> Tuple[QuerySet, bool]:
        queryset, may_have_duplicates = super().get_search_results(
            request, queryset, search_term)

        search_term_as_uuid = string_to_UUID(search_term)
        if search_term_as_uuid is not None:
            queryset |= self.model.objects.filter(
                uuid__exact=search_term_as_uuid
            )

        return queryset, may_have_duplicates

    @admin.display(ordering='user__username', description='owner')
    def owner(self, object: SharedBaseModel):
        opts = object.user._meta
        return link_to_objectpage(
            str(object.user),
            '{}_{}'.format(opts.app_label, opts.model_name),
            object.user.id,
        )

    @admin.display(ordering='comments_count', description='comments')
    def comments_count(self, object: SharedBaseModel):
        return link_to_listpage(
            object.comments_count,
            'comments_comment',
            replied_to_id=object.id,
            replied_to_type=ContentType.objects.get_for_model(
                self.model).id,
            deleted=False,
        )

    @admin.display(ordering='likes_count', description='likes')
    def likes_count(self, object: SharedBaseModel):
        return link_to_listpage(
            object.likes_count,
            'likes_like',
            liked_id=object.id,
            liked_type=ContentType.objects.get_for_model(
                self.model).id,
        )

    def get_queryset(self, request: HttpRequest) -> QuerySet:
        return super().get_queryset(request).filter(deleted=False, user__deleted=False).annotate(
            comments_count=Count('comments', distinct=True,
                                 filter=Q(comments__deleted=False,
                                          comments__user__deleted=False),
                                 ),
            likes_count=Count('likes', distinct=True,
                              filter=Q(likes__user__deleted=False),
                              )
        )
