# Guia de Trabalho com o App Revela Talentos

## Visao Geral

- nome: Revela Talentos
- stack principal: React 18 + Vite + Tailwind + Supabase
- backend oficial: Supabase Auth, Postgres, Storage e Edge Functions
- objetivo: gerir atletas, conteudos, lives, CRM e jornadas administrativas

## Arquitetura Atual

- `src/api/backendClient.js` expõe o client oficial do app
- `src/api/providers/supabaseProvider.js` concentra a adaptacao CRUD para as tabelas
- `src/lib/AuthContext.jsx` coordena sessao e perfil
- `supabase/functions/` guarda funcoes server-side sensiveis
- `src/components/` e `src/pages/` concentram a UI da plataforma

## Como pensar em mudancas

1. Descobrir em qual pagina ou componente o fluxo roda.
2. Verificar se os dados vem de `appClient.entities.*`, `appClient.auth.*` ou `appClient.storage.*`.
3. Confirmar se a tabela/entidade ja existe no provider do Supabase.
4. Alterar o minimo necessario para manter o comportamento atual.
5. Validar com `npm run lint` e `npm run build`.

## Regras praticas

- Nao reintroduzir imports de clientes legados.
- Nao colocar segredos no frontend.
- Para uploads, usar `appClient.storage.uploadFile(...)`.
- Para auth, usar `appClient.auth.*`.
- Para CRUD, usar `appClient.entities.<Entidade>.*`.
- Se uma entidade nao existir no provider, mapear primeiro em `supabaseProvider.js`.

## Design e UX

- preservar o dark theme do produto
- manter a linguagem visual do app existente
- evitar mudancas de layout fora do escopo
- quando mexer em texto visivel, manter coerencia com PT-BR e ES quando aplicavel

## Validacao minima

```bash
npm run lint
npm run build
```

Se build e lint passarem, a mudanca esta pronta para revisao funcional.
