# Quan Travel — Admin Platform (Phase 1 + 2)

Next.js app that will eventually host the `/admin` panel described in the technical
spec, deployed as a single Railway service alongside (eventually replacing) the
static marketing site at the repo root. **This phase does not touch the existing
`index.html` site** — it lives entirely in this `webapp/` folder so the live site
keeps working untouched while the admin platform is built out.

## Production (Railway)

- Project: **quan-travel-admin** (Railway workspace `minaikhansaltanat-prog's Projects`)
- Services: `web` (this app), `Postgres`, and a `media` object storage bucket (Railway's
  own S3-compatible buckets, region `sin` — used instead of Cloudflare R2 so
  everything stays on one platform/bill; swap later if you'd rather use R2)
- URL: https://web-production-4c0eb.up.railway.app (no custom domain attached yet)
- Deploy method: **CLI-only** (`railway up`), not GitHub auto-deploy. The repo's
  `Video/`/`Photo/` folders make the full git repo ~900MB, which made Railway's
  GitHub-snapshot-based build step slow/flaky. To redeploy after a change:
  ```bash
  cd webapp
  railway up --service web --project 300ba903-e416-4fa6-8a0d-85007c094bd2 --environment production
  ```
  Re-connecting GitHub auto-deploy (`railway service source connect --repo ...`) is
  possible later if you'd rather push-to-deploy — worth revisiting once the repo's
  media files are trimmed down or moved out of git history.
- Migrations run automatically on every deploy via a pre-deploy command
  (`npx prisma migrate deploy`).
- The bucket has CORS enabled (`PUT`/`POST`/`GET` from `localhost:3000-3002` and the
  production domain) so the browser can upload video files directly — see
  "Media / Phase 2" below. Re-run `PutBucketCorsCommand` if the production domain
  changes (e.g. after attaching a custom domain).

## Media / Phase 2

Railway Buckets are **private** — there's no public bucket URL (unlike S3 or R2 with
a public bucket policy). Two consequences that shaped this implementation:

- **Uploads**: photos go through our server (`POST /api/admin/media/photos`), which
  converts them to WebP with `sharp` before storing — fits easily under Railway's
  request size limits at ≤20MB. Videos (≤200MB) skip the server entirely: the client
  gets a presigned `PUT` URL (`requestVideoUploadUrl` server action) and uploads
  straight to the bucket, which is why CORS had to be configured.
- **Serving**: every public-facing media URL is `/api/media/<key>`, a route handler
  that streams the object from the bucket with a one-year `Cache-Control` header
  (`src/app/api/media/[...key]/route.ts`). There's no CDN in front of it yet — if
  gallery traffic grows, put Cloudflare (or similar) in front of the Railway domain,
  or reconsider Cloudflare R2 (which does support public buckets + its own CDN).

The Gallery admin page (`/admin/gallery`) is a working general media library — upload,
list, delete — not yet tied to individual tours (`GalleryItem.tourId` is nullable
until the Tours module exists in Phase 3).

The full Phase 2 content schema (Tour, GalleryItem, Review, HomepageBlock, FaqItem,
GroupTourDeparture, BlogPost, Lead) is in `prisma/schema.prisma` now, even though most
of it doesn't have admin UI yet — Phase 3/4 build screens against a schema that's
already settled instead of changing models mid-build.

## What Phase 1 delivers

- Next.js 16 (App Router, TypeScript, Tailwind v4) project scaffold.
- `/admin` route architecture: a public `/admin/login` and an authenticated
  `(dashboard)` route group with one page per module from the spec's rights
  matrix (turns into real CRUD in later phases — right now most are placeholders
  that state which phase will implement them).
- Role-based auth: NextAuth v5 (credentials, JWT sessions) backed by a Prisma
  `User` model with `OWNER` / `ADMIN` roles.
- `src/lib/rbac.ts` encodes the section-2 rights matrix (Owner: everything;
  Admin: everything except Users & Roles and Settings). The sidebar nav and
  every page re-check access server-side via `requireModuleAccess()`.
- `src/proxy.ts` (Next 16 renamed `middleware.ts` to `proxy.ts`) does a coarse
  redirect of unauthenticated `/admin/*` requests to the login page; every page
  still re-verifies via `auth()`/`requireSession()` since Proxy alone isn't
  meant to be the only authorization check (see Next's own proxy docs).
- `AuditLog` model + a working example of it: creating/blocking/deleting an
  Admin from **Пайдаланушылар мен рөлдер** writes an audit entry, and
  **Әрекеттер журналы** reads it back (Owner sees everyone's actions, Admin
  sees only their own — per spec).
- Brand styling reused from the public site's Tailwind tokens (`bred`, `bgold`,
  `bgreen`, `paper`, `ink`, `muted`, `line` — see `index.html`) plus the same
  `PT Serif` / `Golos Text` font pairing, so the admin panel looks like it
  belongs to the same product.

## Stack notes (things that differ from older docs/training data)

- **Next.js 16**: `middleware.ts` is deprecated in favor of `proxy.ts` (same
  behavior, renamed file/export). It now defaults to the Node.js runtime.
- **Prisma 7**: the `prisma-client` generator outputs a local client into
  `src/generated/prisma` (gitignored, regenerate with `npx prisma generate`,
  wired into `postinstall`). It also **requires an explicit driver adapter** —
  no more implicit `DATABASE_URL` connection. See `src/lib/prisma.ts`
  (`@prisma/adapter-pg` + `pg`).
- **Prisma config** lives in `prisma.config.ts` (not just `schema.prisma`).
- **NextAuth v5** (`next-auth@beta`) is required for Next 16 / React 19
  compatibility.

## Local setup

```bash
cd webapp
npm install                 # also runs `prisma generate`
cp .env.example .env
# Fill in DATABASE_URL (see below), AUTH_SECRET, OWNER_EMAIL/PASSWORD

npx prisma migrate dev      # creates tables
npm run db:seed             # creates the first Owner account from .env
npm run dev                 # http://localhost:3000 (or next free port)
```

For a throwaway local Postgres instead of a real one:

```bash
npx prisma dev              # prints a local DATABASE_URL, keep it running
```

Generate a real `AUTH_SECRET` with `npx auth secret`.

## What's deliberately not done yet

- No real Postgres/R2/S3 provisioned on Railway — Phase 2 per the spec.
- Tours/gallery/reviews/homepage/calendar/blog/leads/analytics are placeholder
  pages that explain what's coming, not working CRUD yet — Phase 3/4.
- The public marketing site (`index.html` at the repo root) has not been
  migrated into this Next.js app. Decide when that migration happens before
  starting Phase 3, since the spec wants `/admin` and the public site on one
  Next.js app / one Railway service.
- `npm audit` flags a stack-exhaustion advisory in `@prisma/config`'s
  `deepmerge-ts` dependency (dev-time CLI tooling only, not shipped to
  production runtime) — low practical risk, tracked for a future `prisma`
  minor bump rather than a forced downgrade.
