import { supabase } from './supabase.js';

// Lightweight module-level cache for the profile_frames catalog.
// The table is ~10 static rows — fetching once per app boot is plenty.
let cachedFrames = null;
let inflight = null;

export async function fetchFrameCatalog() {
  if (cachedFrames) return cachedFrames;
  if (inflight) return inflight;

  inflight = (async () => {
    const { data, error } = await supabase
      .from('profile_frames')
      .select('frame_type, name, description, unlock_method, streak_days_required, display_order')
      .order('display_order', { ascending: true });
    if (error) {
      console.error('fetchFrameCatalog failed:', error.message);
      inflight = null;
      return [];
    }
    cachedFrames = data || [];
    inflight = null;
    return cachedFrames;
  })();
  return inflight;
}

export function isFrameUnlocked(frame, { longestStreak = 0, isAdmin = false } = {}) {
  if (!frame) return false;
  const method = frame.unlock_method;
  if (method === 'free') return true;
  if (method === 'admin_award') return !!isAdmin;
  if (typeof method === 'string' && method.startsWith('streak_')) {
    const need = Number(frame.streak_days_required) || 0;
    return (Number(longestStreak) || 0) >= need;
  }
  return false;
}
