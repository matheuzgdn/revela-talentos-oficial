import axios from 'axios';
import { createClient } from '@base44/sdk';

async function test() {
    try {
        const code = 'Test1234!';
        const email = `test_login_auth_${Date.now()}@example.com`;

        // 1. Create User via Base44 SDK (this works)
        const base44 = createClient({
            appId: '69965fa12ed67581f8d115e7',
            appBaseUrl: 'https://revelatalentos.base44.app'
        });

        await base44.entities.User.create({
            email, password: code, has_zona_membros_access: true,
            full_name: 'Test Login', language: 'pt', onboarding_completed: true, is_approved: true, role: 'user',
            achievements: '', career_highlights: '', profile_picture_url: '', birth_date: '2000-01-01',
            fifa_attributes: {}, career_stats: {}, jersey_number: '0', height: 0, player_cutout_url: '',
            weight: 0, current_club_crest_url: '', nationality: '', position: '', current_club_name: ''
        });
        console.log(`Created user ${email} with password ${code}`);

        // 2. Test Login via standard endpoint
        console.log('Logging in...');
        const res = await axios.post('https://revelatalentos.base44.app/api/apps/69965fa12ed67581f8d115e7/auth/login', {
            email,
            password: code
        });

        console.log('Login Success!', res.data);
    } catch (e) {
        console.error('ERROR:', e.message);
        if (e.response) console.error(e.response.data);
    }
}
test();
