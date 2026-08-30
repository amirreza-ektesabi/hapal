# Hapal

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

Local development uses `config.local_settings`: DEBUG on, SQLite by default.
If you create `backend/.env` (see `backend/.env.sample`) with `DB_*`
variables, it uses your Postgres database instead. Run the two apps in
separate terminals:

    make frontend     # Next.js dev server  (http://localhost:3000)
    make backend      # Django dev server   (http://localhost:8000)

Other targets: `make migrate` (Django migrations), `make test` (backend tests).

Production runs the environment-driven `config.settings` module (Postgres via
`DB_*` env variables) behind gunicorn.
