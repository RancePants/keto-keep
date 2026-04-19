import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from './UserAvatar.jsx';
import EmojiReactionBar from './EmojiReactionBar.jsx';
import ReplySection from './ReplySection.jsx';
import ForumModTools from './ForumModTools.jsx';
import DietaryApproachTag from '../profile/DietaryApproachTag.jsx';
import BadgesInline from '../profile/BadgesInline.jsx';
import Modal from '../ui/Modal.jsx';
import { usePrivateImage } from './usePrivateImage.js';
import { formatRelative, isEdited } from '../../lib/forumHelpers.js';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';
import { notifyReaction } from '../../lib/notificationHelpers.js';

function PostImage({ path }) {
  const url = usePrivateImage('forum-images', path);
  if (!path) return null;
  if (!url) return <div className="post-image-placeholder" aria-hidden="true" />;
  return <img src={url} alt="" className="post-image" />;
}

export default function PostCard({
  post,
  author,
  reactions,
  replyCount,
  spaceSlug,
  onChanged,
  initiallyExpanded = false,
}) {
  const { user, isAdmin } = useAuth();
  const isAuthor = user?.id === post.author_id;

  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editBody, setEditBody] = useState(post.body);
  const [saving, setSaving] = useState(false);
  const [liveReplyCount, setLiveReplyCount] = useState(replyCount ?? 0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Capture mount time once so render stays pure. Scheduled badge accuracy
  // refreshes on the next navigation / parent re-fetch — good enough.
  const [mountedAt] = useState(() => Date.now());
  const scheduledFuture = useMemo(
    () => Boolean(post.scheduled_at) && new Date(post.scheduled_at).getTime() > mountedAt,
    [post.scheduled_at, mountedAt]
  );

  const canEdit = isAuthor || isAdmin;

  const togglePin = async () => {
    const { error } = await supabase
      .from('forum_posts')
      .update({ is_pinned: !post.is_pinned })
      .eq('id', post.id);
    if (error) {
      console.error('Toggle pin failed:', error.message);
      return;
    }
    if (onChanged) await onChanged();
  };

  const confirmedDelete = async () => {
    setConfirmDelete(false);
    const { error } = await supabase.from('forum_posts').delete().eq('id', post.id);
    if (error) {
      console.error('Delete post failed:', error.message);
      return;
    }
    if (post.image_path) {
      await supabase.storage.from('forum-images').remove([post.image_path]);
    }
    if (onChanged) await onChanged();
  };

  const saveEdit = async () => {
    if (!editTitle.trim() || !editBody.trim() || saving) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('forum_posts')
        .update({ title: editTitle.trim(), body: editBody.trim() })
        .eq('id', post.id);
      if (error) {
        console.error('Edit post failed:', error.message);
      } else {
        setEditing(false);
        if (onChanged) await onChanged();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className={`post-card ${post.is_pinned ? 'pinned' : ''}`}>
      <header className="post-header">
        <UserAvatar author={author} size="sm" />
        <div className="post-byline">
          <div className="post-author-row">
            {author?.id ? (
              <Link to={`/profile/${author.id}`} className="post-author">
                {author.display_name || 'Member'}
              </Link>
            ) : (
              <span className="post-author">Member</span>
            )}
            {author?.dietary_approach && (
              <DietaryApproachTag value={author.dietary_approach} size="sm" />
            )}
            <BadgesInline badges={author?.badges} limit={3} size={14} />
          </div>
          <div className="post-meta">
            <span>{formatRelative(post.created_at)}</span>
            {isEdited(post.created_at, post.updated_at) && <span>· edited</span>}
            {post.is_pinned && <span className="pin-indicator">📌 Pinned</span>}
            {post.is_broadcast && <span className="broadcast-indicator" title="Broadcast">📢 Broadcast</span>}
            {scheduledFuture && (
              <span className="scheduled-indicator" title={new Date(post.scheduled_at).toLocaleString()}>
                🕒 Scheduled for {new Date(post.scheduled_at).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <ForumModTools
          isAdmin={isAdmin}
          isAuthor={isAuthor}
          isPinned={post.is_pinned}
          onTogglePin={isAdmin ? togglePin : null}
          onEdit={canEdit ? () => setEditing(true) : null}
          onDelete={canEdit ? () => setConfirmDelete(true) : null}
        />
      </header>

      {editing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--color-border-strong)' }}
          />
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            rows={5}
            style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--color-border-strong)' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-primary" onClick={saveEdit} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => { setEditing(false); setEditTitle(post.title); setEditBody(post.body); }}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="post-title">
            {spaceSlug && !initiallyExpanded ? (
              <Link to={`/forums/${spaceSlug}/${post.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {post.title}
              </Link>
            ) : (
              post.title
            )}
          </h3>
          <p className="post-body">{post.body}</p>
          {post.image_path && <PostImage path={post.image_path} />}
        </>
      )}

      <EmojiReactionBar
        target={{ kind: 'post', id: post.id }}
        reactions={reactions}
        onChange={onChanged}
        onReactionAdded={(emoji) => {
          notifyReaction(
            supabase,
            post.author_id,
            user?.id,
            emoji,
            spaceSlug ? `/forums/${spaceSlug}/${post.id}` : null
          );
        }}
      />

      <div className="post-footer">
        <button
          type="button"
          className="reply-toggle"
          onClick={() => setExpanded((v) => !v)}
        >
          💬 {liveReplyCount} {liveReplyCount === 1 ? 'reply' : 'replies'} {expanded ? '▲' : '▼'}
        </button>
        {spaceSlug && !initiallyExpanded && (
          <Link to={`/forums/${spaceSlug}/${post.id}`} className="reply-toggle">
            Permalink
          </Link>
        )}
      </div>

      {expanded && (
        <ReplySection
          postId={post.id}
          postAuthorId={post.author_id}
          postTitle={post.title}
          permalink={spaceSlug ? `/forums/${spaceSlug}/${post.id}` : null}
          onReplyCountChange={setLiveReplyCount}
        />
      )}
      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete post"
        variant="danger"
        size="sm"
      >
        <p style={{ margin: 0, lineHeight: 1.5, color: 'var(--color-ink-soft)' }}>
          Delete this post? All replies will be removed.
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button type="button" className="btn btn-ghost" onClick={() => setConfirmDelete(false)}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={confirmedDelete}>
            Delete post
          </button>
        </div>
      </Modal>
    </article>
  );
}
