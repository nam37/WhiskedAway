# Whisked Away Bakery v1

Server-rendered bakery site built with Node.js, Hono, and htmx. Includes inquiry-based cart, recipe CMS, and admin tooling.

## Requirements

- Node.js 18+
- Postgres (Neon recommended) or JSON-based recipes for local start

## Local setup

1. Install dependencies

```
npm install
```

2. Configure environment variables

```
cp .env.example .env
```

3. (Optional) Apply migrations to your Postgres database

```
psql $DATABASE_URL -f migrations/001_favorite_recipes.sql
psql $DATABASE_URL -f migrations/002_inquiries.sql
```

4. Run the server

```
npm run dev
```

Visit `http://localhost:3000`.

## Scripts

- `npm run dev` - start the local server with file watching
- `npm start` - start the server for production

## Notes

- Product data is stored in `src/data/products.json` and loaded via a repository layer to ease migration to Postgres later.
- Recipes will use `src/data/recipes.json` when `DATABASE_URL` is not configured.
- Recipe images can be uploaded locally and will be saved under `public/uploads/`.
- Admin routes are protected with HTTP Basic Auth (`ADMIN_USER` / `ADMIN_PASS`).

## Deploy to Cloud Run

- Ensure required environment variables are set in your Cloud Run service.
- Buildpacks will detect the Node.js runtime from `package.json`.
- Set the service to listen on `PORT` (default 3000).
