// 100ms Auth Token Generation
// Uses HMAC-SHA256 with the App Secret as a PLAIN UTF-8 STRING (NOT base64-decoded).
// This matches the behavior of Python PyJWT and Node.js jsonwebtoken libraries.

const HMS_ACCESS_KEY = import.meta.env.VITE_HMS_APP_ACCESS_KEY || '69a3e96f6a127e1cf12544d3';
const HMS_SECRET = import.meta.env.VITE_HMS_APP_SECRET || 'Yh-i5SDclN4DQIc-cI4V0jrIpILDNcf5K6exlXUgHPkBnXuP9Sp1Jf7alQkbiWzUZLdPg0sfNhgDI1PAuQx0aC8KfAcxIspXgOnaHpEcR6y7HgOh3bt6HvU-SOLCIy9vsV1t0TW8UqLqx8v_yguuaHOVJ4gCnHmx1zP7Ow2emdI=';
const HMS_ROOM_ID = import.meta.env.VITE_HMS_ROOM_ID || '69a3eb3cb56e5b9623d49e14';
const HMS_SUBDOMAIN = import.meta.env.VITE_HMS_SUBDOMAIN || 'matheus-livestream-427';

export const HMS_ROOM_ID_VALUE = HMS_ROOM_ID;
export const HMS_MEETING_URL = `https://${HMS_SUBDOMAIN}.app.100ms.live/streaming/meeting?roomId=${HMS_ROOM_ID}&role=broadcaster`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toBase64url(obj) {
    const json = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(json);
    let bin = '';
    bytes.forEach(b => (bin += String.fromCharCode(b)));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * HMAC-SHA256 sign — key is treated as plain UTF-8 string (standard JWT behavior).
 * Standard JWT libraries (PyJWT, jsonwebtoken) do NOT base64-decode the secret.
 */
async function hmacSign(message, secretStr) {
    const keyBytes = new TextEncoder().encode(secretStr); // plain UTF-8 bytes
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBytes,
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
 * Generate a 100ms auth JWT for a given room + role.
 * Secret used as-is (plain string), matching standard JWT libraries.
 *
 * @param {string} role   e.g. 'emissora'
 * @param {string} userId unique user identifier
 * @returns {Promise<string>} JWT auth token for hmsActions.join()
 */
export async function generateHmsToken(role, userId) {
    console.log('[🔑 HMS] Generating token | role:', role, '| user:', userId);
    console.log('[🔑 HMS] Secret starts with:', HMS_SECRET.substring(0, 8), '... length:', HMS_SECRET.length);

    // Debug: log available roles via management API
    try {
        const mgToken = await (async () => {
            const n = Math.floor(Date.now() / 1000);
            const h = { alg: 'HS256', typ: 'JWT' };
            const p = { access_key: HMS_ACCESS_KEY, type: 'management', version: 2, jti: crypto.randomUUID(), iat: n, nbf: n - 60, exp: n + 3600 };
            const msg = `${toBase64url(h)}.${toBase64url(p)}`;
            const sig = await hmacSign(msg, HMS_SECRET);
            return `${msg}.${sig}`;
        })();
        const roomResp = await fetch(`https://api.100ms.live/v2/rooms/${HMS_ROOM_ID}`, {
            headers: { Authorization: `Bearer ${mgToken}` }
        });
        const roomData = await roomResp.json();
        console.log('[🔑 HMS] Room template_id:', roomData.template_id, '| name:', roomData.name);
        // Fetch template to get role names
        const tplResp = await fetch(`https://api.100ms.live/v2/templates/${roomData.template_id}`, {
            headers: { Authorization: `Bearer ${mgToken}` }
        });
        const tplData = await tplResp.json();
        console.log('[🔑 HMS] Available roles:', Object.keys(tplData.roles || {}));
    } catch (e) {
        console.warn('[🔑 HMS] Could not fetch roles:', e.message);
    }

    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
        access_key: HMS_ACCESS_KEY,
        type: 'app',
        version: 2,
        room_id: HMS_ROOM_ID,
        user_id: String(userId),
        role: role,
        jti: crypto.randomUUID(), // required by 100ms to prevent replay attacks
        iat: now,
        nbf: now - 60,
        exp: now + 86400,
    };

    const message = `${toBase64url(header)}.${toBase64url(payload)}`;
    const signature = await hmacSign(message, HMS_SECRET);
    const token = `${message}.${signature}`;

    console.log('[🔑 HMS] ✅ Token generated:', token.substring(0, 50) + '...');
    return token;
}
