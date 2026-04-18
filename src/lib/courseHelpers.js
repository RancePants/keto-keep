export const COURSE_ACCESS_LEVELS = ['free', 'premium'];

export const COURSE_ACCESS_LABELS = {
  free: 'Free',
  premium: 'Premium',
};

// Slugify a title into a URL-safe slug. Used by admin CRUD.
export function slugify(input) {
  return (input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Given a course with nested modules[] (each with lessons[]), return
// flat lesson list in display order for prev/next navigation.
export function flattenLessons(modules) {
  const out = [];
  for (const m of modules || []) {
    for (const l of m.lessons || []) {
      out.push({ ...l, module: m });
    }
  }
  return out;
}

// Given modules[] with lessons[] and a map of completed lesson IDs,
// compute completed vs total lessons for a course.
export function computeCourseProgress(modules, completedSet) {
  let total = 0;
  let done = 0;
  for (const m of modules || []) {
    for (const l of m.lessons || []) {
      total += 1;
      if (completedSet.has(l.id)) done += 1;
    }
  }
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

// Same but scoped to one module.
export function computeModuleProgress(lessons, completedSet) {
  const total = (lessons || []).length;
  let done = 0;
  for (const l of lessons || []) {
    if (completedSet.has(l.id)) done += 1;
  }
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

// Return the first lesson that's not in completedSet. If all are complete,
// return null. If nothing started, caller can default to the first lesson.
export function firstIncomplete(modules, completedSet) {
  for (const m of modules || []) {
    for (const l of m.lessons || []) {
      if (!completedSet.has(l.id)) return { ...l, module: m };
    }
  }
  return null;
}

// Format minutes as "12 min" or "1 hr 5 min".
export function formatMinutes(min) {
  if (!min || min <= 0) return '';
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

// Sum of estimated_minutes across a module's lessons.
export function sumEstimatedMinutes(lessons) {
  return (lessons || []).reduce((acc, l) => acc + (l.estimated_minutes || 0), 0);
}
