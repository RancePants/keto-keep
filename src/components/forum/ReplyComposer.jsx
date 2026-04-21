import { useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';
import RichTextEditor from '../ui/RichTextEditor.jsx';

export default function ReplyComposer({ postId, parentReplyId = null, placeholder = 'Write a reply…', onSubmitted, onCancel }) {
  const { user, isSuspended } = useAuth();
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (isSuspended) {
    return (
      <div className="reply-composer reply-composer-disabled">
        <p className="muted">Replies disabled while suspended.</p>
      </div>
    );
  }

  const bodyText = body.replace(/<[^>]*>/g, '').trim();

  const submit = async (e) => {
    e.preventDefault();
    if (!user?.id || !bodyText || saving) return;
    setSaving(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('forum_replies')
        .insert({
          post_id: postId,
          parent_reply_id: parentReplyId,
          author_id: user.id,
          body: body.trim(),
        })
        .select()
        .single();
      if (err) {
        setError(err.message);
      } else {
        setBody('');
        if (onSubmitted) await onSubmitted(data);
      }
    } catch (err) {
      setError(err?.message || 'Could not post reply.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="reply-composer reply-composer-rte">
      <div className="reply-composer-editor">
        <RichTextEditor
          content={body}
          onChange={setBody}
          placeholder={placeholder}
          slim
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button type="submit" className="btn btn-primary" disabled={saving || !bodyText}>
          {saving ? '…' : 'Reply'}
        </button>
        {onCancel && (
          <button type="button" className="icon-btn" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        )}
        {error && <div className="form-error" style={{ gridColumn: '1 / -1' }}>{error}</div>}
      </div>
    </form>
  );
}
