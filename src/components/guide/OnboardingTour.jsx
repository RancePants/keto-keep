import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/useAuth.js';
import { ONBOARDING_STEPS } from './onboardingHelpers.js';

export default function OnboardingTour() {
  const { profile, dismissTip } = useAuth();
  const [stepOverride, setStepOverride] = useState(null);

  const activeStep = useMemo(() => {
    if (!profile) return null;
    if (profile.guide_character === 'none') return null;
    const dismissed = new Set(profile.dismissed_tips || []);
    const first = ONBOARDING_STEPS.findIndex((s) => !dismissed.has(s.tipId));
    if (first === -1) return null;
    return stepOverride ?? first;
  }, [profile, stepOverride]);

  if (activeStep === null) return null;
  const step = ONBOARDING_STEPS[activeStep];
  if (!step) return null;

  const characterName = 'Lady Elara';

  const handleSkip = () => {
    for (const s of ONBOARDING_STEPS) {
      dismissTip(s.tipId);
    }
  };

  const handleAdvance = () => {
    dismissTip(step.tipId);
    const nextIdx = activeStep + 1;
    setStepOverride(nextIdx < ONBOARDING_STEPS.length ? nextIdx : null);
  };

  return (
    <>
      <div className="guide-overlay-backdrop" aria-hidden="true" />
      <div
        className="guide-tooltip guide-tooltip-floating guide-tooltip-pos-center"
        role="dialog"
        aria-label="Welcome tour"
      >
        <div className="guide-tooltip-bubble">
          <img
            src={`/guide/guide-lady-${step.pose}.png`}
            alt=""
            className="guide-tooltip-character"
            loading="lazy"
          />
          <div className="guide-tooltip-body">
            <div className="guide-tooltip-name">
              {characterName} says…
              <span className="guide-tour-step">
                {' '}
                ({activeStep + 1}/{ONBOARDING_STEPS.length})
              </span>
            </div>
            <div className="guide-tooltip-message">{step.message}</div>
            <div className="guide-tooltip-actions">
              <button
                type="button"
                className="guide-tooltip-skip"
                onClick={handleSkip}
              >
                Skip tour
              </button>
              <button
                type="button"
                className="btn btn-primary guide-tooltip-dismiss"
                onClick={handleAdvance}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
