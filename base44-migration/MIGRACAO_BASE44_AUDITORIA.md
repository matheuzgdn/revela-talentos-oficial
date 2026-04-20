# Auditoria Real de Dependências com Base44

## Resumo Executivo

O aplicativo já é um frontend React/Vite independente do builder em tempo de execução, mas continua fortemente acoplado ao Base44 como backend. Esse acoplamento é estrutural, não cosmético.

Pontos confirmados no código:
- SDK Base44 em `package.json`.
- Plugin Vite do Base44 em `vite.config.js`.
- Cliente central do Base44 em `src/api/base44Client.js`.
- Fluxo de autenticação e bootstrap do app em `src/lib/AuthContext.jsx`.
- Parâmetros de app, token e `app_id` em `src/lib/app-params.js`.
- Uso extensivo de `base44.entities.*`, `base44.auth.*`, `base44.storage.uploadFile`, `base44.integrations.Core.*`, `base44.users.inviteUser` e `base44.appLogs.logUserInApp`.
- Redirecionamentos e lógica específica de domínio Base44 em `src/Layout.jsx`, `src/pages/RevelaTalentos.jsx` e `src/pages/checkout.jsx`.

Conclusão:
- Dá para recriar e migrar o app.
- O repositório local não contém tudo que é necessário para uma migração 1:1.
- O inventário completo do backend ainda depende de export manual do Base44.

## Dependências Confirmadas

### 1. SDK, plugin e parâmetros Base44

Confirmado em:
- `package.json`
- `vite.config.js`
- `src/api/base44Client.js`
- `src/lib/app-params.js`

O projeto depende de:
- `@base44/sdk`
- `@base44/vite-plugin`
- `VITE_BASE44_APP_ID`
- `VITE_BASE44_APP_BASE_URL`
- parâmetros de URL/storage como `app_id`, `access_token`, `app_base_url`, `functions_version`

Impacto de migração:
- remover o plugin do Vite
- trocar o cliente `base44` por um client HTTP/API próprio
- eliminar a lógica de persistência de token e bootstrap específica do Base44

### 2. Auth

Confirmado em:
- `src/App.jsx`
- `src/lib/AuthContext.jsx`
- `src/Layout.jsx`
- `src/components/revelatalentos/ManualRegistrationModal.jsx`
- vários componentes e páginas que chamam `base44.auth.me()`

Operações confirmadas:
- `base44.auth.me()`
- `base44.auth.login(email, password)`
- `base44.auth.signup(...)`
- `base44.auth.updateMe(...)`
- `base44.auth.logout(...)`
- `base44.auth.redirectToLogin(...)`

Campos de usuário confirmados em uso:
- `role`
- `is_revela_admin`
- `profile_picture_url`
- `full_name`
- `has_zona_membros_access`
- `has_plano_carreira_access`
- `has_revela_talentos_access`
- `onboarding_completed`
- `has_seen_welcome`

Impacto de migração:
- substituir todo o fluxo de sessão e usuário atual
- reconstruir permissões e campos customizados do usuário
- reconstruir fluxo de cadastro/login manual

### 3. Entities / banco

Confirmado em:
- `86` arquivos com referência direta a `base44.`
- `46` entidades observadas no código

Operações confirmadas:
- `list`
- `filter`
- `get`
- `create`
- `update`
- `delete`

Limite importante:
- o repositório mostra o consumo das entities, mas não o schema oficial delas
- qualquer documentação de campo que vá além do que aparece no código deve ser tratada como especulação

### 4. Storage / uploads

Confirmado em:
- `src/pages/MeusServicos.jsx`
- `src/components/career/MaterialGallery.jsx`
- `src/components/career/MarketingHub.jsx`
- `src/components/admin/AdminInternationalTab.jsx`
- `src/components/admin/crm/ToolsTab.jsx`
- `src/components/athlete/ProfileSetup.jsx`
- `src/components/mobile/VideoUploadModal.jsx`
- `src/components/admin/AdminStories*.jsx`
- `src/components/admin/AdminFeaturedAthletesTab.jsx`

Operações confirmadas:
- `base44.storage.uploadFile(...)`
- `base44.integrations.Core.UploadFile(...)`

Impacto de migração:
- trocar para storage próprio, por exemplo S3/R2/Supabase Storage/Cloudinary
- migrar URLs já salvas nas entities

### 5. IA / LLM

Confirmado em:
- `src/components/athlete/WeeklyAssessmentChat.jsx`
- `src/components/athlete/VideoAnalysisModal.jsx`
- `src/components/admin/AdminAthleteDetailsModal.jsx`
- `src/components/admin/AdminVideoReviewModal.jsx`

Operação confirmada:
- `base44.integrations.Core.InvokeLLM(...)`

Impacto de migração:
- mover prompts e chamadas para backend próprio
- definir provedor de LLM fora do Base44

### 6. E-mail e convites

Confirmado em:
- `src/components/admin/InviteAthleteModal.jsx`
- `src/components/admin/CreateMemberUserModal.jsx`

Operações confirmadas:
- `base44.users.inviteUser(email, "user")`
- `base44.integrations.Core.SendEmail(...)`

Impacto de migração:
- recriar fluxo de convite e onboarding
- substituir envio de e-mail por serviço externo

### 7. Logs / analytics

Confirmado em:
- `src/lib/NavigationTracker.jsx`

Operação confirmada:
- `base44.appLogs.logUserInApp(pageName)`

Impacto de migração:
- trocar por analytics/logging próprio

### 8. Hardcodes de domínio Base44

Confirmado em:
- `src/Layout.jsx`
- `src/pages/RevelaTalentos.jsx`
- `src/pages/checkout.jsx`
- `.env`
- `.env.local`
- `package.json`

Casos confirmados:
- checagem de `window.location.host.endsWith('base44.app')`
- redirecionamento explícito para `revelatalentos.base44.app`
- `VITE_BASE44_APP_BASE_URL=https://revelatalentos.base44.app`

Impacto de migração:
- remover branchs de comportamento dependentes de `base44.app`
- substituir URL base por domínio próprio

## Riscos Críticos Confirmados

### 1. Segredo do 100ms exposto no frontend

Confirmado em:
- `.env.local`
- `src/lib/hmsUtils.js`

Risco:
- `VITE_HMS_APP_SECRET` está no cliente
- o código gera token de acesso no browser
- isso precisa ir para backend imediatamente e a credencial precisa ser rotacionada

### 2. Schema não presente no repositório

Risco:
- o consumo das entities está visível
- o schema oficial, validações, relações e permissões reais não estão
- qualquer migração direta sem export do painel pode perder regras de negócio

### 3. Credencial de API do Base44 fora do repositório

Confirmado na conversa em 2026-04-17:
- foi fornecido um snippet de inicialização do `@base44/sdk` com `appId` explícito `69e19b3919f766ee492935f4`
- o snippet também usava autenticação por header `api_key`

Risco:
- isso indica que existiu ou existe uma credencial de API utilizável fora do fluxo normal de sessão do frontend
- se essa credencial ainda estiver válida, ela deve ser tratada como comprometida e rotacionada
- o `appId` fornecido na documentação não bate com o fallback local em [app-params.js](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/lib/app-params.js:43>), que hoje aponta para `69965fa12ed67581f8d115e7`
- essa divergência pode significar ambiente antigo, ambiente paralelo, app clonado ou frontend salvo apontando para um projeto diferente do que está sendo documentado

### 4. Dependência espalhada

Risco:
- há dependência Base44 em dezenas de componentes
- isso recomenda migração por adapter/camada de API, não por troca manual pontual

## O Que Não Pode Ser Confirmado Só por Este Repositório

Itens que ainda exigem painel/CLI do Base44:
- schema oficial de todas as entities
- regras de segurança/RLS
- configuração completa de auth e providers
- automations ativas
- backend functions publicadas
- inventário real do storage
- webhooks e integrations configuradas no painel
- dados existentes em produção

## Estratégia Recomendada de Saída

### Fase 1
- congelar escopo
- extrair tudo do Base44
- criar backend próprio
- criar uma camada de API substituta do `base44`
- mover segredos e integrações para backend

### Fase 2
- migrar entidades por domínio
- importar dados
- migrar uploads/storage
- trocar auth
- remover plugin/sdk Base44
- cortar redirecionamentos `base44.app`

### Fase 3
- homologar
- apontar domínio final
- desligar dependências remanescentes do Base44
