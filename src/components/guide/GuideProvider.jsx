import { useCallback, useMemo, useState } from 'react';
import { GuideContext } from './guideContextValue.js';
import { tipsForPath } from './tipPageMap.js';

export function GuideProvider({ children }) {
  const [reopenedTips, setReopenedTips] = useState(() => new Set());

  const reopenTipsForPage = useCallback((pathname) => {
    const ids = tipsForPath(pathname);
    if (!ids.length) return;
    setReopenedTips((prev) => {
      const next = new Set(prev);
      for (const id of ids) next.add(id);
      return next;
    });
  }, []);

  const clearReopenedTip = useCallback((tipId) => {
    setReopenedTips((prev) => {
      if (!prev.has(tipId)) return prev;
      const next = new Set(prev);
      next.delete(tipId);
      return next;
    });
  }, []);

  const isTipReopened = useCallback(
    (tipId) => reopenedTips.has(tipId),
    [reopenedTips]
  );

  const value = useMemo(
    () => ({
      reopenedTips,
      reopenTipsForPage,
      clearReopenedTip,
      isTipReopened,
    }),
    [reopenedTips, reopenTipsForPage, clearReopenedTip, isTipReopened]
  );

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}
