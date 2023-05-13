from secrets import token_urlsafe


def uuid_generator():
    return token_urlsafe(8)
