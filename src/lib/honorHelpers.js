// Fire-and-forget honor auto-award engine. On each trigger, compute
// eligibility for relevant auto honors and insert missing awards.
// Mirrors notificationHelpers.js: swallow errors, never block the
// user's primary action.
//
// Eligibility thresholds are checked client-side for simplicity and
// parity with the existing notification pattern. The member_badges
// `member_badges_self_auto_insert` RLS policy restricts self-awards
// to honors where unlock_method='auto', so the blast radius of any
// client tampering is bounded to the honors catalog (cosmetic only).

import { notifyBadgeAwarded } from './notificationHelpers.js';

async function fetchCatalog(supabase) {
  const { data, error } = await supabase
    .from('badges')
    .select('id, badge_type, name, threshold, unlock_method')
    .eq('unlock_method', 'auto');
  if (error) {
    console.error('honorHelpers catalog:', error.message);
    return [];
  }
  return data || [];
}

async function fetchOwnedTypes(supabase, userId) {
  const { data, error } = await supabase
    .from('member_badges')
    .select('badges!inner(badge_type)')
    .eq('user_id', userId);
  if (error) {
    console.error('honorHelpers owned:', error.message);
    return new Set();
  }
  return new Set((data || []).map((r) => r.badges?.badge_type).filter(Boolean));
}

async function insertAward(supabase, userId, catalogRow, awards) {
  const { error } = await supabase.from('member_badges').insert({
    user_id: userId,
    badge_id: catalogRow.id,
    awarded_by: null,
  });
  if (error) {
    // Most commonly a unique-constraint collision if two triggers race.
    // Stay quiet unless it's something unexpected.
    if (!/duplicate|unique/i.test(error.message || '')) {
      console.error('honorHelpers insert:', error.message);
    }
    return;
  }
  awards.push(catalogRow);
  notifyBadgeAwarded(supabase, userId, catalogRow.name, null, `/profile/${userId}`);
}

function findRow(catalog, badgeType) {
  return catalog.find((c) => c.badge_type === badgeType) || null;
}

async function maybeAward(supabase, userId, ctx, badgeType, count) {
  if (ctx.owned.has(badgeType)) return;
  const row = findRow(ctx.catalog, badgeType);
  if (!row) return;
  const threshold = row.threshold ?? 1;
  if (count < threshold) return;
  await insertAward(supabase, userId, row, ctx.awards);
  ctx.owned.add(badgeType);
}

async function countRows(supabase, table, userCol, userId, extraFilters = {}) {
  let q = supabase.from(table).select('*', { count: 'exact', head: true }).eq(userCol, userId);
  for (const [k, v] of Object.entries(extraFilters)) {
    q = q.eq(k, v);
  }
  const { count, error } = await q;
  if (error) {
    console.error(`honorHelpers count(${table}):`, error.message);
    return 0;
  }
  return count || 0;
}

// ---- Per-trigger handlers ----------------------------------------

async function checkPost(supabase, userId, ctx) {
  const count = await countRows(supabase, 'forum_posts', 'author_id', userId);
  await maybeAward(supabase, userId, ctx, 'town_crier', count);
  await maybeAward(supabase, userId, ctx, 'bard_bronze', count);
  await maybeAward(supabase, userId, ctx, 'bard_silver', count);
  await maybeAward(supabase, userId, ctx, 'bard_gold', count);
}

async function checkReply(supabase, userId, ctx) {
  const count = await countRows(supabase, 'forum_replies', 'author_id', userId);
  await maybeAward(supabase, userId, ctx, 'scribe', count);
}

async function checkHerald(supabase, userId, ctx) {
  const given = await countRows(supabase, 'forum_reactions', 'user_id', userId);
  await maybeAward(supabase, userId, ctx, 'herald', given);
}

async function checkGoodNeighbor(supabase, userId, ctx) {
  // Reactions received on this user's posts + replies.
  const { count: postRx, error: pErr } = await supabase
    .from('forum_reactions')
    .select('id, forum_posts!inner(author_id)', { count: 'exact', head: true })
    .eq('forum_posts.author_id', userId);
  if (pErr) console.error('honorHelpers post rx:', pErr.message);
  const { count: replyRx, error: rErr } = await supabase
    .from('forum_reactions')
    .select('id, forum_replies!inner(author_id)', { count: 'exact', head: true })
    .eq('forum_replies.author_id', userId);
  if (rErr) console.error('honorHelpers reply rx:', rErr.message);
  const received = (postRx || 0) + (replyRx || 0);
  await maybeAward(supabase, userId, ctx, 'good_neighbor_bronze', received);
  await maybeAward(supabase, userId, ctx, 'good_neighbor_silver', received);
  await maybeAward(supabase, userId, ctx, 'good_neighbor_gold', received);
}

async function checkStreak(supabase, userId, ctx) {
  const { data, error } = await supabase
    .from('profiles')
    .select('longest_streak')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    console.error('honorHelpers streak:', error.message);
    return;
  }
  const streak = data?.longest_streak || 0;
  for (const t of [
    'loyal_knight_7',
    'loyal_knight_30',
    'loyal_knight_90',
    'loyal_knight_180',
    'loyal_knight_270',
    'loyal_knight_365',
  ]) {
    await maybeAward(supabase, userId, ctx, t, streak);
  }
}

async function checkLesson(supabase, userId, ctx) {
  // Pull all completed lessons for user, grouped by module.
  const { data: progress, error: pErr } = await supabase
    .from('lesson_progress')
    .select('lesson_id, lessons!inner(module_id)')
    .eq('user_id', userId)
    .eq('completed', true);
  if (pErr) {
    console.error('honorHelpers lesson progress:', pErr.message);
    return;
  }
  if (!progress || progress.length === 0) return;

  const completedByModule = new Map();
  for (const row of progress) {
    const mId = row.lessons?.module_id;
    if (!mId) continue;
    if (!completedByModule.has(mId)) completedByModule.set(mId, new Set());
    completedByModule.get(mId).add(row.lesson_id);
  }

  const moduleIds = [...completedByModule.keys()];
  if (moduleIds.length === 0) return;

  const { data: lessonRows, error: lErr } = await supabase
    .from('lessons')
    .select('id, module_id, modules!inner(course_id)')
    .in('module_id', moduleIds);
  if (lErr) {
    console.error('honorHelpers lessons lookup:', lErr.message);
    return;
  }

  const moduleTotals = new Map();
  const moduleToCourse = new Map();
  for (const l of lessonRows || []) {
    moduleTotals.set(l.module_id, (moduleTotals.get(l.module_id) || 0) + 1);
    if (l.modules?.course_id) moduleToCourse.set(l.module_id, l.modules.course_id);
  }

  let anyModuleComplete = false;
  const completedModulesByCourse = new Map();
  for (const [moduleId, completedSet] of completedByModule.entries()) {
    const total = moduleTotals.get(moduleId) || 0;
    if (total > 0 && completedSet.size >= total) {
      anyModuleComplete = true;
      const courseId = moduleToCourse.get(moduleId);
      if (courseId) {
        if (!completedModulesByCourse.has(courseId)) {
          completedModulesByCourse.set(courseId, new Set());
        }
        completedModulesByCourse.get(courseId).add(moduleId);
      }
    }
  }

  if (anyModuleComplete) {
    await maybeAward(supabase, userId, ctx, 'scholar', 1);
  }

  const courseIds = [...completedModulesByCourse.keys()];
  if (courseIds.length === 0) return;

  const { data: allModules, error: mErr } = await supabase
    .from('modules')
    .select('id, course_id')
    .in('course_id', courseIds);
  if (mErr) {
    console.error('honorHelpers modules lookup:', mErr.message);
    return;
  }
  const courseToAllModules = new Map();
  for (const m of allModules || []) {
    if (!courseToAllModules.has(m.course_id)) {
      courseToAllModules.set(m.course_id, new Set());
    }
    courseToAllModules.get(m.course_id).add(m.id);
  }
  for (const [courseId, completedModules] of completedModulesByCourse.entries()) {
    const all = courseToAllModules.get(courseId);
    if (all && completedModules.size >= all.size) {
      await maybeAward(supabase, userId, ctx, 'course_complete', 1);
      break;
    }
  }
}

async function checkEvent(supabase, userId, ctx) {
  const { count, error } = await supabase
    .from('event_rsvps')
    .select('event_id, events!inner(status)', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('events.status', 'completed');
  if (error) {
    console.error('honorHelpers event:', error.message);
    return;
  }
  await maybeAward(supabase, userId, ctx, 'pilgrim', count || 0);
}

async function checkReferral(supabase, userId, ctx) {
  const count = await countRows(supabase, 'referrals', 'referrer_id', userId);
  await maybeAward(supabase, userId, ctx, 'gatekeeper_1', count);
  await maybeAward(supabase, userId, ctx, 'gatekeeper_5', count);
  await maybeAward(supabase, userId, ctx, 'gatekeeper_10', count);
}

async function checkFrame(supabase, userId, ctx) {
  const { data, error } = await supabase
    .from('profiles')
    .select('selected_frame')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    console.error('honorHelpers frame:', error.message);
    return;
  }
  if (data?.selected_frame && data.selected_frame !== 'none') {
    await maybeAward(supabase, userId, ctx, 'standard_bearer', 1);
  }
}

async function checkTenure(supabase, userId, ctx) {
  const { data, error } = await supabase
    .from('profiles')
    .select('created_at')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    console.error('honorHelpers tenure:', error.message);
    return;
  }
  if (!data?.created_at) return;
  const days = Math.floor(
    (Date.now() - new Date(data.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  await maybeAward(supabase, userId, ctx, 'tenure_1_month', days);
  await maybeAward(supabase, userId, ctx, 'tenure_6_months', days);
  await maybeAward(supabase, userId, ctx, 'tenure_1_year', days);
}

const HANDLERS = {
  post: checkPost,
  reply: checkReply,
  reaction: checkHerald,
  streak: checkStreak,
  lesson: checkLesson,
  event: checkEvent,
  referral: checkReferral,
  frame: checkFrame,
  tenure: checkTenure,
};

// Triggers that imply the user was active on their own content —
// good_neighbor (reactions received) is cheap enough to re-check on
// every user-driven trigger so members don't wait until their next
// post to see a good_neighbor unlock.
const ALSO_CHECK_GOOD_NEIGHBOR = new Set([
  'post',
  'reply',
  'reaction',
  'streak',
  'tenure',
]);

export async function checkAndAwardHonors(supabase, userId, triggerContext) {
  if (!supabase || !userId || !triggerContext) return [];
  const handler = HANDLERS[triggerContext];
  if (!handler) {
    console.warn('checkAndAwardHonors: unknown trigger', triggerContext);
    return [];
  }
  try {
    const [catalog, owned] = await Promise.all([
      fetchCatalog(supabase),
      fetchOwnedTypes(supabase, userId),
    ]);
    const ctx = { catalog, owned, awards: [] };
    await handler(supabase, userId, ctx);
    if (ALSO_CHECK_GOOD_NEIGHBOR.has(triggerContext)) {
      await checkGoodNeighbor(supabase, userId, ctx);
    }
    return ctx.awards.map((a) => a.badge_type);
  } catch (err) {
    console.error('checkAndAwardHonors threw:', err?.message || err);
    return [];
  }
}
