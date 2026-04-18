import { useCallback, useEffect, useState } from 'react';
import Modal from '../ui/Modal.jsx';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';
import { safeTagColor } from '../../lib/memberHelpers.js';

export default function AssignAdminTagModal({
  open,
  onClose,
  targetUserId,
  targetName,
  onChanged,
}) {
  const { user } = useAuth();
  const [allTags, setAllTags] = useState([]);
  const [assigned, setAssigned] = useState(new Map()); // tag_id -> { note }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    if (!targetUserId) return;
    setLoading(true);
    setErr('');
    const [catalog, assignedRows] = await Promise.all([
      supabase.from('admin_tags').select('*').order('name', { ascending: true }),
      supabase
        .from('member_admin_tags')
        .select('tag_id, note')
        .eq('user_id', targetUserId),
    ]);
    if (catalog.error) {
      setErr(catalog.error.message);
      setAllTags([]);
    } else {
      setAllTags(catalog.data || []);
    }
    if (assignedRows.error) {
      setErr((prev) => prev || assignedRows.error.message);
      setAssigned(new Map());
    } else {
      const map = new Map();
      for (const r of assignedRows.data || []) {
        map.set(r.tag_id, { note: r.note || '' });
      }
      setAssigned(map);
    }
    setLoading(false);
  }, [targetUserId]);

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setNoteInput('');
      await load();
    })();
    return () => {
      cancelled = true;
    };
  }, [open, load]);

  const toggleTag = async (tag) => {
    if (saving) return;
    setSaving(true);
    setErr('');
    const isAssigned = assigned.has(tag.id);
    try {
      if (isAssigned) {
        const { error } = await supabase
          .from('member_admin_tags')
          .delete()
          .eq('user_id', targetUserId)
          .eq('tag_id', tag.id);
        if (error) {
          setErr(error.message);
          return;
        }
      } else {
        const payload = {
          user_id: targetUserId,
          tag_id: tag.id,
          assigned_by: user?.id ?? null,
        };
        const trimmed = noteInput.trim();
        if (trimmed) payload.note = trimmed;
        const { error } = await supabase.from('member_admin_tags').insert(payload);
        if (error) {
          setErr(error.message);
          return;
        }
      }
      await load();
      if (onChanged) await onChanged();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Manage admin tags · ${targetName || 'member'}`}
      size="md"
    >
      <div className="assign-tag-body">
        <p className="muted assign-tag-help">
          Tap a tag to toggle it. These are admin-only — members never see them.
        </p>
        <label className="field">
          <span className="field-label">Optional note (applied on next assignment)</span>
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            maxLength={200}
            placeholder="e.g. Followed up 2026-04-18"
          />
        </label>
        {err && <div className="form-error">{err}</div>}
        {loading ? (
          <p className="muted">Loading tags…</p>
        ) : allTags.length === 0 ? (
          <p className="muted">
            No admin tags in the catalog yet. Create one in Admin · Internal tags.
          </p>
        ) : (
          <div className="admin-tag-chip-row">
            {allTags.map((t) => {
              const on = assigned.has(t.id);
              const color = safeTagColor(t.color);
              const cls = `admin-tag-chip ${on ? 'admin-tag-chip-on' : 'admin-tag-chip-off'}`;
              const style = on
                ? { background: color, borderColor: color, color: '#fff' }
                : { color, borderColor: color };
              return (
                <button
                  key={t.id}
                  type="button"
                  className={cls}
                  style={style}
                  onClick={() => toggleTag(t)}
                  disabled={saving}
                  aria-pressed={on}
                  title={t.description || t.name}
                >
                  <span className="admin-tag-chip-dot" style={{ background: color }} />
                  <span>{t.name}</span>
                </button>
              );
            })}
          </div>
        )}
        {assigned.size > 0 && (
          <div className="assign-tag-notes">
            <h3 className="assign-tag-notes-title">Notes on current tags</h3>
            <ul className="assign-tag-notes-list">
              {allTags
                .filter((t) => assigned.has(t.id))
                .map((t) => {
                  const entry = assigned.get(t.id);
                  return (
                    <li key={t.id}>
                      <strong>{t.name}:</strong>{' '}
                      <span className="muted">
                        {entry?.note ? entry.note : 'No note.'}
                      </span>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}
