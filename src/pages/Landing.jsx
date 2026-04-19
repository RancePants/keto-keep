import { useState } from 'react';
import { Link } from 'react-router-dom';
import usePageTitle from '../lib/usePageTitle.js';
import '../styles/landing.css';

const VALUE_PROPS = [
  {
    title: 'Expert Guidance You Can Trust',
    description:
      'Gain direct access to National Board Certified Health & Wellness Coaches, ensuring you receive professional, evidence-based support on your journey.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'A Community That Gets You',
    description:
      'Connect with like-minded individuals who share your passion for ketogenic living—whether keto, paleo, carnivore, or low-carb—and thrive in a supportive, judgment-free space.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="7" r="3" />
        <circle cx="15" cy="7" r="3" />
        <path d="M3 20c0-4 3-6 6-6h6c3 0 6 2 6 6" />
      </svg>
    ),
  },
  {
    title: 'Whole-Person Wellness Tools',
    description:
      'Go beyond food: explore resources on sleep hygiene, stress management, light exposure, movement, and relationships, all designed to help you build a healthier, more balanced life.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
  {
    title: 'Interactive Education',
    description:
      'Join live-streamed workshops and Q&A sessions led by experienced coaches, keeping you inspired, informed, and engaged with the latest strategies for success.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    title: 'Personalized Coaching Opportunities',
    description:
      'When you\'re ready for deeper support, you can seamlessly work one-on-one with any of our hosting coaches through their private practices—tailoring your journey to your unique needs.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

const COACHES = [
  {
    initials: 'JR',
    name: 'Justine Roberts, NBC-HWC',
    role: 'Co-Host & Coach',
    bio: [
      'Justine Roberts has been passionate about health and coaching for as long as she can remember. Her journey began with childhood health challenges, sparking her curiosity about how lifestyle, nutrition, and mindset influence overall well-being. That curiosity grew into a career devoted to helping others feel stronger, healthier, and more confident in their lives.',
      'She is a National Board-Certified Health & Wellness Coach with nine years of experience as a health professional and the founder of Ever Evolve, where she empowers individuals to become healthier, stronger, and more resilient versions of themselves. Since becoming a Certified Personal Trainer in 2016, Justine has earned specializations in nutrition, corrective exercise, women\'s health and fitness, and primal health coaching. Fluent in both English and Polish, she connects deeply across cultures while creating personalized plans and guiding clients through meaningful, lasting change.',
      'Outside of coaching, Justine enjoys cooking paleo, low-carb, keto, and carnivore meals, experimenting with new recipes, and actively spending time with her family hiking, biking, simply enjoying the outdoors. She has also competed in bodybuilding competitions, which taught her discipline, patience, and resilience - qualities she brings to every client interaction.',
    ],
  },
  {
    initials: 'RE',
    name: 'Rance Edwards, NBC-HWC',
    role: 'Founder, Co-Host & Coach',
    bio: [
      'Rance Edwards is a National Board-Certified Health & Wellness (NBC-HWC) Coach, Certified Master Primal Health Coach (MPHC), and personal trainer, specializing in clinical coaching and integration with patient care teams—with over seven years of experience. He also holds certificates in Functional Lab Testing, The Metabolic Approach to Cancer, and The Science of Women\'s Hormones.',
      'Rance\'s passion for health coaching began after overcoming his own decade-long battle with chronic conditions, such as Type 2 Diabetes, Obesity, Bipolar Disorder, Anxiety, and Chronic Fatigue. His healing journey inspired a deep commitment to helping others improve their metabolic health and reclaim their lives.',
      'Frustrated by the impersonal and dismissive nature of mainstream medicine—and shaped by the loss of his mother to bipolar disorder and cancer—Rance approaches every client and patient with empathy, collaboration, and a listening ear. His mission is to transform healthcare from a reactive, disease-centered system into one that empowers patients with lifelong tools for health, healing, and vitality.',
    ],
  },
];

const FAQS = [
  {
    q: 'What is The Keto Keep?',
    a: 'The Keto Keep is a supportive online community led by National Board Certified Health & Wellness Coaches, created for anyone practicing low-carb lifestyles like keto, paleo, carnivore, or other ketogenic approaches. We provide guidance, education, and connection to help you thrive.',
  },
  {
    q: 'Who is this community for?',
    a: 'Our space is for anyone following or exploring ketogenic diets—whether you\'re brand new, experienced, or anywhere in between. If you value a compassionate, evidence-informed, and collaborative environment, you\'ll feel right at home.',
  },
  {
    q: 'What do I get when I join?',
    a: 'Membership includes access to: Professional health coach support, a welcoming like-minded community, resources on nutrition, sleep, stress, movement, light, and relationships, educational livestreams and Q&As, and opportunities to work privately with our coaches if desired.',
  },
  {
    q: 'Is this a replacement for medical advice?',
    a: 'No. While our coaches are trained professionals, The Keto Keep is not a substitute for medical care. We encourage members to maintain regular communication with their healthcare providers for medical concerns.',
  },
  {
    q: 'Do I have to follow a strict version of keto?',
    a: 'Not at all! Whether you practice paleo, low-carb, keto, carnivore, or another ketogenic variation, you\'re welcome here. Our community celebrates the diversity of approaches under the ketogenic umbrella.',
  },
  {
    q: 'What makes The Keto Keep different from other groups?',
    a: 'Unlike typical diet forums or social media groups, The Keto Keep is: Coach-led (run by board-certified health coaches), science-based and compassionate, holistic (covering nutrition, sleep, stress, lifestyle, and relationships), and collaborative (focusing on encouragement, not judgment).',
  },
  {
    q: 'How do I get started?',
    a: 'Simply sign up, introduce yourself, and jump into the conversation! Our coaches and members are ready to welcome you and help you make the most of your low-carb journey.',
  },
];

export default function Landing() {
  usePageTitle();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => setOpenFaq((prev) => (prev === idx ? null : idx));

  return (
    <div className="landing">
      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <img src="/tkk-logo-transparent.png" alt="The Keto Keep" className="landing-logo" />
          <p className="landing-eyebrow">Welcome to</p>
          <h1 className="landing-title">The Keto Keep</h1>
          <p className="landing-tagline">Expert coaches, supportive community. Every low-carb lifestyle.</p>
          <div className="landing-cta-group">
            <Link to="/signup" className="landing-btn-primary">Sign up free</Link>
            <Link to="/login" className="landing-btn-ghost">Already a member? Log in</Link>
          </div>
        </div>
      </section>

      {/* Slogan bar */}
      <div className="landing-slogan-bar">
        Keep Calm and Paleo / Keto / Carnivore On
      </div>

      {/* Value Props */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <p className="landing-section-eyebrow">Here&rsquo;s what to expect</p>
          <h2 className="landing-section-title">More than a diet group</h2>
          <div className="landing-value-grid">
            {VALUE_PROPS.map((vp) => (
              <div key={vp.title} className="landing-value-card">
                <div className="landing-value-icon">{vp.icon}</div>
                <h3>{vp.title}</h3>
                <p>{vp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="landing-section landing-section--alt">
        <div className="landing-section-inner">
          <p className="landing-section-eyebrow">Your coaches</p>
          <h2 className="landing-section-title">Meet the team</h2>
          <div className="landing-coach-list">
            {COACHES.map((coach) => (
              <div key={coach.name} className="landing-coach-card">
                <div className="landing-coach-initials">{coach.initials}</div>
                <div className="landing-coach-body">
                  <p className="landing-coach-name">{coach.name}</p>
                  <p className="landing-coach-role">{coach.role}</p>
                  <div className="landing-coach-bio">
                    {coach.bio.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <p className="landing-section-eyebrow">Questions?</p>
          <h2 className="landing-section-title">Frequently asked</h2>
          <div className="landing-faq-list">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="landing-faq-item">
                  <button
                    type="button"
                    className="landing-faq-question"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <svg
                      className={`landing-faq-chevron${isOpen ? ' landing-faq-chevron--open' : ''}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {isOpen && <div className="landing-faq-answer">{item.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-final-cta">
        <h2 className="landing-final-cta-title">Your community awaits</h2>
        <p className="landing-final-cta-sub">Free to join. No credit card. No catch.</p>
        <div className="landing-final-cta-actions">
          <Link to="/signup" className="landing-btn-primary">Sign up free</Link>
          <Link to="/login" className="landing-final-cta-login">Already a member? Log in</Link>
        </div>
      </section>
    </div>
  );
}
