import { createClient } from '@base44/sdk';

async function test() {
    const base44 = createClient({
        appId: '69965fa12ed67581f8d115e7',
        functionsVersion: '',
        appBaseUrl: 'https://revelatalentos.base44.app',
        requiresAuth: false
    });

    try {
        const code = 'AABB1122';
        const res = await base44.entities.User.create({
            email: 'test_silent_reg_123456@example.com',
            password: code,
            full_name: 'Test Silent',
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
        console.log('CREATED SUCCESSFULLY', res.id);
    } catch (err) {
        console.error("Base44 Error:", err.message, err.response?.data);
    }
}

test();
