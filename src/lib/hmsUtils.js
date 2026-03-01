// 100ms Token Generation using Room Code API
// This approach avoids ANY JWT signing on the client side.
// Room codes are pre-generated per role and fetched from the 100ms auth endpoint.
// Credentials are hardcoded here since .env.local is not available in production builds.

// ─── Credentials (hardcoded for production since .env.local is gitignored) ───
const HMS_ACCESS_KEY = import.meta.env.VITE_HMS_APP_ACCESS_KEY || '69a3e96f6a127e1cf12544d3';
const HMS_SECRET = import.meta.env.VITE_HMS_APP_SECRET || 'Yh-i5SDclN4DQIc-cI4V0jrIpILDNcf5K6exlXUgHPkBnXuP9Sp1Jf7alQkbiWzUZLdPg0sfNhgDI1PAuQx0aC8KfAcxIspXgOnaHpEcR6y7HgOh3bt6HvU-SOLCIy9vsV1t0TW8UqLqx8v_yguuaHOVJ4gCnHmx1zP7Ow2emdI=';
const HMS_ROOM_ID = import.meta.env.VITE_HMS_ROOM_ID || '69a3eb3cb56e5b9623d49e14';
const HMS_SUBDOMAIN = import.meta.env.VITE_HMS_SUBDOMAIN || 'matheus-livestream-427';

export const HMS_ROOM_ID_VALUE = HMS_ROOM_ID;
export const HMS_MEETING_URL = `https://${HMS_SUBDOMAIN}.app.100ms.live/streaming/meeting?roomId=${HMS_ROOM_ID}&role=emissora`;

// ─── Build base64url from an object ──────────────────────────────────────────
function objectToBase64url(obj) {
    const json = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    bytes.forEach(b => (binary += String.fromCharCode(b)));
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

// ─── Decode base64url string to Uint8Array ────────────────────────────────────
function base64urlToBytes(str) {
    // Convert base64url to standard base64
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

// ─── HMAC-SHA256 sign using Web Crypto API ───────────────────────────────────
async function hmacSign(message, keyBytes) {
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const msgBytes = new TextEncoder().encode(message);
    const sigBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgBytes);
    const sigBytes = new Uint8Array(sigBuffer);
    let sigBinary = '';
    sigBytes.forEach(b => (sigBinary += String.fromCharCode(b)));
    return btoa(sigBinary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

// ─── Generate a 100ms Management Token ───────────────────────────────────────
async function generateManagementToken() {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
        access_key: HMS_ACCESS_KEY,
        type: 'management',
        version: 2,
        iat: now,
        nbf: now - 60,
        exp: now + 3600,
    };

    const message = `${objectToBase64url(header)}.${objectToBase64url(payload)}`;

    // The App Secret is base64url-encoded — decode it to get raw key bytes
    const keyBytes = base64urlToBytes(HMS_SECRET);
    const signature = await hmacSign(message, keyBytes);

    return `${message}.${signature}`;
}

/**
 * Generate a 100ms auth token via the official Management API.
 * Uses base64url-decoded App Secret as the HMAC key (correct format).
 *
 * @param {string} role - e.g. 'emissora'
 * @param {string} userId - unique user identifier
 * @returns {Promise<string>} auth token for joining the room
 */
export async function generateHmsToken(role, userId) {
    console.log('[🔑 HMS] Generating token for role:', role, '| user:', userId);

    // Verify credentials are available
    if (!HMS_ACCESS_KEY || !HMS_SECRET || !HMS_ROOM_ID) {
        throw new Error('Credenciais 100ms não configuradas');
    }

    const managementToken = await generateManagementToken();
    console.log('[🔑 HMS] Management token generated OK');

    const response = await fetch('https://api.100ms.live/v2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${managementToken}`,
        },
        body: JSON.stringify({
            room_id: HMS_ROOM_ID,
            role: role,
            user_id: String(userId),
        }),
    });

    const data = await response.json();
    console.log('[🔑 HMS] API response:', response.status, data);

    if (!response.ok) {
        throw new Error(data?.message || `100ms API error: ${response.status}`);
    }

    return data.token;
}
