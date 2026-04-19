import { Link } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';

export default function Landing() {
  usePageTitle();
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow">A community for metabolic health</p>
          <h1 className="hero-title">The Keto Keep</h1>
          <p className="hero-lede">
            A free, welcoming gathering place for people walking the ancestral path — paleo,
            keto, and carnivore. Real food, real community, real change.
          </p>
          <div className="hero-cta">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Join free
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg">
              Already a member? Log in
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">What you'll find inside</h2>
          <div className="card-grid">
            <div className="card">
              <h3>Free community</h3>
              <p>
                No paywalls, no pressure. Everything that matters for your health journey is
                open to every member.
              </p>
            </div>
            <div className="card">
              <h3>Certified hosts</h3>
              <p>
                Led by NBC-HWC certified health and wellness coaches who practice what they
                teach.
              </p>
            </div>
            <div className="card">
              <h3>Forums &amp; events</h3>
              <p>
                Ongoing conversations, live gatherings, and seasonal challenges to keep you
                grounded and encouraged.
              </p>
            </div>
            <div className="card">
              <h3>Foundational course</h3>
              <p>
                A clear, practical walk-through of ancestral eating — no gimmicks, no
                supplements to sell.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="section-inner">
          <h2 className="section-title">About the hosts</h2>
          <p className="section-lede">
            The Keto Keep is hosted by <strong>Rance Edwards</strong> and{' '}
            <strong>Justine Roberts</strong>, both NBC-HWC certified health and wellness
            coaches who have walked this path themselves and with hundreds of clients.
          </p>
          <div className="hero-cta">
            <Link to="/signup" className="btn btn-primary">
              Join the community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
