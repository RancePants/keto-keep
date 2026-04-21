# Session 30 — Build Plan (Phase 5I: Dashboard + Notifications + Honor Lightbox)

## Item 1: Richer Notification Titles

### 1A — Update notificationHelpers.js signatures
- [x] `notifyReplyToPost` — add `actorName` (string) and `spaceName` (string) params at the end. Title: `${actorName} replied to "${titleSnippet}" in ${spaceName}` when actorName provided; fallback to current generic title when not.
- [x] `notifyReplyToComment` — add `actorName` param. Title: `${actorName} replied to your comment` when provided.
- [x] `notifyReaction` — add `actorName` param. Title: `${actorName} reacted ${emoji} to your post` when provided.
- [x] `notifyBadgeAwarded` — add `actorName` param (nullable). Title: `Coach ${actorName} awarded you "${badgeName}"` when actorName; `You earned the "${badgeName}" honor` when null (auto-award).
- [x] Leave `notifyStatusChange` and `notifyNewEvent` unchanged (system notifications).

### 1B — Update call sites to pass actor display_name and space name
- [x] **SpaceView.jsx**: Pass `spaceName={space?.name}` to each PostCard.
- [x] **PostCard.jsx**: Accept `spaceName` prop. Pass it to ReplySection. In `onReactionAdded` handler, pass `profile?.display_name` as actorName to `notifyReaction`.
- [x] **ReplySection.jsx**: Accept `spaceName` prop. Destructure `profile` from `useAuth()`. In `handleTopLevelReplyCreated`, pass `profile?.display_name` and `spaceName`. In `handleNestedReplyCreated`, pass `profile?.display_name`. In `handleReplyReaction`, pass `profile?.display_name`.
- [x] **AwardBadgeModal.jsx**: Pass `profile?.display_name` to `notifyBadgeAwarded` as actorName.
- [x] Leave ManageMemberModal and EventFormModal unchanged.

## Item 2: Dashboard Redesign — Replace Quick Links with Activity + Honors

### 2A — Remove Quick Links section
- [x] In `src/pages/Dashboard.jsx`, deleted Quick Links section.

### 2B — Create RecentActivityCard component
- [x] New file: `src/components/dashboard/RecentActivityCard.jsx`

### 2C — Create HonorsProgressCard component
- [x] New file: `src/components/dashboard/HonorsProgressCard.jsx`

### 2D — Dashboard layout
- [x] Replaced Quick Links with `dashboard-cards-row` after `<MyLearningCard />`.

### 2E — CSS
- [x] Added dashboard card styles to `src/styles/pages.css` (replaced quick-links section).

## Item 3: Honor Badge Lightbox

### 3A — Add lightbox state to HallOfHonors in Profile.jsx
- [x] Added `selectedHonor` state. Each `.honor-item` is clickable with role/tabIndex/onKeyDown.

### 3B — Honor lightbox modal
- [x] Modal rendered when selectedHonor truthy. Shows HonorIcon at 192px, name, description, earned date or locked text.

### 3C — CSS for lightbox
- [x] Added cursor/hover to `.honor-item` and lightbox classes to `profiles.css`.

## Final Steps

### F1 — Version bump
- [x] `package.json` → 0.15.0

### F2 — Lint + build
- [x] `npm run lint` → 0 errors
- [x] `npm run build` → clean (214 modules, chunk size warning pre-existing)

### F3 — Commit + push
- [x] Commit c85f6cb: "feat: richer notifications, dashboard activity/honors cards, honor lightbox (v0.15.0)"
- [x] Pushed to main

### F4 — End gate
- [ ] Verify Cloudflare auto-deploy (triggered; check keto-keep.rance-8c6.workers.dev)
- [x] Saved dated reference file: `D:\The Keto Keep\Project Reference\THE_KETO_KEEP_PROJECT_REFERENCE_2026-04-21_S30.md`
- [x] Archived build plan: `D:\The Keto Keep\Project Reference\PHASE5I_BUILD_PLAN_COMPLETED.md`
