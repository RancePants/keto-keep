import { useEffect, useState } from 'react';
import Modal from '../events/Modal.jsx';
import { supabase } from '../../lib/supabase.js';

const EMPTY = { title: '', estimated_minutes: '' };

function lessonToForm(lesson) {
  if (!lesson) return { ...EMPTY };
  return {
    title: lesson.title || '',
    estimated_minutes: lesson.estimated_minutes == null ? '' : String(lesson.estimated_minutes),
  };
}

export default function LessonFormModal({
  open,
  onClose,
  moduleId,
  lesson,
  nextDisplayOrder = 0,
  onSaved,
  onDeleted,
}) {
  const [form, setForm] = useState(() => lessonToForm(lesson));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isEdit = !!lesson?.id;

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setForm(lessonToForm(lesson));
      setError(null);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, lesson]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const title = form.title.trim();
    if (!title) {
      setError('Title is required.');
      return;
    }
    if (!moduleId && !isEdit) {
      setError('Missing module reference.');
      return;
    }

    let estimated = null;
    if (form.estimated_minutes !== '') {
      const n = parseInt(form.estimated_minutes, 10);
      if (Number.isNaN(n) || n < 0) {
        setError('Estimated minutes must be a positive number.');
        return;
      }
      estimated = n;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        title,
        estimated_minutes: estimated,
      };

      if (isEdit) {
        const { data, error: upErr } = await supabase
          .from('lessons')
          .update(payload)
          .eq('id', lesson.id)
          .select()
          .single();
        if (upErr) {
          setError(upErr.message);
          return;
        }
        if (onSaved) await onSaved(data);
      } else {
        const { data, error: insErr } = await supabase
          .from('lessons')
          .insert({
            ...payload,
            module_id: moduleId,
            display_order: nextDisplayOrder,
            content_html: '',
          })
          .select()
          .single();
        if (insErr) {
          setError(insErr.message);
          return;
        }
        if (onSaved) await onSaved(data);
      }
      onClose?.();
    } catch (err) {
      setError(err?.message || 'Could not save lesson.');
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    setConfirmDelete(false);
    setDeleting(true);
    setError(null);
    try {
      const { error: delErr } = await supabase.from('lessons').delete().eq('id', lesson.id);
      if (delErr) {
        setError(delErr.message);
        return;
      }
      if (onDeleted) await onDeleted(lesson.id);
      onClose?.();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
    <Modal
      open={confirmDelete}
      onClose={() => setConfirmDelete(false)}
      title="Delete lesson"
      variant="danger"
      size="sm"
    >
      <p style={{ margin: 0, lineHeight: 1.5, color: 'var(--color-ink-soft)' }}>
        Delete this lesson? Member progress on it will be removed.
      </p>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button type="button" className="btn btn-ghost" onClick={() => setConfirmDelete(false)}>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={doDelete}>
          Delete lesson
        </button>
      </div>
    </Modal>
    <Modal
      open={open}
      onClose={saving || deleting ? undefined : onClose}
      title={isEdit ? 'Edit lesson' : 'New lesson'}
      size="md"
    >
      <form onSubmit={submit} className="course-form">
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
          <span className="field-label">Estimated minutes</span>
          <input
            type="number"
            min="0"
            max="600"
            value={form.estimated_minutes}
            onChange={(e) => update({ estimated_minutes: e.target.value })}
            placeholder="Optional"
          />
          <span className="field-hint">
            Shown on the lesson list as a time-to-complete hint. Leave blank to omit.
          </span>
        </label>

        <div className="lesson-form-note">
          Lesson body content is authored in chat and pushed via SQL. This form edits metadata only.
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="course-form-actions">
          {isEdit && (
            <button
              type="button"
              className="btn btn-ghost course-form-delete"
              onClick={() => setConfirmDelete(true)}
              disabled={saving || deleting}
            >
              {deleting ? 'Deleting…' : 'Delete lesson'}
            </button>
          )}
          <div className="course-form-actions-right">
            <button
              type="button"
              className="icon-btn"
              onClick={onClose}
              disabled={saving || deleting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving || deleting}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create lesson'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
    </>
  );
}
