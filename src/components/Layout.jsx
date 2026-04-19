import { useCallback, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';
import Sidebar from './ui/Sidebar.jsx';
import SidebarMobileHeader from './ui/SidebarMobileHeader.jsx';
import SuspendedBanner from './SuspendedBanner.jsx';
import pkg from '../../package.json';

// Paths that render with no sidebar — public marketing + legal pages, and
// pre-auth routes.
const NO_SIDEBAR_PATHS = new Set([
  '/',
  '/login',
  '/signup',
  '/reset-password',
  '/update-password',
  '/terms',
  '/privacy',
  '/disclaimer',
]);

function FooterLegalLinks() {
  return (
    <span className="footer-legal-links">
      <Link to="/terms">Terms</Link>
      <span className="footer-sep">·</span>
      <Link to="/privacy">Privacy</Link>
      <span className="footer-sep">·</span>
      <Link to="/disclaimer">Disclaimer</Link>
    </span>
  );
}

export default function Layout() {
  const { session } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const showSidebar =
    !!session && !NO_SIDEBAR_PATHS.has(location.pathname);

  if (!showSidebar) {
    return (
      <div className="app-shell">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SuspendedBanner />
        <main id="main-content" className="app-main" tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="app-footer">
          <div className="footer-inner">
            <span>© 2026 The Keto Keep</span>
            <span className="footer-sep">·</span>
            <FooterLegalLinks />
            <span className="footer-sep">·</span>
            <span className="version">v{pkg.version}</span>
          </div>
          <span className="footer-trademark">
            The Keto Keep™ is a trademark of Full Spectrum Human LLC.
          </span>
        </footer>
      </div>
    );
  }

  return (
    <div className={`app-layout${mobileOpen ? ' app-layout-drawer-open' : ''}`}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={closeMobile} />
      <div className="app-main-wrap">
        <SidebarMobileHeader onOpenSidebar={openMobile} mobileOpen={mobileOpen} />
        <SuspendedBanner />
        <main id="main-content" className="app-main" tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="app-main-footer">
          <div className="footer-inner">
            <span>© 2026 The Keto Keep</span>
            <span className="footer-sep">·</span>
            <FooterLegalLinks />
            <span className="footer-sep">·</span>
            <span className="version">v{pkg.version}</span>
          </div>
          <span className="footer-trademark">
            The Keto Keep™ is a trademark of Full Spectrum Human LLC.
          </span>
        </footer>
      </div>
    </div>
  );
}
