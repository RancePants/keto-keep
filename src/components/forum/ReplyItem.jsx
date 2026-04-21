import { useState } from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import UserAvatar from './UserAvatar.jsx';
import EmojiReactionBar from './EmojiReactionBar.jsx';
import ReplyComposer from './ReplyComposer.jsx';
import DietaryApproachTag from '../profile/DietaryApproachTag.jsx';
import BadgesInline from '../profile/BadgesInline.jsx';
import StreakBadge from '../ui/StreakBadge.jsx';
import Modal from '../ui/Modal.jsx';
import RichTextEditor from '../ui/RichTextEditor.jsx';
import { formatRelative, isEdited } from '../../lib/forumHelpers.js';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';

const ALLOWED_TAGS = ['b', 'i', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'p', 'br'];
const ALLOWED_ATTR = { a: ['href', 'target', 'rel'] };

function sanitize(html) {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}

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
  const { user, isAdmin } = useAuth();
  const isOwn = user?.id === reply.author_id;
  const canEdit = isOwn || isAdmin;

  const [composing, setComposing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(reply.body);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const editBodyText = editBody.replace(/<[^>]*>/g, '').trim();

  const saveEdit = async () => {
    if (!editBodyText || saving) return;
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

  const confirmedDeleteReply = async () => {
    setConfirmDelete(false);
    const { error } = await supabase.from('forum_replies').delete().eq('id', reply.id);
    if (error) {
      console.error('Delete reply failed:', error.message);
      return;
    }
    if (onChanged) await onChanged();
  };

  return (
    <>
    <Modal
      open={confirmDelete}
      onClose={() => setConfirmDelete(false)}
      title="Delete reply"
      variant="danger"
      size="sm"
    >
      <p style={{ margin: 0, lineHeight: 1.5, color: 'var(--color-ink-soft)' }}>
        Delete this reply?
      </p>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button type="button" className="btn btn-ghost" onClick={() => setConfirmDelete(false)}>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={confirmedDeleteReply}>
          Delete reply
        </button>
      </div>
    </Modal>
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
            {author?.current_streak > 0 && (
              <StreakBadge streak={author.current_streak} size="sm" showCount />
            )}
            <span className="reply-time">
              {formatRelative(reply.created_at)}
              {isEdited(reply.created_at, reply.updated_at) ? ' · edited' : ''}
            </span>
          </div>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <RichTextEditor
                content={editBody}
                onChange={setEditBody}
                placeholder="Reply body…"
                slim
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn btn-primary" onClick={saveEdit} disabled={saving || !editBodyText}>
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
            <div
              className="reply-rich-body"
              dangerouslySetInnerHTML={{ __html: sanitize(reply.body) }}
            />
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
              <button type="button" className="reply-action" onClick={() => setConfirmDelete(true)}>
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
    </>
  );
}
