import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';
import usePageTitle from '../lib/usePageTitle.js';

export default function AdminHub() {
  usePageTitle('Admin');
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const tools = [
    {
      to: '/members',
      title: 'Member directory',
      desc: 'Browse all members. Card menus expose tag, suspend, ban, and delete actions.',
    },
    {
      to: '/admin/tags',
      title: 'Interest tags',
      desc: 'Public tags members can self-select on their profile.',
    },
    {
      to: '/admin/admin-tags',
      title: 'Internal tags',
      desc: 'Admin-only labels for host coordination. Never shown to members.',
    },
    {
      to: '/forums/admin-hq',
      title: 'Admin HQ forum',
      desc: 'Private space for co-hosts to coordinate.',
    },
  ];

  return (
    <div className="page page-narrow">
      <header className="page-header">
        <div className="admin-hub-eyebrow">
          <span className="admin-hub-shield" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path
                d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"
                fill="currentColor"
                opacity="0.9"
              />
              <path
                d="M12 7v10M7 12h10"
                stroke="var(--color-cream)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          Admin tools
        </div>
        <h1 className="page-title">The Keep — hosts only</h1>
        <p className="page-sub">
          Quick access to admin tools. Badge awards are available from individual
          member profiles.
        </p>
      </header>

      <div className="admin-hub-grid">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="admin-hub-card">
            <h2 className="admin-hub-card-title">{t.title}</h2>
            <p className="admin-hub-card-desc">{t.desc}</p>
            <span className="admin-hub-card-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
