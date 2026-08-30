# Hapal

Hapal is a social app for sharing lists of any kind. Users create lists, add items with custom properties, and follow, like, and comment on other people's lists.

This is the monorepo for the Hapal app.

- `frontend/` — Next.js client
- `backend/` — Django API (uv, Python 3.12, Django 5.2)

Each directory contains the full git history of its former standalone repo (`hapal-app-frontend` and `hapal-app-backend`), merged with `git filter-repo --to-subdirectory-filter` so every historical commit shows the files under its subdirectory.

## Getting started

**Prerequisites:** Node.js (with npm) and [uv](https://docs.astral.sh/uv/) (`brew install uv`).

```bash
make install      # install dependencies for both apps
```

Local development requires PostgreSQL (runs on `127.0.0.1:5432`). Create a `.env` file at the repository root:

```bash
cp .env.sample .env   # then edit .env with your settings
```

Then run the two apps in separate terminals:

```bash
make frontend     # Next.js dev server  (http://localhost:3000)
make backend      # Django dev server   (http://localhost:8000)
```

Other useful targets:

- `make migrate` — run Django migrations
- `make test` — run backend tests

## Production

Production runs the environment-driven `config.settings` module (Postgres via `DB_*` env variables) behind gunicorn.

## License

[MIT](LICENSE)
