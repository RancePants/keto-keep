import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../contexts/useAuth.js';

export default function AdminTags() {
  const { user, profile, loading: authLoading } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setErr('');
    const { data, error } = await supabase
      .from('tags')
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
    const name = newName.trim();
    if (!name || saving) return;
    setSaving(true);
    setErr('');
    try {
      const { error } = await supabase
        .from('tags')
        .insert({ name, created_by: user?.id ?? null });
      if (error) {
        setErr(error.message);
      } else {
        setNewName('');
        await load();
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteTag = async (tag) => {
    if (!window.confirm(`Delete tag "${tag.name}"? Members who selected it will lose that selection.`)) return;
    const { error } = await supabase.from('tags').delete().eq('id', tag.id);
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
          <Link to="/dashboard">Dashboard</Link> → Admin · Tags
        </div>
        <h1 className="page-title">Interest tags</h1>
        <p className="page-sub">
          Curate the interest tags members can self-select on their profile.
        </p>
      </header>

      <section className="panel">
        <h2 className="panel-title">Add a tag</h2>
        <form className="admin-tag-form" onSubmit={addTag}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Athletic Performance"
            maxLength={60}
            className="input"
          />
          <button type="submit" className="btn btn-primary" disabled={saving || !newName.trim()}>
            {saving ? 'Adding…' : 'Add tag'}
          </button>
        </form>
        {err && <p className="form-error" role="alert">{err}</p>}
      </section>

      <section className="panel">
        <h2 className="panel-title">Existing tags ({tags.length})</h2>
        {loading ? (
          <p className="muted">Loading tags…</p>
        ) : tags.length === 0 ? (
          <p className="muted">No tags yet. Add one above.</p>
        ) : (
          <ul className="admin-tag-list">
            {tags.map((t) => (
              <li key={t.id} className="admin-tag-row">
                <span className="admin-tag-name">{t.name}</span>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => deleteTag(t)}
                  aria-label={`Delete ${t.name}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
