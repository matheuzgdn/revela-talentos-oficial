import { createClient } from '@base44/sdk';

async function test() {
    const base44 = createClient({
        appId: '69965fa12ed67581f8d115e7',
        functionsVersion: '',
        appBaseUrl: 'https://revelatalentos.base44.app',
        requireAuth: false
    });

    try {
        const code = 'Test1234!';
        const email = `test_login_${Date.now()}@example.com`;

        console.log(`Creating user ${email} with password ${code}...`);

        const res = await base44.entities.User.create({
            email: email,
            password: code,
            full_name: 'Test Login',
            language: 'pt',
            has_zona_membros_access: true,
            onboarding_completed: true,
            is_approved: true,
            role: 'user',
            achievements: '',
            career_highlights: '',
            profile_picture_url: '',
            birth_date: '2000-01-01',
            fifa_attributes: {},
            career_stats: {},
            jersey_number: '0',
            height: 0,
            player_cutout_url: '',
            weight: 0,
            current_club_crest_url: '',
            nationality: '',
            position: '',
            current_club_name: ''
        });

        console.log('User created successfully:', res.id);

        console.log('Attempting to login with the created user...');
        try {
            const loginRes = await base44.auth.login(email, code);
            console.log('Login successful!', loginRes);
        } catch (loginError) {
            console.error('Login failed! Error:', loginError.message);
            if (loginError.response) {
                console.error('Login Error Response:', loginError.response.data);
            }
        }

    } catch (e) {
        console.error('CREATE ERROR', e.message);
        if (e.response) {
            console.error(e.response.data);
        }
    }
}

test();
