import { createPageUrl } from '@/utils';

/**
 * Auth routing for the Supabase-only application flow.
 */

const LOGIN_PATH = '/login';
const ZONA_MEMBROS_PATH = createPageUrl('ZonaMembros');
const ADMIN_PATH = createPageUrl('Admin');
const REVELA_TALENTOS_PATH = createPageUrl('RevelaTalentos');
const PLANO_CARREIRA_PATH = createPageUrl('PlanoCarreira');
const DEFAULT_PLATFORM_ORIGIN = 'https://revelatalentos.com.br';
const KNOWN_PLATFORM_HOSTS = new Set([
  'revelatalentos.com',
  'www.revelatalentos.com',
  'revelatalentos.com.br',
  'www.revelatalentos.com.br',
]);

const parseOrigin = (value) => {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const isKnownPlatformHost = (hostname = '') => KNOWN_PLATFORM_HOSTS.has(String(hostname).toLowerCase());

export const getPlatformOrigin = () => {
  const configuredOrigin = parseOrigin(import.meta.env.VITE_PUBLIC_APP_ORIGIN);
  if (configuredOrigin) {
    return configuredOrigin;
  }

  if (typeof window === 'undefined') {
    return DEFAULT_PLATFORM_ORIGIN;
  }

  const runtimeOrigin = parseOrigin(window.location.origin);
  if (!runtimeOrigin) {
    return DEFAULT_PLATFORM_ORIGIN;
  }

  try {
    const runtimeUrl = new URL(runtimeOrigin);
    return isKnownPlatformHost(runtimeUrl.hostname) ? DEFAULT_PLATFORM_ORIGIN : runtimeOrigin;
  } catch {
    return DEFAULT_PLATFORM_ORIGIN;
  }
};

export const toPlatformUrl = (targetPath = '/', { absolute = true } = {}) => {
  const platformOrigin = getPlatformOrigin();
  const fallbackUrl = new URL(targetPath || '/', platformOrigin);

  try {
    const resolvedUrl = new URL(targetPath || '/', platformOrigin);

    if (isKnownPlatformHost(resolvedUrl.hostname)) {
      const canonicalUrl = new URL(
        `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`,
        platformOrigin,
      );

      return absolute
        ? canonicalUrl.toString()
        : `${canonicalUrl.pathname}${canonicalUrl.search}${canonicalUrl.hash}`;
    }

    return absolute
      ? resolvedUrl.toString()
      : `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
  } catch {
    return absolute
      ? fallbackUrl.toString()
      : `${fallbackUrl.pathname}${fallbackUrl.search}${fallbackUrl.hash}`;
  }
};

export const buildPlatformLoginUrl = (nextPath) => {
  const loginUrl = new URL(LOGIN_PATH, getPlatformOrigin());

  if (nextPath) {
    loginUrl.searchParams.set('from_url', toPlatformUrl(nextPath));
  }

  return loginUrl.toString();
};

const normalizePathname = (targetPath) => {
  if (!targetPath) return '';

  try {
    const url = new URL(targetPath, getPlatformOrigin());
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
  window.location.href = buildPlatformLoginUrl(nextPath);
};
