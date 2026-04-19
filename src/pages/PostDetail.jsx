import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import PostCard from '../components/forum/PostCard.jsx';
import usePageTitle from '../lib/usePageTitle.js';

export default function PostDetail() {
  usePageTitle('Post');
  const { slug, postId } = useParams();
  const [space, setSpace] = useState(null);
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    const [spaceRes, postRes] = await Promise.all([
      supabase.from('forum_spaces').select('*').eq('slug', slug).maybeSingle(),
      supabase.from('forum_posts').select('*').eq('id', postId).maybeSingle(),
    ]);
    if (spaceRes.error || !spaceRes.data) {
      setError('Space not found.');
      setLoading(false);
      return;
    }
    if (postRes.error || !postRes.data) {
      setError('Post not found.');
      setLoading(false);
      return;
    }
    setSpace(spaceRes.data);
    setPost(postRes.data);
    setError(null);

    const [profRes, reactRes, badgeRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, display_name, avatar_url, role, dietary_approach, selected_frame, current_streak')
        .eq('id', postRes.data.author_id)
        .maybeSingle(),
      supabase
        .from('forum_reactions')
        .select('emoji, user_id, post_id')
        .eq('post_id', postId),
      supabase
        .from('member_badges')
        .select('badges!inner(badge_type, name)')
        .eq('user_id', postRes.data.author_id),
    ]);
    const badges = (badgeRes.data || []).map((row) => ({
      badge_type: row.badges?.badge_type,
      name: row.badges?.name,
    }));
    setAuthor(profRes.data ? { ...profRes.data, badges } : null);
    setReactions(reactRes.data || []);
    setLoading(false);
  }, [slug, postId]);

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

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed">
        <header className="feed-header">
          <div className="feed-breadcrumbs">
            <Link to="/forums">Forums</Link>
          </div>
          <h1 className="feed-title">Not found</h1>
          <p className="feed-desc">{error}</p>
        </header>
      </div>
    );
  }

  return (
    <div className="feed">
      <header className="feed-header">
        <div className="feed-breadcrumbs">
          <Link to="/forums">Forums</Link> →{' '}
          <Link to={`/forums/${space.slug}`}>{space.name}</Link> → {post.title}
        </div>
      </header>
      <PostCard
        post={post}
        author={author}
        reactions={reactions}
        spaceSlug={space.slug}
        initiallyExpanded
        onChanged={load}
      />
    </div>
  );
}
