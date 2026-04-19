import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/useAuth.js';
import { useToast } from '../ui/toastContext.js';
import ProfileFrame from '../ui/ProfileFrame.jsx';
import { fetchFrameCatalog, isFrameUnlocked } from '../../lib/frameCatalog.js';

// Small private-image hook inlined so this module doesn't reach into forum/.
function useOwnAvatarUrl(path) {
  const { getAvatarUrl } = useAuth();
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!path) return undefined;
    let cancelled = false;
    getAvatarUrl(path).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [path, getAvatarUrl]);
  return url;
}

function FrameTile({ frame, selected, unlocked, onPick, avatarUrl, displayName }) {
  const initial = (displayName || '?').trim().charAt(0).toUpperCase() || '?';
  const inner = avatarUrl ? (
    <img
      src={avatarUrl}
      alt=""
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  ) : (
    <div
      className="avatar-fallback"
      style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <span>{initial}</span>
    </div>
  );

  const tooltip = unlocked
    ? frame.description || frame.name
    : frame.unlock_method === 'admin_award'
      ? 'Awarded by hosts'
      : `Reach ${frame.streak_days_required}-day streak to unlock`;

  return (
    <button
      type="button"
      className={`frame-tile${selected ? ' frame-tile-selected' : ''}${unlocked ? '' : ' frame-tile-locked'}`}
      onClick={() => unlocked && onPick(frame.frame_type)}
      disabled={!unlocked}
      aria-pressed={selected}
      aria-label={`${frame.name}${unlocked ? '' : ' (locked)'}`}
      title={tooltip}
    >
      <span className="frame-tile-preview">
        <ProfileFrame frameType={frame.frame_type} size={72}>
          {inner}
        </ProfileFrame>
        {!unlocked && <span className="frame-tile-lock" aria-hidden="true">🔒</span>}
      </span>
      <span className="frame-tile-name">{frame.name}</span>
      {!unlocked && frame.streak_days_required && (
        <span className="frame-tile-sub muted">
          {frame.streak_days_required}-day streak
        </span>
      )}
      {!unlocked && frame.unlock_method === 'admin_award' && (
        <span className="frame-tile-sub muted">Awarded</span>
      )}
    </button>
  );
}

export default function FrameSelector({ profile, onChanged }) {
  const { isAdmin, updateProfile } = useAuth();
  const toast = useToast();
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const avatarUrl = useOwnAvatarUrl(profile?.avatar_url);

  useEffect(() => {
    let cancelled = false;
    fetchFrameCatalog().then((rows) => {
      if (cancelled) return;
      setCatalog(rows);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleFrames = useMemo(() => {
    // Coach Seal only shows for admins/owners. Everyone else never sees it.
    return catalog.filter((f) => {
      if (f.unlock_method === 'admin_award') return isAdmin;
      return true;
    });
  }, [catalog, isAdmin]);

  const longest = Number(profile?.longest_streak) || 0;
  const selected = profile?.selected_frame || 'none';

  const onPick = async (frameType) => {
    if (saving) return;
    if (frameType === selected) return;
    setSaving(true);
    try {
      const { error } = await updateProfile({ selected_frame: frameType });
      if (error) {
        toast.error(error.message || 'Could not update frame.');
        return;
      }
      toast.success('Frame updated.');
      if (onChanged) await onChanged();
    } catch (e) {
      toast.error(e?.message || 'Could not update frame.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="profile-edit-section frame-selector-section">
      <h2 className="section-title">Profile frame</h2>
      <p className="section-sub">
        Pick a border for your portrait. Earn more by keeping your login streak alive.
      </p>
      {loading ? (
        <div className="muted">Loading frames…</div>
      ) : (
        <div className="frame-tile-grid">
          {visibleFrames.map((f) => (
            <FrameTile
              key={f.frame_type}
              frame={f}
              selected={selected === f.frame_type}
              unlocked={isFrameUnlocked(f, { longestStreak: longest, isAdmin })}
              onPick={onPick}
              avatarUrl={avatarUrl}
              displayName={profile?.display_name}
            />
          ))}
        </div>
      )}
    </section>
  );
}
