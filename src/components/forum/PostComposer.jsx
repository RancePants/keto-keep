import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';
import { isoToLocalInput, localInputToIso } from '../../lib/eventHelpers.js';
import { formatRelative } from '../../lib/forumHelpers.js';

export default function PostComposer({ spaceId, spaceSlug, onCreated }) {
  const { user, profile, isSuspended } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const fileInputRef = useRef(null);

  // Admin-only state
  const [broadcast, setBroadcast] = useState(false);
  const [scheduleOn, setScheduleOn] = useState(false);
  const [scheduleLocal, setScheduleLocal] = useState('');
  const [lastBroadcast, setLastBroadcast] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let createdUrl = null;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      if (!imageFile) {
        setPreviewUrl(null);
        return;
      }
      createdUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(createdUrl);
    })();
    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [imageFile]);

  // Load most-recent broadcast timestamp when admin expands the composer.
  useEffect(() => {
    if (!isAdmin || !expanded) return undefined;
    let cancelled = false;
    (async () => {
      const { data, error: bErr } = await supabase
        .from('forum_posts')
        .select('created_at')
        .eq('is_broadcast', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      if (bErr) {
        console.error('Last broadcast lookup failed:', bErr.message);
        return;
      }
      setLastBroadcast(data?.created_at || null);
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, expanded]);

  const reset = () => {
    setTitle('');
    setBody('');
    setImageFile(null);
    setError(null);
    setInfo(null);
    setExpanded(false);
    setBroadcast(false);
    setScheduleOn(false);
    setScheduleLocal('');
  };

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Image must be under 8 MB.');
      return;
    }
    setError(null);
    setImageFile(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!user?.id || saving) return;
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required.');
      return;
    }

    let scheduledIso = null;
    if (isAdmin && scheduleOn) {
      if (!scheduleLocal) {
        setError('Pick a date/time for the scheduled post.');
        return;
      }
      scheduledIso = localInputToIso(scheduleLocal);
      if (!scheduledIso || new Date(scheduledIso).getTime() <= Date.now()) {
        setError('Scheduled time must be in the future.');
        return;
      }
    }

    setSaving(true);
    setError(null);
    setInfo(null);
    try {
      let imagePath = null;
      if (imageFile) {
        const ext = (imageFile.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
        const rand = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const path = `${user.id}/${rand}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('forum-images')
          .upload(path, imageFile, { contentType: imageFile.type || undefined });
        if (upErr) {
          setError(upErr.message || 'Image upload failed.');
          setSaving(false);
          return;
        }
        imagePath = path;
      }

      const insertPayload = {
        space_id: spaceId,
        author_id: user.id,
        title: title.trim(),
        body: body.trim(),
        image_path: imagePath,
      };
      if (isAdmin && broadcast) insertPayload.is_broadcast = true;
      if (scheduledIso) insertPayload.scheduled_at = scheduledIso;

      const { data, error: insErr } = await supabase
        .from('forum_posts')
        .insert(insertPayload)
        .select()
        .single();
      if (insErr) {
        setError(insErr.message);
        return;
      }

      // Fire broadcast notification (admin + checkbox on; not deferred for
      // scheduled posts — the notification still goes out on create).
      let broadcastInfo = null;
      if (isAdmin && broadcast && data?.id) {
        const link = spaceSlug ? `/forums/${spaceSlug}/${data.id}` : `/forums`;
        const { data: count, error: bErr } = await supabase.rpc('broadcast_notification', {
          p_post_id: data.id,
          p_title: `📢 ${title.trim()}`,
          p_body: body.trim().slice(0, 280),
          p_link: link,
          p_type: 'admin_broadcast',
        });
        if (bErr) {
          console.error('Broadcast notification failed:', bErr.message);
          broadcastInfo = 'Post created, but broadcast notification failed.';
        } else {
          broadcastInfo = `Broadcast sent to ${count ?? 0} member${count === 1 ? '' : 's'}.`;
        }
      }

      reset();
      if (broadcastInfo) setInfo(broadcastInfo);
      if (onCreated) await onCreated(data);
    } catch (err) {
      setError(err?.message || 'Could not post.');
    } finally {
      setSaving(false);
    }
  };

  if (isSuspended) {
    return (
      <div className="post-composer post-composer-disabled">
        <p className="muted">
          Posting is disabled while your account is suspended.
        </p>
      </div>
    );
  }

  if (!expanded) {
    return (
      <div className="post-composer">
        {info && <div className="post-composer-info">{info}</div>}
        <button
          type="button"
          className="post-composer-prompt"
          onClick={() => setExpanded(true)}
          style={{ width: '100%' }}
        >
          What's on your mind?
        </button>
      </div>
    );
  }

  // Default the schedule input to ~1 hour from now the first time it's opened.
  const ensureScheduleDefault = () => {
    if (!scheduleLocal) {
      const d = new Date(Date.now() + 60 * 60 * 1000);
      setScheduleLocal(isoToLocalInput(d.toISOString()));
    }
  };

  return (
    <div className="post-composer">
      <form onSubmit={submit} className="post-composer-form">
        <label className="field">
          <span className="field-label">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            maxLength={200}
          />
        </label>
        <label className="field" style={{ marginTop: 'var(--space-3)' }}>
          <span className="field-label">Body</span>
          <textarea
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </label>
        {previewUrl && (
          <div style={{ marginTop: 'var(--space-3)' }}>
            <img src={previewUrl} alt="Preview" className="post-composer-preview" />
          </div>
        )}

        {isAdmin && (
          <div className="post-composer-admin">
            <div className="post-composer-admin-row">
              <label className="post-composer-toggle">
                <input
                  type="checkbox"
                  checked={broadcast}
                  onChange={(e) => setBroadcast(e.target.checked)}
                  disabled={saving}
                />
                <span>📢 Broadcast to all members</span>
              </label>
              <span className="post-composer-admin-meta">
                {lastBroadcast
                  ? `Last broadcast: ${formatRelative(lastBroadcast)}`
                  : 'No broadcasts sent yet'}
              </span>
            </div>
            <div className="post-composer-admin-row">
              <label className="post-composer-toggle">
                <input
                  type="checkbox"
                  checked={scheduleOn}
                  onChange={(e) => {
                    const next = e.target.checked;
                    setScheduleOn(next);
                    if (next) ensureScheduleDefault();
                  }}
                  disabled={saving}
                />
                <span>🕒 Schedule for later</span>
              </label>
              {scheduleOn && (
                <input
                  type="datetime-local"
                  className="post-composer-schedule-input"
                  value={scheduleLocal}
                  onChange={(e) => setScheduleLocal(e.target.value)}
                  disabled={saving}
                />
              )}
            </div>
          </div>
        )}

        {error && <div className="form-error" style={{ marginTop: 'var(--space-3)' }}>{error}</div>}
        <div className="post-composer-actions">
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="icon-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
            >
              📷 {imageFile ? 'Change photo' : 'Add photo'}
            </button>
            {imageFile && (
              <button
                type="button"
                className="icon-btn"
                onClick={() => setImageFile(null)}
                disabled={saving}
              >
                Remove photo
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onPickFile}
              hidden
            />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button type="button" className="icon-btn" onClick={reset} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Posting…' : scheduleOn ? 'Schedule post' : 'Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
