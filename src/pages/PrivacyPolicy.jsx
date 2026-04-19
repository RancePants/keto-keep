import { Link } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';

export default function PrivacyPolicy() {
  usePageTitle('Privacy Policy');
  return (
    <div className="legal-page">
      <header className="legal-header">
        <h1 className="legal-title">The Keto Keep — Privacy Policy</h1>
        <p className="legal-effective-date">
          <strong>Effective Date:</strong> April 19, 2026
          <br />
          <strong>Last Updated:</strong> April 19, 2026
        </p>
      </header>

      <section>
        <h2 className="legal-heading">1. Introduction</h2>
        <p>
          Full Spectrum Human LLC ("we," "us," or "our") operates The Keto
          Keep ("the Platform"). This Privacy Policy explains how we collect,
          use, store, and protect your personal information when you use our
          Platform.
        </p>
        <p>
          We are committed to protecting your privacy and handling your data
          transparently. By using the Platform, you agree to the practices
          described in this policy.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">2. Information We Collect</h2>

        <h3 className="legal-subheading">Information You Provide</h3>
        <ul className="legal-list">
          <li>
            <strong>Account information:</strong> Email address, display name,
            and password (password is hashed and never stored in plain text)
          </li>
          <li>
            <strong>Profile information:</strong> Biography, avatar photo,
            city, state, dietary approach, journey duration, personal wellness
            goals ("About Me" and "My Why" fields), and interest tags you
            select
          </li>
          <li>
            <strong>Content you create:</strong> Forum posts, replies, emoji
            reactions, event RSVPs, and course progress
          </li>
          <li>
            <strong>Communications:</strong> Any messages or correspondence
            you send to us directly
          </li>
        </ul>

        <h3 className="legal-subheading">Information Collected Automatically</h3>
        <ul className="legal-list">
          <li>
            <strong>Usage data:</strong> Pages visited, features used, and
            interactions within the Platform
          </li>
          <li>
            <strong>Device information:</strong> Browser type, operating
            system, and screen resolution
          </li>
          <li>
            <strong>Theme preferences:</strong> Your selected display theme
            (light, dark, or system)
          </li>
          <li>
            <strong>Local storage data:</strong> Theme preference cached
            locally for performance (no tracking cookies)
          </li>
        </ul>

        <h3 className="legal-subheading">Information We Do NOT Collect</h3>
        <ul className="legal-list">
          <li>We do not use advertising cookies or tracking pixels</li>
          <li>We do not sell, rent, or trade your personal information to third parties</li>
          <li>We do not collect health data, medical records, or biometric information</li>
          <li>We do not collect payment or financial information (the Platform is free)</li>
        </ul>
      </section>

      <section>
        <h2 className="legal-heading">3. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul className="legal-list">
          <li>Provide and maintain the Platform and your account</li>
          <li>Display your profile to other community members</li>
          <li>Enable community features (forums, events, courses, badges)</li>
          <li>Send you notifications about community activity relevant to you</li>
          <li>Improve the Platform's functionality and user experience</li>
          <li>Communicate important updates about the Platform or these policies</li>
          <li>Enforce our Terms of Use and protect the community</li>
        </ul>
      </section>

      <section>
        <h2 className="legal-heading">4. How We Store and Protect Your Information</h2>
        <ul className="legal-list">
          <li>
            <strong>Database:</strong> Your data is stored in a PostgreSQL
            database hosted by Supabase, Inc., with servers located in the
            United States (us-east-1 region)
          </li>
          <li>
            <strong>Authentication:</strong> Managed by Supabase Auth with
            industry-standard encryption. Passwords are hashed using bcrypt and
            never stored in plain text
          </li>
          <li>
            <strong>File storage:</strong> Avatar images and uploaded files are
            stored in private Supabase Storage buckets accessible only to
            authenticated users
          </li>
          <li>
            <strong>Access control:</strong> Row Level Security (RLS) is
            enabled on every database table, ensuring users can only access
            data they are authorized to see
          </li>
          <li>
            <strong>Hosting:</strong> The Platform frontend is hosted on
            Cloudflare Workers, which provides DDoS protection and global CDN
            distribution
          </li>
          <li>
            <strong>Encryption:</strong> All data in transit is encrypted via
            HTTPS/TLS
          </li>
        </ul>
        <p>
          While we implement reasonable security measures, no method of
          electronic storage or transmission is 100% secure. We cannot
          guarantee absolute security.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">5. Data Sharing</h2>
        <p>We do not sell your personal information. We may share limited data with:</p>
        <ul className="legal-list">
          <li>
            <strong>Service providers:</strong> Supabase (database and
            authentication hosting) and Cloudflare (frontend hosting and CDN)
            — only as necessary to operate the Platform. These providers have
            their own privacy policies and are bound by their terms of service.
          </li>
          <li>
            <strong>Legal requirements:</strong> If required by law,
            regulation, legal process, or governmental request
          </li>
          <li>
            <strong>Safety:</strong> If necessary to protect the safety,
            rights, or property of Full Spectrum Human LLC, our users, or the
            public
          </li>
        </ul>
      </section>

      <section>
        <h2 className="legal-heading">6. Your Rights and Choices</h2>
        <p>You have the right to:</p>
        <ul className="legal-list">
          <li><strong>Access</strong> your personal information through your profile page</li>
          <li><strong>Update</strong> your profile information at any time</li>
          <li><strong>Delete</strong> your account and all associated data through the Platform's account settings (this action is permanent and irreversible)</li>
          <li><strong>Opt out</strong> of non-essential notifications (notification preferences are available in your account settings)</li>
          <li><strong>Request</strong> a copy of your data or ask questions about our data practices by contacting us</li>
        </ul>

        <h3 className="legal-subheading">For California Residents (CCPA)</h3>
        <p>
          California residents have additional rights under the California
          Consumer Privacy Act, including the right to know what personal
          information is collected, the right to delete personal information,
          and the right to opt out of the sale of personal information. We do
          not sell personal information.
        </p>

        <h3 className="legal-subheading">For EU/EEA Residents (GDPR)</h3>
        <p>
          If you are located in the European Union or European Economic Area,
          you have additional rights under the General Data Protection
          Regulation, including the right to data portability, the right to
          restrict processing, and the right to lodge a complaint with a
          supervisory authority. Our legal basis for processing is your consent
          (provided at registration) and our legitimate interest in operating
          the Platform.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">7. Children's Privacy</h2>
        <p>
          The Platform is not intended for individuals under 18 years of age.
          We do not knowingly collect personal information from anyone under
          18. If we learn that we have collected personal information from a
          person under 18, we will take steps to delete that information
          promptly.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">8. Data Retention</h2>
        <p>
          We retain your personal information for as long as your account is
          active. If you delete your account, your data is permanently removed
          through a cascade deletion process. We may retain anonymized,
          aggregated data for analytical purposes, which cannot be used to
          identify you.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">9. Third-Party Links</h2>
        <p>
          The Platform may contain links to third-party websites (such as
          YouTube for livestream replays or Zoom for live events). We are not
          responsible for the privacy practices of these external sites. We
          encourage you to review their privacy policies.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Material changes
          will be communicated via the Platform. Your continued use after
          changes constitutes acceptance of the revised policy. The "Last
          Updated" date at the top reflects the most recent revision.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">11. Contact</h2>
        <p>
          For questions, concerns, or requests regarding this Privacy Policy or
          your personal data, contact us at:
        </p>
        <p>
          <strong>Full Spectrum Human LLC</strong>
          <br />
          Email:{' '}
          <a href="mailto:rance.fullspectrumhuman@gmail.com">
            rance.fullspectrumhuman@gmail.com
          </a>
        </p>
      </section>

      <footer className="legal-footer">
        <p>© 2026 Full Spectrum Human LLC. All rights reserved.</p>
        <p className="legal-nav">
          <Link to="/">← Back to home</Link>
          <span className="legal-nav-sep">·</span>
          <Link to="/terms">Terms of Use</Link>
          <span className="legal-nav-sep">·</span>
          <Link to="/disclaimer">Health Disclaimer</Link>
        </p>
      </footer>
    </div>
  );
}
