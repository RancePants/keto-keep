import { getCurrentMilestone, milestoneByKey } from '../../lib/streakHelpers.js';

const SIZE_PX = { sm: 20, md: 32, lg: 48 };

// Color tokens — keep in sync with the build plan's palette. Each tier uses
// two stops (highlight + shadow) plus an accent for the flame/gem.
const PALETTES = {
  bronze: { metal: '#cd7f32', shadow: '#7a4a1d', flame: '#f4a14a' },
  silver: { metal: '#d8d8d8', shadow: '#888888', flame: '#ffd08a' },
  gold:   { metal: '#daa520', shadow: '#8a6508', flame: '#fff2a8' },
  royal:  { metal: '#daa520', shadow: '#8a6508', flame: '#ffd8e7' },
};

function Torch({ palette }) {
  // viewBox 0..24 — simple cup + flame silhouette.
  return (
    <g>
      {/* flame */}
      <path
        d="M12 3 C14.5 6.2 16 8 16 10.5 C16 12.98 14.2 14.5 12 14.5 C9.8 14.5 8 12.98 8 10.5 C8 8 9.5 6.2 12 3 Z"
        fill={palette.flame}
      />
      <path
        d="M12 6 C13.3 8 14 9.1 14 10.5 C14 11.88 13.1 12.7 12 12.7 C10.9 12.7 10 11.88 10 10.5 C10 9.1 10.7 8 12 6 Z"
        fill="#fff7cc"
        opacity="0.85"
      />
      {/* cup */}
      <path
        d="M7.5 13.5 L16.5 13.5 L15.5 17 L8.5 17 Z"
        fill={palette.metal}
        stroke={palette.shadow}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {/* handle / stem */}
      <rect
        x="10.5"
        y="17"
        width="3"
        height="4.5"
        rx="0.4"
        fill={palette.metal}
        stroke={palette.shadow}
        strokeWidth="0.6"
      />
      <rect x="9.5" y="21.2" width="5" height="1.4" rx="0.4" fill={palette.shadow} />
    </g>
  );
}

function Shield({ palette, withFlame }) {
  return (
    <g>
      {/* shield body */}
      <path
        d="M12 2 L20 4.5 L20 12 C20 17 16 20.5 12 22 C8 20.5 4 17 4 12 L4 4.5 Z"
        fill={palette.metal}
        stroke={palette.shadow}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      {/* inner bevel */}
      <path
        d="M12 4 L18 5.8 L18 12 C18 15.8 15 18.6 12 19.8 C9 18.6 6 15.8 6 12 L6 5.8 Z"
        fill="none"
        stroke={palette.shadow}
        strokeWidth="0.5"
        opacity="0.5"
      />
      {withFlame && (
        <g>
          <path
            d="M12 7.5 C13.7 9.4 14.6 10.6 14.6 12 C14.6 13.55 13.4 14.6 12 14.6 C10.6 14.6 9.4 13.55 9.4 12 C9.4 10.6 10.3 9.4 12 7.5 Z"
            fill={palette.flame}
          />
          <path
            d="M12 9.2 C12.9 10.3 13.3 10.9 13.3 11.7 C13.3 12.5 12.7 13 12 13 C11.3 13 10.7 12.5 10.7 11.7 C10.7 10.9 11.1 10.3 12 9.2 Z"
            fill="#fff7cc"
            opacity="0.9"
          />
        </g>
      )}
    </g>
  );
}

function Crown({ palette }) {
  return (
    <g>
      {/* base band */}
      <rect
        x="3.5"
        y="15.5"
        width="17"
        height="4"
        rx="0.8"
        fill={palette.metal}
        stroke={palette.shadow}
        strokeWidth="0.8"
      />
      {/* inner shimmer line */}
      <line x1="4.5" y1="17.3" x2="19.5" y2="17.3" stroke="#fff3b0" strokeWidth="0.5" opacity="0.7" />
      {/* five spires */}
      <path
        d="M3.5 15.5 L5 8 L8 13 L12 6 L16 13 L19 8 L20.5 15.5 Z"
        fill={palette.metal}
        stroke={palette.shadow}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {/* gems on spires */}
      <circle cx="5" cy="8" r="0.9" fill="#e74c3c" stroke={palette.shadow} strokeWidth="0.25" />
      <circle cx="12" cy="6" r="1.2" fill="#3498db" stroke={palette.shadow} strokeWidth="0.3" />
      <circle cx="19" cy="8" r="0.9" fill="#2ecc71" stroke={palette.shadow} strokeWidth="0.25" />
      {/* base gem */}
      <circle cx="12" cy="17.5" r="0.85" fill="#e74c3c" stroke={palette.shadow} strokeWidth="0.25" />
    </g>
  );
}

function MilestoneArt({ milestoneKey }) {
  switch (milestoneKey) {
    case 'first_week':   return <Torch palette={PALETTES.bronze} />;
    case 'two_weeks':    return <Torch palette={PALETTES.silver} />;
    case 'one_month':    return <Torch palette={PALETTES.gold} />;
    case 'two_months':   return <Shield palette={PALETTES.bronze} withFlame />;
    case 'three_months': return <Shield palette={PALETTES.silver} withFlame />;
    case 'half_year':    return <Shield palette={PALETTES.gold} withFlame />;
    case 'full_year':    return <Crown palette={PALETTES.royal} />;
    default:             return null;
  }
}

function SmallFlame({ size }) {
  // Shown for 1-6 day streaks — a simple flame, no milestone art.
  return (
    <svg
      className="streak-badge streak-badge-flame"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
    >
      <path
        d="M12 2 C14.8 5.4 17 8.2 17 11.6 C17 15 14.8 17.5 12 17.5 C9.2 17.5 7 15 7 11.6 C7 8.2 9.2 5.4 12 2 Z"
        fill="#f08a2e"
      />
      <path
        d="M12 6.5 C13.6 8.6 14.6 10 14.6 11.9 C14.6 13.6 13.5 14.8 12 14.8 C10.5 14.8 9.4 13.6 9.4 11.9 C9.4 10 10.4 8.6 12 6.5 Z"
        fill="#ffce5c"
      />
    </svg>
  );
}

/**
 * StreakBadge — renders the milestone badge for a given streak.
 * Props:
 *   - streak: integer current streak (required)
 *   - size: 'sm' | 'md' | 'lg' (default 'sm')
 *   - milestoneKey: optional override (for catalog previews / toasts)
 *   - showCount: when true, renders "🔥 N" text next to the badge
 *   - title: optional custom tooltip (defaults to milestone name + day count)
 */
export default function StreakBadge({
  streak = 0,
  size = 'sm',
  milestoneKey,
  showCount = false,
  title,
  className,
}) {
  const dim = SIZE_PX[size] || SIZE_PX.sm;
  const s = Number(streak) || 0;
  const m = milestoneKey ? milestoneByKey(milestoneKey) : getCurrentMilestone(s);

  if (!m) {
    // Below first milestone — show flame for 1-6 day streaks only
    if (s <= 0 && !milestoneKey) return null;
    const label = s > 0 ? `🔥 ${s} day streak` : 'No streak yet';
    return (
      <span className={`streak-badge-wrap streak-badge-wrap-${size}${className ? ' ' + className : ''}`} title={title || label}>
        <SmallFlame size={dim} />
        {showCount && <span className="streak-badge-count">{s}</span>}
      </span>
    );
  }

  const tooltip = title || `${m.name} — ${s || m.days} day streak`;

  return (
    <span
      className={`streak-badge-wrap streak-badge-wrap-${size} streak-badge-${m.key}${className ? ' ' + className : ''}`}
      title={tooltip}
      aria-label={tooltip}
    >
      <svg
        className={`streak-badge streak-badge-${m.key}`}
        width={dim}
        height={dim}
        viewBox="0 0 24 24"
        role="img"
        aria-hidden="true"
      >
        <MilestoneArt milestoneKey={m.key} />
      </svg>
      {showCount && <span className="streak-badge-count">{s}</span>}
    </span>
  );
}
