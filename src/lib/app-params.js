/**
 * Runtime app parameters for the Supabase-only frontend.
 */

const isNode = typeof window === 'undefined';

const getEnvValue = (keys, fallbackValue = undefined) => {
  for (const key of keys) {
    const value = import.meta.env[key];
    if (value) return value;
  }
  return fallbackValue;
};

const getAppParams = () => ({
  supabaseUrl: getEnvValue(['VITE_SUPABASE_URL']),
  supabaseAnonKey: getEnvValue(['VITE_SUPABASE_ANON_KEY']),
  appBaseUrl: isNode ? undefined : window.location.origin,
  backendProvider: 'supabase'
});

export const appParams = {
  ...getAppParams()
};
