import BadgeIcon from './BadgeIcon.jsx';
import { BADGE_TYPE_LABEL } from '../../lib/profileHelpers.js';

// A compact row of tiny badge shields, intended to sit next to a
// member's name on forum posts or event attendee chips. Truncates at
// `limit` and shows a "+N" pill when there are more.
export default function BadgesInline({ badges, limit = 3, size = 14 }) {
  if (!badges || badges.length === 0) return null;
  const shown = badges.slice(0, limit);
  const hidden = badges.length - shown.length;
  return (
    <span className="badges-inline">
      {shown.map((b) => (
        <BadgeIcon
          key={b.badge_type || b.id}
          badgeType={b.badge_type}
          size={size}
          title={b.name || BADGE_TYPE_LABEL[b.badge_type]}
        />
      ))}
      {hidden > 0 && <span className="badges-inline-more">+{hidden}</span>}
    </span>
  );
}
