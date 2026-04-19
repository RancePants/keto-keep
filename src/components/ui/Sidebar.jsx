import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth.js';
import { dietaryLabel } from '../../lib/profileHelpers.js';
import DietaryApproachTag from '../profile/DietaryApproachTag.jsx';
import NotificationBell from '../notifications/NotificationBell.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import SidebarNavLink from './SidebarNavLink.jsx';
import SidebarSection from './SidebarSection.jsx';
import pkg from '../../../package.json';

function SidebarAvatar({ path, displayName, size = 36 }) {
  const { getAvatarUrl } = useAuth();
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!path) return undefined;
    let cancelled = false;
    getAvatarUrl(path).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [path, getAvatarUrl]);

  const initial = (displayName || '?').trim().charAt(0).toUpperCase();
  const dim = { width: size, height: size };
  if (path && url) {
    return (
      <img
        src={url}
        alt={displayName || 'Avatar'}
        className="sidebar-user-avatar"
        style={dim}
      />
    );
  }
  return (
    <div
      className="sidebar-user-avatar sidebar-user-avatar-fallback"
      style={dim}
      aria-label={displayName || 'Avatar'}
    >
      <span>{initial}</span>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const asideRef = useRef(null);

  const handleNavigate = useCallback(() => {
    if (onMobileClose) onMobileClose();
  }, [onMobileClose]);

  const handleSignOut = async () => {
    handleNavigate();
    await signOut();
    navigate('/');
  };

  // Close drawer on route change (defensive — NavLink clicks call handleNavigate too).
  useEffect(() => {
    if (mobileOpen && onMobileClose) onMobileClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Escape closes the drawer; simple focus trap on mobile.
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onMobileClose?.();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen, onMobileClose]);

  const displayName = profile?.display_name || 'Friend';
  const dietary = profile?.dietary_approach;

  const asideClass = `sidebar${mobileOpen ? ' sidebar-mobile-open' : ''}`;

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}
      <aside
        ref={asideRef}
        className={asideClass}
        aria-label="Primary navigation"
      >
        <div className="sidebar-glow" aria-hidden="true" />

        <div className="sidebar-brand-block">
          <Link
            to="/dashboard"
            className="sidebar-brand"
            onClick={handleNavigate}
          >
            <img
              src="/tkk-logo-transparent.png"
              alt=""
              className="sidebar-logo"
              aria-hidden="true"
            />
            <span className="sidebar-brand-text">The Keto Keep</span>
          </Link>
        </div>

        {profile && (
          <div className="sidebar-user">
            <SidebarAvatar path={profile.avatar_url} displayName={displayName} />
            <div className="sidebar-user-meta">
              <div className="sidebar-user-name">{displayName}</div>
              {dietary && (
                <div className="sidebar-user-diet">
                  <DietaryApproachTag value={dietary} size="sm" />
                </div>
              )}
              {!dietary && (
                <div className="sidebar-user-diet sidebar-user-diet-muted">
                  {dietaryLabel(null) || 'Member'}
                </div>
              )}
            </div>
          </div>
        )}

        <nav className="sidebar-nav" aria-label="Main menu">
          <SidebarSection title="Home">
            <SidebarNavLink
              to="/dashboard"
              icon="🏠"
              label="Dashboard"
              onNavigate={handleNavigate}
            />
          </SidebarSection>

          <SidebarSection title="Community">
            <SidebarNavLink
              to="/forums"
              icon="🏰"
              label="Forums"
              onNavigate={handleNavigate}
            />
            <SidebarNavLink
              to="/events"
              icon="📅"
              label="Events"
              onNavigate={handleNavigate}
            />
            <SidebarNavLink
              to="/members"
              icon="👥"
              label="Members"
              onNavigate={handleNavigate}
            />
          </SidebarSection>

          <SidebarSection title="Learning">
            <SidebarNavLink
              to="/courses"
              icon="📚"
              label="Courses"
              onNavigate={handleNavigate}
            />
          </SidebarSection>

          <SidebarSection title="My Stuff">
            <SidebarNavLink
              to="/profile"
              icon="👤"
              label="My Profile"
              onNavigate={handleNavigate}
              end
            />
            <SidebarNavLink
              to="/invite"
              icon="🔗"
              label="Invite Friends"
              onNavigate={handleNavigate}
            />
          </SidebarSection>

          {isAdmin && (
            <SidebarSection title="Admin">
              <SidebarNavLink
                to="/admin"
                icon="⚙️"
                label="Admin Hub"
                onNavigate={handleNavigate}
                end
              />
              <SidebarNavLink
                to="/admin/tags"
                icon="🏷️"
                label="Interest Tags"
                onNavigate={handleNavigate}
              />
              <SidebarNavLink
                to="/admin/admin-tags"
                icon="🛡️"
                label="Internal Tags"
                onNavigate={handleNavigate}
              />
            </SidebarSection>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-row">
            <NotificationBell />
            <ThemeToggle />
            <button
              type="button"
              className="sidebar-signout"
              onClick={handleSignOut}
              aria-label="Log out"
              title="Log out"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 17l-5-5 5-5M5 12h11M21 3v18" />
              </svg>
            </button>
          </div>
          <div className="sidebar-version">v{pkg.version}</div>
        </div>
      </aside>
    </>
  );
}
