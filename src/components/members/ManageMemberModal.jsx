import { useEffect, useState } from 'react';
import Modal from '../ui/Modal.jsx';
import { supabase } from '../../lib/supabase.js';

// action: 'suspend' | 'unsuspend' | 'ban' | 'unban' | 'delete'
const ACTION_COPY = {
  suspend: {
    title: 'Suspend member',
    lead: (name) => `Suspend ${name}? They will be able to browse but cannot post, reply, or interact.`,
    confirm: 'Suspend',
    variant: 'warning',
    rpc: 'set_member_status',
    payload: (id) => ({ target_id: id, new_status: 'suspended' }),
  },
  unsuspend: {
    title: 'Reinstate member',
    lead: (name) => `Restore ${name} to active standing? They will regain full posting ability.`,
    confirm: 'Reinstate',
    variant: '',
    rpc: 'set_member_status',
    payload: (id) => ({ target_id: id, new_status: 'active' }),
  },
  ban: {
    title: 'Ban member',
    lead: (name) => `Ban ${name}? They will be unable to log in.`,
    confirm: 'Ban',
    variant: 'danger',
    rpc: 'set_member_status',
    payload: (id) => ({ target_id: id, new_status: 'banned' }),
  },
  unban: {
    title: 'Unban member',
    lead: (name) => `Unban ${name}? They will be able to log in and post again.`,
    confirm: 'Unban',
    variant: '',
    rpc: 'set_member_status',
    payload: (id) => ({ target_id: id, new_status: 'active' }),
  },
  delete: {
    title: 'Permanently delete member',
    lead: (name) =>
      `Permanently delete ${name} and ALL of their content (posts, replies, progress, badges)? This cannot be undone.`,
    confirm: 'Delete forever',
    variant: 'danger',
    rpc: 'delete_member',
    payload: (id) => ({ target_id: id }),
    requireNameConfirm: true,
  },
};

export default function ManageMemberModal({
  open,
  onClose,
  action,
  targetUserId,
  targetName,
  onChanged,
}) {
  const cfg = ACTION_COPY[action];
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setErr('');
      setTyped('');
    })();
    return () => {
      cancelled = true;
    };
  }, [open, action]);

  if (!cfg) return null;

  const nameMatches = !cfg.requireNameConfirm || typed.trim() === (targetName || '').trim();
  const canConfirm = !saving && !!targetUserId && nameMatches;

  const submit = async () => {
    if (!canConfirm) return;
    setSaving(true);
    setErr('');
    try {
      const { error } = await supabase.rpc(cfg.rpc, cfg.payload(targetUserId));
      if (error) {
        setErr(error.message);
        return;
      }
      if (onChanged) await onChanged(action);
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={cfg.title} size="sm" variant={cfg.variant}>
      <div className="manage-member-body">
        <p className="manage-member-lead">{cfg.lead(targetName || 'this member')}</p>

        {cfg.requireNameConfirm && (
          <label className="field">
            <span className="field-label">
              Type the member's display name to confirm
            </span>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={targetName || ''}
              autoComplete="off"
              autoFocus
            />
          </label>
        )}

        {err && (
          <div className="form-error" role="alert">
            {err}
          </div>
        )}

        <div className="manage-member-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn ${cfg.variant === 'danger' ? 'btn-danger' : cfg.variant === 'warning' ? 'btn-warning' : 'btn-primary'}`}
            onClick={submit}
            disabled={!canConfirm}
          >
            {saving ? 'Working…' : cfg.confirm}
          </button>
        </div>
      </div>
    </Modal>
  );
}
