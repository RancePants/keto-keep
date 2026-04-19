import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../contexts/useAuth.js';
import { formatRelative } from '../../lib/forumHelpers.js';
import { notificationIcon } from '../../lib/notificationHelpers.js';

const POLL_MS = 60_000;
const PAGE_SIZE = 20;

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const wrapRef = useRef(null);

  const loadUnreadCount = useCallback(async () => {
    if (!user?.id) return;
    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('read', false);
    if (error) {
      console.error('Unread count failed:', error.message);
      return;
    }
    setUnreadCount(count || 0);
  }, [user?.id]);

  const loadList = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(PAGE_SIZE);
      if (error) {
        console.error('Notification list failed:', error.message);
        setItems([]);
        return;
      }
      setItems(data || []);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Poll unread count while logged in. The component returns null when
  // there is no user, so this effect only runs for authenticated sessions.
  useEffect(() => {
    if (!user?.id) return undefined;
    let cancelled = false;
    (async () => {
      await loadUnreadCount();
      if (cancelled) return;
    })();
    const id = window.setInterval(loadUnreadCount, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [user?.id, loadUnreadCount]);

  // Click-outside + Escape dismiss.
  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      await loadList();
    }
  };

  const markAllRead = async () => {
    if (marking || unreadCount === 0) return;
    setMarking(true);
    try {
      const { error } = await supabase.rpc('mark_all_notifications_read');
      if (error) {
        console.error('Mark all read failed:', error.message);
        return;
      }
      setUnreadCount(0);
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    } finally {
      setMarking(false);
    }
  };

  const handleClickItem = async (n) => {
    if (!n.read) {
      // Optimistic update; let the server reconcile via the next poll.
      setItems((prev) => prev.map((it) => (it.id === n.id ? { ...it, read: true } : it)));
      setUnreadCount((c) => Math.max(0, c - 1));
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', n.id);
      if (error) {
        console.error('Mark read failed:', error.message);
      }
    }
    setOpen(false);
    if (n.link) {
      navigate(n.link);
    }
  };

  if (!user?.id) return null;

  return (
    <div className="notif-bell" ref={wrapRef}>
      <button
        type="button"
        className="notif-bell-trigger"
        aria-label={
          unreadCount > 0
            ? `Notifications (${unreadCount} unread)`
            : 'Notifications'
        }
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M12 3a6 6 0 0 0-6 6v3.6L4 16h16l-2-3.4V9a6 6 0 0 0-6-6zM10 19a2 2 0 0 0 4 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="notif-bell-badge" aria-hidden="true">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown" role="menu">
          <div className="notif-dropdown-head">
            <span className="notif-dropdown-title">Notifications</span>
            <button
              type="button"
              className="notif-mark-all"
              onClick={markAllRead}
              disabled={marking || unreadCount === 0}
            >
              {marking ? '…' : 'Mark all read'}
            </button>
          </div>

          <div className="notif-dropdown-list">
            {loading && items.length === 0 ? (
              <div className="notif-empty">Loading…</div>
            ) : items.length === 0 ? (
              <div className="notif-empty">No notifications yet</div>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={`notif-row ${n.read ? '' : 'notif-row-unread'}`}
                  onClick={() => handleClickItem(n)}
                  role="menuitem"
                >
                  <span className="notif-row-icon" aria-hidden="true">
                    {notificationIcon(n)}
                  </span>
                  <span className="notif-row-body">
                    <span className="notif-row-title">{n.title}</span>
                    <span className="notif-row-time">{formatRelative(n.created_at)}</span>
                  </span>
                  {!n.read && <span className="notif-row-dot" aria-hidden="true" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
