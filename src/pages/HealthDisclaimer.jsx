import { Link } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';

export default function HealthDisclaimer() {
  usePageTitle('Health Disclaimer');
  return (
    <div className="legal-page">
      <header className="legal-header">
        <h1 className="legal-title">
          The Keto Keep — Health & Wellness Disclaimer
        </h1>
        <p className="legal-effective-date">
          <strong>Effective Date:</strong> April 19, 2026
          <br />
          <strong>Last Updated:</strong> April 19, 2026
        </p>
      </header>

      <section>
        <h2 className="legal-heading">Important Notice</h2>
        <p>
          The Keto Keep is operated by Full Spectrum Human LLC and is led by
          National Board Certified Health & Wellness Coaches (NBC-HWC). This
          disclaimer applies to all content, discussions, educational
          materials, courses, events, and interactions on the Platform.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">Not Medical Advice</h2>
        <p>
          <strong>
            All content on The Keto Keep is for informational and educational
            purposes only.
          </strong>{' '}
          Nothing on this Platform should be construed as medical advice,
          diagnosis, or treatment. The information shared here — whether by
          our coaches, community members, or in our educational courses — is
          not intended to replace the relationship between you and your
          physician or qualified healthcare provider.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">Our Coaches</h2>
        <p>
          Our hosting coaches hold National Board Certification in Health &
          Wellness Coaching (NBC-HWC) and may hold additional certifications
          in areas such as primal health coaching, personal training,
          nutrition, and functional health. Health & wellness coaches are
          trained to support clients in making sustainable lifestyle changes,
          setting goals, and building healthier habits.
        </p>
        <p>
          <strong>Health & wellness coaches are not:</strong>
        </p>
        <ul className="legal-list">
          <li>Physicians or medical doctors</li>
          <li>Licensed dietitians or registered dietitians (unless separately credentialed)</li>
          <li>Licensed mental health professionals (unless separately credentialed)</li>
          <li>Authorized to diagnose, treat, or prescribe for any medical condition</li>
        </ul>
        <p>
          If any of our coaches hold additional licensure that qualifies them
          to provide services beyond health coaching, those services are
          provided through their separate private practices and are governed
          by their own professional agreements — not by The Keto Keep.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">Your Responsibility</h2>
        <p>
          Before making any changes to your diet, exercise routine,
          supplementation, fasting practices, or lifestyle based on
          information found on this Platform,{' '}
          <strong>
            you should consult with your physician or a qualified healthcare
            professional
          </strong>
          , especially if you:
        </p>
        <ul className="legal-list">
          <li>Have a pre-existing medical condition</li>
          <li>Are taking prescription medications</li>
          <li>Are pregnant, nursing, or planning to become pregnant</li>
          <li>Have a history of disordered eating</li>
          <li>Are under the care of a specialist for any health condition</li>
        </ul>
      </section>

      <section>
        <h2 className="legal-heading">Emergency Situations</h2>
        <p>
          <strong>
            If you are experiencing a medical emergency, call 911 or your
            local emergency number immediately.
          </strong>{' '}
          Do not rely on this Platform for urgent medical guidance.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">Community Content</h2>
        <p>
          The Keto Keep includes forums and community discussions where
          members share their personal experiences, opinions, and strategies.{' '}
          <strong>
            Community member posts represent individual perspectives and are
            not endorsed, verified, or approved by Full Spectrum Human LLC or
            its coaches.
          </strong>{' '}
          What works for one person may not be appropriate for another. Always
          evaluate community advice in consultation with your healthcare
          provider.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">No Guarantees</h2>
        <p>
          Individual results vary. We make no guarantees regarding health
          outcomes, weight loss, disease reversal, or any other health-related
          result from following information shared on this Platform. Health
          and wellness are influenced by many factors beyond diet and
          lifestyle, including genetics, medical history, and individual
          physiology.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">Nutritional Approaches</h2>
        <p>
          The Keto Keep is a community that supports various low-carbohydrate
          and ancestral nutritional approaches, including but not limited to
          ketogenic, paleo, carnivore, and other metabolic health strategies.
          We present these approaches as options within a broader wellness
          framework.{' '}
          <strong>
            The inclusion of these approaches on our Platform does not
            constitute a medical recommendation.
          </strong>{' '}
          Different dietary strategies carry different considerations, and
          what is appropriate for you depends on your individual health
          profile.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">Acceptance</h2>
        <p>
          By using The Keto Keep, you acknowledge that you have read and
          understood this Disclaimer and agree that Full Spectrum Human LLC,
          its coaches, officers, and affiliates are not liable for any health
          outcomes, adverse effects, or damages resulting from your use of
          information found on this Platform.
        </p>
      </section>

      <footer className="legal-footer">
        <p>© 2026 Full Spectrum Human LLC. All rights reserved.</p>
        <p>The Keto Keep™ is a trademark of Full Spectrum Human LLC.</p>
        <p className="legal-nav">
          <Link to="/">← Back to home</Link>
          <span className="legal-nav-sep">·</span>
          <Link to="/terms">Terms of Use</Link>
          <span className="legal-nav-sep">·</span>
          <Link to="/privacy">Privacy Policy</Link>
        </p>
      </footer>
    </div>
  );
}
