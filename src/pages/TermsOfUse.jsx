import { Link } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';

export default function TermsOfUse() {
  usePageTitle('Terms of Use');
  return (
    <div className="legal-page">
      <header className="legal-header">
        <h1 className="legal-title">The Keto Keep — Terms of Use</h1>
        <p className="legal-effective-date">
          <strong>Effective Date:</strong> April 19, 2026
          <br />
          <strong>Last Updated:</strong> April 19, 2026
        </p>
      </header>

      <section>
        <h2 className="legal-heading">1. Acceptance of Terms</h2>
        <p>
          By accessing or using The Keto Keep ("the Platform"), operated by Full
          Spectrum Human LLC ("we," "us," or "our"), you agree to be bound by
          these Terms of Use. If you do not agree, do not use the Platform.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">2. Description of Service</h2>
        <p>
          The Keto Keep is an online community platform for individuals
          interested in ancestral and metabolic health, including paleo,
          ketogenic, carnivore, and low-carb lifestyles. The Platform provides
          forums, educational content, events, and community features. It is
          led by National Board Certified Health & Wellness Coaches (NBC-HWC).
        </p>
      </section>

      <section>
        <h2 className="legal-heading">3. Eligibility</h2>
        <p>
          You must be at least 18 years of age to create an account and use the
          Platform. By registering, you represent that you are at least 18 years
          old and that all information you provide is accurate and complete.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">4. Account Registration and Security</h2>
        <p>
          You are responsible for maintaining the confidentiality of your
          account credentials. You agree to notify us immediately of any
          unauthorized use of your account. We are not liable for any loss
          arising from unauthorized access to your account.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">5. Health and Wellness Disclaimer</h2>
        <p>
          <strong>The Keto Keep is not a medical service.</strong> Content
          shared on this Platform — whether by coaches, members, or in
          educational materials — is for informational and educational purposes
          only. It is not intended to diagnose, treat, cure, or prevent any
          disease or medical condition.
        </p>
        <p>
          Our coaches hold National Board Certification in Health & Wellness
          Coaching (NBC-HWC) and may hold additional certifications, but they
          are <strong>not physicians, dietitians, or licensed medical
          practitioners</strong> unless separately credentialed and acting in
          that capacity.
        </p>
        <p>
          <strong>
            You should always consult your physician or qualified healthcare
            provider before making changes to your diet, exercise, medication,
            or lifestyle.
          </strong>{' '}
          Never disregard professional medical advice or delay seeking it
          because of something you read or heard on this Platform.
        </p>
        <p>
          If you are experiencing a medical emergency, call 911 or your local
          emergency number immediately.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">6. User Conduct</h2>
        <p>You agree not to:</p>
        <ul className="legal-list">
          <li>Post content that is unlawful, harassing, defamatory, obscene, or harmful</li>
          <li>Impersonate any person or entity</li>
          <li>Share medical advice or present yourself as a licensed medical professional unless you hold valid licensure</li>
          <li>Spam, solicit, or distribute unsolicited commercial content</li>
          <li>Upload malware, viruses, or harmful code</li>
          <li>Attempt to gain unauthorized access to other accounts or Platform systems</li>
          <li>Use the Platform for any illegal purpose</li>
        </ul>
        <p>
          We reserve the right to suspend, restrict, or terminate accounts that
          violate these terms.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">7. Content Ownership and License</h2>
        <p>
          <strong>Your Content:</strong> You retain ownership of content you
          post on the Platform (forum posts, replies, profile information). By
          posting, you grant Full Spectrum Human LLC a non-exclusive,
          royalty-free, worldwide license to display, distribute, and reproduce
          your content within the Platform for the purpose of operating the
          service.
        </p>
        <p>
          <strong>Our Content:</strong> All Platform content created by Full
          Spectrum Human LLC — including but not limited to course materials,
          educational content, branding, logos, design elements, and the "The
          Keto Keep" name and marks — is the intellectual property of Full
          Spectrum Human LLC and may not be reproduced, distributed, or used
          without written permission.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">8. Coaching Services</h2>
        <p>
          The Platform may offer opportunities to connect with coaches for
          private, one-on-one coaching through their individual practices. Any
          private coaching relationship is a separate arrangement between you
          and the individual coach, governed by their own agreements and terms.
          Full Spectrum Human LLC is not a party to those arrangements and
          assumes no liability for private coaching outcomes.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">9. Privacy</h2>
        <p>
          Your use of the Platform is also governed by our{' '}
          <Link to="/privacy">Privacy Policy</Link>, which describes how we
          collect, use, and protect your personal information. By using the
          Platform, you consent to the practices described in the Privacy
          Policy.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">10. Account Suspension and Termination</h2>
        <p>
          We may suspend or terminate your account at our discretion if you
          violate these Terms, engage in harmful behavior, or for any reason we
          deem necessary to protect the community. Suspended accounts retain
          read-only access; banned accounts lose all access.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">11. Account Deletion</h2>
        <p>
          You may delete your account at any time through the Platform's
          account settings. Upon deletion:
        </p>
        <ul className="legal-list">
          <li>Your profile, posts, replies, reactions, and all associated data will be permanently removed</li>
          <li>This action is irreversible</li>
          <li>Content you posted in community forums will be removed along with your account</li>
          <li>We may retain certain anonymized or aggregated data as permitted by law</li>
        </ul>
        <p>
          You may also contact us to request account deletion if you are unable
          to access your account.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">12. Disclaimer of Warranties</h2>
        <p>
          The Platform is provided "as is" and "as available" without
          warranties of any kind, express or implied. We do not warrant that
          the Platform will be uninterrupted, error-free, or free of harmful
          components.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">13. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Full Spectrum Human LLC and
          its officers, coaches, employees, and affiliates shall not be liable
          for any indirect, incidental, special, consequential, or punitive
          damages arising from your use of the Platform, including but not
          limited to health outcomes, reliance on content, or loss of data.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">14. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Full Spectrum Human LLC, its
          officers, coaches, and affiliates from any claims, damages, or
          expenses arising from your use of the Platform or violation of these
          Terms.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">15. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. Material changes will be
          communicated via the Platform. Continued use after changes
          constitutes acceptance of the revised Terms.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">16. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the State of Oklahoma,
          without regard to conflict of law principles.
        </p>
      </section>

      <section>
        <h2 className="legal-heading">17. Contact</h2>
        <p>
          For questions about these Terms, contact us at:{' '}
          <a href="mailto:rance.fullspectrumhuman@gmail.com">
            rance.fullspectrumhuman@gmail.com
          </a>
        </p>
      </section>

      <footer className="legal-footer">
        <p>© 2026 Full Spectrum Human LLC. All rights reserved.</p>
        <p>The Keto Keep™ is a trademark of Full Spectrum Human LLC.</p>
        <p className="legal-nav">
          <Link to="/">← Back to home</Link>
          <span className="legal-nav-sep">·</span>
          <Link to="/privacy">Privacy Policy</Link>
          <span className="legal-nav-sep">·</span>
          <Link to="/disclaimer">Health Disclaimer</Link>
        </p>
      </footer>
    </div>
  );
}
