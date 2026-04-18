import { BADGE_TYPE_LABEL } from '../../lib/profileHelpers.js';

// Shield silhouette with a glyph inside, keyed by badge_type. Renders
// as an inline SVG so it scales and recolors via CSS without images.
// size in px (default 16 for inline, 28 for profile display).
const GLYPHS = {
  course_complete:  // check inside the shield
    <path d="M7 12.5l3 3 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  tenure_1_month:   // roman I
    <path d="M12 7v10M10 7h4M10 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />,
  tenure_6_months:  // roman VI
    <path d="M7.5 7l2.3 7 2.2-7M14 10v5M15.3 8.5a1.3 1.3 0 10-2.6 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  tenure_1_year:    // roman X
    <path d="M8 7l8 10M16 7l-8 10" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" fill="none" />,
  coach_spotlight:  // star
    <path d="M12 6.5l1.7 3.5 3.8.5-2.8 2.6.7 3.8-3.4-1.9-3.4 1.9.7-3.8L6.5 10.5l3.8-.5L12 6.5z" fill="currentColor" />,
};

export default function BadgeIcon({ badgeType, size = 16, title, className = '' }) {
  const glyph = GLYPHS[badgeType] || null;
  const label = title || BADGE_TYPE_LABEL[badgeType] || 'Badge';
  const classes = ['badge-icon', `badge-${badgeType}`, className].filter(Boolean).join(' ');
  return (
    <span className={classes} title={label} aria-label={label}>
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        {/* Shield silhouette — matches the navbar brand mark */}
        <path
          d="M12 2.5 4.5 5v6.2c0 4.9 3.3 8.6 7.5 10.3 4.2-1.7 7.5-5.4 7.5-10.3V5L12 2.5z"
          fill="currentColor"
          opacity="0.16"
        />
        <path
          d="M12 2.5 4.5 5v6.2c0 4.9 3.3 8.6 7.5 10.3 4.2-1.7 7.5-5.4 7.5-10.3V5L12 2.5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.7"
        />
        {glyph}
      </svg>
    </span>
  );
}
