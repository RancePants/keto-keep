import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../contexts/useAuth.js';
import { ADMIN_TAG_COLORS, safeTagColor } from '../lib/memberHelpers.js';
import usePageTitle from '../lib/usePageTitle.js';

const BLANK_FORM = {
  name: '',
  description: '',
  color: ADMIN_TAG_COLORS[0],
};

export default function AdminAdminTags() {
  usePageTitle('Admin tags · Admin');
  const { user, profile, loading: authLoading } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setErr('');
    const { data, error } = await supabase
      .from('admin_tags')
      .select('*')
      .order('name', { ascending: true });
    if (error) {
      setErr(error.message);
      setTags([]);
    } else {
      setTags(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      await load();
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const addTag = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name || saving) return;
    setSaving(true);
    setErr('');
    try {
      const { error } = await supabase.from('admin_tags').insert({
        name,
        description: form.description.trim() || null,
        color: safeTagColor(form.color),
        created_by: user?.id ?? null,
      });
      if (error) {
        setErr(error.message);
      } else {
        setForm(BLANK_FORM);
        setCreating(false);
        await load();
      }
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (tag) => {
    setEditingId(tag.id);
    setEditForm({
      name: tag.name,
      description: tag.description || '',
      color: safeTagColor(tag.color),
    });
  };

  const saveEdit = async (tag) => {
    if (saving) return;
    const name = editForm.name.trim();
    if (!name) return;
    setSaving(true);
    setErr('');
    try {
      const { error } = await supabase
        .from('admin_tags')
        .update({
          name,
          description: editForm.description.trim() || null,
          color: safeTagColor(editForm.color),
        })
        .eq('id', tag.id);
      if (error) {
        setErr(error.message);
      } else {
        setEditingId(null);
        await load();
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteTag = async (tag) => {
    if (
      !window.confirm(
        `Delete internal tag "${tag.name}"? Any members assigned this tag will lose the assignment.`
      )
    )
      return;
    const { error } = await supabase.from('admin_tags').delete().eq('id', tag.id);
    if (error) {
      setErr(error.message);
      return;
    }
    await load();
  };

  if (authLoading) {
    return (
      <div className="page-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="page page-narrow">
      <header className="page-header">
        <div className="feed-breadcrumbs">
          <Link to="/admin">Admin</Link> → Internal tags
        </div>
        <h1 className="page-title">Internal admin tags</h1>
        <p className="page-sub">
          Private labels for hosts only. Members never see these. Use them to
          track follow-ups, VIP status, coaching leads, or anything else.
        </p>
      </header>

      <section className="panel">
        <div className="panel-title-row">
          <h2 className="panel-title">Tags ({tags.length})</h2>
          {!creating && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCreating(true)}
            >
              + New tag
            </button>
          )}
        </div>

        {creating && (
          <form className="admin-tag-edit-form" onSubmit={addTag}>
            <label className="field">
              <span className="field-label">Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Coaching Lead"
                maxLength={60}
                required
              />
            </label>
            <label className="field">
              <span className="field-label">Description (optional)</span>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                maxLength={200}
                placeholder="What does this tag mean?"
              />
            </label>
            <ColorPicker
              value={form.color}
              onChange={(color) => setForm({ ...form, color })}
            />
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setCreating(false);
                  setForm(BLANK_FORM);
                }}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving || !form.name.trim()}>
                {saving ? 'Adding…' : 'Add tag'}
              </button>
            </div>
          </form>
        )}

        {err && <div className="form-error" role="alert">{err}</div>}

        {loading ? (
          <p className="muted">Loading tags…</p>
        ) : tags.length === 0 ? (
          <p className="muted">No internal tags yet. Add one above.</p>
        ) : (
          <ul className="admin-tag-list admin-tag-list-rich">
            {tags.map((t) =>
              editingId === t.id ? (
                <li key={t.id} className="admin-tag-row admin-tag-row-editing">
                  <form
                    className="admin-tag-edit-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveEdit(t);
                    }}
                  >
                    <label className="field">
                      <span className="field-label">Name</span>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        maxLength={60}
                        required
                      />
                    </label>
                    <label className="field">
                      <span className="field-label">Description</span>
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        maxLength={200}
                      />
                    </label>
                    <ColorPicker
                      value={editForm.color}
                      onChange={(color) => setEditForm({ ...editForm, color })}
                    />
                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setEditingId(null)}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving || !editForm.name.trim()}
                      >
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                  </form>
                </li>
              ) : (
                <li key={t.id} className="admin-tag-row">
                  <span
                    className="admin-tag-swatch"
                    style={{ background: safeTagColor(t.color) }}
                    aria-hidden="true"
                  />
                  <div className="admin-tag-main">
                    <div className="admin-tag-name">{t.name}</div>
                    {t.description && (
                      <div className="admin-tag-desc muted">{t.description}</div>
                    )}
                  </div>
                  <div className="admin-tag-row-actions">
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => startEdit(t)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn-danger"
                      onClick={() => deleteTag(t)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </section>
    </div>
  );
}

function ColorPicker({ value, onChange }) {
  return (
    <div className="color-picker">
      <div className="field-label">Color</div>
      <div className="color-picker-swatches">
        {ADMIN_TAG_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            className={`color-swatch ${value === c ? 'color-swatch-on' : ''}`}
            style={{ background: c }}
            onClick={() => onChange(c)}
            aria-label={`Use color ${c}`}
            aria-pressed={value === c}
          />
        ))}
        <input
          type="text"
          className="color-picker-hex"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={7}
          aria-label="Hex color"
        />
      </div>
    </div>
  );
}
