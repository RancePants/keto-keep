// Maps a route pathname to the list of tip IDs that live on that page.
// The sidebar "Guide" button uses this to re-trigger all relevant tips
// for the current page (session-scoped — not persisted).
export const PAGE_TIPS = {
  '/dashboard': [
    'onboarding-welcome',
    'onboarding-profile',
    'engage-first-honor',
    'engage-streak-7',
    'hint-vacation',
  ],
  '/forums': ['discover-forums'],
  '/events': ['discover-events'],
  '/courses': ['discover-courses'],
  '/members': ['discover-members'],
  '/profile': ['onboarding-profile', 'hint-vacation'],
};

export function tipsForPath(pathname) {
  if (!pathname) return [];
  return PAGE_TIPS[pathname] || [];
}
