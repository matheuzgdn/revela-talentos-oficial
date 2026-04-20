import { supabase } from '@/api/supabaseClient';

const HMS_ROOM_ID = import.meta.env.VITE_HMS_ROOM_ID;
const HMS_SUBDOMAIN = import.meta.env.VITE_HMS_SUBDOMAIN;

export const HMS_MEETING_URL = HMS_ROOM_ID && HMS_SUBDOMAIN
  ? `https://${HMS_SUBDOMAIN}.app.100ms.live/streaming/meeting?roomId=${HMS_ROOM_ID}&role=viewer-realtime`
  : null;

export const HMS_ROOM_ID_VALUE = HMS_ROOM_ID || null;

export async function generateHmsToken(role, userId) {
  const { data, error } = await supabase.functions.invoke('generate-hms-token', {
    body: {
      role,
      userId: String(userId || crypto.randomUUID())
    }
  });

  if (error) {
    throw new Error(error.message || 'Não foi possível gerar o token da live.');
  }

  if (!data?.token) {
    throw new Error('A função de live não retornou um token válido.');
  }

  return data.token;
}
