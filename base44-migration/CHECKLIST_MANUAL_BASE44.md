# Checklist Manual no Base44

Este checklist cobre o que precisa sair do Base44 antes do corte final.

## 1. Código e configuração

- Exportar o código mais recente do app no Base44.
- Confirmar se o que está no GitHub/repositório local bate com o que está publicado.
- Rodar `auth pull` no CLI do Base44.
- Rodar `functions pull` no CLI do Base44.
- Documentar qualquer recurso que continue existindo só no painel e não no repositório.

## 2. Dados / entities

- Exportar todas as tabelas/entities em CSV ou no formato disponível.
- Exportar também a entidade de usuários com campos customizados.
- Salvar nome exato de cada entity.
- Salvar tipos de campos, obrigatoriedade e defaults.
- Salvar relações entre entities.
- Salvar índices e ordenações importantes, se o painel mostrar isso.

## 3. Segurança / permissões

- Capturar regras de leitura, criação, edição e exclusão por entity.
- Capturar qualquer regra por papel/role.
- Capturar qualquer regra por usuário atual.
- Capturar qualquer RLS ou policy customizada.
- Tirar screenshot ou exportar a configuração se o Base44 permitir.

## 4. Auth

- Anotar métodos de login realmente ativos.
- Anotar providers sociais ativos.
- Anotar callbacks e redirect URLs.
- Anotar política de convite de usuário.
- Confirmar como usuários são criados hoje.
- Confirmar se existe fluxo de reset de senha e como ele funciona.

## 5. Functions

- Listar todas as backend functions publicadas.
- Para cada uma, guardar nome, inputs, outputs e segredos usados.
- Verificar se existe function usada por automations.
- Exportar o código de todas elas.

## 6. Automations

- Listar todas as automations existentes.
- Salvar trigger, agenda, entity relacionada e ação executada.
- Verificar se alguma automation escreve em tabelas importantes.
- Verificar se alguma automation envia e-mail, IA ou webhooks.

## 7. Storage / arquivos

- Levantar onde estão os uploads de usuários.
- Baixar vídeos, imagens e anexos.
- Verificar se URLs são públicas ou assinadas.
- Mapear quais entities guardam URLs de arquivos.
- Garantir cópia dos arquivos antes de qualquer desligamento.

## 8. Integrações

- Listar integrações de IA configuradas no Base44.
- Listar integrações de e-mail.
- Listar webhooks.
- Listar serviços externos usados por functions.
- Salvar quais secrets/keys existem no painel.

## 9. Domínio e publicação

- Anotar domínio `base44.app` atual.
- Anotar domínio customizado, se houver.
- Anotar redirects ativos.
- Não desligar nem despublicar nada antes da homologação do ambiente novo.

## 10. Validação final antes do corte

- Conferir se schema novo cobre todas as entities usadas.
- Conferir se arquivos foram migrados.
- Conferir se o login novo cobre todos os perfis e permissões.
- Conferir se funções críticas foram recriadas.
- Conferir se automations críticas foram recriadas.

## Atenção Especial

- O segredo do 100ms precisa ser rotacionado.
- O frontend atual expõe lógica sensível de geração de token em `src/lib/hmsUtils.js`.
- O corte do Base44 só deve acontecer depois de storage, auth, schema e functions estarem homologados.
