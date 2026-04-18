import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [done, setDone] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (password !== confirm) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setMessage({ type: 'error', text: error.message || 'Could not update password.' });
      } else {
        setDone(true);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Could not update password.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Set new password</h1>
        {done ? (
          <>
            <p className="auth-sub">
              Your password has been updated. You can now log in with your new password.
            </p>
            <Link to="/login" className="btn btn-primary btn-block">
              Go to log in
            </Link>
          </>
        ) : (
          <>
            <p className="auth-sub">Choose a strong password for your account.</p>
            <form onSubmit={onSubmit} className="form" noValidate>
              <label className="field">
                <span className="field-label">New password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <label className="field">
                <span className="field-label">Confirm new password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </label>
              {message && (
                <div
                  className={message.type === 'error' ? 'form-error' : 'form-success'}
                  role={message.type === 'error' ? 'alert' : 'status'}
                >
                  {message.text}
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting}
              >
                {submitting ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
