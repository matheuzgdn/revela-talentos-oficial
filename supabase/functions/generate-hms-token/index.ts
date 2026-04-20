const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const encoder = new TextEncoder();

function toBase64Url(value: unknown) {
  const json = JSON.stringify(value);
  const bytes = encoder.encode(json);
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function signHmac(message: string, secret: string) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message));
  const bytes = new Uint8Array(signature);
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const HMS_ACCESS_KEY = Deno.env.get('HMS_APP_ACCESS_KEY');
    const HMS_SECRET = Deno.env.get('HMS_APP_SECRET');
    const HMS_ROOM_ID = Deno.env.get('HMS_ROOM_ID');
    const HMS_SUBDOMAIN = Deno.env.get('HMS_SUBDOMAIN');

    if (!HMS_ACCESS_KEY || !HMS_SECRET || !HMS_ROOM_ID) {
      return new Response(JSON.stringify({
        error: 'Missing HMS_APP_ACCESS_KEY, HMS_APP_SECRET or HMS_ROOM_ID in Supabase secrets.',
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const { role, userId } = await request.json();
    const currentTime = Math.floor(Date.now() / 1000);

    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      access_key: HMS_ACCESS_KEY,
      type: 'app',
      version: 2,
      room_id: HMS_ROOM_ID,
      user_id: String(userId || crypto.randomUUID()),
      role: String(role || 'viewer-realtime'),
      jti: crypto.randomUUID(),
      iat: currentTime - 60,
      nbf: currentTime - 60,
      exp: currentTime + 60 * 60 * 24,
    };

    const unsignedToken = `${toBase64Url(header)}.${toBase64Url(payload)}`;
    const signature = await signHmac(unsignedToken, HMS_SECRET);
    const meetingUrl = HMS_SUBDOMAIN
      ? `https://${HMS_SUBDOMAIN}.app.100ms.live/streaming/meeting?roomId=${HMS_ROOM_ID}&role=viewer-realtime`
      : null;

    return new Response(JSON.stringify({
      token: `${unsignedToken}.${signature}`,
      meetingUrl,
    }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unexpected error.',
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
