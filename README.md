# Hapal

Hapal is a social app for film lovers: users create lists of movies, add
titles with custom properties, and follow, like, and comment on other
people's lists.

Monorepo for the Hapal app.

- `frontend/` — Next.js client
- `backend/` — Django API (uv, Python 3.12, Django 5.2)

Each directory contains the full git history of its former standalone repo
(`hapal-app-frontend` and `hapal-app-backend`), merged with
`git filter-repo --to-subdirectory-filter` so every historical commit shows
the files under its subdirectory.

## Getting started

Prerequisites: Node.js (with npm) and [uv](https://docs.astral.sh/uv/)
(`brew install uv`).

    make install      # install dependencies for both apps

Local development requires PostgreSQL (runs on 127.0.0.1:5432). Create a
`.env` file at the repository root (copy `.env.sample` and fill in values):

    cp .env.sample .env   # edit .env with your settings

Then run the two apps in separate terminals:

    make frontend     # Next.js dev server  (http://localhost:3000)
    make backend      # Django dev server   (http://localhost:8000)

Other targets: `make migrate` (Django migrations), `make test` (backend tests).

Production runs the environment-driven `config.settings` module (Postgres via
`DB_*` env variables) behind gunicorn.

## License

[MIT](LICENSE)
