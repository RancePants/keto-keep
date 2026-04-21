# Session 29 Build Plan — Honors Polish + Backfill

**Session:** 29
**Starting version:** v0.14.0
**Target version:** v0.14.1
**Schema changes:** None (backfill is data-only, no DDL)

---

## 0. Fix: Sage Honor Showing Blank Shield

**Problem:** The `course_complete` badge_type maps to slug `course-complete` via `badgeTypeSlug()`, so `HonorIcon` looks for `honor-course-complete.png`. But the file is named `honor-sage.png` (because we renamed Course Complete to Sage). The `icon_url` in the database has the correct path (`/honors/honor-sage.png`) but HonorIcon ignores it and builds the path from the badge_type string.

- [ ] 0A. In `src/lib/profileHelpers.js`, update `badgeTypeSlug()` to include a slug override map for badge_types where the filename doesn't match the type:
  ```js
  const SLUG_OVERRIDES = { course_complete: 'sage' };
  export function badgeTypeSlug(badgeType) {
    if (!badgeType) return '';
    if (SLUG_OVERRIDES[badgeType]) return SLUG_OVERRIDES[badgeType];
    return String(badgeType).replace(/_/g, '-');
  }
  ```
- [ ] 0B. Verify the Sage honor now shows the correct tome artwork instead of a blank shield silhouette.

## 1. Profile Layout: Move Interests Above Hall of Honors

- [ ] 1A. In `src/pages/Profile.jsx` (view mode), find the interests/tags section and the Hall of Honors section. Move the interest tags section ABOVE the Hall of Honors so it doesn't get buried below the potentially large honors grid.
- [ ] 1B. Verify on desktop and mobile that the order is: avatar/name/meta → bio/about_me/my_why → interest tags → Hall of Honors → admin sections (if applicable).

## 2. Hall of Honors: Collapsed by Default

- [ ] 2A. In the `HallOfHonors` component (likely in `Profile.jsx` or a separate component), make each category section collapsed by default. Use `useState` with an initially-empty set or all-false map.
- [ ] 2B. Each category header should be clickable to expand/collapse. Add a chevron/arrow indicator that rotates on expand (▶ collapsed, ▼ expanded). Use CSS transition for smooth rotation.
- [ ] 2C. When collapsed, only show the category header with the count of earned/total honors (e.g., "Community (3 of 9)"). When expanded, show the full grid of earned + locked honors.
- [ ] 2D. Verify the collapse/expand works smoothly on both desktop and mobile.

## 3. Backfill Script: Retroactively Award Earned Honors

Run a one-time backfill via Supabase MCP `execute_sql` to award honors that members have already earned from existing data. Each query should be idempotent (ON CONFLICT DO NOTHING).

- [ ] 3A. **Town Crier** — award to all users who have ≥1 forum post:
  ```sql
  INSERT INTO member_badges (user_id, badge_id)
  SELECT DISTINCT fp.author_id, b.id
  FROM forum_posts fp
  CROSS JOIN badges b
  WHERE b.badge_type = 'town_crier'
  ON CONFLICT DO NOTHING;
  ```
- [ ] 3B. **Bard tiers** — award bronze/silver/gold based on post count:
  ```sql
  INSERT INTO member_badges (user_id, badge_id)
  SELECT sub.author_id, b.id
  FROM (SELECT author_id, COUNT(*) as cnt FROM forum_posts GROUP BY author_id) sub
  CROSS JOIN badges b
  WHERE b.badge_type = 'bard_bronze' AND sub.cnt >= 10
  ON CONFLICT DO NOTHING;
  ```
  (Repeat for bard_silver ≥25, bard_gold ≥50)
- [ ] 3C. **Scribe** — award to all users who have ≥1 forum reply:
  ```sql
  INSERT INTO member_badges (user_id, badge_id)
  SELECT DISTINCT fr.author_id, b.id
  FROM forum_replies fr
  CROSS JOIN badges b
  WHERE b.badge_type = 'scribe'
  ON CONFLICT DO NOTHING;
  ```
- [ ] 3D. **Herald** — award to all users who have given ≥1 reaction:
  ```sql
  INSERT INTO member_badges (user_id, badge_id)
  SELECT DISTINCT frc.user_id, b.id
  FROM forum_reactions frc
  CROSS JOIN badges b
  WHERE b.badge_type = 'herald'
  ON CONFLICT DO NOTHING;
  ```
- [ ] 3E. **Good Neighbor tiers** — reactions received. Need to sum reactions across posts AND replies authored by the user:
  ```sql
  WITH reaction_counts AS (
    SELECT fp.author_id, COUNT(*) as cnt
    FROM forum_reactions frc
    JOIN forum_posts fp ON fp.id = frc.post_id
    WHERE frc.reply_id IS NULL
    GROUP BY fp.author_id
    UNION ALL
    SELECT fr.author_id, COUNT(*) as cnt
    FROM forum_reactions frc
    JOIN forum_replies fr ON fr.id = frc.reply_id
    WHERE frc.reply_id IS NOT NULL
    GROUP BY fr.author_id
  ),
  totals AS (
    SELECT author_id, SUM(cnt) as total FROM reaction_counts GROUP BY author_id
  )
  INSERT INTO member_badges (user_id, badge_id)
  SELECT t.author_id, b.id
  FROM totals t
  CROSS JOIN badges b
  WHERE b.badge_type = 'good_neighbor_bronze' AND t.total >= 10
  ON CONFLICT DO NOTHING;
  ```
  (Repeat for silver ≥25, gold ≥50)
- [ ] 3F. **Loyal Knight tiers** — based on profiles.longest_streak:
  ```sql
  INSERT INTO member_badges (user_id, badge_id)
  SELECT p.id, b.id
  FROM profiles p
  CROSS JOIN badges b
  WHERE b.badge_type = 'loyal_knight_7' AND p.longest_streak >= 7
  ON CONFLICT DO NOTHING;
  ```
  (Repeat for 30, 90, 180, 270, 365)
- [ ] 3G. **Tenure tiers** — based on days since created_at:
  ```sql
  INSERT INTO member_badges (user_id, badge_id)
  SELECT p.id, b.id
  FROM profiles p
  CROSS JOIN badges b
  WHERE b.badge_type = 'tenure_1_month'
    AND (CURRENT_DATE - p.created_at::date) >= 30
  ON CONFLICT DO NOTHING;
  ```
  (Repeat for tenure_6_months ≥180, tenure_1_year ≥365)
- [ ] 3H. **Scholar** — users who completed all lessons in at least one module:
  (Complex query — check lesson_progress against lessons per module. Skip if no course progress data exists yet.)
- [ ] 3I. **Sage (course_complete)** — users who completed all lessons in an entire course:
  (Same complexity caveat as Scholar. Skip if no data.)
- [ ] 3J. **Pilgrim** — users who RSVP'd to a completed event:
  ```sql
  INSERT INTO member_badges (user_id, badge_id)
  SELECT DISTINCT er.user_id, b.id
  FROM event_rsvps er
  JOIN events e ON e.id = er.event_id
  CROSS JOIN badges b
  WHERE b.badge_type = 'pilgrim' AND e.status = 'completed'
  ON CONFLICT DO NOTHING;
  ```
- [ ] 3K. **Gatekeeper tiers** — based on referral count:
  ```sql
  INSERT INTO member_badges (user_id, badge_id)
  SELECT sub.referrer_id, b.id
  FROM (SELECT referrer_id, COUNT(*) as cnt FROM referrals GROUP BY referrer_id) sub
  CROSS JOIN badges b
  WHERE b.badge_type = 'gatekeeper_1' AND sub.cnt >= 1
  ON CONFLICT DO NOTHING;
  ```
  (Repeat for gatekeeper_5 ≥5, gatekeeper_10 ≥10)
- [ ] 3L. **Standard Bearer** — users who have a profile frame set:
  ```sql
  INSERT INTO member_badges (user_id, badge_id)
  SELECT p.id, b.id
  FROM profiles p
  CROSS JOIN badges b
  WHERE b.badge_type = 'standard_bearer'
    AND p.selected_frame IS NOT NULL
    AND p.selected_frame != 'none'
  ON CONFLICT DO NOTHING;
  ```
- [ ] 3M. Verify backfill results: `SELECT badge_type, COUNT(*) FROM member_badges mb JOIN badges b ON b.id = mb.badge_id GROUP BY badge_type ORDER BY badge_type;`

## 4. Final Steps

- [ ] 4A. Run `npm run lint` — fix any errors
- [ ] 4B. Run `npm run build` — verify clean build
- [ ] 4C. Bump version in `package.json` to `0.14.1`
- [ ] 4D. Git commit: "fix: sage icon, interests above honors, collapsible Hall of Honors, backfill awards (v0.14.1)"
- [ ] 4E. Git push to `main`
- [ ] 4F. Verify Cloudflare auto-deploy
- [ ] 4G. Update `THE_KETO_KEEP_PROJECT_REFERENCE.md`: canonical version → v0.14.1, add session 29 log entry
- [ ] 4H. Save dated copy: `D:\The Keto Keep\Project Reference\THE_KETO_KEEP_PROJECT_REFERENCE_2026-04-21_S29.md`
