"""Local development settings: DEBUG on, zero external setup required.

The base settings (config.settings) are environment-driven and meant for
production. If a .env (or environment) provides DB_* variables, the local
settings use that Postgres database; otherwise they fall back to SQLite so
the project runs with no external setup.
"""
import os
from pathlib import Path

from config.settings import *  # noqa: F401,F403

BACKEND_DIR = Path(__file__).resolve().parents[1]

DEBUG = True

SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-only-insecure-key-change-me')

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

if os.environ.get('DB_NAME'):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DB_NAME'),
            'HOST': os.environ.get('DB_HOST'),
            'PORT': os.environ.get('DB_PORT'),
            'USER': os.environ.get('DB_USER'),
            'PASSWORD': os.environ.get('DB_PASSWORD'),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BACKEND_DIR / 'db.sqlite3',
        }
    }
