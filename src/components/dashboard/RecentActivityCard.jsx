import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js';
import { formatRelative } from '../../lib/forumHelpers.js';

export default function RecentActivityCard() {
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      try {
        const { data, error } = await supabase
          .from('forum_posts')
          .select('id, title, created_at, author_id, forum_spaces!inner(slug, name)')
          .order('created_at', { ascending: false })
          .limit(10);
        if (cancelled) return;
        if (error) {
          console.error('RecentActivityCard fetch failed:', error.message);
          return;
        }
        const filtered = (data || [])
          .filter((p) => p.forum_spaces?.slug !== 'admin-hq')
          .slice(0, 5);
        setPosts(filtered);

        const authorIds = Array.from(new Set(filtered.map((p) => p.author_id)));
        if (authorIds.length) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, display_name')
            .in('id', authorIds);
          if (cancelled) return;
          const map = {};
          for (const p of profiles || []) map[p.id] = p;
          setAuthors(map);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="panel">
      <h2 className="panel-title">Recent Forum Activity</h2>
      {loading ? (
        <div className="muted" style={{ fontSize: 'var(--fs-sm)' }}>Loading…</div>
      ) : posts.length === 0 ? (
        <p className="muted">No posts yet — be the first!</p>
      ) : (
        <ul className="recent-activity-list">
          {posts.map((post) => {
            const spaceSlug = post.forum_spaces?.slug;
            const spaceName = post.forum_spaces?.name;
            const authorName = authors[post.author_id]?.display_name || 'Member';
            return (
              <li key={post.id} className="recent-activity-row">
                <div className="recent-activity-title">
                  <Link to={`/forums/${spaceSlug}/${post.id}`} style={{ color: 'inherit' }}>
                    {post.title}
                  </Link>
                  <span className="recent-activity-author">{authorName}</span>
                </div>
                <span className="recent-activity-space">{spaceName}</span>
                <span className="recent-activity-time">{formatRelative(post.created_at)}</span>
              </li>
            );
          })}
        </ul>
      )}
      <div className="dashboard-card-footer">
        <Link to="/forums">View all →</Link>
      </div>
    </div>
  );
}
