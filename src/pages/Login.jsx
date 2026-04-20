import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import AuthCredentialsForm from '@/components/auth/AuthCredentialsForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { completeAuthSessionFromUrl } from '@/api/supabaseClient';
import { createPageUrl } from '@/utils';
import { appClient } from '@/api/backendClient';

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);

const formatOAuthError = (message) => {
  if (!message) return '';

  const normalized = message.toLowerCase();

  if (normalized.includes('unsupported provider') || normalized.includes('provider is not enabled')) {
    return 'O Google ainda nao esta configurado no Auth deste projeto. A tela ja esta pronta, mas o provider precisa ser habilitado no Supabase.';
  }

  if (normalized.includes('invalid request')) {
    return 'O retorno do login externo nao foi aceito pelo projeto. Revise as redirect URLs configuradas no Supabase Auth.';
  }

  return message;
};

export default function LoginPage() {
  const location = useLocation();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [oauthError, setOauthError] = useState('');

  const redirectTarget = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('from_url') || createPageUrl('RevelaTalentos');
  }, [location.search]);

  const goToTarget = () => {
    if (isAbsoluteUrl(redirectTarget)) {
      window.location.href = redirectTarget;
      return;
    }

    window.location.href = redirectTarget.startsWith('/') ? redirectTarget : `/${redirectTarget}`;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const errorMessage =
      searchParams.get('error_description') ||
      searchParams.get('error') ||
      hashParams.get('error_description') ||
      hashParams.get('error');

    if (!errorMessage) return;

    setOauthError(formatOAuthError(decodeURIComponent(errorMessage)));
    window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        try {
          await completeAuthSessionFromUrl();
        } catch (error) {
          console.error('OAuth callback finalization skipped:', error);
        }

        await appClient.auth.me();
        if (isMounted) {
          goToTarget();
        }
      } catch {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [redirectTarget]);

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00E5FF]/20 border-t-[#00E5FF]" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0A] px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,229,255,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(0,102,255,0.18),transparent_30%)]" />
      <div className="absolute left-1/2 top-24 h-48 w-48 -translate-x-1/2 rounded-full bg-[#00E5FF]/10 blur-3xl" />

      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-[#1f2a36] bg-[#0D1117]/95 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.55)] sm:p-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,229,255,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(0,102,255,0.12),transparent_28%)]" />

        <div className="relative mb-8 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#00E5FF]">
            Revela Talentos
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white">
            Login
          </h1>
          <p className="mt-2 text-sm text-[#8a94a6]">
            Entre para continuar na plataforma.
          </p>
          <p className="mt-4 text-sm text-[#8a94a6]">
            Nao tem conta?{' '}
            <Link
              to={createPageUrl('SeletivaOnline')}
              className="font-semibold text-[#00E5FF] transition-colors hover:text-white"
            >
              Inscreva-se agora
            </Link>
          </p>
        </div>

        {oauthError && (
          <Alert className="relative mb-5 border-amber-500/20 bg-amber-500/10 text-amber-100">
            <AlertCircle className="h-4 w-4 text-amber-300" />
            <AlertDescription className="text-sm leading-6 text-amber-100">
              {oauthError}
            </AlertDescription>
          </Alert>
        )}

        <div className="relative">
          <AuthCredentialsForm
            showRegisterHint={false}
            oauthRedirectTarget={redirectTarget}
            onSuccess={() => {
              goToTarget();
            }}
          />
        </div>
      </div>
    </div>
  );
}
