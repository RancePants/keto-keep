# The Keto Keep — Community Platform Project Reference

> **This file is the single source of truth for the community platform build.**
> It must be shared at the start of every new chat session within this project.
> It must be updated at the end of every session before closing.
> **Canonical version date:** 2026-04-18 (Session 7 — Phase 3 design)

---

## SESSION PROTOCOLS

### Session Start Gate (mandatory — do NOT skip)
At the beginning of every new chat in this project:

1. Claude reads the canonical reference file from `D:\The Keto Keep\THE_KETO_KEEP_PROJECT_REFERENCE.md` via Filesystem MCP (the project attachment is a stale bootstrap copy — ignore it).
2. Claude confirms:
   - Current project phase and status
   - Canonical versions of all deployed artifacts (if any exist yet)
   - What was completed in the last session
   - What the next priorities are based on the roadmap
   - Any open blockers or decisions needed
3. **Version verification:** If any deployed code exists, Claude must verify that the versions listed in this file match what's actually deployed. If there's a mismatch → **STOP.** Resolve before proceeding.
4. **Agree on the session goal** before writing any code or making any changes.
5. Do NOT begin work until the start gate is complete.

### Session End Gate (mandatory — 9 items)
Before closing any chat session in this project:

1. **Files saved** — all work products saved to appropriate locations
2. **Git commit + push** — all changes committed with descriptive messages and pushed to remote
3. **Deploy verified** — if anything was deployed, verify it's live and working (check a known route or version endpoint)
4. **Roadmap updated** — check off completed tasks, note any that shifted or were added
5. **Session log entry written** — what was done, decisions made, and a "Next Session Handoff" with:
   - What to do next
   - Any prerequisites or blockers
   - Any files or resources needed
6. **Architecture & Design Decisions updated** — log any new decisions with rationale
7. **Canonical versions updated** — if any artifact versions changed, update the versions section in this file
8. **Export the updated file** — so Rance has the latest version to bring into the next session
9. **Save dated copy** — save to `D:\The Keto Keep\Project Reference\` using naming convention `THE_KETO_KEEP_PROJECT_REFERENCE_{date}_S{session#}.md`

### Interface Routing
- **Chat (this project)** = planning, decisions, writing, reference file updates
- **Claude Code** = builds, deploys, git operations — always write Code handoffs, never manual CLI steps
- **Cowork** = browser automation if needed (admin setup, testing flows)

### Code Handoff Format
When handing work off to Claude Code, always use this format:
```
cd "D:\The Keto Keep"
```
Include: recommended model (Opus 4.7 / Sonnet 4.6 / Haiku 4.5) + effort level (low–max).
Separate design discussions from build sessions.

---

## PROJECT OVERVIEW

**Project Name:** The Keto Keep
**Platform Type:** Free community platform for ancestral/metabolic health
**Target Audience:** People following paleo, keto, and carnivore diets
**Replacing:** Mighty Networks community ($119/month — being shut down)
**Cost Goal:** As close to $0/month as possible at small scale
**Owner:** Rance Edwards, NBC-HWC
**Local directory:** `D:\The Keto Keep`

### Team / Admin Roles
- **Rance Edwards** — Owner, NBC-HWC
- **Justine Roberts** — Co-Host #2, NBC-HWC (community admin, not involved in design/development)
- **Co-Host #3** — NBC-HWC (name TBD)

All three co-hosts need full admin access within the platform.

---

## CANONICAL VERSIONS

> Update this section whenever a deployed artifact's version changes.
> **Mismatch between this file and what's deployed = STOP and resolve.**

| Artifact | Version | Location | Last Commit |
|----------|---------|----------|-------------|
| Frontend app | v0.2.0 | Cloudflare Workers (keto-keep.rance-8c6.workers.dev) | session 6 — Phase 2 Forums |
| Supabase schema | v2 (Phase 2 applied) | Supabase project madzamkdedtbfhuesmej (us-east-1) | migrations: phase2_forums_schema, phase2_forum_images_bucket_policies, phase2_forums_rls_initplan_optimization |
| Project reference | canonical in repo | THE_KETO_KEEP_PROJECT_REFERENCE.md (repo root) | session 7 — Phase 3 design |
| Phase 3 schema draft | DRAFT — not applied | `Project Reference/PHASE3_SCHEMA_DRAFT.sql` | session 7 |

---

## FEATURE REQUIREMENTS

### 1. Forums (3 public + 1 admin-only)
- **General Discussion** — open conversation space for all members
- **Help & Support** — members seek advice from other members and hosts
- **Celebrating Wins** — space for sharing victories and milestones
- **Admin HQ** — private space for the 3 co-hosts to coordinate behind the scenes

Requirements:
- Members can create posts, reply to posts
- Hosts can pin, edit, delete, and moderate posts
- Posts should support text and ideally images
- Each space is clearly separated and navigable

### 2. Lifestyle Course (LMS)
- Self-paced course members can go through anytime
- Topics: eating, sleeping, movement, stress management, and related lifestyle pillars
- Structured as modules with lessons inside each module
- Track member progress (which lessons completed)
- Content is text-based with potential for embedded video

### 3. Public Member Profiles
- Each member has a visible profile
- Profile includes: name, bio, avatar, join date, badges/awards
- Profiles are viewable by other logged-in members

### 4. Events & Media
- **Upcoming Events Calendar** — list of scheduled live Zoom sessions
  - Members can RSVP to events
  - Events display date, time, description, Zoom link (visible after RSVP or to members only)
- **Past Livestreams** — a section to browse past sessions
  - YouTube embeds for recorded livestreams
  - Organized by date or topic

### 5. Landing Pages
- **Public Landing Page** (pre-login)
  - Explains what The Keto Keep is
  - Encourages visitors to create a free account
  - Account creation flow
- **Member Landing Page** (post-login / dashboard)
  - News and updates from the hosts
  - Quick links to forums, course, events
  - Announcements and relevant community info

### 6. Messaging / Member Communication
- Members can contact each other
- Options being considered:
  - In-app direct messaging
  - In-app email compose that sends to member's email (lower complexity)
- Final approach TBD — will decide during Phase 5

### 7. Badges, Awards & Tags
- **Badges/Awards** — visual indicators assigned by admins to members
  - Displayed on member profiles
  - Examples: "Founding Member," "30-Day Streak," "Community Helper"
- **Tags** — internal-use labels admins can assign to members
  - Not visible to members
  - Used for host organization (e.g., "needs follow-up," "VIP," "new member")

### 8. Admin Capabilities
- Full moderation of all forums (pin, edit, delete, ban)
- Manage events (create, edit, delete)
- Manage course content (add/edit modules and lessons)
- Assign badges/awards to members
- Assign internal tags to members
- Access admin-only forum space
- View member list with tags and filters
- Post news/updates to member dashboard

---

## TECH STACK

| Layer | Technology | Cost |
|---|---|---|
| **Frontend** | React (via Cloudflare Workers) | Free |
| **Auth** | Supabase Auth | Free tier |
| **Database** | Supabase (PostgreSQL) | Free tier |
| **File Storage** | Supabase Storage | Free tier |
| **Hosting** | Cloudflare Workers | Free tier |
| **DNS/CDN** | Cloudflare | Free tier |
| **Repo** | GitHub (`RancePants/keto-keep`) | Free |
| **CI/CD** | Cloudflare Workers Builds (GitHub auto-deploy) | Free |

### Supabase Free Tier Limits (as of project start)
- 50,000 monthly active users
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth
- 50,000 auth users

These limits are more than sufficient for an early-stage community. If the community grows significantly, Supabase Pro is $25/month — still far below the $119/month Mighty Networks cost.

### Why This Stack
- **Total monthly cost at small scale: $0**
- Supabase provides auth, database, storage, and real-time subscriptions out of the box
- Cloudflare Workers provides fast, global hosting with automatic deployments from GitHub
- React gives full control over the UI and experience
- Both Supabase and Cloudflare are connected in Rance's Claude environment for direct MCP interaction

---

## SUPABASE PATTERNS & GOTCHAS (learned from MST)

These patterns were learned through trial and error on the MST project. Follow them from day one.

### Row Level Security (RLS)
- **Enable RLS on every table from the start.** Don't "plan to add it later" — it's much harder to retrofit.
- Design RLS policies during schema creation, not after.
- Keep policies simple and consolidated — complex stacked policies are hard to debug.
- Test every policy from both authenticated and anonymous perspectives before moving on.

### Storage Buckets
- **Private buckets** (like avatar uploads) cannot use `/public/` URLs. You must use the authenticated `fetch()` → `.blob()` → `URL.createObjectURL()` pattern to serve private files to the browser.
- Decide public vs. private at bucket creation time. Migrating later is painful.
- Verify bucket policies after creation — Supabase defaults can surprise you.

### SQL Patterns
- Single quotes in SQL values must be escaped as `''` (doubled)
- When running `execute_sql` via MCP, always test queries with `SELECT` before running `INSERT`/`UPDATE`/`DELETE`
- For admin operations, use the Supabase MCP tools directly when available

### Security Advisors
- Run both `security` and `performance` advisor types separately — performance surfaces substantially more findings than you'd expect
- Run advisors after each schema change, not just at the end

### Auth
- Supabase Auth handles email confirmation, password reset, and session management out of the box — don't rebuild what's already there
- Store the user's role in a `profiles` table joined to `auth.users`, not in JWT custom claims (simpler, more flexible)

---

## CLOUDFLARE WORKERS GOTCHAS (learned from MST/FSH/TKK)

### Deployment
- GitHub → Cloudflare Workers auto-deploy via Workers Builds (connected in Phase 1)
- Build command: `npm run build`, deploy command: `npx wrangler deploy`
- Production branch: `main`, non-production branch builds also enabled
- Dedicated API token: `keto-keep build token` (not shared with other projects)

### Routing
- **`_redirects` file gotcha:** `200` rewrites cause infinite loops under the unified Workers/Pages deploy pipeline. Use `wrangler.toml` with `[assets] not_found_handling = "single-page-application"` instead.

### Mobile
- **Never embed the app in iframes** on external sites. iframes fundamentally break native mobile behavior (scrolling, touch events, viewport). This was a hard lesson from the FSH website migration. If The Keto Keep needs to be embedded anywhere, use direct links instead.

---

## PHASED ROADMAP

### Phase 1: Foundation ✅ (COMPLETE)
- [x] Create GitHub repo (`RancePants/keto-keep`)
- [x] Scaffold React project (Vite)
- [x] Supabase project setup (project madzamkdedtbfhuesmej, us-east-1)
- [x] Database schema: `profiles` table, `app_role` enum (member, admin)
- [x] RLS policies for profiles (SELECT for authenticated, UPDATE for self/admin)
- [x] Database functions: `handle_new_user`, `handle_updated_at`, `protect_role_change`, `is_admin`
- [x] Database triggers: `on_auth_user_created`, `on_profile_updated`, `on_role_change_attempt`
- [x] Storage: private avatars bucket
- [x] Auth flow: email signup, login, logout
- [x] Password reset flow (request + update-password page)
- [x] Role system: member, admin (Rance seeded as admin)
- [x] Public landing page (pre-login)
- [x] Member dashboard (post-login)
- [x] Basic member profile page (view + edit)
- [x] Navigation shell with auth-aware nav
- [x] Version display (v0.1.2 in footer)
- [x] Cloudflare Workers auto-deploy pipeline (GitHub → Workers Builds)
- [x] Dedicated API token for builds (`keto-keep build token`)
- [x] Mobile-responsive layout verified on phone

### Phase 2: Forums ✅ (COMPLETE — v0.2.0)
- [x] Database schema: `forum_spaces`, `forum_posts`, `forum_replies`, `forum_reactions`
- [x] RLS policies for all forum tables (admin-only space enforcement) — optimized with `(select auth.uid())` per perf advisor
- [x] Create the 4 forum spaces (General, Help, Wins, Admin HQ)
- [x] Post creation and display (feed layout, newest first, pinned float to top)
- [x] Reply/comment threading (2-level max, enforced by DB trigger)
- [x] Emoji reactions (curated set: 🥩 ❤️ 😂 🎉 🔥 💪) on posts and replies
- [x] Admin moderation tools (pin, edit, delete posts)
- [x] Admin HQ access restricted to admin role
- [x] Image support in posts (private `forum-images` Supabase Storage bucket, authenticated fetch pattern)
- [x] Pagination (20 posts per page, Load More)
- [x] Permalink route `/forums/:slug/:postId`

### Phase 3: Events & Media 🟡 (IN PROGRESS — design drafted, not yet applied)
- [x] Decide Zoom-link visibility → **all logged-in members** (no RSVP gate); attendee count shown as soft nudge
- [x] Draft schema: `events`, `event_rsvps` with enums (`event_type`, `event_status`, `rsvp_status`) → `Project Reference/PHASE3_SCHEMA_DRAFT.sql`
- [x] Draft RLS policies (events: admin-only write, all-auth read; event_rsvps: own-write, all-auth read)
- [x] Include `recurrence_rule` (RFC 5545 RRULE) + `recurrence_parent_id` columns from the start (UI won't exercise them in Phase 3)
- [x] Past livestreams share the events table (`status='completed'` + `youtube_embed_url`) — no separate table
- [ ] Rance reviews schema draft → approves / requests edits
- [ ] Apply migration as `phase3_events_schema`
- [ ] Run security + performance advisors; remediate findings
- [ ] Event creation UI (admin only) — single event; recurrence UI deferred
- [ ] Event listing + upcoming calendar view (cards with attendee count)
- [ ] Event detail + RSVP action (attending / maybe / declined)
- [ ] Past livestreams section with YouTube embeds
- [ ] Admin management of events and recordings
- [ ] Mobile + RLS verification pass

### Phase 4: Lifestyle Course / LMS 🔲 (NOT STARTED)
- [ ] Database schema: `courses`, `modules`, `lessons`, `lesson_progress`
- [ ] RLS policies for course tables
- [ ] Course overview page
- [ ] Module and lesson display
- [ ] Lesson content rendering (text, embedded video)
- [ ] Progress tracking per member
- [ ] Admin course content management (CRUD for modules/lessons)
- [ ] Course navigation (next/previous lesson, module overview)

### Phase 5: Messaging, Badges & Polish 🔲 (NOT STARTED)
- [ ] Member-to-member messaging (approach TBD — in-app DMs vs. email)
- [ ] Badge/award system — schema, RLS, admin assignment, profile display
- [ ] Internal tag system — schema, RLS, admin-only views
- [ ] Member directory / search
- [ ] Notification system (at minimum: in-app indicators)
- [ ] Performance and UX polish
- [ ] Accessibility review
- [ ] Supabase security + performance advisor audit (both types, run separately)
- [ ] Final RLS policy review across all tables

---

## ARCHITECTURE & DESIGN DECISIONS

| Date | Decision | Rationale |
|---|---|---|
| 2026-04-13 | Chose Supabase + Cloudflare Pages over WordPress/BuddyPress | Lowest possible cost ($0 at small scale), full ownership, no plugin dependency |
| 2026-04-13 | Chose React for frontend | Full UI control, large ecosystem, pairs well with Supabase JS client |
| 2026-04-13 | 5-phase incremental build approach | Each phase produces a deployable increment; avoids big-bang risk |
| 2026-04-18 | RLS-first schema design | Learned from MST: retrofitting RLS is painful. Design policies during schema creation. |
| 2026-04-18 | Mobile-responsive from Phase 1 | Learned from FSH: bolting on mobile later causes rework. Community members will use phones. |
| 2026-04-18 | Separate Supabase project from MST | Keeps billing, auth, and data cleanly separated. No cross-contamination risk. |
| 2026-04-18 | Version tracking from day one | Learned from MST: version mismatches between local/deployed/memory caused significant wasted work. |
| 2026-04-18 | GitHub repo: `RancePants/keto-keep` | Confirmed by Rance. Clean, descriptive name. |
| 2026-04-18 | Local project directory: `D:\The Keto Keep` | Separate drive from MST project (C:). Claude Code handoffs use this path. |
| 2026-04-18 | Supabase project: madzamkdedtbfhuesmej (us-east-1) | Separate from MST. Org: Full Spectrum Human LLC. |
| 2026-04-18 | Private avatars bucket | Secure for user uploads. Uses authenticated fetch pattern. |
| 2026-04-18 | Deployed to Cloudflare Workers (not Pages) | Initial deploy via `wrangler deploy`. May migrate to Pages for auto-deploy. |
| 2026-04-18 | Removed React StrictMode from production | Causes Supabase auth lock timeouts via double-mounting. |
| 2026-04-18 | Raised Supabase `lockAcquireTimeout` to 10s | Safety net against orphaned auth locks. |
| 2026-04-18 | GitHub reference file is single source of truth | Repo copy is canonical. Chat attachment is bootstrap snapshot only. |
| 2026-04-18 | Stay on Cloudflare Workers with Git auto-deploy | Workers Builds supports GitHub integration natively. No need to migrate to Pages. |
| 2026-04-18 | Dedicated build API token per project | Avoid cross-project token dependencies. `keto-keep build token` replaces shared FSH token. |
| 2026-04-18 | Start gate reads reference file via Filesystem MCP | No need to maintain stale project attachment. Disk read is always current. |
| 2026-04-18 | Private `forum-images` bucket (not public) | Low image volume expected (~10/week even in large communities). Consistent pattern with avatars. Easier to loosen later than tighten. |
| 2026-04-18 | Feed/wall-style forum UI (not traditional click-through) | Matches Mighty Networks Spaces and Facebook feed UX that members are used to. Posts render inline with full body; replies expand underneath. |
| 2026-04-18 | Two-level reply threading (post → reply → reply-to-reply, no deeper) | Balances conversation depth with UI simplicity. Enforced at DB level (trigger) and UI level (no reply button on nested replies). |
| 2026-04-18 | Curated emoji reaction set in frontend code, not DB | 6 emojis (🥩 ❤️ 😂 🎉 🔥 💪) can be changed without schema migration. 🥩 chosen over 👍 for community brand fit. |
| 2026-04-18 | RLS policies use `(select auth.uid())` wrapper | Performance advisor flagged `auth_rls_initplan` — wrapping in subselect ensures auth.uid() is evaluated once per query, not per row. |
| 2026-04-18 | Author profiles fetched via client-side join | FK on forum_posts points to `auth.users`, not `profiles`. Separate profile fetch avoids cross-table RLS complexity. |
| 2026-04-18 | Phase 3: Zoom links visible to all logged-in members (no RSVP gate) | Matches small-trust-based community ethos. RSVP is still tracked and shown as soft attendee count nudge. Simpler RLS, less friction. |
| 2026-04-18 | Phase 3: include `recurrence_rule` (RFC 5545) from day one | Recurring events are a near-certain future requirement. Retrofitting a recurrence column later would require re-writing event queries. RRULE is the standard, one row per series. Phase 3 UI leaves it NULL. |
| 2026-04-18 | Phase 3: past livestreams share the events table | A completed event with a `youtube_embed_url` IS a past livestream. Separate table would duplicate fields and fragment the calendar. Single source of truth. |
| 2026-04-18 | Phase 3: event_rsvps SELECT open to all authenticated members | Enables attendee lists and counts without a SECURITY DEFINER view. Matches the community ethos. Easy to tighten later if privacy becomes a requirement. |
| 2026-04-18 | Phase 3: dedicated enums (`event_type`, `event_status`, `rsvp_status`) | Type safety at the DB level. Matches the `app_role` precedent from Phase 1. Extensible via `ALTER TYPE ADD VALUE`. |
| 2026-04-18 | Phase 3: `created_by` FK → `auth.users` (not profiles) | Consistent with forum_posts.author_id. Client-side join fetches the display_name + avatar. |

---

## LESSONS LEARNED (from MST project — applied here)

These are hard-won lessons from the MST build. They're documented here so we don't repeat the same mistakes.

### Version integrity is critical
Mismatches between local files, deployed code, and this reference file have caused wasted work on MST. Always verify versions match before editing. If something doesn't match → STOP and resolve.

### Security from the start, not bolted on later
RLS policies, auth flows, and storage bucket permissions should be designed alongside the schema — not as a cleanup task. Every table gets RLS on creation. Every bucket gets its access policy defined at creation.

### Private Supabase Storage requires authenticated fetch
If avatar images or uploaded files are in a private bucket, you can't just use a public URL. You must use the Supabase client's authenticated download, convert to blob, and create an object URL. Plan for this in the component architecture.

### Supabase security audits — run both types
Run `security` AND `performance` advisor types separately after schema changes. The performance advisor surfaces findings that the security advisor misses entirely.

### Cloudflare _redirects can silently break routing
`200` rewrites cause infinite loops under unified Workers/Pages deploy. Use `wrangler.toml` with `[assets] not_found_handling = "single-page-application"` instead of `_redirects`.

### iframes break mobile — never use them for embedding
The entire FSH website migration was motivated by discovering that iframe-embedded tools fundamentally break native mobile scrolling, touch events, and viewport behavior. If The Keto Keep ever needs to appear on another site, use direct links.

### Large file writes can be unreliable
For files over ~250KB, `Filesystem:write_file` can be unreliable. Use `present_files` for delivery and hand off to Claude Code for local saves and deploys when dealing with large artifacts.

### Test everything on mobile during development
Don't save "mobile responsiveness pass" for Phase 5. Test on mobile (or at minimum, resize your browser) after every significant UI addition. Fixing layout at the end is 10x more work than building responsive from the start.

### Git is the safety net — commit early and often
Every meaningful change gets committed. Descriptive commit messages. Push after every session. The git history is your undo button.

### RLS self-referencing policies cause infinite recursion
If an RLS policy on table X contains a subquery that reads table X, it triggers infinite recursion. Solution: create a `SECURITY DEFINER` function (like `is_admin()`) that bypasses RLS for the internal check.

### Bootstrap the first admin with trigger disable/enable
The `protect_role_change` trigger prevents non-admins from changing roles — but when there are zero admins, no one can create the first admin. Solution: `ALTER TABLE DISABLE TRIGGER`, update the role, `ALTER TABLE ENABLE TRIGGER`.

### Always use try/catch/finally in AuthContext
Every async operation in the auth context must have error handling that guarantees loading states are cleared. A single unhandled rejection can leave the app stuck on a spinner forever.

### Wrap auth.uid() in (select ...) in RLS policies
The Supabase performance advisor flags `auth_rls_initplan` when `auth.uid()` is used directly in RLS policies — it gets evaluated per-row instead of once per query. Wrapping it as `(select auth.uid())` turns it into a subselect that's evaluated once. Apply this pattern to all RLS policies from the start.

---

## CURRENT STATUS

**Current Phase:** Phase 3 — IN PROGRESS (design drafted, awaiting schema review)
**Last Updated:** 2026-04-18 (Session 7)
**Frontend Version:** v0.2.0 (unchanged — no deploy this session)
**Status:** Phase 3 design session. Schema + RLS for `events` and `event_rsvps` drafted in `Project Reference/PHASE3_SCHEMA_DRAFT.sql` (NOT YET APPLIED). Includes `event_type` / `event_status` / `rsvp_status` enums, `recurrence_rule` + `recurrence_parent_id` columns for future-proofing, past livestreams via `status='completed'` + `youtube_embed_url` on the events table. Zoom-link decision: visible to all logged-in members (no RSVP gate). Attendee-count nudge on cards. Next: Rance reviews, approves, then we apply migration and start frontend build.

---

## SESSION LOG

### Session 1 — 2026-04-13
**Goal:** Define project scope, choose tech stack, create project reference file.
**What was done:**
- Discussed platform options (WordPress, Discourse, Bettermode, custom build)
- Decided on Supabase + Cloudflare Pages custom build
- Defined full feature requirements
- Created 5-phase roadmap
- Created initial project reference file with session protocols

**Decisions made:**
- Tech stack: React + Supabase + Cloudflare Pages
- Build approach: 5 incremental phases
- Session management: start gate (read file, confirm status) and end gate (update file, write handoff)

**Next Session Handoff:**
- Begin **Phase 1: Foundation**
- First task: Create GitHub repo and scaffold the React project (Vite + React Router)
- Second task: Create a new Supabase project (separate from MST)
- Third task: Design the database schema for `profiles` table with RLS policies
- Fourth task: Set up Supabase auth (email signup/login/logout)
- Fifth task: Build the app shell — layout, navigation, routing
- Rance should bring this file into the next chat to trigger the start gate
- No blockers. Ready to build.

### Session 2 — 2026-04-18
**Goal:** Refine project reference file with lessons learned from MST project.
**What was done:**
- Rewrote session protocols with version verification and 9-item end gate
- Added Canonical Versions tracking, Supabase Patterns, Cloudflare Gotchas, Lessons Learned sections
- Expanded Phase 1 roadmap with mobile-first, version tracking, RLS tasks
- Confirmed repo name (`RancePants/keto-keep`) and local directory (`D:\The Keto Keep`)

**Next Session Handoff:**
- Begin Phase 1: Foundation. No blockers.

### Session 3 — 2026-04-18 (Claude Code)
**Goal:** Build and deploy Phase 1 foundation.
**What was done:** Scaffolded React + Vite. Built Supabase schema (profiles, RLS, triggers, functions). Created private avatars bucket. Built AuthContext, ProtectedRoute, pages, Navbar. Deployed to Cloudflare Workers. Seeded Rance as admin. Version v0.1.0.
**Issues:** Auth token lock timeout bug — React StrictMode double-mounting caused cascading orphaned Supabase auth locks.
**Next:** Fix auth lock bug.

### Session 4 — 2026-04-18 (Chat + Claude Code)
**Goal:** Diagnose and fix infinite loading spinner and broken logout.
**What was done:** Diagnosed via Chrome DevTools. Fixed: removed StrictMode, raised `lockAcquireTimeout` to 10s, hardened `onAuthStateChange` cleanup. Deployed v0.1.1. Verified working. Established GitHub reference file as single source of truth.
**Next:** Password reset flow, Workers vs Pages decision, auto-deploy pipeline, mobile testing.

### Session 5 — 2026-04-18 (Chat + Claude Code)
**Goal:** Complete remaining Phase 1 items and close out the phase.
**What was done:**
- Verified Filesystem MCP access to `D:\The Keto Keep` (required restart)
- Decided: reference file read from disk via Filesystem MCP (project attachment is stale bootstrap — ignore it)
- Completed password reset flow: `UpdatePassword.jsx` page, `PASSWORD_RECOVERY` event handler in AuthContext, `redirectTo` updated, Supabase redirect URL added. Deployed v0.1.2 (commit 1db8d85).
- Tested and verified full password reset flow (request → email → update → auto-login)
- Connected Cloudflare Workers Builds to GitHub repo (`RancePants/keto-keep`) for auto-deploy
- Created dedicated `keto-keep build token` API token (replaced shared FSH token)
- Auto-deploy pipeline verified working on v0.1.2 push
- Mobile-responsive layout verified on phone (all pages tested)
- Phase 1 marked COMPLETE

**Decisions made:**
- Stay on Cloudflare Workers (Workers Builds supports GitHub auto-deploy natively)
- Dedicated build API token per project (no cross-project dependencies)
- Reference file read from disk via Filesystem MCP at start gate (not project attachment)

**Next Session Handoff:**
- Begin **Phase 2: Forums**
- First task: Design database schema for `forum_spaces`, `forum_posts`, `forum_replies`
- Second task: Design RLS policies (admin-only Admin HQ space)
- Third task: Plan the UI (space listing, post list, post detail, create post, reply threading)
- Decision needed: image support in posts — public or private storage bucket?
- No blockers. Ready to build.

### Session 7 — 2026-04-18 (Claude Code — Phase 3 design)
**Goal:** Phase 3 kick-off. Confirm version parity, draft Events & Media schema + RLS, update reference file. No deploy this session.

**What was done:**
- Start gate: confirmed `package.json` v0.2.0 = reference canonical v0.2.0 = Layout.jsx footer (`v{pkg.version}`). All 9 Supabase migrations match the reference. No mismatches.
- Committed + pushed a docs-only cleanup of the Session 6 log (commit e331b95, consolidating the split Chat/Code entries and adding the Phase 2 design decisions to the table).
- Drafted `Project Reference/PHASE3_SCHEMA_DRAFT.sql`:
  - Enums: `event_type` (`live_call`, `workshop`, `q_and_a`, `special_guest`, `meetup`, `other`), `event_status` (`scheduled`, `live`, `completed`, `cancelled`), `rsvp_status` (`attending`, `maybe`, `declined`).
  - `events` table: title, description, event_type, start_time, end_time, zoom_link, youtube_embed_url, status, recurrence_rule (RRULE, nullable), recurrence_parent_id (nullable self-FK), created_by → auth.users, timestamps, CHECK end ≥ start.
  - `event_rsvps` table: composite PK (event_id, user_id), rsvp_status, timestamps, FKs cascade on delete.
  - Indexes on start_time, status, created_by, user_id, and a partial index on recurrence_parent_id.
  - RLS: events = admin-only write, all-auth read. event_rsvps = own-write, own-cancel-or-admin-delete, all-auth read (enables attendee lists + counts).
  - All `auth.uid()` wrapped as `(select auth.uid())` per Phase 2 pattern.
  - Reuses Phase 1 `handle_updated_at()` and `is_admin()`.

**Decisions made:**
- Zoom link visible to all logged-in members (no RSVP gate). Attendee count shown as soft nudge.
- `recurrence_rule` (RFC 5545) + `recurrence_parent_id` included from the start even though Phase 3 UI won't exercise them.
- Past livestreams share the events table (`status='completed'` + `youtube_embed_url`).
- `event_rsvps.SELECT` open to all authenticated members for simple attendee lists/counts — easy to tighten later.
- Dedicated enums for type/status/rsvp_status.
- `created_by` FK → `auth.users` (same pattern as forum_posts.author_id).

**Next Session Handoff:**
- Rance reviews `Project Reference/PHASE3_SCHEMA_DRAFT.sql`. Push back on any design point.
- On approval: apply as migration `phase3_events_schema` via Supabase MCP. Run `security` + `performance` advisors. Remediate any `auth_rls_initplan` findings (should be none — already wrapped).
- Then begin Phase 3 frontend: event listing + calendar, event detail + RSVP, past livestreams section, admin event CRUD.
- Open question still open: Co-Host #3 name (non-blocking).

### Session 6 — 2026-04-18 (Chat + Claude Code — Phase 2)
**Goal:** Design and build Phase 2: Forums.
**What was done:**

*Chat (design):*
- Decided private `forum-images` bucket (low image volume, consistent with avatars pattern)
- Designed full schema: `forum_spaces`, `forum_posts`, `forum_replies`, `forum_reactions`
- Designed RLS policies for all 4 tables with admin-only Admin HQ enforcement
- Designed two-level reply nesting with `parent_reply_id` + depth enforcement trigger
- Added emoji reactions table with curated picker (🥩 ❤️ 😂 🎉 🔥 💪)
- Chose feed/wall-style UI over traditional click-through forum
- Wrote comprehensive Claude Code handoff

*Claude Code (build):*
- Applied `phase2_forums_schema` migration with all tables, RLS, triggers
- Seeded 4 forum spaces
- Created private `forum-images` storage bucket with policies
- After perf advisor flagged `auth_rls_initplan`, optimized all RLS policies to use `(select auth.uid())`
- Built feed-style frontend: space grid, post composer, post cards with inline replies, emoji reactions, admin mod tools, pagination, permalinks
- Shared `usePrivateImage` hook for avatar and forum image fetching
- Added Forums to navbar, activated Dashboard quick-link
- Deployed v0.2.0 (commit 894b90b)

**Decisions made:**
- Private `forum-images` bucket (low volume, consistent pattern, easier to loosen than tighten)
- Feed/wall-style UI (matches Mighty Networks and Facebook UX members are used to)
- Two-level reply threading (post → reply → reply-to-reply, enforced by DB trigger + UI)
- Curated emoji set in frontend code, not DB (🥩 replaces 👍 for brand fit)
- RLS policies use `(select auth.uid())` wrapper per performance advisor
- Author profiles fetched via client-side join (FK points to auth.users, not profiles)
- Emoji set in code so it can be tuned without migration
- Optimistic-ish reactions via insert/delete + re-fetch

**Next Session Handoff:**
- Begin **Phase 3: Events & Media**
- First task: Design schema for `events` and `event_rsvps` tables
- Second task: Design RLS policies (admin-only event creation, member RSVP)
- Third task: Plan UI for event listing, RSVP, and past livestreams (YouTube embeds)
- Decision needed: Zoom link visibility — visible to all members, or only after RSVP?
- Remaining from Phase 2: manual RLS testing as member vs admin, mobile verification of forums
- No blockers. Ready to build.

---

## OPEN QUESTIONS & DECISIONS NEEDED

- Name of Co-Host #3 (for admin seeding; Co-Host #2 confirmed: Justine Roberts)
- Community branding: logo, color palette, typography (can be decided later, but needed before public launch)
- Custom domain name (if desired — Cloudflare provides a free `*.workers.dev` subdomain to start)
- Messaging approach in Phase 5: in-app DMs vs. email-based communication

---

## REFERENCE LINKS

- GitHub Repo: https://github.com/RancePants/keto-keep
- Deployed App: https://keto-keep.rance-8c6.workers.dev/
- Supabase Dashboard: https://supabase.com/dashboard
- Supabase Project: https://supabase.com/dashboard/project/madzamkdedtbfhuesmej
- Cloudflare Dashboard: https://dash.cloudflare.com
- Mighty Networks (current, to be shut down): The Keto Keep
- Supabase Docs (auth): https://supabase.com/docs/guides/auth
- Supabase Docs (RLS): https://supabase.com/docs/guides/auth/row-level-security
- Cloudflare Workers Docs: https://developers.cloudflare.com/workers

---

*End of project reference file. Keep this file up to date across every session.*