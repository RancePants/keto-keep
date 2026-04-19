import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/useAuth.js';
import { useToast } from '../ui/toastContext.js';
import Modal from '../ui/Modal.jsx';
import ProfileFrame from '../ui/ProfileFrame.jsx';
import { fetchFrameCatalog, isFrameUnlocked } from '../../lib/frameCatalog.js';

function useOwnAvatarUrl(path) {
  const { getAvatarUrl } = useAuth();
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!path) return undefined;
    let cancelled = false;
    getAvatarUrl(path).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => { cancelled = true; };
  }, [path, getAvatarUrl]);
  return url;
}

function AvatarInner({ avatarUrl, displayName, size }) {
  const initial = (displayName || '?').trim().charAt(0).toUpperCase() || '?';
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        style={{ width: size, height: size, objectFit: 'cover', borderRadius: 'var(--radius-sm)', display: 'block' }}
      />
    );
  }
  return (
    <div
      className="avatar-fallback"
      style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <span>{initial}</span>
    </div>
  );
}

function FrameOption({ frame, selected, unlocked, onSelect, avatarUrl, displayName }) {
  const TILE_SIZE = 64;
  const initial = (displayName || '?').trim().charAt(0).toUpperCase() || '?';
  const inner = avatarUrl ? (
    <img
      src={avatarUrl}
      alt=""
      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
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
      className={`frame-option${selected ? ' frame-option-selected' : ''}${unlocked ? '' : ' frame-option-locked'}`}
      onClick={() => unlocked && onSelect(frame.frame_type)}
      disabled={!unlocked}
      aria-pressed={selected}
      aria-label={`${frame.name}${unlocked ? '' : ' (locked)'}`}
      title={tooltip}
    >
      <span className="frame-option-preview">
        <ProfileFrame frameType={frame.frame_type} size={TILE_SIZE}>
          {inner}
        </ProfileFrame>
        {!unlocked && <span className="frame-option-lock" aria-hidden="true">🔒</span>}
      </span>
      <span className="frame-option-name">{frame.name}</span>
      {!unlocked && frame.streak_days_required && (
        <span className="frame-option-sub muted">{frame.streak_days_required}d streak</span>
      )}
      {!unlocked && frame.unlock_method === 'admin_award' && (
        <span className="frame-option-sub muted">Awarded</span>
      )}
    </button>
  );
}

export default function FramePickerModal({ open, onClose, profile, onChanged }) {
  const { isAdmin, updateProfile } = useAuth();
  const toast = useToast();
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pending, setPending] = useState(profile?.selected_frame || 'none');
  const avatarUrl = useOwnAvatarUrl(profile?.avatar_url);

  useEffect(() => {
    let cancelled = false;
    fetchFrameCatalog().then((rows) => {
      if (cancelled) return;
      setCatalog(rows);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const visibleFrames = useMemo(() => {
    return catalog.filter((f) => {
      if (f.frame_type === 'none') return false; // hardcoded None button handles this
      if (f.unlock_method === 'admin_award') return isAdmin;
      return true;
    });
  }, [catalog, isAdmin]);

  const longest = Number(profile?.longest_streak) || 0;

  const onSave = async () => {
    if (saving) return;
    const current = profile?.selected_frame || 'none';
    if (pending === current) { onClose(); return; }
    setSaving(true);
    try {
      const { error } = await updateProfile({ selected_frame: pending });
      if (error) {
        toast.error(error.message || 'Could not update frame.');
        return;
      }
      toast.success('Frame updated.');
      if (onChanged) await onChanged();
      onClose();
    } catch (e) {
      toast.error(e?.message || 'Could not update frame.');
    } finally {
      setSaving(false);
    }
  };

  const PREVIEW_SIZE = 120;
  const displayName = profile?.display_name;

  return (
    <Modal open={open} onClose={onClose} title="Choose your frame" size="md">
      <div className="frame-picker-body">
        {/* Live preview */}
        <div className="frame-picker-preview">
          <ProfileFrame frameType={pending} size={PREVIEW_SIZE}>
            <AvatarInner avatarUrl={avatarUrl} displayName={displayName} size={PREVIEW_SIZE} />
          </ProfileFrame>
          <p className="frame-picker-preview-label muted">
            {pending === 'none' ? 'No frame' : visibleFrames.find((f) => f.frame_type === pending)?.name || pending}
          </p>
        </div>

        {/* Frame grid */}
        {loading ? (
          <div className="muted frame-picker-loading">Loading frames…</div>
        ) : (
          <div className="frame-picker-grid">
            {/* None option */}
            <button
              type="button"
              className={`frame-option${pending === 'none' ? ' frame-option-selected' : ''}`}
              onClick={() => setPending('none')}
              aria-pressed={pending === 'none'}
              aria-label="No frame"
            >
              <span className="frame-option-preview frame-option-preview-none">
                <AvatarInner avatarUrl={avatarUrl} displayName={displayName} size={64} />
              </span>
              <span className="frame-option-name">None</span>
            </button>
            {visibleFrames.map((f) => (
              <FrameOption
                key={f.frame_type}
                frame={f}
                selected={pending === f.frame_type}
                unlocked={isFrameUnlocked(f, { longestStreak: longest, isAdmin })}
                onSelect={setPending}
                avatarUrl={avatarUrl}
                displayName={displayName}
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="frame-picker-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={onSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save frame'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
