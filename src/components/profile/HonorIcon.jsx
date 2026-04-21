import { useState } from 'react';
import { BADGE_TYPE_LABEL, badgeTypeSlug } from '../../lib/profileHelpers.js';

// Renders a PNG honor from /public/honors/. Slug = badgeType with
// underscores replaced by hyphens. Falls back to a shield silhouette
// if the image fails to load.
export default function HonorIcon({ badgeType, size = 24, title, className = '', locked = false }) {
  const [failed, setFailed] = useState(false);
  const slug = badgeTypeSlug(badgeType);
  const label = title || BADGE_TYPE_LABEL[badgeType] || 'Honor';
  const classes = ['honor-icon', locked ? 'honor-icon-locked' : '', className].filter(Boolean).join(' ');

  if (failed || !slug) {
    return (
      <span
        className={classes}
        title={label}
        aria-label={label}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
          <path
            d="M12 2.5 4.5 5v6.2c0 4.9 3.3 8.6 7.5 10.3 4.2-1.7 7.5-5.4 7.5-10.3V5L12 2.5z"
            fill="currentColor"
            opacity="0.2"
          />
          <path
            d="M12 2.5 4.5 5v6.2c0 4.9 3.3 8.6 7.5 10.3 4.2-1.7 7.5-5.4 7.5-10.3V5L12 2.5z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            opacity="0.7"
          />
        </svg>
      </span>
    );
  }

  return (
    <img
      src={`/honors/honor-${slug}.png`}
      alt={label}
      title={label}
      width={size}
      height={size}
      className={classes}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
      draggable={false}
    />
  );
}
