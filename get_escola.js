import { createClient } from '@base44/sdk';
import fs from 'fs';

async function test() {
    const appId = '69965fa12ed67581f8d115e7';
    const appUrl = 'https://revelatalentos.base44.app';
    
    const base44 = createClient({
        appId: appId,
        functionsVersion: '',
        appBaseUrl: appUrl,
        requiresAuth: false
    });

    try {
        const pages = await base44.entities.LeadPage.list();
        pages.forEach(p => console.log(p.url_slug));
    } catch (err) {
        console.error('Base44 Error:', err);
    }
}

test();
