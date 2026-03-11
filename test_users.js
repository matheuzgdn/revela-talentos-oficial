import { createClient } from '@base44/sdk';
import axios from 'axios';

async function test() {
    const base44 = createClient({
        appId: '69965fa12ed67581f8d115e7',
        appBaseUrl: 'https://revelatalentos.base44.app'
    });

    // Check if there is an admin create endpoint or similar
    console.log("base44 properties:", Object.keys(base44));
    console.log("base44.users properties:");
    try {
        if (base44.users) {
            console.log(Object.keys(base44.users));
        }
    } catch (e) { }
}
test();
