import { createSupabaseProvider } from '@/api/providers/supabaseProvider';

export const backendProvider = 'supabase';
export const appClient = createSupabaseProvider();
