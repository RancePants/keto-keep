# The Keto Keep

A free community platform for ancestral and metabolic health — paleo, keto, and carnivore.

## Tech Stack

- React 19 + Vite 8
- React Router 7
- Supabase (Auth, Database, Storage)
- Cloudflare Pages

## Development

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Build

```bash
npm run build
```

Output is written to `dist/`.

## Deployment

Auto-deploys via Cloudflare Pages on push to `main`.

- Build command: `npm run build`
- Build output: `dist`
- Environment variables: set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Cloudflare Pages project settings.

## Project Structure

```
src/
  lib/             Supabase client
  contexts/        React contexts (Auth)
  components/      Shared UI (Layout, Navbar, ProtectedRoute)
  pages/           Route-level components
  styles/          Plain CSS, organized by concern
```
