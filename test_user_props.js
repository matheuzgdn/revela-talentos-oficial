import { createClient } from '@base44/sdk';

async function test() {
    try {
        const base44 = createClient({
            appId: '69965fa12ed67581f8d115e7',
            appBaseUrl: 'https://revelatalentos.base44.app'
        });

        const docs = await base44.entities.User.filter({ email: 'test_login_bcrypt_1773209591456@example.com' });
        console.log(docs[0]);
    } catch (e) {
        console.error('ERROR:', e.message);
    }
}
test();
