import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../contexts/useAuth.js';
import PostComposer from '../components/forum/PostComposer.jsx';
import PostCard from '../components/forum/PostCard.jsx';
import usePageTitle from '../lib/usePageTitle.js';

const PAGE_SIZE = 20;

export default function SpaceView() {
  usePageTitle('Forums');
  const { isAdmin } = useAuth();
  const { slug } = useParams();
  const [space, setSpace] = useState(null);
  const [spaceError, setSpaceError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState({});
  const [reactions, setReactions] = useState([]);
  const [replyCounts, setReplyCounts] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Load space
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);
      setSpace(null);
      setSpaceError(null);
      const { data, error } = await supabase
        .from('forum_spaces')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        setSpaceError(error.message);
      } else if (!data) {
        setSpaceError('Space not found or you do not have access.');
      } else {
        setSpace(data);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const hydrateMeta = useCallback(async (postRows) => {
    if (!postRows.length) return;
    const authorIds = Array.from(new Set(postRows.map((p) => p.author_id)));
    const postIds = postRows.map((p) => p.id);

    const [profRes, reactRes, replyRes, badgeRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, display_name, avatar_url, role, dietary_approach, selected_frame, current_streak')
        .in('id', authorIds),
      supabase
        .from('forum_reactions')
        .select('emoji, user_id, post_id')
        .in('post_id', postIds),
      supabase
        .from('forum_replies')
        .select('post_id')
        .in('post_id', postIds),
      supabase
        .from('member_badges')
        .select('user_id, badges!inner(badge_type, name)')
        .in('user_id', authorIds),
    ]);

    const badgeMap = {};
    for (const row of badgeRes.data || []) {
      if (!badgeMap[row.user_id]) badgeMap[row.user_id] = [];
      badgeMap[row.user_id].push({
        badge_type: row.badges?.badge_type,
        name: row.badges?.name,
      });
    }

    setAuthors((prev) => {
      const next = { ...prev };
      for (const p of profRes.data || []) {
        next[p.id] = { ...p, badges: badgeMap[p.id] || [] };
      }
      return next;
    });
    setReactions((prev) => {
      // Filter out stale reactions for these post ids, then add fresh
      const filtered = prev.filter((r) => !postIds.includes(r.post_id));
      return [...filtered, ...(reactRes.data || [])];
    });
    setReplyCounts((prev) => {
      const next = { ...prev };
      for (const id of postIds) next[id] = 0;
      for (const row of replyRes.data || []) {
        next[row.post_id] = (next[row.post_id] || 0) + 1;
      }
      return next;
    });
  }, []);

  const loadPage = useCallback(
    async (spaceId, pageIdx) => {
      const from = pageIdx * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      let q = supabase
        .from('forum_posts')
        .select('*')
        .eq('space_id', spaceId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to);
      if (!isAdmin) {
        q = q.or(`scheduled_at.is.null,scheduled_at.lte.${new Date().toISOString()}`);
      }
      const { data, error } = await q;
      if (error) {
        console.error('Load posts failed:', error.message);
        return { rows: [], done: true };
      }
      return { rows: data || [], done: (data || []).length < PAGE_SIZE };
    },
    [isAdmin]
  );

  // Load first page when space resolves
  useEffect(() => {
    if (!space?.id) return undefined;
    const spaceId = space.id;
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setPosts([]);
      setAuthors({});
      setReactions([]);
      setReplyCounts({});
      setPage(0);
      setHasMore(true);
      const { rows, done } = await loadPage(spaceId, 0);
      if (cancelled) return;
      await hydrateMeta(rows);
      if (cancelled) return;
      setPosts(rows);
      setHasMore(!done);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [space, loadPage, hydrateMeta]);

  const loadMore = async () => {
    if (!space?.id || loadingMore) return;
    setLoadingMore(true);
    const next = page + 1;
    const { rows, done } = await loadPage(space.id, next);
    await hydrateMeta(rows);
    setPosts((prev) => [...prev, ...rows]);
    setPage(next);
    setHasMore(!done);
    setLoadingMore(false);
  };

  const refresh = useCallback(async () => {
    const spaceId = space?.id;
    if (!spaceId) return;
    const count = (page + 1) * PAGE_SIZE;
    let q = supabase
      .from('forum_posts')
      .select('*')
      .eq('space_id', spaceId)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(0, count - 1);
    if (!isAdmin) {
      q = q.or(`scheduled_at.is.null,scheduled_at.lte.${new Date().toISOString()}`);
    }
    const { data, error } = await q;
    if (error) {
      console.error('Refresh failed:', error.message);
      return;
    }
    setPosts(data || []);
    await hydrateMeta(data || []);
  }, [space, page, hydrateMeta, isAdmin]);

  const onPostCreated = useCallback(
    async (newPost) => {
      setPosts((prev) => [newPost, ...prev]);
      await hydrateMeta([newPost]);
    },
    [hydrateMeta]
  );

  if (loading && !spaceError) {
    return (
      <div className="page-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  if (spaceError) {
    return (
      <div className="feed">
        <header className="feed-header">
          <div className="feed-breadcrumbs">
            <Link to="/forums">Forums</Link>
          </div>
          <h1 className="feed-title">Space unavailable</h1>
          <p className="feed-desc">{spaceError}</p>
        </header>
      </div>
    );
  }

  if (!space) return null;

  return (
    <div className="feed">
      <header className="feed-header">
        <div className="feed-breadcrumbs">
          <Link to="/forums">Forums</Link> → {space.name}
        </div>
        <h1 className="feed-title">
          {space.is_admin_only && '🔒 '}
          {space.name}
        </h1>
        {space.description && <p className="feed-desc">{space.description}</p>}
      </header>

      <PostComposer spaceId={space.id} spaceSlug={space.slug} onCreated={onPostCreated} />

      {posts.length === 0 ? (
        <div className="feed-empty">
          No posts yet. Be the first to share something.
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            author={authors[post.author_id]}
            reactions={reactions.filter((r) => r.post_id === post.id)}
            replyCount={replyCounts[post.id] ?? 0}
            spaceSlug={space.slug}
            spaceName={space.name}
            onChanged={refresh}
          />
        ))
      )}

      {hasMore && posts.length > 0 && (
        <div className="feed-load-more">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
}
