// 100ms Token Generation
// Strategy: generate a Management Token (same JWT format but type="management")
// then call the official 100ms API to get a valid auth token for the user.
// This guarantees correct token format regardless of any client-side encoding issues.

const HMS_ACCESS_KEY = import.meta.env.VITE_HMS_APP_ACCESS_KEY;
const HMS_SECRET = import.meta.env.VITE_HMS_APP_SECRET;
const HMS_ROOM_ID = import.meta.env.VITE_HMS_ROOM_ID;
const HMS_SUBDOMAIN = import.meta.env.VITE_HMS_SUBDOMAIN;

export const HMS_ROOM_ID_VALUE = HMS_ROOM_ID;
export const HMS_MEETING_URL = `https://${HMS_SUBDOMAIN}.app.100ms.live/streaming/meeting?roomId=${HMS_ROOM_ID}&role=emissora`;

// ─── Internal: build base64url from an object using TextEncoder ───────────────
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

// ─── Internal: sign a JWT with HMAC-SHA256 using Web Crypto API ───────────────
async function signJWT(header, payload, secret) {
    const message = `${objectToBase64url(header)}.${objectToBase64url(payload)}`;
    const keyBytes = new TextEncoder().encode(secret);

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

    const signature = btoa(sigBinary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    return `${message}.${signature}`;
}

// ─── Generate 100ms Management Token (for API calls) ─────────────────────────
async function generateManagementToken() {
    const now = Math.floor(Date.now() / 1000);
    return signJWT(
        { alg: 'HS256', typ: 'JWT' },
        {
            access_key: HMS_ACCESS_KEY,
            type: 'management',
            version: 2,
            iat: now,
            nbf: now - 60,
            exp: now + 3600, // 1 hour
        },
        HMS_SECRET
    );
}

/**
 * Generate a 100ms auth token for a given role by calling the official 100ms API.
 * This is more reliable than signing the auth token locally.
 *
 * @param {string} role - e.g. 'emissora'
 * @param {string} userId - unique user identifier
 * @returns {Promise<string>} auth token
 */
export async function generateHmsToken(role, userId) {
    console.log('[🔑 HMS Token] Generating token via Management API...');
    console.log('[🔑 HMS Token] Access Key:', HMS_ACCESS_KEY);
    console.log('[🔑 HMS Token] Room ID:', HMS_ROOM_ID);
    console.log('[🔑 HMS Token] Role:', role);

    try {
        const managementToken = await generateManagementToken();
        console.log('[🔑 HMS Token] Management token generated');

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
        console.log('[🔑 HMS Token] API response status:', response.status);

        if (!response.ok) {
            console.error('[🔑 HMS Token] API error:', data);
            throw new Error(data?.message || `API error ${response.status}`);
        }

        console.log('[🔑 HMS Token] ✅ Auth token received!');
        return data.token;
    } catch (err) {
        console.error('[🔑 HMS Token] Failed to generate token via API:', err);
        throw err;
    }
}
