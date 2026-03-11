import axios from 'axios';

async function test() {
    try {
        const appId = '69965fa12ed67581f8d115e7';
        const code = 'Test1234!';
        const email = `test_register_skip_${Date.now()}@example.com`;

        console.log(`Registering user ${email} with password ${code}`);

        // Register user directly
        const res = await axios.post(`https://revelatalentos.base44.app/api/apps/${appId}/auth/register`, {
            email,
            password: code,
            full_name: 'Test Raw Registration',
            skip_verification: true,
            email_verified: true,
            is_verified: true
        });

        console.log('Register Success!', res.data);

        // 2. Test Login via standard endpoint
        console.log('Logging in...');
        const loginRes = await axios.post(`https://revelatalentos.base44.app/api/apps/${appId}/auth/login`, {
            email,
            password: code
        });

        console.log('Login Success!', loginRes.data.user.id);
    } catch (e) {
        console.error('ERROR:', e.message);
        if (e.response) console.error(e.response.data);
    }
}
test();
