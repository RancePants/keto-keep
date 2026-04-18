import { useState } from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from './UserAvatar.jsx';
import EmojiReactionBar from './EmojiReactionBar.jsx';
import ReplySection from './ReplySection.jsx';
import ForumModTools from './ForumModTools.jsx';
import { usePrivateImage } from './usePrivateImage.js';
import { formatRelative, isEdited } from '../../lib/forumHelpers.js';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';

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
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const isAuthor = user?.id === post.author_id;

  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editBody, setEditBody] = useState(post.body);
  const [saving, setSaving] = useState(false);
  const [liveReplyCount, setLiveReplyCount] = useState(replyCount ?? 0);

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

  const doDelete = async () => {
    if (!window.confirm('Delete this post? All replies will be removed.')) return;
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
          {author?.id ? (
            <Link to={`/profile/${author.id}`} className="post-author">
              {author.display_name || 'Member'}
            </Link>
          ) : (
            <span className="post-author">Member</span>
          )}
          <div className="post-meta">
            <span>{formatRelative(post.created_at)}</span>
            {isEdited(post.created_at, post.updated_at) && <span>· edited</span>}
            {post.is_pinned && <span className="pin-indicator">📌 Pinned</span>}
          </div>
        </div>
        <ForumModTools
          isAdmin={isAdmin}
          isAuthor={isAuthor}
          isPinned={post.is_pinned}
          onTogglePin={isAdmin ? togglePin : null}
          onEdit={canEdit ? () => setEditing(true) : null}
          onDelete={canEdit ? doDelete : null}
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
          onReplyCountChange={setLiveReplyCount}
        />
      )}
    </article>
  );
}
