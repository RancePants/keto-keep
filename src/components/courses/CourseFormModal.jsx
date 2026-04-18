import { useEffect, useState } from 'react';
import Modal from '../events/Modal.jsx';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';
import {
  COURSE_ACCESS_LEVELS,
  COURSE_ACCESS_LABELS,
  slugify,
} from '../../lib/courseHelpers.js';

const EMPTY = {
  title: '',
  description: '',
  slug: '',
  cover_image_url: '',
  access_level: 'free',
  published: false,
};

function courseToForm(course) {
  if (!course) return { ...EMPTY };
  return {
    title: course.title || '',
    description: course.description || '',
    slug: course.slug || '',
    cover_image_url: course.cover_image_url || '',
    access_level: course.access_level || 'free',
    published: !!course.published,
  };
}

export default function CourseFormModal({ open, onClose, course, onSaved, onDeleted }) {
  const { user } = useAuth();
  const [form, setForm] = useState(() => courseToForm(course));
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = !!course?.id;

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setForm(courseToForm(course));
      setSlugTouched(!!course?.slug);
      setError(null);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, course]);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  // Auto-generate slug from title until user manually edits slug.
  const onTitleChange = (value) => {
    update({
      title: value,
      slug: slugTouched ? form.slug : slugify(value),
    });
  };

  const onSlugChange = (value) => {
    setSlugTouched(true);
    update({ slug: slugify(value) });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const title = form.title.trim();
    if (!title) {
      setError('Title is required.');
      return;
    }
    const slug = slugify(form.slug || form.title);
    if (!slug) {
      setError('Slug is required.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        title,
        description: form.description.trim() || null,
        slug,
        cover_image_url: form.cover_image_url.trim() || null,
        access_level: form.access_level,
        published: !!form.published,
      };

      if (isEdit) {
        const { data, error: upErr } = await supabase
          .from('courses')
          .update(payload)
          .eq('id', course.id)
          .select()
          .single();
        if (upErr) {
          setError(upErr.message);
          return;
        }
        if (onSaved) await onSaved(data);
      } else {
        const { data, error: insErr } = await supabase
          .from('courses')
          .insert({ ...payload, created_by: user?.id })
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
      setError(err?.message || 'Could not save course.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!isEdit || deleting) return;
    if (
      !window.confirm(
        'Delete this course? All modules, lessons, and member progress will be removed.'
      )
    ) {
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      const { error: delErr } = await supabase.from('courses').delete().eq('id', course.id);
      if (delErr) {
        setError(delErr.message);
        return;
      }
      if (onDeleted) await onDeleted(course.id);
      onClose?.();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={saving || deleting ? undefined : onClose}
      title={isEdit ? 'Edit course' : 'New course'}
      size="lg"
    >
      <form onSubmit={submit} className="course-form">
        <label className="field">
          <span className="field-label">Title</span>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onTitleChange(e.target.value)}
            maxLength={200}
            required
            autoFocus
          />
        </label>

        <label className="field">
          <span className="field-label">Slug</span>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => onSlugChange(e.target.value)}
            maxLength={120}
            required
          />
          <span className="field-hint">
            URL identifier, lowercase with dashes. Shows up as /courses/<strong>{form.slug || 'your-slug'}</strong>.
          </span>
        </label>

        <label className="field">
          <span className="field-label">Description</span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="What members will learn."
          />
        </label>

        <label className="field">
          <span className="field-label">Cover image URL</span>
          <input
            type="url"
            value={form.cover_image_url}
            onChange={(e) => update({ cover_image_url: e.target.value })}
            placeholder="https://…"
          />
          <span className="field-hint">Shown on the catalog card and course overview.</span>
        </label>

        <div className="course-form-row">
          <label className="field">
            <span className="field-label">Access level</span>
            <select
              value={form.access_level}
              onChange={(e) => update({ access_level: e.target.value })}
            >
              {COURSE_ACCESS_LEVELS.map((a) => (
                <option key={a} value={a}>
                  {COURSE_ACCESS_LABELS[a]}
                </option>
              ))}
            </select>
            <span className="field-hint">Premium is stored but not enforced yet.</span>
          </label>

          <label className="field course-form-publish">
            <span className="field-label">Published</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => update({ published: e.target.checked })}
              />
              <span className="toggle-track" aria-hidden="true">
                <span className="toggle-thumb" />
              </span>
              <span className="toggle-label">
                {form.published ? 'Visible to members' : 'Draft (admins only)'}
              </span>
            </label>
          </label>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="course-form-actions">
          {isEdit && (
            <button
              type="button"
              className="btn btn-ghost course-form-delete"
              onClick={remove}
              disabled={saving || deleting}
            >
              {deleting ? 'Deleting…' : 'Delete course'}
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
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create course'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
