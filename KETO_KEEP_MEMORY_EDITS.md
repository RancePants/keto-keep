# The Keto Keep — Memory Edits for Claude Project

> **Instructions:** Copy each numbered edit below into the Keto Keep Claude project's
> memory system (Settings → Memory → Add edit). These ensure Claude starts every
> session with the right context and closes every session cleanly.

---

## Memory Edits to Add

### 1. Project identity and owner
```
The Keto Keep is a free community platform for ancestral/metabolic health (paleo, keto, carnivore) built by Rance Edwards (NBC-HWC). It replaces a $119/month Mighty Networks community. Tech stack: React + Supabase + Cloudflare Pages. GitHub repo: RancePants/keto-keep. Local directory: D:\The Keto Keep. Cost goal: $0/month at small scale. Three co-hosts (all NBC-HWC) need full admin access.
```

### 2. Session start gate
```
SESSION START GATE (mandatory): At the start of every chat, Claude must (1) read the shared project reference file, (2) confirm current phase, status, canonical versions, last session's work, next priorities, and any blockers, (3) verify deployed artifact versions match the reference file — STOP on mismatch, (4) agree on session goal before writing any code. Do NOT begin work until the start gate is complete.
```

### 3. Session end gate
```
SESSION END GATE (mandatory, 8 items): Before closing any chat: (1) files saved, (2) git commit + push, (3) deploy verified if anything was deployed, (4) roadmap updated in reference file, (5) session log entry written with Next Session Handoff, (6) architecture decisions logged if any, (7) canonical versions updated if changed, (8) updated reference file exported for Rance.
```

### 4. Interface routing
```
Workflow routing: Chat = planning, decisions, writing, reference file updates. Claude Code = builds, deploys, git (always write Code handoffs starting with cd "D:\The Keto Keep", model recommendation, and effort level — never manual CLI steps). Cowork = browser automation if needed. Separate design discussions from build sessions.
```

### 5. Version integrity
```
Version integrity is critical (learned from MST project). Mismatches between local files, deployed code, and the reference file cause wasted work. Always verify versions match before editing. If a mismatch is found → STOP and resolve before proceeding. Every deployable artifact is tracked in the Canonical Versions table in the project reference file.
```

### 6. Supabase patterns
```
Supabase patterns (learned from MST): Enable RLS on every table at creation — never retrofit. Design RLS policies during schema creation. Private storage buckets require authenticated fetch() → blob() → URL.createObjectURL() pattern. Single quotes in SQL must be escaped as ''. Run both security AND performance advisor types separately — performance surfaces more findings. Store user roles in a profiles table, not JWT claims.
```

### 7. Cloudflare Pages patterns
```
Cloudflare Pages patterns (learned from MST/FSH): _redirects 200 rewrites can silently break window.location.pathname — use 301 redirects or keep SPA routing simple. Never embed the app in iframes — they break native mobile behavior (scrolling, touch, viewport). GitHub auto-deploy is the preferred pipeline. Test on mobile during development, not as a final phase.
```

### 8. Security-first approach
```
Security-first approach for The Keto Keep: RLS on every table from creation. Auth flow uses Supabase Auth (don't rebuild what's built in). Storage bucket access policies defined at creation time. Run Supabase security + performance advisors after each schema change. Final security audit in Phase 5 before any public launch.
```

### 9. Build approach
```
The Keto Keep uses a 5-phase incremental build: Phase 1 Foundation (auth, profiles, layout, deployment), Phase 2 Forums (4 spaces with moderation), Phase 3 Events & Media (calendar, RSVP, YouTube embeds), Phase 4 LMS (course modules, progress tracking), Phase 5 Polish (messaging, badges, tags, accessibility). Each phase is independently deployable. Mobile-responsive from Phase 1.
```

### 10. File handling
```
For large files (250KB+), Filesystem:write_file can be unreliable — use present_files for delivery and Claude Code handoff for local saves/deploys. Git is the safety net — commit early and often with descriptive messages. Push after every session.
```

---

## Notes

- These edits are designed to be concise enough for Claude's memory system while capturing the critical operational patterns.
- They front-load the lessons from MST so Claude doesn't need to re-learn them.
- The project reference file (shared at session start) provides the detailed context — these memory edits provide the behavioral guardrails.
- If the project evolves (new tech decisions, new gotchas), add new memory edits and note them in the reference file.
