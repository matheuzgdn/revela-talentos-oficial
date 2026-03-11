import { createClient } from '@base44/sdk';

async function test() {
    const base44 = createClient({
        appId: '69965fa12ed67581f8d115e7',
        appBaseUrl: 'https://revelatalentos.base44.app'
    });
    console.log(base44.auth.register.toString());
}
test();
