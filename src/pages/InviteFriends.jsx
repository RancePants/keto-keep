import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';
import { useToast } from '../components/ui/toastContext.js';
import {
  buildInviteUrl,
  ensureMyCode,
  getMyReferrals,
} from '../lib/referralHelpers.js';
import { supabase } from '../lib/supabase.js';
import { checkAndAwardHonors } from '../lib/honorHelpers.js';
import usePageTitle from '../lib/usePageTitle.js';

function ReferredAvatar({ path, displayName }) {
  const { getAvatarUrl } = useAuth();
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!path) return undefined;
    let cancelled = false;
    getAvatarUrl(path).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [path, getAvatarUrl]);
  const initial = (displayName || '?').trim().charAt(0).toUpperCase();
  const dim = { width: 36, height: 36 };
  if (path && url) {
    return <img src={url} alt="" className="sidebar-user-avatar" style={dim} />;
  }
  return (
    <div
      className="sidebar-user-avatar sidebar-user-avatar-fallback"
      style={dim}
      aria-hidden="true"
    >
      <span>{initial}</span>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function InviteFriends() {
  usePageTitle('Invite friends');
  const toast = useToast();
  const { user, isSuspended } = useAuth();

  const [code, setCode] = useState(null);
  const [loadingCode, setLoadingCode] = useState(true);
  const [codeError, setCodeError] = useState(null);

  const [referrals, setReferrals] = useState([]);
  const [loadingRefs, setLoadingRefs] = useState(true);

  const inviteUrl = code ? buildInviteUrl(code) : '';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (isSuspended) {
        if (!cancelled) setLoadingCode(false);
        return;
      }
      const { code: c, error } = await ensureMyCode();
      if (cancelled) return;
      if (error) {
        setCodeError(error.message || 'Could not prepare your invite code.');
      } else {
        setCode(c);
      }
      setLoadingCode(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [isSuspended]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { referrals: list } = await getMyReferrals();
      if (cancelled) return;
      setReferrals(list);
      setLoadingRefs(false);
      if (user?.id && list.length > 0) {
        checkAndAwardHonors(supabase, user.id, 'referral');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const onCopy = useCallback(async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success('Invite link copied.');
    } catch {
      toast.error('Could not copy. Select the link and copy manually.');
    }
  }, [inviteUrl, toast]);

  const onShare = useCallback(async () => {
    if (!inviteUrl) return;
    const shareData = {
      title: 'Join me on The Keto Keep',
      text: 'I thought you might like this — a free community for low-carb + ancestral health.',
      url: inviteUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user dismissed — no-op
      }
    } else {
      await onCopy();
    }
  }, [inviteUrl, onCopy]);

  return (
    <div className="page page-narrow">
      <header className="page-header">
        <h1 className="page-title">Invite friends</h1>
        <p className="page-sub">
          Bring someone you love into The Keep. Free, no ads, no noise.
        </p>
      </header>

      {isSuspended ? (
        <section className="panel">
          <p className="muted">
            Invites are disabled while your account is suspended. Reach out to a
            host if you think this is a mistake.
          </p>
        </section>
      ) : (
        <>
          <section className="panel">
            <h2 className="panel-title">Your invite link</h2>
            {loadingCode ? (
              <p className="muted">Preparing your link…</p>
            ) : codeError ? (
              <p className="form-error" role="alert">
                {codeError}
              </p>
            ) : (
              <>
                <div className="invite-link-row">
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="invite-link-input"
                    onFocus={(e) => e.target.select()}
                    aria-label="Your invite link"
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onCopy}
                  >
                    Copy link
                  </button>
                </div>
                <div className="invite-actions">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={onShare}
                  >
                    Share…
                  </button>
                  <span className="muted invite-code-chip">
                    Code: <strong>{code}</strong>
                  </span>
                </div>
              </>
            )}
          </section>

          <section className="panel">
            <h2 className="panel-title">
              {loadingRefs
                ? 'Your invites'
                : `You've invited ${referrals.length} ${
                    referrals.length === 1 ? 'person' : 'people'
                  }`}
            </h2>
            {loadingRefs ? (
              <p className="muted">Loading…</p>
            ) : referrals.length === 0 ? (
              <p className="muted">
                No invites yet. Share your link above and we'll show your friends here when they join.
              </p>
            ) : (
              <ul className="invite-list">
                {referrals.map((r) => (
                  <li key={r.id} className="invite-list-item">
                    <Link
                      to={`/profile/${r.referred_id}`}
                      className="invite-list-link"
                    >
                      <ReferredAvatar
                        path={r.avatar_url}
                        displayName={r.display_name}
                      />
                      <div className="invite-list-meta">
                        <div className="invite-list-name">
                          {r.display_name}
                        </div>
                        <div className="invite-list-date muted">
                          Joined {formatDate(r.created_at)}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
