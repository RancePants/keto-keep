# CURRENT BUILD PLAN — Phase 5D: Referral System + Self-Delete + Legal Pages

> **Session goal:** Add referral tracking system with invite button, member self-service account deletion, and legal pages (Terms, Privacy, Disclaimer). Deploy as v0.10.0.
> **Created:** 2026-04-19 (Session 22 Chat)

---

## Phase 5D-1: Schema Changes (Supabase MCP execute_sql)

### Referral system tables

- [x] **1A.** Create `referral_codes` table:
  ```sql
  CREATE TABLE public.referral_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code text NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now()
  );
  CREATE INDEX referral_codes_user_id_idx ON public.referral_codes(user_id);
  ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
  ```

- [x] **1B.** Create `referrals` table:
  ```sql
  CREATE TABLE public.referrals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code_used text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(referred_id)  -- a member can only be referred once
  );
  CREATE INDEX referrals_referrer_id_idx ON public.referrals(referrer_id);
  CREATE INDEX referrals_referred_id_idx ON public.referrals(referred_id);
  ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
  ```

- [x] **1C.** Add `referred_by` column to profiles:
  ```sql
  ALTER TABLE public.profiles
    ADD COLUMN referred_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  ```

- [x] **1D.** RLS policies for `referral_codes`:
  - SELECT: authenticated can read own codes (`(select auth.uid()) = user_id`)
  - INSERT: authenticated can create own codes (`(select auth.uid()) = user_id`), gated by `is_active_or_admin()`
  - DELETE: own codes only (`(select auth.uid()) = user_id`)
  - Admin SELECT: admins can read all codes (for stats)

- [x] **1E.** RLS policies for `referrals`:
  - SELECT: authenticated can read own referrals (where `referrer_id = (select auth.uid())`)
  - INSERT: system-level only via SECURITY DEFINER function (see 1F)
  - Admin SELECT: admins can read all referrals (for stats)

- [x] **1F.** Create `record_referral(p_referred_id uuid, p_code text)` SECURITY DEFINER function:
  - Looks up the referral code → gets `referrer_id`
  - Guards: code must exist, referred_id must not already have a referral row
  - Inserts into `referrals` + updates `profiles.referred_by`
  - Called during signup flow when `?ref=` param is present

- [x] **1G.** Create `generate_referral_code(p_user_id uuid)` SECURITY DEFINER function:
  - Generates a short alphanumeric code (8 chars, uppercase)
  - Inserts into `referral_codes`
  - Returns the code
  - Guard: caller must be the user or admin

- [x] **1H.** RESTRICTIVE write-gate on `referral_codes` INSERT calling `is_active_or_admin()` (suspended members can't generate invite links)

### Self-service account deletion

- [x] **1I.** Create `delete_own_account()` SECURITY DEFINER function:
  - Gets `(select auth.uid())` as the caller
  - Guard: caller must not be owner (owner can't self-delete — platform would be orphaned)
  - Calls the existing cascade delete pattern: `DELETE FROM auth.users WHERE id = caller_id`
  - Returns success boolean
  - Note: this is similar to `delete_member()` but without the admin guard — it only operates on self

### Run advisors

- [x] **1J.** Run security + performance advisors. Remediate any findings.

---

## Phase 5D-2: Referral System Frontend

- [x] **2A.** Create `src/lib/referralHelpers.js`:
  - `generateCode()` — calls `generate_referral_code` RPC or inserts directly
  - `getMyCode()` — fetches the user's existing referral code (or generates one on first access)
  - `getMyReferrals()` — fetches referral count + list of referred members
  - `buildInviteUrl(code)` — returns `https://theketokeep.com/join?ref={code}` (or the workers.dev URL pre-domain-cutover)

- [x] **2B.** Create `src/pages/InviteFriends.jsx` (replaces the "SOON" placeholder):
  - Shows the user's unique invite link with a "Copy link" button (clipboard API)
  - Native share button on mobile (Web Share API with fallback to copy)
  - Shows referral stats: "You've invited {n} people"
  - List of referred members (avatar + display name + join date)
  - If no referral code exists yet, auto-generate one on page load
  - Route: `/invite`

- [x] **2C.** Update Sidebar — replace "Invite Friends (SOON)" with active link to `/invite`

- [x] **2D.** Update signup flow — capture `ref` query parameter:
  - On the `/signup` route, check `URLSearchParams` for `ref` param
  - Store in component state during registration
  - After successful signup + profile creation, call `record_referral()` RPC
  - Show a warm message: "You were invited by {referrer_display_name}!" (optional — only if we can fetch the referrer's name from the code)

- [ ] **2E.** Admin referral stats (stretch — DEFERRED to a later session):
  - On the Admin Hub or a new `/admin/referrals` page
  - Table: member name, their code, referral count
  - Sortable by referral count (leaderboard)

---

## Phase 5D-3: Self-Service Account Deletion Frontend

- [x] **3A.** Add "Delete my account" section to Profile edit page (`/profile/edit`):
  - Danger zone section at the very bottom, visually separated
  - Red "Delete my account" button
  - Opens Modal (variant="danger") with:
    - Warning: "This will permanently delete your account and all your data. This cannot be undone."
    - Typed confirmation: "Type DELETE to confirm"
    - Cancel + "Delete my account" buttons
  - On confirm: calls `delete_own_account()` RPC
  - On success: signs out, redirects to landing page with a farewell toast or message
  - Guard: does NOT render for owner role (owner can't self-delete)

- [x] **3B.** Update AuthContext — handle the post-deletion state:
  - After `delete_own_account()` succeeds, call `supabase.auth.signOut()`
  - Clear localStorage (theme, etc.)
  - Redirect to `/` (landing page)

---

## Phase 5D-4: Legal Pages

- [x] **4A.** Create `src/pages/TermsOfUse.jsx`:
  - Route: `/terms`
  - Renders the Terms of Use content (hardcoded JSX, styled with `.legal-page` CSS)
  - No sidebar (public page, accessible pre and post-auth)
  - Back link or breadcrumb to landing page / dashboard

- [x] **4B.** Create `src/pages/PrivacyPolicy.jsx`:
  - Route: `/privacy`
  - Same layout as Terms
  - No sidebar

- [x] **4C.** Create `src/pages/HealthDisclaimer.jsx`:
  - Route: `/disclaimer`
  - Same layout as Terms
  - No sidebar

- [x] **4D.** Add `src/styles/legal.css`:
  - `.legal-page` — max-width 800px, centered, parchment card background, readable typography
  - `.legal-heading` — section headers
  - `.legal-list` — styled list items
  - `.legal-effective-date` — muted date line
  - Responsive for mobile
  - Import from `styles/index.css`

- [x] **4E.** Add routes to `App.jsx`:
  - `/terms` → `TermsOfUse`
  - `/privacy` → `PrivacyPolicy`
  - `/disclaimer` → `HealthDisclaimer`
  - These should be public routes (no ProtectedRoute wrapper)

- [x] **4F.** Update footer — add "Terms · Privacy · Disclaimer" links:
  - Both on the landing page footer and the authenticated footer in Layout
  - Add trademark line: "The Keto Keep™ is a trademark of Full Spectrum Human LLC"

- [x] **4G.** Update signup flow — add Terms agreement checkbox:
  - Checkbox: "I agree to the Terms of Use and Privacy Policy" (with links)
  - Signup button disabled until checked
  - This is a UI gate only (not stored in DB — the act of signing up constitutes acceptance per the Terms)

- [x] **4H.** Content for legal pages is in `D:\The Keto Keep\legal\`:
  - `TERMS_OF_USE.md`
  - `PRIVACY_POLICY.md`
  - `HEALTH_DISCLAIMER.md`
  - Convert markdown content to JSX for the page components
  - Replace `[INSERT DATE BEFORE LAUNCH]` placeholders with launch date
  - Replace `[INSERT CONTACT EMAIL]` with the appropriate email address
  - **ASK RANCE** for the contact email before building

---

## Phase 5D-5: Final Steps

- [x] **5A.** `npm run lint` — zero errors
- [x] **5B.** `npm run build` — clean
- [x] **5C.** Bump `package.json` to `0.10.0`
- [x] **5D.** Git commit with descriptive message, push to main
- [x] **5E.** Verify Cloudflare Workers auto-deploy
- [x] **5F.** Smoke test: generate invite link, copy, open in incognito, sign up with ref param, verify referral recorded
- [x] **5G.** Smoke test: delete a test account via profile settings, verify cascade cleanup

---

## Notes for Claude Code

- The invite URL should use the current deployment URL (workers.dev) until the custom domain is wired. The `referralHelpers.buildInviteUrl()` can read from `window.location.origin` so it auto-adapts when the domain changes.
- The legal pages should NOT have the sidebar. They're standalone public pages like the landing page. This means they need the same layout treatment as the unauthenticated landing/login/signup routes.
- The referral code format: 8 uppercase alphanumeric characters (e.g., `TKK8A3F2`). Prefix with "TKK" for brand recognition: `TKK` + 5 random chars = 8 total.
- Account deletion: the `delete_own_account()` function should cascade through `auth.users` deletion, which will cascade to profiles and everything else via existing FK cascades. Test this carefully.
- The legal content files in `D:\The Keto Keep\legal\` are the source of truth. Convert to JSX but preserve all content.
- **Before building:** Ask Rance for the contact email to replace `[INSERT CONTACT EMAIL]` in the legal docs.
