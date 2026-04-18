import { dietaryLabel, dietaryPaletteClass } from '../../lib/profileHelpers.js';

// Small subtle pill showing a member's primary dietary approach.
// size: 'sm' (default) for inline next to names, 'md' for profile display.
export default function DietaryApproachTag({ value, size = 'sm', className = '' }) {
  if (!value) return null;
  const label = dietaryLabel(value);
  if (!label) return null;
  const palette = dietaryPaletteClass(value);
  const classes = ['dietary-tag', `dietary-tag-${size}`, palette, className]
    .filter(Boolean)
    .join(' ');
  return <span className={classes} title={`Primary approach: ${label}`}>{label}</span>;
}
