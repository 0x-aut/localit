# Localit

Visual regression testing for i18n. Localit crawls every route of your translated app, compares screenshots against your baseline locale, and uses AI to tell you exactly what broke and why.

Live: [localit-eight.vercel.app](https://localit-eight.vercel.app) — Source: [github.com/0x-aut/localit](https://github.com/0x-aut/localit)

---

## What it does

When you translate a web app, things break in ways that linters and unit tests will never catch — text overflows its container, a missing key renders a raw string, a layout collapses under a longer word. Localit catches all of that.

Connect your app, configure your locales, and Localit will:

- Visit every route in your app for both the baseline and translated locale
- Take a screenshot of each route and run a pixel-level diff
- Scan for missing translation keys
- Generate an AI analysis of each diff image, describing what changed and what needs fixing

Results land in a dashboard feed. Each test run gets its own detail page with side-by-side screenshots, a diff overlay, and the AI report.

---

## Stack

- **Next.js 14** (App Router)
- **Supabase** — Auth, Postgres, Storage, Realtime
- **Playwright** — headless screenshot capture
- **pixelmatch** — pixel-level image diffing
- **Lingo.dev** — translation pipeline (CLI, CI/CD)
- **Vercel** — hosting

---

## Getting started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Lingo.dev API key

### 1. Clone and install

```bash
git clone https://github.com/0x-aut/localit.git
cd localit
npm install
```

### 2. Configure environment variables

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
LINGODOTDEV_API_KEY=your_lingo_api_key
```

### 3. Set up the database

Run the SQL migrations in `/supabase/migrations` against your Supabase project. You can do this via the Supabase dashboard SQL editor or the Supabase CLI:

```bash
supabase db push
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How a test run works

1. You submit a URL and configure a baseline locale and one or more target locales from the dashboard
2. Localit queues the job and the worker service picks it up via Supabase Realtime
3. Playwright visits each route for the baseline locale and captures screenshots
4. It does the same for each target locale
5. pixelmatch diffs the pairs and flags routes with visual changes
6. Missing translation keys are scanned and recorded
7. AI analyses each diff and writes a human-readable report
8. Results stream back to your dashboard in real time

---

## Related repositories

- **Worker service** — [github.com/0x-aut/localit-worker](https://github.com/0x-aut/localit-worker) — handles the actual screenshot and diff processing
- **Demo app** — [github.com/0x-aut/localitdemo](https://github.com/0x-aut/localitdemo) — a working Next.js app you can point Localit at to see it in action