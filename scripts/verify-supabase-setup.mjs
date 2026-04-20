import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const readText = (relativePath) => {
  const absolutePath = path.join(rootDir, relativePath);
  return fs.readFileSync(absolutePath, 'utf8');
};

const fileExists = (relativePath) => fs.existsSync(path.join(rootDir, relativePath));
const runtimeTargets = [
  'src',
  'public',
  'package.json',
  'package-lock.json',
  'vite.config.js',
  'index.html',
  '.env',
  '.env.example',
  '.env.local',
];

const collectFiles = (relativePath) => {
  const absolutePath = path.join(rootDir, relativePath);

  if (!fs.existsSync(absolutePath)) {
    return [];
  }

  const stat = fs.statSync(absolutePath);

  if (stat.isFile()) {
    return [absolutePath];
  }

  const files = [];
  for (const entry of fs.readdirSync(absolutePath, { withFileTypes: true })) {
    const entryPath = path.join(absolutePath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(path.relative(rootDir, entryPath)));
    } else {
      files.push(entryPath);
    }
  }

  return files;
};

const env = fileExists('.env.local')
  ? dotenv.parse(readText('.env.local'))
  : {};

const requiredPublicVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_HMS_ROOM_ID',
  'VITE_HMS_SUBDOMAIN',
];

const missingPublicVars = requiredPublicVars.filter((name) => !env[name]);
const hasLegacyHmsFrontendSecret = Boolean(env.VITE_HMS_APP_ACCESS_KEY);

const supabaseUrl = env.VITE_SUPABASE_URL || '';
const projectRefMatch = supabaseUrl.match(/^https:\/\/([a-z0-9-]+)\.supabase\.co$/i);
const projectRef = projectRefMatch?.[1] || null;

const providerSource = readText('src/api/providers/supabaseProvider.js');
const entityTableBlockMatch = providerSource.match(/const ENTITY_TABLE = \{([\s\S]*?)\n\};/);
const entityTableSource = entityTableBlockMatch?.[1] || '';
const entityTableMatches = entityTableSource.matchAll(/^\s*([A-Za-z][A-Za-z0-9_]*)\s*:\s*'([a-z0-9_]+)'/gm);
const mappedTables = new Set();

for (const match of entityTableMatches) {
  mappedTables.add(match[2]);
}

mappedTables.add('profiles');
mappedTables.add('invites');
mappedTables.add('app_logs');
mappedTables.add('live_playback_logs');

const schemaSource = readText('supabase/schema.sql');
const schemaTables = new Set(
  Array.from(schemaSource.matchAll(/create table if not exists public\.([a-z0-9_]+)/gi)).map(
    (match) => match[1],
  ),
);

const missingTables = Array.from(mappedTables).filter((table) => !schemaTables.has(table));

const bucketConfigured =
  /insert into storage\.buckets[\s\S]*'uploads'/i.test(schemaSource) ||
  /insert into storage\.buckets[\s\S]*'uploads'/i.test(readText('supabase/schema_storage.sql'));

const functionPath = 'supabase/functions/generate-hms-token/index.ts';
const functionSource = fileExists(functionPath) ? readText(functionPath) : '';
const requiredFunctionSecrets = [
  'HMS_APP_ACCESS_KEY',
  'HMS_APP_SECRET',
  'HMS_ROOM_ID',
  'HMS_SUBDOMAIN',
];
const missingFunctionSecrets = requiredFunctionSecrets.filter(
  (secretName) => !functionSource.includes(secretName),
);

const migrationFiles = fileExists('supabase/migrations')
  ? fs.readdirSync(path.join(rootDir, 'supabase/migrations')).filter((name) => name.endsWith('.sql'))
  : [];
const runtimeBase44Patterns = [
  /@base44/i,
  /\bVITE_BASE44\b/i,
  /\bBASE44\b/i,
  /base44\.app/i,
  /revelatalentos\.base44\.app/i,
  /@\/api\/base44Client/i,
];

const runtimeFiles = runtimeTargets.flatMap((target) => collectFiles(target));
const runtimeBase44Hits = [];

for (const absolutePath of runtimeFiles) {
  const source = fs.readFileSync(absolutePath, 'utf8');
  const relativePath = path.relative(rootDir, absolutePath).replaceAll('\\', '/');

  for (const pattern of runtimeBase44Patterns) {
    if (pattern.test(source)) {
      runtimeBase44Hits.push(relativePath);
      break;
    }
  }
}

const problems = [];

if (missingPublicVars.length > 0) {
  problems.push(`Missing public env vars: ${missingPublicVars.join(', ')}`);
}

if (!projectRef) {
  problems.push('Could not derive project ref from VITE_SUPABASE_URL.');
}

if (missingTables.length > 0) {
  problems.push(`Schema is missing mapped tables: ${missingTables.join(', ')}`);
}

if (!bucketConfigured) {
  problems.push('Uploads storage bucket is not configured in schema files.');
}

if (!fileExists(functionPath)) {
  problems.push('Missing generate-hms-token edge function.');
}

if (missingFunctionSecrets.length > 0) {
  problems.push(`Edge function is missing expected secret references: ${missingFunctionSecrets.join(', ')}`);
}

if (migrationFiles.length === 0) {
  problems.push('No SQL migrations found in supabase/migrations.');
}

if (fileExists('src/api/base44Client.js')) {
  problems.push('Legacy runtime shim src/api/base44Client.js still exists.');
}

if (runtimeBase44Hits.length > 0) {
  problems.push(`Runtime files still reference Base44: ${runtimeBase44Hits.join(', ')}`);
}

console.log('Supabase verification summary');
console.log(`- Project ref: ${projectRef || 'not detected'}`);
console.log(`- Public env vars present: ${requiredPublicVars.length - missingPublicVars.length}/${requiredPublicVars.length}`);
console.log(`- Mapped tables checked: ${mappedTables.size}`);
console.log(`- Tables found in schema snapshot: ${schemaTables.size}`);
console.log(`- SQL migrations found: ${migrationFiles.length}`);
console.log(`- Edge function present: ${fileExists(functionPath) ? 'yes' : 'no'}`);
console.log(`- Upload bucket configured: ${bucketConfigured ? 'yes' : 'no'}`);
console.log(`- Runtime files scanned for legacy refs: ${runtimeFiles.length}`);

if (hasLegacyHmsFrontendSecret) {
  console.warn('- Warning: .env.local still contains VITE_HMS_APP_ACCESS_KEY, which is legacy and should stay out of the frontend.');
}

if (problems.length > 0) {
  console.error('\nProblems found:');
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  process.exit(1);
}

console.log('\nSupabase setup looks consistent.');
