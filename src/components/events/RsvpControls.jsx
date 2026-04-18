import { useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';
import { RSVP_LABELS, RSVP_EMOJI, RSVP_STATUSES } from '../../lib/eventHelpers.js';

export default function RsvpControls({ eventId, currentStatus, onChange, size = 'md' }) {
  const { user, isSuspended } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const setRsvp = async (status) => {
    if (!user?.id || saving) return;
    setSaving(true);
    setError(null);
    try {
      const { error: upErr } = await supabase
        .from('event_rsvps')
        .upsert(
          {
            event_id: eventId,
            user_id: user.id,
            rsvp_status: status,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'event_id,user_id' }
        );
      if (upErr) {
        setError(upErr.message);
        return;
      }
      if (onChange) await onChange(status);
    } finally {
      setSaving(false);
    }
  };

  const clearRsvp = async () => {
    if (!user?.id || saving) return;
    setSaving(true);
    setError(null);
    try {
      const { error: delErr } = await supabase
        .from('event_rsvps')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);
      if (delErr) {
        setError(delErr.message);
        return;
      }
      if (onChange) await onChange(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`rsvp-controls rsvp-controls-${size}`}>
      <div className="rsvp-buttons">
        {RSVP_STATUSES.map((status) => {
          const active = currentStatus === status;
          return (
            <button
              key={status}
              type="button"
              className={`rsvp-btn ${active ? 'rsvp-btn-active' : ''}`}
              onClick={() => (active ? clearRsvp() : setRsvp(status))}
              disabled={saving || isSuspended}
              aria-pressed={active}
              title={isSuspended ? 'RSVP disabled while suspended' : undefined}
            >
              <span aria-hidden="true" className="rsvp-btn-emoji">
                {RSVP_EMOJI[status]}
              </span>
              <span className="rsvp-btn-label">{RSVP_LABELS[status]}</span>
            </button>
          );
        })}
      </div>
      {isSuspended && (
        <p className="muted rsvp-suspended-hint">
          RSVP is disabled while your account is suspended.
        </p>
      )}
      {error && <div className="form-error rsvp-error">{error}</div>}
    </div>
  );
}
