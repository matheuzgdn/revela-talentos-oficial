import axios from 'axios';
import { createClient } from '@base44/sdk';

async function test() {
    try {
        const email = `test_signup_merge_${Date.now()}@example.com`;
        const code = 'Test1234!';
        const appId = '69965fa12ed67581f8d115e7';

        const base44 = createClient({
            appId,
            appBaseUrl: 'https://revelatalentos.base44.app'
        });

        // 1. Admin pre-creates the Database User
        const dbUser = await base44.entities.User.create({
            email, has_zona_membros_access: true,
            full_name: 'Test Merge', language: 'pt', onboarding_completed: true, is_approved: true, role: 'user',
            achievements: '', career_highlights: '', profile_picture_url: '', birth_date: '2000-01-01',
            fifa_attributes: {}, career_stats: {}, jersey_number: '0', height: 0, player_cutout_url: '',
            weight: 0, current_club_crest_url: '', nationality: '', position: '', current_club_name: ''
        });
        console.log(`Pre-created DB User: ${dbUser.id} for ${email}`);

        // 2. Athlete tries to "Sign up"
        const res = await axios.post(`https://revelatalentos.base44.app/api/apps/${appId}/auth/register`, {
            email,
            password: code,
            full_name: 'Test Merge'
        });

        console.log(`Auth Sign up returned User ID: ${res.data.id}`);
        console.log('Is same ID?', dbUser.id === res.data.id);

        // Let's filter User count
        const docs = await base44.entities.User.filter({ email });
        console.log(`Found ${docs.length} Users with ${email}`);
    } catch (e) {
        console.error('ERROR:', e.message);
        if (e.response) console.error(e.response.data);
    }
}
test();
