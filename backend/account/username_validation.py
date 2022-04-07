from abc import ABC, abstractmethod

from django.utils.deconstruct import deconstructible
from django.utils.translation import gettext_lazy as _

from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator, RegexValidator


@deconstructible
class MyBaseValidator(ABC):
    message = _('Ensure this value is right.')
    code = 'base_validator_error'
    
    def __init__(self, message=None, code=None):
        if message is not None:
            self.message = message
        if code is not None:
            self.code = code

    def __call__(self, value):
        if self.check(value):
            raise ValidationError(self.message, code=self.code)

    def __eq__(self, other):
        if not isinstance(other, self.__class__):
            return NotImplemented
        return (
            self.message == other.message and
            self.code == other.code
        )

    @abstractmethod
    def check(self, value):
        pass


class RestrictedWordsValidator(MyBaseValidator):
    username_restricted_words = {'admin', 'deleted'}
    
    def check(self, value):
        return any(word==value for word in username_restricted_words)


username_validators = (
    MinLengthValidator(5,
                       _('The username must contain at least %(limit_value)d characters.')),
    RegexValidator(r'^[a-zA-Z0-9\_]*$',
                   _('The username must contain only letters, numbers and underscore.'),
                   'invalid_character'),
    RegexValidator(r'^[a-zA-Z].*$',
                   _('The username can only start with a letter.'),
                   'invalid_start_character'),
    RestrictedWordsValidator(_('The username contains restricted word.'),
                             'restricted_word')
)

def validate_username(username):
    errors = []
    for validator in username_validators:
        try:
            validator(username)
        except ValidationError as error:
            errors.append(error)
    if errors:
        raise ValidationError(errors)