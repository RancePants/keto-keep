import { createContext } from 'react';

export const GuideContext = createContext({
  reopenedTips: new Set(),
  reopenTipsForPage: () => {},
  isTipReopened: () => false,
});
