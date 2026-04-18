import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { AuthContext } from './authContextValue.js';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cache object URLs for avatars so we don't re-download on every render.
  // Keyed by storage path; value is an object URL.
  const avatarCacheRef = useRef(new Map());

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return null;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) {
        console.error('Failed to load profile:', error.message);
        setProfile(null);
        return null;
      }
      setProfile(data);
      return data;
    } catch (e) {
      console.error('Unexpected error loading profile:', e);
      setProfile(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let settled = false;

    const finish = () => {
      if (!mounted || settled) return;
      settled = true;
      setLoading(false);
    };

    // Primary init: getSession is the source of truth for initial state.
    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!mounted) return;
        if (error) console.error('getSession failed:', error.message);
        const current = data?.session ?? null;
        setSession(current);
        if (current?.user) {
          await fetchProfile(current.user.id);
        } else {
          setProfile(null);
        }
      } catch (e) {
        console.error('Auth init failed:', e);
      } finally {
        finish();
      }
    })();

    // Safety net: if getSession somehow never resolves (e.g., stalled token
    // refresh on a bad network), don't leave the app spinning forever.
    const safetyTimer = setTimeout(() => {
      if (mounted && !settled) {
        console.warn('Auth init timed out; proceeding as unauthenticated.');
        finish();
      }
    }, 8000);

    // Keep session/profile in sync with future auth changes. Wrapped so a
    // throw in this callback can never jam the provider.
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;
        try {
          setSession(newSession);
          if (newSession?.user) {
            await fetchProfile(newSession.user.id);
          } else {
            setProfile(null);
          }
        } catch (e) {
          console.error('Auth state change failed:', e);
        } finally {
          // Once any auth event arrives we know we're hydrated.
          finish();
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Revoke all cached avatar URLs on unmount.
  useEffect(() => {
    const cache = avatarCacheRef.current;
    return () => {
      for (const url of cache.values()) {
        URL.revokeObjectURL(url);
      }
      cache.clear();
    };
  }, []);

  const signUp = useCallback(async ({ email, password, displayName }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (e) {
      return { error: e };
    } finally {
      for (const url of avatarCacheRef.current.values()) {
        URL.revokeObjectURL(url);
      }
      avatarCacheRef.current.clear();
    }
  }, []);

  const resetPassword = useCallback(async ({ email }) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      if (!session?.user) return { data: null, error: new Error('Not authenticated') };
      const payload = {
        display_name: updates.display_name,
        bio: updates.bio,
      };
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .update(payload)
          .eq('id', session.user.id)
          .select()
          .single();
        if (!error && data) setProfile(data);
        return { data, error };
      } catch (e) {
        console.error('updateProfile threw:', e);
        return { data: null, error: e };
      }
    },
    [session]
  );

  const getAvatarUrl = useCallback(async (path) => {
    if (!path) return null;
    const cache = avatarCacheRef.current;
    if (cache.has(path)) return cache.get(path);

    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error || !data) {
        console.error('Avatar download failed:', error?.message);
        return null;
      }
      const url = URL.createObjectURL(data);
      cache.set(path, url);
      return url;
    } catch (e) {
      console.error('getAvatarUrl threw:', e);
      return null;
    }
  }, []);

  const uploadAvatar = useCallback(
    async (file) => {
      if (!session?.user) return { data: null, error: new Error('Not authenticated') };
      if (!file) return { data: null, error: new Error('No file provided') };

      try {
        const ext = (file.name.split('.').pop() || 'png').toLowerCase();
        const path = `${session.user.id}/avatar.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, file, { upsert: true, contentType: file.type || undefined });
        if (uploadError) return { data: null, error: uploadError, path };

        const cache = avatarCacheRef.current;
        for (const [key, url] of cache.entries()) {
          if (key.startsWith(`${session.user.id}/`)) {
            URL.revokeObjectURL(url);
            cache.delete(key);
          }
        }

        const { data, error } = await supabase
          .from('profiles')
          .update({ avatar_url: path })
          .eq('id', session.user.id)
          .select()
          .single();

        if (!error && data) setProfile(data);
        return { data, error, path };
      } catch (e) {
        console.error('uploadAvatar threw:', e);
        return { data: null, error: e };
      }
    },
    [session]
  );

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updateProfile,
      uploadAvatar,
      getAvatarUrl,
      refreshProfile: () => fetchProfile(session?.user?.id),
    }),
    [session, profile, loading, signUp, signIn, signOut, resetPassword, updateProfile, uploadAvatar, getAvatarUrl, fetchProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
