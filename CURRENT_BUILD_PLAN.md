# Pre-Launch Cleanup — Build Plan
# ================================================================
# STATUS: COMPLETE
# Session: 21
# Target version: v0.8.2
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


## 1. DISCOVERY — Find all window.confirm / window.alert usage

- [x] Run: `grep -rn "window\.confirm\|window\.alert\|confirm(" src/ --include="*.jsx" --include="*.js"` and list every hit below
- [x] Document each hit here (file, line, what it does):
  - Hit 1: `src/pages/AdminTags.jsx:68` — deleteTag: "Delete tag ${name}? Members who selected it will lose that selection."
  - Hit 2: `src/pages/AdminAdminTags.jsx:118` — deleteTag: "Delete internal tag ${name}? Any members assigned this tag will lose the assignment."
  - Hit 3: `src/components/courses/CourseFormModal.jsx:134` — remove: "Delete this course? All modules, lessons, and member progress will be removed."
  - Hit 4: `src/components/courses/ModuleFormModal.jsx:103` — remove: "Delete this module? All its lessons and progress will be removed."
  - Hit 5: `src/components/courses/LessonFormModal.jsx:118` — remove: "Delete this lesson? Member progress on it will be removed."
  - Hit 6: `src/components/profile/AwardBadgeModal.jsx:102` — revoke: "Remove this badge from ${targetName}?"
  - Hit 7: `src/components/events/EventFormModal.jsx:139` — remove: "Delete this event? All RSVPs will be removed."
  - Hit 8: `src/components/forum/ReplyItem.jsx:52` — deleteReply: "Delete this reply?"
  - Hit 9: `src/components/forum/PostCard.jsx:64` — doDelete: "Delete this post? All replies will be removed."


## 2. REPLACE window.confirm / window.alert WITH Toast + Modal

For each hit found in step 1, replace the native browser dialog with the
project's existing Toast (`useToast`) or Modal (`components/ui/Modal.jsx`)
primitives. Guidelines:

- Destructive confirmations (delete event, delete course, delete module,
  delete lesson, delete post, etc.) → use a Modal with `variant="danger"`,
  a clear warning message, and explicit Confirm/Cancel buttons.
- Success/info alerts → use `toast.success()` or `toast.info()`
- Error alerts → use `toast.error()`

For each replacement:
- [x] Hit 1 replaced: AdminTags.jsx — added `tagToDelete` state, danger Modal with "Delete tag / Cancel" buttons
- [x] Hit 2 replaced: AdminAdminTags.jsx — added `tagToDelete` state, danger Modal with "Delete tag / Cancel" buttons
- [x] Hit 3 replaced: CourseFormModal.jsx — added `confirmDelete` state, separate danger Modal rendered in fragment alongside main modal
- [x] Hit 4 replaced: ModuleFormModal.jsx — same pattern as CourseFormModal
- [x] Hit 5 replaced: LessonFormModal.jsx — same pattern
- [x] Hit 6 replaced: AwardBadgeModal.jsx — added `badgeToRevoke` state, danger Modal "Remove badge / Cancel"
- [x] Hit 7 replaced: EventFormModal.jsx — same pattern as CourseFormModal
- [x] Hit 8 replaced: ReplyItem.jsx — added `confirmDelete` state, imported Modal, danger Modal "Delete reply / Cancel"
- [x] Hit 9 replaced: PostCard.jsx — added `confirmDelete` state, imported Modal, danger Modal "Delete post / Cancel"

- [x] Verify: `grep -rn "window\.confirm\|window\.alert" src/` returns ZERO matches — CONFIRMED ZERO


## 3. SUPABASE ADVISOR AUDIT (via Supabase MCP)

- [x] Run security advisor (`get_advisors` type `security`)
  - Expected: only `auth_leaked_password_protection` WARN (Pro Plan only — cannot fix on free tier)
  - Result: ONLY `auth_leaked_password_protection` WARN — accepted, no new findings. CLEAN.
- [x] Run performance advisor (`get_advisors` type `performance`)
  - Expected: zero `auth_rls_initplan`, zero `unindexed_foreign_keys`
  - Result: 21 `unused_index` INFO findings (all expected FK cover indexes and query support indexes on a low-volume fresh DB — not actionable at this scale). Zero `auth_rls_initplan`. Zero `unindexed_foreign_keys`. CLEAN.
- [x] If any unexpected findings → remediate before proceeding — NO UNEXPECTED FINDINGS. No remediation needed.


## 4. FINAL RLS POLICY REVIEW

- [x] Run: `select tablename, policyname, permissive, cmd from pg_policies where schemaname = 'public' order by tablename, cmd;`
  - Total policy count: 81 policies across 18 tables
  - Verify every table with data has RLS enabled — CONFIRMED
- [x] Run: `select relname, relrowsecurity from pg_class ...`
  - Result: ALL 18 public tables have `relrowsecurity = true`
  - Tables: admin_tags, badges, courses, event_rsvps, events, forum_posts, forum_reactions, forum_replies, forum_spaces, lesson_progress, lessons, member_admin_tags, member_badges, member_tags, modules, notifications, profiles, tags
  - List any tables with `relrowsecurity = false`: NONE
- [x] Spot-check: verify all policies use `(select auth.uid())` wrapping
  - Result: All policies use `( SELECT auth.uid() AS uid)` — PostgreSQL's stored representation of the `(select auth.uid())` subquery. Every policy is correctly wrapped. ZERO bare `auth.uid()` calls. CLEAN.
- [x] Verify RESTRICTIVE write-gate policies exist on all member-writable tables:
  - Count: 14 RESTRICTIVE policies
  - Coverage: event_rsvps (INSERT/UPDATE/DELETE), forum_posts (INSERT/UPDATE), forum_reactions (DELETE/INSERT), forum_replies (INSERT/UPDATE), lesson_progress (INSERT/UPDATE), member_tags (INSERT/DELETE), notifications (INSERT)
  - All 7 required tables covered. COMPLETE.


## 5. BUILD + DEPLOY

- [x] `npm run lint` — CLEAN
- [x] `npm run build` — CLEAN
- [x] Bump `package.json` version `0.8.1` → `0.8.2`
- [x] Commit: `Pre-launch cleanup: replace native dialogs, advisor audit, RLS review (v0.8.2)`
- [x] Push to `main` — commit adc505c
- [x] Verify Cloudflare Workers deploy — auto-deploy triggered on push to main


## 6. UPDATE REFERENCE FILE

- [x] Canonical version date → session 21
- [x] Frontend version → v0.8.2
- [x] Phase 5B roadmap: check off items 2/3/4, remove items 5/6, note items 1/7 as deferred post-launch
- [x] Architecture & Design Decisions: add entry for replacing native dialogs with Modal/Toast
- [x] Session 21 log with findings from advisor audit + RLS review + list of replaced dialogs
- [x] Next Session Handoff: landing page content, custom domain discussion, seed Justine's admin account
- [x] Save dated copy to `Project Reference/THE_KETO_KEEP_PROJECT_REFERENCE_2026-04-19_S21.md`
- [x] Archive this build plan to `Project Reference/PRELAUNCH_CLEANUP_BUILD_PLAN_COMPLETED.md`
