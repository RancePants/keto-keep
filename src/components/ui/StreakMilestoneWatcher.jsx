import { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/useAuth.js';
import { useToast } from './toastContext.js';
import { milestoneByKey } from '../../lib/streakHelpers.js';

// Mounted once inside ToastProvider. When AuthContext reports a freshly-hit
// milestone, show a celebratory toast. We use a ref to guarantee one toast
// per milestone event (even under React StrictMode double-invoke).
export default function StreakMilestoneWatcher() {
  const { lastMilestone, clearLastMilestone } = useAuth();
  const toast = useToast();
  const handledRef = useRef(null);

  useEffect(() => {
    if (!lastMilestone) return;
    if (handledRef.current === lastMilestone.at) return;
    handledRef.current = lastMilestone.at;

    const m = milestoneByKey(lastMilestone.key);
    const days = lastMilestone.streak || (m ? m.days : 0);
    const message = m
      ? `${m.name} unlocked — ${days} day streak!`
      : `You hit a ${days} day streak!`;

    toast.success(message, { duration: 6500 });
    clearLastMilestone();
  }, [lastMilestone, toast, clearLastMilestone]);

  return null;
}
