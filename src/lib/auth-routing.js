/**
 * Auth routing for the Supabase-only application flow.
 */

export const redirectToPlatformLogin = (nextPath) => {
  if (typeof window === 'undefined') return;

  const loginUrl = new URL('/login', window.location.origin);

  if (nextPath) {
    loginUrl.searchParams.set('from_url', nextPath);
  }

  window.location.href = loginUrl.toString();
};
