export const REACTION_EMOJIS = ['🥩', '❤️', '😂', '🎉', '🔥', '💪'];

export function formatRelative(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diffMs = Date.now() - then;
  const sec = Math.round(diffMs / 1000);
  if (sec < 45) return 'just now';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day} day${day === 1 ? '' : 's'} ago`;
  if (day < 30) {
    const wk = Math.round(day / 7);
    return `${wk} week${wk === 1 ? '' : 's'} ago`;
  }
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export function isEdited(createdAt, updatedAt) {
  if (!createdAt || !updatedAt) return false;
  const c = new Date(createdAt).getTime();
  const u = new Date(updatedAt).getTime();
  return Math.abs(u - c) > 1500;
}

export function groupReactions(rows, currentUserId) {
  const map = new Map();
  for (const r of rows || []) {
    const entry = map.get(r.emoji) || { emoji: r.emoji, count: 0, mine: false };
    entry.count += 1;
    if (r.user_id === currentUserId) entry.mine = true;
    map.set(r.emoji, entry);
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}
