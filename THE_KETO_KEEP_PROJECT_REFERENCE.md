# The Keto Keep — Community Platform Project Reference

> **This file is the single source of truth for the community platform build.**
> It must be shared at the start of every new chat session within this project.
> It must be updated at the end of every session before closing.
> **Canonical version date:** 2026-04-18

---

## SESSION PROTOCOLS

### Session Start Gate (mandatory — do NOT skip)
At the beginning of every new chat in this project:

1. **Share this file** with Claude at the start of the conversation.
2. Claude reads the file and confirms:
   - Current project phase and status
   - Canonical versions of all deployed artifacts (if any exist yet)
   - What was completed in the last session
   - What the next priorities are based on the roadmap
   - Any open blockers or decisions needed
3. **Version verification:** If any deployed code exists, Claude must verify that the versions listed in this file match what's actually deployed. If there's a mismatch → **STOP.** Resolve before proceeding.
4. **Agree on the session goal** before writing any code or making any changes.
5. Do NOT begin work until the start gate is complete.

### Session End Gate (mandatory — 8 items)
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
- **Co-Host #2** — NBC-HWC (name TBD)
- **Co-Host #3** — NBC-HWC (name TBD)

All three co-hosts need full admin access within the platform.

---

## CANONICAL VERSIONS

> Update this section whenever a deployed artifact's version changes.
> **Mismatch between this file and what's deployed = STOP and resolve.**

| Artifact | Version | Location |
|----------|---------|----------|
| Frontend app | *not yet created* | Cloudflare Pages |
| Supabase schema | *not yet created* | Supabase project TBD |

*(This table will grow as artifacts are created. Every deployable artifact gets a row.)*

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
| **Frontend** | React (via Cloudflare Pages) | Free |
| **Auth** | Supabase Auth | Free tier |
| **Database** | Supabase (PostgreSQL) | Free tier |
| **File Storage** | Supabase Storage | Free tier |
| **Hosting** | Cloudflare Pages | Free tier |
| **DNS/CDN** | Cloudflare | Free tier |
| **Repo** | GitHub (`RancePants/keto-keep`) | Free |

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
- Cloudflare Pages provides fast, global hosting with automatic deployments from GitHub
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

## CLOUDFLARE PAGES GOTCHAS (learned from MST/FSH)

### Deployment
- GitHub → Cloudflare Pages auto-deploy is the preferred pipeline (set up in Phase 1)
- For React apps, build command is typically `npm run build`, output directory `dist` or `build`
- Custom domains can be added later — the free `*.pages.dev` subdomain works fine for development

### Routing
- **`_redirects` file gotcha:** `200` rewrites targeting files in different paths can cause invisible redirects that break `window.location.pathname`. Use `301` redirects to query params instead if you need path-based routing.
- For SPAs (React Router), you'll need a `/* /index.html 200` catch-all rule — but be aware of the rewrite behavior above.

### Mobile
- **Never embed the app in iframes** on external sites. iframes fundamentally break native mobile behavior (scrolling, touch events, viewport). This was a hard lesson from the FSH website migration. If The Keto Keep needs to be embedded anywhere, use direct links instead.

---

## PHASED ROADMAP

### Phase 1: Foundation 🔲 (NOT STARTED)
- [ ] Create GitHub repo (`RancePants/keto-keep`)
- [ ] Scaffold React project (Vite recommended for Cloudflare Pages compatibility)
- [ ] Supabase project setup (new project, separate from MST)
- [ ] Database schema design: `profiles` table (extends `auth.users`), `roles` enum
- [ ] RLS policies for profiles table
- [ ] Auth flow: email signup, login, logout, password reset
- [ ] Role system: member, admin (seeded for all 3 co-hosts)
- [ ] Public landing page (pre-login)
- [ ] Member dashboard / landing page (post-login)
- [ ] Basic member profile page (view + edit own)
- [ ] Cloudflare Pages deployment pipeline (GitHub auto-deploy)
- [ ] Navigation shell and routing (React Router)
- [ ] Mobile-responsive layout from the start (not a Phase 5 afterthought)
- [ ] Add version endpoint or version display (for deploy verification)

### Phase 2: Forums 🔲 (NOT STARTED)
- [ ] Database schema: `forum_spaces`, `forum_posts`, `forum_replies`
- [ ] RLS policies for all forum tables (admin-only space enforcement)
- [ ] Create the 4 forum spaces (General, Help, Wins, Admin HQ)
- [ ] Post creation and display
- [ ] Reply/comment threading
- [ ] Admin moderation tools (pin, edit, delete posts)
- [ ] Admin HQ access restricted to admin role
- [ ] Image support in posts (Supabase Storage — decide public vs. private bucket)
- [ ] Pagination for post lists (don't load everything at once)

### Phase 3: Events & Media 🔲 (NOT STARTED)
- [ ] Database schema: `events`, `event_rsvps`
- [ ] RLS policies for events tables
- [ ] Event creation (admin only)
- [ ] Event listing / calendar view
- [ ] RSVP functionality for members
- [ ] Zoom link display (members only or post-RSVP)
- [ ] Past livestreams section with YouTube embeds
- [ ] Admin management of events and recordings

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
| | | |

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

### Cloudflare Pages _redirects can silently break routing
`200` rewrites targeting `.html` files in different paths cause invisible redirects that break `window.location.pathname`. For an SPA, keep it simple: `/* /index.html 200` and let React Router handle everything.

### iframes break mobile — never use them for embedding
The entire FSH website migration was motivated by discovering that iframe-embedded tools fundamentally break native mobile scrolling, touch events, and viewport behavior. If The Keto Keep ever needs to appear on another site, use direct links.

### Large file writes can be unreliable
For files over ~250KB, `Filesystem:write_file` can be unreliable. Use `present_files` for delivery and hand off to Claude Code for local saves and deploys when dealing with large artifacts.

### Test everything on mobile during development
Don't save "mobile responsiveness pass" for Phase 5. Test on mobile (or at minimum, resize your browser) after every significant UI addition. Fixing layout at the end is 10x more work than building responsive from the start.

### Git is the safety net — commit early and often
Every meaningful change gets committed. Descriptive commit messages. Push after every session. The git history is your undo button.

---

## CURRENT STATUS

**Current Phase:** Pre-Phase 1
**Last Updated:** 2026-04-18
**Status:** Project reference file created and refined with MST lessons. No code written yet. Ready to begin Phase 1.

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
- Rewrote session protocols with version verification and 8-item end gate (matching MST rigor)
- Added Canonical Versions tracking section
- Added Supabase Patterns & Gotchas section (RLS-first, storage buckets, SQL escaping, auth patterns)
- Added Cloudflare Pages Gotchas section (redirects, mobile/iframe, deployment)
- Added Lessons Learned section with 9 hard-won MST lessons
- Added interface routing and code handoff format
- Expanded Phase 1 roadmap (mobile-responsive from start, version endpoint, GitHub repo creation)
- Added RLS policy tasks to every phase
- Added pagination to Phase 2 forums
- Added security/performance audit to Phase 5
- Updated architecture decisions table with 4 new entries
- Added GitHub repo to tech stack table
- Confirmed repo name: `RancePants/keto-keep`
- Confirmed local directory: `D:\The Keto Keep`

**Decisions made:**
- RLS-first schema design (never retrofit)
- Mobile-responsive from Phase 1 (not Phase 5)
- Separate Supabase project from MST
- Version tracking from day one
- Vite recommended over Create React App for Cloudflare Pages compatibility
- GitHub repo name: `RancePants/keto-keep`
- Local project directory: `D:\The Keto Keep`

**Next Session Handoff:**
- Same as Session 1 — begin Phase 1: Foundation
- The reference file is now ready to support a clean, informed build
- No blockers. Ready to build.

---

## OPEN QUESTIONS & DECISIONS NEEDED

- Names of Co-Host #2 and Co-Host #3 (for admin seeding)
- Community branding: logo, color palette, typography (can be decided later, but needed before public launch)
- Custom domain name (if desired — Cloudflare Pages provides a free `*.pages.dev` subdomain to start)
- Messaging approach in Phase 5: in-app DMs vs. email-based communication
- Avatar storage: public or private Supabase bucket? (public is simpler; private is more secure)

---

## REFERENCE LINKS

- GitHub Repo: https://github.com/RancePants/keto-keep
- Supabase Dashboard: https://supabase.com/dashboard
- Cloudflare Pages Dashboard: https://dash.cloudflare.com
- Mighty Networks (current, to be shut down): The Keto Keep
- Supabase Docs (auth): https://supabase.com/docs/guides/auth
- Supabase Docs (RLS): https://supabase.com/docs/guides/auth/row-level-security
- Cloudflare Pages Docs: https://developers.cloudflare.com/pages

---

*End of project reference file. Keep this file up to date across every session.*
