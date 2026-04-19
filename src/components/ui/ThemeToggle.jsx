import { useAuth } from '../../contexts/useAuth.js';

function iconFor(theme) {
  if (theme === 'dark') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  }
  if (theme === 'light') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M8 20h8M12 18v2" />
    </svg>
  );
}

function labelFor(theme) {
  if (theme === 'dark') return 'Dark theme';
  if (theme === 'light') return 'Light theme';
  return 'System theme';
}

export default function ThemeToggle() {
  const { profile, setTheme } = useAuth();
  const current = profile?.theme_preference || 'system';

  const cycle = () => {
    const next = current === 'system' ? 'light' : current === 'light' ? 'dark' : 'system';
    setTheme?.(next);
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={cycle}
      aria-label={`Switch theme — current: ${labelFor(current)}`}
      title={labelFor(current)}
    >
      {iconFor(current)}
    </button>
  );
}
