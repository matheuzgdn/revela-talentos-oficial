// 100ms Auth Token Generation
// Generates the auth token JWT DIRECTLY with room_id embedded in the payload.
// The App Secret (base64url-encoded) must be DECODED to raw bytes before signing.
// Credentials hardcoded as fallback since .env.local is not committed to git.

const HMS_ACCESS_KEY = import.meta.env.VITE_HMS_APP_ACCESS_KEY || '69a3e96f6a127e1cf12544d3';
const HMS_SECRET = import.meta.env.VITE_HMS_APP_SECRET || 'Yh-i5SDclN4DQIc-cI4V0jrIpILDNcf5K6exlXUgHPkBnXuP9Sp1Jf7alQkbiWzUZLdPg0sfNhgDI1PAuQx0aC8KfAcxIspXgOnaHpEcR6y7HgOh3bt6HvU-SOLCIy9vsV1t0TW8UqLqx8v_yguuaHOVJ4gCnHmx1zP7Ow2emdI=';
const HMS_ROOM_ID = import.meta.env.VITE_HMS_ROOM_ID || '69a3eb3cb56e5b9623d49e14';
const HMS_SUBDOMAIN = import.meta.env.VITE_HMS_SUBDOMAIN || 'matheus-livestream-427';

export const HMS_ROOM_ID_VALUE = HMS_ROOM_ID;
export const HMS_MEETING_URL = `https://${HMS_SUBDOMAIN}.app.100ms.live/streaming/meeting?roomId=${HMS_ROOM_ID}&role=emissora`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert any object to a base64url string */
function toBase64url(obj) {
    const json = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(json);
    let bin = '';
    bytes.forEach(b => (bin += String.fromCharCode(b)));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decode a base64url string → Uint8Array (raw bytes).
 * The 100ms App Secret is stored as base64url → must be decoded before HMAC use.
 */
function base64urlDecode(str) {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

/** HMAC-SHA256 sign a string with raw key bytes */
async function hmacSign(message, rawKeyBytes) {
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        rawKeyBytes,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const sigBuf = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
    const sigBytes = new Uint8Array(sigBuf);
    let bin = '';
    sigBytes.forEach(b => (bin += String.fromCharCode(b)));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate a 100ms auth token (JWT) for a given room + role.
 * The key insight: App Secret is base64url-encoded → must be decoded before signing.
 *
 * @param {string} role   e.g. 'emissora'
 * @param {string} userId unique user identifier
 * @returns {Promise<string>} JWT auth token for hmsActions.join()
 */
export async function generateHmsToken(role, userId) {
    console.log('[🔑 HMS] Generating auth token → role:', role, '| user:', userId);

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
        exp: now + 86400,
    };

    const message = `${toBase64url(header)}.${toBase64url(payload)}`;
    const rawKey = base64urlDecode(HMS_SECRET); // ← critical: decode base64url first!
    const signature = await hmacSign(message, rawKey);
    const token = `${message}.${signature}`;

    console.log('[🔑 HMS] ✅ Auth token generated:', token.substring(0, 50) + '...');
    return token;
}
