import axios from 'axios';
import { createClient } from '@base44/sdk';
import { appParams } from './src/lib/app-params.js';

async function test() {
    try {
        const email = `test_invite_admin_${Date.now()}@example.com`;

        const base44 = createClient({
            appId: appParams.appId,
            token: appParams.token, // Admin token
            appBaseUrl: appParams.appBaseUrl
        });

        console.log(`Inviting user via SDK: ${email}...`);
        const res = await base44.users.inviteUser(email, 'user');
        console.log('SDK Invite Response:', res.data);
    } catch (e) {
        console.error('ERROR SDK:', e.message);
        if (e.response) console.error(e.response.data);
    }
}
test();
