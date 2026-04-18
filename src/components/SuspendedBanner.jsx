import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/useAuth.js';

const DISMISS_KEY = 'keep:suspendedBannerDismissed';

export default function SuspendedBanner() {
  const { isSuspended } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      try {
        if (sessionStorage.getItem(DISMISS_KEY) === '1') {
          setDismissed(true);
        }
      } catch {
        // ignore storage errors
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isSuspended || dismissed) return null;

  const onDismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // ignore storage errors
    }
    setDismissed(true);
  };

  return (
    <div className="suspended-banner" role="alert">
      <div className="suspended-banner-inner">
        <span className="suspended-banner-icon" aria-hidden="true">⚠</span>
        <div className="suspended-banner-text">
          <strong>Your account is suspended.</strong>{' '}
          You can still read, but posting, replying, RSVPing, and profile edits
          are disabled. Contact a host if you think this is a mistake.
        </div>
        <button
          type="button"
          className="suspended-banner-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss banner"
        >
          ×
        </button>
      </div>
    </div>
  );
}
