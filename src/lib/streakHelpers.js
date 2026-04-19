// Streak milestone ladder. Each tier matches a SECURITY DEFINER
// `check_streak_milestone` branch in the database — keep in sync.
export const STREAK_MILESTONES = [
  { days: 7,   key: 'first_week',   name: 'Bronze Torch',   description: 'A full week of daily visits.' },
  { days: 14,  key: 'two_weeks',    name: 'Silver Torch',   description: 'Two weeks in the keep.' },
  { days: 30,  key: 'one_month',    name: 'Gold Torch',     description: 'A full month of daily practice.' },
  { days: 60,  key: 'two_months',   name: 'Bronze Shield',  description: 'Two months strong.' },
  { days: 90,  key: 'three_months', name: 'Silver Shield',  description: 'A full season of showing up.' },
  { days: 180, key: 'half_year',    name: 'Gold Shield',    description: 'Half a year of daily devotion.' },
  { days: 365, key: 'full_year',    name: 'Royal Crown',    description: 'A full year. You are of the keep.' },
];

export function getCurrentMilestone(streak) {
  if (!streak || streak < 7) return null;
  let current = null;
  for (const m of STREAK_MILESTONES) {
    if (streak >= m.days) current = m;
    else break;
  }
  return current;
}

export function getNextMilestone(streak) {
  const s = streak || 0;
  for (const m of STREAK_MILESTONES) {
    if (s < m.days) return m;
  }
  return null; // fully maxed
}

export function formatStreak(streak) {
  const s = Number(streak) || 0;
  if (s <= 0) return 'No active streak';
  if (s === 1) return '🔥 1 day streak';
  return `🔥 ${s} day streak`;
}

export function milestoneByKey(key) {
  return STREAK_MILESTONES.find((m) => m.key === key) || null;
}

export function progressToNext(streak) {
  const s = Number(streak) || 0;
  const next = getNextMilestone(s);
  if (!next) {
    return { pct: 100, fromDays: 365, toDays: 365, remaining: 0, next: null };
  }
  const prev = getCurrentMilestone(s);
  const fromDays = prev ? prev.days : 0;
  const span = next.days - fromDays;
  const into = Math.max(0, s - fromDays);
  const pct = span > 0 ? Math.min(100, Math.round((into / span) * 100)) : 0;
  return {
    pct,
    fromDays,
    toDays: next.days,
    remaining: Math.max(0, next.days - s),
    next,
  };
}
