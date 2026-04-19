import { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';
import { recordReferral } from '../lib/referralHelpers.js';
import usePageTitle from '../lib/usePageTitle.js';

const REF_STORAGE_KEY = 'tkk-pending-ref';

export default function Signup() {
  usePageTitle('Join free');
  const { session, signUp, loading } = useAuth();
  const [params] = useSearchParams();

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Lazy init: read ref code from ?ref= (and persist to localStorage so it
  // survives the email-confirmation round trip), falling back to a previously
  // stored value.
  const [refCode] = useState(() => {
    const fromUrl = (params.get('ref') || '').trim();
    if (fromUrl) {
      try {
        localStorage.setItem(REF_STORAGE_KEY, fromUrl);
      } catch {
        // localStorage may be blocked; we'll still try to use the in-memory value.
      }
      return fromUrl;
    }
    try {
      return localStorage.getItem(REF_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  // If the user is already signed in when this page renders (e.g. auto-confirm
  // flow), and we have a pending ref code, record it now then redirect.
  useEffect(() => {
    if (loading || !session?.user) return;
    const pending = (() => {
      try {
        return localStorage.getItem(REF_STORAGE_KEY) || '';
      } catch {
        return '';
      }
    })();
    if (!pending) return;
    (async () => {
      await recordReferral(session.user.id, pending);
      try {
        localStorage.removeItem(REF_STORAGE_KEY);
      } catch {
        // ignore
      }
    })();
  }, [loading, session]);

  if (!loading && session) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = () => {
    if (!email) return 'Please enter your email.';
    if (!displayName.trim()) return 'Please enter a display name.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirm) return 'Passwords do not match.';
    if (!agreed) return 'Please agree to the Terms of Use and Privacy Policy to continue.';
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSubmitting(true);
    const { data, error: err } = await signUp({
      email,
      password,
      displayName: displayName.trim(),
    });
    setSubmitting(false);
    if (err) {
      setError(err.message || 'Unable to sign up.');
      return;
    }

    // Best-effort referral record. Works for auto-confirm flows where a
    // session is already present; otherwise we'll record on the first
    // authenticated render (see effect above).
    const newUserId = data?.user?.id;
    if (newUserId && refCode) {
      await recordReferral(newUserId, refCode).catch(() => {});
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Check your email</h1>
          <p className="auth-sub">
            We sent a confirmation link to <strong>{email}</strong>. Click the link to finish
            creating your account, then log in.
          </p>
          <Link to="/login" className="btn btn-primary btn-block">
            Back to log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Join The Keto Keep</h1>
        <p className="auth-sub">Create your free account. No credit card, ever.</p>

        {refCode && (
          <div className="auth-ref-chip" role="status">
            You were invited with code <strong>{refCode}</strong>.
          </div>
        )}

        <form onSubmit={onSubmit} className="form" noValidate>
          <label className="field">
            <span className="field-label">Display name</span>
            <input
              type="text"
              autoComplete="nickname"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field-label">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="field-hint">At least 6 characters.</span>
          </label>

          <label className="field">
            <span className="field-label">Confirm password</span>
            <input
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </label>

          <label className="field field-checkbox">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              I agree to the{' '}
              <Link to="/terms" target="_blank" rel="noopener noreferrer">
                Terms of Use
              </Link>{' '}
              and{' '}
              <Link to="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {error && <div className="form-error" role="alert">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={submitting || !agreed}
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="auth-links">
          <span>
            Already have an account? <Link to="/login">Log in</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
