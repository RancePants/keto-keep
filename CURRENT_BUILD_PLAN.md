# Session 27 Build Plan — Three UI Bug Fixes

**Session:** 27
**Starting version:** v0.13.1
**Target version:** v0.13.2
**Schema changes:** None

---

## 1. Admin Menu Dropdown Clipping (Desktop)

**Problem:** On desktop, the 3-dot admin menu on member cards opens a dropdown that gets clipped by the card's `overflow: hidden`. The dropdown renders inside the card, but the card clips it.

**Files:** `src/styles/members.css`, possibly `src/components/members/MemberCard.jsx`

- [ ] 1A. In `src/styles/members.css`, remove `overflow: hidden` from `.member-card`. The bio already handles its own overflow via `-webkit-line-clamp`. The card's `border-radius` does not require `overflow: hidden` since no child elements extend beyond the card borders in normal flow.
- [ ] 1B. Verify on desktop: click the 3-dot button on a member card near the bottom of the card — the full dropdown (Manage tags, View profile, Suspend, Ban, Delete…) should be fully visible, not clipped.
- [ ] 1C. Verify the card still looks correct without `overflow: hidden` — rounded corners, hover shadow, bio truncation all still work.
- [ ] 1D. If removing `overflow: hidden` causes any visual regression (unlikely), use an alternative approach: render the dropdown menu via a React portal so it escapes the card's stacking context entirely. This would require changes to `MemberCard.jsx`.

## 2. Frame-to-Text Spacing (Mobile Profile + Member Cards)

**Problem:** When a user has a profile frame, the name/text sits too close to the bottom edge of the frame image. This affects both the mobile profile view (`/profile/:id`) and the member search cards. The frame overflows the avatar area by `size * FRAME_OFFSET_RATIO` (0.25) in each direction — for a 140px avatar on profile that's 35px overflow; for 64px on member cards that's 16px overflow.

**Files:** `src/styles/profiles.css`, `src/styles/members.css`

### Profile page (mobile)
- [ ] 2A. In `src/styles/profiles.css`, in the `@media (max-width: 600px)` block where `.profile-top` goes to `flex-direction: column`, add a rule for `.profile-top .avatar-wrap` (or `.profile-top .profile-frame:not(.profile-frame-none)`) that adds `margin-bottom: 24px` to clear the frame's bottom overflow (35px overflow, 24px margin gives ~60px total clearance for name text). Adjust the exact value visually.
- [ ] 2B. On desktop, `.profile-top` is already `flex-direction: row` and has `margin-right: var(--space-4)` on `.avatar-wrap`. Check if the existing `margin-top: 35px` on `.profile-top .profile-frame:not(.profile-frame-none)` (from session 24) is still present. If the frame is pushing too close to the name in the row layout, add a small `margin-right` or `padding-right` to the frame wrapper. But the primary complaint is mobile — desktop is likely fine.

### Member cards
- [ ] 2C. In `src/styles/members.css`, the `.member-card-avatar-col-framed` has `margin-top: 16px` to push the frame down. Add `margin-bottom: 8px` (or similar) to give the frame's bottom overflow clearance from content below. This applies on desktop row layout.
- [ ] 2D. On mobile (≤480px), the `.member-card-avatar-col-framed` resets `margin-top: 0`. Also add `margin-bottom: 12px` here so that when the card stacks vertically, the frame bottom doesn't crowd the name text below.
- [ ] 2E. Verify with a framed profile (your account) and a non-framed profile (Test Account): both should look properly spaced on mobile and desktop. The frame bottom edge should have visible breathing room before the name text.

## 3. Desktop Member Card — Fill Empty Space

**Problem:** On wide desktop screens, the right side of member cards feels empty. The card is single-column full-width, with avatar left and stacked text content, but the text doesn't fill the horizontal space.

**Files:** `src/components/members/MemberCard.jsx`, `src/styles/members.css`

### Add `about_me` excerpt
- [ ] 3A. In `MemberCard.jsx`, the component already receives and renders `profile.bio`. The `about_me` field is also on the profile object. Below the existing bio line, add an `about_me` excerpt (if available and different from bio). Render it as a 2-3 line clamped paragraph (like the bio but slightly longer). Use a CSS class `.member-card-about` with `-webkit-line-clamp: 3`.
- [ ] 3B. In `members.css`, add `.member-card-about` styling: `font-size: var(--fs-sm); color: var(--color-ink-soft); line-height: 1.5; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;`

### Show more interest tags
- [ ] 3C. In `MemberCard.jsx`, increase the interest tag display limit from `4` to `8`. Change `const showInterests = interestTags.slice(0, 4);` → `interestTags.slice(0, 8);`. The "+N" overflow indicator still shows if there are more than 8.

### Verify
- [ ] 3D. Verify on desktop: cards with bio + about_me + 5+ interest tags should fill the horizontal space much better. Cards with minimal data (no bio, no about_me, few tags) should still look clean and not awkwardly sparse.
- [ ] 3E. Verify on mobile (≤480px): stacked layout still looks good, about_me excerpt doesn't make the card too tall.

## 4. Final Steps

- [ ] 4A. Run `npm run lint` — fix any errors
- [ ] 4B. Run `npm run build` — verify clean build
- [ ] 4C. Bump version in `package.json` to `0.13.2`
- [ ] 4D. Git commit: "fix: admin menu clipping, frame spacing, card content density (v0.13.2)"
- [ ] 4E. Git push to `main`
- [ ] 4F. Verify Cloudflare auto-deploy picks up the build
- [ ] 4G. Update `THE_KETO_KEEP_PROJECT_REFERENCE.md`: canonical version → v0.13.2, add session 27 log entry, update Phase 5G section with new checklist items
- [ ] 4H. Save dated copy: `D:\The Keto Keep\Project Reference\THE_KETO_KEEP_PROJECT_REFERENCE_2026-04-21_S27.md`
