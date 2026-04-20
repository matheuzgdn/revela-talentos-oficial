/**
 * Backend Cloud Function to check the health of an HLS URL.
 * It performs a HEAD (or GET) request to ensure the stream is available.
 * 
 * Keep this aligned with the current server runtime before deploying.
 */

export default async function checkHlsUrlHealth(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Fetch the URL to verify it returns a 200 OK
        const response = await fetch(url, { method: 'HEAD' });

        if (response.ok) {
            return res.status(200).json({ ok: true, status: response.status });
        } else {
            // Se HEAD falhar, tentar GET básico (alguns servidores CDN não suportam HEAD em HLS)
            const getResponse = await fetch(url, { method: 'GET' });
            if (getResponse.ok) {
                return res.status(200).json({ ok: true, status: getResponse.status });
            }
            return res.status(200).json({ ok: false, status: getResponse.status });
        }
    } catch (error) {
        console.error('Error checking HLS URL:', error);
        return res.status(200).json({ ok: false, status: 500, error: error.message });
    }
}
