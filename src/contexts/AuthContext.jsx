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
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      if (data.session?.user) {
        await fetchProfile(data.session.user.id);
      }
      setLoading(false);
    })();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (newSession?.user) {
        await fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    return { data, error };
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    // Clear avatar cache on sign-out.
    for (const url of avatarCacheRef.current.values()) {
      URL.revokeObjectURL(url);
    }
    avatarCacheRef.current.clear();
    return { error };
  }, []);

  const resetPassword = useCallback(async ({ email }) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    return { data, error };
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      if (!session?.user) return { error: new Error('Not authenticated') };
      const payload = {
        display_name: updates.display_name,
        bio: updates.bio,
      };
      // Only include fields the caller provided.
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

      const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', session.user.id)
        .select()
        .single();
      if (!error && data) setProfile(data);
      return { data, error };
    },
    [session]
  );

  const getAvatarUrl = useCallback(async (path) => {
    if (!path) return null;
    const cache = avatarCacheRef.current;
    if (cache.has(path)) return cache.get(path);

    const { data, error } = await supabase.storage.from('avatars').download(path);
    if (error || !data) {
      console.error('Avatar download failed:', error?.message);
      return null;
    }
    const url = URL.createObjectURL(data);
    cache.set(path, url);
    return url;
  }, []);

  const uploadAvatar = useCallback(
    async (file) => {
      if (!session?.user) return { error: new Error('Not authenticated') };
      if (!file) return { error: new Error('No file provided') };

      const ext = (file.name.split('.').pop() || 'png').toLowerCase();
      const path = `${session.user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type || undefined });
      if (uploadError) return { error: uploadError };

      // Invalidate any cached URL for this path or any prior avatar path for this user.
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
