import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3030);
const DB_FILE = path.join(__dirname, 'data', 'runtime-db.json');
const STORAGE_DIR = path.join(__dirname, 'storage', 'uploads');
const PUBLIC_BASE_PATH = '/uploads';

const defaultDb = () => ({
  meta: {
    version: 1,
    created_at: new Date().toISOString()
  },
  users: [],
  sessions: [],
  entities: {
    PlatformSettings: [
      createEntityRecord('PlatformSettings', {
        setting_key: 'is_platform_restricted',
        setting_value: 'false'
      }),
      createEntityRecord('PlatformSettings', {
        setting_key: 'is_live',
        setting_value: 'false'
      })
    ]
  },
  invites: [],
  mailLog: [],
  appLogs: []
});

const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const { password_hash, ...safeUser } = user;
  return safeUser;
};

const parseJsonSafely = (value, fallback = null) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const createId = (prefix) => `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;

function createEntityRecord(entityName, data, actorId = null) {
  const now = new Date().toISOString();
  return {
    id: createId(entityName.toLowerCase()),
    created_date: now,
    updated_date: now,
    ...(actorId ? { created_by: actorId } : {}),
    ...data
  };
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function ensureDb() {
  await ensureDir(path.dirname(DB_FILE));
  await ensureDir(STORAGE_DIR);

  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify(defaultDb(), null, 2), 'utf8');
  }
}

async function readDb() {
  await ensureDb();
  const content = await fs.readFile(DB_FILE, 'utf8');
  return parseJsonSafely(content, defaultDb()) ?? defaultDb();
}

async function writeDb(db) {
  await ensureDb();
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

function getCollection(db, entityName) {
  if (entityName === 'User') {
    return db.users;
  }

  if (!db.entities[entityName]) {
    db.entities[entityName] = [];
  }

  return db.entities[entityName];
}

function setCollection(db, entityName, nextCollection) {
  if (entityName === 'User') {
    db.users = nextCollection;
    return;
  }

  db.entities[entityName] = nextCollection;
}

function normalizeSortValue(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) {
    return new Date(value).getTime();
  }

  return value;
}

function sortRecords(records, sort) {
  if (!sort) {
    return [...records];
  }

  const isDesc = sort.startsWith('-');
  const field = isDesc ? sort.slice(1) : sort;

  return [...records].sort((left, right) => {
    const a = normalizeSortValue(left[field]);
    const b = normalizeSortValue(right[field]);

    if (a === b) {
      return 0;
    }

    if (a === null || a === undefined) {
      return 1;
    }

    if (b === null || b === undefined) {
      return -1;
    }

    if (a > b) {
      return isDesc ? -1 : 1;
    }

    if (a < b) {
      return isDesc ? 1 : -1;
    }

    return 0;
  });
}

function valuesEqual(actual, expected) {
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) {
      return expected.length === 0 ? actual === undefined || actual === null : false;
    }

    if (actual.length !== expected.length) {
      return false;
    }

    return actual.every((item, index) => valuesEqual(item, expected[index]));
  }

  if (Array.isArray(actual)) {
    return actual.includes(expected);
  }

  return actual === expected;
}

function matchesFilters(record, filters) {
  if (!filters || Object.keys(filters).length === 0) {
    return true;
  }

  return Object.entries(filters).every(([key, expected]) => {
    if (key === '$or' && Array.isArray(expected)) {
      return expected.some((condition) => matchesFilters(record, condition));
    }

    if (key === '$and' && Array.isArray(expected)) {
      return expected.every((condition) => matchesFilters(record, condition));
    }

    return valuesEqual(record[key], expected);
  });
}

function jsonResponse(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(payload));
}

function textResponse(res, statusCode, payload, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*'
  });
  res.end(payload);
}

function notFound(res) {
  jsonResponse(res, 404, { error: 'Not found' });
}

function unauthorized(res) {
  jsonResponse(res, 401, { error: 'Unauthorized' });
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  return parseJsonSafely(rawBody, {});
}

function getRequestBaseUrl(req) {
  const forwardedHost = req.headers['x-forwarded-host'];
  const host = forwardedHost || req.headers.host || `127.0.0.1:${PORT}`;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  return `${protocol}://${host}`;
}

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length);
  }

  return null;
}

function getSession(db, token) {
  if (!token) {
    return null;
  }

  return db.sessions.find((session) => session.token === token) ?? null;
}

function getCurrentUser(db, req) {
  const session = getSession(db, getTokenFromRequest(req));
  if (!session) {
    return null;
  }

  return db.users.find((user) => user.id === session.user_id) ?? null;
}

function upsertEntity(collection, nextRecord) {
  const recordIndex = collection.findIndex((item) => item.id === nextRecord.id);
  if (recordIndex === -1) {
    collection.push(nextRecord);
    return collection;
  }

  collection[recordIndex] = nextRecord;
  return collection;
}

async function handleSignup(req, res) {
  const db = await readDb();
  const body = await readBody(req);
  const { password: _password, confirm_password: _confirmPassword, ...safeBody } = body;
  const email = body.email?.trim()?.toLowerCase();
  const password = body.password;

  if (!email || !password) {
    jsonResponse(res, 400, { error: 'Email and password are required.' });
    return;
  }

  const existingUser = db.users.find((user) => user.email?.toLowerCase() === email);
  if (existingUser) {
    jsonResponse(res, 409, { error: 'User already exists.' });
    return;
  }

  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: createId('user'),
    email,
    full_name: body.full_name || body.name || email.split('@')[0],
    role: body.role || 'user',
    is_approved: body.is_approved ?? true,
    onboarding_completed: body.onboarding_completed ?? false,
    has_revela_talentos_access: body.has_revela_talentos_access ?? false,
    has_plano_carreira_access: body.has_plano_carreira_access ?? false,
    has_zona_membros_access: body.has_zona_membros_access ?? false,
    created_date: now,
    updated_date: now,
    password_hash: passwordHash
  };

  const session = {
    token: createId('session'),
    user_id: user.id,
    created_date: now
  };

  db.users.push({ ...user, ...safeBody, id: user.id, email, password_hash: passwordHash, created_date: now, updated_date: now });
  db.sessions.push(session);
  await writeDb(db);

  jsonResponse(res, 201, {
    access_token: session.token,
    user: sanitizeUser(db.users.find((current) => current.id === user.id))
  });
}

async function handleLogin(req, res) {
  const db = await readDb();
  const body = await readBody(req);
  const email = body.email?.trim()?.toLowerCase();
  const password = body.password;

  const user = db.users.find((item) => item.email?.toLowerCase() === email);
  if (!user || !password || !user.password_hash) {
    unauthorized(res);
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    unauthorized(res);
    return;
  }

  const session = {
    token: createId('session'),
    user_id: user.id,
    created_date: new Date().toISOString()
  };

  db.sessions.push(session);
  await writeDb(db);

  jsonResponse(res, 200, {
    access_token: session.token,
    user: sanitizeUser(user)
  });
}

async function handleAuthMe(req, res) {
  const db = await readDb();
  const user = getCurrentUser(db, req);

  if (!user) {
    unauthorized(res);
    return;
  }

  jsonResponse(res, 200, sanitizeUser(user));
}

async function handleAuthUpdate(req, res) {
  const db = await readDb();
  const user = getCurrentUser(db, req);

  if (!user) {
    unauthorized(res);
    return;
  }

  const body = await readBody(req);
  const nextUser = {
    ...user,
    ...body,
    id: user.id,
    email: body.email ? body.email.toLowerCase() : user.email,
    updated_date: new Date().toISOString()
  };

  db.users = upsertEntity(db.users, nextUser);
  await writeDb(db);

  jsonResponse(res, 200, sanitizeUser(nextUser));
}

async function handleLogout(req, res) {
  const db = await readDb();
  const token = getTokenFromRequest(req);

  if (token) {
    db.sessions = db.sessions.filter((session) => session.token !== token);
    await writeDb(db);
  }

  jsonResponse(res, 200, { success: true });
}

async function handleEntityList(req, res, entityName, url) {
  const db = await readDb();
  const collection = getCollection(db, entityName);
  const sort = url.searchParams.get('sort');
  const limit = Number(url.searchParams.get('limit') || 0);
  const items = sortRecords(collection, sort)
    .slice(0, limit > 0 ? limit : undefined)
    .map((item) => entityName === 'User' ? sanitizeUser(item) : item);

  jsonResponse(res, 200, items);
}

async function handleEntityFilter(req, res, entityName) {
  const db = await readDb();
  const body = await readBody(req);
  const collection = getCollection(db, entityName);
  const sort = body.sort;
  const limit = Number(body.limit || 0);
  const items = sortRecords(collection.filter((item) => matchesFilters(item, body.filters)), sort)
    .slice(0, limit > 0 ? limit : undefined)
    .map((item) => entityName === 'User' ? sanitizeUser(item) : item);

  jsonResponse(res, 200, items);
}

async function handleEntityGet(res, entityName, entityId) {
  const db = await readDb();
  const collection = getCollection(db, entityName);
  const record = collection.find((item) => item.id === entityId);

  if (!record) {
    notFound(res);
    return;
  }

  jsonResponse(res, 200, entityName === 'User' ? sanitizeUser(record) : record);
}

async function handleEntityCreate(req, res, entityName) {
  const db = await readDb();
  const actor = getCurrentUser(db, req);
  const body = await readBody(req);
  const collection = getCollection(db, entityName);

  if (entityName === 'User') {
    const { password: rawPassword, ...safeBody } = body;
    const email = body.email?.trim()?.toLowerCase();
    if (!email) {
      jsonResponse(res, 400, { error: 'Email is required.' });
      return;
    }

    if (db.users.some((user) => user.email?.toLowerCase() === email)) {
      jsonResponse(res, 409, { error: 'User already exists.' });
      return;
    }

    const userRecord = createEntityRecord('user', {
      ...safeBody,
      email,
      role: body.role || 'user',
      is_approved: body.is_approved ?? true,
      password_hash: rawPassword ? await bcrypt.hash(rawPassword, 10) : await bcrypt.hash(createId('pwd'), 10)
    }, actor?.id);

    db.users.push(userRecord);
    await writeDb(db);
    jsonResponse(res, 201, sanitizeUser(userRecord));
    return;
  }

  const record = createEntityRecord(entityName, body, actor?.id);
  collection.push(record);
  setCollection(db, entityName, collection);
  await writeDb(db);
  jsonResponse(res, 201, record);
}

async function handleEntityUpdate(req, res, entityName, entityId) {
  const db = await readDb();
  const body = await readBody(req);
  const { password: rawPassword, ...safeBody } = body;
  const collection = getCollection(db, entityName);
  const currentRecord = collection.find((item) => item.id === entityId);

  if (!currentRecord) {
    notFound(res);
    return;
  }

  const nextRecord = {
    ...currentRecord,
    ...safeBody,
    id: currentRecord.id,
    updated_date: new Date().toISOString()
  };

  if (entityName === 'User' && rawPassword) {
    nextRecord.password_hash = await bcrypt.hash(rawPassword, 10);
  }

  setCollection(db, entityName, upsertEntity(collection, nextRecord));
  await writeDb(db);
  jsonResponse(res, 200, entityName === 'User' ? sanitizeUser(nextRecord) : nextRecord);
}

async function handleEntityDelete(res, entityName, entityId) {
  const db = await readDb();
  const collection = getCollection(db, entityName);
  const nextCollection = collection.filter((item) => item.id !== entityId);

  if (nextCollection.length === collection.length) {
    notFound(res);
    return;
  }

  setCollection(db, entityName, nextCollection);
  await writeDb(db);
  jsonResponse(res, 200, { success: true });
}

async function handleUpload(req, res) {
  const db = await readDb();
  const actor = getCurrentUser(db, req);
  const body = await readBody(req);

  if (!body.filename || !body.dataBase64) {
    jsonResponse(res, 400, { error: 'filename and dataBase64 are required.' });
    return;
  }

  const safeFilename = body.filename.replace(/[^\w.\-]+/g, '_');
  const extension = path.extname(safeFilename) || '.bin';
  const monthPath = new Date().toISOString().slice(0, 7).replace('-', '/');
  const targetDir = path.join(STORAGE_DIR, monthPath);
  await ensureDir(targetDir);

  const fileId = createId('upload');
  const storedFilename = `${fileId}${extension}`;
  const absoluteFilePath = path.join(targetDir, storedFilename);
  const relativeUrl = `${PUBLIC_BASE_PATH}/${monthPath}/${storedFilename}`.replace(/\\/g, '/');
  const fileBuffer = Buffer.from(body.dataBase64, 'base64');

  await fs.writeFile(absoluteFilePath, fileBuffer);

  const uploadRecord = createEntityRecord('upload', {
    original_name: body.filename,
    mime_type: body.mimeType || 'application/octet-stream',
    size_bytes: fileBuffer.byteLength,
    file_url: `${getRequestBaseUrl(req)}${relativeUrl}`,
    relative_url: relativeUrl,
    uploaded_by: actor?.id || null
  }, actor?.id);

  db.entities.Upload = db.entities.Upload || [];
  db.entities.Upload.push(uploadRecord);
  await writeDb(db);

  jsonResponse(res, 201, {
    url: uploadRecord.file_url,
    file_url: uploadRecord.file_url,
    upload: uploadRecord
  });
}

async function handleInvite(req, res) {
  const db = await readDb();
  const body = await readBody(req);
  const email = body.email?.trim()?.toLowerCase();

  if (!email) {
    jsonResponse(res, 400, { error: 'Email is required.' });
    return;
  }

  let invitedUser = db.users.find((user) => user.email?.toLowerCase() === email);
  if (!invitedUser) {
    invitedUser = createEntityRecord('user', {
      email,
      role: body.role || 'user',
      full_name: body.full_name || email.split('@')[0],
      invite_status: 'pending_activation',
      is_approved: true,
      has_revela_talentos_access: false,
      onboarding_completed: false,
      password_hash: await bcrypt.hash(createId('pwd'), 10)
    });
    db.users.push(invitedUser);
  }

  const invite = createEntityRecord('invite', {
    email,
    role: body.role || 'user',
    user_id: invitedUser.id,
    invite_code: createId('invite')
  });

  db.invites.push(invite);
  await writeDb(db);

  jsonResponse(res, 201, { invite, user: sanitizeUser(invitedUser) });
}

async function handleEmail(req, res) {
  const db = await readDb();
  const body = await readBody(req);
  const emailLog = createEntityRecord('mail', {
    ...body,
    status: 'logged_only'
  });

  db.mailLog.push(emailLog);
  await writeDb(db);

  jsonResponse(res, 200, { success: true, delivery: emailLog });
}

async function handleInvokeLlm(req, res) {
  const body = await readBody(req);
  const promptText = typeof body.prompt === 'string' ? body.prompt.trim() : '';
  const shortened = promptText ? `${promptText.slice(0, 220)}${promptText.length > 220 ? '...' : ''}` : 'nenhum prompt enviado';
  jsonResponse(res, 200, {
    text: `Modo local ativo. Nenhum provedor de IA foi configurado ainda. Resumo do pedido: ${shortened}`
  });
}

async function handleAppLog(req, res) {
  const db = await readDb();
  const user = getCurrentUser(db, req);
  const body = await readBody(req);

  db.appLogs.push(createEntityRecord('applog', {
    page_name: body.pageName || 'unknown',
    user_id: user?.id || null
  }, user?.id));

  await writeDb(db);
  jsonResponse(res, 200, { success: true });
}

async function serveUpload(req, res, pathname) {
  const relativePath = pathname.replace(`${PUBLIC_BASE_PATH}/`, '');
  const filePath = path.join(STORAGE_DIR, relativePath);

  try {
    const fileBuffer = await fs.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const contentTypeMap = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.pdf': 'application/pdf'
    };
    textResponse(res, 200, fileBuffer, contentTypeMap[extension] || 'application/octet-stream');
  } catch {
    notFound(res);
  }
}

const server = createServer(async (req, res) => {
  if (!req.url) {
    notFound(res);
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS'
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || `127.0.0.1:${PORT}`}`);
  const pathname = url.pathname;

  try {
    if (pathname === '/api/local/health' && req.method === 'GET') {
      jsonResponse(res, 200, { ok: true, provider: 'local', timestamp: new Date().toISOString() });
      return;
    }

    if (pathname.startsWith(`${PUBLIC_BASE_PATH}/`) && req.method === 'GET') {
      await serveUpload(req, res, pathname);
      return;
    }

    if (pathname === '/api/local/auth/signup' && req.method === 'POST') {
      await handleSignup(req, res);
      return;
    }

    if (pathname === '/api/local/auth/login' && req.method === 'POST') {
      await handleLogin(req, res);
      return;
    }

    if (pathname === '/api/local/auth/me' && req.method === 'GET') {
      await handleAuthMe(req, res);
      return;
    }

    if (pathname === '/api/local/auth/me' && req.method === 'PATCH') {
      await handleAuthUpdate(req, res);
      return;
    }

    if (pathname === '/api/local/auth/logout' && req.method === 'POST') {
      await handleLogout(req, res);
      return;
    }

    if (pathname === '/api/local/upload' && req.method === 'POST') {
      await handleUpload(req, res);
      return;
    }

    if (pathname === '/api/local/users/invite' && req.method === 'POST') {
      await handleInvite(req, res);
      return;
    }

    if (pathname === '/api/local/integrations/email' && req.method === 'POST') {
      await handleEmail(req, res);
      return;
    }

    if (pathname === '/api/local/integrations/llm' && req.method === 'POST') {
      await handleInvokeLlm(req, res);
      return;
    }

    if (pathname === '/api/local/logs/page' && req.method === 'POST') {
      await handleAppLog(req, res);
      return;
    }

    const entityFilterMatch = pathname.match(/^\/api\/local\/entities\/([^/]+)\/filter$/);
    if (entityFilterMatch && req.method === 'POST') {
      await handleEntityFilter(req, res, decodeURIComponent(entityFilterMatch[1]));
      return;
    }

    const entityListMatch = pathname.match(/^\/api\/local\/entities\/([^/]+)$/);
    if (entityListMatch && req.method === 'GET') {
      await handleEntityList(req, res, decodeURIComponent(entityListMatch[1]), url);
      return;
    }

    if (entityListMatch && req.method === 'POST') {
      await handleEntityCreate(req, res, decodeURIComponent(entityListMatch[1]));
      return;
    }

    const entityItemMatch = pathname.match(/^\/api\/local\/entities\/([^/]+)\/([^/]+)$/);
    if (entityItemMatch && req.method === 'GET') {
      await handleEntityGet(res, decodeURIComponent(entityItemMatch[1]), decodeURIComponent(entityItemMatch[2]));
      return;
    }

    if (entityItemMatch && req.method === 'PATCH') {
      await handleEntityUpdate(req, res, decodeURIComponent(entityItemMatch[1]), decodeURIComponent(entityItemMatch[2]));
      return;
    }

    if (entityItemMatch && req.method === 'DELETE') {
      await handleEntityDelete(res, decodeURIComponent(entityItemMatch[1]), decodeURIComponent(entityItemMatch[2]));
      return;
    }

    notFound(res);
  } catch (error) {
    console.error('[local-backend]', error);
    jsonResponse(res, 500, {
      error: error.message || 'Internal server error'
    });
  }
});

server.listen(PORT, () => {
  console.log(`[local-backend] listening on http://127.0.0.1:${PORT}`);
});
