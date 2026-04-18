# The Keto Keep — Phase 1 Claude Code Handoff

> **Model:** Opus 4.7 | **Effort:** Max
> **Start with:** `cd "D:\The Keto Keep"`

---

## What This Session Covers

Build the complete Phase 1 frontend for The Keto Keep — a free community platform for ancestral/metabolic health (paleo, keto, carnivore). The Supabase backend is already configured (schema, RLS, storage). This session builds the React frontend, deploys to Cloudflare Pages, and verifies everything works.

---

## Supabase Project (ALREADY CREATED — do NOT create another)

- **Project ID:** `madzamkdedtbfhuesmej`
- **Region:** `us-east-1`
- **URL:** `https://madzamkdedtbfhuesmej.supabase.co`
- **Anon Key (legacy):** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hZHphbWtkZWR0YmZodWVzbWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0OTU3OTMsImV4cCI6MjA5MjA3MTc5M30.lbXkoz0RNCTYgHSciZr2XbWmMg8NTzE1IpPk364IrvM`

### What's already in the database:
- `app_role` enum: `member`, `admin`
- `profiles` table: `id` (FK → auth.users), `email`, `display_name`, `bio`, `avatar_url`, `role` (default: member), `created_at`, `updated_at`
- RLS enabled with optimized policies (select for authenticated, update for self or admin)
- Trigger: auto-creates profile on signup (populates display_name from metadata or email prefix)
- Trigger: auto-updates `updated_at` on profile change
- Trigger: prevents non-admins from changing `role` field
- Private `avatars` storage bucket with per-user folder RLS policies
- Role index on profiles table

---

## Existing Repo State

The repo (`RancePants/keto-keep`) has 1 commit with a bare Vite + React scaffold:
- Vite 8, React 19, React Router 7, @supabase/supabase-js
- `.env.example` with placeholder Supabase vars
- Default Vite template content (needs to be replaced entirely)
- Package name is `"temp-scaffold"` — **rename to `"keto-keep"`**
- README is default Vite — **replace with project README**

---

## Tasks (in order)

### 1. Project Setup
- Rename package to `"keto-keep"` in `package.json`
- Set version to `"0.1.0"` in `package.json`
- Create `.env` file (NOT committed — already in `.gitignore`):
  ```
  VITE_SUPABASE_URL=https://madzamkdedtbfhuesmej.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hZHphbWtkZWR0YmZodWVzbWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0OTU3OTMsImV4cCI6MjA5MjA3MTc5M30.lbXkoz0RNCTYgHSciZr2XbWmMg8NTzE1IpPk364IrvM
  ```
- Update `.env.example` to match the var names (without real values)
- Replace default README with a proper project README

### 2. Supabase Client
Create `src/lib/supabase.js`:
- Initialize Supabase client with env vars
- Export the client instance for use throughout the app

### 3. Auth Context
Create `src/contexts/AuthContext.jsx`:
- Wrap app in auth provider
- Track `session`, `user`, `profile`, `loading` state
- On mount: get initial session, fetch profile, subscribe to auth state changes
- Expose: `signUp`, `signIn`, `signOut`, `resetPassword`, `updateProfile`, `uploadAvatar`
- `signUp` should accept `email`, `password`, and `displayName` (passed as `raw_user_meta_data`)
- `uploadAvatar`: upload to `avatars/{user.id}/avatar.{ext}`, then update `avatar_url` in profile
- **Avatar download helper**: since bucket is private, provide a `getAvatarUrl(path)` function that uses `supabase.storage.from('avatars').download(path)` → `.blob()` → `URL.createObjectURL()`. Cache the object URL to avoid re-downloading.

### 4. Protected Route Component
Create `src/components/ProtectedRoute.jsx`:
- If loading, show a loading spinner
- If no session, redirect to `/login`
- If authenticated, render children

### 5. App Shell & Routing
Update `src/App.jsx`:
- Wrap in `AuthProvider`
- Routes:
  - `/` → `Landing` (public)
  - `/login` → `Login` (public, redirect to `/dashboard` if already logged in)
  - `/signup` → `Signup` (public, redirect to `/dashboard` if already logged in)
  - `/reset-password` → `ResetPassword` (public)
  - `/dashboard` → `Dashboard` (protected)
  - `/profile` → `Profile` — own profile (protected)
  - `/profile/:id` → `Profile` — view another member (protected)
  - `*` → `NotFound`

### 6. Layout & Navigation
Create `src/components/Layout.jsx` and `src/components/Navbar.jsx`:
- Layout wraps all pages with consistent nav + footer
- Navbar shows:
  - **Logged out:** Logo/brand, Login, Sign Up
  - **Logged in:** Logo/brand, Dashboard, Profile, Logout
  - Admin badge/indicator if user role is `admin`
- **Mobile-responsive:** Hamburger menu on small screens
- Footer shows app version (import from `package.json`) and "© 2026 The Keto Keep"
- Navigation uses React Router `<Link>` components (no full page reloads)

### 7. Pages

#### Landing Page (`src/pages/Landing.jsx`)
- Public marketing page — this is what visitors see before signing up
- Hero section: "The Keto Keep" with tagline about community for metabolic health
- Value props: free community, expert hosts (all NBC-HWC certified), forums, events, courses
- CTA buttons: "Join Free" → `/signup`, "Already a member? Log In" → `/login`
- Brief "About the Hosts" section mentioning the team (Rance Edwards, Justine Roberts — both NBC-HWC)
- Mobile-first layout

#### Login Page (`src/pages/Login.jsx`)
- Email + password form
- "Forgot password?" link → `/reset-password`
- "Don't have an account? Sign up" link → `/signup`
- Error display for invalid credentials
- Redirect to `/dashboard` on success

#### Signup Page (`src/pages/Signup.jsx`)
- Email, password, confirm password, display name fields
- Password validation (minimum 6 chars, match confirmation)
- "Already have an account? Log in" link → `/login`
- On success: show "Check your email to confirm your account" message
- Pass `display_name` in sign-up metadata so the trigger picks it up

#### Reset Password Page (`src/pages/ResetPassword.jsx`)
- Email field + submit button
- On submit: call Supabase `resetPasswordForEmail`
- Show confirmation message regardless (don't reveal if email exists)

#### Dashboard (`src/pages/Dashboard.jsx`)
- Welcome message: "Welcome back, {display_name}!"
- News/updates section (placeholder for now — just static welcome text about the community)
- Quick links section: links to Profile (future: Forums, Events, Course)
- Show "Admin Panel" link if user role is `admin` (panel itself is Phase 2+, link can go to a placeholder)

#### Profile Page (`src/pages/Profile.jsx`)
- If viewing own profile (`/profile`): editable mode
  - Avatar upload (circular image with upload overlay on hover)
  - Editable: display name, bio
  - Non-editable display: email, role badge, member since date
  - Save button that calls `updateProfile`
- If viewing another member (`/profile/:id`): read-only mode
  - Show their avatar, display name, bio, role badge, member since
- Avatar display must use the private bucket download pattern (fetch → blob → object URL)

#### Not Found (`src/pages/NotFound.jsx`)
- Simple 404 page with link back to home

### 8. Styling
- **Use plain CSS** (no Tailwind, no CSS-in-JS) — keep it simple and maintainable
- Create `src/styles/` directory with organized CSS files
- **Design direction:** Warm, inviting, and grounded — this is a health & wellness community, not a tech product
  - Color palette: Earthy/warm tones — think deep greens, warm ambers/golds, cream/off-white backgrounds, with clean contrast
  - Typography: Use Google Fonts — pick something with warmth and readability (e.g., a serif or friendly sans-serif for headings, clean sans for body). Avoid cold/techy fonts like Inter, Roboto.
  - Rounded corners, generous spacing, soft shadows
  - The "keep" in the name evokes a castle/stronghold — subtle nods to that are welcome (shield motif, strong typography) but don't go medieval theme
- **Mobile-responsive from the start**: flexbox/grid layouts, hamburger nav, touch-friendly targets (min 44px)
- CSS custom properties for colors, spacing, typography so theming is easy later
- Smooth transitions on interactive elements

### 9. SPA Routing & Cloudflare Pages Config
Create `public/_redirects`:
```
/* /index.html 200
```
This handles client-side routing on Cloudflare Pages.

**IMPORTANT:** Do NOT use `_redirects` for anything else. Keep it to this single SPA catch-all. Complex redirect rules have caused issues in past projects.

### 10. Version Endpoint
- App version comes from `package.json` (`"0.1.0"`)
- Display in footer: "v0.1.0"
- This is how we verify deploys match the reference file

### 11. Replace Default README
Write a proper `README.md`:
```markdown
# The Keto Keep

A free community platform for ancestral and metabolic health — paleo, keto, and carnivore.

## Tech Stack
- React 19 + Vite 8
- Supabase (Auth, Database, Storage)
- Cloudflare Pages

## Development
```bash
npm install
npm run dev
```

## Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase credentials.

## Deployment
Auto-deploys via Cloudflare Pages on push to `main`.
```

### 12. Git Commit & Push
After everything is working locally:
- `git add -A`
- `git commit -m "Phase 1: Auth, profiles, layout, routing, landing page (v0.1.0)"`
- `git push origin main`

### 13. Cloudflare Pages Deployment
- If not already set up: connect the GitHub repo to Cloudflare Pages
  - Build command: `npm run build`
  - Build output directory: `dist`
  - Environment variables: set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Cloudflare Pages settings
- After deploy: verify the version in the footer matches `0.1.0`
- Test: landing page loads, signup works, login works, profile edit works, avatar upload works

---

## Critical Patterns & Gotchas

### Private Avatar Storage
The `avatars` bucket is **private**. You CANNOT use `supabase.storage.from('avatars').getPublicUrl()`.
Instead:
```javascript
const { data, error } = await supabase.storage
  .from('avatars')
  .download(filePath);
if (data) {
  const url = URL.createObjectURL(data);
  // Use this url in <img src={url} />
}
```
Cache the object URL in state to avoid re-downloading on every render. Revoke old URLs with `URL.revokeObjectURL()` when they change.

### Supabase Auth Email Confirmation
By default, Supabase requires email confirmation. The signup flow should tell users to check their email. For development/testing, email confirmation can be disabled in the Supabase dashboard (Auth → Settings → Enable email confirmations toggle).

### React Router & Cloudflare Pages
The `/* /index.html 200` rule in `_redirects` handles all routes. React Router takes over client-side. Do NOT add additional redirect rules.

### Role-Protected UI
The role check is UI-only in Phase 1 (showing/hiding admin links). The real enforcement happens via RLS in the database. Never trust client-side role checks for security — they're just for UX.

---

## Admin Seeding

After the app is deployed and working, Rance will sign up with his email. Then we'll promote his account to admin via SQL:
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = '<rance-email>';
```
Same for Justine Roberts when she signs up. This will be done in a follow-up session.

---

## What Success Looks Like

After this session, we should have:
1. ✅ Landing page at the Cloudflare Pages URL (public, marketing page)
2. ✅ Working signup → email confirmation → login flow
3. ✅ Member dashboard with welcome message
4. ✅ Profile page with avatar upload (private bucket)
5. ✅ Mobile-responsive on all pages
6. ✅ Version `0.1.0` visible in footer
7. ✅ Git repo up to date with descriptive commit
8. ✅ Cloudflare Pages auto-deploying from GitHub

---

## Files to Create/Modify

```
Modified:
  package.json          — rename, version, any new deps
  .env.example          — update var names
  README.md             — replace with project README
  src/App.jsx           — router setup with AuthProvider
  src/App.css           — replace with real styles (or remove in favor of styles/)
  src/main.jsx          — ensure it wraps correctly
  index.html            — update <title> to "The Keto Keep"

Created:
  .env                  — real Supabase credentials (not committed)
  public/_redirects     — SPA routing for Cloudflare Pages
  src/lib/supabase.js
  src/contexts/AuthContext.jsx
  src/components/Layout.jsx
  src/components/Navbar.jsx
  src/components/ProtectedRoute.jsx
  src/pages/Landing.jsx
  src/pages/Login.jsx
  src/pages/Signup.jsx
  src/pages/ResetPassword.jsx
  src/pages/Dashboard.jsx
  src/pages/Profile.jsx
  src/pages/NotFound.jsx
  src/styles/           — organized CSS files
```

Removed:
  - Any default Vite template content (default App component, Vite logo, etc.)

---

## Project Reference File — Local Copy

Save a dated copy of the project reference file to the local archive directory:

```
D:\The Keto Keep\Project Reference\
```

- Create the `Project Reference` folder if it doesn't exist
- Save the current reference file as: `THE_KETO_KEEP_PROJECT_REFERENCE_2026-04-18_S3.md`
- Naming convention: `THE_KETO_KEEP_PROJECT_REFERENCE_{date}_S{session#}.md`
- Also save this handoff file there: `PHASE1_CLAUDE_CODE_HANDOFF.md`
- This gives Rance a local version history of all reference file updates
