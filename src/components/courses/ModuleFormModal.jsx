import { useEffect, useState } from 'react';
import Modal from '../events/Modal.jsx';
import { supabase } from '../../lib/supabase.js';

const EMPTY = { title: '', description: '' };

function moduleToForm(mod) {
  if (!mod) return { ...EMPTY };
  return {
    title: mod.title || '',
    description: mod.description || '',
  };
}

export default function ModuleFormModal({
  open,
  onClose,
  courseId,
  module: mod,
  nextDisplayOrder = 0,
  onSaved,
  onDeleted,
}) {
  const [form, setForm] = useState(() => moduleToForm(mod));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isEdit = !!mod?.id;

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setForm(moduleToForm(mod));
      setError(null);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, mod]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const title = form.title.trim();
    if (!title) {
      setError('Title is required.');
      return;
    }
    if (!courseId) {
      setError('Missing course reference.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        title,
        description: form.description.trim() || null,
      };

      if (isEdit) {
        const { data, error: upErr } = await supabase
          .from('modules')
          .update(payload)
          .eq('id', mod.id)
          .select()
          .single();
        if (upErr) {
          setError(upErr.message);
          return;
        }
        if (onSaved) await onSaved(data);
      } else {
        const { data, error: insErr } = await supabase
          .from('modules')
          .insert({ ...payload, course_id: courseId, display_order: nextDisplayOrder })
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
      setError(err?.message || 'Could not save module.');
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    setConfirmDelete(false);
    setDeleting(true);
    setError(null);
    try {
      const { error: delErr } = await supabase.from('modules').delete().eq('id', mod.id);
      if (delErr) {
        setError(delErr.message);
        return;
      }
      if (onDeleted) await onDeleted(mod.id);
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
      title="Delete module"
      variant="danger"
      size="sm"
    >
      <p style={{ margin: 0, lineHeight: 1.5, color: 'var(--color-ink-soft)' }}>
        Delete this module? All its lessons and progress will be removed.
      </p>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button type="button" className="btn btn-ghost" onClick={() => setConfirmDelete(false)}>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={doDelete}>
          Delete module
        </button>
      </div>
    </Modal>
    <Modal
      open={open}
      onClose={saving || deleting ? undefined : onClose}
      title={isEdit ? 'Edit module' : 'New module'}
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
          <span className="field-label">Description</span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="A short overview of what this module covers."
          />
        </label>

        {error && <div className="form-error">{error}</div>}

        <div className="course-form-actions">
          {isEdit && (
            <button
              type="button"
              className="btn btn-ghost course-form-delete"
              onClick={() => setConfirmDelete(true)}
              disabled={saving || deleting}
            >
              {deleting ? 'Deleting…' : 'Delete module'}
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
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create module'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
    </>
  );
}
