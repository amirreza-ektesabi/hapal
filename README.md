# Hapal

Monorepo for the Hapal app.

- `frontend/` — Next.js client
- `backend/` — Django API

Each directory contains the full git history of its former standalone repo
(`hapal-app-frontend` and `hapal-app-backend`), merged with
`git filter-repo --to-subdirectory-filter` so every historical commit shows
the files under its subdirectory.

## Getting started

Prerequisites: Node.js (with npm) and [Pipenv](https://pipenv.pypa.io/).

    make install      # install dependencies for both apps
    cp backend/.env.sample backend/.env   # then fill in the values

Run the two apps in separate terminals:

    make frontend     # Next.js dev server  (http://localhost:3000)
    make backend      # Django dev server   (http://localhost:8000)

Other targets: `make migrate` (Django migrations), `make test` (backend tests).
