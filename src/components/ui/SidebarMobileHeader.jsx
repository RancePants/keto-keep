import NotificationBell from '../notifications/NotificationBell.jsx';

export default function SidebarMobileHeader({ onOpenSidebar, mobileOpen }) {
  return (
    <header className="sidebar-mobile-header">
      <button
        type="button"
        className="sidebar-mobile-burger"
        onClick={onOpenSidebar}
        aria-label="Open navigation"
        aria-expanded={!!mobileOpen}
      >
        <span className="sidebar-mobile-burger-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <div className="sidebar-mobile-brand" aria-hidden="true">
        <img
          src="/tkk-logo-transparent.png"
          alt=""
          className="sidebar-mobile-logo"
        />
        <span className="sidebar-mobile-brand-text">The Keto Keep</span>
      </div>

      <div className="sidebar-mobile-actions">
        <NotificationBell />
      </div>
    </header>
  );
}
