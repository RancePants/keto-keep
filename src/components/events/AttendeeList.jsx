import { Link } from 'react-router-dom';
import UserAvatar from '../forum/UserAvatar.jsx';

export default function AttendeeList({ rsvps, profiles, limit = null }) {
  const attending = (rsvps || []).filter((r) => r.rsvp_status === 'attending');
  const maybe = (rsvps || []).filter((r) => r.rsvp_status === 'maybe');

  if (attending.length === 0 && maybe.length === 0) {
    return (
      <div className="attendee-empty">
        No RSVPs yet — be the first to tap "I'm in."
      </div>
    );
  }

  const renderList = (items, label) => {
    if (items.length === 0) return null;
    const shown = limit ? items.slice(0, limit) : items;
    const hidden = limit ? items.length - shown.length : 0;
    return (
      <div className="attendee-group">
        <div className="attendee-group-label">
          {label} <span className="attendee-count">({items.length})</span>
        </div>
        <ul className="attendee-list">
          {shown.map((r) => {
            const profile = profiles?.[r.user_id];
            const name = profile?.display_name || 'Member';
            return (
              <li key={r.user_id} className="attendee-chip">
                <UserAvatar author={profile} size="xs" />
                {profile?.id ? (
                  <Link to={`/profile/${profile.id}`} className="attendee-name">
                    {name}
                  </Link>
                ) : (
                  <span className="attendee-name">{name}</span>
                )}
              </li>
            );
          })}
          {hidden > 0 && (
            <li className="attendee-more">+ {hidden} more</li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <div className="attendee-panel">
      {renderList(attending, 'Going')}
      {renderList(maybe, 'Maybe')}
    </div>
  );
}
