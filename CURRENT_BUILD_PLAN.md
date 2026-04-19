# CURRENT BUILD PLAN — Phase 5C: Owner Role + Sidebar Navigation

> **Session goal:** Add the `owner` role tier to the database, rebuild the app layout from top-navbar to collapsible sidebar navigation, and deploy as v0.9.0.
> **Created:** 2026-04-19 (Session 22 Chat)

---

## Phase 5C-1: Owner Role Schema (do first — small, unblocks role management UI)

### Schema changes (via Supabase MCP execute_sql)

- [x] **1A.** Add `owner` value to `app_role` enum:
  ```sql
  ALTER TYPE public.app_role ADD VALUE 'owner';
  ```

- [x] **1B.** Create `is_owner()` SECURITY DEFINER function:
  ```sql
  CREATE OR REPLACE FUNCTION public.is_owner()
  RETURNS boolean
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
  BEGIN
    RETURN EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'owner'
    );
  END;
  $$;
  ```

- [x] **1C.** Update `is_admin()` to include owner (owner is a superset of admin):
  ```sql
  CREATE OR REPLACE FUNCTION public.is_admin()
  RETURNS boolean
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
  BEGIN
    RETURN EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
      AND role IN ('admin', 'owner')
    );
  END;
  $$;
  ```

- [x] **1D.** Create `set_member_role(target_id uuid, new_role app_role)` SECURITY DEFINER function:
  - Guard: caller must be owner (`is_owner()`)
  - Guard: cannot change own role
  - Guard: cannot set role to `owner` (only one owner, ever)
  - Guard: target must exist
  - Executes: `UPDATE profiles SET role = new_role WHERE id = target_id`
  - Returns: the new role as text

- [x] **1E.** Promote Rance to `owner`:
  ```sql
  -- Disable trigger, update, re-enable (same bootstrap pattern as Phase 1)
  ALTER TABLE public.profiles DISABLE TRIGGER on_role_change_attempt;
  UPDATE public.profiles SET role = 'owner' WHERE email = 'rancepants@gmail.com';
  ALTER TABLE public.profiles ENABLE TRIGGER on_role_change_attempt;
  ```

- [x] **1F.** Update `protect_role_change` trigger to allow owner to change roles:
  - Current trigger prevents all non-admin role changes
  - Updated: allow if caller `is_owner()`, OR if the change is being done by `set_member_role` (SECURITY DEFINER bypasses the trigger's RLS check)
  - Actually verify: does the SECURITY DEFINER function bypass the trigger? If yes, the trigger might not need changes. Test this.

- [x] **1G.** Run security + performance advisors. Expected: no new findings.

- [x] **1H.** Verify via SQL: `SELECT id, email, role FROM profiles WHERE role = 'owner';` → Rance's row.

### Frontend changes for owner role

- [x] **1I.** Update `AuthContext` — add `isOwner` boolean (true when `profile.role === 'owner'`). Keep `isAdmin` true for both admin and owner.

- [x] **1J.** Add role management UI to `Profile.jsx` (owner view of other members):
  - "Promote to Admin" button (visible when viewing a `member`, only for owner)
  - "Demote to Member" button (visible when viewing an `admin`, only for owner)
  - Calls `set_member_role` RPC
  - Confirmation modal (Modal variant="warning")
  - Never shows on own profile or on other owners

- [x] **1K.** Update `ManageMemberModal` — hide suspend/ban/delete actions when target is `owner` (same guard as admin-on-admin, extended to owner)

---

## Phase 5C-2: Sidebar Navigation (layout overhaul)

### New components to create

- [x] **2A.** `src/components/ui/Sidebar.jsx` — the main sidebar component:
  - **Desktop (≥768px):** Fixed left panel, ~260px wide, always visible
  - **Mobile (<768px):** Slide-in drawer from left, triggered by hamburger in slim top bar
  - **Structure from top to bottom:**
    - Logo block: TKK heraldic crest logo (transparent PNG) + "The Keto Keep" text
    - User block: avatar + display name + dietary approach pill (compact)
    - Nav sections with headers:
      - **Community:** Forums, Events, Members
      - **Learning:** Courses
      - **My Stuff:** My Profile, Invite Friends (placeholder for Phase 5D)
      - **Admin** (owner/admin only): Admin Hub, Tags, Admin Tags
    - Footer block: Theme toggle + notification bell + version
  - Active route highlighted with warm accent (castle-torch amber)
  - Castle stone texture background (subtle, via CSS — NOT the full bg image)
  - Warm ambient glow/accent at top (like firelight)
  - Collapse animation on mobile: slide from left with backdrop overlay

- [x] **2B.** `src/components/ui/SidebarMobileHeader.jsx` — slim top bar for mobile only:
  - Hamburger icon (left) → toggles sidebar drawer
  - "The Keto Keep" text or small logo (center)
  - Notification bell (right) — moved from old navbar

- [x] **2C.** `src/components/ui/SidebarNavLink.jsx` — individual nav item:
  - Icon (emoji or simple SVG) + label + optional badge (unread count, etc.)
  - Active state detection via `useLocation`
  - onClick closes mobile drawer

- [x] **2D.** `src/components/ui/SidebarSection.jsx` — section wrapper:
  - Section title (small caps, muted) + children nav links
  - Collapsible on mobile (optional — might not need this complexity)

### Layout changes

- [x] **2E.** Rewrite `src/components/Layout.jsx`:
  - Remove `<Navbar />` import entirely
  - New structure: `<div className="app-layout">` containing `<Sidebar />` + `<main className="main-content">` + (mobile) `<SidebarMobileHeader />`
  - `<main>` gets `id="main-content"` and skip-link target (preserve a11y)
  - Footer moves inside `<main>` (scrolls with content, not fixed)
  - SuspendedBanner stays inside `<main>` (below mobile header, above content)

- [x] **2F.** Delete or gut `src/components/Navbar.jsx`:
  - Everything moves to Sidebar — navbar is no longer needed
  - Keep the file temporarily as reference, delete after verification

- [x] **2G.** Move `NotificationBell` from Navbar to Sidebar footer (desktop) and SidebarMobileHeader (mobile)

- [x] **2H.** Move `ThemeToggle` from Navbar to Sidebar footer

- [x] **2I.** Move `AdminDropdown` functionality into Sidebar "Admin" section (no dropdown needed — it's just nav links now)

### Styling

- [x] **2J.** New `src/styles/sidebar.css`:
  - `.sidebar` — fixed left, 260px, full height, `overflow-y: auto`
  - Background: subtle stone texture via CSS gradient or very muted bg-image tint (NOT the full castle image — that stays on body). Consider: `background-color: var(--sidebar-bg)` with a stone-like warm charcoal
  - Warm accent glow at top (radial gradient, amber/orange, very subtle)
  - `.sidebar-logo` — centered logo image, max 80px
  - `.sidebar-brand` — "The Keto Keep" in warm gold/parchment, medieval-ish feel
  - `.sidebar-user` — compact user card (avatar 36px + name + dietary pill)
  - `.sidebar-section-title` — uppercase, small, muted, letter-spaced
  - `.sidebar-nav-link` — full-width row, padding, hover highlight, active accent bar (left border, 3px, amber)
  - `.sidebar-footer` — bottom-pinned, contains theme toggle + bell + version
  - Mobile drawer: `transform: translateX(-100%)` → `translateX(0)` transition, backdrop overlay
  - Dark mode: stone tones darken, accent glow warms
  - Light mode: parchment sidebar with subtle warmth

- [x] **2K.** Update `src/styles/layout.css`:
  - `.app-layout` — flex row: sidebar + main-content
  - `.main-content` — `margin-left: 260px` on desktop, `margin-left: 0` on mobile
  - Remove old `.app-shell` navbar-related layout rules
  - Preserve background image + overlay behavior on body / .app-shell

- [x] **2L.** Update `src/styles/base.css` — add new CSS variables:
  - `--sidebar-bg`, `--sidebar-bg-dark`, `--sidebar-text`, `--sidebar-accent`, `--sidebar-hover`, `--sidebar-active-border`, `--sidebar-section-title`, `--sidebar-glow` (both light + dark theme blocks)

- [x] **2M.** Audit all 10 stylesheets for any `nav`/`.navbar` references that need updating

### Route and page adjustments

- [x] **2N.** Update `App.jsx` — verify all routes still work with the new layout wrapper

- [x] **2O.** Public landing page (unauthenticated) — should NOT show the sidebar. Keep it full-width with its own layout (or a minimal header). The sidebar is for the authenticated community experience only.

- [x] **2P.** Login / Signup / Password Reset pages — also no sidebar. These are pre-auth flows.

### Testing

- [x] **2Q.** Desktop verification: sidebar visible, content area properly offset, all nav links work, active states correct, theme toggle works, bell works, admin section only for admins

- [x] **2R.** Mobile verification: hamburger opens drawer, drawer closes on nav click, drawer closes on backdrop click, drawer closes on Escape, content not scrollable when drawer is open

- [x] **2S.** Keyboard/a11y: skip-to-main-content still works, Tab order is logical (sidebar links → main content), drawer focus-trapped on mobile when open

- [x] **2T.** Dark mode: sidebar colors adapt, glow adjusts, all contrast ratios acceptable

---

## Final steps

- [x] **3A.** Copy new logo files into `public/` directory (tkk-logo-transparent.png for sidebar, tkk-logo-with-bg.png as asset)
- [x] **3B.** `npm run lint` — zero errors
- [x] **3C.** `npm run build` — clean
- [x] **3D.** Bump `package.json` to `0.9.0`
- [x] **3E.** Git commit with descriptive message, push to main
- [x] **3F.** Verify Cloudflare Workers auto-deploy

---

## Notes for Claude Code

- The sidebar stone texture should be achieved via CSS (gradients, subtle patterns), NOT by loading the castle background images into the sidebar. The castle images stay on `body` as the page background.
- The sidebar should feel like the interior wall of the keep — warm, sturdy, slightly rough texture.
- The ambient glow at the top of the sidebar should evoke torchlight — a very subtle radial gradient from warm amber to transparent, maybe 80px tall.
- Nav link icons: use simple emoji or Unicode for now (🏰 Forums, 📅 Events, 👥 Members, 📚 Courses, 👤 Profile, 🔗 Invite, ⚙️ Admin). SVG icons can come later.
- The "Invite Friends" nav link is a placeholder that shows "Coming soon" or just doesn't navigate yet. The referral system builds in Phase 5D.
- Preserve ALL existing functionality — this is a layout change, not a feature change. Every page, modal, and interaction should work exactly as before, just with sidebar nav instead of top nav.
