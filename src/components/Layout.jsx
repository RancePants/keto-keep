import { useCallback, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';
import Sidebar from './ui/Sidebar.jsx';
import SidebarMobileHeader from './ui/SidebarMobileHeader.jsx';
import SuspendedBanner from './SuspendedBanner.jsx';
import pkg from '../../package.json';

const PRE_AUTH_PATHS = new Set([
  '/',
  '/login',
  '/signup',
  '/reset-password',
  '/update-password',
]);

export default function Layout() {
  const { session } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const showSidebar =
    !!session && !PRE_AUTH_PATHS.has(location.pathname);

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
            <span className="version">v{pkg.version}</span>
          </div>
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
            <span className="version">v{pkg.version}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
