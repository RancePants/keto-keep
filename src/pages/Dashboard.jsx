import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';

export default function Dashboard() {
  const { profile } = useAuth();
  const name = profile?.display_name || 'friend';
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="page page-narrow">
      <header className="page-header">
        <h1 className="page-title">Welcome back, {name}!</h1>
        <p className="page-sub">Good to see you in The Keep.</p>
      </header>

      <section className="panel">
        <h2 className="panel-title">Community news</h2>
        <p>
          We're just getting started. This dashboard will soon surface the latest forum
          threads, upcoming events, and fresh course material. For now, say hello on your
          profile and invite a friend.
        </p>
      </section>

      <section className="panel">
        <h2 className="panel-title">Quick links</h2>
        <ul className="quick-links">
          <li>
            <Link to="/profile">Your profile</Link>
            <span className="muted">Add a photo and a short bio.</span>
          </li>
          <li>
            <span className="disabled-link">Forums</span>
            <span className="muted">Coming soon.</span>
          </li>
          <li>
            <span className="disabled-link">Events</span>
            <span className="muted">Coming soon.</span>
          </li>
          <li>
            <span className="disabled-link">Course</span>
            <span className="muted">Coming soon.</span>
          </li>
          {isAdmin && (
            <li>
              <Link to="/admin">Admin panel</Link>
              <span className="muted">Management tools (Phase 2+).</span>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
