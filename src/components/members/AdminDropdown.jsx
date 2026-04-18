import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const LINKS = [
  { to: '/admin', label: 'Admin home' },
  { to: '/members', label: 'Members' },
  { to: '/admin/tags', label: 'Interest tags' },
  { to: '/admin/admin-tags', label: 'Internal tags' },
  { to: '/forums/admin-hq', label: 'Admin HQ' },
];

export default function AdminDropdown({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleLinkClick = () => {
    setOpen(false);
    if (onNavigate) onNavigate();
  };

  return (
    <div className="admin-dropdown" ref={wrapRef}>
      <button
        type="button"
        className="admin-dropdown-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="admin-dropdown-shield" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
        </span>
        Admin
        <span className="admin-dropdown-caret" aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className="admin-dropdown-menu" role="menu">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              role="menuitem"
              className="admin-dropdown-item"
              onClick={handleLinkClick}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
