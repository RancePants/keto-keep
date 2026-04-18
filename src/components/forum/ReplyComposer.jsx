import { useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';

export default function ReplyComposer({ postId, parentReplyId = null, placeholder = 'Write a reply…', onSubmitted, onCancel }) {
  const { user } = useAuth();
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!user?.id || !body.trim() || saving) return;
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
    <form onSubmit={submit} className="reply-composer">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        rows={2}
        disabled={saving}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button type="submit" className="btn btn-primary" disabled={saving || !body.trim()}>
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
