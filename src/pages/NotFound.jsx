import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page page-narrow page-center-text">
      <h1 className="page-title">Page not found</h1>
      <p className="page-sub">We couldn't find what you were looking for.</p>
      <Link to="/" className="btn btn-primary">
        Back home
      </Link>
    </div>
  );
}
