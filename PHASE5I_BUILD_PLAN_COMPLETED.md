# Session 31 — Build Plan (Phase 5I: Guide Character — Sir Cedric / Lady Elara)

## Pre-Build: Schema

### S1 — Add guide columns to profiles
- [x] Applied migration `add_guide_character_and_dismissed_tips` via MCP.
- [x] Security advisor: only pre-existing `auth_leaked_password_protection` warning; no new findings.

## Item 1: GuideTooltip Component

### 1A — Core component
- [ ] New file: `src/components/guide/GuideTooltip.jsx`
- [ ] Props: `tipId` (string, required), `pose` (string: welcome|pointing|celebrating|thinking|thumbsup), `children` (the tip message content — string or JSX), `position` (string: top-left|top-right|bottom-left|bottom-right, default 'bottom-right'), `anchor` (optional ref to position near — if omitted, renders inline)
- [ ] Reads `profile.guide_character` and `profile.dismissed_tips` from `useAuth()`
- [ ] If `guide_character === 'none'` → render null
- [ ] If `tipId` is in `dismissed_tips` AND not in a local `reopened` set → render null
- [ ] Otherwise render: speech bubble with character image + message + "Got it!" dismiss button
- [ ] Character image: `/guide/guide-${character}-${pose}.png` where character is 'knight' or 'lady'
- [ ] On "Got it!" click: call a dismiss handler that adds `tipId` to `dismissed_tips` array on the profile (supabase update) + local state update so it hides immediately
- [ ] Dismissal: `supabase.from('profiles').update({ dismissed_tips: [...current, tipId] }).eq('id', user.id)` — fire-and-forget pattern (don't block on the update)

### 1B — GuideTooltip CSS
- [ ] New file: `src/styles/guide.css`, imported from `src/styles/index.css`
- [ ] `.guide-tooltip` — positioned container (absolute or fixed depending on usage)
- [ ] `.guide-tooltip-bubble` — speech bubble with warm parchment bg, subtle border, rounded corners, drop shadow. Small triangle/arrow pointing toward the anchor. Max-width ~320px.
- [ ] `.guide-tooltip-character` — character image at 80px (compact enough for inline, recognizable)
- [ ] `.guide-tooltip-message` — text content, warm readable font
- [ ] `.guide-tooltip-dismiss` — "Got it!" button, small, castle-themed (amber accent)
- [ ] `.guide-tooltip-skip` — "Skip tour" link (for onboarding sequence only), muted
- [ ] Dark mode: use CSS variable tokens
- [ ] Mobile: full-width bubble at bottom of viewport (fixed), character image at 60px
- [ ] Transition: fade-in on appear

### 1C — AuthContext updates
- [ ] Add `guide_character` and `dismissed_tips` to the `fetchProfile` select list
- [ ] Expose `guide_character` and `dismissed_tips` on the context value
- [ ] Add `guide_character` and `dismissed_tips` to `updateProfile` allow-list
- [ ] New helper: `dismissTip(tipId)` — updates local state immediately + fires async supabase update. Exposed on context.
- [ ] New helper: `resetTips()` — sets `dismissed_tips` to `[]` both locally and in DB. Exposed on context.

## Item 2: Onboarding Tour (Tips 1–3)

### 2A — Tour sequencer
- [ ] New file: `src/components/guide/OnboardingTour.jsx`
- [ ] Mounted in `Layout.jsx` for authenticated users (alongside SuspendedBanner, NotificationBell)
- [ ] On mount, checks if ALL three onboarding tipIds (`onboarding-welcome`, `onboarding-sidebar`, `onboarding-profile`) are NOT in `dismissed_tips` — if so, starts the tour
- [ ] Tour state: `currentStep` (0, 1, 2 or null)
- [ ] Step 0: Welcome tip (pose: welcome) — positioned center/overlay on dashboard
- [ ] Step 1: Sidebar tip (pose: pointing) — positioned next to sidebar
- [ ] Step 2: Profile nudge (pose: thinking) — positioned center/overlay
- [ ] "Got it!" advances to next step AND dismisses current tipId
- [ ] "Skip tour" dismisses all 3 tipIds at once and closes
- [ ] After step 2 dismissed, tour is complete — component renders null
- [ ] Tour only triggers on Dashboard path (`/dashboard` or root authed path) — doesn't pop up mid-forum-browse

### 2B — Tip content (from design doc, verified against v0.15.1)
- [ ] Tip 1 (`onboarding-welcome`): "Welcome to The Keep, traveler! This is your Great Hall — your home base. You'll find the latest news, upcoming events, and your learning journey all right here."
- [ ] Tip 2 (`onboarding-sidebar`): "This is your compass through The Keep. Forums, Events, Courses, and Members are all just a tap away. Explore at your own pace!"
- [ ] Tip 3 (`onboarding-profile`): "A quick tip — filling out your profile helps others get to know you. Your dietary approach, interests, and a short bio go a long way in this community."

## Item 3: Feature Discovery Tips (Tips 4–7)

### 3A — Forum first visit
- [ ] In `src/pages/ForumHome.jsx` (or `SpaceView.jsx` — whichever is the forums landing): render `<GuideTooltip tipId="discover-forums" pose="pointing">` with tip 4 text
- [ ] Tip 4: "The Forum Spaces are where the community gathers. Each space has its own topic — jump into one that speaks to you, or start a conversation of your own!"

### 3B — Events first visit
- [ ] In `src/pages/EventsHome.jsx`: render `<GuideTooltip tipId="discover-events" pose="pointing">` with tip 5 text
- [ ] Tip 5: "This is the Events Hall. Live sessions, Q&As, and workshops happen here. RSVP to save your spot, and check back for recordings of past sessions."

### 3C — Courses first visit
- [ ] In `src/pages/CoursesHome.jsx`: render `<GuideTooltip tipId="discover-courses" pose="pointing">` with tip 6 text
- [ ] Tip 6: "Welcome to the Library! These self-paced courses cover the pillars of ancestral health. Work through them at your own speed — your progress is saved automatically."

### 3D — Members first visit
- [ ] In `src/pages/MembersDirectory.jsx`: render `<GuideTooltip tipId="discover-members" pose="pointing">` with tip 7 text
- [ ] Tip 7: "The Members Directory lets you find and connect with fellow Keep members. Use the filters to find people who share your interests and approach."

## Item 4: Engagement Tips (Tips 8–11)

### 4A — First forum post
- [ ] In `PostComposer.jsx`: after successful post creation (where `checkAndAwardHonors` fires), if `dismissed_tips` doesn't include `engage-first-post`, show a celebratory tooltip. Or: use a transient toast-like approach — render the GuideTooltip with celebrating pose for ~5 seconds then auto-dismiss + mark dismissed.
- [ ] Implementation: set local state `showFirstPostTip = true` after insert if tipId not dismissed. Render GuideTooltip inline below the composer. Auto-dismiss after 6s via setTimeout OR on "Got it!" click.
- [ ] Tip 8: "Your voice has been heard! You just made your first post. Keep sharing — this community thrives on conversations like yours."

### 4B — First honor earned
- [ ] In `honorHelpers.js` or at the call site: after a successful honor award, check if `engage-first-honor` is dismissed. If not, trigger a celebrating tooltip.
- [ ] Best spot: in the award notification callback or via a dashboard-level check. Since honors are fire-and-forget, the simplest approach is to check on Dashboard mount — if user has ≥1 honor and `engage-first-honor` not dismissed, show the tip.
- [ ] Tip 9: "You've earned your first Honor! Check your profile to see it displayed in the Hall of Honors. There are many more to discover..."

### 4C — Streak milestone (7 days)
- [ ] In `AuthContext.jsx` where `runStreakUpdate` fires: if streak just hit 7 and `engage-streak-7` not dismissed, show tip on next dashboard render.
- [ ] Simplest: check on Dashboard mount — if `profile.current_streak >= 7` and tipId not dismissed, show.
- [ ] Tip 10: "Seven days strong! Your dedication is building. Keep showing up — the rewards only get better from here."

### 4D — Profile frame selected
- [ ] In `FramePickerModal.jsx`: after saving a non-'none' frame, if `engage-frame` not dismissed, show the tip.
- [ ] Tip 11: "Looking sharp! Your new frame is displayed on your profile and everywhere your avatar appears in The Keep."

## Item 5: Helpful Hints (Tips 12–14)

### 5A — Rich text editor first use
- [ ] In `RichTextEditor.jsx` or `PostComposer.jsx`: on first focus/expand of the editor, if `hint-editor` not dismissed, show thinking-pose tooltip above/near the toolbar.
- [ ] Tip 12: "Quick tip — you can use bold, italic, lists, links, and even emojis in your posts. The toolbar above the editor has everything you need."

### 5B — First notification
- [ ] In `NotificationBell.jsx`: when the dropdown opens and items.length > 0 and `hint-notification` not dismissed, show pointing-pose tooltip near the bell.
- [ ] Tip 13: "You've got a notification! The bell in the corner lights up when something happens — replies to your posts, reactions, events, and more."

### 5C — Vacation mode hint
- [ ] On Dashboard mount: if `profile.current_streak >= 7` and `hint-vacation` not dismissed, show thinking-pose tooltip.
- [ ] Tip 14: "Going on a trip? Vacation Mode freezes your streak for up to 30 days so you don't lose your progress. Find it on your profile page."
- [ ] Note: don't show this at the same time as tip 10 (streak milestone). If both qualify, show tip 10 first; tip 14 shows after tip 10 is dismissed.

## Item 6: Sidebar Guide Button

### 6A — Button in Sidebar
- [ ] In `Sidebar.jsx`: add a small "Guide" button in the sidebar nav section (between main nav links and footer). Uses a shield or compass glyph icon.
- [ ] On click: temporarily "reopens" all tips relevant to the current page by adding their tipIds to a local `reopened` set (session-scoped, not persisted). This set is passed via context or a dedicated guide context.
- [ ] CSS: subtle button, matches sidebar link styling but slightly muted. Tooltip or aria-label: "Show guide tips for this page".

### 6B — Page-to-tipId mapping
- [ ] Helper map: `{ '/dashboard': ['onboarding-welcome'], '/forums': ['discover-forums'], '/events': ['discover-events'], '/courses': ['discover-courses'], '/members': ['discover-members'] }`
- [ ] Guide button uses `useLocation().pathname` to determine which tips to reopen.

## Item 7: Profile Preference UI

### 7A — Guide character selector on Profile Edit
- [ ] In `Profile.jsx` edit mode: add a "Your Guide" section with 3 radio options:
  - Sir Cedric (knight) — show small preview image
  - Lady Elara (lady) — show small preview image  
  - None — hides all guide tooltips
- [ ] On change: update `guide_character` via `updateProfile`
- [ ] CSS: small section, radio buttons with character preview thumbnails at ~48px

### 7B — Reset tips button
- [ ] Below the guide character selector: "Reset guide tips" button
- [ ] Calls `resetTips()` from AuthContext
- [ ] Confirmation: "This will re-show all guide tips. Continue?" (use existing Modal pattern)

## Item 8: Reference File Updates

### 8A — Update Session End Gate in reference file
- [ ] Change "9 items" to "10 items" in the Session End Gate header
- [ ] Add item 10 after item 9: `10. **Guide tutorial check** — if any user-facing feature was added, renamed, moved, or removed, review the tooltip content in `GUIDE_CHARACTER_DESIGN.md` (tips 1–14). Update any affected tip text. If a new feature warrants a new tip, draft it and add it to the design doc.`

### 8B — Standard reference file updates
- [ ] Update canonical version date, versions table, roadmap, session log, architecture decisions, current status

## Final Steps

### F1 — Version bump
- [ ] `package.json` → 0.16.0

### F2 — Lint + build
- [ ] `npm run lint` → 0 errors
- [ ] `npm run build` → clean

### F3 — Commit + push
- [ ] Commit: "feat: Phase 5I guide character — Sir Cedric / Lady Elara onboarding + tooltips (v0.16.0)"
- [ ] Push to main

### F4 — End gate
- [ ] Verify Cloudflare auto-deploy
- [ ] Save dated reference file copy: `D:\The Keto Keep\Project Reference\THE_KETO_KEEP_PROJECT_REFERENCE_2026-04-21_S31.md`
- [ ] Guide tutorial check: all 14 tips verified against v0.16.0 UI (first build, so all should be accurate by construction)
