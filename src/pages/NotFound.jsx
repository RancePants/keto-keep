import { Link } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';

export default function NotFound() {
  usePageTitle('Page not found');
  return (
    <div className="page page-narrow page-center-text not-found">
      <div className="not-found-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="88" height="88">
          <path
            d="M32 6 8 14v16c0 13 10 22 24 28 14-6 24-15 24-28V14L32 6z"
            fill="currentColor"
            opacity="0.2"
          />
          <path
            d="M32 6 8 14v16c0 13 10 22 24 28 14-6 24-15 24-28V14L32 6z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            d="M32 20v20M22 30h20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h1 className="page-title">This keep is empty</h1>
      <p className="page-sub">
        The page you were looking for isn't here. Perhaps the path has changed,
        or the link is worn by time.
      </p>
      <div className="not-found-actions">
        <Link to="/" className="btn btn-primary">
          Return home
        </Link>
      </div>
    </div>
  );
}
