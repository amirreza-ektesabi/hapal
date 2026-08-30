.PHONY: install frontend backend migrate test

install:
	cd frontend && npm install
	cd backend && uv sync

frontend:
	cd frontend && npm run dev

backend:
	cd backend && uv run python manage.py runserver

migrate:
	cd backend && uv run python manage.py migrate

test:
	cd backend && uv run pytest
