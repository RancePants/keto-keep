import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import ReplyItem from './ReplyItem.jsx';
import ReplyComposer from './ReplyComposer.jsx';

export default function ReplySection({ postId, onReplyCountChange }) {
  const [replies, setReplies] = useState([]);
  const [authors, setAuthors] = useState({});
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const { data: replyRows, error: repErr } = await supabase
        .from('forum_replies')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      if (repErr) {
        console.error('Load replies failed:', repErr.message);
        setReplies([]);
        return;
      }
      setReplies(replyRows || []);
      if (onReplyCountChange) onReplyCountChange((replyRows || []).length);

      const authorIds = Array.from(new Set((replyRows || []).map((r) => r.author_id)));
      if (authorIds.length) {
        const { data: profs } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url, role')
          .in('id', authorIds);
        const map = {};
        for (const p of profs || []) map[p.id] = p;
        setAuthors(map);
      } else {
        setAuthors({});
      }

      const replyIds = (replyRows || []).map((r) => r.id);
      if (replyIds.length) {
        const { data: reacts } = await supabase
          .from('forum_reactions')
          .select('emoji, user_id, reply_id')
          .in('reply_id', replyIds);
        setReactions(reacts || []);
      } else {
        setReactions([]);
      }
    } finally {
      setLoading(false);
    }
  }, [postId, onReplyCountChange]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await load();
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const topLevel = replies.filter((r) => !r.parent_reply_id);
  const childrenByParent = replies.reduce((acc, r) => {
    if (r.parent_reply_id) {
      if (!acc[r.parent_reply_id]) acc[r.parent_reply_id] = [];
      acc[r.parent_reply_id].push(r);
    }
    return acc;
  }, {});

  const reactionsForReply = (id) => reactions.filter((r) => r.reply_id === id);

  return (
    <div className="reply-section">
      {loading && replies.length === 0 ? (
        <div className="muted" style={{ fontSize: 'var(--fs-sm)' }}>Loading replies…</div>
      ) : topLevel.length === 0 ? (
        <div className="muted" style={{ fontSize: 'var(--fs-sm)' }}>Be the first to reply.</div>
      ) : (
        topLevel.map((reply) => (
          <div key={reply.id}>
            <ReplyItem
              reply={reply}
              author={authors[reply.author_id]}
              reactions={reactionsForReply(reply.id)}
              canReplyBelow
              onChanged={load}
            />
            {(childrenByParent[reply.id] || []).map((child) => (
              <ReplyItem
                key={child.id}
                reply={child}
                author={authors[child.author_id]}
                reactions={reactionsForReply(child.id)}
                nested
                onChanged={load}
              />
            ))}
          </div>
        ))
      )}
      <ReplyComposer postId={postId} onSubmitted={load} />
    </div>
  );
}
