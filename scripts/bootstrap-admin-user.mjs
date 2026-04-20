import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const projectRef = 'nttjbhzigaxeohyclsiw';

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

const getServiceRoleKey = async (accessToken) => {
  const response = await globalThis.fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/api-keys?reveal=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to read project API keys (${response.status}).`);
  }

  const keys = await response.json();
  const serviceRoleKey = keys.find((key) => {
    const name = String(key.name || '').toLowerCase();
    return name.includes('service_role') || name.includes('service role');
  })?.api_key;

  if (!serviceRoleKey) {
    throw new Error('Service role key was not returned by the Management API.');
  }

  return serviceRoleKey;
};

const waitForProfile = async (adminClient, email) => {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const { data, error } = await adminClient
      .from('profiles')
      .select('id, email, role, is_revela_admin')
      .ilike('email', email)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return data;
    }

    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  return null;
};

const upsertWhitelist = async (adminClient, email) => {
  const { data: existing, error: findError } = await adminClient
    .from('access_whitelist')
    .select('id')
    .ilike('email', email)
    .limit(1)
    .maybeSingle();

  if (findError) {
    throw findError;
  }

  if (existing?.id) {
    const { error } = await adminClient
      .from('access_whitelist')
      .update({
        email,
        is_active: true,
        expires_at: null,
      })
      .eq('id', existing.id);

    if (error) throw error;
    return existing.id;
  }

  const { data, error } = await adminClient
    .from('access_whitelist')
    .insert({
      email,
      is_active: true,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
};

const upsertInvite = async (adminClient, email, userId) => {
  const { data: existing, error: findError } = await adminClient
    .from('invites')
    .select('id')
    .ilike('email', email)
    .order('created_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (findError) {
    throw findError;
  }

  const payload = {
    email,
    role: 'admin',
    invite_code: randomUUID(),
    status: userId ? 'accepted' : 'pending',
    user_id: userId ?? null,
  };

  if (existing?.id) {
    const { error } = await adminClient
      .from('invites')
      .update(payload)
      .eq('id', existing.id);

    if (error) throw error;
    return existing.id;
  }

  const { data, error } = await adminClient
    .from('invites')
    .insert(payload)
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
};

const main = async () => {
  loadEnv();

  const args = parseArgs();
  const email = String(args.email || '').trim().toLowerCase();
  const password = typeof args.password === 'string' ? args.password : null;
  const fullName = typeof args.name === 'string' ? args.name : 'Administrador';

  if (!email) {
    throw new Error('Use --email para informar o usuario admin.');
  }

  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  const supabaseUrl = process.env.VITE_SUPABASE_URL || `https://${projectRef}.supabase.co`;

  if (!accessToken) {
    throw new Error('SUPABASE_ACCESS_TOKEN is missing. Add it to supabase/.env.local.');
  }

  const serviceRoleKey = await getServiceRoleKey(accessToken);
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  });

  let profile = await waitForProfile(adminClient, email);
  let authUserCreated = false;

  if (!profile && password) {
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    });

    if (error) {
      throw error;
    }

    authUserCreated = Boolean(data.user);
    profile = await waitForProfile(adminClient, email);
  }

  await upsertWhitelist(adminClient, email);

  if (profile?.id) {
    const { data, error } = await adminClient
      .from('profiles')
      .update({
        role: 'admin',
        is_revela_admin: false,
        has_zona_membros_access: true,
        onboarding_completed: true,
        invite_status: 'accepted',
      })
      .eq('id', profile.id)
      .select('id, email, role, is_revela_admin, has_zona_membros_access')
      .single();

    if (error) {
      throw error;
    }

    profile = data;
  }

  await upsertInvite(adminClient, email, profile?.id ?? null);

  const summary = {
    email,
    authUserCreated,
    profileReady: Boolean(profile?.id),
    role: profile?.role ?? 'pending_signup',
    nextStep: profile?.id
      ? 'Admin user is ready to sign in.'
      : 'Email pre-authorized as admin. Complete signup or Google login with the same email.',
  };

  console.log(JSON.stringify(summary, null, 2));
};

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
