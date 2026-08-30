# Hapal

Monorepo for the Hapal app.

- `frontend/` — Next.js client
- `backend/` — Django API

Each directory contains the full git history of its former standalone repo
(`hapal-app-frontend` and `hapal-app-backend`), merged with
`git filter-repo --to-subdirectory-filter` so every historical commit shows
the files under its subdirectory.
