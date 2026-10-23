# Local test backend

Runs the website and `/admin` against a throw-away local database, so changes can be tried without a live Supabase project. Nothing is e-mailed (no Resend key is set) and every restart starts from a clean database.

What it runs:

- **Postgres**: PGlite (Postgres 17 in WebAssembly) with every file in `supabase/migrations`.
- **REST API**: the real PostgREST executable, so row level security is enforced exactly as in Supabase.
- **Auth and Storage**: small stubs that sign tokens for the seeded users and check the storage policies.

## Start

1. Download PostgREST for your system from https://github.com/PostgREST/postgrest/releases.
2. In this folder:

   ```bash
   npm install
   POSTGREST_BIN=/path/to/postgrest node server.mjs
   ```

   This writes `.env.localtest` in the repository root (ignored by git).
3. In the repository root:

   ```bash
   npm run dev -- --mode localtest
   ```

Log in at `/admin` with `dennis@example.test` / `lokaal-testen-123` (local only). `bezoeker@example.test` with the same password is a logged-in user without admin rights, to check that the database refuses changes.

The `/api/*` functions run inside the Vite dev server (see `vite.config.ts`) and use the local service-role key, so quote requests are stored and appear under **Aanvragen**.
