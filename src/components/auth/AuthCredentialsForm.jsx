import React, { useMemo, useState } from 'react';
import { appClient } from '@/api/backendClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const GoogleMark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="#EA4335"
      d="M12.24 10.286v3.984h5.65c-.248 1.285-.992 2.374-2.109 3.107l3.414 2.65c1.988-1.832 3.132-4.528 3.132-7.734 0-.733-.066-1.438-.187-2.121H12.24Z"
    />
    <path
      fill="#34A853"
      d="M12 22c2.835 0 5.215-.937 6.953-2.528l-3.414-2.65c-.948.638-2.16 1.016-3.539 1.016-2.725 0-5.034-1.842-5.858-4.318H2.615v2.733A10 10 0 0 0 12 22Z"
    />
    <path
      fill="#4A90E2"
      d="M6.142 13.52A5.99 5.99 0 0 1 5.814 11.6c0-.666.115-1.313.328-1.92V6.948H2.615A10 10 0 0 0 2 11.6c0 1.61.385 3.135 1.068 4.653l3.074-2.733Z"
    />
    <path
      fill="#FBBC05"
      d="M12 5.362c1.541 0 2.924.53 4.014 1.573l3.01-3.01C17.21 2.24 14.83 1.2 12 1.2A10 10 0 0 0 2.615 6.948L6.142 9.68C6.966 7.204 9.275 5.362 12 5.362Z"
    />
  </svg>
);

const normalizeAuthError = (error, fallback) => {
  const rawMessage = error?.message || fallback;
  const normalized = rawMessage.toLowerCase();

  if (normalized.includes('invalid login credentials')) {
    return 'E-mail ou senha invalidos.';
  }

  if (normalized.includes('email not confirmed')) {
    return 'Confirme seu e-mail antes de entrar.';
  }

  if (normalized.includes('unsupported provider') || normalized.includes('provider is not enabled')) {
    return 'O login com Google ainda nao esta habilitado no Supabase deste projeto.';
  }

  return rawMessage;
};

export default function AuthCredentialsForm({
  submitLabel = 'Entrar',
  helperText,
  showRegisterHint = true,
  oauthRedirectTarget,
  onSuccess
}) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const isBusy = useMemo(
    () => isLoading || isGoogleLoading,
    [isGoogleLoading, isLoading]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Preencha e-mail e senha.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = await appClient.auth.login(formData.email, formData.password);
      await onSuccess?.(user);
    } catch (err) {
      setError(normalizeAuthError(err, 'Nao foi possivel entrar com esse e-mail e senha.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError('');

    try {
      await appClient.auth.loginWithGoogle(oauthRedirectTarget);
    } catch (err) {
      setError(normalizeAuthError(err, 'Nao foi possivel iniciar o login com Google.'));
      setIsGoogleLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="border-red-500/20 bg-red-500/10 text-red-100">
          <AlertDescription className="text-sm text-red-100">{error}</AlertDescription>
        </Alert>
      )}

      {helperText && (
        <p className="text-sm leading-relaxed text-[#8a94a6]">
          {helperText}
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={isBusy}
        className="h-12 w-full rounded-2xl border-[#263241] bg-[#111822] text-sm font-semibold text-white hover:border-[#00E5FF]/50 hover:bg-[#141d28]"
      >
        {isGoogleLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Redirecionando para o Google...
          </>
        ) : (
          <>
            <GoogleMark />
            Continuar com Google
          </>
        )}
      </Button>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#1f2a36]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#0D1117] px-3 text-[11px] uppercase tracking-[0.28em] text-[#5f6b7c]">
            ou
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#d8e1ee]">
          E-mail
        </label>
        <Input
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={(event) => {
            setError('');
            setFormData((current) => ({ ...current, email: event.target.value }));
          }}
          placeholder="voce@email.com"
          className="h-12 rounded-2xl border-[#1f2a36] bg-[#111822] text-white placeholder:text-[#5f6b7c]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#d8e1ee]">
          Senha
        </label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={formData.password}
            onChange={(event) => {
              setError('');
              setFormData((current) => ({ ...current, password: event.target.value }));
            }}
            placeholder="Sua senha"
            className="h-12 rounded-2xl border-[#1f2a36] bg-[#111822] pr-12 text-white placeholder:text-[#5f6b7c]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#6e7a8c] transition hover:text-white"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#00E5FF] to-[#0066FF] text-sm font-black text-black shadow-[0_18px_40px_rgba(0,229,255,0.22)] hover:from-[#21ecff] hover:to-[#1d74ff]"
        disabled={isBusy}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Entrando...
          </>
        ) : (
          submitLabel
        )}
      </Button>

      {showRegisterHint && (
        <p className="text-center text-xs leading-relaxed text-[#6e7a8c]">
          Use o fluxo oficial de cadastro para criar sua conta.
        </p>
      )}
    </form>
  );
}
