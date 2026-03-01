// 100ms token generation using Web Crypto API (no extra library needed)

const HMS_ACCESS_KEY = import.meta.env.VITE_HMS_APP_ACCESS_KEY;
const HMS_SECRET = import.meta.env.VITE_HMS_APP_SECRET;
const HMS_ROOM_ID = import.meta.env.VITE_HMS_ROOM_ID;
const HMS_SUBDOMAIN = import.meta.env.VITE_HMS_SUBDOMAIN;

export const HMS_ROOM_ID_VALUE = HMS_ROOM_ID;
export const HMS_MEETING_URL = `https://${HMS_SUBDOMAIN}.app.100ms.live/streaming/meeting?roomId=${HMS_ROOM_ID}&role=emissora`;

function base64urlEncode(str) {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function objToBase64url(obj) {
    return base64urlEncode(unescape(encodeURIComponent(JSON.stringify(obj))));
}

async function signHS256(data, secret) {
    const secretBytes = new TextEncoder().encode(secret);
    const dataBytes = new TextEncoder().encode(data);

    const key = await crypto.subtle.importKey(
        'raw',
        secretBytes,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const sig = await crypto.subtle.sign('HMAC', key, dataBytes);
    const sigArray = new Uint8Array(sig);
    let binary = '';
    sigArray.forEach(b => (binary += String.fromCharCode(b)));
    return base64urlEncode(binary);
}

/**
 * Generate a 100ms auth token for a given role and user.
 * @param {string} role - e.g. 'emissora' or 'espectador-hls'
 * @param {string} userId - unique user identifier
 * @returns {Promise<string>} JWT token
 */
export async function generateHmsToken(role, userId) {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
        access_key: HMS_ACCESS_KEY,
        type: 'app',
        version: 2,
        room_id: HMS_ROOM_ID,
        user_id: String(userId),
        role: role,
        iat: now,
        nbf: now - 60,
        exp: now + 86400, // 24 hours
    };

    const headerB64 = objToBase64url(header);
    const payloadB64 = objToBase64url(payload);
    const message = `${headerB64}.${payloadB64}`;
    const signature = await signHS256(message, HMS_SECRET);

    return `${message}.${signature}`;
}
