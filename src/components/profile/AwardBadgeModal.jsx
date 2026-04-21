import { useEffect, useState } from 'react';
import Modal from '../events/Modal.jsx';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';
import { notifyBadgeAwarded } from '../../lib/notificationHelpers.js';
import HonorIcon from './HonorIcon.jsx';
import { HONOR_CATEGORIES } from '../../lib/profileHelpers.js';

// Admin-only modal for awarding / revoking honors to/from a member.
// Only manual honors appear in the dropdown — auto-awarded honors
// (tenure, streaks, posts, etc.) are granted by the honorHelpers
// engine. Those are still shown in the "Currently awarded" section.
const MANUAL_AWARDABLE = ['coach_spotlight', 'founding_member', 'champions_honor'];

export default function AwardBadgeModal({
  open,
  onClose,
  targetUserId,
  targetName,
  onChanged,
}) {
  const { user } = useAuth();
  const [catalog, setCatalog] = useState([]);
  const [awarded, setAwarded] = useState([]); // array of { badge_id, badge_type }
  const [selected, setSelected] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [badgeToRevoke, setBadgeToRevoke] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setErr('');
      const [catRes, ownedRes] = await Promise.all([
        supabase
          .from('badges')
          .select('id, badge_type, name, description, category, unlock_method, sort_order')
          .order('sort_order'),
        supabase
          .from('member_badges')
          .select('badge_id, badges!inner(badge_type)')
          .eq('user_id', targetUserId),
      ]);
      if (cancelled) return;
      if (catRes.error) {
        setErr(catRes.error.message);
        return;
      }
      if (ownedRes.error) {
        setErr(ownedRes.error.message);
        return;
      }
      const catalogData = catRes.data || [];
      const awardedData = (ownedRes.data || []).map((r) => ({
        badge_id: r.badge_id,
        badge_type: r.badges?.badge_type,
      }));
      setCatalog(catalogData);
      setAwarded(awardedData);
      const ownedSet = new Set(awardedData.map((a) => a.badge_type));
      const firstAvailable = catalogData.find(
        (b) => MANUAL_AWARDABLE.includes(b.badge_type) && !ownedSet.has(b.badge_type)
      );
      setSelected(firstAvailable?.id || '');
    })();
    return () => {
      cancelled = true;
    };
  }, [open, targetUserId]);

  const manualCatalog = catalog.filter((b) => MANUAL_AWARDABLE.includes(b.badge_type));
  const ownedTypes = new Set(awarded.map((a) => a.badge_type));
  const availableToAward = manualCatalog.filter((b) => !ownedTypes.has(b.badge_type));

  const award = async () => {
    if (!selected || busy) return;
    setBusy(true);
    setErr('');
    const { error } = await supabase.from('member_badges').insert({
      user_id: targetUserId,
      badge_id: selected,
      awarded_by: user?.id || null,
    });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    const badgeMeta = catalog.find((c) => c.id === selected);
    notifyBadgeAwarded(
      supabase,
      targetUserId,
      badgeMeta?.name,
      user?.id,
      `/profile/${targetUserId}`
    );
    if (onChanged) await onChanged();
    onClose?.();
  };

  const confirmedRevoke = async () => {
    const badgeId = badgeToRevoke;
    setBadgeToRevoke(null);
    setBusy(true);
    setErr('');
    const { error } = await supabase
      .from('member_badges')
      .delete()
      .eq('user_id', targetUserId)
      .eq('badge_id', badgeId);
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    if (onChanged) await onChanged();
  };

  return (
    <>
    <Modal
      open={!!badgeToRevoke}
      onClose={() => setBadgeToRevoke(null)}
      title="Remove badge"
      variant="danger"
      size="sm"
    >
      <p style={{ margin: 0, lineHeight: 1.5, color: 'var(--color-ink-soft)' }}>
        Remove this badge from <strong>{targetName || 'this member'}</strong>?
      </p>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button type="button" className="btn btn-ghost" onClick={() => setBadgeToRevoke(null)}>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={confirmedRevoke}>
          Remove badge
        </button>
      </div>
    </Modal>
    <Modal open={open} onClose={onClose} title={`Badges — ${targetName || 'Member'}`} size="md">
      <div className="award-badge-body">
        <section className="award-section">
          <h3 className="award-section-title">Award a badge</h3>
          {availableToAward.length === 0 ? (
            <p className="muted">
              No badges available to award right now. Tenure and course-completion badges are
              granted automatically.
            </p>
          ) : (
            <>
              <label className="field">
                <span className="field-label">Badge</span>
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  disabled={busy}
                >
                  {availableToAward.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={award}
                  disabled={busy || !selected}
                >
                  {busy ? 'Saving…' : 'Award badge'}
                </button>
              </div>
            </>
          )}
        </section>

        <section className="award-section">
          <h3 className="award-section-title">Currently awarded</h3>
          {awarded.length === 0 ? (
            <p className="muted">No honors yet.</p>
          ) : (
            <div className="award-groups">
              {HONOR_CATEGORIES.map((cat) => {
                const inCat = awarded
                  .map((a) => ({
                    ...a,
                    meta: catalog.find((c) => c.id === a.badge_id),
                  }))
                  .filter((a) => a.meta?.category === cat.key)
                  .sort((a, b) => (a.meta?.sort_order ?? 0) - (b.meta?.sort_order ?? 0));
                if (inCat.length === 0) return null;
                return (
                  <div key={cat.key} className="award-group">
                    <h4 className="award-group-title">{cat.label}</h4>
                    <ul className="award-list">
                      {inCat.map((a) => (
                        <li key={a.badge_id} className="award-list-item">
                          <HonorIcon badgeType={a.badge_type} size={28} />
                          <span className="award-list-name">
                            {a.meta?.name || a.badge_type}
                            {a.meta?.unlock_method === 'auto' && (
                              <span className="award-list-auto"> · earned automatically</span>
                            )}
                          </span>
                          <button
                            type="button"
                            className="icon-btn"
                            onClick={() => setBadgeToRevoke(a.badge_id)}
                            disabled={busy}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {err && <div className="form-error" role="alert">{err}</div>}
      </div>
    </Modal>
    </>
  );
}
