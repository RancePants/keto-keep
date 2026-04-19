import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';
import {
  EVENT_TYPES,
  EVENT_STATUSES,
  EVENT_TYPE_LABELS,
  EVENT_STATUS_LABELS,
  isoToLocalInput,
  localInputToIso,
  getYoutubeEmbedSrc,
} from '../../lib/eventHelpers.js';
import { notifyNewEvent } from '../../lib/notificationHelpers.js';

const EMPTY = {
  title: '',
  description: '',
  event_type: 'live_call',
  start_time_local: '',
  end_time_local: '',
  zoom_link: '',
  youtube_embed_url: '',
  status: 'scheduled',
};

function eventToForm(event) {
  if (!event) return { ...EMPTY };
  return {
    title: event.title || '',
    description: event.description || '',
    event_type: event.event_type || 'live_call',
    start_time_local: isoToLocalInput(event.start_time),
    end_time_local: isoToLocalInput(event.end_time),
    zoom_link: event.zoom_link || '',
    youtube_embed_url: event.youtube_embed_url || '',
    status: event.status || 'scheduled',
  };
}

export default function EventFormModal({ open, onClose, event, onSaved, onDeleted }) {
  const { user } = useAuth();
  const [form, setForm] = useState(() => eventToForm(event));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = !!event?.id;

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setForm(eventToForm(event));
      setError(null);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, event]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const title = form.title.trim();
    if (!title) {
      setError('Title is required.');
      return;
    }
    if (!form.start_time_local) {
      setError('Start time is required.');
      return;
    }
    const startIso = localInputToIso(form.start_time_local);
    const endIso = form.end_time_local ? localInputToIso(form.end_time_local) : null;
    if (endIso && new Date(endIso) < new Date(startIso)) {
      setError('End time must be after start time.');
      return;
    }
    if (form.youtube_embed_url && !getYoutubeEmbedSrc(form.youtube_embed_url)) {
      setError("That doesn't look like a YouTube URL.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        title,
        description: form.description.trim() || null,
        event_type: form.event_type,
        start_time: startIso,
        end_time: endIso,
        zoom_link: form.zoom_link.trim() || null,
        youtube_embed_url: form.youtube_embed_url.trim() || null,
        status: form.status,
      };

      if (isEdit) {
        const { data, error: upErr } = await supabase
          .from('events')
          .update(payload)
          .eq('id', event.id)
          .select()
          .single();
        if (upErr) {
          setError(upErr.message);
          return;
        }
        if (onSaved) await onSaved(data);
      } else {
        const { data, error: insErr } = await supabase
          .from('events')
          .insert({ ...payload, created_by: user?.id })
          .select()
          .single();
        if (insErr) {
          setError(insErr.message);
          return;
        }
        notifyNewEvent(supabase, data?.title, data?.id ? `/events/${data.id}` : '/events');
        if (onSaved) await onSaved(data);
      }
      onClose?.();
    } catch (err) {
      setError(err?.message || 'Could not save event.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!isEdit || deleting) return;
    if (!window.confirm('Delete this event? All RSVPs will be removed.')) return;
    setDeleting(true);
    setError(null);
    try {
      const { error: delErr } = await supabase.from('events').delete().eq('id', event.id);
      if (delErr) {
        setError(delErr.message);
        return;
      }
      if (onDeleted) await onDeleted(event.id);
      onClose?.();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={saving || deleting ? undefined : onClose}
      title={isEdit ? 'Edit event' : 'New event'}
      size="lg"
    >
      <form onSubmit={submit} className="event-form">
        <label className="field">
          <span className="field-label">Title</span>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update({ title: e.target.value })}
            maxLength={200}
            required
            autoFocus
          />
        </label>

        <label className="field">
          <span className="field-label">Description</span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="What's this session about?"
          />
        </label>

        <div className="event-form-row">
          <label className="field">
            <span className="field-label">Type</span>
            <select
              value={form.event_type}
              onChange={(e) => update({ event_type: e.target.value })}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {EVENT_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Status</span>
            <select
              value={form.status}
              onChange={(e) => update({ status: e.target.value })}
            >
              {EVENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {EVENT_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="event-form-row">
          <label className="field">
            <span className="field-label">Start</span>
            <input
              type="datetime-local"
              value={form.start_time_local}
              onChange={(e) => update({ start_time_local: e.target.value })}
              required
            />
          </label>
          <label className="field">
            <span className="field-label">End (optional)</span>
            <input
              type="datetime-local"
              value={form.end_time_local}
              onChange={(e) => update({ end_time_local: e.target.value })}
            />
          </label>
        </div>

        <label className="field">
          <span className="field-label">Zoom link</span>
          <input
            type="url"
            value={form.zoom_link}
            onChange={(e) => update({ zoom_link: e.target.value })}
            placeholder="https://zoom.us/j/..."
          />
          <span className="field-hint">Visible to all logged-in members.</span>
        </label>

        <label className="field">
          <span className="field-label">YouTube URL (for past recordings)</span>
          <input
            type="url"
            value={form.youtube_embed_url}
            onChange={(e) => update({ youtube_embed_url: e.target.value })}
            placeholder="https://youtu.be/..."
          />
          <span className="field-hint">
            When status is "Completed" and a YouTube URL is set, the event appears in Past Sessions.
          </span>
        </label>

        {error && <div className="form-error">{error}</div>}

        <div className="event-form-actions">
          {isEdit && (
            <button
              type="button"
              className="btn btn-ghost event-form-delete"
              onClick={remove}
              disabled={saving || deleting}
            >
              {deleting ? 'Deleting…' : 'Delete event'}
            </button>
          )}
          <div className="event-form-actions-right">
            <button
              type="button"
              className="icon-btn"
              onClick={onClose}
              disabled={saving || deleting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving || deleting}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create event'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
