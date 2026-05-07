import { createPageUrl } from '@/utils';

/**
 * Auth routing for the Supabase-only application flow.
 */

const LOGIN_PATH = '/login';
const ZONA_MEMBROS_PATH = createPageUrl('ZonaMembros');
const ADMIN_PATH = createPageUrl('Admin');
const REVELA_TALENTOS_PATH = createPageUrl('RevelaTalentos');
const PLANO_CARREIRA_PATH = createPageUrl('PlanoCarreira');

const normalizePathname = (targetPath) => {
  if (!targetPath) return '';

  try {
    const url = new URL(targetPath, typeof window !== 'undefined' ? window.location.origin : 'https://example.com');
    return url.pathname || '';
  } catch {
    return targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
  }
};

export const isAdminUser = (user) => user?.role === 'admin' || user?.is_revela_admin === true;

export const getDefaultAuthenticatedPath = (user) => {
  if (isAdminUser(user)) {
    return ADMIN_PATH;
  }

  if (user?.has_zona_membros_access) {
    return ZONA_MEMBROS_PATH;
  }

  if (user?.has_plano_carreira_access) {
    return PLANO_CARREIRA_PATH;
  }

  return REVELA_TALENTOS_PATH;
};

export const resolveAuthenticatedRedirectPath = (user, requestedPath) => {
  const normalizedRequestedPath = normalizePathname(requestedPath);

  if (!normalizedRequestedPath || normalizedRequestedPath === LOGIN_PATH) {
    return getDefaultAuthenticatedPath(user);
  }

  if (isAdminUser(user) && normalizedRequestedPath === ZONA_MEMBROS_PATH) {
    return ADMIN_PATH;
  }

  return normalizedRequestedPath;
};

export const redirectToPlatformLogin = (nextPath) => {
  if (typeof window === 'undefined') return;

  const loginUrl = new URL(LOGIN_PATH, window.location.origin);

  if (nextPath) {
    loginUrl.searchParams.set('from_url', nextPath);
  }

  window.location.href = loginUrl.toString();
};
