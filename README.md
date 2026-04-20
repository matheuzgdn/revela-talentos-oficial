# Revela Talentos

Frontend React/Vite da plataforma Revela Talentos com backend oficial em Supabase.

## Arquitetura Atual

- autenticacao: Supabase Auth
- banco: PostgreSQL via Supabase
- storage: Supabase Storage
- funcoes sensiveis: Supabase Edge Functions
- frontend: React + Vite

O app roda hoje apenas sobre a stack do Supabase no runtime.

## Desenvolvimento

1. Instale as dependencias com `npm install`
2. Configure o `.env.local`
3. Rode o projeto com `npm run dev`
4. Valide a configuracao com `npm run supabase:verify`

## Variaveis de ambiente do frontend

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon
VITE_HMS_ROOM_ID=room_id_publico
VITE_HMS_SUBDOMAIN=seu-subdominio-100ms
```

## Segredos do Supabase

Para a funcao `generate-hms-token`, configure estes secrets no Supabase:

```bash
HMS_APP_ACCESS_KEY=sua_access_key
HMS_APP_SECRET=seu_secret
HMS_ROOM_ID=room_id
HMS_SUBDOMAIN=seu-subdominio-100ms
```

## Edge Function de live

A funcao `supabase/functions/generate-hms-token` gera o token do 100ms no backend para que o segredo nao fique exposto no frontend.

## Fluxo de deploy do Supabase

O caminho oficial agora e:

1. `npm run supabase:verify`
2. `npm run supabase:login`
3. `npm run supabase:link`
4. `npm run supabase:db:push`
5. configurar os secrets `HMS_APP_ACCESS_KEY`, `HMS_APP_SECRET`, `HMS_ROOM_ID` e `HMS_SUBDOMAIN`
6. `npm run supabase:functions:deploy`

Mais detalhes operacionais estao em `supabase/README.md`.

## Deploy na Vercel

O repositorio ja esta preparado para ser conectado direto na Vercel:

- framework: `Vite`
- comando de build: `npm run build`
- output: `dist`
- SPA rewrite: configurado em `vercel.json` para suportar rotas como `/login`, `/RevelaTalentos` e `/ZonaMembros`

### Variaveis de ambiente na Vercel

Cadastre estas variaveis no painel do projeto:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon
VITE_HMS_ROOM_ID=room_id_publico
VITE_HMS_SUBDOMAIN=seu-subdominio-100ms
```

### Depois do primeiro deploy

Quando a Vercel gerar a URL final do app, atualize o Supabase Auth para esse dominio:

```bash
npm run supabase:configure-google -- --site-url https://seu-dominio.com
```

Esse comando agora atualiza:

- `site_url`
- redirects do Google no dominio de producao
- redirects locais de desenvolvimento

Se voce usar um dominio customizado e tambem `www`, rode o comando uma vez para cada base de URL que deseja liberar.

## Observacoes

- a pasta de migracao historica permanece apenas como referencia tecnica
- o diretorio `backend/` nao faz parte do fluxo ativo do frontend Supabase-only
