import { createClient } from '@base44/sdk';

async function test() {
    const base44 = createClient({
        appId: '69965fa12ed67581f8d115e7',
        // What if appBaseUrl is not provided
    });
    console.log(base44.auth.redirectToLogin.toString());
}
test();
