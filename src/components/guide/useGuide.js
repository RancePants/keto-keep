import { useContext } from 'react';
import { GuideContext } from './guideContextValue.js';

export function useGuide() {
  return useContext(GuideContext);
}
