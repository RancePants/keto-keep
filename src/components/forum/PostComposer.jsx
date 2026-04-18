import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';

export default function PostComposer({ spaceId, onCreated }) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

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

  const reset = () => {
    setTitle('');
    setBody('');
    setImageFile(null);
    setError(null);
    setExpanded(false);
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
    setSaving(true);
    setError(null);
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

      const { data, error: insErr } = await supabase
        .from('forum_posts')
        .insert({
          space_id: spaceId,
          author_id: user.id,
          title: title.trim(),
          body: body.trim(),
          image_path: imagePath,
        })
        .select()
        .single();
      if (insErr) {
        setError(insErr.message);
      } else {
        reset();
        if (onCreated) await onCreated(data);
      }
    } catch (err) {
      setError(err?.message || 'Could not post.');
    } finally {
      setSaving(false);
    }
  };

  if (!expanded) {
    return (
      <div className="post-composer">
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
              {saving ? 'Posting…' : 'Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
