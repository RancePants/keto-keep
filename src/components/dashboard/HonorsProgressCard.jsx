import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';
import ProgressBar from '../courses/ProgressBar.jsx';
import HonorIcon from '../profile/HonorIcon.jsx';

export default function HonorsProgressCard() {
  const { user } = useAuth();
  const [catalog, setCatalog] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return undefined;
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      try {
        const [catRes, ownedRes] = await Promise.all([
          supabase.from('badges').select('id, badge_type, name').order('sort_order'),
          supabase
            .from('member_badges')
            .select('badge_id, awarded_at, badges!inner(badge_type, name)')
            .eq('user_id', user.id)
            .order('awarded_at', { ascending: false }),
        ]);
        if (cancelled) return;
        setCatalog(catRes.data || []);
        setEarnedBadges(
          (ownedRes.data || []).map((r) => ({
            badge_id: r.badge_id,
            awarded_at: r.awarded_at,
            badge_type: r.badges?.badge_type,
            name: r.badges?.name,
          }))
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  const total = catalog.length;
  const earned = earnedBadges.length;
  const recent = earnedBadges.slice(0, 3);

  return (
    <div className="panel">
      <h2 className="panel-title">Your Honors</h2>
      {loading ? (
        <div className="muted" style={{ fontSize: 'var(--fs-sm)' }}>Loading…</div>
      ) : (
        <>
          <p className="honors-progress-summary">
            {earned === 0
              ? 'No honors yet — start engaging to unlock your first!'
              : `${earned} of ${total} honors earned`}
          </p>
          <ProgressBar done={earned} total={total} showLabel={false} />
          {recent.length > 0 && (
            <div className="honors-recent-list">
              {recent.map((b) => (
                <div key={b.badge_id} className="honors-recent-item">
                  <HonorIcon badgeType={b.badge_type} size={32} title={b.name} />
                  <span>{b.name}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <div className="dashboard-card-footer">
        <Link to="/profile">View all →</Link>
      </div>
    </div>
  );
}
