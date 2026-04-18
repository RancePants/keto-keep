import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js';
import EventTypeBadge from './EventTypeBadge.jsx';
import { formatEventDateTime } from '../../lib/eventHelpers.js';

export default function UpcomingEventsCard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from('events')
        .select('id, title, event_type, start_time, end_time, status')
        .in('status', ['scheduled', 'live'])
        .gte('start_time', nowIso)
        .order('start_time', { ascending: true })
        .limit(2);
      if (cancelled) return;
      if (error) {
        console.error('Load upcoming events failed:', error.message);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="panel upcoming-events-card">
      <div className="upcoming-events-header">
        <h2 className="panel-title">Upcoming events</h2>
        <Link to="/events" className="upcoming-events-all">
          See all →
        </Link>
      </div>
      {loading ? (
        <div className="upcoming-events-loading">Loading…</div>
      ) : events.length === 0 ? (
        <p className="muted">No events on the calendar yet.</p>
      ) : (
        <ul className="upcoming-events-list">
          {events.map((ev) => (
            <li key={ev.id} className="upcoming-event-item">
              <Link to={`/events/${ev.id}`} className="upcoming-event-link">
                <div className="upcoming-event-main">
                  <div className="upcoming-event-title">{ev.title}</div>
                  <div className="upcoming-event-when">
                    {formatEventDateTime(ev.start_time)}
                  </div>
                </div>
                <EventTypeBadge type={ev.event_type} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
