import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { AuthContext } from './authContextValue.js';

// Apply a theme to the <html> element and persist to localStorage as a
// fast cache for the next page load (the inline script in index.html
// reads this to prevent a theme flash before React boots).
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light' || theme === 'dark') {
    root.setAttribute('data-theme', theme);
  } else {
    root.removeAttribute('data-theme');
  }
  try {
    if (theme === 'system') {
      localStorage.removeItem('kk-theme');
    } else if (theme === 'light' || theme === 'dark') {
      localStorage.setItem('kk-theme', theme);
    }
  } catch {
    // localStorage may be blocked — theme still applies in-memory.
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSuspended, setIsSuspended] = useState(false);

  // Cache object URLs for avatars so we don't re-download on every render.
  // Keyed by storage path; value is an object URL.
  const avatarCacheRef = useRef(new Map());

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      setIsSuspended(false);
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
        setIsSuspended(false);
        return null;
      }
      if (data?.status === 'banned') {
        // Hard block — sign out and send them to login with a banner.
        setProfile(null);
        setIsSuspended(false);
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.error('Sign-out after ban detection failed:', e);
        }
        if (window.location.pathname !== '/login') {
          window.location.replace('/login?banned=1');
        }
        return null;
      }
      setProfile(data);
      setIsSuspended(data?.status === 'suspended');
      if (data?.theme_preference) {
        applyTheme(data.theme_preference);
      }
      return data;
    } catch (e) {
      console.error('Unexpected error loading profile:', e);
      setProfile(null);
      setIsSuspended(false);
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

    // onAuthStateChange fires INITIAL_SESSION immediately on subscribe with
    // the persisted session (or null). That's our single source of truth —
    // no parallel getSession() IIFE, so no race.
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!mounted) return;

        // If the user clicked a password-reset email link, the recovery token
        // lands here as PASSWORD_RECOVERY. Redirect to the update-password page
        // regardless of where the link opened — before any other state is set.
        if (_event === 'PASSWORD_RECOVERY') {
          if (window.location.pathname !== '/update-password') {
            window.location.replace('/update-password');
          }
          // Let the session be set so updateUser() works on that page.
        }

        setSession(newSession);
        // Mark hydrated as soon as we know the session. Profile fetch runs
        // independently and must never block the loading flag.
        finish();
        if (newSession?.user) {
          fetchProfile(newSession.user.id).catch((e) =>
            console.error('Profile fetch failed:', e)
          );
        } else {
          setProfile(null);
          setIsSuspended(false);
        }
      }
    );

    // Safety net: if the subscription somehow never delivers INITIAL_SESSION
    // (stalled token refresh, network wedge), don't spin forever.
    const safetyTimer = setTimeout(() => {
      if (mounted && !settled) {
        console.warn('Auth init timed out; proceeding as unauthenticated.');
        finish();
      }
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      // Synchronous unsubscribe so the next mount's subscription doesn't
      // race this one for the gotrue auth-token lock.
      try {
        subscription.subscription.unsubscribe();
      } catch (e) {
        console.error('Auth subscription unsubscribe failed:', e);
      }
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
        redirectTo: `${window.location.origin}/update-password`,
      });
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      if (!session?.user) return { data: null, error: new Error('Not authenticated') };
      // Allow-list of columns a user can self-update. `role`, `email`,
      // `avatar_url` (handled by uploadAvatar), `status`, and timestamps
      // are not user-editable from here.
      const allowed = [
        'display_name',
        'bio',
        'dietary_approach',
        'journey_duration',
        'state',
        'city',
        'about_me',
        'my_why',
        'theme_preference',
      ];
      const payload = {};
      for (const k of allowed) {
        if (updates[k] !== undefined) payload[k] = updates[k];
      }

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

  const setTheme = useCallback(
    async (theme) => {
      if (!['light', 'dark', 'system'].includes(theme)) return { error: new Error('Invalid theme') };
      applyTheme(theme);
      if (!session?.user) {
        // Unauthenticated: localStorage + DOM is enough.
        return { error: null };
      }
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({ theme_preference: theme })
          .eq('id', session.user.id)
          .select()
          .single();
        if (!error && data) setProfile(data);
        return { data, error };
      } catch (e) {
        console.error('setTheme threw:', e);
        return { data: null, error: e };
      }
    },
    [session]
  );

  const deleteOwnAccount = useCallback(async () => {
    if (!session?.user) return { ok: false, error: new Error('Not authenticated') };
    try {
      const { error } = await supabase.rpc('delete_own_account');
      if (error) return { ok: false, error };
      // Sign out on the client — server-side cascade has already removed the user.
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // Session is already invalid — ignore.
        console.warn('Post-delete signOut warning:', e?.message || e);
      }
      try {
        localStorage.removeItem('kk-theme');
      } catch {
        // localStorage may be blocked
      }
      for (const url of avatarCacheRef.current.values()) {
        URL.revokeObjectURL(url);
      }
      avatarCacheRef.current.clear();
      return { ok: true, error: null };
    } catch (e) {
      console.error('deleteOwnAccount threw:', e);
      return { ok: false, error: e };
    }
  }, [session]);

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

  const role = profile?.role;
  const isOwner = role === 'owner';
  const isAdmin = role === 'admin' || role === 'owner';

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      isSuspended,
      isAdmin,
      isOwner,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updateProfile,
      uploadAvatar,
      getAvatarUrl,
      setTheme,
      deleteOwnAccount,
      refreshProfile: () => fetchProfile(session?.user?.id),
    }),
    [session, profile, loading, isSuspended, isAdmin, isOwner, signUp, signIn, signOut, resetPassword, updateProfile, uploadAvatar, getAvatarUrl, setTheme, deleteOwnAccount, fetchProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
