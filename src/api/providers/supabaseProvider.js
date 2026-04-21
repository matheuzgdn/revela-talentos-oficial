import { supabase } from '@/api/supabaseClient';

// ── Entity name → Supabase table name mapping ──────────────────────────────
const ENTITY_TABLE = {
  Content: 'content',
  Comment: 'comments',
  UserProgress: 'user_progress',
  Story: 'stories',
  AthleteStory: 'athlete_stories',
  Testimonial: 'testimonials',
  ServiceHighlight: 'service_highlights',
  AthleteUpload: 'athlete_uploads',
  AthleteVideo: 'athlete_videos',
  PerformanceData: 'performance_data',
  DailyCheckin: 'daily_checkins',
  WeeklyAssessment: 'weekly_assessments',
  AthleteTask: 'athlete_tasks',
  AthleteTrophy: 'athlete_trophies',
  ChatMessage: 'chat_messages',
  Notification: 'notifications',
  AdminNotification: 'admin_notifications',
  UserNotification: 'user_notifications',
  Lead: 'leads',
  InternationalLead: 'international_leads',
  LeadInteraction: 'lead_interactions',
  LeadPage: 'lead_pages',
  CrmLead: 'crm_leads',
  CRMLead: 'crm_leads',
  CrmPipeline: 'crm_pipelines',
  CRMPipeline: 'crm_pipelines',
  Pipeline: 'pipelines',
  UserPipeline: 'user_pipelines',
  CustomTask: 'custom_tasks',
  SalesMaterial: 'sales_materials',
  Marketing: 'marketing',
  MarketingCampaign: 'marketing_campaigns',
  MarketingMaterial: 'marketing_materials',
  MarketingTask: 'marketing_tasks',
  ContentIdea: 'content_ideas',
  SocialMediaPost: 'social_media_posts',
  Event: 'events',
  GameSchedule: 'game_schedules',
  Seletiva: 'seletivas',
  SeletivaEvent: 'seletiva_events',
  SeletivaApplication: 'seletiva_applications',
  SubscriptionPackage: 'subscription_packages',
  UserSubscription: 'user_subscriptions',
  InternationalPlan: 'international_plans',
  ActivityLog: 'activity_logs',
  CareerPost: 'career_posts',
  AppLog: 'app_logs',
  LivePlaybackLog: 'live_playback_logs',
  LivePlaybackLogs: 'live_playback_logs',
  Invite: 'invites',
  AccessWhitelist: 'access_whitelist',
  PlatformSettings: 'platform_settings',
  User: 'profiles',
};

const resolveTable = (entityName) =>
  ENTITY_TABLE[entityName] ?? entityName.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '') + 's';

// ── Sort helper ─────────────────────────────────────────────────────────────
// The app sends sort strings like "-created_date" (desc) or "created_date" (asc)
const applySort = (query, sort) => {
  if (!sort) return query;
  const desc = sort.startsWith('-');
  const column = desc ? sort.slice(1) : sort;
  return query.order(column, { ascending: !desc });
};

// ── Filter helper ───────────────────────────────────────────────────────────
// The app sends filters like { user_id: "abc", status: "pending" }
// Also supports $or arrays
const applyFilters = (query, filters) => {
  if (!filters || Object.keys(filters).length === 0) return query;

  for (const [key, value] of Object.entries(filters)) {
    if (key === '$or' && Array.isArray(value)) {
      // Build OR filter string for Supabase
      const orParts = value.map((condition) => {
        return Object.entries(condition)
          .map(([k, v]) => `${k}.eq.${v}`)
          .join(',');
      });
      query = query.or(orParts.join(','));
    } else if (key === '$and' && Array.isArray(value)) {
      for (const condition of value) {
        query = applyFilters(query, condition);
      }
    } else if (Array.isArray(value)) {
      query = query.in(key, value);
    } else if (value === true || value === false) {
      query = query.eq(key, value);
    } else {
      query = query.eq(key, value);
    }
  }

  return query;
};

// ── Throw on Supabase errors ────────────────────────────────────────────────
const throwOnError = (result, context = '') => {
  if (result.error) {
    const err = new Error(result.error.message || `Supabase error${context ? ` (${context})` : ''}`);
    err.status = result.status ?? 500;
    err.data = result.error;
    throw err;
  }
  return result.data;
};

const buildLoginRedirectUrl = (nextPath) => {
  if (typeof window === 'undefined') return null;

  const loginUrl = new URL('/login', window.location.origin);
  if (nextPath) {
    loginUrl.searchParams.set('from_url', nextPath);
  }

  return loginUrl.toString();
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeContentRecord = (record) => {
  if (!record || typeof record !== 'object') return record;

  const normalizedDescription = record.description ?? record.content ?? null;
  const normalizedTop10 = record.is_top_10 ?? record.top_10 ?? false;

  return {
    ...record,
    description: normalizedDescription,
    content: record.content ?? normalizedDescription,
    is_top_10: normalizedTop10,
    top_10: record.top_10 ?? normalizedTop10,
  };
};

const normalizeEntityRecord = (entityName, record) =>
  entityName === 'Content' ? normalizeContentRecord(record) : record;

const normalizeEntityCollection = (entityName, rows) =>
  Array.isArray(rows) ? rows.map((row) => normalizeEntityRecord(entityName, row)) : rows;

const normalizeContentPayload = (payload = {}) => {
  const normalized = { ...payload };

  if ('content' in normalized && !('description' in normalized)) {
    normalized.description = normalized.content;
  }

  if ('description' in normalized && !('content' in normalized)) {
    normalized.content = normalized.description;
  }

  if ('top_10' in normalized && !('is_top_10' in normalized)) {
    normalized.is_top_10 = normalized.top_10;
  }

  if ('is_top_10' in normalized && !('top_10' in normalized)) {
    normalized.top_10 = normalized.is_top_10;
  }

  return normalized;
};

const normalizeEntityPayload = (entityName, payload) =>
  entityName === 'Content' ? normalizeContentPayload(payload) : payload;

const fetchProfileForUser = async (user, { retries = 5, delayMs = 250 } = {}) => {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return data;
    }

    if (attempt < retries - 1) {
      await wait(delayMs);
    }
  }

  const err = new Error('Profile not found');
  err.status = 404;
  throw err;
};

// ── Entity client factory ───────────────────────────────────────────────────
const createEntityClient = (entityName) => {
  const table = resolveTable(entityName);

  return new Proxy({}, {
    get(_, property) {
      if (property === 'list') {
        return async (sort, limit) => {
          let query = supabase.from(table).select('*');
          query = applySort(query, sort);
          if (limit) query = query.limit(limit);
          const result = await query;
          return normalizeEntityCollection(entityName, throwOnError(result, `${entityName}.list`));
        };
      }

      if (property === 'filter') {
        return async (filters = {}, sort, limit) => {
          let query = supabase.from(table).select('*');
          query = applyFilters(query, filters);
          query = applySort(query, sort);
          if (limit) query = query.limit(limit);
          const result = await query;
          return normalizeEntityCollection(entityName, throwOnError(result, `${entityName}.filter`));
        };
      }

      if (property === 'get') {
        return async (id) => {
          const result = await supabase.from(table).select('*').eq('id', id).single();
          return normalizeEntityRecord(entityName, throwOnError(result, `${entityName}.get`));
        };
      }

      if (property === 'me' && entityName === 'User') {
        return auth.me;
      }

      if (property === 'create') {
        return async (payload) => {
          const normalizedPayload = normalizeEntityPayload(entityName, payload);
          const result = await supabase.from(table).insert(normalizedPayload).select().single();
          return normalizeEntityRecord(entityName, throwOnError(result, `${entityName}.create`));
        };
      }

      if (property === 'update') {
        return async (id, payload) => {
          const normalizedPayload = normalizeEntityPayload(entityName, payload);
          const result = await supabase
            .from(table)
            .update(normalizedPayload)
            .eq('id', id)
            .select()
            .single();
          return normalizeEntityRecord(entityName, throwOnError(result, `${entityName}.update`));
        };
      }

      if (property === 'delete') {
        return async (id) => {
          const result = await supabase.from(table).delete().eq('id', id);
          throwOnError(result, `${entityName}.delete`);
          return { success: true };
        };
      }

      // Array-like helpers used by some components
      if (property === Symbol.iterator || property === 'length' ||
          property === 'forEach' || property === 'map' ||
          property === 'find' || property === 'some' || property === 'every') {
        return undefined;
      }

      return undefined;
    }
  });
};

// ── Auth adapter ────────────────────────────────────────────────────────────
const auth = {
  async signup(payload) {
    const { email, password, ...meta } = payload;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: meta.full_name || meta.name || email.split('@')[0],
          ...meta
        }
      }
    });

    if (error) throw error;

    // The trigger on auth.users creates the profile automatically.
    // Wait a moment then fetch the profile.
    const user = data.user;
    if (!user) throw new Error('Signup returned no user');

    const profile = await fetchProfileForUser(user, { retries: 6, delayMs: 300 }).catch(() => null);
    return profile || { id: user.id, email: user.email };
  },

  async login(emailOrPayload, password) {
    const payload =
      typeof emailOrPayload === 'object'
        ? emailOrPayload
        : { email: emailOrPayload, password };

    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password
    });

    if (error) {
      const err = new Error(error.message);
      err.status = 401;
      throw err;
    }

    const profile = await fetchProfileForUser(data.user, { retries: 6, delayMs: 200 }).catch(() => null);
    return profile || { id: data.user.id, email: data.user.email };
  },

  async loginWithGoogle(nextPath) {
    if (typeof window === 'undefined') {
      throw new Error('Google login is only available in the browser.');
    }

    const redirectTo = buildLoginRedirectUrl(nextPath);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account'
        },
        skipBrowserRedirect: true
      }
    });

    if (error) {
      throw error;
    }

    if (!data?.url) {
      throw new Error('Nao foi possivel iniciar o login com Google.');
    }

    window.location.assign(data.url);
    return { redirected: true };
  },

  async me() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session?.user) {
      const err = new Error('Not authenticated');
      err.status = 401;
      throw err;
    }

    return fetchProfileForUser(session.user, { retries: 8, delayMs: 250 });
  },

  async updateMe(payload) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    const user = session?.user;

    if (sessionError || !user) {
      const err = new Error('Not authenticated');
      err.status = 401;
      throw err;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  async logout(redirectTarget) {
    await supabase.auth.signOut();

    if (typeof window !== 'undefined' && redirectTarget) {
      window.location.href = redirectTarget;
    }
  },

  redirectToLogin(nextPath) {
    if (typeof window === 'undefined') return;
    window.location.href = buildLoginRedirectUrl(nextPath);
  }
};

// ── Storage adapter ─────────────────────────────────────────────────────────
const uploadFile = async (rawInput) => {
  const file = rawInput?.file ?? rawInput;
  if (!file) throw new Error('No file provided.');

  const timestamp = Date.now();
  const safeName = (file.name || 'upload.bin').replace(/[^\w.\-]+/g, '_');
  const filePath = `${timestamp}_${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(filePath, file, {
      contentType: file.type || 'application/octet-stream',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);

  const uploadResult = {
    url: publicUrl,
    file_url: publicUrl
  };

  return rawInput?.file ? uploadResult : uploadResult.file_url;
};

// ── Integrations adapter ────────────────────────────────────────────────────
const integrations = {
  Core: {
    UploadFile: uploadFile,

    async SendEmail(payload) {
      // Stub — log only. Replace with Edge Function when ready.
      console.log('[Supabase] SendEmail stub:', payload);
      return { success: true, delivery: { status: 'logged_only', ...payload } };
    },

    async InvokeLLM(payload) {
      // Stub — no LLM configured. Replace with Edge Function when ready.
      const promptText = typeof payload?.prompt === 'string' ? payload.prompt.trim() : '';
      const shortened = promptText
        ? `${promptText.slice(0, 220)}${promptText.length > 220 ? '...' : ''}`
        : 'nenhum prompt enviado';
      return `Modo Supabase ativo. Nenhum provedor de IA configurado ainda. Resumo do pedido: ${shortened}`;
    }
  }
};

// ── Users adapter ───────────────────────────────────────────────────────────
const users = {
  async inviteUser(email, role = 'user') {
    // Create an invite record
    const { data, error } = await supabase
      .from('invites')
      .insert({
        email: email.trim().toLowerCase(),
        role,
        invite_code: crypto.randomUUID(),
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return { invite: data };
  }
};

// ── App logs adapter ────────────────────────────────────────────────────────
const appLogs = {
  async logUserInApp(pageName) {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    await supabase.from('app_logs').insert({
      page_name: pageName || 'unknown',
      user_id: user?.id || null
    });
    return { success: true };
  }
};

// ── Public API (same shape as localProvider) ────────────────────────────────
export const createSupabaseProvider = () => ({
  auth,
  entities: new Proxy({}, {
    get(_, entityName) {
      return createEntityClient(entityName);
    }
  }),
  storage: { uploadFile },
  integrations,
  users,
  appLogs
});
