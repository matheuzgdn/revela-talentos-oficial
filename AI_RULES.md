# AI Project Rules

Este projeto usa React + Vite + Supabase.

## Regras obrigatorias
- Nao alterar `.env*`
- Preservar o alias `@/`
- Antes de editar, ler o arquivo completo e entender o fluxo
- Preferir mudancas pequenas e objetivas
- Nao duplicar imports
- Nao reformatar arquivos inteiros sem necessidade
- Validar com `npm run lint` e `npm run build` quando a mudanca afetar runtime
- Tratar `src/api/backendClient.js` e `src/api/providers/supabaseProvider.js` como a camada oficial de backend
