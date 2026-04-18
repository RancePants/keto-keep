import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import SuspendedBanner from './SuspendedBanner.jsx';
import pkg from '../../package.json';

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <SuspendedBanner />
      <main className="app-main">
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
