export const ONBOARDING_STEPS = [
  {
    tipId: 'onboarding-intro',
    pose: 'welcome',
    message:
      "Hello, traveler! I'm Lady Elara, your guide through The Keto Keep. I'll pop up from time to time to help you find your way around the Keep, celebrate your achievements, and share helpful tips. Let's get started!",
  },
  {
    tipId: 'onboarding-welcome',
    pose: 'pointing',
    message:
      "This is your Great Hall — your home base. You'll find the latest news, upcoming events, and your learning journey all right here.",
  },
  {
    tipId: 'onboarding-nav',
    pose: 'pointing',
    message:
      "This is your compass through The Keep. Forums, Events, Courses, and Members are all just a tap away. Explore at your own pace!",
  },
  {
    tipId: 'onboarding-profile',
    pose: 'thinking',
    message:
      "A quick tip — filling out your profile helps others get to know you. Your dietary approach, interests, and a short bio go a long way in this community.",
  },
];

export const ONBOARDING_TIP_IDS = ONBOARDING_STEPS.map((s) => s.tipId);

export function hasActiveOnboardingTour(profile) {
  if (!profile || profile.guide_character === 'none') return false;
  const dismissed = new Set(profile.dismissed_tips || []);
  return ONBOARDING_STEPS.some((s) => !dismissed.has(s.tipId));
}
