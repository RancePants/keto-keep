import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';

export default function Navbar() {
  const { session, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = profile?.role === 'admin';

  const close = () => setOpen(false);

  const handleSignOut = async () => {
    close();
    await signOut();
    navigate('/');
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark" aria-hidden="true">
            {/* Simple shield/keep mark */}
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
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
          <span className="brand-text">The Keto Keep</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`burger ${open ? 'burger-open' : ''}`}>
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav className={`nav-links ${open ? 'nav-links-open' : ''}`}>
          {session ? (
            <>
              <NavLink to="/dashboard" onClick={close} className="nav-link">
                Dashboard
              </NavLink>
              <NavLink to="/forums" onClick={close} className="nav-link">
                Forums
              </NavLink>
              <NavLink to="/profile" onClick={close} className="nav-link">
                Profile
              </NavLink>
              {isAdmin && (
                <span className="admin-badge" title="Admin">
                  Admin
                </span>
              )}
              <button type="button" onClick={handleSignOut} className="btn btn-ghost">
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close} className="nav-link">
                Log in
              </NavLink>
              <Link to="/signup" onClick={close} className="btn btn-primary">
                Join free
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
