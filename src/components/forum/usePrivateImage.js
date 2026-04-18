import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';

const bucketCaches = new Map();

function getCache(bucket) {
  let cache = bucketCaches.get(bucket);
  if (!cache) {
    cache = new Map();
    bucketCaches.set(bucket, cache);
  }
  return cache;
}

export function usePrivateImage(bucket, path) {
  const [url, setUrl] = useState(() => {
    if (!path) return null;
    return getCache(bucket).get(path) || null;
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!path) {
        await Promise.resolve();
        if (!cancelled) setUrl(null);
        return;
      }
      const cache = getCache(bucket);
      const cached = cache.get(path);
      if (cached) {
        await Promise.resolve();
        if (!cancelled) setUrl(cached);
        return;
      }
      try {
        const { data, error } = await supabase.storage.from(bucket).download(path);
        if (cancelled) return;
        if (error || !data) {
          console.error(`Download failed for ${bucket}/${path}:`, error?.message);
          return;
        }
        const objectUrl = URL.createObjectURL(data);
        cache.set(path, objectUrl);
        if (!cancelled) setUrl(objectUrl);
      } catch (e) {
        console.error('usePrivateImage threw:', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bucket, path]);

  return url;
}
