import { useEffect } from 'react';

const BASE = 'The Keto Keep';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : BASE;
    return () => {
      document.title = BASE;
    };
  }, [title]);
}

export default usePageTitle;
