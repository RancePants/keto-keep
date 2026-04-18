import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';

export default function ForumHome() {
  const [spaces, setSpaces] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error: err } = await supabase
        .from('forum_spaces')
        .select('*')
        .order('sort_order', { ascending: true });
      if (cancelled) return;
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      setSpaces(data || []);
      setLoading(false);

      // Count posts per space (parallel)
      const countMap = {};
      await Promise.all(
        (data || []).map(async (s) => {
          const { count } = await supabase
            .from('forum_posts')
            .select('*', { count: 'exact', head: true })
            .eq('space_id', s.id);
          countMap[s.id] = count ?? 0;
        })
      );
      if (!cancelled) setCounts(countMap);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="forum-home">
      <header className="page-header">
        <h1 className="page-title">Forums</h1>
        <p className="page-sub">Pick a space and jump in.</p>
      </header>
      {error && <div className="form-error">{error}</div>}
      <div className="space-grid">
        {spaces.map((space) => (
          <Link
            key={space.id}
            to={`/forums/${space.slug}`}
            className={`space-card ${space.is_admin_only ? 'space-card-locked' : ''}`}
          >
            <h3 className="space-card-title">
              {space.is_admin_only && <span aria-hidden="true">🔒</span>}
              {space.name}
            </h3>
            <p className="space-card-desc">{space.description}</p>
            <div className="space-card-meta">
              {counts[space.id] ?? 0} post{counts[space.id] === 1 ? '' : 's'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
