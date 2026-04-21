# Session 26b Build Plan — Five Polish Fixes

**Session:** 26b
**Starting version:** v0.13.0
**Target version:** v0.13.1
**Schema changes:** None

---

## 1. Link Button UX — Auto-Link + Inline Popup

- [x] 1A. In `RichTextEditor.jsx`, enable Tiptap Link extension's `autolink: true` so typed/pasted URLs automatically become clickable links
- [x] 1B. Replace the `window.prompt` call in `setLink` with a small inline popup component. When the link button is clicked:
  - If text is selected (or cursor is on an existing link), show a small floating panel below the toolbar with:
    - A URL text input (pre-filled with existing href if editing)
    - "Apply" button to set the link
    - "Remove" button to unset the link (only shown when editing an existing link)
    - Clicking outside or pressing Escape closes the panel
  - If no text is selected and no existing link, the panel still opens — user types URL, and the URL text itself becomes the linked text
- [x] 1C. Add CSS for the link popup panel in `rich-editor.css`: positioned below the link button (absolute, z-index above emoji panel level), dark-mode aware via CSS variables, compact single-row layout with input + buttons
- [x] 1D. Verify: select text → click link → popup appears → type URL → click Apply → text is now a link. Click on existing link → click link button → popup shows current URL with Remove option. Type a URL in the editor body → it auto-links on space/enter.

## 2. Emoji Picker — Overflow Fix + Dark Mode

- [x] 2A. In `rich-editor.css`, change `.rte-wrap` from `overflow: hidden` to `overflow: visible` (the border-radius + background still work without overflow hidden; the emoji panel needs to float outside the wrapper). If removing overflow:hidden breaks border-radius clipping on the editor content, add `overflow: hidden` specifically on `.rte-editor-wrap` instead.
- [x] 2B. In `RichTextEditor.jsx`, detect the current theme. Read `document.documentElement.getAttribute('data-theme')` or check `window.matchMedia('(prefers-color-scheme: dark)')` — use the same detection pattern as the rest of the app. Pass `theme="dark"` or `theme="light"` to the `<EmojiPicker>` component (emoji-picker-react supports this prop natively).
- [x] 2C. Position the emoji panel so it doesn't get cut off by the post composer container. The panel should open upward (bottom-anchored) if there isn't enough room below, or use a portal/fixed positioning approach. At minimum, ensure the `.rte-emoji-panel` doesn't get clipped by any parent with `overflow: hidden` — check `.post-composer`, `.reply-composer`, and any parent containers. May need to use `position: fixed` with calculated coordinates instead of `position: absolute`.
- [x] 2D. Verify: click emoji button in dark mode → picker appears fully visible (not clipped), styled with dark background. Click emoji button in light mode → picker appears with light styling. Picker should be fully usable without scrolling or being cut off.

## 3. Member Card Layout — Better Info Distribution

- [x] 3A. Increase the gap between avatar column and content column. Change `.member-card-link` gap from `var(--space-4)` to `var(--space-5)` or larger so text doesn't crowd the frame.
- [x] 3B. Restructure the card content layout to use the full card width. Ideas:
  - The name + dietary tag + streak should be on one line, using full width
  - Journey duration + location can be on the next line
  - Bio should span the full card width
  - Interest tags and admin tags should flow across the full width
  - Consider a two-row layout within the content area: top row = identity info (name, tags, location), bottom area = bio + chips
- [x] 3C. Ensure the card doesn't feel like a narrow left-aligned column — the content should fill the available horizontal space naturally
- [x] 3D. Check that the admin menu (three-dot button) doesn't overlap with the spread-out content
- [x] 3E. Mobile (≤480px): vertical stack should still work cleanly
- [x] 3F. Verify with and without frames, with and without all optional fields (dietary, journey, location, bio, badges, interest tags, admin tags)

## 4. Dark Mode Fix — Emoji Reaction Count Text

- [x] 4A. In `src/styles/forums.css`, the `.reaction-chip` class has no explicit `color` set (only `.reaction-chip.mine` sets color). The reaction count number inherits default text color which is black/invisible in dark mode.
- [x] 4B. Add `color: var(--color-ink)` to the `.reaction-chip` base rule so the count is always readable regardless of theme.
- [x] 4C. Verify: toggle dark mode, view a post with emoji reactions (🥩, ❤️, etc.) → the count number next to each emoji should be clearly visible light text on dark background.

## 5. Notification Bell — Move to Floating Top-Right on Desktop

### Current state:
- **Mobile:** Bell is in `SidebarMobileHeader.jsx` → top-right of sticky header. **This is fine — leave it.**
- **Desktop:** Bell is in `Sidebar.jsx` footer → bottom-left corner, next to theme toggle + sign-out. Hard to find, dropdown opens off-screen downward.

### Changes:
- [x] 5A. In `src/components/ui/Sidebar.jsx`, remove `<NotificationBell />` from the sidebar footer. Remove the `NotificationBell` import if it becomes unused (the mobile header still imports its own copy).
- [x] 5B. In `src/components/Layout.jsx`, add `<NotificationBell />` inside `.app-main-wrap`, positioned as a floating fixed element in the top-right of the content area. This is the **desktop-only** bell — hide it at ≤768px via CSS (the mobile header bell covers that breakpoint).
- [x] 5C. Add CSS for the floating bell in `src/styles/layout.css` or `src/styles/notifications.css`:
  - `position: fixed; top: 16px; right: 24px;` (or similar — adjust so it doesn't overlap content)
  - `z-index: 40` (above content, below modals)
  - Hidden at ≤768px: `display: none` (mobile uses the header bell)
  - The notification dropdown should open downward and to the left from the bell (standard top-right dropdown behavior)
- [x] 5D. Verify the dropdown positioning in `NotificationBell.jsx` — since the bell is now top-right instead of bottom-left, the dropdown should naturally open below + anchored right. Check that the dropdown CSS in `notifications.css` works in this new position (it may need `right: 0` instead of `left: 0`).
- [x] 5E. Verify: desktop → bell floats top-right, clearly visible → click → dropdown opens below, fully on-screen. Mobile → bell is in the top header bar as before, no floating bell visible.

## 6. Final Steps

- [x] 6A. Run `npm run lint` — fix any errors
- [x] 6B. Run `npm run build` — verify clean build
- [x] 6C. Bump version in `package.json` to `0.13.1`
- [ ] 6D. Git commit: "fix: link popup, emoji picker, member cards, reaction count, floating notification bell (v0.13.1)"
- [ ] 6E. Git push to `main`
- [ ] 6F. Verify Cloudflare auto-deploy
- [ ] 6G. Update `THE_KETO_KEEP_PROJECT_REFERENCE.md`: canonical versions, session 26b log entry
- [ ] 6H. Save dated copy: `D:\The Keto Keep\Project Reference\THE_KETO_KEEP_PROJECT_REFERENCE_2026-04-20_S26b.md`
