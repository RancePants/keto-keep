import { useEffect, useState } from 'react';
import Modal from '../events/Modal.jsx';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';
import { notifyBadgeAwarded } from '../../lib/notificationHelpers.js';
import BadgeIcon from './BadgeIcon.jsx';

// Admin-only modal for awarding / revoking a badge to/from a member.
// Only the `coach_spotlight` badge is offered in the dropdown — the
// tenure badges are auto-awarded later, and course_complete is awarded
// when a member finishes a course (also later). Those rows are still
// shown as "already awarded" for visibility.
const MANUAL_AWARDABLE = ['coach_spotlight'];

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

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setErr('');
      const [catRes, ownedRes] = await Promise.all([
        supabase.from('badges').select('id, badge_type, name, description').order('badge_type'),
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

  const revoke = async (badgeId) => {
    if (busy) return;
    if (!window.confirm(`Remove this badge from ${targetName || 'this member'}?`)) return;
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
            <p className="muted">No badges yet.</p>
          ) : (
            <ul className="award-list">
              {awarded.map((a) => {
                const meta = catalog.find((c) => c.id === a.badge_id);
                return (
                  <li key={a.badge_id} className="award-list-item">
                    <BadgeIcon badgeType={a.badge_type} size={22} />
                    <span className="award-list-name">{meta?.name || a.badge_type}</span>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => revoke(a.badge_id)}
                      disabled={busy}
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {err && <div className="form-error" role="alert">{err}</div>}
      </div>
    </Modal>
  );
}
