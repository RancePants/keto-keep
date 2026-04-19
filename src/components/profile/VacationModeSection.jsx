import { useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import { useToast } from '../ui/toastContext.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function daysBetween(startStr, endStr) {
  try {
    const s = new Date(startStr + 'T00:00:00').getTime();
    const e = new Date(endStr + 'T00:00:00').getTime();
    return Math.round((e - s) / MS_PER_DAY);
  } catch {
    return 0;
  }
}

function formatHuman(iso) {
  if (!iso) return '';
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function VacationModeSection({ profile, onChanged }) {
  const toast = useToast();
  const isActive = !!profile?.streak_freeze_start && !!profile?.streak_freeze_end;

  const [start, setStart] = useState(() => todayISO());
  const [end, setEnd] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const span = daysBetween(start, end);

  const validate = () => {
    if (!start || !end) return 'Please choose both start and end dates.';
    if (start < todayISO()) return 'Freeze cannot start in the past.';
    if (end <= start) return 'End date must be after start date.';
    if (span > 30) return 'Vacation mode can last up to 30 days.';
    return null;
  };

  const onActivate = async () => {
    setErr('');
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    setSaving(true);
    try {
      const { data, error } = await supabase.rpc('set_streak_freeze', {
        p_start: start,
        p_end: end,
      });
      if (error) {
        setErr(error.message || 'Could not set vacation mode.');
        return;
      }
      if (data?.error) {
        setErr(data.error);
        return;
      }
      toast.success('Vacation mode activated — your streak is safe.');
      if (onChanged) await onChanged();
    } catch (e) {
      setErr(e?.message || 'Could not set vacation mode.');
    } finally {
      setSaving(false);
    }
  };

  const onCancel = async () => {
    setErr('');
    setSaving(true);
    try {
      const { error } = await supabase.rpc('clear_streak_freeze');
      if (error) {
        setErr(error.message || 'Could not cancel vacation mode.');
        return;
      }
      toast.info('Vacation mode cleared.');
      if (onChanged) await onChanged();
    } catch (e) {
      setErr(e?.message || 'Could not cancel vacation mode.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="profile-edit-section vacation-mode-section">
      <h2 className="section-title">Vacation mode</h2>
      <p className="section-sub">
        Heading offline for a bit? Set a date range (up to 30 days) and your
        streak won't reset while you're away. It won't grow either — but
        nothing's lost.
      </p>

      {isActive ? (
        <div className="vacation-mode-active">
          <div className="vacation-mode-current">
            ❄️ Vacation active:{' '}
            <strong>{formatHuman(profile.streak_freeze_start)}</strong> →{' '}
            <strong>{formatHuman(profile.streak_freeze_end)}</strong>
          </div>
          {err && <div className="form-error" role="alert">{err}</div>}
          <button
            type="button"
            className="btn btn-warning"
            onClick={onCancel}
            disabled={saving}
          >
            {saving ? 'Working…' : 'Cancel vacation mode'}
          </button>
        </div>
      ) : (
        <div className="vacation-mode-form">
          <div className="grid-2">
            <label className="field">
              <span className="field-label">Start date</span>
              <input
                type="date"
                value={start}
                min={todayISO()}
                onChange={(e) => setStart(e.target.value)}
              />
            </label>
            <label className="field">
              <span className="field-label">End date</span>
              <input
                type="date"
                value={end}
                min={start || todayISO()}
                onChange={(e) => setEnd(e.target.value)}
              />
            </label>
          </div>
          <div className="vacation-mode-span muted">
            {span > 0 && span <= 30 && `${span} day${span === 1 ? '' : 's'} of vacation`}
            {span > 30 && 'Too long — max is 30 days.'}
          </div>
          {err && <div className="form-error" role="alert">{err}</div>}
          <button
            type="button"
            className="btn btn-primary"
            onClick={onActivate}
            disabled={saving}
          >
            {saving ? 'Activating…' : 'Activate vacation mode'}
          </button>
        </div>
      )}
    </section>
  );
}
