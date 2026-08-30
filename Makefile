.PHONY: install frontend backend migrate test

install:
	cd frontend && npm install
	cd backend && pipenv install

frontend:
	cd frontend && npm run dev

backend:
	cd backend && pipenv run python manage.py runserver

migrate:
	cd backend && pipenv run python manage.py migrate

test:
	cd backend && pipenv run pytest
