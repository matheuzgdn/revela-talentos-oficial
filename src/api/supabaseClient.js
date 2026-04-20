import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    '[Supabase] Missing env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  }
});

export const completeAuthSessionFromUrl = async () => {
  if (typeof window === 'undefined') {
    return { data: null, error: null };
  }

  const currentUrl = new URL(window.location.href);
  const authCode = currentUrl.searchParams.get('code');

  if (!authCode) {
    return { data: null, error: null };
  }

  const result = await supabase.auth.exchangeCodeForSession(authCode);

  if (!result.error) {
    currentUrl.searchParams.delete('code');
    currentUrl.searchParams.delete('state');
    currentUrl.searchParams.delete('scope');
    currentUrl.searchParams.delete('authuser');
    currentUrl.searchParams.delete('prompt');
    window.history.replaceState({}, document.title, `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
  }

  return result;
};
