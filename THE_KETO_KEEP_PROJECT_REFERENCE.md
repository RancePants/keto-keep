# The Keto Keep — Community Platform Project Reference

> **This file is the single source of truth for the community platform build.**
> It must be shared at the start of every new chat session within this project.
> It must be updated at the end of every session before closing.
> **Canonical version date:** 2026-04-21 (Session 31 — v0.16.0; Phase 5I Guide Character — Sir Cedric / Lady Elara tooltips + onboarding tour + 14 contextual tips)

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

### Session End Gate (mandatory — 10 items)
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
10. **Guide tutorial check** — if any user-facing feature was added, renamed, moved, or removed this session, review the tooltip content in `Project Reference/GUIDE_CHARACTER_DESIGN.md` (tips 1–14). Update any affected tip text. If a new feature warrants a new tip, draft it and add it to the design doc + wire it into the app.

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

### Build Plan Files (mandatory for Code sessions)

**Problem this solves:** Large Code sessions hit context limits and trigger compaction. When that happens, Claude Code loses earlier context and may forget what's done, re-do work, or skip tasks. The build plan file is the safety net.

**How it works:**

1. **Chat creates the build plan.** Before every Code handoff, Chat writes a `CURRENT_BUILD_PLAN.md` file to `D:\The Keto Keep\`. This file contains every task for the session as a granular checkbox list, organized by section, with enough detail that Code can pick up any task cold — without needing to remember earlier context.

2. **Code reads it first.** The Code handoff instructions must tell Code to read `CURRENT_BUILD_PLAN.md` at the very start of the session, before doing anything else.

3. **Code checks off tasks as it goes.** After completing each task (or small group of related tasks), Code updates the checkbox from `[ ]` to `[x]` and adds any inline notes (filenames created, decisions made, issues encountered).

4. **Code re-reads after compaction.** The Code handoff instructions must explicitly state: "After ANY compaction event, immediately re-read `CURRENT_BUILD_PLAN.md` to know exactly where you left off. Do NOT rely on memory."

5. **Completed items stay.** Never delete checked-off items — they serve as a record of what's done and prevent re-doing work.

6. **Session end.** At session end, the build plan should be fully checked off. It gets archived alongside the dated reference file copy (rename to `PHASE{X}_BUILD_PLAN_COMPLETED.md` in `Project Reference/`).

**Build plan format rules:**
- Every task is a checkbox: `- [ ] Task description`
- Group tasks under clear `##` section headers matching the handoff structure
- Include enough context per task that Code can execute it without the handoff text (file paths, function names, SQL statements, expected outcomes)
- Add dependency notes where order matters: `(depends on 1A)` or `(after theme.css is created)`
- Pre-build steps (schema changes, asset copies) come first
- Verification/testing steps come last

**Code handoff template addition:**
Every Code handoff must now include this block:
```
COMPACTION SAFETY: Read `CURRENT_BUILD_PLAN.md` at session start.
Check off tasks as you complete them. After ANY compaction, re-read
the file immediately — it is your source of truth for what's done
vs. what remains.
```

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
| Frontend app | v0.16.0 | Cloudflare Workers (keto-keep.rance-8c6.workers.dev) | session 31 — Phase 5I guide character (Sir Cedric / Lady Elara), onboarding tour, 14 contextual tips, sidebar Guide button, profile guide preferences |
| Supabase schema | v5I (adds profiles.guide_character text + profiles.dismissed_tips text[]) | Supabase project madzamkdedtbfhuesmej (us-east-1) | session 31 — guide character schema |
| Project reference | canonical in repo | THE_KETO_KEEP_PROJECT_REFERENCE.md (repo root) | session 22 — v0.9.0 owner role + sidebar |
| Phase 3 schema draft | APPLIED (reference copy) | `Project Reference/PHASE3_SCHEMA_DRAFT.sql` | session 8 — matches applied migration |
| Phase 4 schema draft | APPLIED (reference copy) | `Project Reference/PHASE4_SCHEMA_DRAFT.sql` | session 10 — matches applied migration |
| Phase 5A schema draft | APPLIED (reference copy) | `Project Reference/PHASE5A_SCHEMA_DRAFT.sql` | session 13 — matches applied migration (incl. FK cover indexes) |
| Phase 5B-1 schema draft | APPLIED (reference copy) | `Project Reference/PHASE5B1_SCHEMA_DRAFT.sql` | session 15 — matches applied migration |
| Phase 5B-2 schema draft | APPLIED (reference copy) | `Project Reference/PHASE5B2_SCHEMA_DRAFT.sql` | session 17 — matches applied migration |
| Phase 5H schema draft | APPLIED (reference copy) | `Project Reference/PHASE5H_SCHEMA_DRAFT.sql` | session 28 — matches applied migration |

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

### Phase 3: Events & Media ✅ (COMPLETE — v0.3.0 deployed)
- [x] Decide Zoom-link visibility → **all logged-in members** (no RSVP gate); attendee count shown as soft nudge
- [x] Draft schema: `events`, `event_rsvps` with enums (`event_type`, `event_status`, `rsvp_status`) → `Project Reference/PHASE3_SCHEMA_DRAFT.sql`
- [x] Draft RLS policies (events: admin-only write, all-auth read; event_rsvps: own-write, all-auth read)
- [x] Include `recurrence_rule` (RFC 5545 RRULE) + `recurrence_parent_id` columns from the start (UI won't exercise them in Phase 3)
- [x] Past livestreams share the events table (`status='completed'` + `youtube_embed_url`) — no separate table
- [x] Rance reviewed schema draft → approved with one change (`meetup` → `coaching_circle`); `end_time` stays nullable; `event_rsvps.SELECT` stays open
- [x] Applied migration `phase3_events_schema` (session 8, 2026-04-18)
- [x] Ran security + performance advisors. No new findings. Zero `auth_rls_initplan` — the `(select auth.uid())` wrapping is clean. Only pre-existing WARN is `auth_leaked_password_protection` (dashboard toggle, deferred). INFO `unused_index` findings expected on fresh tables.
- [x] Event creation UI (admin only) — `EventFormModal` with title/description/type/status/start/end/zoom/youtube. Recurrence UI deferred as planned.
- [x] Event listing + upcoming calendar view — `/events` with "Coming up" (cards w/ date block, type badge, attendee count, inline RSVP) + "Past sessions" grid (lazy YouTube embeds).
- [x] Event detail + RSVP action — `/events/:id` with description, zoom CTA (auth only), three-way RSVP (attending/maybe/declined), attendee list with avatars + profile links.
- [x] Past livestreams section with YouTube embeds (IntersectionObserver lazy load, no-IO fallback).
- [x] Admin management — "+ New event" button + per-card ✎ Edit, delete-with-confirm inside the form modal.
- [x] Dashboard `UpcomingEventsCard` (next 2 upcoming, deep-links to detail).
- [x] Navbar Events link + Dashboard quick-link activated.
- [x] Mobile layout pass (stacked header, single-column form rows, responsive padding).
- [x] RLS smoke test via SQL — all 8 policies confirmed: events SELECT=authenticated, INSERT/UPDATE/DELETE=is_admin; event_rsvps SELECT=authenticated, INSERT/UPDATE require own user_id, DELETE self-or-admin. All `auth.uid()` wrapped.
- [x] Bumped to v0.3.0, committed, pushed, verified Cloudflare deploy.

### Phase 4: Lifestyle Course / LMS ✅ (COMPLETE — v0.4.0 deployed)
- [x] Database schema: `courses`, `modules`, `lessons`, `lesson_progress` (session 10, migration `phase4_lms_schema`)
- [x] RLS policies for course tables (15 policies; all `auth.uid()` wrapped; zero `auth_rls_initplan` findings)
- [x] `/courses` catalog page with cover/title/description/progress cards (admin sees unpublished with badge)
- [x] `/courses/:slug` course overview — accordion module list, per-module progress, "Continue / Start / Review" CTA resolving to first incomplete lesson
- [x] `/courses/:slug/:lessonId` lesson viewer — DOMPurify-sanitized `content_html` (iframes/images allowed), Mark Complete, prev/next across module boundaries, sticky module sidebar
- [x] Progress tracking per member via `lesson_progress` upsert; aggregates computed at read time (no materialized columns)
- [x] Admin CRUD via Modal primitive: Course (title/desc/slug/cover/access_level/published), Module (title/desc), Lesson metadata (title/estimated_minutes). Lesson content remains SQL-authored.
- [x] Reorder via up/down arrows (`OrderControls`) — no drag-and-drop
- [x] Dashboard `MyLearningCard` (most-recent-active or first-published) + Navbar Courses link + dashboard quick-link
- [x] CSS: `content_html` typography, 16:9 responsive YouTube iframe, celebrate animation on complete, responsive 960/640 breakpoints
- [x] Seeded test course "Foundations of Ancestral Living" with lesson exercising h2/h3, strong/em, list, image, YouTube iframe, blockquote
- [x] RLS smoke test passed: non-admin sees only published, non-admin cannot INSERT courses, non-admin cannot INSERT progress for another user; admin sees drafts
- [x] Bumped to v0.4.0, committed (d9628f3), pushed, Cloudflare deploy verified

### Phase 5: Messaging, Badges & Polish 🟡 (IN PROGRESS — 5A schema drafted)

**Phase 5A — Enhanced Profiles + Badges + Interest Tags** (schema drafted session 12)
- [x] Draft schema: `profiles` +6 cols (`dietary_approach`, `journey_duration`, `state`, `city`, `about_me`, `my_why`), `badges`, `member_badges`, `tags`, `member_tags` → `Project Reference/PHASE5A_SCHEMA_DRAFT.sql`
- [x] New enums: `dietary_approach_type` (6 values), `journey_duration_type` (5 values), `badge_type` (5 values)
- [x] Draft RLS: catalog tables (badges/tags) admin-write + authenticated-read; `member_badges` admin-only award (no member self-service); `member_tags` member-self + admin; no UPDATE/DELETE policy on `member_badges` beyond admin delete (history immutable)
- [x] Seed 5 badge catalog rows + 8 starter interest tags (idempotent)
- [x] Rance reviews draft → approved as-is
- [x] Applied migration `phase5a_profiles_badges_tags` (session 13, 2026-04-18)
- [x] Ran security + performance advisors. Security: only pre-existing `auth_leaked_password_protection` WARN. Performance: two new `unindexed_foreign_keys` INFOs on `member_badges.awarded_by` and `tags.created_by` → remediated with follow-on migration `phase5a_cover_fk_indexes`. Zero `auth_rls_initplan` findings (confirms `(select auth.uid())` wrapping). Remaining `unused_index` INFOs all expected on fresh indexes.
- [x] Frontend shipped (v0.5.0, session 14): profile edit form with 6 new fields + interest-tag chip row; public profile view (dietary pill, journey, location, about, my-why, badge showcase, interest chips); admin badge-award modal (coach_spotlight manual; tenure + course_complete auto-award stubs reserved); admin tag management page at `/admin/tags`; dietary + badges rendered inline on forum posts, replies, event attendees, and dashboard welcome header.

**Phase 5B-1 — Directory + Admin Tags + Member Management** (schema applied session 15)
- [x] Draft schema: `member_status` enum + `profiles.status` column; `admin_tags` + `member_admin_tags` tables (admin-only RLS); RESTRICTIVE write-gate policies on six member-writable tables (`forum_posts`, `forum_replies`, `forum_reactions`, `event_rsvps`, `lesson_progress`, `member_tags`); helper functions `is_active_or_admin()`, `set_member_status()`, `delete_member()`; 6 seed admin tags → `Project Reference/PHASE5B1_SCHEMA_DRAFT.sql`
- [x] Applied migration `phase5b1_directory_admin_tags_member_mgmt` (session 15, 2026-04-18)
- [x] Ran security + performance advisors. Security: only pre-existing `auth_leaked_password_protection` WARN. Performance: zero `auth_rls_initplan`, zero `unindexed_foreign_keys` (draft ships FK indexes for `admin_tags.created_by`, `member_admin_tags.assigned_by`, `member_admin_tags.tag_id`). Remaining `unused_index` INFOs expected on fresh indexes.
- [x] Frontend: `/members` directory page with search + filters (dietary, journey, state, interest tags) — session 16
- [x] Frontend: admin-only views — admin tag chips on directory cards, admin tag filter, status filter, admin tag assignment UI — session 16
- [x] Frontend: suspend / ban / delete member actions in admin management view — session 16 (`ManageMemberModal` → `set_member_status` / `delete_member` RPCs; delete requires typed name confirmation)
- [x] Frontend: status indicator for admins, suspended/banned UX (sticky banner + write-gate disables on composers/RSVP/lesson/profile edit) — session 16
- [x] Frontend: AuthContext sign-out-if-banned check (defense-in-depth; Supabase Auth ban is later hardening) — session 16 (`isSuspended` flag + banned → signOut + `/login?banned=1`)
- [x] `/admin` hub index page linking `/admin/tags`, `/admin/admin-tags`, `/members`, `/forums/admin-hq` — session 16

**Phase 5B-2 — Notifications, Admin Broadcasts, Scheduled Posts** (schema applied session 17)
- [x] Draft schema: `notification_type` enum (7 values), `notifications` table (9 columns, RLS enabled), 3 indexes on notifications, 4 permissive + 1 restrictive RLS policies on notifications; `forum_posts` +`is_broadcast` + `scheduled_at` columns; 2 partial indexes on forum_posts; `broadcast_notification()` + `mark_all_notifications_read()` SECURITY DEFINER functions → `Project Reference/PHASE5B2_SCHEMA_DRAFT.sql`
- [x] Applied migration `phase5b2_notifications_broadcasts_scheduled` (session 17, 2026-04-18)
- [x] Ran security + performance advisors. Security: only pre-existing `auth_leaked_password_protection` WARN. Performance: zero `auth_rls_initplan`, zero `unindexed_foreign_keys` (actor_id FK cover index included in draft). Remaining `unused_index` INFOs all expected on fresh indexes.
- [x] Frontend: navbar bell icon + unread count badge + notification dropdown — session 18 (`NotificationBell` mounted in `Navbar`, 60s `setInterval` poll on the partial unread index, click-outside + Escape dismiss, per-type icon glyphs from `notificationHelpers.NOTIFICATION_ICONS`, mark-all-read via `mark_all_notifications_read()` RPC, individual mark-read on click via UPDATE)
- [x] Frontend: post composer admin broadcast toggle + scheduled datetime picker — session 18 (admin-only block under post body; broadcast toggle calls `broadcast_notification()` RPC after insert and surfaces "Broadcast sent to {n} members" inline; schedule toggle reveals `datetime-local` input that defaults to +1h and converts to ISO via `eventHelpers.localInputToIso`; "Last broadcast: {relative}" indicator queries the most recent `is_broadcast=true` row on expand)
- [x] Frontend: feed query update — non-admin SpaceView appends `.or('scheduled_at.is.null,scheduled_at.lte.{now}')` on both `loadPage` and `refresh`; admins skip the filter — session 18
- [x] Frontend: admin scheduled post indicator on feed cards — session 18 (`scheduled-indicator` pill with clock + locale timestamp; `broadcast-indicator` pill with megaphone for `is_broadcast` posts; future-scheduled check uses `useState(() => Date.now())` + `useMemo` to keep render pure under `react-hooks/purity`)
- [x] Application-level notification inserts — session 18 (`src/lib/notificationHelpers.js`: `notifyReplyToPost`, `notifyReplyToComment`, `notifyReaction`, `notifyBadgeAwarded`, `notifyStatusChange`, `notifyNewEvent`. Wired into ReplySection (top-level + nested replies), EmojiReactionBar via PostCard / ReplySection, AwardBadgeModal, ManageMemberModal (suspend / reinstate only — skips ban + delete), EventFormModal (create only). Helpers are fire-and-forget, skip self-notifications, swallow errors)
- [x] `broadcast_notification()` schema follow-on: extended signature with `p_type notification_type DEFAULT 'admin_broadcast'` so the same SECURITY DEFINER fan-out handles `admin_broadcast` AND `new_event`. Old 4-arg overload dropped to avoid PostgREST ambiguity — session 18
- [x] Version bump to v0.7.0 on deploy — session 18

**Phase 5B-3 — Polish / Accessibility / Dark Mode / Background Images** (deployed session 19, v0.8.0)
- [x] Schema: `profiles.theme_preference` column with check constraint (`'light' | 'dark' | 'system'`, default `'system'`) — session 19
- [x] CSS custom-property theme system in `variables.css` — light root + dark `[data-theme="dark"]` block + `@media (prefers-color-scheme: dark)` fallback — session 19
- [x] Convert all 10 stylesheets to semantic tokens (base, layout, components, forums, events, courses, profiles, members, notifications) — session 19
- [x] Castle background images (light + dark webp) on body + overlay on `.app-shell`, mobile `background-attachment: scroll` perf override — session 19
- [x] Inline theme-flash prevention script in `index.html` reading `localStorage.kk-theme` — session 19
- [x] `ThemeToggle` navbar component cycling system → light → dark with sun/moon/monitor glyph — session 19
- [x] `AuthContext.setTheme(theme)` persisting to `profiles.theme_preference` + localStorage + `theme_preference` added to `updateProfile` allow-list — session 19
- [x] Skip-to-main-content link in `Layout` — session 19
- [x] Shared `Modal` focus trap + `aria-labelledby` — session 19
- [x] `usePageTitle(title)` hook on all 19 pages — session 19
- [x] `ScrollToTop` on route change — session 19
- [x] Toast system (`ToastProvider` + `useToast`) with sr-only + live-region support — session 19
- [x] Shared `LoadingSpinner` / `ErrorState` / `EmptyState` components — session 19
- [x] Castle-themed `NotFound` page — session 19
- [x] Version bump to v0.8.0 on deploy — session 19

**Phase 5B-3 patch — Dark Mode Stone Palette** (deployed session 20, v0.8.1)
- [x] Replaced all purple/blue-undertone dark surface colors with warm charcoal/stone equivalents in `src/styles/variables.css` — session 20 (both `[data-theme="dark"]` and `@media prefers-color-scheme: dark` blocks updated identically)
- [x] Q&A event type tint shifted from purple (`#2f2440` bg) to cool blue-grey stone (`#262a2e`) — session 20
- [x] Version bump to v0.8.1 on deploy — session 20

**Phase 5C — Owner Role + Sidebar Navigation** (deployed session 22, v0.9.0)
- [x] Added `owner` value to `app_role` enum — session 22 (via `ALTER TYPE ... ADD VALUE`; requires non-transactional execute since enum DDL can't run inside a transaction block)
- [x] Created `is_owner()` SECURITY DEFINER helper + updated `is_admin(uuid)` to treat owner as admin superset — session 22 (preserves existing `protect_role_change` trigger call site; avoids breaking change)
- [x] Created `set_member_role(target_id uuid, new_role app_role)` SECURITY DEFINER RPC with guards (owner-only caller; can't change self; can't demote last owner; blocks owner → non-admin directly) — session 22
- [x] Promoted `rance@fsh-coach.com` to owner via trigger-disable bootstrap — session 22 (note: handoff specified `rancepants@gmail.com` but actual admin in DB is `rance@fsh-coach.com`)
- [x] AuthContext exposes `isOwner` + extended `isAdmin` (owner || admin) — session 22
- [x] Profile page owner role management modal (RoleChangeModal) — session 22 (promote admin → owner, demote owner → admin, promote/demote member ↔ admin; blocks owner-on-owner)
- [x] MemberCard admin menu hidden for owner targets — session 22
- [x] Sidebar navigation replaces top navbar — session 22. New components: `Sidebar.jsx` + `SidebarMobileHeader.jsx` + `SidebarNavLink.jsx` + `SidebarSection.jsx`. Desktop: fixed 260px left panel with warm stone gradient background + amber torchlight glow radial + 3px amber active-state left accent bar. Mobile: slide-in drawer via transform translateX, sticky top header with hamburger + brand + notification bell.
- [x] Layout.jsx rewritten with conditional rendering — session 22. `PRE_AUTH_PATHS = {'/','/login','/signup','/reset-password','/update-password'}`; sidebar only renders when `session && !PRE_AUTH_PATHS.has(pathname)`. Pre-auth routes use `.app-shell`, authed routes use `.app-layout` (Sidebar + app-main-wrap).
- [x] Castle background images preserved on body (not sidebar) — session 22
- [x] Theme toggle + notification bell + signout relocated to sidebar footer — session 22
- [x] Logo files copied to `public/tkk-logo-transparent.png` + `public/tkk-logo-with-bg.png` — session 22
- [x] Deleted `Navbar.jsx` + `AdminDropdown.jsx` — session 22
- [x] All admin-gated pages/components updated to use `isAdmin` from AuthContext (owner treated as admin everywhere) — session 22. Files: Dashboard, MembersDirectory, SpaceView, AdminHub, EventsHome, EventDetail, CoursesHome, CourseDetail, LessonView, AdminAdminTags, AdminTags, PostComposer, PostCard, ReplyItem, MemberCard.
- [x] Lint + build clean (0 problems; 340ms build) — session 22
- [x] Version bump to v0.9.0 — session 22

**Phase 5D — Referrals + Legal + Account Deletion** (deployed session 22, v0.10.0)
- [x] Schema: `referral_codes` table (code, created_by, max_uses, expires_at) + `referrals` table (referrer_id, referred_id, referral_code_id, joined_at) — session 22
- [x] RLS: referral_codes admin-write + authenticated-read; referrals admin-only — session 22
- [x] `?ref=` query param capture on signup flow + referral_code validation + referral row insert — session 22
- [x] Referral code format: TKK-prefixed 8-char alphanumeric — session 22
- [x] `/invite` page for admins to generate and manage referral codes — session 22
- [x] Self-service account deletion via `delete_own_account()` RPC with typed "DELETE" confirmation — session 22
- [x] Profiles + `terms_accepted` timestamp column + `deleted_at` soft-delete column — session 22
- [x] Legal pages: Terms of Use (`/terms`), Privacy Policy (`/privacy`), Health Disclaimer (`/disclaimer`) — session 22
- [x] Footer legal links + signup terms checkbox — session 22
- [x] Contact email: `rance.fullspectrumhuman@gmail.com` in legal docs — session 22
- [x] Version bump to v0.10.0 — session 22

**Phase 5E — Login Streaks + Profile Frames** (deployed session 22, v0.11.0)
- [x] Schema: profiles + `current_streak`, `longest_streak`, `last_login_date`, `streak_frozen_until`, `selected_frame` columns — session 22
- [x] Schema: `frame_catalog` table with frame_type, name, description, unlock_method, streak_days_required — session 22
- [x] Streak logic: daily tracking with 1-day grace period, longest_streak never decreases — session 22
- [x] 7-tier milestone badges (inline SVG): bronze/silver/gold torch → bronze/silver/gold shield → crown — session 22
- [x] Vacation freeze mode: up to 30 days, streak frozen but not lost — session 22
- [x] VacationModeSection on profile edit page — session 22
- [x] 9 frame types: 3 free (Stone, Iron Band, Wooden) + 6 streak-earned + 1 admin-only (Coach’s Seal) — session 22
- [x] FrameSelector on profile edit page + ProfileFrame shared component — session 22
- [x] StreakBadge inline on sidebar user block, dashboard, forum posts, member cards — session 22
- [x] Streak progress bar toward next milestone on profile page — session 22
- [x] Version bump to v0.11.0 — session 22

**Phase 5E patch — PNG Frames + Square Avatars + Frame Picker Modal** (deployed session 22→23, v0.11.1)
- [x] Replaced inline SVG profile frames with 9 Gemini-generated PNG image frames — session 22/23
- [x] Changed avatars from round to square (6px border-radius) — session 22/23
- [x] Moved frame picker from profile edit page bottom to avatar-click modal with live preview (FramePickerModal) — session 22/23
- [x] Processed all frame PNGs to transparent backgrounds + transparent centers — session 22
- [x] Version bump to v0.11.1 — session 22/23

**Phase 5E patch — Modal Centering + Frame Backing** (deployed session 23, v0.11.2)
- [x] `.modal-backdrop` offset by `left: var(--sidebar-width, 260px)` so modals center in content area, not full viewport — session 23
- [x] Mobile override (`≤768px`) resets `left: 0` when sidebar is a drawer — session 23
- [x] Black backing `<span>` with `clip-path: polygon(evenodd, ...)` behind frame PNG overlays — prevents castle wallpaper bleed through semi-transparent frame pixels — session 23
- [x] Version bump to v0.11.2 — session 23

**Phase 5E patch — Frame Mask-Image Backing + Deduplicate None** (deployed session 23, v0.11.3)
- [x] Replaced clip-path polygon backing with `mask-image` using the frame PNG itself — frame’s alpha channel shapes the black backing exactly, no rectangles beyond artwork edges — session 23
- [x] Filtered `frame_type === 'none'` from catalog in FramePickerModal + FrameSelector — hardcoded None button is the single no-frame option — session 23
- [x] Version bump to v0.11.3 — session 23

**Phase 5E patch — Drop-Shadow Backing** (deployed session 23, v0.11.4)
- [x] Replaced mask-image backing with CSS `drop-shadow(0 0 0 #000)` x3 on frame img — single element, zero alignment issues — session 23
- [x] Version bump to v0.11.4 — session 23

**Phase 5E patch — Frame Width Fix + Save/Vacation UX** (deployed session 23, v0.11.5)
- [x] Added `maxWidth: 'none'` to frame overlay img — fixes base.css `img { max-width: 100% }` squishing frames into portrait rectangles — session 23
- [x] Save profile now navigates to `/profile` view on success; button renamed "Save changes" — session 23
- [x] Vacation mode refactored from edit-page section to modal triggered from streak area (`VacationModeModal.jsx`); old `VacationModeSection.jsx` deleted — session 23
- [x] Version bump to v0.11.5 — session 23

**Phase 5E patch — Frame Scale + Charcoal Backing + Spacing** (deployed session 23, v0.11.6)
- [x] `FRAME_SCALE` 1.30→1.50, `FRAME_OFFSET_RATIO` 0.15→0.25 — frame center hole now clears avatar, full profile picture visible — session 23
- [x] Replaced drop-shadow with charcoal (`#2a2a2a`) mask-image backing span + `maxWidth: 'none'` on both elements — session 23
- [x] Frame picker tile spacing: increased padding, gap, and grid spacing in `streaks-frames.css` — session 23
- [x] Profile avatar breathing room: `overflow: visible` on `.profile-panel`, extra padding on `.profile-top` — session 23
- [x] Version bump to v0.11.6 — session 23

**Phase 5E patch — Frame Backing Clip-Path + Profile Spacing** (deployed session 24, v0.11.7)
- [x] Replaced mask-image backing with clip-path evenodd polygon on a surface-color span — overshoot beyond frame edges invisible against panel background — session 24
- [x] `.profile-top .avatar-wrap { margin-right: var(--space-4) }` for frame-to-info gap — session 24
- [x] `padding-bottom: var(--space-4)` on `.profile-top`; `.profile-top + .profile-block { border-top: none }` removes double divider — session 24
- [x] Frame picker tile gap `10px → 14px`; bottom padding `--space-4 → --space-5` — session 24
- [x] Version bump to v0.11.7 — session 24

**Phase 5E patch — Charcoal Backing Stacked Mask + Frame Alignment** (deployed session 24, v0.11.8)
- [x] Frame backing: `#2a2a2a` + evenodd clip-path + 5× stacked `mask-image` with `maskComposite: add` to clip outer boundary to frame pixels only — session 24
- [x] `.profile-top .profile-frame:not(.profile-frame-none) { margin-top: 35px }` — frame top aligns with name — session 24
- [x] Version bump to v0.11.8 — session 24

**Phase 5E patch — Simple Charcoal Backing + Frame Picker Spacing** (deployed session 24, v0.11.9)
- [x] Removed all mask properties; backing is just `#2a2a2a` + evenodd clip-path — simpler is better — session 24
- [x] Large frame picker preview: `margin-bottom: 30px` on `.frame-picker-preview .profile-frame` — session 24
- [x] Frame tile gap `14px → 4px`; `.frame-option-preview { margin-bottom: 18px }` for frame overshoot clearance — session 24
- [x] Version bump to v0.11.9 — session 24

**Phase 5E patch — Custom Frame PNGs + ProfileFrame Simplification** (deployed session 24, v0.11.10)
- [x] Replaced all 9 Gemini-generated frame PNGs with custom hand-crafted versions from `Frames\` — charcoal backing baked directly into the PNG, no CSS hacks needed — session 24
- [x] Removed all backing spans, clip-paths, masks, z-indexes from ProfileFrame.jsx — component is now two layers: avatar + frame overlay — session 24
- [x] Version bump to v0.11.10 — session 24

**Phase 5F — Landing Page Polish + Reply Count Bugfix** (deployed session 25, v0.12.0)
- [x] Rewrote `src/pages/Landing.jsx` — full public landing page with 6 sections — session 25
- [x] Created `src/styles/landing.css` — full responsive design system for landing page — session 25
- [x] Hero: castle background + dark overlay + logo + eyebrow + title + tagline + dual CTA — session 25
- [x] Slogan bar: amber accent "Keep Calm and Paleo / Keto / Carnivore On" — session 25
- [x] 5 value propositions in 2×2+1 CSS grid with inline SVG icons — session 25
- [x] Meet the Team: Justine Roberts first (coach preference), then Rance Edwards — full bios from content reference — session 25
- [x] FAQ: 7-item accordion with useState expand/collapse, aria-expanded — session 25
- [x] Final CTA: dark castle-tone section, signup + login links — session 25
- [x] Fixed forum reply count "0" flash in SpaceView.jsx — hydrateMeta before setPosts/setLoading — session 25
- [x] Added `@import './landing.css'` to `src/styles/index.css` — session 25
- [x] Version bump to v0.12.0 — session 25

**Phase 5F patch — Five UI Polish Fixes** (session 25c, v0.12.1)
- [x] CSS-only fixes across 4 stylesheets — session 25c
- [x] FIX 1: Notification dropdown (mobile) — changed from `right: auto; left: 0;` to `right: 0; width: calc(100vw - 16px);` in `src/styles/notifications.css` — keeps dropdown visible, not clipped on mobile
- [x] FIX 2: Hamburger centering (mobile) — added `display: inline-flex; align-items: center; justify-content: center;` to `.sidebar-mobile-burger` in `src/styles/sidebar.css`
- [x] FIX 3: Footer mobile stacking — added mobile override with `flex-direction: column; gap: var(--space-2);` and smaller padding to `.app-main-footer` + `.app-footer` in `src/styles/layout.css`
- [x] FIX 4: Footer trademark centering — added base rule `.footer-trademark` with `display: block; text-align: center;` in `src/styles/layout.css`
- [x] FIX 5: Hero logo size — increased `.landing-logo` from 80px to 160px on desktop, with 100px mobile override in `src/styles/landing.css`
- [x] Verified at 375px (mobile) and 1280px (desktop) viewports — all fixes confirmed applied and working
- [x] Committed: `a3a5d16` — "fix: five UI polish fixes — mobile layout + hero logo + footer alignment"
- [x] Pushed to remote
- [x] Version remains v0.12.1 (CSS-only polish on existing build)

**Phase 5B — Pre-launch Cleanup** (deployed session 21, v0.8.2)
- [x] Replaced all 9 `window.confirm` / `window.alert` instances with `Modal variant="danger"` — session 21. Files changed: `AdminTags.jsx`, `AdminAdminTags.jsx`, `PostCard.jsx`, `ReplyItem.jsx`, `EventFormModal.jsx`, `CourseFormModal.jsx`, `ModuleFormModal.jsx`, `LessonFormModal.jsx`, `AwardBadgeModal.jsx`
- [x] Supabase security + performance advisor audit — session 21. Security: only pre-existing `auth_leaked_password_protection` WARN (Pro Plan feature; accepted). Performance: 21 expected `unused_index` INFO (FK cover indexes + query indexes on low-volume fresh DB); zero `auth_rls_initplan`; zero `unindexed_foreign_keys`. No remediation needed.
- [x] Final RLS policy review — session 21. 81 policies; all 18 public tables have RLS enabled; all policies use `(select auth.uid())` wrapped form; 14 RESTRICTIVE write-gate policies covering all 7 member-writable tables.
- [x] Version bump to v0.8.2 — session 21

**Phase 5G — Rich Text Editor + Dark Mode Fixes + Member Card Layout** (deployed session 26, v0.13.0)
- [x] Dark mode fix: forum post edit textarea (PostCard.jsx) — added `.post-edit-field` CSS class + dark-mode rule in forums.css using `var(--color-surface)` / `var(--color-ink)` — session 26
- [x] Dark mode fix: reply edit textarea (ReplyItem.jsx) — same `.post-edit-field` class approach — session 26
- [x] Dark mode fix: members search input + filter dropdowns (MemberFilters.jsx) — added dark-mode-aware CSS for `.member-filter-field input, .member-filter-field select` in members.css — session 26
- [x] Installed Tiptap (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/pm`) + `emoji-picker-react` — session 26
- [x] Created `src/components/ui/RichTextEditor.jsx` — Tiptap editor with bold/italic/bullet/ordered/link/emoji toolbar; `content` + `onChange(html)` + `placeholder` + `slim` props — session 26
- [x] Created `src/styles/rich-editor.css` — toolbar, active button states, emoji picker panel, rendered content classes (`.post-rich-body`, `.reply-rich-body`), dark mode via CSS variables — session 26
- [x] PostComposer: replaced plain textarea with `<RichTextEditor>`; HTML body stored in Supabase; broadcast notification uses stripped body text — session 26
- [x] ReplyComposer: replaced plain textarea with `<RichTextEditor slim>`; slim toolbar (bold/italic/link/emoji, no lists) — session 26
- [x] PostCard: edit mode uses `<RichTextEditor>` with existing HTML pre-loaded; feed renders `post.body` as DOMPurify-sanitized HTML (`.post-rich-body`) — session 26
- [x] ReplyItem: edit mode uses `<RichTextEditor slim>` with existing HTML pre-loaded; feed renders `reply.body` as DOMPurify-sanitized HTML (`.reply-rich-body`) — session 26
- [x] Security: DOMPurify with `ALLOWED_TAGS: ['b','i','strong','em','a','ul','ol','li','p','br']` in both PostCard + ReplyItem — session 26
- [x] Members directory: single-column horizontal card layout (1 card per row); avatar/frame left, all text content right via `.member-card-avatar-col` + `.member-card-content` — session 26
- [x] Frame alignment on member cards: `.member-card-avatar-col-framed { margin-top: 16px }` shifts frame down so visual frame top aligns with member name text (FRAME_OFFSET_RATIO=0.25, size=64 → 16px overflow) — session 26
- [x] Mobile: `@media (max-width: 480px)` stacks member card to column, resets frame margin — session 26
- [x] Version bump to v0.13.0 — session 26

**Phase 5G — Polish Pass** (deployed session 26b, v0.13.1)
- [x] Link button UX: Tiptap `autolink: true` so typed/pasted URLs auto-link on space/enter — session 26b
- [x] Link button popup: replaced `window.prompt` with inline `<LinkPopup>` component — URL input + Apply + Remove; Escape/outside-click closes; pre-fills href when editing existing link — session 26b
- [x] Emoji picker overflow: changed `.rte-wrap` from `overflow: hidden` to `overflow: visible`; moved `overflow: hidden` to `.rte-editor-wrap` to preserve border-radius clipping — session 26b
- [x] Emoji picker fixed positioning: `.rte-emoji-panel-fixed { position: fixed }` with coordinates from `getBoundingClientRect()` so panel escapes all parent overflow clips — session 26b
- [x] Emoji picker dark mode: `getTheme()` reads `document.documentElement.getAttribute('data-theme')` and passes `theme="dark"|"light"` to `<EmojiPicker>` — session 26b
- [x] Member card gap: increased `.member-card-link` gap from `var(--space-4)` to `var(--space-5)` — session 26b
- [x] Member card top row: name + dietary tag + streak now share one inline flex row (`.member-card-top-row`); journey + location in a separate `.member-card-sub-row` below — session 26b
- [x] Reaction count dark mode: added `color: var(--color-ink)` to `.reaction-chip` base rule in forums.css — session 26b
- [x] Notification bell moved to floating desktop position: removed from `Sidebar.jsx` footer; added as `<div class="notif-bell-float"><NotificationBell /></div>` in `Layout.jsx` inside `.app-main-wrap`; `position: fixed; top: 16px; right: 24px; z-index: 40`; hidden at ≤768px (mobile header bell covers that breakpoint) — session 26b
- [x] Version bump to v0.13.1 — session 26b

**Phase 5G — Bug Fixes** (deployed session 27, v0.13.2)
- [x] Admin dropdown menu clipping: removed `overflow: hidden` from `.member-card` — bio clamp handles its own overflow; card border-radius unaffected — session 27
- [x] Frame-to-text spacing (profile mobile): added `margin-bottom: 24px` to `.profile-top .profile-frame:not(.profile-frame-none)` in mobile media query so frame bottom has breathing room before name text — session 27
- [x] Frame-to-text spacing (member cards desktop): added `margin-bottom: 8px` to `.member-card-avatar-col-framed` — session 27
- [x] Frame-to-text spacing (member cards mobile): added `margin-bottom: 12px` to `.member-card-avatar-col-framed` in mobile override — session 27
- [x] Member card content density: added `about_me` excerpt below bio (3-line clamp, only shown if `profile.about_me` exists and differs from `profile.bio`); added `.member-card-about` CSS — session 27
- [x] Member card interest tags: increased display limit from 4 to 8 (`interestTags.slice(0, 8)`) — session 27
- [x] Version bump to v0.13.2 — session 27

**Phase 5H polish — Sage Icon + Interests Layout + Collapsible Honors + Backfill** (deployed session 29, v0.14.1)
- [x] `badgeTypeSlug()` in `profileHelpers.js`: added `SLUG_OVERRIDES = { course_complete: 'sage' }` so HonorIcon resolves to `honor-sage.png` instead of broken `honor-course-complete.png` — session 29
- [x] Profile view: moved interests/tags section above Hall of Honors so it doesn't get buried — session 29
- [x] Hall of Honors: each category collapsed by default; chevron rotates on expand; header shows "Category (X of Y earned)" when collapsed — session 29
- [x] Backfill ran via Supabase MCP: town_crier(1), scribe(2), herald(1), standard_bearer(1) awarded to existing members from historical data (idempotent ON CONFLICT DO NOTHING) — session 29
- [x] Version bump to v0.14.1 — session 29

**Phase 5I — Richer Notifications + Dashboard Cards + Honor Lightbox** (deployed session 30, v0.15.0)
- [x] `notificationHelpers.js`: added optional `actorName` and `spaceName` params to `notifyReplyToPost`, `notifyReplyToComment`, `notifyReaction`, `notifyBadgeAwarded` — session 30. Personal titles ("Rance replied to…") with graceful fallback to generic titles when params absent.
- [x] Call sites updated: `ReplySection.jsx` (spaceName prop + profile from useAuth), `PostCard.jsx` (spaceName prop + profile from useAuth), `SpaceView.jsx` (passes spaceName={space.name}), `AwardBadgeModal.jsx` (passes profile.display_name) — session 30.
- [x] Dashboard: removed Quick Links section; replaced with `dashboard-cards-row` grid containing `RecentActivityCard` + `HonorsProgressCard` — session 30.
- [x] `RecentActivityCard`: fetches 5 most recent non-admin-hq forum posts with space join + author profiles; linked rows with space pill + relative time; "View all →" footer — session 30.
- [x] `HonorsProgressCard`: fetches badges catalog + member_badges; shows "X of Y" + ProgressBar + 3 most recently earned honors at 32px; "View all →" footer — session 30.
- [x] Dashboard grid CSS: 2-column on desktop, 1-column on mobile (≤768px); plus activity/honors/footer utility classes — session 30.
- [x] HallOfHonors (Profile.jsx): each honor item now clickable; lightbox Modal shows HonorIcon at 192px + name + description + "Earned on {date}" or locked criteria — session 30.
- [x] Honor item hover state + `cursor: pointer`; lightbox CSS classes added to `profiles.css` — session 30.
- [x] Version bump to v0.15.0 — session 30.

**Phase 5B — later waves**
- [ ] Member-to-member messaging (approach TBD — in-app DMs vs. email) — deferred post-launch
- [x] Replace `window.confirm` / `window.alert` usage with Toast + Modal primitives — session 21 (9 instances across 8 files)
- [x] Supabase security + performance advisor audit (both types, run separately) — session 21 (clean: only pre-existing auth_leaked_password_protection WARN; 21 expected unused_index INFO; zero auth_rls_initplan; zero unindexed_foreign_keys)
- [x] Final RLS policy review across all tables — session 21 (81 policies; all 18 tables RLS enabled; all policies use wrapped auth.uid(); all 7 member-writable tables have RESTRICTIVE write-gate)
- [ ] Notification preferences (opt-out per type) — deferred post-launch

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
| 2026-04-18 | Phase 3: event type badges use subtle palette differentiation (not saturated colors) | Community bulletin board vibe, not corporate calendar. Each type gets a tinted background + matching border + readable text — live_call=amber, workshop=green, coaching_circle=terracotta, q_and_a=plum, other=sand. |
| 2026-04-18 | Phase 3: admin event CRUD uses a modal (new primitive) — not inline composer like forums | Forms for events have more fields (title, description, type, status, 2 datetimes, zoom, youtube) than forum posts. Modal keeps the `/events` page clean and reuses for both create and edit. First time we've introduced a modal primitive — `Modal.jsx` under `components/events/` for now; promote to shared if another feature needs it. |
| 2026-04-18 | Phase 3: YouTube embed is IntersectionObserver-gated (200px rootMargin) | Past sessions grid can render many iframes. Lazy-loading avoids hammering the browser on scroll and respects data. Fallback path (`IntersectionObserver` undefined) also passes the `react-hooks/set-state-in-effect` lint rule by deferring via `setTimeout(0)`. |
| 2026-04-18 | Phase 3: data-loading effects defer with `await Promise.resolve()` before any setState | Matches SpaceView / ForumHome pattern. Satisfies `react-hooks/set-state-in-effect` (no synchronous setState inside an effect body) and `react-hooks/preserve-manual-memoization` when `useCallback` deps use full objects (`user`) rather than narrower properties (`user?.id`) the compiler inferred. |
| 2026-04-18 | Phase 4: lesson content stored as pre-authored HTML in `lessons.content_html` | No rich-text editor in Phase 4 UI. Content pushed via seed data / SQL by admins. Embedded video = `<iframe>` inside content_html. Keeps surface area small; a proper editor can land in Phase 5+ with no schema change. |
| 2026-04-18 | Phase 4: binary per-lesson progress, aggregates computed at query time | No percent-watched, no time-on-page, no materialized course/module progress columns. Avoids write amplification and stale-state bugs when lessons are added/removed. Count(completed) / count(*) at read time. |
| 2026-04-18 | Phase 4: visibility gated at course level only — no `published` on modules/lessons | Courses are pushed complete. Modules and lessons inherit parent-course visibility via RLS `EXISTS` subquery. Simpler policies; admins push "the whole thing" per cadence. |
| 2026-04-18 | Phase 4: `course_access_level` enum (`free`, `premium`) stored but not enforced in RLS | Structural groundwork for future paid/coaching tiers. Premium gating deferred to Phase 5+ when a payments/entitlement model exists. Phase 4 treats all published courses as viewable by any authenticated member. |
| 2026-04-18 | Phase 4: `lesson_progress` has no DELETE policy | Progress rows are not user-deletable. ON DELETE CASCADE on both FKs (user_id, lesson_id) handles cleanup when a user or lesson is removed. Keeps progress history immutable-by-default. |
| 2026-04-18 | Phase 4 frontend: lesson `content_html` sanitized with DOMPurify (iframes allowed) | Admin-authored HTML needs to support YouTube embeds + images. DOMPurify defaults strip `<iframe>`; `ADD_TAGS: ['iframe']` + `ADD_ATTR` for `allow`/`allowfullscreen`/`frameborder`/`scrolling`/`referrerpolicy` keeps embeds functional. Sanitization is a defense-in-depth habit even though content is admin-only. |
| 2026-04-18 | Phase 4 frontend: no rich-text lesson editor — metadata-only modal | Phase 4 ships faster without a WYSIWYG. Admins push `content_html` directly via SQL. Metadata modal (title + estimated_minutes + display_order) covers the ergonomic 90% case. A WYSIWYG can land later without schema changes. |
| 2026-04-18 | Phase 4 frontend: up/down arrow reordering, not drag-and-drop | `OrderControls` component swaps `display_order` between adjacent rows via parallel UPDATE. No DnD library dependency; same keyboard/tap story on mobile as on desktop. Acceptable for the expected module/lesson counts (tens, not hundreds). |
| 2026-04-18 | Phase 4 frontend: "Continue where I left off" resolves at read time | Scan modules → lessons ordered by `display_order`, find first row not present in `lesson_progress` for the user. If all complete → "Review Course" + link to first lesson. If none started → "Start Course" + link to first lesson. No resume-cursor column; the progress set is the source of truth. |
| 2026-04-18 | Phase 4 frontend: accordion module list with one-time auto-expand of first incomplete module | Book-style table of contents feel. Auto-expand is gated by a single `expandedInitialized` flag inside `load()` so re-fetches after admin edits don't clobber the user's manual toggles (also satisfies `react-hooks/set-state-in-effect`). |
| 2026-04-18 | Phase 4 frontend: lesson viewer uses a 720px reading column + sticky module sidebar | Optimizes for long-form reading comfort (line length ≈ 65 characters). Sidebar stacks below main at 960px, hides entirely at 640px. Breadcrumbs sit above title so the learner always knows where they are in the course. |
| 2026-04-19 | Owner role via enum value (not boolean column) | `owner` added to `app_role` enum. `is_owner()` + `is_admin()` treats owner as admin superset. Enum approach avoids schema migration for future role tiers. |
| 2026-04-19 | Sidebar navigation replaces top navbar | Option C — immersive castle interior feel. Fixed 260px left panel on desktop, slide-in drawer on mobile (≤768px). Warm stone gradient + amber torchlight glow + 3px amber active-state accent. |
| 2026-04-19 | Referral codes: TKK-prefixed 8-char alphanumeric | Human-readable prefix identifies source. Short enough to text/email. Admin-generated, not self-service. |
| 2026-04-19 | Streak grace period: 1 day (yesterday OR day-before = continue) | Prevents losing long streaks due to timezone edge cases or single missed days. Generous enough for real life, strict enough to mean something. |
| 2026-04-19 | Vacation freeze: max 30 days, streak frozen but not lost | Longest streak never decreases → frame unlocks are permanent. Respects members’ real lives (travel, illness) without gaming potential. |
| 2026-04-19 | Profile frames: square avatars with Gemini-generated PNG overlays | Square (6px border-radius) gives more frame real estate than circles. PNG overlays scale cleanly at any size. 130% scale with -15% offset lets decorative border extend beyond avatar. |
| 2026-04-19 | Frame picker: avatar-click modal (not inline on profile edit page) | Keeps profile edit page clean. Modal provides focused selection experience with live preview at 120px. |
| 2026-04-19 | 3 free frames + 6 streak-earned + 1 admin-only (Coach’s Seal) | Free frames ensure every member can customize. Streak-earned frames reward engagement. Admin-only frame is a coaching badge of honor. |
| 2026-04-19 | Legal pages as public routes without sidebar | Terms, Privacy, Health Disclaimer must be accessible pre-login and from footer links. No sidebar keeps them clean and accessible. |
| 2026-04-19 | Self-service account deletion with typed "DELETE" confirmation | GDPR-friendly, reduces admin burden. Typed confirmation prevents accidental deletion. Soft-delete via `deleted_at` preserves data for audit. |
| 2026-04-19 | Modal backdrop offset for sidebar-aware centering | `left: var(--sidebar-width, 260px)` on `.modal-backdrop` instead of `inset: 0`. All modals now center in the visible content area. Mobile (≤768px) resets to `left: 0`. |
| 2026-04-19 | Frame backing via mask-image (replaces clip-path polygon) | Uses the frame PNG itself as CSS `mask-image` on the black backing span. Frame’s own alpha channel controls exactly where backing appears — no manual inset math, adapts to every frame’s unique decorative shape. Replaced the v0.11.2 clip-path approach which created visible black rectangles beyond frame edges. |
| 2026-04-19 | Frame backing baked into PNG (definitive, replaces all CSS hacks) | Custom hand-crafted frame PNGs have charcoal backing baked directly into the image — transparent center hole over avatar, decorative border with opaque backing. ProfileFrame is now two layers only: avatar `<span>` + frame `<img>`. No CSS masks, clip-paths, z-index stacking, or backing spans anywhere. Frame artist controls exact backing shape; CSS has no say. |
| 2026-04-19 | Landing page sections use opaque background colors | Body carries the castle wallpaper via `--bg-image`. Landing page sections must cover it with opaque backgrounds (cream, surface-raised, dark) so they render legibly. Hero and final CTA always use hardcoded dark tones regardless of light/dark theme; content sections use CSS variable tokens that respond to theme. |
| 2026-04-19 | Landing page: coach cards ordered Justine first, then Rance | Rance’s explicit preference — respect for co-host. Order is hardcoded in the `COACHES` array in Landing.jsx. |
| 2026-04-19 | Landing page: inline SVG icons for value propositions (no emoji, no icon lib) | Avoids emoji rendering inconsistency across OS/browser, no third-party dependency, icons are thematic (shield, people, sun, play, chat). Sized 24×24 in a 48px amber-tinted circle. |
| 2026-04-19 | SpaceView: hydrateMeta awaited before setPosts/setLoading | Prevents "0 replies" flash on first render. Prior order (setPosts → setLoading → hydrateMeta) triggered a render before reply counts were available. Fix: await hydrateMeta first, re-check cancellation flag, then set posts and clear loading. Applied to both initial-load effect and loadMore. |
| 2026-04-18 | Phase 5A: split Phase 5 into waves; 5A = enhanced profiles + badges + interest tags | Phase 5 carries many loosely-related items (messaging, badges, tags, directory, notifications, polish). Shipping them as one wave would balloon scope. 5A is a cohesive "who is this person?" wave that unlocks profile display and later directory/search. Messaging and internal admin tags come in later 5B+ waves. |
| 2026-04-18 | Phase 5A: new profile fields stay on `profiles` table (no side table) | The six new fields (dietary_approach, journey_duration, state, city, about_me, my_why) are 1:1 with a member and always read alongside display_name/avatar/bio. Keeping them on `profiles` avoids an extra join on every profile render and reuses existing RLS policies unchanged. |
| 2026-04-18 | Phase 5A: dietary_approach and journey_duration as enums, not free text | Enables consistent directory filters later ("show me 'just starting' members"), keeps analytics sane, and prevents slug-like drift ("Keto" vs "keto" vs "ketogenic"). Nullable because disclosure is optional. Extensible via ALTER TYPE ADD VALUE. |
| 2026-04-18 | Phase 5A: state stored as 2-letter abbreviation, city as free text | State set is small and stable — dropdown on frontend, compact on-disk, trivially filterable. Cities are an effectively unbounded set — a catalog would be busywork with no payoff at this scale. |
| 2026-04-18 | Phase 5A: badges catalog keyed by `badge_type` enum + one-row-per-type | Enables future auto-award logic to branch on enum (e.g. tenure triggers) without string matching. Display metadata (name/description/icon) lives in the `badges` row so co-hosts can edit copy without a migration. `unique (badge_type)` enforces one-row-per-type. |
| 2026-04-18 | Phase 5A: `member_badges.awarded_by` nullable — null means auto-awarded | Supports future tenure-milestone triggers that have no human "awarder." When an admin awards manually, the column is populated so profile display can show "Awarded by Rance" if desired. FK `on delete set null` preserves award history if the awarder leaves. |
| 2026-04-18 | Phase 5A: no UPDATE policy on `member_badges` — revoke = delete, re-award = insert | Badges are conceptually held or not held. `awarded_at`/`awarded_by` are historical, not mutable. Simpler RLS surface; cleaner audit story. |
| 2026-04-18 | Phase 5A: interest tags are admin-curated, member-self-selected | Keeps the tag set clean (no "Keto!!!" / "keto" / "KETO" fragmentation) while letting members express their own secondary interests. Distinct from the future internal admin-only tag system, which will be a separate table with admin-only SELECT. |
| 2026-04-18 | Phase 5A frontend: `/profile/edit` route (not `/settings/profile`) + keep `/profile/:id` as viewer | Reuses the existing `Profile` component and isOwn detection, avoids a new top-level settings surface, and matches the "one-scrollable-page" brief. Route-driven editor switch uses `useLocation().pathname`, not a query param, so the URL is shareable and the back button works naturally. |
| 2026-04-18 | Phase 5A frontend: dietary approach rendered via `dietary-tag-{enum}` CSS class, not inline styles | Palette lives in `profiles.css`, one rule per approach. Component stays dumb; theme changes are one-file edits. Six muted earth-tone variants keep the pill readable without screaming colors. |
| 2026-04-18 | Phase 5A frontend: badges as inline SVG shields (no raster icons) | Matches the navbar brand mark, scales losslessly, recolors via `currentColor` per badge_type CSS class. No icon-pack dependency, ~0 KB asset cost. Per-type glyph (check / I / VI / X / star) is painted inside the shield. |
| 2026-04-18 | Phase 5A frontend: manual badge award restricted to `coach_spotlight` | Tenure badges (1 month / 6 months / 1 year) are time-derived — a future trigger will award them. `course_complete` will be awarded by the LMS progress path. Surfacing them in the manual award dropdown would invite drift between "how the badge is earned" and "who actually got it." Already-awarded tenure/course badges still render in the "Currently awarded" list for visibility and revocation. |
| 2026-04-18 | Phase 5A frontend: `useMemberBadges(userIds)` shared hook for inline badge rendering | Single query regardless of how many author IDs in view (forum feed, reply list, attendee list). Hook takes a sorted+deduped join key to avoid effect thrash when callers pass fresh arrays with the same IDs. Lets new surfaces drop in badge rendering without re-implementing the fetch. |
| 2026-04-18 | Phase 5A frontend: inline profile meta fetched per surface, not via a central store | Each surface (SpaceView / ReplySection / PostDetail / EventDetail / Dashboard) already has its own data-loading path. Adding a global member-profile cache would be premature — the per-surface fetch costs one query per page load and the data is stable. Revisit if multiple surfaces start stepping on each other. |
| 2026-04-18 | Phase 5A frontend: `/admin/tags` page (not inline on an Admin hub) | No admin hub exists yet. A focused page keeps the surface area minimal; later Phase 5B can introduce an `/admin` index that links to it alongside the upcoming admin-tag system and directory tools. |
| 2026-04-18 | Phase 5B-1: RESTRICTIVE RLS policies as the write-gate mechanism for suspended/banned members | RESTRICTIVE policies are AND'd with the existing PERMISSIVE "own your own row" policies. This means no existing policy needs to be rewritten to add the suspension check — one `is_active_or_admin()` gate per write path covers every table. SELECT is never gated so suspended users can still read (banned users can't log in anyway; this is defense-in-depth). |
| 2026-04-18 | Phase 5B-1: `member_status` enum on `profiles` (active / suspended / banned) | Three tiers matches the intended admin UX: soft pause (suspend = read-only) and hard block (ban = can't log in + RLS fallback). Enum is extensible via `ALTER TYPE ADD VALUE` if a future "probation" tier is needed. Partial index `WHERE status != 'active'` keeps the RLS lookup cheap — most rows are active. |
| 2026-04-18 | Phase 5B-1: admin tags are a separate table from public interest tags (`admin_tags` + `member_admin_tags`, not a flag on `tags`) | The visibility story is opposite: public interest tags are readable by all authenticated members, admin tags are invisible to members entirely (admin-only SELECT). Mixing them in one table would require tag-row-level RLS and a "kind" column — more policy surface, easier to leak. Two tables = two simple policy sets. |
| 2026-04-18 | Phase 5B-1: hard delete for `delete_member()` (cascade auth.users → profiles → everything) | Matches the "it's a community, not a content platform" ethos — when someone is removed, their posts/replies/reactions go with them. Soft-delete-and-anonymize is a heavier pattern that can be added later if members ever ask us to preserve conversations after a deletion. Starting strict, loosening on demand. |
| 2026-04-18 | Phase 5B-1: `is_active_or_admin()` SECURITY DEFINER helper called from RLS | Same pattern as `is_admin()`: SECURITY DEFINER + `(select auth.uid())` wrapping lets the restrictive policies do a single profiles lookup per query without RLS recursion, and keeps the gate expression one function call instead of an inline subquery. Zero `auth_rls_initplan` advisor findings confirms the wrapping is clean. |
| 2026-04-18 | Phase 5B-1: admin management functions guard self-action + admin-on-admin | `set_member_status()` and `delete_member()` both refuse to act when `target_id = auth.uid()` or when the target is an admin. Prevents foot-guns (accidentally suspending yourself) and prevents an admin from being weaponized against the other hosts. Auth-level ban (the actual login block) is a later hardening step via Edge Function. |
| 2026-04-18 | Phase 5B-1 frontend: client-side filter + 20-per-page pagination on `/members` directory | Community size is small (tens to low hundreds expected). One `profiles` SELECT + 3 ancillary fetches (badges, member_tags, member_admin_tags) + 2 catalogs at mount time is cheaper to reason about than server-side paged queries. Admin RLS returns `[]` for non-admins on `member_admin_tags`, so the same code path serves both audiences. Revisit if membership crosses ~500. |
| 2026-04-18 | Phase 5B-1 frontend: suspended UX = RLS write-gate plus UI soft-disables, not a hard route block | Suspended users can still read (forums, events, courses, profiles). Posting / replying / RSVPing / lesson progress / profile edits are disabled in the UI AND gated by RESTRICTIVE RLS. Defense-in-depth: the UI state is for ergonomics, the DB is for correctness. Banned users get logged out via AuthContext and land on `/login?banned=1`. |
| 2026-04-18 | Phase 5B-1 frontend: SuspendedBanner dismissal is session-scoped via `sessionStorage` | Per-session dismissal avoids pestering the user on every pageview within a session but re-surfaces on next login. localStorage would hide the banner forever; not showing it at all would leave the user confused about why actions are disabled. sessionStorage threads the needle. |
| 2026-04-18 | Phase 5B-1 frontend: shared Modal primitive promoted from `components/events/` to `components/ui/` with `variant` prop (warning / danger) | Phase 3 introduced Modal scoped to events. Phase 5B-1 needed the same primitive for ManageMemberModal + AssignAdminTagModal with action-specific chrome (amber for suspend, red for ban/delete). Promoted to shared, added variant prop, left `components/events/Modal.jsx` as a one-line re-export so EventFormModal keeps working without an import sweep. |
| 2026-04-18 | Phase 5B-1 frontend: Navbar admin dropdown replaces the static "Admin" badge | Phase 5A had an Admin badge next to the nav links purely as a visual flag. With `/admin`, `/admin/tags`, `/admin/admin-tags`, `/members`, and `/forums/admin-hq` all being admin surfaces, a non-clickable badge was wasting the best navigation real estate. Dropdown keeps the badge shape + palette (green pill, shield) and surfaces five links without crowding the primary nav. |
| 2026-04-18 | Phase 5B-1 frontend: admin tags on a profile viewer live in their own block with "Manage tags" button, not inline next to the dietary pill | Interest tags are identity ("this is who I am"); admin tags are operational metadata ("here's what hosts know about this person"). Keeping them in a separate profile block — with a title and Manage button — makes the admin-only nature obvious to hosts and prevents visual leakage into the member-facing header. |
| 2026-04-18 | Phase 5B-1 frontend: `delete_member` requires typing the display name | Soft-deletes are reversible. Hard cascade-delete is not. Forcing the host to type the member's display name is a speed bump that prevents a misclick from wiping months of a member's history. Same pattern GitHub uses for repo delete — proven friction that's worth the two seconds. |
| 2026-04-18 | Phase 5B-2: notification INSERT policy is actor-or-admin, not self-only | A notification row has two principals — the recipient (`user_id`) and the actor who triggered the event (`actor_id`). Allowing INSERT when `auth.uid() = actor_id` lets the app insert notifications on behalf of the action-taker (e.g. "you replied to a post → insert notification for post author"). Admin can insert with `actor_id IS NULL` for system notifications. The `broadcast_notification()` SECURITY DEFINER function bypasses RLS for bulk inserts, so the permissive gate doesn't need to cover that path. |
| 2026-04-18 | Phase 5B-2: notification inserts are application-level, not DB triggers | Trigger-per-event keeps DB surface small and lets notification logic change (new types, opt-out preferences, rate limiting) without schema migrations. The frontend/API layer inserts notification rows when the triggering action occurs. This is the right trade-off at small community scale; a trigger approach can be layered on later if latency or consistency becomes a concern. |
| 2026-04-18 | Phase 5B-2: scheduled posts use client-side time filtering, not a cron job | Non-admin feed queries add `AND (scheduled_at IS NULL OR scheduled_at <= now())`. Posts "publish" when the clock passes `scheduled_at` — no worker, no cron, no Edge Function needed for MVP. Admins see all posts with a "Scheduled" badge. This is sufficient at small scale and has zero infrastructure cost. A cron-based publish step can be added later if draft-preview or push notifications on publish become requirements. |
| 2026-04-18 | Phase 5B-2: `broadcast_notification()` is SECURITY DEFINER with internal admin guard | Broadcasting requires inserting one row per active member — crossing user ownership boundaries that normal RLS would block. SECURITY DEFINER is the established project pattern for this class of cross-user operation (same as `set_member_status`, `delete_member`). The function checks `is_admin()` internally and raises an exception for non-admins, so the privilege escalation is narrowly scoped. |
| 2026-04-18 | Phase 5B-2: `mark_all_notifications_read()` is SECURITY DEFINER | The `notifications_update_own` RLS policy already allows users to update their own notifications, but the function takes a single-round-trip UPDATE for all unread rows instead of requiring the frontend to enumerate IDs. SECURITY DEFINER keeps the implementation simple and consistent with the helper-function pattern in this project. |
| 2026-04-18 | Phase 5B-2: broadcast + scheduled as application-level gates, not RLS | Only admins should set `is_broadcast = true` or a future `scheduled_at`. The existing `forum_posts` INSERT policy already restricts to authenticated users. Admin-only broadcast is enforced at the UI layer (broadcast toggle only visible to admins) and by `broadcast_notification()` checking `is_admin()`. Adding an RLS constraint on `is_broadcast` would complicate the existing permissive policy without meaningful security gain — if someone crafts a direct API call to set `is_broadcast`, the worst outcome is a post flagged as a broadcast with no recipients (the function is what fans out the notifications). Same reasoning for `scheduled_at`. |
| 2026-04-18 | Phase 5B-2 frontend: 60-second polling for unread notification count, no Realtime subscription | Realtime would require a Supabase channel per logged-in client and a corresponding pricing/connection-budget conversation. At small community scale a `setInterval(..., 60_000)` against the partial `notifications_user_unread_idx` is cheap (single COUNT, head-only request) and avoids the operational surface of WebSocket connections. Full notification list only fetches when the dropdown opens. Easy to swap for Realtime later if the bell becomes a focal point of the UX. |
| 2026-04-18 | Phase 5B-2 frontend: notification helpers are fire-and-forget, no UI blocking on failure | A failed notification insert should never prevent the primary action (reply, reaction, badge award, status change, event create) from succeeding. `safeInsert()` wraps each insert in try/catch + console.error and returns nothing. Callers do not `await` the helper — they call it like a side-effect and continue. Cost of a missed notification is trivial; cost of blocking a user's reply on a notification failure is real. |
| 2026-04-18 | Phase 5B-2 frontend: per-type icon glyph map (no per-row actor avatar) | Notifications surface in a 360-px dropdown. A 28-px emoji icon (`💬 ❤️ 🏅 📅 ⚠️ 📢`) communicates type at a glance without the layout cost of an avatar fetch and the privacy of a private-bucket image fetch. Reaction notifications show the actual reacted emoji when present in `body`. Avatars can be added later if member-ID is the more interesting signal than event-type. |
| 2026-04-18 | Phase 5B-2 frontend: broadcast + schedule controls live inline in `PostComposer`, not a separate admin composer | Admins still need every regular composer affordance (title, body, image, preview). Forking `PostComposer` into a `BroadcastComposer` would duplicate ~80% of the file. Instead the existing component conditionally renders an admin-only block under the body that holds both the broadcast toggle and the schedule toggle/picker. Toggles default off so the admin's normal-post path is unchanged. |
| 2026-04-18 | Phase 5B-2 frontend: `broadcast_notification()` RPC signature extended with `p_type` to share fan-out for events | The original 4-arg signature only emitted `admin_broadcast`. New events also need to fan out one notification per active member — same query shape, different `notification_type` value. Adding `p_type notification_type DEFAULT 'admin_broadcast'` keeps the existing call sites working (the default preserves prior behavior) and lets `notifyNewEvent` reuse the function. The old 4-arg overload was dropped after adding the 5-arg version because PostgREST otherwise can't disambiguate. Trade-off accepted: any direct DB clients pinned to the 4-arg signature need to start passing the 5th arg. |
| 2026-04-18 | Phase 5B-2 frontend: `notifyStatusChange` fires on `active` and `suspended` only — skips `ban` + `delete` | Banned users can't log in (auth-level ban is later hardening; today the AuthContext signs them out + redirects to /login?banned=1), so a notification row would be invisible. Deleted users have no profile to receive a notification. Both cases would be silently dropped at best; clearer to skip the call entirely than to insert a row that nobody can read. |
| 2026-04-18 | Phase 5B-2 frontend: scheduled-indicator pill computed against mount-time, not live `Date.now()` | `react-hooks/purity` flags `Date.now()` calls during render. Capturing now via `useState(() => Date.now())` once at mount + comparing in `useMemo` keeps render pure. Trade-off: a scheduled-post badge won't auto-disappear the instant the clock crosses `scheduled_at` — it disappears on the next page load / parent refetch. Acceptable for an admin-only soft indicator. |
| 2026-04-19 | Phase 5B-3: extended existing `--color-*` tokens with dark overrides, did NOT rename to `--kk-*` | The handoff suggested renaming the whole palette to a project-prefixed namespace. That's a cosmetic change that would touch ~1000 lines across 10 CSS files and many JSX inline styles, with no functional improvement — the actual goal is dark-mode support, achieved by layering `[data-theme="dark"]` overrides on top of the existing variable names. Every color now routes through a semantic, theme-aware token. The rename can still happen later if we ever integrate with a design system that standardizes prefixes. |
| 2026-04-19 | Phase 5B-3: system preference gated by `:not([data-theme="light"]):not([data-theme="dark"])` | `@media (prefers-color-scheme: dark)` alone would override an explicit user choice on dark-OS machines. Scoping it to the no-explicit-attribute state means the OS pref is a default, not a veto. Matches how every serious theme picker behaves (VSCode, GitHub, etc.). |
| 2026-04-19 | Phase 5B-3: overlay lives on `.app-shell`, not a new `.app-layout` wrapper | The project already has `.app-shell` as the top-level wrapper around nav/main/footer. Reusing it as the overlay host avoids introducing another DOM layer and keeps nav + footer with their natural styles. One less abstraction, same visual result. |
| 2026-04-19 | Phase 5B-3: mobile `background-attachment: scroll` override under 768px | Fixed-attachment backgrounds cause scroll jitter on iOS Safari and trigger expensive GPU repaints on mid-range Android. `scroll` loses the parallax-ish "frame" effect on mobile but is what the vast majority of production sites use (web.dev recommends it). Desktop keeps `fixed` for the intended framing. |
| 2026-04-19 | Phase 5B-3: inline theme-flash prevention script before React boots | Waiting for React to mount + AuthContext to load + profile fetch to complete before applying `data-theme` would flash light → dark for dark-mode users on every cold load. A 6-line inline `<script>` in `<head>` reading `localStorage.kk-theme` fixes this at zero cost (the only state that matters for the flash is the persisted preference, not the authoritative profile row). The profile fetch later reconciles if the user's stored theme on the server differs from localStorage (unlikely but handled). |
| 2026-04-19 | Phase 5B-3: favicon stayed `favicon.svg` — no PNG logo exists in the repo | The handoff asked for a PNG derived from `ketokeeplogo.png`. That file doesn't exist in the repo and I'm not going to invent one. Kept the existing SVG, added a matching `apple-touch-icon` entry for iOS home-screen use. If a PNG version is later desired, drop it in `public/favicon.png` and swap the two links in `index.html`. |
| 2026-04-19 | Phase 5B-3: Toast system split across `toastContext.js` (context + hook) and `Toast.jsx` (provider component) | `react-refresh/only-export-components` requires a module to export components *or* non-components, not both. Without the split, Vite's Fast Refresh reload cycle would fail. The context + hook live in a `.js` file with no JSX; the provider + toast item components live in `Toast.jsx`. This is the idiomatic pattern for React contexts in Vite-based projects. |
| 2026-04-19 | Phase 5B-3: Modal focus trap uses `document.activeElement` capture + querySelector-based Tab wrapping, no library | Bringing in `focus-trap-react` or similar would be a 2 KB dep for ~20 lines of custom logic. A `setTimeout(0)` initial-focus + a Tab/Shift-Tab handler that queries focusables and wraps at the boundaries covers the WCAG 2.1 requirement. Return-focus-on-close restores `document.activeElement` captured at open-time. |
| 2026-04-19 | Session 20: dark mode surfaces shifted from blue/purple undertone to warm charcoal/stone | Every dark-mode surface color in v0.8.0 had a blue channel 15–30 points higher than R/G (e.g. `#1a1a2e`, `#252540`, `#0e0e1c`), giving a sci-fi purple look inconsistent with the castle theme. All 13 surface/background tokens were remapped so blue ≤ R/G with a slight warm (brown/amber) undertone. Q&A tint shifted to cool blue-grey stone to stay differentiated. Both `[data-theme="dark"]` and the `@media (prefers-color-scheme: dark)` fallback blocks updated identically. CSS-only change; no component or schema changes. |
| 2026-04-19 | Session 21: replaced all `window.confirm` / `window.alert` with `Modal variant="danger"` — no Toast needed | All 9 native dialogs were destructive confirmations (delete/remove), so all became danger-variant Modals with Cancel + action-specific Confirm button. No success/info/error alerts existed, so `useToast` was not needed for this pass. Pattern: add `confirmXxx` state (or `xToDelete` for dynamic names), convert the action to a state setter, add a second `<Modal variant="danger" size="sm">` alongside the existing component Modal (in a React fragment), execute the real delete only in the confirmed handler. AdminTags + AdminAdminTags needed Modal imported; course/event/lesson/module modals + AwardBadgeModal already imported Modal. ReplyItem + PostCard needed Modal imported from `../ui/Modal.jsx`. |
| 2026-04-19 | Session 22: `owner` as app_role enum value (not a separate profile column or boolean) | Owner is semantically "admin with extra privileges" — single-field role stays consistent with existing is_admin pattern. Adding a boolean (`is_owner`) would have split the role story across two columns and required every existing admin check to be rewritten. Instead `is_admin(uuid)` returns true for owner OR admin, so all 14 existing consumer files needed only a variable rename-through (isAdmin continues to work). One new helper `is_owner()` covers the narrow owner-only gates (promote/demote admins). |
| 2026-04-19 | Session 22: kept `is_admin(uuid)` parameterized signature (didn't switch to parameterless) | The Phase 5C handoff suggested switching is_admin to a parameterless variant that uses `auth.uid()`. But the existing `protect_role_change` trigger (and other call sites) invoke `is_admin(NEW.id)` with an explicit uuid — switching the signature would either break those callers or require maintaining two overloads. Kept the single parameterized form and just extended its body to return true for owner too. Zero breaking changes. |
| 2026-04-19 | Session 22: `set_member_role()` blocks direct owner-from-member promotion | The RPC requires a caller to be owner AND forbids owner → non-admin demotion in one step (owner must first become admin, then admin can be demoted). This prevents accidental last-owner-removal from a single mis-click, and forces owner → admin → member to be a deliberate two-step action. Extra guard: can't change self, can't demote last owner, target must exist. |
| 2026-04-19 | Session 22: promoted `rance@fsh-coach.com` (not `rancepants@gmail.com` as handoff specified) | Queried profiles/auth.users — the only active admin on the Supabase project is rance@fsh-coach.com. The handoff's email was stale. Bootstrap used trigger-disable pattern: `ALTER TABLE profiles DISABLE TRIGGER protect_role_change`; update role; re-enable trigger. This is the only legitimate path since the trigger blocks admin → owner when no owner exists yet (chicken-and-egg). |
| 2026-04-19 | Session 22: sidebar is CSS gradient-painted, not castle-bg-image | Handoff emphasized sidebar should "feel like interior keep wall" — warm stone via CSS, NOT castle bg images. The castle bg images stay on `body` (the outside of the keep). Sidebar uses `--sidebar-bg` gradient + `--sidebar-glow` amber radial at top for torchlight effect. This keeps the sidebar thematic without double-painting the castle imagery or fighting the body background for visual focus. |
| 2026-04-19 | Session 22: sidebar visibility is session + route gated, not conditional-rendered per page | `PRE_AUTH_PATHS = {'/','/login','/signup','/reset-password','/update-password'}` in Layout.jsx. Sidebar renders only when `session && !PRE_AUTH_PATHS.has(pathname)`. Alternative — per-page conditional — would have required every authed page to opt in and every landing/auth page to opt out, with new pages defaulting to the wrong state. Whitelist of pre-auth paths is smaller and fails safe (new routes get the sidebar by default, which is correct for 95% of pages). |
| 2026-04-19 | Session 22: mobile sidebar is slide-in drawer with backdrop, not a bottom-nav or hamburger-dropdown | Drawer pattern matches the desktop sidebar's content (nav sections, user block, theme controls, signout) without requiring a second information-architecture. Bottom-nav would force picking the 4–5 most-used nav items; drawer preserves full nav. Escape key closes, body overflow locked while open, auto-close on route change, backdrop click dismisses. |
| 2026-04-19 | Session 22: "Invite Friends" is placeholder showing "Coming soon" hint | Planned for post-launch but wanted the nav structure to anticipate it. SidebarNavLink supports a `disabled` prop that renders the link greyed-out with a "Soon" pill in place of the badge. Avoids reshuffling the nav layout later when invites ship. |
| 2026-04-20 | Session 26: Tiptap chosen for rich text editor (not Quill, Slate, or ProseMirror directly) | Tiptap wraps ProseMirror with React bindings and a clean extension API. StarterKit covers all required marks/nodes (bold, italic, bullet/ordered lists) out of the box. Extension-Link adds `<a>` handling. No CDN dependency, tree-shakable, actively maintained. Alternative Quill was disqualified because its React binding (react-quill) is unmaintained and had React 18 issues. |
| 2026-04-20 | Session 26: emoji-picker-react for emoji insertion (not a custom emoji grid) | The existing forum reaction bar uses a hardcoded 6-emoji grid. The body emoji picker needs search + skin tones + categories — emoji-picker-react provides all this in ~25 KB (gzipped). Inserts at cursor via `editor.chain().focus().insertContent(emojiData.emoji).run()`. Positioned relative to its trigger button; closes on outside click. |
| 2026-04-20 | Session 26: DOMPurify with a strict tag allowlist for rendered post/reply HTML | Forum content is now stored as Tiptap-generated HTML. Rendering with `dangerouslySetInnerHTML` without sanitization is an XSS vector. `ALLOWED_TAGS: ['b','i','strong','em','a','ul','ol','li','p','br']` with `ALLOWED_ATTR: { a: ['href','target','rel'] }` covers all formatted content Tiptap can produce while blocking script injection, inline event handlers, and unexpected tags. Lesson viewer uses a looser allowlist (includes iframe for YouTube); forum uses a tighter one since content is user-generated. |
| 2026-04-20 | Session 26: slim toolbar prop on RichTextEditor for reply contexts | Reply bodies are short and conversational — bold, italic, link, and emoji cover 99% of reply formatting needs. Lists in a 2-line reply textarea feel heavyweight. The `slim` prop omits bullet + ordered list buttons and reduces the emoji picker height from 400px to 320px. PostComposer and PostCard edit mode use the full toolbar (slim=false default). ReplyComposer and ReplyItem edit mode use slim=true. |
| 2026-04-20 | Session 26: members directory changed from 3-column card grid to single-column horizontal cards | The 3-column grid was designed for compact avatar+name cards. Now that each card shows bio, badges, interest tags, and journey info, horizontal rows give each member more reading width and prevent truncation. Layout: avatar/frame column (56px, flex-shrink: 0) left + content column (flex: 1) right. Single-column grid also reduces visual density on a page that can list 50–200 members. |
| 2026-04-20 | Session 26: member card frame alignment uses 16px margin-top (not the profile page's 35px) | ProfileFrame at size=64 has FRAME_OFFSET_RATIO=0.25 → overlayOffset = 16px (frame overlaps 16px above the container). To align the visual top of the frame with the content column's first text line, the avatar column shifts down 16px. The profile page uses 35px because the avatar is larger there and the name text sits lower in a taller layout. Member card uses the mathematically derived 16px. |
| 2026-04-20 | Session 26b: emoji picker uses fixed positioning (not absolute) to escape parent overflow clips | The emoji panel was getting clipped by `.rte-wrap`'s `overflow: hidden`, and potentially by `.post-composer` or other ancestors. Moving `.rte-wrap` to `overflow: visible` wasn't enough because other ancestor containers also clip. Solution: compute the trigger button's bounding rect via `getBoundingClientRect()` on `emojiTriggerRef`, store `{ top: rect.bottom + 4, left }` in state, render `<div class="rte-emoji-panel-fixed" style={{top, left}}>` with `position: fixed`. Fixed positioning escapes all overflow-clipping ancestors by bypassing the stacking context entirely. |
| 2026-04-20 | Session 26b: link popup as inline component instead of `window.prompt` | `window.prompt` is a native browser dialog that blocks the main thread, can't be styled, and behaves differently across browsers. The inline `<LinkPopup>` component is absolutely positioned below `.rte-link-wrap` (which is `position: relative`). It pre-fills the existing href if editing a link, shows Remove only when editing, auto-focuses the input on mount, and closes on Escape or outside click. The popup uses the same CSS variables as the rest of the UI for automatic dark mode support. |
| 2026-04-20 | Session 26b: notification bell moved from sidebar footer to floating fixed position (desktop only) | The sidebar footer bell was hard to discover (bottom-left corner, visually crowded with theme toggle and sign-out) and its dropdown opened downward off-screen. Moving to `position: fixed; top: 16px; right: 24px` follows the established UI convention (most apps put the bell top-right). The dropdown already uses `right: 0; top: calc(100% + 8px)` which opens correctly in this new position. Hidden at ≤768px since `SidebarMobileHeader` has its own bell at that breakpoint. |
| 2026-04-21 | Session 28: honors schema uses two enums (`badge_category`, `badge_unlock_method`) layered onto existing `badges.badge_type` | The existing `badges` table already had `badge_type` enum + a single hardcoded category per type. Instead of introducing a new `honors` table and data migration, we extended the existing table: added `badge_category` (community/growth/building/special) + `badge_unlock_method` (manual/auto) enums, plus `category`, `unlock_method`, `sort_order`, `requirement_meta` columns. 23 new `badge_type` enum values brought the total to 28. Benefit: no FK churn across `member_badges`, notifications, existing queries. Drawback: ALTER TYPE ADD VALUE must run outside transactions, so enum-value additions required one execute_sql call per value (not batched). |
| 2026-04-21 | Session 28: auto-award honors enforced client-side with RLS guard, not server-side triggers | Auto-award uses `checkAndAwardHonors(supabase, userId, triggerContext)` — a fire-and-forget helper mirroring notificationHelpers. Each trigger counts the relevant table client-side and inserts into `member_badges`. The RLS policy `member_badges_self_auto_insert` restricts self-insertion to badges where `unlock_method = 'auto'`. Alternative (Postgres triggers + SECURITY DEFINER function) was rejected because: (a) client already has the data, (b) notification dispatch already lives client-side, and (c) keeps schema portable. A malicious client cannot award manual honors (coach_spotlight/founding_member/champions_honor) because RLS blocks them. |
| 2026-04-21 | Session 28: cross-user honor (good_neighbor) uses "fan-in on recipient action" pattern, not reactor-awards-author | good_neighbor counts reactions *received*. The reactor cannot self-award the target author due to RLS (auth.uid must equal user_id on insert). Instead, the check runs *on the recipient's* own next action: `ALSO_CHECK_GOOD_NEIGHBOR` fires the good_neighbor counter whenever the user themselves posts, replies, reacts, or triggers streak/tenure checks. The honor is eventually consistent — earned on the user's next self-action after crossing the threshold. Avoids server-side triggers entirely. |
| 2026-04-21 | Session 29: `badgeTypeSlug()` uses a `SLUG_OVERRIDES` map for badge_types where filename ≠ type string | The `course_complete` badge_type generates slug `course-complete` via the default underscore→hyphen transform, but the PNG is named `honor-sage.png` (the honor was renamed after the enum value was locked). Rather than renaming the DB enum value (a breaking migration across member_badges + notifications) or the PNG (breaks any existing `icon_url` references), a `SLUG_OVERRIDES` constant in `profileHelpers.js` maps mismatched types to their correct filename slug. Future renames follow the same pattern: add one line to the map, no migration needed. |
| 2026-04-21 | Session 29: Hall of Honors collapsed by default — category headers expand on click | All 28 honors across 4 categories would render a tall unbroken grid by default, pushing bio, interests, and admin sections far down the page. Collapsed-by-default gives the profile a cleaner first impression and lets members deliberately explore categories they're curious about. Header shows "Category (X of Y earned)" so the summary is visible without expanding. Chevron (▶/▼) rotates via CSS transition to signal interactivity. State: `useState({})` keyed by category slug — empty object means all collapsed; no localStorage persistence (reset on each profile view is the right default). |
| 2026-04-21 | Session 28: referral honor triggers on InviteFriends page view, not during signup | At signup the authenticated user is the *referred* user, not the referrer. The referrer cannot self-award during that request (wrong auth.uid). Firing `checkAndAwardHonors(referrerId, 'referral')` on InviteFriends mount when `referrals.length > 0` means the referrer earns gatekeeper honors the next time they check on their invites — a natural, user-scoped checkpoint. Lives alongside the existing `getMyReferrals` call so no extra round-trips. |
| 2026-04-21 | Session 28: HonorIcon uses PNG-with-SVG-fallback, not pure SVG | Artwork is delivered as 28 pre-rendered PNGs in `public/honors/` (matches existing frame_catalog asset pipeline). HonorIcon renders an `<img>` with `onError` fallback to a gray shield SVG. Benefits: designer hand-off is simpler (Gemini-generated PNGs), tree-shakeable because the SVG path is only hit on error, and artwork can be swapped without code changes. Locked-honor styling uses `filter: grayscale(100%)` + `opacity: 0.4` on the same PNG — no second asset required. |
| 2026-04-21 | Session 30: notification helpers use optional trailing params (actorName, spaceName) — not a new helper overload | Adding new positional params after `link` preserves all existing call sites (callers that omit the new params continue to produce generic titles). Alternatives: a new `notifyReplyToPostPersonal()` overload would double the surface; an options-object restructure would touch every call site. The trailing-optional approach is the smallest surface area and the fallback (generic title when params absent) is the right default since not all call sites have the context. |
| 2026-04-21 | Session 30: dashboard Quick Links replaced with real-data cards (RecentActivityCard + HonorsProgressCard) | Quick Links were placeholder navigation that duplicated the sidebar. Real-data cards deliver community context (what's happening + how am I progressing) — the actual purpose of a dashboard welcome screen. Two-column grid mirrors the sidebar/main layout mental model; stacks to one column on mobile. Each card is a standalone component with its own Supabase fetch + loading state + empty state. |
| 2026-04-21 | Session 30: HonorsProgressCard fetches badges catalog + member_badges on mount (not via useMemberBadges hook) | `useMemberBadges` is designed for multi-user fetches (forum feeds, event attendees). HonorsProgressCard needs the full catalog (not just earned ones) to compute total + percentage, plus awarded_at for recency sorting. A direct fetch is 2 parallel queries and stays scoped to this component — no hook generalisation warranted at this scale. |
| 2026-04-21 | Session 30: honor lightbox reuses the shared Modal (not a custom overlay) | Modal already handles: focus trap, Escape key, backdrop click, aria-dialog, body overflow lock, return-focus-on-close. A bespoke lightbox would reimplement all of this. The `size="sm"` variant at 192px icon content fits naturally without any layout wrestling. The only new CSS is for the centered flex content inside the modal body. |
| 2026-04-21 | Session 31: guide character stored as profile column (`guide_character` text), not a separate preferences table | A separate `user_preferences` table would require a new join on every profile fetch and a second RLS policy set. `guide_character` is a single-character enum value read on every page — putting it on `profiles` keeps it in the same payload AuthContext already loads. CHECK constraint (`knight`/`lady`/`none`) gives the same guarantees an enum type would without the DDL complexity of ALTER TYPE ADD VALUE if we add characters later (just relax the CHECK). |
| 2026-04-21 | Session 31: `dismissed_tips` as `text[]` array, not a normalized join table | Tips are small (<50 strings), per-user, and only ever read as a set for "is this tip dismissed?" lookups. A `dismissed_tips_log` table would require an extra INSERT per dismissal and a JOIN on profile load. Array append (`array_append(dismissed_tips, $1)`) is atomic at the row level and the whole set rides along with the profile. No history is kept (intentionally — reset clears everything; we don't need a dismissal audit trail). |
| 2026-04-21 | Session 31: session-scoped reopen via local Set, not a persisted "reopened_tips" column | When the user clicks the sidebar "Guide" button, we want the tips to reappear *this visit* without undoing all past dismissals. Persisting a reopen state would require clearing it on navigate/reload, which is fragile. A React `useState(new Set())` in `GuideProvider` lives only for the tab's lifetime and resets naturally on reload. `GuideTooltip` checks `isTipReopened(tipId) OR !dismissed` as its visibility condition. |
| 2026-04-21 | Session 31: extracted `PAGE_TIPS`/`tipsForPath` and `ONBOARDING_STEPS`/`hasActiveOnboardingTour` into dedicated non-component modules | React's `react-refresh/only-export-components` lint rule flags any module that exports both a React component and non-component values (breaks HMR). `GuideProvider.jsx` originally exported `tipsForPath`; `OnboardingTour.jsx` originally exported `ONBOARDING_TIP_IDS`. Split into `tipPageMap.js` and `onboardingHelpers.js` so the component files are component-only. Sidebar imports from `tipPageMap.js`; Dashboard imports from `onboardingHelpers.js`. |
| 2026-04-21 | Session 31: onboarding tour renders as a centered overlay modal, not inline `GuideTooltip`s | The 3-step welcome tour needs a darkened backdrop and a consistent center position so first-time users can't miss it. Inline tooltips on the dashboard would be visually weaker and would have to jump around the DOM for the "point at the sidebar" step. `OnboardingTour.jsx` mounts `guide-overlay-backdrop` + `guide-tooltip-floating guide-tooltip-pos-center` and uses its own step-tracking state (not `GuideTooltip`). Still writes to the same `dismissed_tips` column so "Skip" and "Got it" persist like any other tip. |

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

### Build plan files prevent context-compaction data loss
Large Claude Code sessions hit context limits and trigger compaction, which can cause Code to forget completed work, re-do tasks, or skip items. Solution: Chat writes a `CURRENT_BUILD_PLAN.md` checklist file before every Code handoff. Code reads it first, checks off tasks as it goes, and re-reads it after any compaction. The file is the source of truth for session progress — not Code's memory.

---

## CURRENT STATUS

**Current Phase:** Phase 5I complete — v0.16.0 pushed to main
**Last Updated:** 2026-04-21 (Session 31)
**Frontend Version:** v0.16.0 — Phase 5I Guide Character system: `guide_character` + `dismissed_tips` columns on profiles; `GuideTooltip` component (inline + floating variants); 3-step onboarding tour modal; 14 contextual tips (3 onboarding, 4 discovery, 4 engagement, 3 hints) wired across Dashboard, Forums, Events, Courses, Members, Profile, PostComposer, NotificationBell; sidebar "Guide" button re-opens page tips for current route via session-scoped Set; Profile Edit "Your Guide" section with Sir Cedric / Lady Elara / None radio + Reset tips button.
**Supabase Schema:** v5I — adds `guide_character text NOT NULL DEFAULT 'knight' CHECK IN (knight,lady,none)` + `dismissed_tips text[] NOT NULL DEFAULT '{}'` on profiles. Existing profile RLS policies cover both columns.
**Session 31 — Next Session Handoff:**
- v0.16.0 deployed to Cloudflare. Test: fresh-login account should see 3-step onboarding tour on first dashboard visit. Click "Skip tour" or walk through "Got it!". Change guide in Profile Edit → tooltip character swaps from Sir Cedric to Lady Elara. Click sidebar "Guide" button on /forums → discover-forums tooltip reappears. Click "Reset guide tips" in Profile Edit → tour and all tips return.
- Next candidates (decide in Chat before Code): member-to-member messaging, auth-level ban hardening via Edge Function, notification preferences (opt-out per type), Justine admin seed, domain cutover planning.
- No blockers.

---

## SESSION LOG

### Session 31 — 2026-04-21 (Claude Code — Phase 5I Guide Character, v0.16.0)
**Goal:** Introduce the medieval guide character system (Sir Cedric / Lady Elara) — a 3-step onboarding tour on first login plus 14 contextual tips wired across major pages, with a sidebar Guide button and Profile Edit preferences to pick/disable the character or reset tips.

**What was done:**
- **Schema migration** (`add_guide_character_and_dismissed_tips`): added `guide_character text NOT NULL DEFAULT 'knight' CHECK IN (knight,lady,none)` and `dismissed_tips text[] NOT NULL DEFAULT '{}'` to `profiles`. Verified via `get_advisors(security)` — only the pre-existing leaked-password-protection warning remains.
- **AuthContext:** added `guide_character` to updateProfile allow-list; added `dismissTip(tipId)` (optimistic local state + async supabase update via array_append) and `resetTips()` (clears to `[]`). Both exposed on context value.
- **GuideProvider + useGuide:** new `src/components/guide/GuideProvider.jsx` manages a session-scoped `reopenedTips: Set<string>`. `reopenTipsForPage(pathname)` unions `tipsForPath(pathname)` into the set. `clearReopenedTip(tipId)` removes one. `isTipReopened(tipId)` is the read. Wrapped in `App.jsx` above ToastProvider. Hook at `src/components/guide/useGuide.js`.
- **Tip page map:** extracted `src/components/guide/tipPageMap.js` with `PAGE_TIPS` (pathname → tipId[]) and `tipsForPath(pathname)` — so `GuideProvider.jsx` is component-only (satisfies react-refresh/only-export-components).
- **GuideTooltip component:** `src/components/guide/GuideTooltip.jsx`. Props `{ tipId, pose, variant='inline'|'floating', position?, children|message, onDismiss }`. Reads `profile.guide_character` + `profile.dismissed_tips` from useAuth. Hidden when character='none' or tipId in dismissed_tips AND not in reopened set. Renders speech bubble with `/guide/guide-${character}-${pose}.png` + name (Sir Cedric / Lady Elara) + message + "Got it!" which calls `dismissTip(tipId)` + `clearReopenedTip(tipId)`.
- **Onboarding tour:** `src/components/guide/OnboardingTour.jsx` + `onboardingHelpers.js`. 3 steps — welcome (pose:welcome), nav (pose:pointing), profile nudge (pose:thinking). Finds first undismissed step, renders `guide-overlay-backdrop` + centered floating tooltip, shows step counter (e.g. "1/3"), "Skip tour" (dismisses all 3) + "Got it!" (dismisses current, advances via stepOverride). Mounted at top of Dashboard.jsx. `hasActiveOnboardingTour(profile)` helper used to suppress engagement tooltips while tour is open.
- **14 tips wired in:**
  - Onboarding (3): `onboarding-welcome`, `onboarding-nav`, `onboarding-profile` (in OnboardingTour).
  - Discovery (4): `discover-forums` on ForumHome, `discover-events` on EventsHome, `discover-courses` on CoursesHome, `discover-members` on MembersDirectory — each pose:pointing inline under page-header.
  - Engagement (4): `engage-first-honor` (Dashboard, myBadges>=1), `engage-streak-7` (Dashboard, streak>=7), `engage-first-post` (PostComposer, after successful post), `engage-frame` (Profile, own profile with selected_frame).
  - Hints (3): `hint-vacation` (Dashboard streak>=7 + Profile), `hint-editor` (PostComposer expanded), `hint-notification` (NotificationBell dropdown when items>0).
- **Sidebar Guide button:** `src/components/ui/Sidebar.jsx` now imports `useGuide` + `tipsForPath`. Renders a "🛡️ Guide" button in `sidebar-footer` when `profile.guide_character !== 'none'` AND `tipsForPath(location.pathname).length > 0`. Click calls `reopenTipsForPage(pathname)`.
- **Profile Edit "Your Guide" section:** in Profile.jsx editor, added 3 radio options (Sir Cedric/Lady Elara/None) with image thumbnails + `resetTips()` button (success message). `guide_character` added to form state + save payload.
- **CSS:** `src/styles/guide.css` (imported from index.css) — tooltip bubble grid (80px PNG + body, 60px on mobile), inline and floating variants (top-left/right, bottom-left/right, center), backdrop, animations, `.sidebar-guide-btn`, `.guide-pref-options` radio grid, mobile breakpoint (<=640px → full-width bottom tooltip).
- **Reference file protocol update:** Session End Gate from 9 items → 10 items. Added item 10: "Guide tutorial check" (review tip content + update any affected tips when user-facing features change).
- **Version bump + deploy:** package.json → v0.16.0. Lint clean, build clean (220 modules, up from 213). Committed + pushed to main.

**Files changed:**
- NEW: `src/components/guide/GuideTooltip.jsx`, `src/components/guide/GuideProvider.jsx`, `src/components/guide/guideContextValue.js`, `src/components/guide/useGuide.js`, `src/components/guide/tipPageMap.js`, `src/components/guide/OnboardingTour.jsx`, `src/components/guide/onboardingHelpers.js`, `src/styles/guide.css`
- EDITED: `src/contexts/AuthContext.jsx`, `src/App.jsx`, `src/components/ui/Sidebar.jsx`, `src/pages/Dashboard.jsx`, `src/pages/ForumHome.jsx`, `src/pages/EventsHome.jsx`, `src/pages/CoursesHome.jsx`, `src/pages/MembersDirectory.jsx`, `src/pages/Profile.jsx`, `src/components/forum/PostComposer.jsx`, `src/components/notifications/NotificationBell.jsx`, `src/styles/index.css`, `package.json`, `THE_KETO_KEEP_PROJECT_REFERENCE.md`

**Next Session Handoff:**
- v0.16.0 live on Cloudflare. Smoke test with a freshly-created account: dashboard should show the 3-step welcome tour centered over the page; Skip or walk through. Change guide in Profile Edit → artwork swaps. Sidebar "Guide" button on /forums re-opens discover-forums tip. "Reset guide tips" returns the full onboarding + all tips.
- Next candidates: member-to-member messaging, auth-level ban hardening via Edge Function, notification opt-out preferences, Justine admin seed, domain cutover planning.
- No blockers.

### Session 30 — 2026-04-21 (Claude Code — Phase 5I: Dashboard + Notifications + Honor Lightbox, v0.15.0)
**Goal:** Three UX improvements: (1) richer notification titles that include actor name and space name, (2) replace dashboard Quick Links with real-data activity and honors cards, (3) honor badge lightbox on Hall of Honors.

**What was done:**
- **Richer notifications:** Added optional `actorName` and `spaceName` trailing params to `notifyReplyToPost`, `notifyReplyToComment`, `notifyReaction`, and `notifyBadgeAwarded` in `notificationHelpers.js`. Titles now read "Rance replied to 'Post Title' in General Discussion" when params are present; fallback to existing generic titles when absent. Updated call sites: `ReplySection.jsx` (added spaceName prop + destructured profile from useAuth), `PostCard.jsx` (added spaceName prop + profile), `SpaceView.jsx` (passes spaceName={space.name}), `AwardBadgeModal.jsx` (passes profile.display_name). ManageMemberModal and EventFormModal left unchanged as per spec.
- **Dashboard redesign:** Removed Quick Links section from Dashboard.jsx. Created `src/components/dashboard/RecentActivityCard.jsx` (5 most recent non-admin-hq forum posts with space join + author profiles; linked rows; space pill; relative time) and `src/components/dashboard/HonorsProgressCard.jsx` (catalog + member_badges; X of Y summary + ProgressBar; 3 most recently earned honors at 32px). Placed in `dashboard-cards-row` grid after MyLearningCard. Dashboard CSS updated in pages.css (Quick Links styles replaced with dashboard card styles: grid, activity list, honors list, footer link).
- **Honor lightbox:** In HallOfHonors (Profile.jsx), each honor item is now clickable (role=button, tabIndex, onKeyDown). Clicking opens a shared Modal (size="sm") showing HonorIcon at 192px + name + description + "Earned on {date}" for earned honors, locked description text for unearned. Added cursor/hover CSS to `.honor-item` and lightbox content classes to `profiles.css`.
- **Version bump + deploy:** package.json → v0.15.0. Lint clean, build clean (214 modules). Commit `c85f6cb` pushed to main. Cloudflare auto-deploy triggered.

**Files changed:**
- EDITED: `src/lib/notificationHelpers.js`, `src/components/forum/ReplySection.jsx`, `src/components/forum/PostCard.jsx`, `src/pages/SpaceView.jsx`, `src/components/profile/AwardBadgeModal.jsx`, `src/pages/Dashboard.jsx`, `src/pages/Profile.jsx`, `src/styles/pages.css`, `src/styles/profiles.css`, `package.json`
- NEW: `src/components/dashboard/RecentActivityCard.jsx`, `src/components/dashboard/HonorsProgressCard.jsx`

**Next Session Handoff:**
- v0.15.0 live on Cloudflare. Test: post a reply → notification should include your name and space name. Dashboard shows Recent Forum Activity + Your Honors cards. Click any honor in Hall of Honors → lightbox opens with large PNG + description.
- Next candidates: member-to-member messaging, auth-level ban hardening, notification opt-out, Justine admin seed, domain cutover planning.
- No blockers.

### Session 29 — 2026-04-21 (Claude Code — Honors Polish + Backfill, v0.14.1)
**Goal:** Polish the Phase 5H honors system: fix Sage icon, move interests above honors, make Hall of Honors collapsed by default, run one-time backfill to award retroactive honors to existing members.

**What was done:**
- **Sage icon fix:** Added `SLUG_OVERRIDES = { course_complete: 'sage' }` to `badgeTypeSlug()` in `profileHelpers.js`. HonorIcon now resolves `course_complete` → `honor-sage.png` instead of the broken `honor-course-complete.png` path.
- **Interests above honors:** In Profile.jsx view mode, moved the interests/tags section above the `<HallOfHonors>` component so it's not buried below a potentially tall honors grid.
- **Collapsible Hall of Honors:** Each category section in HallOfHonors is collapsed by default. Category header is clickable; chevron (▶/▼) rotates on expand. Collapsed state shows "Category (X of Y)" count. Expanded state shows full honors grid. CSS transition on chevron rotation. State managed with `useState({})` keyed by category.
- **CSS:** Added `.honors-category-header`, `.honors-chevron`, `.honors-category-collapsed` rules to `profiles.css`.
- **Backfill:** One-time SQL queries via Supabase MCP awarded retroactive honors based on historical data. Results: town_crier(1), scribe(2), herald(1), standard_bearer(1). All remaining zeros expected — only 2 users with limited historical data.
- **Version bump + deploy:** package.json → v0.14.1. Lint clean, build clean. Commit `7298d94` pushed to main. Cloudflare auto-deploy triggered.

**Files changed:**
- EDITED: `src/lib/profileHelpers.js`, `src/pages/Profile.jsx`, `src/styles/profiles.css`, `package.json`

**Next Session Handoff:**
- v0.14.1 live on Cloudflare. Test: Hall of Honors collapsed by default; chevron expands categories. Sage honor shows tome artwork. Interests appear above Hall of Honors.
- Next candidates: member-to-member messaging, auth-level ban hardening, notification opt-out, Justine admin seed, domain cutover planning.
- No blockers.

### Session 28 — 2026-04-21 (Claude Code — Honors System, v0.14.0, Phase 5H)
**Goal:** Full Phase 5H build: apply honors schema expansion (schema v5H), build HonorIcon component, Hall of Honors profile section, expand AwardBadgeModal, implement auto-award engine (honorHelpers.js), and wire trigger points throughout the app.

**What was done:**
- **Schema v5H applied** via Supabase MCP: added `badge_category` enum (community/growth/building/special) and `badge_unlock_method` enum (manual/auto). Added 23 new `badge_type` enum values in separate execute_sql calls (ALTER TYPE ADD VALUE must run outside a transaction). Added 4 cols on `badges` table: `category`, `unlock_method`, `sort_order`, `requirement_meta`. Updated 5 existing rows + inserted 23 new rows, bringing total honors to 28. Added RLS policy `member_badges_self_auto_insert` to permit authenticated users to self-award honors where `unlock_method = 'auto'`.
- **HonorIcon component** (`src/components/profile/HonorIcon.jsx`): renders `/honors/honor-{slug}.png` with shield-SVG fallback on image error. Props: badgeType, size, title, className, locked.
- **profileHelpers.js updated:** BADGE_TYPE_LABEL expanded from 5 → 28 entries. Added `badgeTypeSlug(badgeType)` helper (underscores → hyphens). Added `HONOR_CATEGORIES` list and `HONOR_CATEGORY_LABEL` map.
- **BadgesInline.jsx rewritten** to use HonorIcon. Default limit=5, size=16. Overflow "+N" pill tooltip lists hidden honor names.
- **BadgeIcon.jsx deleted**, all consumers swapped to HonorIcon.
- **AwardBadgeModal updated:** `MANUAL_AWARDABLE = ['coach_spotlight', 'founding_member', 'champions_honor']`. Catalog query now selects category/unlock_method/sort_order ordered by sort_order. "Currently awarded" section now groups by HONOR_CATEGORIES and labels auto-unlock honors with "earned automatically".
- **Hall of Honors** section added to Profile.jsx: loads honor catalog (`loadHonorCatalog`) alongside profile data. `HallOfHonors` component groups all 28 honors by category, shows locked silhouettes (grayscale + dashed border + cream bg) for unearned, displays "X / Y earned" per category. Replaced prior badge showcase.
- **CSS** (`profiles.css`): removed `.badge-icon`, `.badge-[type]` color classes, `.badge-showcase`. Added `.honor-icon`, `.honor-icon-locked` (grayscale + 0.4 opacity), `.hall-of-honors`, `.hall-of-honors-header`, `.hall-of-honors-shield`, `.hall-of-honors-count`, `.hall-of-honors-empty`, `.honors-category`, `.honors-category-title`, `.honors-category-count`, `.honors-grid` (auto-fill 240px, 1-col on mobile), `.honor-item`, `.honor-item-locked`, `.honor-item-meta`, `.honor-item-name`, `.honor-item-desc`, `.honor-item-earned`, `.award-groups`, `.award-group-title`, `.award-list-auto`.
- **honorHelpers.js** (`src/lib/honorHelpers.js`, ~270 lines): `checkAndAwardHonors(supabase, userId, triggerContext)` — fire-and-forget matching notificationHelpers pattern. Handlers for post, reply, reaction, streak, lesson, event, referral, frame, tenure. `ALSO_CHECK_GOOD_NEIGHBOR` fans good_neighbor check into post/reply/reaction/streak/tenure triggers (avoids RLS cross-user writes). Each award fires notifyBadgeAwarded. Lesson handler walks lesson_progress → modules (all-lessons-complete = scholar) → courses (all-modules-complete = sage).
- **Trigger wire-up:** PostComposer ('post'), ReplySection top-level + nested ('reply'), EmojiReactionBar actor ('reaction'), AuthContext runStreakUpdate ('streak' + 'tenure'), LessonView toggleComplete ('lesson'), InviteFriends on load when referrals > 0 ('referral'), FramePickerModal on save when pending !== 'none' ('frame').
- **Lint + build:** Clean. Version bumped to v0.14.0. Commit `1057910` pushed to main.

**Design decisions:**
- **Client-side threshold enforcement with RLS guard:** Auto-award runs client-side, matching the notification pattern. RLS policy `member_badges_self_auto_insert` restricts self-inserts to badges where `unlock_method = 'auto'`, so a malicious client cannot award manual honors.
- **Cross-user awards handled indirectly:** good_neighbor counts reactions received — the reactor cannot award the target author due to RLS. Instead, good_neighbor is re-checked whenever the author themselves take any self-driven action (post/reply/reaction/streak/tenure). This eventually-consistent pattern avoids server-side triggers.
- **Referral honor triggers on InviteFriends view, not signup:** During signup the authenticated user is the *referred* user, not the referrer — so the referrer cannot award themselves via RLS. Firing the check when the referrer visits their own /invite page is a natural, user-scoped checkpoint.
- **Course completion detection:** Lesson handler builds a `{ module_id → Set(completed_lesson_ids) }` map, marks a module complete when its full lesson set is contained, then aggregates completed modules by course_id.

**Files changed:**
- NEW: `src/components/profile/HonorIcon.jsx`, `src/lib/honorHelpers.js`
- DELETED: `src/components/profile/BadgeIcon.jsx`
- EDITED: `src/lib/profileHelpers.js`, `src/components/profile/BadgesInline.jsx`, `src/components/profile/AwardBadgeModal.jsx`, `src/components/profile/FramePickerModal.jsx`, `src/pages/Profile.jsx`, `src/styles/profiles.css`, `src/components/forum/PostComposer.jsx`, `src/components/forum/ReplySection.jsx`, `src/components/forum/EmojiReactionBar.jsx`, `src/contexts/AuthContext.jsx`, `src/pages/LessonView.jsx`, `src/pages/InviteFriends.jsx`, `package.json`
- ASSETS: 28 honor PNGs in `public/honors/`

**Next Session Handoff:**
- v0.14.0 live on Cloudflare. Sanity: open Hall of Honors on /profile, verify 28 honors in 4 categories with locked silhouettes. Take a self-action (post/reply/react/lesson/frame/invite) and watch for notification.
- Backfill candidate: write a one-time script (or SQL function) to retroactively award town_crier/bard_*/scribe/herald/pilgrim/loyal_knight_*/tenure_*/scholar/sage to existing members based on historical data.
- Next feature candidates: messaging, auth-level ban hardening, notification opt-out, Justine admin seed, domain cutover.

### Session 27 — 2026-04-21 (Claude Code — three UI bug fixes, v0.13.2)
**Goal:** Three CSS + minor JSX bug fixes: (1) admin dropdown clipped by member card overflow, (2) frame-to-text spacing on mobile profile + member cards, (3) member card content density (about_me excerpt + more interest tags).

**What was done:**
- **Bug 1 — Admin menu clipping:** Removed `overflow: hidden` from `.member-card`. The dropdown was rendering inside the card but getting clipped. The bio already uses `-webkit-line-clamp: 2` + `overflow: hidden` for its own truncation, and the card's `border-radius` doesn't require `overflow: hidden` since no child element bleeds beyond the card edges in normal flow.
- **Bug 2 — Frame-to-text spacing:** Three targeted fixes: (a) `profiles.css` mobile query: added `margin-bottom: 24px` to `.profile-top .profile-frame:not(.profile-frame-none)` so the frame bottom clears the name text on narrow screens. (b) `members.css` desktop: added `margin-bottom: 8px` to `.member-card-avatar-col-framed`. (c) `members.css` mobile override: added `margin-bottom: 12px` to `.member-card-avatar-col-framed` in the `@media (max-width: 480px)` block (mobile gets slightly more clearance since content is stacked vertically directly below the frame).
- **Bug 3 — Content density:** Added `about_me` excerpt to `MemberCard.jsx` — rendered as `<p className="member-card-about">` below the bio, only when `profile.about_me` is non-empty and different from `profile.bio`, 3-line clamp. Added `.member-card-about` CSS class in `members.css`. Increased interest tag display limit from 4 → 8 (`interestTags.slice(0, 8)`).
- **Lint + build:** Clean. Version bumped to 0.13.2. Committed `191f432`, pushed to main.

**Files changed:**
- `src/styles/members.css` — removed `overflow: hidden` from `.member-card`; `margin-bottom: 8px` on `.member-card-avatar-col-framed`; `margin-bottom: 12px` in mobile override; `.member-card-about` class
- `src/styles/profiles.css` — `margin-bottom: 24px` on framed avatar in mobile media query
- `src/components/members/MemberCard.jsx` — `about_me` excerpt paragraph; slice(0, 8) for interest tags
- `package.json` — version 0.13.2
- `CURRENT_BUILD_PLAN.md` — fully checked off

**Next Session Handoff:**
- v0.13.2 live on Cloudflare. Test: admin 3-dot menu fully visible on member cards, frame-to-name spacing on mobile profile + member cards, about_me field on cards, 8 interest tags.
- Next feature candidates: member-to-member messaging, auth-level ban hardening, notification opt-out, Justine admin seed, domain cutover.

### Session 26b — 2026-04-20 (Claude Code — five polish fixes, v0.13.1)
**Goal:** Five polish fixes on top of v0.13.0: (1) link button inline popup + autolink, (2) emoji picker overflow fix + dark mode, (3) member card layout, (4) reaction count dark mode, (5) floating notification bell.

**What was done:**
- **Item 1 — Link button UX:** Enabled `autolink: true` on Tiptap Link extension (typed/pasted URLs auto-link). Replaced `window.prompt` with a new `<LinkPopup>` component inline in the toolbar. Popup appears below the link button via `position: absolute` on `.rte-link-wrap`. Shows URL input (pre-filled if editing existing link), Apply button, and Remove button (only when editing). Keyboard: Enter=apply, Escape=close. Outside-click dismisses via `document.addEventListener('mousedown', ...)`. CSS: `.rte-link-wrap`, `.rte-link-popup`, `.rte-link-input`, `.rte-link-btn`, `.rte-link-apply`, `.rte-link-remove` — all dark-mode-aware via CSS variables.
- **Item 2 — Emoji picker overflow + dark mode:** Changed `.rte-wrap` from `overflow: hidden` to `overflow: visible`. Added `overflow: hidden` to `.rte-editor-wrap` to preserve border-radius clipping on content area. Replaced `.rte-emoji-panel` (absolute) with `.rte-emoji-panel-fixed` (fixed position). `openEmoji()` reads `emojiTriggerRef.current.getBoundingClientRect()`, stores `{ top: rect.bottom + 4, left }` in state, renders fixed panel at those coordinates. Left-flips if too close to right edge. Added `getTheme()` helper that reads `document.documentElement.getAttribute('data-theme')` and passes result to `<EmojiPicker theme={theme}>`.
- **Item 3 — Member card layout:** Increased `.member-card-link` gap from `var(--space-4)` to `var(--space-5)`. Restructured `.member-card-heading`: added `.member-card-top-row` (flex row, flex-wrap) for name + dietary + streak inline; added `.member-card-sub-row` for journey + location on the next line. Bio, badges, interest tags, admin tags already filled full content width.
- **Item 4 — Reaction count dark mode:** Added `color: var(--color-ink)` to `.reaction-chip` base rule in forums.css. Previously no explicit color was set, so count text inherited browser default (black) — invisible in dark mode.
- **Item 5 — Floating notification bell:** Removed `<NotificationBell />` and its import from `Sidebar.jsx` footer. Added `import NotificationBell` in `Layout.jsx` and rendered `<div class="notif-bell-float"><NotificationBell /></div>` inside `.app-main-wrap` above `<SuspendedBanner>`. Added `.notif-bell-float { position: fixed; top: 16px; right: 24px; z-index: 40 }` + `@media (max-width: 768px) { display: none }` in `notifications.css`. Dropdown already had `right: 0; top: calc(100% + 8px)` so it opens correctly in the new position.
- **Lint + build:** Clean. Version bump to 0.13.1. Committed as `5e3ed5e`.

**Files changed:**
- `src/components/ui/RichTextEditor.jsx` — LinkPopup component, getTheme(), autolink: true, fixed emoji panel positioning, theme prop on EmojiPicker
- `src/styles/rich-editor.css` — overflow: visible on .rte-wrap; overflow: hidden on .rte-editor-wrap; .rte-emoji-panel-fixed (fixed); .rte-link-wrap, .rte-link-popup, .rte-link-input, .rte-link-btn, .rte-link-apply, .rte-link-remove
- `src/styles/forums.css` — `color: var(--color-ink)` on .reaction-chip
- `src/components/members/MemberCard.jsx` — .member-card-top-row + .member-card-sub-row restructure
- `src/styles/members.css` — gap: var(--space-5) on .member-card-link; .member-card-top-row and .member-card-sub-row CSS
- `src/components/ui/Sidebar.jsx` — removed NotificationBell import + usage from footer
- `src/components/Layout.jsx` — added NotificationBell import; added .notif-bell-float wrapper div
- `src/styles/notifications.css` — .notif-bell-float CSS (fixed, top-right, hidden ≤768px)
- `package.json` — version 0.13.1
- `CURRENT_BUILD_PLAN.md` — fully checked off

**Next Session Handoff:**
- Push `git push origin main` to trigger Cloudflare auto-deploy (commit `5e3ed5e` on local main).
- Test: link popup in forum post + reply, emoji picker full visible + dark mode, member card top row layout, reaction count in dark mode, notification bell at top-right on desktop, mobile header bell unchanged.
- Next feature candidates: member-to-member messaging, auth-level ban hardening, notification opt-out, Justine admin seed, domain cutover.

### Session 26 — 2026-04-20 (Claude Code — rich text editor + dark mode fixes + member card layout, v0.13.0)
**Goal:** Four build items: (1) dark mode fix for forum edit textareas, (2) dark mode fix for members filter inputs, (3) Tiptap rich text editor + emoji picker for forum post/reply create + edit, (4) members directory single-column horizontal card layout with frame alignment.

**What was done:**
- **Item 1 — Forum edit textarea dark mode:** Added `.post-edit-field` CSS class to the edit-mode `<input>` + `<textarea>` in PostCard.jsx and the edit `<textarea>` in ReplyItem.jsx. Added `.post-edit-field { background: var(--color-surface); color: var(--color-ink); }` rule in forums.css. The inline border/padding styles were preserved; only the missing background + color are now theme-aware.
- **Item 2 — Members filter inputs dark mode:** Added `.member-filter-field input, .member-filter-field select { background: var(--color-surface); color: var(--color-ink); border: 1px solid var(--color-border-strong); ... }` in members.css. Covers all 4–6 filter selects + the search input. Focus ring uses `var(--color-green)` + `var(--focus-ring)` matching all other form fields.
- **Item 3 — Rich text editor:** Installed `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/pm`, `emoji-picker-react`. Created `src/components/ui/RichTextEditor.jsx` — Tiptap editor with bold/italic/bullet/ordered/link/emoji toolbar; `slim` prop for reply contexts (omits list buttons, shorter emoji picker). Created `src/styles/rich-editor.css` — toolbar, button active states, emoji picker panel positioned relative to button, rendered content styles for `.post-rich-body` + `.reply-rich-body` (a, ul, ol, strong, em, p). Added `@import './rich-editor.css'` to index.css. Integrated into PostComposer (full toolbar), ReplyComposer (slim), PostCard edit mode (full), ReplyItem edit mode (slim). PostCard and ReplyItem now render `post.body` / `reply.body` as DOMPurify-sanitized HTML with `ALLOWED_TAGS: ['b','i','strong','em','a','ul','ol','li','p','br']` — blocks XSS while preserving all Tiptap-generated markup. Existing plain-text post bodies render fine (DOMPurify passes text nodes).
- **Item 4 — Member card layout:** Changed `.member-grid` to `grid-template-columns: 1fr` (single column). Restructured MemberCard.jsx to replace the old column layout with a two-column flex row: `.member-card-avatar-col` (flex-shrink: 0) + `.member-card-content` (flex: 1, column flex). When a frame is in use, `.member-card-avatar-col-framed` adds `margin-top: 16px` to shift the frame down so its visual top (which overflows 16px above the 64px container) aligns with the top of the name text. Mobile: `@media (max-width: 480px)` stacks to column and resets the frame margin.
- **Lint + build:** Clean after removing stale `// eslint-disable-next-line react/no-danger` comments (that rule isn't installed). Build produced 1.37 MB JS + chunk-size warning (not an error).
- **Version bump:** `package.json` bumped to 0.13.0. Committed as `2e8516d`. Push to `main` blocked by safety hook — needs user confirmation.

**Files changed:**
- `src/components/forum/PostCard.jsx` — DOMPurify import, sanitize helper, RichTextEditor in edit mode, HTML rendering in feed
- `src/components/forum/ReplyItem.jsx` — same as PostCard for replies
- `src/components/forum/PostComposer.jsx` — RichTextEditor replaces body textarea
- `src/components/forum/ReplyComposer.jsx` — RichTextEditor slim replaces textarea; layout updated for RTE width
- `src/components/ui/RichTextEditor.jsx` — NEW: Tiptap editor component
- `src/components/members/MemberCard.jsx` — horizontal card layout, avatar-col + content-col split
- `src/styles/forums.css` — `.post-edit-field` dark mode rule; `.reply-composer-rte` + `.reply-composer-editor` layout
- `src/styles/members.css` — `.member-filter-field input/select` dark mode rules; full horizontal card CSS
- `src/styles/rich-editor.css` — NEW: all rich editor CSS
- `src/styles/index.css` — imports `rich-editor.css`
- `package.json` / `package-lock.json` — Tiptap + emoji-picker-react + version 0.13.0
- `CURRENT_BUILD_PLAN.md` — fully checked off

**Decisions made:**
- Tiptap chosen over Quill (unmaintained React binding) and raw ProseMirror (too low-level)
- emoji-picker-react for full emoji search + categories (the forum reaction bar's 6-emoji grid is separate)
- DOMPurify strict allowlist for user-generated HTML (tighter than lesson viewer which allows iframe)
- slim=true for reply contexts (no list buttons, shorter picker)
- Member card frame alignment: 16px (derived from FRAME_OFFSET_RATIO=0.25 × size=64)

**Next Session Handoff:**
- Push `git push origin main` to trigger Cloudflare auto-deploy (commit `2e8516d` is on local main)
- Verify: forum post composer with RTE, emoji picker, dark mode fix on /forums edit, /members filter dark mode, member card horizontal layout with/without frames
- Next feature candidates: member-to-member messaging, auth-level ban hardening, notification opt-out, Justine admin seed, domain cutover

### Session 25c — 2026-04-19 (Chat + Claude Code — five CSS polish fixes)
**Goal:** Fix five mobile/desktop UI issues reported by Rance during manual testing.

**What was done:**
- Chat diagnosed all five issues by reading component + CSS source via Filesystem MCP.
- Prepared single Claude Code handoff (Haiku 4.5, low effort) with precise find/replace instructions for each fix.
- Code applied all five, verified at 375px and 1280px viewports, committed + pushed (a3a5d16).

**Fixes applied (all CSS-only, no JS/JSX changes):**
1. **Notification dropdown off-screen on mobile** — `notifications.css` mobile media query was setting `left: 0` on a right-anchored bell, pushing the dropdown off-screen right. Changed to `right: 0` + `width: calc(100vw - 16px)`.
2. **Hamburger lines not centered in button** — `sidebar.css` burger button lacked flex centering. Added `display: inline-flex; align-items: center; justify-content: center`.
3. **Footer jumbled on mobile** — `layout.css` footer-inner had no mobile override. Added `flex-direction: column` + tighter padding at ≤640px for both `.app-main-footer` and `.app-footer`.
4. **Footer trademark left-aligned on desktop** — `layout.css` had no base `.footer-trademark` rule. Added `display: block; text-align: center` as a base rule covering all viewports.
5. **Hero logo too small** — `landing.css` logo was 80px. Bumped to 160px desktop / 100px mobile.

**Decisions made:**
- No version bump — these are cosmetic fixes on the existing v0.12.1 release.

**Next Session Handoff:**
- Verify CSS polish on real device (phone + desktop browser).
- Next feature candidates: member-to-member messaging, auth-level ban hardening, notification preferences, Justine admin seed, domain cutover planning.
- No blockers.

### Session 25b — 2026-04-19 (Claude Code — Landing page contrast hotfix v0.12.1)
**Goal:** Fix landing page readability bug — CSS variable names were wrong, dark-mode fallbacks made content unreadable.

**What was done:**
- Identified root cause: `landing.css` used `--color-text-primary` and `--color-text-secondary` (vars that don't exist in this project). Dark fallback values (`#1a0f00`, `#5a4a35`) rendered as near-black on dark-mode surfaces.
- Added scoped CSS variable block on `.landing` that pins the full warm cream palette (`--color-ink`, `--color-ink-soft`, `--color-cream`, `--color-surface`, `--color-surface-raised`, `--color-border`, `--color-border-strong`) to their light/warm values. Landing page content sections now always render light regardless of system theme.
- Replaced all `var(--color-text-primary, ...)` → `var(--color-ink)` and `var(--color-text-secondary, ...)` → `var(--color-ink-soft)` throughout the file.
- Stripped now-redundant fallback values from `--color-surface`, `--color-border`, `--color-surface-raised`.
- Removed all 8 `[data-theme='dark']` override blocks — no longer needed.
- Replaced `var(--color-amber, #c08b30)` → `#c08b30` (brand accent, not a theme variable).
- Hero and final CTA remain hardcoded dark — untouched.
- Bumped to v0.12.1, committed, pushed. Cloudflare auto-deploy triggered.

**Decisions made:**
- Landing page is permanently light/warm (not theme-adaptive). Visitors are pre-auth with no stored theme preference to honor. Consistency of the marketing presentation matters more than dark-mode adaptation here.

**Next Session Handoff:**
- v0.12.1 deployed. Verify warm cream palette at keto-keep.rance-8c6.workers.dev while logged out; toggle system dark mode and confirm content sections don't change.
- Next feature candidates (decide in Chat): member-to-member messaging, auth-level ban hardening via Edge Function, notification opt-out preferences, Phase 5D coach listing.
- No blockers.

---

### Session 19 — 2026-04-19 (Claude Code — Phase 5B-3 polish / a11y / dark mode / background images deployed v0.8.0)
**Goal:** Ship the polish, accessibility, and dark-mode pass as v0.8.0. No new features — refinement of everything built in Phases 1–5B-2. Apply a single schema change (`profiles.theme_preference`), build a CSS custom-property theme system with light/dark palettes, place castle background images with overlay, add a navbar theme toggle, do a systematic a11y pass (skip link, focus trap, ARIA), and layer UX polish (page titles, scroll-to-top, toast system, shared loading/error/empty states, castle-themed 404).

**What was done:**
- **Schema (Supabase MCP execute_sql):** `alter table public.profiles add column theme_preference text not null default 'system' check (theme_preference in ('light','dark','system'));` Ran `get_advisors` for both `security` and `performance`. Security advisors: only `auth_leaked_password_protection` WARN (pre-existing, deferred by design — dashboard toggle). Performance advisors: `unused_index` INFO entries for indexes that haven't been queried yet (expected — many partial indexes are only used when admin filters or scheduled posts are accessed). No new findings introduced. No migration file generated — change is additive and applied directly.
- **Theme system (`src/styles/variables.css` rewritten):** extended the existing `:root` palette with a full parallel `[data-theme="dark"]` block + `@media (prefers-color-scheme: dark)` fallback gated by `:root:not([data-theme="light"]):not([data-theme="dark"])` so the OS preference only applies when the user hasn't explicitly chosen a theme. Added many new semantic tokens: `--bg-page`, `--bg-image`, `--bg-overlay`, `--nav-bg`, `--color-pinned-tint`, `--color-live-tint`, `--tint-{live-call,workshop,coaching,qa}-{bg,text,border}`, `--diet-{keto,carnivore,paleo,low-carb,ancestral,exploring}-{bg,text,border}`, `--status-{green,amber,red}-{bg,text}`, `--notif-unread-bg`, `--notif-scheduled-{bg,border,text}`, `--notif-info-bg`, `--composer-admin-{bg,border}`, `--focus-ring`, `--ghost-hover-bg`, `--ghost-hover-bg-soft`, `--avatar-overlay{,-strong,-stronger}`, `--video-placeholder`, `--tag-on-color-{text,shadow}`, `--tag-swatch-ring`, `--color-error-{hover,soft-bg}`, `--color-form-{error,success}-{bg,border}`, `--color-modal-backdrop`, `--color-ink-faint`, `--color-surface-alt`. Dark theme uses warm charcoal (`#1a1a2e` base, `#242440` cards) with preserved warm accents so the Keep vibe survives the mode swap.
- **CSS conversion across 10 stylesheets:** `base.css`, `layout.css`, `components.css`, `forums.css`, `events.css`, `courses.css`, `profiles.css`, `members.css`, `notifications.css` — every hardcoded hex / rgba fallback converted to a semantic token. Key substitutions: `.post-card.pinned` → `--color-pinned-tint`; `.event-card-live` → `--color-live-tint`; all 4 `.event-type-*` classes → `--tint-{live_call,workshop,coaching,qa}-*`; `.youtube-embed-placeholder` → `--video-placeholder`; `.modal-backdrop` → `--color-modal-backdrop`; all 6 `.dietary-tag-*` → `--diet-*-*`; `.my-why-section` gradient uses `color-mix(in srgb, var(--color-parchment/sand) N%, transparent)` so it re-tints per theme; `.admin-tag-badge` → `--tag-on-color-{text,shadow}`; 3 status pills → `--status-{green,amber,red}-{bg,text}`; `.notif-bell-badge` → `--color-error` + `--color-cream`; `.scheduled-indicator` → `--notif-scheduled-{bg,border,text}`; `.post-composer-admin` → `--composer-admin-{bg,border}`; `.post-composer-info` → `--notif-info-bg`; every `var(--color-ink-faint, #xxx)` fallback → bare `var(--color-ink-faint)` (now always defined).
- **Background images:** `bg-light-castle.webp` + `bg-dark-castle.webp` copied into `public/` so Vite serves them at `/bg-*.webp`. `base.css` body now uses `background-image: var(--bg-image); background-size: cover; background-attachment: fixed;` with a mobile override `@media (max-width: 768px) { body { background-attachment: scroll; } }` for iOS perf. `.app-shell` carries `background-color: var(--bg-overlay)` for the translucent parchment/charcoal tint over the image. `.lesson-view-wrapper` (courses) uses a clean `--color-cream` backdrop so video surfaces stay readable.
- **Flash prevention:** inline `<script>` in `index.html` reads `localStorage.getItem('kk-theme')` and sets `document.documentElement.setAttribute('data-theme', t)` before React mounts. Prevents a light → dark flash for dark-mode users on cold load.
- **ThemeToggle (`src/components/ui/ThemeToggle.jsx`):** circular icon button with sun/moon/monitor SVG per state. Cycles `system → light → dark → system`. `aria-label="Switch theme — current: {label}"`. Styled via `.theme-toggle` in `components.css` to match the notification bell (same 36px circle, same hover treatment). Mounted in `Navbar.jsx` both for authenticated (next to the bell) and unauthenticated (before the Join button) users.
- **AuthContext (`src/contexts/AuthContext.jsx`):** added module-level `applyTheme(theme)` helper that sets/removes `data-theme` on `<html>` and persists `kk-theme` to localStorage (remove on `system`). `fetchProfile` calls `applyTheme(data.theme_preference)` on successful load so the user's stored preference wins over localStorage. `updateProfile` allow-list gained `theme_preference`. New `setTheme(theme)` callback validates the input, applies immediately (DOM + localStorage), and for authenticated users UPDATEs `profiles.theme_preference` and syncs the returned row back to state. Exposed in the context value.
- **Accessibility:**
  - `Layout.jsx` — first child is `<a href="#main-content" className="skip-link">Skip to main content</a>`; `<main>` gained `id="main-content"` and `tabIndex={-1}` so the skip target is programmatically focusable. Skip-link styled as position-absolute off-screen until `:focus` brings it in at top-left (parchment background, green outline).
  - Shared `Modal.jsx` — full focus trap: remembers `document.activeElement` on open, focuses the first visible focusable after mount, wraps Tab/Shift+Tab inside the dialog, restores focus to the opener on close. Escape close preserved. `aria-modal="true"` + `aria-labelledby={titleId}` (via `useId()`) on the inner dialog; backdrop no longer carries the dialog role.
  - `sr-only` utility class in `components.css` for screen-reader-only text.
- **UX polish:**
  - `usePageTitle(title)` hook in `src/lib/usePageTitle.js` — sets `document.title = '{title} · The Keto Keep'` (or just the base when called with no arg). Applied to all 19 page components.
  - `ScrollToTop` component in `src/components/ScrollToTop.jsx` — scrolls to `(0,0)` on every `pathname` change. Mounted inside `<BrowserRouter>` in `App.jsx`.
  - Toast system: `src/components/ui/toastContext.js` (context + `useToast()` hook) and `src/components/ui/Toast.jsx` (`ToastProvider` — split across two files to satisfy `react-refresh/only-export-components`). Provider holds a stack, `show(msg, {tone, duration})` + `success` / `error` / `info` / `dismiss` shortcuts, auto-dismiss after 4s by default. Renders a `.toast-stack` at the bottom-right with `role="region" aria-live="polite"` plus per-toast `role="alert"` for errors / `role="status"` otherwise. Escape dismisses the focused toast. Styled with per-tone left-border accents (`--color-green` / `--color-error` / `--color-amber`). Mounted via `<ToastProvider>` in `App.jsx` around `<Routes>`.
  - Shared `LoadingSpinner` (role="status" + sr-only label), `ErrorState` (role="alert" + optional retry button), `EmptyState` (icon + title + message + action slot) components in `src/components/ui/`. Styles added to `components.css`.
  - Castle-themed `NotFound` page with a shield/castle SVG, "This keep is empty" headline, and a "Return home" button. Uses `usePageTitle('Page not found')`.
- **Lint:** clean after splitting `useToast` out of `Toast.jsx` (react-refresh/only-export-components) and collapsing `catch (e)` to `catch` in the localStorage try/catch (no-unused-vars).
- **Build:** `npm run build` — 91.87 kB CSS gzipped 14.43 kB; 615.64 kB JS gzipped 170.82 kB. Zero errors.
- **Version:** `package.json` 0.7.0 → 0.8.0.
- **Commit:** `fe236b0` "Phase 5B-3: polish, accessibility, dark mode, background images (v0.8.0)" pushed to `main`. Cloudflare Workers auto-deploy picked up the build. Live HTML confirmed served at `https://keto-keep.rance-8c6.workers.dev/` with the inline theme-flash script + bg-castle images + v0.8.0 assets.

**Decisions made:**
- **Kept existing `--color-*` names; layered dark-theme overrides on top rather than renaming to `--kk-*`.** The handoff's rename was a nice-to-have; a sweeping rename across 10 CSS files and many JSX inline styles was pure risk with no functional delta. Every color now routes through a semantic token that respects the theme, which is the actual goal.
- **Overlay sits on `.app-shell`, not a new `.app-layout`.** The codebase already had `.app-shell` as the top-level wrapper around nav/main/footer. Putting the overlay there lets nav + footer keep their natural translucent/solid styles without adding a container layer.
- **System preference only applies when the user hasn't explicitly chosen.** The `@media (prefers-color-scheme: dark)` block is scoped to `:root:not([data-theme="light"]):not([data-theme="dark"])`. An explicit "Light" pick from a user on a dark-OS machine wins, as expected.
- **Favicon remained `favicon.svg`, not `ketokeeplogo.png`.** The handoff suggested converting a PNG logo, but no PNG logo exists in the repo. Kept the existing SVG; added an `apple-touch-icon` entry pointing at the same SVG for iOS home-screen use.
- **Mobile `background-attachment: scroll`.** Fixed backgrounds on iOS cause scroll jitter and, on some devices, force a GPU upscale that kills perf. Switching to `scroll` under 768px is the widely accepted fix and keeps the visual intent (castle in the background) on desktop.
- **Toast system split across two files.** `react-refresh/only-export-components` forbids exporting both a component and a non-component (hook) from the same file. Keeping `ToastContext` + `useToast` in `toastContext.js` and the `ToastProvider` component in `Toast.jsx` lets Fast Refresh work cleanly during dev.

**Next Session Handoff:**
- Phase 5B-3 is shipped end-to-end at v0.8.0. Rance should smoke-test:
  1. Land as an unauthenticated visitor → castle background visible; toggle theme in navbar → light/dark/system cycle works; reload → theme persists via localStorage (no flash).
  2. Log in → if you previously picked a theme while signed-in, it's loaded from `profiles.theme_preference`; toggling now UPSERTs the row.
  3. Open any modal (badge award, manage member, event form) → Escape closes; Tab cycles inside; focus returns to the opener on close; `aria-labelledby` reads the title.
  4. Keyboard-only navigation: Tab from the top → "Skip to main content" appears → Enter skips past the nav.
  5. Every page now shows a document title like "Dashboard · The Keto Keep"; route changes scroll to top.
  6. Navigate to a bogus URL like `/fhqwhgads` → castle-themed NotFound page.
- Pick the next Phase 5B wave or jump to Phase 5C in Chat before the next Code session. Candidates still on the board:
  1. Member-to-member messaging (approach TBD — in-app DMs vs. email bridge).
  2. Auth-level ban hardening via Edge Function calling `supabase.auth.admin.updateUserById({ ban_duration: '87600h' })`.
  3. Enable Supabase leaked-password protection (single dashboard toggle; verify login UX unchanged).
  4. Notification preferences (opt-out per type).
  5. Replace `window.confirm` and `window.alert` usage with the new Toast / Modal primitives across the admin flows.
- No blockers.

### Session 18 — 2026-04-18 (Claude Code — Phase 5B-2 frontend build + deploy v0.7.0)
**Goal:** Build the Phase 5B-2 frontend — navbar bell + notification dropdown, admin broadcast toggle + scheduled-post picker in `PostComposer`, feed query gate for scheduled posts, application-level notification inserts across reply / reaction / badge / status-change / new-event handlers — and ship as v0.7.0.

**What was done:**
- Schema follow-on via Supabase MCP `execute_sql`: re-created `public.broadcast_notification()` with a 5-arg signature (added `p_type notification_type DEFAULT 'admin_broadcast'`) so the same SECURITY DEFINER fan-out can emit `admin_broadcast` AND `new_event` notifications. Dropped the old 4-arg overload to avoid PostgREST ambiguity. Verified with `select proname, pronargs from pg_proc where proname = 'broadcast_notification';` → single row, pronargs = 5.
- New `src/lib/notificationHelpers.js`: `safeInsert()` wrapper + six fire-and-forget helpers — `notifyReplyToPost`, `notifyReplyToComment`, `notifyReaction`, `notifyBadgeAwarded`, `notifyStatusChange`, `notifyNewEvent`. Each helper skips when `actorId === recipientId`, swallows errors with `console.error`, and is called WITHOUT `await` so the primary action never blocks. Plus `NOTIFICATION_ICONS` map + `notificationIcon(notification)` helper that returns the reaction emoji from `body` for `reaction` rows or the type-default glyph otherwise.
- New `src/components/notifications/NotificationBell.jsx`: bell SVG button + red unread-count badge (hides at 0, caps at "99+"), 60s `setInterval` poll that calls a HEAD `count: 'exact'` query against `notifications WHERE read = false` (hits the `notifications_user_unread_idx` partial index). Click toggles a 360-px dropdown that fetches the 20 most recent notifications on open. Click-outside + Escape dismiss reuses the AdminDropdown pattern. Mark-all-read button calls `mark_all_notifications_read()` RPC. Individual rows mark-read optimistically + UPDATE on click + navigate to the row's `link`. Empty / loading states. Renders null when no `user.id`, so the polling effect never runs for unauthenticated visitors.
- `Navbar.jsx`: imported + mounted `<NotificationBell />` between the nav links and the AdminDropdown for authenticated users.
- `PostComposer.jsx` (substantial rewrite): added `useAuth().profile` for `isAdmin`. New admin-only block under the body — broadcast checkbox (with last-broadcast relative timestamp queried on expand) + schedule checkbox that reveals a `datetime-local` input. Schedule input defaults to +1h via `eventHelpers.isoToLocalInput`. Submit validates schedule > now, then INSERTs with `is_broadcast` + `scheduled_at` set. After a successful broadcast insert, calls `supabase.rpc('broadcast_notification', { p_post_id, p_title, p_body, p_link, p_type: 'admin_broadcast' })` and shows "Broadcast sent to {count} members" inline as `post-composer-info`. Submit button label switches to "Schedule post" when schedule toggle is on. Reset clears all admin-only state.
- `SpaceView.jsx`: pulled in `useAuth` for `isAdmin`. Both `loadPage` and `refresh` add `q.or('scheduled_at.is.null,scheduled_at.lte.{nowIso}')` for non-admins; admins skip the filter and see all scheduled posts. `PostComposer` now receives `spaceSlug` so the broadcast notification's `link` field can deep-link to the post permalink.
- `PostCard.jsx`: imported `notifyReaction` and added `useState(() => Date.now())` + `useMemo` to compute `scheduledFuture` (keeps render pure under `react-hooks/purity`). Added `📢 Broadcast` and `🕒 Scheduled for {locale}` pills in the meta row next to the existing `📌 Pinned` indicator. Wired `onReactionAdded` callback into `EmojiReactionBar` to fire `notifyReaction(supabase, post.author_id, user.id, emoji, permalink)` when a new reaction is added (toggles-off skip). Passed `postAuthorId`, `postTitle`, `permalink` down to `ReplySection`.
- `EmojiReactionBar.jsx`: new `onReactionAdded(emoji)` prop fires only on insert (not delete). Cleanly threads through both PostCard (post reactions) and ReplyItem (reply reactions).
- `ReplySection.jsx`: pulled in helpers, accepts `postAuthorId`, `postTitle`, `permalink` from PostCard. New `handleTopLevelReplyCreated` calls `notifyReplyToPost(supabase, postAuthorId, user.id, postTitle, permalink)`. New `handleNestedReplyCreated(parentAuthorId, ...)` calls `notifyReplyToComment(supabase, parentAuthorId, user.id, permalink)`. New `handleReplyReaction(replyAuthorId, emoji)` calls `notifyReaction` for reply reactions. Top-level `ReplyComposer` and `ReplyItem` `onChildReplyCreated` callbacks return the inserted row so the helpers have the data they need.
- `ReplyItem.jsx`: new `onReactionAdded` + `onChildReplyCreated` props. Threads `onReactionAdded` to its `EmojiReactionBar`. Nested `ReplyComposer.onSubmitted` now calls `onChildReplyCreated(newReply)` if provided (else falls back to `onChanged`).
- `AwardBadgeModal.jsx`: on successful award, looks up the badge's name from the catalog and calls `notifyBadgeAwarded(supabase, targetUserId, badgeMeta?.name, user?.id, '/profile/{targetUserId}')`.
- `ManageMemberModal.jsx`: on `set_member_status` success with `new_status` of `active` or `suspended`, fetches the actor via `supabase.auth.getUser()` and calls `notifyStatusChange(supabase, targetUserId, newStatus, actor?.user?.id)`. Skips `banned` (user can't log in) and `delete` (account gone).
- `EventFormModal.jsx`: on event create (not edit), calls `notifyNewEvent(supabase, data?.title, '/events/{data.id}')` which RPCs `broadcast_notification` with `p_type = 'new_event'`.
- New `src/styles/notifications.css` imported from `styles/index.css`. Covers: bell trigger (circle button) + red badge with white outline + hover green border; 360-px dropdown with parchment header, scroll list (max 420px), per-row layout with icon column + title + relative timestamp + unread dot; bold title + green-tinted background for unread rows; broadcast/scheduled pills (subtle borders, parchment fill, amber tint for scheduled); admin composer block (dashed border, subtle background) with toggle labels and schedule input; broadcast info panel after submit.
- Lint: zero errors after fixing two findings — `react-hooks/purity` on the `Date.now()` call in `PostCard` (refactored to `useState`/`useMemo`) and `react-hooks/set-state-in-effect` in `NotificationBell` (removed the unauthenticated reset block since the component returns null when `!user?.id`, so the effect never runs in that state).
- Build: `npm run build` clean (610 KB JS gzipped 169 KB; CSS 79.8 KB gzipped 12.4 KB).
- Version: `package.json` 0.6.0 → 0.7.0.
- Committed as `6e896b0` and pushed to `main`. Cloudflare Workers auto-deploy picks up the build.

**Decisions made:**
- `broadcast_notification()` extended to 5 args with `p_type` default. Reuses the same fan-out for `admin_broadcast` (post-driven) and `new_event` (event-driven). Old 4-arg overload dropped because PostgREST can't disambiguate two functions with overlapping arg counts.
- 60-second polling for unread count, no Realtime subscription. HEAD `count: 'exact'` against the partial unread index is cheap; no WebSocket pricing/connection budget needed at small scale. Easy to swap later.
- Notification helpers fire-and-forget. A failed insert never blocks the primary action. Cost of a missed notification is trivial; cost of a blocked reply is real.
- Per-type emoji icons in the dropdown, not actor avatars. 28-px glyph communicates type at a glance without a private-bucket avatar fetch per row. Reactions show the actual reacted emoji from `body` if present.
- Broadcast + schedule controls inline in `PostComposer`, not a separate composer. Admins still need every regular composer affordance; forking would duplicate ~80% of the file. Toggles default off so the normal-post flow is unchanged.
- `notifyStatusChange` fires only on `active` / `suspended`. Banned users can't log in and deleted users have no profile to receive notifications.
- `scheduled_at`-future check uses mount-time `useState(() => Date.now())` + `useMemo`. Keeps render pure under `react-hooks/purity`. The badge won't auto-vanish the instant the clock crosses; refreshes on next page load. Acceptable for an admin-only soft indicator.

**Next Session Handoff:**
- Phase 5B-2 is shipped end-to-end. Rance should smoke-test:
  1. Reply to your own post → no notification; reply as a different account → bell badge increments for the post author within 60s.
  2. Toggle broadcast on a fresh post and submit → confirm "Broadcast sent to {n} members" appears and recipients see a 📢 entry in their bell.
  3. Schedule a post for ~2 minutes in the future → confirm a non-admin account does not see it; wait 2 min and refresh → it appears. Admin sees it the whole time with a 🕒 pill.
  4. Award a badge → recipient gets a 🏅 notification.
  5. Suspend / reinstate a test account → the target gets a ⚠️ status notification.
  6. Create a new event → all active members get a 📅 notification.
  7. Click "Mark all read" in the dropdown → unread count drops to 0; badge hides.
- Pick the next Phase 5B wave in Chat before the next Code session. Candidates (roughly in priority):
  1. Member-to-member messaging (approach TBD — in-app DMs vs. email bridge).
  2. Auth-level ban hardening via Edge Function calling `supabase.auth.admin.updateUserById({ ban_duration: '87600h' })`.
  3. Performance / UX polish + accessibility review + Supabase advisor audit + enable leaked-password protection.
  4. Notification preferences (opt-out per type) — natural follow-on to 5B-2 if any host wants finer control.
- Open question still open (non-blocking): Co-Host #3 name.
- No blockers.

### Session 17 — 2026-04-18 (Claude Code — Phase 5B-2 schema applied)
**Goal:** Apply the Phase 5B-2 schema draft as migration `phase5b2_notifications_broadcasts_scheduled`, run both advisors, remediate any new findings, update reference file, commit + push.

**What was done:**
- Applied migration `phase5b2_notifications_broadcasts_scheduled` via Supabase MCP. Created enum `public.notification_type` (7 values: `reply_to_post`, `reply_to_comment`, `reaction`, `badge_awarded`, `new_event`, `status_change`, `admin_broadcast`); created table `public.notifications` (9 columns: id, user_id, type, title, body, link, actor_id, read, created_at) with RLS enabled immediately; created 3 indexes (`notifications_user_created_idx` on (user_id, created_at desc), `notifications_user_unread_idx` partial WHERE read=false, `notifications_actor_id_idx` FK cover on actor_id); created 4 permissive RLS policies (`notifications_select_own`, `notifications_insert_actor_or_admin`, `notifications_update_own`, `notifications_delete_own`) and 1 restrictive write-gate policy (`active_gate_notifications_insert` calling `is_active_or_admin()`); altered `forum_posts` to add `is_broadcast boolean NOT NULL default false` and `scheduled_at timestamptz`; created 2 partial indexes on forum_posts (`forum_posts_scheduled_idx` WHERE scheduled_at IS NOT NULL, `forum_posts_broadcast_idx` WHERE is_broadcast=true); created `broadcast_notification(p_post_id, p_title, p_body, p_link)` SECURITY DEFINER function (admin guard via `is_admin()`, bulk-inserts one notification per active member, returns row count); created `mark_all_notifications_read()` SECURITY DEFINER function (updates all unread rows for calling user, returns count).
- Verified post-apply state via `execute_sql`: enum has 7 values ✓; notifications table has 9 columns with correct types ✓; RLS enabled (relrowsecurity=true) ✓; 5 policies on notifications (4 permissive + 1 restrictive) ✓; forum_posts has is_broadcast (boolean, default false) + scheduled_at (timestamptz, null) ✓; all 5 new indexes exist ✓; both functions exist ✓.
- Ran security advisor: only pre-existing `auth_leaked_password_protection` WARN — no new schema-level findings.
- Ran performance advisor: **zero** `auth_rls_initplan` findings (confirms `(select auth.uid())` wrapping clean on all new policies). **Zero** `unindexed_foreign_keys` (actor_id FK cover index included in draft). Remaining findings are all `unused_index` INFOs — expected on fresh indexes and pre-existing tables.
- Updated reference file: canonical version date (session 17), canonical versions table (schema → v5B2 + Phase 5B-2 draft row as APPLIED), Phase 5 roadmap (Phase 5B-2 subsection with schema items checked and frontend items pending), six new Architecture & Design Decisions entries, Current Status block.

**Decisions made:**
- Notification INSERT policy is actor-or-admin (`auth.uid() = actor_id` OR `actor_id IS NULL AND is_admin()`). This covers the app-level insert pattern: the actor (e.g. replier) inserts the notification for the recipient; admins insert system notifications with null actor. Broadcast inserts bypass RLS via `broadcast_notification()` SECURITY DEFINER.
- Application-level inserts, not DB triggers. Keeps trigger surface small; notification logic (opt-out, rate limits, new types) evolves without schema migrations.
- Scheduled posts use client-side time filtering (`AND (scheduled_at IS NULL OR scheduled_at <= now())`). No cron or Edge Function needed for MVP. Admins see all posts with a "Scheduled" indicator.
- `broadcast_notification()` SECURITY DEFINER with internal `is_admin()` guard — same pattern as `set_member_status` / `delete_member`. The privilege escalation is narrowly scoped to the function body.
- `mark_all_notifications_read()` SECURITY DEFINER for single-round-trip "mark all" without enumerating IDs on the client.
- Broadcast + scheduled as application-level gates (not RLS on `is_broadcast`/`scheduled_at`). A crafted direct API call setting `is_broadcast=true` with no `broadcast_notification()` call produces a flagged post but no notification fan-out — acceptable risk at this community scale.

**Next Session Handoff:**
- **Phase 5B-2 frontend** — build in Claude Code (Sonnet 4.6 / medium effort):
  1. Navbar bell icon + unread count badge (query `notifications` WHERE `user_id = auth.uid() AND read = false`, count only). Update on any page load via AuthContext or a lightweight hook.
  2. Notification dropdown (latest 10 notifications, click to navigate to `link`, mark-read on open via `mark_all_notifications_read()` RPC or individual update).
  3. Post composer: admin-only broadcast toggle (`is_broadcast`) + scheduled datetime picker (`scheduled_at`). Both only visible/editable for admins.
  4. Feed query update in `SpaceView` / forum listing: non-admin adds `AND (scheduled_at IS NULL OR scheduled_at <= now())`. Admin sees all, with a "Scheduled" pill on future-dated cards.
  5. App-level notification inserts: when a reply is posted → insert `reply_to_post` or `reply_to_comment` notification for the parent author. When a reaction is added → insert `reaction` notification. When a badge is awarded → insert `badge_awarded` notification. Start with reply + badge; reaction can follow.
  6. Version bump to v0.7.0 on deploy.
- Open question still open (non-blocking): Co-Host #3 name.
- No blockers.

### Session 16 — 2026-04-18 (Claude Code — Phase 5B-1 frontend build + deploy v0.6.0)
**Goal:** Build the Phase 5B-1 frontend — member directory, admin tag management + assignment, member management actions (suspend/ban/delete), admin hub + navbar dropdown, suspended/banned UX, write-attempt guards — and ship as v0.6.0.

**What was done:**
- New shared helpers under `src/lib/memberHelpers.js`: `MEMBER_STATUSES` (value/label/tone triples), `statusLabel`, `statusColorClass`, `ADMIN_TAG_COLORS` (8-swatch palette), `safeTagColor` (regex hex validation).
- Promoted `Modal` primitive to `src/components/ui/Modal.jsx` with a new `variant` prop (`warning` / `danger`) and left `src/components/events/Modal.jsx` as a one-line re-export so EventFormModal stays working without an import sweep.
- Extended `AuthContext`: banned-status → `supabase.auth.signOut()` + `window.location.replace('/login?banned=1')`; suspended-status → new `isSuspended` boolean on the context value. Both statuses flow through `fetchProfile` so they re-check on every auth event.
- Added `/login?banned=1` banner in `Login.jsx` (`.form-error.banned-notice`).
- New components under `src/components/members/`: `AssignAdminTagModal` (toggleable chip grid + optional note; insert/delete on `member_admin_tags` with `assigned_by = user.id`), `ManageMemberModal` (action-based with `ACTION_COPY` map for suspend/unsuspend/ban/unban/delete; calls `set_member_status` / `delete_member` RPCs; delete requires typed display-name confirmation), `MemberCard` (avatar via `usePrivateImage`, dietary pill, status pill admin-only, journey + location, bio, `BadgesInline`, interest chips +N overflow, admin tag colored badges, three-dot menu with contextual action list), `MemberFilters` (search + dietary/journey/state dropdowns, admin-only status + admin-tag dropdowns, interest tag chip toggle row, clear-filters button), `AdminDropdown` (navbar replacement for the static Admin badge, click-outside + Escape dismiss).
- New pages: `MembersDirectory.jsx` at `/members` (one profiles SELECT + parallel fetches of badges, member_tags, member_admin_tags, tags catalog, admin_tags catalog; client-side filter + 20-per-page pagination; AssignAdminTagModal + ManageMemberModal integrated), `AdminAdminTags.jsx` at `/admin/admin-tags` (admin-gated via Navigate; create/edit/delete form with inline ColorPicker component using `ADMIN_TAG_COLORS` + hex text input), `AdminHub.jsx` at `/admin` (tool card grid → /members, /admin/tags, /admin/admin-tags, /forums/admin-hq).
- New `SuspendedBanner.jsx` mounted in `Layout.jsx` below the navbar — sticky amber banner, dismissible per-session via `sessionStorage`, only renders when `isSuspended`.
- Navbar: replaced static `admin-badge` span with `<AdminDropdown />`; added `Members` NavLink after `Courses`.
- Dashboard: added `Members` quick-link; admin row now points to `/admin` hub instead of `/admin/tags`.
- Profile.jsx extensions: admin-only status pill in profile-badges row; admin-only "Internal tags" block with chip row (color swatches via `safeTagColor`) + "Manage tags" button opening `AssignAdminTagModal`; admin-only "Manage member" block with contextual Suspend/Unsuspend, Ban/Unban, and Delete buttons opening `ManageMemberModal`; edit route returns a "profile edits disabled while suspended" panel when `isSuspended`. Both `ProfilePage` and `OtherProfile` wrappers now manage `tagModalOpen` + `manageAction` + `adminTagsVersion` state and render all three modals (AwardBadge, AssignAdminTag, ManageMember) with onChanged → refresh.
- Write-attempt guards: `PostComposer` / `ReplyComposer` render a dashed-border muted panel when `isSuspended`; `RsvpControls` disables each RSVP button with a tooltip and shows a suspended hint below; `LessonView` Mark-Complete button disables with tooltip + muted note; Profile `/profile/edit` route short-circuits to a "disabled" panel.
- New routes in `App.jsx`: `/admin` → `AdminHub`, `/admin/admin-tags` → `AdminAdminTags`, `/members` → `MembersDirectory` (all `ProtectedRoute`-wrapped).
- New styles file `src/styles/members.css` — imported from `styles/index.css`. Covers suspended banner, banned-notice, member filters, member grid + card (with admin-only menu, admin tag badges), status pill tones, admin tag chips + list rows (rich form), color picker, admin hub, admin dropdown, profile admin blocks, assign-tag modal body, manage-member modal body + warning/danger header variants, btn-danger/btn-warning/btn-small utilities, composer disabled states.
- Version: `package.json` bumped `0.5.0` → `0.6.0`.
- Lint: zero errors after fixing two `react-hooks/set-state-in-effect` findings in `SuspendedBanner` and `ManageMemberModal` (both wrapped their setState in the standard `await Promise.resolve()` pattern).
- Build: `npm run build` clean (75 KB CSS gzipped 11.8 KB, 601 KB JS gzipped 167 KB).
- RLS smoke test via `execute_sql`: confirmed `admin_tags` + `member_admin_tags` tables, `profiles.status` column, `set_member_status` + `delete_member` + `is_active_or_admin` functions all exist, and 6 seed admin tags present.
- Committed as `949f3a5` and pushed to `main`. Cloudflare Workers auto-deploy picks up the build.

**Decisions made:**
- `/members` directory uses client-side filtering + pagination against a single `profiles` SELECT (with 4 parallel ancillary fetches at mount). Server-side paging + filter pushdown is overkill at the expected community size and would duplicate the RLS-aware admin/non-admin split that `adminTags` already handles (RLS returns `[]` for non-admins, so the same query works for both).
- Admin tags on profile viewer get their own titled block ("Internal tags"), not inline next to the dietary pill. Keeps operational metadata visually distinct from identity.
- SuspendedBanner dismissal is `sessionStorage`-scoped, not localStorage. Session-scoped = re-surfaces on next login (good — user needs to know), but doesn't pester on every pageview within a session.
- `delete_member` modal requires typing the member's display name. Cascade delete is irreversible; a typed confirmation is the proven speed bump (same pattern as GitHub repo delete).
- Navbar: promoted the static `admin-badge` span to a real `AdminDropdown` component. With five admin surfaces now (`/admin`, `/admin/tags`, `/admin/admin-tags`, `/members`, `/forums/admin-hq`) a non-clickable flag was wasting the prime nav real estate.

**Next Session Handoff:**
- Phase 5B-1 is shipped. Rance should smoke-test on desktop + mobile: browse `/members`, apply filters, view own + another profile, open `AssignAdminTagModal` on a non-admin member, suspend a test account and confirm the banner + composer/RSVP/lesson disables, unsuspend and confirm restoration, try the delete flow on a throwaway test account (hard delete — be sure it's truly disposable).
- **Phase 5B later waves** — pick the next one in Chat before the next Code session. Candidates (roughly in priority):
  1. Member-to-member messaging (approach TBD — in-app DMs vs. email bridge vs. a contact-form pattern). This is still the biggest unbuilt member-facing surface.
  2. Notification system (at minimum: in-app bell with unread count, probably backed by a `notifications` table + a small trigger set on post replies / reactions / badge awards).
  3. Auth-level ban hardening via Edge Function calling `supabase.auth.admin.updateUserById({ ban_duration: '87600h' })`. Builds on Phase 5B-1's RLS gates; removes the "banned user could log in and just read" edge case.
  4. Performance / UX polish + accessibility review + Supabase advisor audit + enable leaked-password protection.
- Open question still open (non-blocking): Co-Host #3 name.
- No blockers.

### Session 15 — 2026-04-18 (Claude Code — Phase 5B-1 schema applied)
**Goal:** Apply the approved Phase 5B-1 schema draft (member directory, internal admin tags, member management, RLS write gates), run both advisors, remediate any new findings, update reference file, commit + push.

**What was done:**
- Applied migration `phase5b1_directory_admin_tags_member_mgmt` via Supabase MCP. Created enum `member_status` (active/suspended/banned); added `profiles.status` column (NOT NULL, DEFAULT 'active') with partial index `profiles_status_idx_v2 WHERE status != 'active'`; created `public.admin_tags` + `public.member_admin_tags` tables with admin-only RLS (4 policies on `admin_tags`, 3 on `member_admin_tags`); 3 FK cover indexes (`admin_tags_created_by_idx`, `member_admin_tags_tag_id_idx`, `member_admin_tags_assigned_by_idx`); 3 SECURITY DEFINER functions (`is_active_or_admin()`, `set_member_status(uuid, member_status)`, `delete_member(uuid)`); 13 RESTRICTIVE write-gate policies across 6 member-writable tables (`forum_posts`, `forum_replies`, `forum_reactions`, `event_rsvps`, `lesson_progress`, `member_tags`); seeded 6 admin tags (Needs Follow-up, VIP, New Member, At Risk, Coaching Lead, Inactive).
- Verified post-apply state via `execute_sql`: `profiles.status` column present with correct enum type and default, `member_status` enum has 3 values in order, both new tables created with `rowsecurity = true`, all 13 RESTRICTIVE `active_gate%` policies registered, all 7 admin tag policies registered, 6 seeded admin tag rows present, all 3 functions exist, partial index exists.
- Ran security advisor: only pre-existing `auth_leaked_password_protection` WARN (dashboard toggle, still deferred). No schema-level findings.
- Ran performance advisor: **zero** `auth_rls_initplan` findings (confirms `(select auth.uid())` wrapping is clean on every new policy and on every call through `is_active_or_admin()`). **Zero** `unindexed_foreign_keys` findings (the draft shipped cover indexes for `admin_tags.created_by`, `member_admin_tags.assigned_by`, and `member_admin_tags.tag_id`). Remaining advisor output is `unused_index` INFOs, all expected on fresh indexes and on the pre-existing forum/event/courses tables — they go green once the Phase 5B-1 frontend lands and real queries hit them.
- Updated reference file: canonical version date (session 15), canonical versions table (schema → v5B1 + Phase 5B-1 draft row as APPLIED), Phase 5 roadmap (5B-1 checklist with schema items checked, 5B later-waves list trimmed), six new entries in Architecture & Design Decisions (RESTRICTIVE gates, `member_status` enum, admin-only tag visibility, hard-delete approach, `is_active_or_admin()` helper, admin self/admin-on-admin guards), Current Status block.
- Copied `Project Reference/PHASE5B1_SCHEMA_DRAFT.sql` to reflect applied reality (file already existed from Chat drafting session; no content change needed).

**Decisions made:**
- Phase 5B-1 handoff expected 14 RESTRICTIVE policies; actual draft SQL has 13 (forum_posts ×2, forum_replies ×2, forum_reactions ×2, event_rsvps ×3, lesson_progress ×2, member_tags ×2). Applied as drafted — this matches the "gate every member write path" intent, and `member_tags` has no UPDATE path (self-select is insert-or-delete only). No remediation needed; handoff number was a miscount.
- Keep `unused_index` INFOs as-is on the new `profiles_status_idx_v2` and admin-tag indexes. They flip to green once the directory/admin UI lands and real queries execute against them.
- Continue deferring leaked-password protection and auth-level ban (Edge Function path) to later 5B waves. Phase 5B-1 gives us profile-status + RLS write gates, which is enough to ship the admin UX; auth-level hardening stacks on top later.

**Next Session Handoff:**
- Begin **Phase 5B-1 frontend** design in Chat before the next Code session.
- Expected frontend scope:
  1. `/members` directory — grid of profile cards (avatar, display_name, dietary pill, journey, location, interest chips, badge row). Text search on `display_name`, dropdown filters for `dietary_approach` / `journey_duration` / `state`, interest-tag multi-select.
  2. Admin overlay on directory — admin-tag filter, status filter (active / suspended / banned), per-card admin tag chips (admin SELECT only), "Manage" dropdown with Assign Tag / Suspend / Unsuspend / Ban / Delete actions.
  3. Admin tag assignment UI — reuse tag management patterns; call `member_admin_tags` insert/delete directly (admin RLS) with optional `note` field.
  4. Member management actions — call `set_member_status(target, 'suspended' | 'banned' | 'active')` and `delete_member(target)` RPCs with confirmation dialogs. Show target's status on profile viewer (admins only) with change history via `updated_at`.
  5. Suspended/banned UX — AuthContext sign-out-if-banned guard on session load; friendly banner + toast text for the RLS error when a suspended user tries to post/reply/RSVP.
  6. `/admin` hub index (deferred from Phase 5A) linking `/admin/tags`, `/members` admin view, and directory filters in one place.
  7. Mobile verification + RLS smoke test (member can see public profiles but not admin tags / status; admin sees everything; suspended user can log in + read but any write returns the restrictive gate error).
- Open question still open (non-blocking): Co-Host #3 name.
- No blockers.

### Session 14 — 2026-04-18 (Claude Code — Phase 5A frontend build + deploy v0.5.0)
**Goal:** Build the Phase 5A frontend — enhanced profile edit + view, badges surfacing inline across the app, interest-tag self-select, admin tag management + badge-award UI — and ship as v0.5.0.

**What was done:**
- New shared primitives under `src/components/profile/`: `DietaryApproachTag` (pill with palette via CSS class), `BadgeIcon` (inline SVG shield + per-type glyph), `BadgesInline` (truncated row with +N overflow), `InterestTagChip` (toggleable / static), `useMemberBadges` (shared data hook), `AwardBadgeModal` (admin award/revoke).
- New `src/lib/profileHelpers.js` with `DIETARY_APPROACHES`, `JOURNEY_DURATIONS`, `US_STATES`, label lookups, `dietaryPaletteClass`, `formatLocation`, `ABOUT_SOFT_LIMIT`, `BADGE_TYPE_LABEL`.
- Extended `AuthContext.updateProfile` with an 8-column allow-list (adds `dietary_approach`, `journey_duration`, `state`, `city`, `about_me`, `my_why`).
- Rewrote `src/pages/Profile.jsx` — one scrollable editor (avatar + two-column personal-info grid + about/my-why textareas + short headline + interest-chip row) and a viewer (dietary pill, journey, location, about, my-why, badge showcase, read-only interest chips). Viewer on `/profile/:id` exposes "Manage badges" to admins. Own profile adds an "Edit profile" link that routes to `/profile/edit`.
- New `src/pages/AdminTags.jsx` — admin-only list/add/delete interest tags; admin-gated via role check + `<Navigate>`. Linked from the dashboard admin quick-links row.
- Routes added in `App.jsx`: `/profile/edit` (same Profile component, edit mode detected via `useLocation`) and `/admin/tags`.
- Wired inline profile meta across feed surfaces: `SpaceView` + `PostCard` (post authors), `ReplySection` + `ReplyItem` (reply authors), `PostDetail` (single-post author), `EventDetail` + `AttendeeList` (attendees), `Dashboard` (welcome header). Each surface fetches `profiles.dietary_approach` + an aggregated `member_badges` join in parallel with its existing load.
- New `src/styles/profiles.css` — dietary palette (6 approaches), shield badge color variants, interest chip filled/outlined states, two-column edit grid with `my-why-section` warmth tint, badge showcase grid, admin tag list, plus mobile breakpoint collapsing to single column. Imported from `styles/index.css`.
- RLS smoke test via `execute_sql`: all four Phase 5A tables have `rowsecurity = true`; 14 expected policies present (badges: select/admin insert/update/delete; member_badges: select/admin insert/admin delete; tags: select/admin insert/update/delete; member_tags: select/insert/delete).
- `npm run lint` clean. `npm run build` clean (568 KB JS / 63 KB CSS gzipped).
- Bumped `package.json` from 0.4.0 → 0.5.0.

**Decisions made:**
- `/profile/edit` route drives editor mode (shareable URL, back-button friendly) over a query param or top-level settings surface.
- Dietary approach pill palette lives in CSS classes (`dietary-tag-{enum}`) so swapping the palette is a one-file edit.
- Badges rendered as inline SVG shields matching the navbar brand mark, recolored per type via `currentColor`.
- Manual badge award surface is restricted to `coach_spotlight`; tenure and course_complete are reserved for future auto-award paths. Already-awarded tenure/course rows still appear in the "Currently awarded" list for visibility.
- Shared `useMemberBadges` hook (dedupe+sort key) so any surface with a set of user IDs can piggyback one query.
- No central profile cache — each surface piggybacks one query alongside its existing load. Premature to centralize.
- `/admin/tags` as a focused page — `/admin` index deferred to Phase 5B when there's more than one tool to house.

**Next Session Handoff:**
- Verify Cloudflare Workers Builds picked up the new bundle and that `/profile/edit`, `/profile/:id`, and `/admin/tags` render live.
- Begin **Phase 5B** planning in Chat: messaging approach (in-app DM table vs. email), internal admin-only tag system (§7 of feature requirements), member directory / search leveraging the new profile fields + tags, notifications (at minimum in-app), and final accessibility + performance advisor sweep before a v1.0 cut.
- Open question still open (non-blocking): Co-Host #3 name.
- No blockers.

### Session 13 — 2026-04-18 (Claude Code — Phase 5A schema applied)
**Goal:** Apply the approved Phase 5A schema draft, run both advisors, remediate any new findings, update reference file, commit + push.

**What was done:**
- Applied migration `phase5a_profiles_badges_tags` via Supabase MCP. Created enums `dietary_approach_type`, `journey_duration_type`, `badge_type`; added 6 nullable columns to `public.profiles`; created tables `public.badges`, `public.member_badges`, `public.tags`, `public.member_tags`; three indexes (`member_badges_badge_id_idx`, `member_tags_tag_id_idx`, `profiles_state_idx`); one `handle_updated_at` trigger on `badges`; 14 RLS policies (4×badges, 3×member_badges, 4×tags, 3×member_tags). Seeded 5 badge catalog rows + 8 starter interest tags (idempotent via `on conflict`).
- Verified post-apply state via `execute_sql`: all 6 profile columns present, all 4 tables created with RLS enabled, 3 enums present, 14 policies registered, 5 badges + 8 tags seeded.
- Ran security advisor: only the pre-existing `auth_leaked_password_protection` WARN (dashboard toggle, still deferred). No schema-level findings.
- Ran performance advisor: **zero** `auth_rls_initplan` findings — confirms the `(select auth.uid())` wrapping is clean across all Phase 5A policies. Two new INFO `unindexed_foreign_keys` findings on `member_badges.awarded_by` and `tags.created_by`.
- Remediated with follow-on migration `phase5a_cover_fk_indexes`: `create index if not exists member_badges_awarded_by_idx` + `tags_created_by_idx`. Re-ran performance advisor — both findings gone. Remaining findings are all `unused_index` INFOs (expected on fresh indexes and also present on legacy forum/events/courses tables — they turn green once real queries hit the indexes).
- Updated reference file: canonical version date (session 13), canonical versions table (schema v5A), Phase 5A checklist advanced, Current Status block.
- Appended the two FK covering indexes into `Project Reference/PHASE5A_SCHEMA_DRAFT.sql` with a note so the reference copy matches applied reality.

**Decisions made:**
- Add covering indexes for FKs to `auth.users` on Phase 5A tables (`member_badges.awarded_by`, `tags.created_by`) even though the findings are INFO-level. Consistent with the project's standard of silencing real advisor findings at the source, and helpful for cascade/set-null performance when a user is deleted.
- Continue deferring leaked-password protection to later Phase 5 waves (no code impact, just a dashboard toggle).
- Keep the `unused_index` INFOs as-is — they turn green once the Phase 5A frontend lands and real queries hit the indexes.

**Next Session Handoff:**
- Begin **Phase 5A frontend** design in Chat before the next Code session.
- Expected frontend scope for Phase 5A:
  1. Profile edit form — new fields for dietary_approach (enum dropdown), journey_duration (enum dropdown), state (US-state dropdown, 2-letter), city (free text), about_me (textarea), my_why (textarea). All optional.
  2. Public profile display — location (city, state), about_me, my_why, awarded badges (with icon/name/description tooltip), self-selected interest tags.
  3. Member self-select tag UI — list available tags from catalog, toggle via `member_tags` insert/delete.
  4. Admin badge-award UI — select member, select badge from catalog, insert `member_badges` row with `awarded_by = auth.uid()`. Revoke = delete.
  5. Mobile verification + RLS smoke test (member sees badges on others' profiles, admin can award/revoke, member can self-select tags but not award badges).
  6. Version bump to v0.5.0 on deploy.
- Open question still open (non-blocking): Co-Host #3 name.
- No blockers.

### Session 12 — 2026-04-18 (Claude Code — Phase 5A schema design)
**Goal:** Draft Phase 5A schema — enhanced profile fields, badges system, interest tags. Design only; do not apply migration.

**What was done:**
- Verified existing `public.profiles` columns (id, email, display_name, bio, avatar_url, role, created_at, updated_at) to confirm the six new columns don't collide.
- Authored `Project Reference/PHASE5A_SCHEMA_DRAFT.sql` (~300 lines):
  - Enums: `dietary_approach_type` (keto, carnivore, paleo, low_carb, ancestral_whole_food, exploring), `journey_duration_type` (just_starting, less_than_6_months, six_months_to_1_year, one_to_3_years, three_plus_years), `badge_type` (course_complete, tenure_1_month, tenure_6_months, tenure_1_year, coach_spotlight).
  - `profiles` ALTER TABLE adds 6 nullable columns: dietary_approach, journey_duration, state (2-letter text), city (text), about_me (text), my_why (text). No RLS changes — existing profiles policies cover.
  - `badges` catalog: id, badge_type (unique), name, description, icon_url, timestamps, `handle_updated_at` trigger.
  - `member_badges`: composite PK (user_id, badge_id), awarded_at, awarded_by (nullable FK → auth.users on delete set null — NULL = auto-awarded).
  - `tags` catalog: id, name (unique), created_by (nullable FK → auth.users), created_at.
  - `member_tags`: composite PK (user_id, tag_id), created_at.
  - Indexes: `member_badges(badge_id)`, `member_tags(tag_id)`, `profiles(state)`.
  - RLS (all new tables, all `auth.uid()` wrapped):
    - `badges`: authenticated SELECT, admin INSERT/UPDATE/DELETE.
    - `member_badges`: authenticated SELECT, admin-only INSERT + DELETE (no UPDATE — revoke=delete).
    - `tags`: authenticated SELECT, admin INSERT/UPDATE/DELETE.
    - `member_tags`: authenticated SELECT, member-or-admin INSERT + DELETE (no UPDATE — pure join).
  - Seeds (idempotent via `on conflict`): 5 badge catalog rows (one per badge_type), 8 starter interest tags (Meal Prep, Fasting, Fitness, Mental Health, Gut Health, Family Meals, Weight Loss, Athletic Performance).
- Updated reference file: canonical version date (session 12), canonical versions table (+ Phase 5A draft row), Phase 5 roadmap split into 5A (this wave) + 5B (later), eight new entries in Architecture & Design Decisions table, Current Status block.

**Decisions made:**
- Phase 5 split into waves. 5A is a cohesive "who is this person?" wave (profile enhancements + badges + interest tags). Messaging, internal admin tags, directory/search, notifications, and polish land in 5B+ waves.
- New profile fields live on `profiles`, not a side table — 1:1 with a member, always read alongside existing profile fields, existing RLS covers them.
- `dietary_approach` and `journey_duration` as enums (consistent filter values for future directory), not free text.
- `state` as 2-letter abbreviation (dropdown on frontend, small stable set); `city` as free text (unbounded set — no catalog worth building).
- `badges` keyed by `badge_type` enum, one row per type. Display metadata editable without migration. `member_badges.awarded_by` nullable for future auto-award triggers.
- No UPDATE policy on `member_badges` — revoke = delete + re-insert.
- Interest tags = admin-curated catalog + member self-selection. Distinct from a future internal admin-only tag table (also in Phase 5B scope per §7 of feature requirements).

**Next Session Handoff:**
- Rance reviews `Project Reference/PHASE5A_SCHEMA_DRAFT.sql`. Push back on any design point (enum values, nullable vs. required, RLS boundaries, seed set).
- On approval: apply as migration `phase5a_profiles_badges_tags` via Supabase MCP. Run `security` + `performance` advisors. Expected: zero new `auth_rls_initplan` findings (all already wrapped); some `unused_index` INFO on fresh indexes (expected). Pre-existing `auth_leaked_password_protection` WARN still deferred.
- Then Phase 5A frontend: profile edit form with new fields (enum dropdowns, US-state dropdown, free-text fields), public profile display (location, about/why, badges, interest tags), member self-select tag UI, admin badge-award UI.
- Open question still open (non-blocking): Co-Host #3 name.
- No blockers.

### Session 11 — 2026-04-18 (Claude Code — Phase 4 LMS frontend build + deploy v0.4.0)
**Goal:** Build `/courses`, `/courses/:slug`, `/courses/:slug/:lessonId`, admin course/module/lesson CRUD, dashboard My Learning card, navbar Courses link, mobile + RLS test, ship v0.4.0.

**What was done:**
- Installed `dompurify` (3.4.x) for `content_html` sanitization in the lesson viewer.
- Created `src/lib/courseHelpers.js` — access-level labels, `slugify`, `flattenLessons`, `computeCourseProgress`, `computeModuleProgress`, `firstIncomplete`, `formatMinutes`, `sumEstimatedMinutes`.
- Built primitives under `src/components/courses/`:
  - `ProgressBar.jsx` — sm/md/lg sizes; gradient swaps to "complete" green when at 100%.
  - `LessonContent.jsx` — `useMemo`-sanitized HTML with iframe/image allow-list, rendered via `dangerouslySetInnerHTML`.
  - `CourseCard.jsx` — cover or emoji placeholder, Unpublished + Premium badges, progress bar or Start CTA.
  - `CourseFormModal.jsx` — full CRUD (title/description/slug/cover/access_level/published); slug auto-derives from title until touched; delete confirmation.
  - `ModuleFormModal.jsx` — title + description scoped to `courseId`, `nextDisplayOrder` prop for new rows.
  - `LessonFormModal.jsx` — metadata only (title + estimated_minutes); creates with empty `content_html`; explicit note that content is SQL-authored.
  - `OrderControls.jsx` — up/down arrow buttons with `isFirst`/`isLast`/`disabled` props.
  - `MyLearningCard.jsx` — most-recent-active course or fallback to first published; thumbnail + progress + Continue/Start/Review CTA.
- Built pages:
  - `src/pages/CoursesHome.jsx` — parallel queries for courses + nested modules/lessons (id only for totals) + user's progress; admin "+ New course" button + CourseFormModal.
  - `src/pages/CourseDetail.jsx` — slug fetch, modules + lessons, accordion expansion per module with one-time auto-expand of first incomplete module via `expandedInitialized` flag (avoids clobbering manual toggles across admin edit re-fetches). Admin: edit course + create/edit module + create/edit lesson + reorder. "Continue / Start / Review" CTA resolves to `firstIncomplete` lesson.
  - `src/pages/LessonView.jsx` — breadcrumbs, lesson title + estimated time, `LessonContent`, Mark Complete upsert on `lesson_progress` (onConflict `user_id,lesson_id`) with celebrate animation, prev/next across module boundaries, sticky module sidebar (collapses <640px), scroll-to-top on lesson change.
- Wired 3 routes in `App.jsx` (all `ProtectedRoute`), added Navbar Courses link, replaced Dashboard's placeholder Courses link with real route and inserted `<MyLearningCard />`.
- Authored `src/styles/courses.css` (~900 lines): progress-bar, course card/grid, accordion module/lesson rows, lesson-view 1fr+260px layout, 720px reading column, typographic styles for `.lesson-content` (h1–h4, p, strong/em/u, a, ul/ol, blockquote, img max-width, 16:9 iframe wrapper), celebrate keyframe on Mark Complete, toggle switch, My Learning card, mobile breakpoints at 960px (sidebar stacks) and 640px (sidebar hidden, stacked layouts). Imported from `index.css`.
- Lint fixes: removed stale `react/no-danger` eslint-disable (rule not in config); moved auto-expand out of a dedicated `useEffect` into `load()` with `expandedInitialized` gate to satisfy `react-hooks/set-state-in-effect`.
- `npm run build` → 545 KB JS / 55 KB CSS, clean. Lint clean.
- Seeded via `execute_sql` (idempotent `on conflict do update`): course `00000000-0000-4000-8000-000000000001` "Foundations of Ancestral Living" (slug `foundations`, published), module "Welcome to The Keep", lesson "Why ancestral living matters" (8 min, 1539-char `content_html` with h2, p+strong+em, bulleted list, h3, image (Unsplash), responsive YouTube iframe, blockquote).
- RLS smoke test via `execute_sql`: confirmed 15 policies. Inserted a transient draft course as service role, simulated as non-admin via `set_config('role','authenticated')` + `request.jwt.claims` → non-admin saw only the published course; `is_admin()` returned false for fake UUID; non-admin INSERT on courses and cross-user INSERT on lesson_progress both denied. Cleaned up the draft after verification.
- Bumped `package.json` to `0.4.0`, committed (d9628f3), pushed to `main`. Polled Cloudflare Workers until the new bundle hashes (`index-En1TdZJP.js` / `index-CJIVLMm9.css`) went live at keto-keep.rance-8c6.workers.dev.

**Decisions made:**
- Added six Phase 4 frontend entries to Architecture & Design Decisions (DOMPurify with iframe allow-list; no WYSIWYG; up/down reorder; read-time "continue" resolution; one-time accordion auto-expand; 720px reading column + sticky sidebar).
- Corrected policy count: 15 policies total (previous entries said 14) — 4 each on courses/modules/lessons + 3 on lesson_progress (no DELETE).

**Next Session Handoff:**
- Begin **Phase 5: Messaging, Badges & Polish**.
- First design pass in Chat: pick an approach for member-to-member messaging (in-app DMs vs. email handoff) and draft the schema for badges/awards + internal tags.
- Also scope in Phase 5: leaked-password protection enable in Supabase dashboard, member directory/search, notification system, final RLS audit across all tables.
- Stretch items deferred from earlier phases: recurring-event RRULE editor (Phase 3), lesson WYSIWYG editor (Phase 4). Land if a concrete need surfaces; otherwise skip.
- Open question still open (non-blocking): Co-Host #3 name.
- No blockers.

### Session 10 — 2026-04-18 (Claude Code — Phase 4 schema applied)
**Goal:** Apply approved Phase 4 LMS schema draft as migration, run both advisors, update reference file.

**What was done:**
- Applied migration `phase4_lms_schema` via Supabase MCP. Created `course_access_level` enum; tables `public.courses`, `public.modules`, `public.lessons`, `public.lesson_progress`; six indexes; four `handle_updated_at` triggers; fifteen RLS policies (4×courses, 4×modules, 4×lessons, 3×lesson_progress — Session 10 entry originally said fourteen; corrected after policy-count audit in Session 11).
- Verified RLS is enabled on all 4 tables and all policies registered as designed (lesson_progress intentionally has no DELETE policy — FK cascades handle cleanup).
- Ran security advisor: only pre-existing `auth_leaked_password_protection` WARN (dashboard toggle, deferred). No schema-level findings.
- Ran performance advisor: zero `auth_rls_initplan` findings (confirms `(select auth.uid())` wrapping is clean). Seventeen INFO `unused_index` findings — all expected on fresh tables with no query history; includes legacy forum/events indexes carried from prior sessions. No action.
- No remediation required.
- Updated reference file: canonical version date (session 10), canonical versions table (schema v4 + Phase 4 draft row), Phase 4 roadmap (schema + RLS checked), five new Phase 4 entries in Architecture & Design Decisions, Current Status block.

**Decisions made:**
- Continue deferring leaked-password protection to Phase 5 (no code impact).
- No per-lesson rich-text editor in Phase 4 — admins push pre-authored HTML via seed data / SQL. Embedded video = `<iframe>` inside `content_html`.
- Progress aggregation stays at query time; no materialized progress columns on courses/modules.
- `course_access_level` is structural-only in Phase 4; premium enforcement lands with payments in Phase 5+.

**Next Session Handoff:**
- Begin Phase 4 **frontend** planning in Chat before the next Code session.
- Expected scope for the first Phase 4 frontend session (subject to Chat refinement):
  1. `/courses` catalog page (published courses only for members, all for admins).
  2. `/courses/:slug` course detail — module list, lesson list with completion state + progress bar.
  3. `/courses/:slug/:lessonId` lesson viewer — rendered `content_html` + "Mark complete" control writing to `lesson_progress`.
  4. Admin course/module/lesson CRUD (reuse Modal primitive from Phase 3 events).
  5. Navbar Courses link, Dashboard quick-link + resume-course card (optional stretch).
  6. Mobile verification + RLS smoke test (member vs admin; published vs draft course).
  7. Bump to v0.4.0 on deploy.
- Reuse patterns: `UserAvatar`, `usePrivateImage` (if cover images go to a private bucket), `Modal` primitive, `(select auth.uid())` pattern for any helper queries, effect deferral via `await Promise.resolve()`.
- Open question still open (non-blocking): Co-Host #3 name.
- No blockers.

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

### Session 22 — 2026-04-19 (Chat + Claude Code — multi-phase)
**Goal:** Owner role + sidebar navigation + referrals + legal + streaks + frames. Massive scope session spanning v0.9.0 through v0.11.1.

**What was done:**

*Chat (design + content + asset generation):*
- Captured all bios + FAQs from Mighty Networks via Chrome MCP → `THE_KETO_KEEP_CONTENT_REFERENCE.md`
- Generated castle hero image + heraldic TKK logo + 9 profile frame images via Gemini prompts
- Processed all frame PNGs to transparent backgrounds + centers
- Designed owner role system, sidebar navigation spec, referral tracking schema, streak system, frame system
- Drafted 3 legal documents (Terms of Use, Privacy Policy, Health Disclaimer)
- Domain strategy: keep `theketokeep.com` on Mighty until cutover

*Code session 22a (v0.9.0):*
- Owner role: `owner` enum value, `is_owner()`, `set_member_role()` RPCs, Rance promoted to owner
- Sidebar navigation: replaced top navbar with collapsible left sidebar (castle stone theme, mobile drawer)

*Code session 22b (v0.10.0):*
- Referral system: `referral_codes` + `referrals` tables, `?ref=` capture on signup, `/invite` admin page
- Self-service account deletion via `delete_own_account()` RPC
- Legal pages at `/terms`, `/privacy`, `/disclaimer` + footer links + signup checkbox

*Code session 22c (v0.11.0):*
- Login streaks: daily tracking with 1-day grace, 7-tier milestone badges (inline SVG), vacation freeze
- Profile frames: `frame_catalog` table, 9 frame types, `FrameSelector`, `ProfileFrame` shared component
- `StreakBadge` inline on sidebar, dashboard, forum posts, member cards

*Code session (v0.11.1 — handed off, completed in Code):*
- Replaced inline SVG frames with Gemini-generated PNG overlays
- Changed avatars from round to square (6px border-radius)
- Moved frame picker to avatar-click modal (FramePickerModal)

**Decisions made:** Owner role via enum, sidebar Option C (immersive castle), TKK-prefixed referral codes, 1-day streak grace, 30-day vacation freeze max, square avatars with PNG frames, avatar-click frame picker modal, 3 free + 6 streak + 1 admin frames, legal pages as public routes, self-service deletion with typed confirmation, contact email `rance.fullspectrumhuman@gmail.com`.

**Next Session Handoff:**
- Verify v0.11.1 deploy (done in Session 23)
- Complete deferred end gate items (done in Session 23)
- Begin Phase 5F: Landing page polish

### Session 23 — 2026-04-19 (Chat + Claude Code — bugfix marathon)
**Goal:** Fix frame/modal bugs from v0.11.1. Complete deferred Session 22 end gate. Profile UX improvements.

**What was done:**
- Start gate: read reference file + Session 22 handoff, confirmed v0.11.1 deployed successfully
- v0.11.2: modal sidebar centering + clip-path frame backing (clip-path caused black rectangles)
- v0.11.3: mask-image frame backing + deduplicate None option (mask misaligned due to width squish)
- v0.11.4: drop-shadow frame backing (single element, but not strong enough for transparent gaps)
- v0.11.5: `maxWidth: 'none'` fix for frame width squish + save exits edit mode + vacation mode modal
- v0.11.6: FRAME_SCALE 1.50 + charcoal mask-image backing (now aligned with maxWidth fix) + tile spacing + profile avatar breathing room
- Completed deferred Session 22 end gate: canonical versions, roadmap, architecture decisions, session logs

**Decisions made:** Modal backdrop sidebar offset, frame backing iterated through clip-path → mask-image → drop-shadow → charcoal mask-image (with maxWidth fix), FRAME_SCALE 1.50/OFFSET 0.25 for full avatar visibility, vacation mode as modal on streak area, save navigates to profile view.

**Next Session Handoff:**
- Begin **Phase 5F: Landing page polish**
- Content source: `THE_KETO_KEEP_CONTENT_REFERENCE.md`
- Assets: `bgfullcastle.png` (hero), `tkklogotransparent.png` (logo)
- Scope: hero section, value propositions, team bios, FAQ section, brand CTAs
- Justine admin seed (email: `jvrbrts@gmail.com`)
- Domain planning (`theketokeep.com` currently on Mighty Networks)
- Copy dated reference file: `THE_KETO_KEEP_PROJECT_REFERENCE_2026-04-19_S23.md` (first Code task — Chat can’t copy files on user filesystem)
- No blockers. Ready to build.

### Session 24 — 2026-04-19 (Claude Code — frame PNG update + ProfileFrame simplification)
**Goal:** Replace all 9 Gemini-generated frame PNGs with custom hand-crafted versions (charcoal backing baked into PNG). Simplify ProfileFrame.jsx to two-layer component (avatar + frame overlay, no CSS hacks).

**What was done:**
- v0.11.7: clip-path evenodd backing + profile spacing fixes (avatar-wrap margin, first profile-block border-top removal, picker tile gap)
- v0.11.8: charcoal (#2a2a2a) + evenodd clip-path + 5× stacked mask-image with maskComposite:add; profile-frame margin-top 35px for name alignment
- v0.11.9: removed all mask properties; backing is pure #2a2a2a + evenodd clip-path; frame picker preview spacing
- v0.11.10: replaced all 9 Gemini PNGs with Rance’s custom hand-crafted frame PNGs (charcoal backing baked in); ProfileFrame simplified to avatar span + frame img (no backing spans, clip-paths, masks, z-index). Updated logo + hero image in `public/`.

**Decisions made:** Baking charcoal backing into PNG is the definitive solution — zero CSS hacks, frame artist controls exact backing shape. Two-layer ProfileFrame (avatar + overlay) is the final architecture.

**Next Session Handoff:**
- Frame rendering complete. No outstanding frame issues.
- Next: Phase 5F landing page polish (Code session), then messaging or auth-ban.

### Session 25 — 2026-04-19 (Claude Code — Phase 5F landing page + reply count bugfix)
**Goal:** Rewrite public landing page (Phase 5F) + fix forum reply count showing "0" until clicked.

**What was done:**
- Fixed SpaceView.jsx reply count bug: moved `await hydrateMeta(rows)` before `setPosts(rows) + setLoading(false)` in the initial-load effect; added cancellation re-check after the await. Same fix in `loadMore` (hydrateMeta before setPosts). Reply counts now render correctly on first load.
- Created `src/styles/landing.css` — full responsive design system: hero with castle bg + dark overlay, slogan bar, value prop grid (2×2+1), coach cards, FAQ accordion, final CTA section. Mobile-first ≤768px breakpoints. Dark mode aware via CSS variables.
- Rewrote `src/pages/Landing.jsx` — 6 sections: hero (logo + tagline + dual CTA), "Keep Calm" slogan bar, 5 value props with inline SVG icons, Meet the Team (Justine first, then Rance — full 3-paragraph bios), 7-item FAQ accordion (useState), dark final CTA.
- All copy sourced verbatim from `THE_KETO_KEEP_CONTENT_REFERENCE.md`.
- Added `@import ‘./landing.css’` to `src/styles/index.css`.
- Version bumped 0.11.10 → 0.12.0. Lint clean, build clean (448ms). Committed + pushed.

**Decisions made:** Justine’s coach card renders first (Rance’s explicit preference — respect for co-host). Landing page sections use opaque backgrounds to cover body castle wallpaper. Hero and final CTA always dark regardless of theme mode. Inline SVG icons for value props (no emoji, no external icon lib). FAQ uses single-open accordion (null = all closed, index = open item).

**Next Session Handoff:**
- v0.12.0 is live. Verify at keto-keep.rance-8c6.workers.dev while logged out → new landing page renders.
- Next candidates (decide in Chat): member-to-member messaging, auth-level ban hardening via Edge Function, notification preferences, Supabase leaked-password toggle.
- No blockers.

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

### Session 9 — 2026-04-18 (Claude Code — Phase 3 frontend build + deploy v0.3.0)
**Goal:** Build `/events` + `/events/:id`, admin event CRUD, dashboard Upcoming Events card, navbar link, mobile + RLS test, ship v0.3.0.

**What was done:**
- Created `src/lib/eventHelpers.js` — enum labels, RSVP labels/emoji, date formatters, YouTube URL parser (watch/youtu.be/shorts/embed), `datetime-local` ↔ ISO round-trip.
- Built shared primitives under `src/components/events/`:
  - `EventTypeBadge.jsx` — subtle tinted pill per type.
  - `YoutubeEmbed.jsx` — IntersectionObserver-gated iframe (200px rootMargin), lazy loaded.
  - `Modal.jsx` — reusable modal primitive (backdrop click, Escape key, body scroll lock).
  - `RsvpControls.jsx` — three-way RSVP buttons (attending/maybe/declined) with Supabase upsert + toggle-off delete.
  - `AttendeeList.jsx` — Going / Maybe groups with UserAvatar + profile link chips.
  - `EventCard.jsx` — upcoming-event card with date block, badges, truncated description, attendee count footer, inline RSVP.
  - `EventFormModal.jsx` — admin create/edit/delete form inside Modal primitive. Validates title, start, end-after-start, parseable YouTube URL.
  - `UpcomingEventsCard.jsx` — dashboard panel showing next 2 upcoming events with "See all →" link.
- Built pages:
  - `src/pages/EventsHome.jsx` — `/events`. Parallel queries for upcoming (scheduled/live, ASC) and past (completed + youtube, DESC, limit 12). Single RSVP fetch keyed by `event_id`. Optimistic RSVP updates. Admin: "+ New event" header button + per-card edit.
  - `src/pages/EventDetail.jsx` — `/events/:id`. Fetches event, RSVPs, attendee profiles. Branches render: upcoming shows description + zoom CTA + RSVP + "Who's coming"; completed shows YouTube embed front-and-center + description + "Who was there". Admin edit opens form modal.
- Wired routes (`/events`, `/events/:id` — both `ProtectedRoute`), added navbar Events link, replaced dashboard's "Events coming soon" disabled-link with real link + inserted `<UpcomingEventsCard />`.
- Authored `src/styles/events.css` (~530 lines) — matches forum card rhythm, subtle type-badge palette, full event-detail layout, modal primitive styles, 560px mobile breakpoint. Imported from `index.css`.
- Lint pass → fixed `react-hooks/set-state-in-effect` and `react-hooks/preserve-manual-memoization` by (a) deferring effect setState via `await Promise.resolve()`, (b) using `user` (not `user?.id`) in useCallback deps.
- `npm run build` → 490 KB JS / 34 KB CSS, clean.
- RLS smoke test via SQL (`execute_sql`): confirmed 8 policies across events + event_rsvps, all `auth.uid()` wrapped in `(select ...)`.
- Bumped `package.json` to `0.3.0`, rebuilt to confirm footer pulls from `pkg.version`, committed + pushed — Cloudflare auto-deploy picks up from `main`.

**Decisions made:**
- Modal as a new primitive (see Architecture & Design Decisions table). Lives under `components/events/` until a second feature needs it.
- Subtle per-type badge palette — community bulletin board, not corporate calendar.
- Effect data-loaders always defer setState via `await Promise.resolve()` (matches SpaceView pattern and satisfies React Compiler lint rules).

**Next Session Handoff:**
- Begin **Phase 4: Lifestyle Course / LMS**.
- First design pass: `courses`, `modules`, `lessons`, `lesson_progress` schema + RLS. Reuse `(select auth.uid())` wrapping, `is_admin()`, `handle_updated_at()` pattern.
- Scope call needed up-front: lesson content format (markdown text, embedded video, both?) and whether progress is per-lesson-completed or per-percent-watched.
- Recurring event UI is still deferred — if scheduling needs it before Phase 5 polish, add a lightweight RRULE editor before LMS lands.
- Open question still open (non-blocking): Co-Host #3 name.
- No blockers.

### Session 8 — 2026-04-18 (Claude Code — Phase 3 schema applied)
**Goal:** Apply Phase 3 schema, run both advisors, fix any findings. No frontend build this session.

**What was done:**
- Updated `Project Reference/PHASE3_SCHEMA_DRAFT.sql` per Rance's review: `event_type` enum value `meetup` replaced with `coaching_circle`. Final set: `live_call`, `workshop`, `q_and_a`, `special_guest`, `coaching_circle`, `other`. `end_time` confirmed nullable. `event_rsvps.SELECT` stays open to all authenticated.
- Applied migration `phase3_events_schema` via Supabase MCP. Created tables `public.events`, `public.event_rsvps`, three enums, six indexes, two `handle_updated_at` triggers, nine RLS policies.
- Ran security advisor: only pre-existing `auth_leaked_password_protection` WARN (dashboard toggle, deferred). No schema-level findings.
- Ran performance advisor: zero `auth_rls_initplan` findings (confirms the `(select auth.uid())` wrapping pattern is applied correctly). Eleven INFO-level `unused_index` findings — all expected on fresh tables with no query history yet; includes legacy forum indexes that were also flagged last session. No action.
- No remediation required.

**Decisions made:**
- Defer enabling leaked-password protection to Phase 5 (Polish) — it's a dashboard toggle with no code impact, and it sometimes affects signup UX during development.
- Keep the "unused_index" findings as-is — they turn green automatically once real queries hit the indexes in Phase 3 frontend.

**Next Session Handoff:**
- Begin Phase 3 **frontend build** (Claude Code, Opus 4.7).
- Scope for the first Phase 3 frontend session:
  1. `/events` page — upcoming events list + past livestreams section (YouTube embeds).
  2. `/events/:id` detail page — full description, zoom link (all authenticated), RSVP action + attendee count.
  3. Admin event CRUD — create/edit/delete forms (admins only). Recurrence UI intentionally deferred.
  4. Navbar link for "Events". Dashboard quick-link activation.
  5. Mobile verification + RLS smoke test (member vs admin).
  6. Bump version to v0.3.0 on deploy.
- Reuse patterns from Phase 2: `UserAvatar`, `usePrivateImage` (if event images added later — not scoped now), existing admin-gating via `useAuth` + `is_admin`.
- Open question still open (non-blocking): Co-Host #3 name.

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

- Name of Co-Host #3 (for admin seeding; Co-Host #2 confirmed: Justine Roberts, email: jvrbrts@gmail.com)
- Custom domain cutover timing (`theketokeep.com` owned, currently pointing to Mighty Networks — switch after landing page ready + members notified)
- Messaging approach: in-app DMs vs. email-based communication (deferred post-launch)

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