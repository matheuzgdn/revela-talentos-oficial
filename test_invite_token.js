import { createClient } from '@base44/sdk';
import axios from 'axios';

async function test() {
    try {
        const appId = '69965fa12ed67581f8d115e7';
        const email = `test_invite_token_${Date.now()}@example.com`;

        const base44 = createClient({
            appId,
            appBaseUrl: 'https://revelatalentos.base44.app'
        });

        console.log(`Inviting user ${email}...`);

        // Let's use the explicit raw endpoint first, then SDK.
        const res = await axios.post(`https://revelatalentos.base44.app/api/apps/${appId}/users/invite-user`, {
            user_email: email, role: 'user'
        });

        console.log('Response:', res.data);
    } catch (e) {
        console.error('ERROR:', e.message);
        if (e.response) console.error(e.response.data);
    }
}
test();
