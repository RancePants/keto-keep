# v0.11.5 Patch — Build Plan

**Date:** 2026-04-19 | **Session:** 23
**Scope:** Frame width fix + two profile UX improvements.

---

## 0. Fix frame overlay width squish

**Problem:** `base.css` has a global `img { max-width: 100%; }` reset. The frame overlay `<img>` is positioned absolutely at 130% of its parent container, but `max-width: 100%` caps its width at the container size while height stays at 130%. Result: frame is taller than wide (not square).

**File:** `src/components/ui/ProfileFrame.jsx`

- [ ] **0A.** Add `maxWidth: 'none'` to the frame overlay `<img>` inline style object to override the base CSS rule:
  ```jsx
  style={{
    position: 'absolute',
    top: overlayOffset,
    left: overlayOffset,
    width: overlaySize,
    height: overlaySize,
    maxWidth: 'none',           // ← ADD THIS — override base.css img { max-width: 100% }
    pointerEvents: 'none',
    filter: 'drop-shadow(0 0 0 #000) drop-shadow(0 0 0 #000) drop-shadow(0 0 0 #000)',
  }}
  ```

- [ ] **0B.** Verify: all frames render as perfect squares at all sizes (120px preview, 64px grid, 40px sidebar, 28px inline).

---

## 1. Save profile exits editing mode + rename button

**Problem:** After saving profile changes at `/profile/edit`, the user stays on the edit page. They should be navigated back to `/profile` (view mode) on successful save. Also, "Save profile" should read "Save changes."

**File:** `src/pages/Profile.jsx` — `ProfileEditor` component

- [ ] **1A.** `ProfileEditor` already receives `onSaved` as a prop. It also needs to navigate on save. Add `navigate` from `useNavigate()` inside `ProfileEditor` (or pass it from the parent — whichever is simpler). Note: `useNavigate` is already imported at the file level.

- [ ] **1B.** In the `onSave` handler, after the success path (`setMessage({ type: 'success', text: 'Saved.' })` and `if (onSaved) onSaved();`), add:
  ```js
  navigate('/profile');
  ```
  This returns the user to their profile view after a successful save. On error, they stay on the edit page (existing behavior).

- [ ] **1C.** Change the submit button text from `'Save profile'` to `'Save changes'`:
  ```jsx
  {saving ? 'Saving…' : 'Save changes'}
  ```

- [ ] **1D.** Verify: edit profile → change something → hit "Save changes" → user lands on `/profile` view page with changes reflected.

---

## 2. Vacation mode: button + modal (move from edit page to streak area)

**Problem:** The vacation mode section is a full form section on the profile edit page, which feels disjointed from the streak it protects. It should be a small button near the streak display on the profile VIEW, opening a modal for activation.

### 2A — Create VacationModeModal

**File:** `src/components/profile/VacationModeModal.jsx` (new file) OR refactor existing `VacationModeSection.jsx`

- [ ] **2A.** Refactor `VacationModeSection.jsx` into `VacationModeModal.jsx`. Keep all the existing logic (date pickers, validation, activate/cancel RPCs) but wrap the content in a `<Modal>` instead of a `<section>`:
  - Props: `open`, `onClose`, `profile`, `onChanged`
  - Title: `"Vacation mode"`
  - Body: the date range form (when not active) or the active status + cancel button (when active)
  - Include the existing description text ("Heading offline for a bit?...")
  - On successful activate or cancel, call `onChanged()` then `onClose()`

### 2B — Add vacation button to ProfileStreakBlock

**File:** `src/pages/Profile.jsx` — `ProfileStreakBlock` component

- [ ] **2B.** Add an `isOwn` prop to `ProfileStreakBlock`. The parent already knows if the profile is the user's own — pass `isOwn={true}` from the own-profile view render.

- [ ] **2C.** Inside `ProfileStreakBlock`, add state for the modal: `const [vacationOpen, setVacationOpen] = useState(false);`

- [ ] **2D.** Near the streak display (after the progress bar or near the frozen indicator), add a small button visible only when `isOwn`:
  ```jsx
  {isOwn && (
    <button
      type="button"
      className="btn btn-ghost btn-sm"
      onClick={() => setVacationOpen(true)}
    >
      ❄️ Vacation mode
    </button>
  )}
  ```
  If vacation is currently active, the button could say "❄️ Manage vacation" instead.

- [ ] **2E.** Render the `VacationModeModal` at the bottom of `ProfileStreakBlock`:
  ```jsx
  {isOwn && (
    <VacationModeModal
      open={vacationOpen}
      onClose={() => setVacationOpen(false)}
      profile={profile}
      onChanged={onChanged}
    />
  )}
  ```
  Note: `ProfileStreakBlock` will also need an `onChanged` prop to trigger a profile refresh after vacation activation/cancellation.

### 2C — Remove VacationModeSection from edit page

**File:** `src/pages/Profile.jsx`

- [ ] **2F.** Remove `<VacationModeSection>` from `ProfileEditorExtras`. If `ProfileEditorExtras` becomes empty (it likely will), remove the component and its render call from the edit page entirely.

- [ ] **2G.** Remove the import of `VacationModeSection` if no longer used anywhere.

- [ ] **2H.** Delete `src/components/profile/VacationModeSection.jsx` if fully replaced by the modal. (Or rename it to `VacationModeModal.jsx` if refactoring in-place.)

### 2D — Wire up ProfileStreakBlock props

**File:** `src/pages/Profile.jsx` — where `ProfileStreakBlock` is rendered

- [ ] **2I.** In the own-profile view section, update the `<ProfileStreakBlock>` call to pass `isOwn` and `onChanged`:
  ```jsx
  <ProfileStreakBlock profile={profile} isOwn={true} onChanged={refreshProfile} />
  ```
  For viewing other members' profiles, pass `isOwn={false}` (or omit — default to false).

- [ ] **2J.** Verify:
  - Own profile view → streak area shows "❄️ Vacation mode" button
  - Clicking it opens the vacation modal with date pickers
  - Activating vacation → toast + modal closes + streak shows frozen indicator
  - Cancelling vacation → toast + modal closes + frozen indicator removed
  - Other members' profiles → no vacation button visible
  - Profile edit page → no vacation section (it's been removed)

---

## 3. Version bump + deploy

- [ ] **3A.** Bump `package.json` version from `0.11.4` to `0.11.5`
- [ ] **3B.** `npm run build` — verify clean build, no lint errors
- [ ] **3C.** Git commit with message: `feat: save exits edit mode + vacation mode modal on streak area (v0.11.5)`
- [ ] **3D.** `git push origin main`
- [ ] **3E.** Verify Cloudflare auto-deploy completes — check footer shows v0.11.5

---

## Verification checklist (after deploy)

- [ ] "Save changes" button (not "Save profile") on edit page
- [ ] Saving successfully navigates to `/profile` view
- [ ] Save errors keep user on edit page
- [ ] "❄️ Vacation mode" button visible in streak area on own profile
- [ ] Button NOT visible on other members' profiles
- [ ] Modal opens with date pickers, validates correctly (no past dates, max 30 days)
- [ ] Activate → toast + modal closes + streak frozen indicator appears
- [ ] Cancel vacation → toast + modal closes + indicator removed
- [ ] No vacation section on profile edit page
- [ ] Mobile layout — modal and button render cleanly
