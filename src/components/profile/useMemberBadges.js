import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';

// Fetch awarded badges for a list of user IDs. Returns a map
// { [userId]: [{badge_type, name, description, awarded_at}, ...] }.
// Designed to be called from any surface that already has a set of user
// IDs (forum post authors, event attendees, etc.) — it piggybacks one
// network call regardless of how many users.
export function useMemberBadges(userIds) {
  const [map, setMap] = useState({});

  // Stable key so the effect doesn't thrash when callers pass fresh arrays
  // with the same ids.
  const keyArr = Array.isArray(userIds) ? [...new Set(userIds.filter(Boolean))].sort() : [];
  const key = keyArr.join(',');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      if (!key) {
        setMap({});
        return;
      }
      const ids = key.split(',');
      const { data, error } = await supabase
        .from('member_badges')
        .select('user_id, awarded_at, badges!inner(badge_type, name, description, icon_url)')
        .in('user_id', ids)
        .order('awarded_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error('useMemberBadges load failed:', error.message);
        setMap({});
        return;
      }
      const next = {};
      for (const row of data || []) {
        const flat = {
          awarded_at: row.awarded_at,
          badge_type: row.badges?.badge_type,
          name: row.badges?.name,
          description: row.badges?.description,
          icon_url: row.badges?.icon_url,
        };
        if (!next[row.user_id]) next[row.user_id] = [];
        next[row.user_id].push(flat);
      }
      setMap(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  return map;
}
