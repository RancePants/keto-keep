# Session 25b Build Plan — Landing Page Contrast Fix

**Version target:** v0.12.1
**Model recommendation:** Sonnet 4.6 / low effort
**Scope:** CSS-only fix for landing page readability

---

## 1. Fix landing.css — Wrong Variable Names + Force Light Theme

- [x] Force warm light palette on `.landing` wrapper
- [x] Replace ALL `var(--color-text-primary, ...)` → `var(--color-ink)`
- [x] Replace ALL `var(--color-text-secondary, ...)` → `var(--color-ink-soft)`
- [x] Replace `var(--color-surface, #fff)` → `var(--color-surface)`
- [x] Replace `var(--color-surface, #2a1f0e)` → `var(--color-surface)`
- [x] Replace `var(--color-border, rgba(0,0,0,0.1))` → `var(--color-border)`
- [x] Replace `var(--color-surface-raised, ...)` → `var(--color-surface-raised)`
- [x] Replace `var(--color-amber, #c08b30)` → `#c08b30`
- [x] Remove ALL `[data-theme='dark']` override blocks (8 removed)

---

## 2. Verification

- [x] lint — clean
- [x] build — clean
- [ ] Desktop: all sections readable — cream backgrounds, dark text, warm amber accents
- [ ] Mobile: same
- [ ] Toggle system dark mode: landing page should NOT change
- [ ] Hero and final CTA remain dark

---

## 3. Version Bump + Deploy

- [x] Bump `package.json` to `0.12.1`
- [x] `npm run lint` — clean
- [x] `npm run build` — clean
- [x] Commit: "fix: landing page contrast — pin warm light palette, fix CSS variable names (v0.12.1)"
- [x] Push → Cloudflare auto-deploy
- [x] Update canonical version in reference file (frontend → v0.12.1)
- [ ] Brief Session 25b log entry appended to Session 25

---

*End of build plan.*
