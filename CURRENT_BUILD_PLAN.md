# Session 26 Build Plan — UI Fixes + Rich Text Editor

**Session:** 26
**Starting version:** v0.12.1
**Target version:** v0.13.0
**Schema changes:** None

---

## 1. Dark Mode Fix: Forum Post Edit Text Box

- [x] 1A. Identify the forum post edit textarea/input — found inline-styled textarea in PostCard.jsx and ReplyItem.jsx
- [x] 1B. Added `.post-edit-field` CSS class to edit inputs/textareas; added dark-mode-aware rule in forums.css using `var(--color-surface)` / `var(--color-ink)`
- [x] 1C. (deferred to deploy verify)

## 2. Dark Mode Fix: Members Section Search Fields

- [x] 2A. Identified inputs/selects inside `.member-filter-field` labels in MemberFilters.jsx
- [x] 2B. Added dark-mode-aware CSS for `.member-filter-field input, .member-filter-field select` in members.css
- [x] 2C. (deferred to deploy verify)

## 3. Rich Text Editor + Emoji Picker for Forum Posts

### 3A. Install dependencies
- [x] 3A1. Installed `@tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/pm`
- [x] 3A2. Installed `emoji-picker-react`

### 3B. Create RichTextEditor component
- [x] 3B1. Created `src/components/ui/RichTextEditor.jsx` with bold, italic, bullet, ordered, link, emoji toolbar
- [x] 3B2. Accepts `content` (HTML string) and `onChange(html)` callback
- [x] 3B3. Accepts `placeholder` prop
- [x] 3B4. Emoji picker opens on smiley button, inserts at cursor, closes on select or outside click
- [x] 3B5. Created `src/styles/rich-editor.css` — toolbar, buttons, emoji panel, rendered content, dark mode via CSS vars

### 3C. Integrate into PostComposer
- [x] 3C1. Replaced plain textarea with `<RichTextEditor>` in PostComposer.jsx
- [x] 3C2. HTML output captured via `onChange`; bodyText (HTML-stripped) used for validation
- [x] 3C3. Plain text bodies render fine (DOMPurify allows text nodes)

### 3D. Integrate into ReplyComposer
- [x] 3D1. Replaced plain textarea with `<RichTextEditor slim>` in ReplyComposer.jsx
- [x] 3D2. HTML output captured on submit
- [x] 3D3. Slim toolbar: bold, italic, link, emoji (no lists)

### 3E. Render rich content in feed
- [x] 3E1. PostCard.jsx renders `post.body` as DOMPurify-sanitized HTML (`.post-rich-body`)
- [x] 3E2. ReplyItem.jsx renders `reply.body` as DOMPurify-sanitized HTML (`.reply-rich-body`)
- [x] 3E3. CSS for `.post-rich-body` and `.reply-rich-body` (a, ul, ol, strong, em) in rich-editor.css

### 3F. Integrate into post edit mode
- [x] 3F1. PostCard edit mode uses `<RichTextEditor>` with existing body pre-loaded
- [x] 3F2. ReplyItem edit mode uses `<RichTextEditor slim>` with existing body pre-loaded

### 3G. Security
- [x] 3G1. DOMPurify sanitizes with ALLOWED_TAGS: b, i, strong, em, a, ul, ol, li, p, br
- [x] 3G2. (deferred to deploy verify)

## 4. Members Search Results Layout Overhaul

### 4A. Change grid to single-column horizontal cards
- [x] 4A1. `.member-grid` changed to `grid-template-columns: 1fr`
- [x] 4A2. `.member-card-link` is now `flex-direction: row`; new `.member-card-avatar-col` + `.member-card-content` divs
- [x] 4A3. `@media (max-width: 480px)` stacks to column

### 4B. Frame alignment on member cards
- [x] 4B1. `.member-card-avatar-col-framed` adds `margin-top: 16px` to align frame top with name top
- [x] 4B2. Unframed avatar column aligns naturally at flex-start
- [x] 4B3. Profile page already has `.profile-top .profile-frame:not(.profile-frame-none) { margin-top: 35px; }` (unchanged)

### 4C. Spacing: text not too close to profile picture frame
- [x] 4C1. `.member-card-link` gap is `var(--space-4)` between avatar col and content
- [x] 4C2. Content column uses flex gap for consistent spacing
- [x] 4C3. (deferred to deploy verify)

## 5. Final Steps

- [x] 5A. `npm run lint` — clean (removed invalid eslint-disable comment)
- [x] 5B. `npm run build` — clean (1.37 MB JS, chunk-size warning only — not an error)
- [x] 5C. Bumped `package.json` version to `0.13.0`
- [ ] 5D. Git commit
- [ ] 5E. Git push to `main`
- [ ] 5F. Verify Cloudflare auto-deploy
- [ ] 5G. Update `THE_KETO_KEEP_PROJECT_REFERENCE.md`
- [ ] 5H. Save dated copy
