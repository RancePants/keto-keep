import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await resetPassword({ email });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Reset your password</h1>
        {submitted ? (
          <>
            <p className="auth-sub">
              If an account exists for <strong>{email}</strong>, you'll receive an email
              with instructions shortly.
            </p>
            <Link to="/login" className="btn btn-primary btn-block">
              Back to log in
            </Link>
          </>
        ) : (
          <>
            <p className="auth-sub">
              Enter the email you signed up with and we'll send you a reset link.
            </p>
            <form onSubmit={onSubmit} className="form" noValidate>
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
              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
            <div className="auth-links">
              <Link to="/login">Back to log in</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
