# Session 25 Build Plan — Landing Page Polish + Reply Count Bugfix

**Version target:** v0.12.0
**Model recommendation:** Sonnet 4.6 / medium effort
**Scope:** Rewrite public landing page (Phase 5F) + fix forum reply count bug

---

## 0. Pre-Build Setup

- [ ] Confirm `public/bg-full-castle.png` exists (already there) — this is the hero background image
- [ ] Create `public/coaches/` directory (for future headshot photos)
- [ ] Read `THE_KETO_KEEP_CONTENT_REFERENCE.md` from repo root for all copy

---

## 1. Bugfix: Forum Reply Count Shows "0" Until Clicked

**File:** `src/pages/SpaceView.jsx`

**Problem:** In the initial-load effect, `setPosts(rows)` + `setLoading(false)` triggers a render BEFORE `hydrateMeta(rows)` has fetched reply counts. Posts appear with `replyCounts[post.id] ?? 0` → shows "0 replies" until expanded.

**Fix:** Move `await hydrateMeta(rows)` BEFORE the `setPosts`/`setLoading` calls so reply counts are ready on first render.

- [ ] In the initial-load effect (~line 85-100), restructure to:
  ```
  const { rows, done } = await loadPage(spaceId, 0);
  if (cancelled) return;
  await hydrateMeta(rows);    // ← fetch meta FIRST
  if (cancelled) return;      // ← re-check cancellation after async
  setPosts(rows);
  setHasMore(!done);
  setLoading(false);
  ```

- [ ] In the `loadMore` function (~line 110-118), same fix:
  ```
  const { rows, done } = await loadPage(space.id, next);
  await hydrateMeta(rows);    // ← fetch meta BEFORE setting posts
  setPosts((prev) => [...prev, ...rows]);
  setPage(next);
  setHasMore(!done);
  ```
  (Remove the trailing `await hydrateMeta(rows)` that was after these lines)

- [ ] Verify: load a space with posts that have replies → count should show correctly on first render, no "0" flash

---

## 2. Landing Page — New `src/styles/landing.css`

Create `src/styles/landing.css` and import it from `src/styles/index.css` (or wherever the CSS barrel file is).

**Design system:**
- The landing page renders inside `.app-shell` (no sidebar, no auth)
- Body has castle bg image via `var(--bg-image)` — the landing page should COVER this with its own opaque backgrounds so sections aren't transparent
- Castle/warm theme: dark hero + parchment content sections + dark CTA footer
- Mobile-first: stack everything single-column ≤768px
- Respect existing dark mode variables where possible; hero/CTA use hardcoded dark tones (they're always dark regardless of theme)

- [ ] `.landing` wrapper — `background: var(--color-cream, #f5f0e6)` to cover body bg. No max-width constraint (full-bleed sections).

- [ ] `.landing-hero` — Full-bleed section. `background-image: url('/bg-full-castle.png')`. `background-size: cover; background-position: center;` Dark overlay via `::before` pseudo (rgba(0,0,0,0.55)). Min-height ~70vh on desktop, ~50vh on mobile. Center content vertically. Text: cream/amber palette.

- [ ] `.landing-hero-inner` — max-width 720px, centered, text-align center, padding for breathing room, position relative (above overlay).

- [ ] `.landing-logo` — Logo image, max-width 80px, centered, margin-bottom.

- [ ] `.landing-eyebrow` — Small uppercase text "Welcome to", letter-spacing 2px, amber color (#d4a855).

- [ ] `.landing-title` — "The Keto Keep", large font (clamp(2rem, 5vw, 3.5rem)), cream color (#f5e6c8), font-weight 500.

- [ ] `.landing-tagline` — Tagline text, cream-muted (#c9b896), max-width 480px, centered, line-height 1.6.

- [ ] `.landing-cta-group` — Flex row, centered, gap 12px, wrap on mobile. Primary CTA: amber bg (#c08b30), dark text. Ghost CTA: transparent, amber border/text.

- [ ] `.landing-slogan-bar` — "Keep Calm" divider. Dark bg (#3a2a12), amber text, italic, centered, py 12px. Top/bottom amber border (subtle).

- [ ] `.landing-section` — Max-width 960px, centered, padding 4rem 2rem. Alternating backgrounds: odd = cream/primary, even = secondary/muted. Title + subtitle pattern.

- [ ] `.landing-section-eyebrow` — Uppercase small text, muted, letter-spacing, centered.

- [ ] `.landing-section-title` — 1.75rem, weight 500, centered, mb 2rem.

- [ ] `.landing-value-grid` — CSS grid: 2 columns on desktop (min 280px), 1 column on mobile. Gap 16px. Fifth card spans full width centered (max-width 50% on desktop).

- [ ] `.landing-value-card` — Parchment bg, rounded corners, padding 1.5rem. Icon circle (48px, amber-tinted bg) + title (1rem, weight 500) + description (0.9rem, muted). Subtle border.

- [ ] `.landing-coach-card` — White/primary bg card, rounded-lg, border, padding 1.5rem. Flex row: avatar (72px square, 6px radius) + text column. Name = 1.1rem weight 500. Role = amber small text. Bio = 0.9rem muted, line-height 1.6. Stack on mobile (avatar above text, centered).

- [ ] `.landing-coach-initials` — 72px square, 6px radius, amber gradient bg (#c08b30 → #a07020), centered white text 1.2rem weight 500. Fallback when no photo.

- [ ] `.landing-faq-list` — Flex column, gap 8px.

- [ ] `.landing-faq-item` — Parchment bg, rounded, border. Clickable header with question + chevron. Expand/collapse with smooth transition (max-height or details/summary).

- [ ] `.landing-faq-question` — Font weight 500, cursor pointer, padding 1rem 1.25rem. Flex between text and chevron icon. Chevron rotates on open.

- [ ] `.landing-faq-answer` — Padding 0 1.25rem 1rem. Muted text, line-height 1.6.

- [ ] `.landing-final-cta` — Dark castle-tone section (matches hero palette). Background gradient (warm charcoal). Large centered title, subtitle, primary CTA button, login link below. Padding 4rem 2rem.

- [ ] Mobile breakpoint (≤768px): hero min-height 50vh, value grid 1 column, coach cards stack vertically, section padding shrinks, font sizes scale down via clamp.

---

## 3. Landing Page — Rewrite `src/pages/Landing.jsx`

Full rewrite of the existing placeholder.

- [ ] Import `useState` from React, `Link` from react-router-dom, `usePageTitle`
- [ ] Import `'../styles/landing.css'` (or ensure it's in the CSS barrel)
- [ ] `usePageTitle('Welcome')` (or no arg for default "The Keto Keep")

### Hero Section
- [ ] `.landing-hero` with bg image
- [ ] Logo: `<img src="/tkk-logo-transparent.png" alt="The Keto Keep" className="landing-logo" />`
- [ ] Eyebrow: "Welcome to"
- [ ] Title: "The Keto Keep"
- [ ] Tagline: "Expert coaches, supportive community. Every low-carb lifestyle."
- [ ] CTA group: `<Link to="/signup">Sign up free</Link>` (primary) + `<Link to="/login">Already a member? Log in</Link>` (ghost)

### Slogan Bar
- [ ] "Keep calm and paleo / keto / carnivore on"

### Value Propositions Section
- [ ] Eyebrow: "Here's what to expect"
- [ ] Title: "More than a diet group"
- [ ] 5 value cards with thematic icons (use simple SVG icons or unicode — NO emoji):
  1. Expert Guidance You Can Trust — shield icon — "Gain direct access to National Board Certified Health & Wellness Coaches..."
  2. A Community That Gets You — people/handshake icon — "Connect with like-minded individuals..."
  3. Whole-Person Wellness Tools — sparkle/sun icon — "Go beyond food: explore resources on sleep, stress, movement..."
  4. Interactive Education — play/video icon — "Join live-streamed workshops and Q&A sessions..."
  5. Personalized Coaching — chat icon — "When you're ready for deeper support, work one-on-one..."
- [ ] Copy each value prop's full description from `THE_KETO_KEEP_CONTENT_REFERENCE.md`

### Meet the Team Section
- [ ] Eyebrow: "Your coaches"
- [ ] Title: "Meet the team"
- [ ] **Justine Roberts card FIRST** (Rance's preference — out of respect):
  - Initials "JR" in amber circle (swap to `<img src="/coaches/justine.jpg">` when available)
  - Name: "Justine Roberts, NBC-HWC"
  - Role: "Co-Host & Coach"
  - Full bio from content reference (all 3 paragraphs)
- [ ] **Rance Edwards card SECOND:**
  - Initials "RE" in amber circle (swap to `<img src="/coaches/rance.jpg">` when available)
  - Name: "Rance Edwards, NBC-HWC"
  - Role: "Founder, Co-Host & Coach"
  - Full bio from content reference (all 3 paragraphs)

### FAQ Section
- [ ] Eyebrow: "Questions?"
- [ ] Title: "Frequently asked"
- [ ] 7 accordion items (click to expand/collapse, one at a time or multi-open — Code's choice):
  1. "What is The Keto Keep?"
  2. "Who is this community for?"
  3. "What do I get when I join?"
  4. "Is this a replacement for medical advice?"
  5. "Do I have to follow a strict version of keto?"
  6. "What makes The Keto Keep different from other groups?"
  7. "How do I get started?"
- [ ] Copy each answer from `THE_KETO_KEEP_CONTENT_REFERENCE.md`
- [ ] Accordion state: `useState` with index tracking (null = all closed, number = open item)

### Final CTA Section
- [ ] Dark warm background (castle palette)
- [ ] Title: "Your community awaits"
- [ ] Subtitle: "Free to join. No credit card. No catch."
- [ ] Primary CTA: `<Link to="/signup">Sign up free</Link>`
- [ ] Login link: "Already a member? Log in" → `/login`

---

## 4. CSS Import + Landing-Specific Overrides

- [ ] Add `@import './landing.css';` to the CSS barrel file (check `src/styles/index.css` or wherever imports are aggregated)
- [ ] If the `.app-shell` overlay bleeds onto the landing page (dimming the hero), add `.landing-hero` override to ensure the hero image is vivid. Alternatively, the `.landing` wrapper can override `.app-shell` bg if needed.
- [ ] The existing `.app-footer` from Layout.jsx will render below the landing page. Ensure the landing's dark final-CTA section + Layout footer don't create a jarring double-footer. The landing page's own "footer-ish" CTA is part of Landing.jsx; the Layout footer (with legal links + version) is from Layout.jsx. They should look distinct but not clash.

---

## 5. Verification

- [ ] Desktop: all 6 sections render correctly, hero image loads, FAQ accordion works, CTAs link to /signup and /login
- [ ] Mobile (≤768px): single-column layout, hero scales, value cards stack, coach cards stack, FAQ readable, CTAs tappable
- [ ] Dark mode: hero and CTA sections are always dark (hardcoded). Content sections respect theme (parchment light / charcoal dark).
- [ ] Reload with no auth session → landing page renders. Click "Sign up free" → /signup page. Click "Log in" → /login page.
- [ ] Forum bugfix: navigate to a forum space with posts that have replies → reply count shows correct number immediately (no "0" flash)
- [ ] Updated logo: verify `tkk-logo-transparent.png` renders correctly in sidebar (desktop) and mobile header — Rance updated the file in place, no code changes needed, just confirm it looks right after deploy

---

## 6. Version Bump + Deploy

- [ ] Bump `package.json` version to `0.12.0`
- [ ] `npm run lint` — clean
- [ ] `npm run build` — clean
- [ ] Commit with message: "Phase 5F: landing page polish + fix reply count bug (v0.12.0)"
- [ ] Push to `main` → Cloudflare Workers auto-deploy
- [ ] Verify deploy: visit `https://keto-keep.rance-8c6.workers.dev/` while logged out → new landing page renders

---

## 7. Session End Gate

- [ ] Copy dated reference file: `THE_KETO_KEEP_PROJECT_REFERENCE_2026-04-19_S25.md` to `D:\The Keto Keep\Project Reference\`
- [ ] Also copy the Session 23 dated file if not done: `THE_KETO_KEEP_PROJECT_REFERENCE_2026-04-19_S23.md`
- [ ] Update canonical versions in reference file (frontend → v0.12.0)
- [ ] Write Session 25 log entry
- [ ] Update roadmap (check off Phase 5F items)
- [ ] Export updated reference file for Rance

---

*End of build plan. Code: read this first, check off tasks as you go, re-read after ANY compaction.*
