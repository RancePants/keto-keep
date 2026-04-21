import HonorIcon from './HonorIcon.jsx';
import { BADGE_TYPE_LABEL } from '../../lib/profileHelpers.js';

// A compact row of tiny honor PNGs, intended to sit next to a
// member's name on forum posts or event attendee chips. Truncates at
// `limit` and shows a "+N" pill when there are more. The overflow
// pill's tooltip lists the names of hidden honors.
export default function BadgesInline({ badges, limit = 5, size = 16 }) {
  if (!badges || badges.length === 0) return null;
  const shown = badges.slice(0, limit);
  const hiddenBadges = badges.slice(limit);
  const hidden = hiddenBadges.length;
  const hiddenTitle = hidden > 0
    ? hiddenBadges
        .map((b) => b.name || BADGE_TYPE_LABEL[b.badge_type] || b.badge_type)
        .filter(Boolean)
        .join(', ')
    : '';
  return (
    <span className="badges-inline">
      {shown.map((b) => (
        <HonorIcon
          key={b.badge_type || b.id}
          badgeType={b.badge_type}
          size={size}
          title={b.name || BADGE_TYPE_LABEL[b.badge_type]}
        />
      ))}
      {hidden > 0 && (
        <span className="badges-inline-more" title={hiddenTitle}>+{hidden}</span>
      )}
    </span>
  );
}
