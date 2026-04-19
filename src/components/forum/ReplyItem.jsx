import { useState } from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from './UserAvatar.jsx';
import EmojiReactionBar from './EmojiReactionBar.jsx';
import ReplyComposer from './ReplyComposer.jsx';
import DietaryApproachTag from '../profile/DietaryApproachTag.jsx';
import BadgesInline from '../profile/BadgesInline.jsx';
import { formatRelative, isEdited } from '../../lib/forumHelpers.js';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';

export default function ReplyItem({
  reply,
  author,
  reactions,
  nested = false,
  canReplyBelow = false,
  onChanged,
  onReactionAdded,
  onChildReplyCreated,
}) {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const isOwn = user?.id === reply.author_id;
  const canEdit = isOwn || isAdmin;

  const [composing, setComposing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(reply.body);
  const [saving, setSaving] = useState(false);

  const saveEdit = async () => {
    if (!editBody.trim() || saving) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('forum_replies')
        .update({ body: editBody.trim() })
        .eq('id', reply.id);
      if (error) {
        console.error('Edit reply failed:', error.message);
      } else {
        setEditing(false);
        if (onChanged) await onChanged();
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteReply = async () => {
    if (!window.confirm('Delete this reply?')) return;
    const { error } = await supabase.from('forum_replies').delete().eq('id', reply.id);
    if (error) {
      console.error('Delete reply failed:', error.message);
      return;
    }
    if (onChanged) await onChanged();
  };

  return (
    <div className={`reply ${nested ? 'reply-nested' : ''}`}>
      <UserAvatar author={author} size="xs" />
      <div className="reply-body-wrap">
        <div className="reply-bubble">
          <div className="reply-head">
            {author?.id ? (
              <Link to={`/profile/${author.id}`} className="reply-author">
                {author.display_name || 'Member'}
              </Link>
            ) : (
              <span className="reply-author">Member</span>
            )}
            {author?.dietary_approach && (
              <DietaryApproachTag value={author.dietary_approach} size="sm" />
            )}
            <BadgesInline badges={author?.badges} limit={3} size={12} />
            <span className="reply-time">
              {formatRelative(reply.created_at)}
              {isEdited(reply.created_at, reply.updated_at) ? ' · edited' : ''}
            </span>
          </div>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--color-border-strong)' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn btn-primary" onClick={saveEdit} disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => { setEditing(false); setEditBody(reply.body); }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="reply-text">{reply.body}</p>
          )}
        </div>
        <EmojiReactionBar
          target={{ kind: 'reply', id: reply.id }}
          reactions={reactions}
          onChange={onChanged}
          onReactionAdded={onReactionAdded}
        />
        <div className="reply-actions">
          {canReplyBelow && !nested && (
            <button type="button" className="reply-action" onClick={() => setComposing((v) => !v)}>
              {composing ? 'Cancel' : 'Reply'}
            </button>
          )}
          {canEdit && !editing && (
            <>
              <button type="button" className="reply-action" onClick={() => setEditing(true)}>
                Edit
              </button>
              <button type="button" className="reply-action" onClick={deleteReply}>
                Delete
              </button>
            </>
          )}
        </div>
        {composing && !nested && (
          <div style={{ marginTop: '8px' }}>
            <ReplyComposer
              postId={reply.post_id}
              parentReplyId={reply.id}
              placeholder={`Reply to ${author?.display_name || 'member'}…`}
              onSubmitted={async (newReply) => {
                setComposing(false);
                if (onChildReplyCreated) onChildReplyCreated(newReply);
                else if (onChanged) await onChanged();
              }}
              onCancel={() => setComposing(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
