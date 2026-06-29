
# Ridgemont Fire & Rescue — Full Project Breakdown

## 1. Technology Stack (what's actually used)

**Frontend / Framework**
- **React 19** — UI library
- **TanStack Start v1** — full-stack React framework (SSR + routing + server functions). Think "Next.js alternative, built on TanStack Router."
- **TanStack Router** — file-based routing (`src/routes/`)
- **TanStack Query** — data fetching + caching
- **Vite 7** — build tool / dev server
- **TypeScript** — typed JavaScript

**Styling / UI**
- **Tailwind CSS v4** — utility CSS (configured in `src/styles.css`)
- **shadcn/ui** — pre-built accessible components (in `src/components/ui/`)
- **Lucide React** — icons
- **Sonner** — toast notifications

**Forms & Validation**
- **React Hook Form** + **Zod** — form state + schema validation

**Backend (Lovable Cloud = managed Supabase)**
- **PostgreSQL** database
- **Supabase Auth** — email/password sign-in
- **Row-Level Security (RLS)** — per-row access policies
- **Server Functions** (`createServerFn`) — backend logic called from React

**Deployment target:** Cloudflare Workers (edge).

---

## 2. How the Project Works (file map)

```
src/
├── routes/                      ← every URL = one file
│   ├── __root.tsx               ← global layout (header/footer, fonts, SEO)
│   ├── index.tsx                ← Homepage (/)
│   ├── about.tsx                ← /about
│   ├── services.tsx             ← /services
│   ├── recruitment.tsx          ← /recruitment
│   ├── contact.tsx              ← /contact
│   ├── auth.tsx                 ← /auth (login/signup)
│   ├── sitemap[.]xml.ts         ← /sitemap.xml
│   └── _authenticated/          ← gated routes (must be logged in)
│       ├── route.tsx            ← auth gate
│       └── admin.tsx            ← /admin dashboard
│
├── components/
│   ├── site/                    ← your custom pieces
│   │   ├── SiteHeader.tsx       ← top nav
│   │   ├── SiteFooter.tsx       ← bottom
│   │   └── RunStatsBanner.tsx   ← animated stat counters
│   └── ui/                      ← shadcn components (button, card, form…)
│
├── integrations/supabase/       ← auto-generated DB client
├── assets/                      ← hero images
├── styles.css                   ← Tailwind + design tokens (colors/fonts)
└── router.tsx                   ← router setup

supabase/migrations/             ← SQL files that built the database
public/robots.txt                ← SEO crawler rules
.env                             ← backend connection keys
```

**Data flow example (Run Stats):**
1. Admin logs in at `/auth` → goes to `/admin` → edits the 5 stat fields
2. Form submits → updates `run_stats` table in the database
3. Homepage `RunStatsBanner` reads that row via TanStack Query → animates the numbers

**Database tables:** `user_roles`, `run_stats`, `news_posts`, `contact_submissions`, `recruitment_applications` — all protected by RLS so only admins can write.

---

## 3. Running Locally in VS Code

**You do NOT create a new React project.** You download THIS project as-is.

**Steps:**
1. In Lovable: click the GitHub button → connect → push the repo to GitHub.
2. On your computer, in a terminal:

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

3. Install **Bun** (this project uses it, faster than npm): https://bun.sh
   Or use npm — both work.

4. Install dependencies:

```bash
bun install
# or:  npm install
```

5. Create a `.env` file in the project root (copy the values from Lovable's `.env` shown in your project). It needs:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_PROJECT_ID=...
```

6. Run the dev server:

```bash
bun dev
# or:  npm run dev
```

Opens at `http://localhost:8080`.

**Project naming suggestion:** `ridgemont-fire-rescue` (or whatever your real department name becomes, kebab-case, e.g. `springfield-fd-website`).

**VS Code extensions worth installing:**
- ESLint
- Tailwind CSS IntelliSense
- Prettier

---

## 4. Switching Backend / Database (free alternatives)

Right now: **Lovable Cloud = Supabase under the hood** (Postgres + Auth + Storage). If you ever want to move:

**Option A — Self-hosted Supabase (still free)**
- Sign up at supabase.com directly → create a new project (free tier: 500 MB DB, 50K monthly users).
- Run the SQL files in `supabase/migrations/` against the new project.
- Replace the keys in `.env`.
- **Zero code changes needed** — same client library.

**Option B — Firebase (Google)**
- Free tier: Firestore (NoSQL) + Auth + Storage.
- Trade-off: NoSQL, no SQL queries, no RLS (uses security rules instead).
- Requires rewriting `src/integrations/supabase/*` and every `.from("table")` call.

**Option C — Neon / Turso / PlanetScale (database only)**
- Neon = serverless Postgres, generous free tier.
- You'd still need a separate auth solution (Clerk free tier, Auth.js, Lucia).
- More moving parts but very flexible.

**Option D — Pocketbase (single-file backend)**
- Free, open source, self-hosted on any cheap VPS ($5/mo Hetzner).
- Built-in auth + DB + file storage + admin UI.
- Good if you want to fully own your data.

**My recommendation by use case:**
- **Stay on Lovable Cloud** → easiest, free tier covers a fire dept site comfortably.
- **Want ownership but no maintenance** → migrate to direct Supabase (Option A).
- **Want fully self-hosted** → Pocketbase on a $5 VPS.

---

## 5. Quick Cheat Sheet of Useful Commands

```bash
bun dev              # start local dev server
bun run build        # production build
bun run typecheck    # check TypeScript errors
bun add <package>    # install a new dependency
bun remove <package> # remove one
```

---

This is a documentation/explanation request — no code changes needed. Approve to acknowledge, or tell me which section to expand (e.g. "show me migration SQL for moving to Firebase", "explain server functions deeper", "walk through deploying to Cloudflare myself").
