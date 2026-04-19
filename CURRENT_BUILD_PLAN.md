# Dark Mode Stone Palette Fix — Build Plan
# ================================================================
# STATUS: NOT STARTED
# Session: 20 (expected)
# Target version: v0.8.1
#
# INSTRUCTIONS FOR CLAUDE CODE:
#   1. Read this file at the START of the session.
#   2. After completing each task, update the checkbox: [ ] → [x]
#   3. After EVERY compaction event, RE-READ this file immediately
#      to know where you left off. Do NOT rely on memory.
#   4. If a task needs a note, add it inline after the checkbox.
#   5. Do not delete completed items — they serve as a record.
#   6. At session end, this file should be fully checked off.
# ================================================================


## 1. READ CURRENT STATE

- [ ] Read `src/styles/variables.css` to confirm the current dark palette values
- [ ] Confirm no other CSS files have hardcoded dark-purple colors outside of variables.css


## 2. FIX `[data-theme="dark"]` BLOCK (line ~173)

Replace ALL purple-undertone colors with warm charcoal/stone equivalents.
The key principle: shift the blue channel DOWN to match or sit below R/G,
and add a slight warm (brown/amber) undertone.

Core surfaces:
- [ ] `--color-cream: #1a1a2e` → `#1c1b18` (warm charcoal)
- [ ] `--color-parchment: #252540` → `#262420` (dark warm stone)
- [ ] `--color-sand: #2f2f4a` → `#302d28` (warm stone sand)
- [ ] `--color-ink-faint: #8a8494` → `#8a8580` (warm grey)
- [ ] `--color-muted: #9a93a5` → `#9a9590` (warm grey muted)
- [ ] `--color-surface: #242440` → `#252320` (stone card)
- [ ] `--color-surface-alt: #2a2a48` → `#2c2a26` (stone card alt)
- [ ] `--color-border: #393956` → `#3a3834` (stone border)
- [ ] `--color-border-strong: #4f4f6e` → `#504c46` (stone border strong)
- [ ] `--bg-page: #0e0e1c` → `#121110` (deepest stone)
- [ ] `--bg-overlay: rgba(15, 15, 28, 0.72)` → `rgba(18, 17, 16, 0.72)` (warm dark overlay)
- [ ] `--nav-bg: rgba(26, 26, 46, 0.92)` → `rgba(28, 27, 24, 0.92)` (warm nav)
- [ ] `--color-modal-backdrop: rgba(5, 5, 12, 0.72)` → `rgba(5, 5, 4, 0.72)` (warm backdrop)

Q&A event type tint (currently purple — shift to cool blue-grey stone):
- [ ] `--tint-qa-bg: #2f2440` → `#262a2e` (cool stone)
- [ ] `--tint-qa-border: #4a3d5e` → `#3e4448` (cool stone border)
- [ ] `--tint-qa-text: #c0a8d8` → `#a8c0c8` (cool blue-grey text)

Other elements with purple undertones:
- [ ] `--avatar-overlay: rgba(10, 10, 20, 0.65)` → `rgba(10, 10, 8, 0.65)`
- [ ] `--avatar-overlay-strong: rgba(10, 10, 20, 0.80)` → `rgba(10, 10, 8, 0.80)`
- [ ] `--avatar-overlay-stronger: rgba(10, 10, 20, 0.92)` → `rgba(10, 10, 8, 0.92)`
- [ ] `--video-placeholder: linear-gradient(135deg, #0a0a14, #1a1a2e)` → `linear-gradient(135deg, #0a0a08, #1c1b18)`


## 3. FIX `@media (prefers-color-scheme: dark)` FALLBACK BLOCK (line ~284)

This block duplicates the dark palette for users with theme_preference = 'system'.
Apply the EXACT SAME color replacements as section 2 above.

- [ ] All core surface colors updated to match section 2
- [ ] Q&A tint updated to match section 2
- [ ] Avatar overlays updated to match section 2
- [ ] Video placeholder updated to match section 2


## 4. VERIFY

- [ ] `npm run build` — clean, no errors
- [ ] `npm run lint` — clean
- [ ] Visually confirm: grep variables.css for any remaining `#1a1a2e`, `#2525`, `#2424`, `#2a2a4`, `#3939`, `#4f4f6`, `#0e0e1`, `8494`, `93a5` — should find ZERO matches
- [ ] Confirm the light mode `:root` palette is UNCHANGED


## 5. DEPLOY + REFERENCE FILE

- [ ] Bump `package.json` version `0.8.0` → `0.8.1`
- [ ] Commit: `Fix dark mode palette: warm stone charcoal instead of purple (v0.8.1)`
- [ ] Push to `main`
- [ ] Verify Cloudflare Workers deploy (check asset hashes)
- [ ] Update reference file: canonical version → v0.8.1, session 20 log entry, Architecture & Design Decisions entry for stone palette rationale
- [ ] Save dated copy to `Project Reference/THE_KETO_KEEP_PROJECT_REFERENCE_{date}_S20.md`
- [ ] Archive this build plan to `Project Reference/DARK_MODE_FIX_BUILD_PLAN_COMPLETED.md`
