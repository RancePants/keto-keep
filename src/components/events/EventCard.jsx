import { Link } from 'react-router-dom';
import EventTypeBadge from './EventTypeBadge.jsx';
import RsvpControls from './RsvpControls.jsx';
import {
  formatEventDate,
  formatEventTime,
  formatEventRange,
} from '../../lib/eventHelpers.js';

export default function EventCard({
  event,
  rsvps,
  myRsvp,
  onRsvpChange,
  onAdminEdit,
  isAdmin,
}) {
  const attendingCount = (rsvps || []).filter((r) => r.rsvp_status === 'attending').length;
  const maybeCount = (rsvps || []).filter((r) => r.rsvp_status === 'maybe').length;

  return (
    <article className={`event-card event-card-${event.status}`}>
      <header className="event-card-header">
        <div className="event-card-when">
          <div className="event-card-date">{formatEventDate(event.start_time)}</div>
          <div className="event-card-time">{formatEventTime(event.start_time)}</div>
        </div>
        <div className="event-card-head">
          <div className="event-card-badges">
            <EventTypeBadge type={event.event_type} />
            {event.status === 'live' && (
              <span className="event-status-badge event-status-live">● Live now</span>
            )}
            {event.status === 'cancelled' && (
              <span className="event-status-badge event-status-cancelled">Cancelled</span>
            )}
          </div>
          <h3 className="event-card-title">
            <Link to={`/events/${event.id}`}>{event.title}</Link>
          </h3>
          <div className="event-card-meta">
            {formatEventRange(event.start_time, event.end_time)}
          </div>
        </div>
        {isAdmin && (
          <button
            type="button"
            className="icon-btn event-card-edit"
            onClick={() => onAdminEdit?.(event)}
            aria-label="Edit event"
          >
            ✎ Edit
          </button>
        )}
      </header>

      {event.description && (
        <p className="event-card-desc">{truncate(event.description, 200)}</p>
      )}

      <footer className="event-card-footer">
        <div className="event-attendee-count">
          <span className="event-attendee-emoji" aria-hidden="true">
            👥
          </span>
          <span>
            {attendingCount} going
            {maybeCount > 0 && ` · ${maybeCount} maybe`}
          </span>
        </div>
        <RsvpControls
          eventId={event.id}
          currentStatus={myRsvp?.rsvp_status || null}
          onChange={(status) => onRsvpChange?.(event.id, status)}
          size="sm"
        />
      </footer>
    </article>
  );
}

function truncate(text, n) {
  if (!text) return '';
  if (text.length <= n) return text;
  return text.slice(0, n).trimEnd() + '…';
}
