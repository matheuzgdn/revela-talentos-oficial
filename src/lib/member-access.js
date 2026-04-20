import { appClient } from '@/api/backendClient';

export const normalizeInviteEmail = (email = '') => email.trim().toLowerCase();

export const buildZonaMembrosInviteMessage = ({ email, fullName, destinationUrl }) => {
  const safeEmail = normalizeInviteEmail(email);
  const zonaLink = destinationUrl || `${window.location.origin}/ZonaMembros`;

  return `Olá${fullName ? ` ${fullName}` : ''}!

Seu acesso à Zona de Membros da EC10 Talentos foi pré-autorizado.

Para entrar:
1. Acesse ${zonaLink}
2. Clique em "Criar conta" / "Sign up"
3. Cadastre-se usando este mesmo e-mail (${safeEmail})
4. Defina sua senha pessoal

Assim que o cadastro for concluído, o sistema libera seu acesso automaticamente.

Um abraço,
Equipe EC10 Talentos`;
};

export async function authorizeZonaMembrosEmail(email) {
  const normalizedEmail = normalizeInviteEmail(email);

  if (!normalizedEmail) {
    throw new Error('Informe um e-mail válido.');
  }

  const [existingWhitelist, existingInvites] = await Promise.all([
    appClient.entities.AccessWhitelist.filter({ email: normalizedEmail }, '-created_date', 1).catch(() => []),
    appClient.entities.Invite.filter({ email: normalizedEmail }, '-created_date', 1).catch(() => []),
  ]);

  if (existingWhitelist.length > 0) {
    await appClient.entities.AccessWhitelist.update(existingWhitelist[0].id, {
      is_active: true,
      expires_at: null,
    });
  } else {
    await appClient.entities.AccessWhitelist.create({
      email: normalizedEmail,
      is_active: true,
    });
  }

  if (existingInvites.length > 0) {
    await appClient.entities.Invite.update(existingInvites[0].id, {
      role: 'user',
      status: 'pending',
      invite_code: crypto.randomUUID(),
    });
  } else {
    await appClient.users.inviteUser(normalizedEmail, 'user');
  }

  return normalizedEmail;
}
