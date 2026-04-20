import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const projectRef = 'nttjbhzigaxeohyclsiw';
const defaultRedirects = [
  'http://127.0.0.1:4173/**',
  'http://localhost:4173/**',
  'http://127.0.0.1:5173/**',
  'http://localhost:5173/**',
];

const parseArgs = () => {
  const args = process.argv.slice(2);
  const parsed = {};

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];

    if (!token.startsWith('--')) continue;

    const key = token.slice(2);
    const nextValue = args[index + 1];

    if (!nextValue || nextValue.startsWith('--')) {
      parsed[key] = true;
      continue;
    }

    parsed[key] = nextValue;
    index += 1;
  }

  return parsed;
};

const loadEnv = () => {
  const candidates = [
    path.join(rootDir, '.env.local'),
    path.join(rootDir, 'supabase', '.env.local'),
  ];

  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) continue;

    const parsed = dotenv.parse(fs.readFileSync(filePath, 'utf8'));
    for (const [key, value] of Object.entries(parsed)) {
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
};

const request = async (pathName, init = {}) => {
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('SUPABASE_ACCESS_TOKEN is missing. Add it to supabase/.env.local.');
  }

  const response = await globalThis.fetch(
    `https://api.supabase.com/v1/projects/${projectRef}${pathName}`,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Supabase Management API request failed (${response.status}).`);
  }

  return response.json();
};

const mergeRedirects = (currentValue) => {
  const existing = String(currentValue || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  return Array.from(new Set([...existing, ...defaultRedirects])).join(',');
};

const main = async () => {
  loadEnv();

  const args = parseArgs();
  const clientId = args['client-id'] || process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = args['client-secret'] || process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const siteUrl = args['site-url'] || process.env.APP_SITE_URL || process.env.SITE_URL || null;

  if (!clientId || !clientSecret) {
    throw new Error('Provide --client-id and --client-secret (or env vars GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET).');
  }

  const currentConfig = await request('/config/auth', { method: 'GET' });
  const payload = {
    external_google_enabled: true,
    external_google_client_id: clientId,
    external_google_secret: clientSecret,
    uri_allow_list: mergeRedirects(currentConfig.uri_allow_list),
  };

  if (siteUrl) {
    payload.site_url = siteUrl;
  }

  const updatedConfig = await request('/config/auth', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  console.log(JSON.stringify({
    external_google_enabled: updatedConfig.external_google_enabled,
    site_url: updatedConfig.site_url,
    uri_allow_list: updatedConfig.uri_allow_list,
  }, null, 2));
};

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
