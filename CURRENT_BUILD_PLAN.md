# Session 28 Build Plan — Honors System (Phase 5H)

**Session:** 28
**Starting version:** v0.13.2
**Target version:** v0.14.0
**Schema changes:** Yes — phase5h_honors_system migration

---

## 0. Pre-Build: Schema Application

**Reference file:** `Project Reference/PHASE5H_SCHEMA_DRAFT.sql`

- [ ] 0A. Create the two new enums: `badge_category` ('community','growth','building','special') and `badge_unlock_method` ('auto','manual'). Run as a single `execute_sql` call.
- [ ] 0B. Add 23 new values to `badge_type` enum. IMPORTANT: `ALTER TYPE ... ADD VALUE` cannot run inside a transaction block. Run each ADD VALUE as its own `execute_sql` call (23 calls). Order: town_crier, bard_bronze, bard_silver, bard_gold, scribe, herald, good_neighbor_bronze, good_neighbor_silver, good_neighbor_gold, loyal_knight_7, loyal_knight_30, loyal_knight_90, loyal_knight_180, loyal_knight_270, loyal_knight_365, scholar, pilgrim, gatekeeper_1, gatekeeper_5, gatekeeper_10, standard_bearer, founding_member, champions_honor.
- [ ] 0C. Add 4 new columns to `badges` table: `category badge_category`, `unlock_method badge_unlock_method`, `threshold integer`, `sort_order integer NOT NULL DEFAULT 0`. Single `execute_sql` call.
- [ ] 0D. Update existing 5 badge rows with new column values + icon_url paths. 5 UPDATE statements (can batch in one call). Key: `course_complete` gets renamed to 'Sage' with new description and icon_url `/honors/honor-sage.png`.
- [ ] 0E. Insert 23 new honor catalog rows. Single INSERT with ON CONFLICT (badge_type) DO UPDATE. Copy exactly from the schema draft.
- [ ] 0F. Run Supabase **security** advisor. Expect only pre-existing `auth_leaked_password_protection` WARN.
- [ ] 0G. Run Supabase **performance** advisor. Expect zero `auth_rls_initplan` (no new RLS), zero `unindexed_foreign_keys` (no new FKs). Possible `unused_index` INFOs expected.

## 1. Frontend: HonorIcon Component (replaces BadgeIcon)

**Old:** `src/components/profile/BadgeIcon.jsx` — inline SVG shields with glyphs
**New:** PNG-based component using honor artwork from `/honors/`

- [ ] 1A. Create `src/components/profile/HonorIcon.jsx`:
  - Props: `badgeType` (string), `size` (number, default 24), `title` (string), `className` (string)
  - Renders `<img src={/honors/honor-${slug}.png} />` where slug is badgeType with underscores replaced by hyphens
  - Fallback: if image fails to load, show a generic shield placeholder (could be a simple colored circle or the old SVG)
  - Tooltip on hover showing the honor name (via `title` attr)
  - CSS class: `.honor-icon` with size control
- [ ] 1B. Update `src/lib/profileHelpers.js` — expand `BADGE_TYPE_LABEL` to include all 28 badge types with their display names. Add a `BADGE_TYPE_SLUG` map (badge_type → hyphenated slug for image paths).
- [ ] 1C. Update `src/components/profile/BadgesInline.jsx` to use `HonorIcon` instead of `BadgeIcon`. Keep the same interface (badges array, limit, size props).
- [ ] 1D. Update all files that import `BadgeIcon` to use `HonorIcon` instead. Check: `Profile.jsx`, `BadgesInline.jsx`, `AwardBadgeModal.jsx`, `PostCard.jsx`, `ReplyItem.jsx`, `Dashboard.jsx`.
- [ ] 1E. Delete `BadgeIcon.jsx` once all imports are updated.
- [ ] 1F. Add `.honor-icon` CSS to `profiles.css`: `display: inline-block; object-fit: contain; vertical-align: middle;`

## 2. Frontend: AwardBadgeModal Updates

- [ ] 2A. In `AwardBadgeModal.jsx`, expand `MANUAL_AWARDABLE` from `['coach_spotlight']` to `['coach_spotlight', 'founding_member', 'champions_honor']`.
- [ ] 2B. Update the modal to use `HonorIcon` instead of `BadgeIcon`.
- [ ] 2C. Add category grouping to the "Currently awarded" section — group earned honors by category (community, growth, building, special) with section headers.
- [ ] 2D. The award dropdown should only show manual honors. Auto honors should show as "Earned automatically" in the currently-awarded list (not offered in the dropdown).

## 3. Frontend: Hall of Honors (Profile Page)

- [ ] 3A. In `Profile.jsx` (view mode), replace the existing badge showcase section with a "Hall of Honors" section:
  - Section title: "Hall of Honors" with a shield icon
  - Group earned honors by category (community, growth, building, special)
  - Each category is a collapsible section with a header showing category name + count
  - Each honor shows: HonorIcon (64px), name, description, earned date
  - Unearned honors shown as locked/greyed out silhouettes with "???" or the honor name visible but dimmed — this creates a "collection" feel and shows members what they can work toward
  - If the member has no honors at all, show a brief message: "No honors earned yet. Start posting, replying, and engaging to unlock your first honor!"
- [ ] 3B. Add CSS for `.hall-of-honors`, `.honors-category`, `.honor-item`, `.honor-item-locked` in `profiles.css`.
- [ ] 3C. Fetch the full badge catalog (`badges` table ordered by `sort_order`) alongside the member's `member_badges` to build the earned/unearned display.

## 4. Frontend: Honors on Member Cards

- [ ] 4A. In `MemberCard.jsx`, the existing `BadgesInline` already displays earned badges. After switching to `HonorIcon` (step 1C), the member cards will automatically show honor PNGs instead of SVGs. Verify this works.
- [ ] 4B. Consider increasing the `BadgesInline` display limit from 4 to 5 or 6, since the honor count is now much larger and members will want to show off their collection.
- [ ] 4C. Add a tooltip on the "+N more" overflow indicator showing the names of hidden honors.

## 5. Frontend: Auto-Award Helper

- [ ] 5A. Create `src/lib/honorHelpers.js` with the core function:
  ```
  checkAndAwardHonors(supabase, userId, triggerContext)
  ```
  - `triggerContext` determines which checks to run: 'post' | 'reply' | 'reaction' | 'streak' | 'lesson' | 'event' | 'referral' | 'frame' | 'tenure'
  - Fetches the relevant badge catalog rows (filtered by unlock_method='auto') and the user's existing member_badges
  - For each applicable honor, queries the relevant metric count and compares against threshold
  - Inserts missing awards (fire-and-forget, swallow errors, skip if already awarded via ON CONFLICT DO NOTHING)
  - Sends notification via `notifyBadgeAwarded` for each newly awarded honor
  - Returns array of newly awarded badge_types (for UI celebration)

- [ ] 5B. Implement metric queries per trigger context:
  - `post` → COUNT forum_posts WHERE author_id = userId → checks town_crier (≥1), bard_bronze (≥10), bard_silver (≥25), bard_gold (≥50)
  - `reply` → COUNT forum_replies WHERE author_id = userId → checks scribe (≥1)
  - `reaction` → COUNT forum_reactions WHERE user_id = userId → checks herald (≥1). ALSO count reactions received (reactions on posts/replies authored by userId) → checks good_neighbor_bronze/silver/gold
  - `streak` → read profiles.longest_streak → checks loyal_knight_7/30/90/180/270/365
  - `lesson` → check module completion + course completion → checks scholar, course_complete (Sage)
  - `event` → check event_rsvps joined with events WHERE status='completed' → checks pilgrim
  - `referral` → COUNT referrals WHERE referrer_id = userId → checks gatekeeper_1/5/10
  - `frame` → check profiles.selected_frame != 'none' → checks standard_bearer
  - `tenure` → DAYS since profiles.created_at → checks tenure_1_month (≥30), tenure_6_months (≥180), tenure_1_year (≥365)

## 6. Frontend: Wire Auto-Award Checks

- [ ] 6A. `PostComposer.jsx` — after successful post insert, call `checkAndAwardHonors(supabase, userId, 'post')`
- [ ] 6B. `ReplySection.jsx` (or wherever replies are created) — after successful reply insert, call `checkAndAwardHonors(supabase, userId, 'reply')`
- [ ] 6C. `EmojiReactionBar.jsx` — after reaction insert, call `checkAndAwardHonors(supabase, userId, 'reaction')`. ALSO call for the post/reply author: `checkAndAwardHonors(supabase, authorId, 'reaction')` (for good_neighbor checks)
- [ ] 6D. `AuthContext.jsx` (streak update logic) — after streak is updated on login, call `checkAndAwardHonors(supabase, userId, 'streak')` and `checkAndAwardHonors(supabase, userId, 'tenure')`
- [ ] 6E. `LessonView.jsx` — after marking lesson complete, call `checkAndAwardHonors(supabase, userId, 'lesson')`
- [ ] 6F. Signup flow (after referral insert) — call `checkAndAwardHonors(supabase, referrerId, 'referral')`
- [ ] 6G. Profile edit (after frame change) — call `checkAndAwardHonors(supabase, userId, 'frame')`

## 7. Final Steps

- [ ] 7A. Run `npm run lint` — fix any errors
- [ ] 7B. Run `npm run build` — verify clean build
- [ ] 7C. Bump version in `package.json` to `0.14.0`
- [ ] 7D. Git commit: "feat: Honors system — 28 honor types, Hall of Honors, auto-award engine (v0.14.0)"
- [ ] 7E. Git push to `main`
- [ ] 7F. Verify Cloudflare auto-deploy
- [ ] 7G. Update `THE_KETO_KEEP_PROJECT_REFERENCE.md`: canonical versions → v0.14.0 + schema v5H, add session 28 log entry, add Phase 5H section with checked items, update architecture decisions
- [ ] 7H. Save dated copy: `D:\The Keto Keep\Project Reference\THE_KETO_KEEP_PROJECT_REFERENCE_2026-04-21_S28.md`
