import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../contexts/useAuth.js';
import MemberCard from '../components/members/MemberCard.jsx';
import MemberFilters from '../components/members/MemberFilters.jsx';
import AssignAdminTagModal from '../components/members/AssignAdminTagModal.jsx';
import ManageMemberModal from '../components/members/ManageMemberModal.jsx';

const PAGE_SIZE = 20;

const DEFAULT_FILTERS = {
  search: '',
  dietary: '',
  journey: '',
  state: '',
  status: '',
  adminTagId: '',
  interestTagIds: [],
};

export default function MembersDirectory() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [err, setErr] = useState('');

  // Ancillary data maps keyed by user_id.
  const [badgeMap, setBadgeMap] = useState({});
  const [interestMap, setInterestMap] = useState({});
  const [adminTagMap, setAdminTagMap] = useState({});

  // Catalogs used by filters.
  const [allTags, setAllTags] = useState([]);
  const [allAdminTags, setAllAdminTags] = useState([]);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Modals
  const [tagTarget, setTagTarget] = useState(null);
  const [manageTarget, setManageTarget] = useState(null); // {action, userId, name}

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');

    // Profiles — select only what we need. Non-admins will get `status` via RLS
    // (public), but we simply don't render it for them.
    const profilesRes = await supabase
      .from('profiles')
      .select(
        'id, display_name, avatar_url, bio, dietary_approach, journey_duration, state, city, role, status, created_at'
      )
      .order('display_name', { ascending: true });

    if (profilesRes.error) {
      setErr(profilesRes.error.message);
      setLoading(false);
      return;
    }
    const rows = profilesRes.data || [];
    setProfiles(rows);
    setVisibleCount(PAGE_SIZE);

    const userIds = rows.map((r) => r.id);
    if (userIds.length === 0) {
      setBadgeMap({});
      setInterestMap({});
      setAdminTagMap({});
      setLoading(false);
      return;
    }

    // Parallel fetches for ancillary data. Admin tags RLS returns [] for
    // non-admins, so no conditional query needed.
    const [badgesRes, memberTagsRes, adminTagsRes, catalogTagsRes, catalogAdminTagsRes] =
      await Promise.all([
        supabase
          .from('member_badges')
          .select('user_id, awarded_at, badges!inner(badge_type, name, description)')
          .in('user_id', userIds)
          .order('awarded_at', { ascending: false }),
        supabase
          .from('member_tags')
          .select('user_id, tag_id, tags!inner(id, name)')
          .in('user_id', userIds),
        supabase
          .from('member_admin_tags')
          .select('user_id, tag_id, note, admin_tags!inner(id, name, description, color)')
          .in('user_id', userIds),
        supabase
          .from('tags')
          .select('id, name')
          .order('name', { ascending: true }),
        supabase
          .from('admin_tags')
          .select('id, name, description, color')
          .order('name', { ascending: true }),
      ]);

    const b = {};
    for (const row of badgesRes.data || []) {
      if (!b[row.user_id]) b[row.user_id] = [];
      b[row.user_id].push({
        badge_type: row.badges?.badge_type,
        name: row.badges?.name,
        description: row.badges?.description,
        awarded_at: row.awarded_at,
      });
    }
    setBadgeMap(b);

    const it = {};
    for (const row of memberTagsRes.data || []) {
      if (!it[row.user_id]) it[row.user_id] = [];
      if (row.tags) it[row.user_id].push(row.tags);
    }
    setInterestMap(it);

    const at = {};
    for (const row of adminTagsRes.data || []) {
      if (!at[row.user_id]) at[row.user_id] = [];
      if (row.admin_tags) at[row.user_id].push(row.admin_tags);
    }
    setAdminTagMap(at);

    setAllTags(catalogTagsRes.data || []);
    setAllAdminTags(catalogAdminTagsRes.data || []);

    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      await load();
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const interestSet = new Set(filters.interestTagIds);

    return profiles.filter((p) => {
      if (!isAdmin && p.status !== 'active') return false;
      if (q && !(p.display_name || '').toLowerCase().includes(q)) return false;
      if (filters.dietary && p.dietary_approach !== filters.dietary) return false;
      if (filters.journey && p.journey_duration !== filters.journey) return false;
      if (filters.state && p.state !== filters.state) return false;
      if (isAdmin && filters.status && p.status !== filters.status) return false;
      if (isAdmin && filters.adminTagId) {
        const tags = adminTagMap[p.id] || [];
        if (!tags.some((t) => t.id === filters.adminTagId)) return false;
      }
      if (interestSet.size > 0) {
        const mine = (interestMap[p.id] || []).map((t) => t.id);
        const hit = mine.some((id) => interestSet.has(id));
        if (!hit) return false;
      }
      return true;
    });
  }, [profiles, filters, isAdmin, adminTagMap, interestMap]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visible.length;

  const onMenuAction = (action, targetProfile) => {
    if (action === 'tags') {
      setTagTarget({ id: targetProfile.id, name: targetProfile.display_name });
      return;
    }
    setManageTarget({
      action,
      userId: targetProfile.id,
      name: targetProfile.display_name,
    });
  };

  const handleChanged = async () => {
    await load();
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Members</h1>
        <p className="page-sub">
          Browse the community. Tap a card to view the full profile.
        </p>
      </header>

      <MemberFilters
        filters={filters}
        setFilters={setFilters}
        allTags={allTags}
        allAdminTags={allAdminTags}
        isAdmin={isAdmin}
      />

      {err && <div className="form-error" role="alert">{err}</div>}

      {loading ? (
        <div className="page-center">
          <div className="spinner" aria-label="Loading" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="panel">
          <p className="muted">
            No members match the current filters.{' '}
            <Link to="#" onClick={(e) => { e.preventDefault(); setFilters(DEFAULT_FILTERS); }}>
              Clear filters
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <div className="member-count muted">
            Showing {visible.length} of {filtered.length}
          </div>
          <div className="member-grid">
            {visible.map((p) => (
              <MemberCard
                key={p.id}
                profile={p}
                badges={badgeMap[p.id] || []}
                interestTags={interestMap[p.id] || []}
                adminTags={adminTagMap[p.id] || []}
                isAdmin={isAdmin}
                onMenuAction={onMenuAction}
              />
            ))}
          </div>
          {hasMore && (
            <div className="member-load-more">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}

      <AssignAdminTagModal
        open={!!tagTarget}
        onClose={() => setTagTarget(null)}
        targetUserId={tagTarget?.id}
        targetName={tagTarget?.name}
        onChanged={handleChanged}
      />
      <ManageMemberModal
        open={!!manageTarget}
        onClose={() => setManageTarget(null)}
        action={manageTarget?.action}
        targetUserId={manageTarget?.userId}
        targetName={manageTarget?.name}
        onChanged={handleChanged}
      />
    </div>
  );
}
