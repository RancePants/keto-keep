// Referral code + invite link helpers.
// Codes are generated server-side via the `generate_referral_code` RPC
// (SECURITY DEFINER). Referrals are recorded via `record_referral` during
// signup when a `?ref=` param is present.

import { supabase } from './supabase.js';

export async function getMyCode() {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id;
  if (!uid) return { code: null, error: new Error('Not authenticated') };

  const { data, error } = await supabase
    .from('referral_codes')
    .select('code')
    .eq('user_id', uid)
    .limit(1)
    .maybeSingle();

  if (error) return { code: null, error };
  return { code: data?.code || null, error: null };
}

export async function generateCode() {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id;
  if (!uid) return { code: null, error: new Error('Not authenticated') };

  const { data, error } = await supabase.rpc('generate_referral_code', {
    p_user_id: uid,
  });
  if (error) return { code: null, error };
  return { code: data, error: null };
}

// Returns existing code or generates a new one.
export async function ensureMyCode() {
  const existing = await getMyCode();
  if (existing.code) return existing;
  return generateCode();
}

export async function getMyReferrals() {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id;
  if (!uid) return { referrals: [], error: new Error('Not authenticated') };

  const { data, error } = await supabase
    .from('referrals')
    .select('id, referred_id, created_at, profiles:referred_id(id, display_name, avatar_url)')
    .eq('referrer_id', uid)
    .order('created_at', { ascending: false });

  if (error) return { referrals: [], error };
  const referrals = (data || []).map((row) => ({
    id: row.id,
    referred_id: row.referred_id,
    created_at: row.created_at,
    display_name: row.profiles?.display_name || 'Member',
    avatar_url: row.profiles?.avatar_url || null,
  }));
  return { referrals, error: null };
}

export function buildInviteUrl(code) {
  if (!code) return '';
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : '';
  return `${origin}/signup?ref=${encodeURIComponent(code)}`;
}

export async function recordReferral(referredId, code) {
  if (!referredId || !code) return { ok: false, error: null };
  const { data, error } = await supabase.rpc('record_referral', {
    p_referred_id: referredId,
    p_code: code,
  });
  if (error) return { ok: false, error };
  return { ok: !!data, error: null };
}
