import { createClient } from '@base44/sdk';
import fs from 'fs';

const appId = 'app_l3c2f0f4a2592'; // Using typical from other apps or wait, I need to check .env
const token = fs.readFileSync('.env', 'utf8').match(/VITE_BASE44_APP_ID=(.+)/)?.[1]; // Oh let me just find it in .env

async function test() {
    const envFile = fs.readFileSync('.env', 'utf8');
    const env = Object.fromEntries(envFile.split('\n').map(line => line.split('=').map(s => s.trim())));

    const base44 = createClient({
        appId: env.VITE_BASE44_APP_ID,
        functionsVersion: env.VITE_BASE44_FUNCTIONS_VERSION,
        appBaseUrl: env.VITE_BASE44_APP_BASE_URL,
        requiresAuth: false
    });

    try {
        const contents = await base44.entities.Content.list('-created_date', 1);
        console.log("Contents fetched:", contents.length);
        if (contents.length > 0) {
            const c = contents[0];
            console.log("First content properties:", Object.keys(c));

            const updated = await base44.entities.Content.update(c.id, { is_zona_membros_unlocked: true });
            console.log("Updated content properties:", Object.keys(updated));
            console.log("is_zona_membros_unlocked value:", updated.is_zona_membros_unlocked);

            const refetched = await base44.entities.Content.get(c.id);
            console.log("Refetched is_zona_membros_unlocked value:", refetched.is_zona_membros_unlocked);
        }
    } catch (err) {
        console.error("Base44 Error:", err);
    }
}

test();
