# Base44 Migration Audit

Este diretório contém uma auditoria conservadora do acoplamento atual com o Base44.

Princípios desta documentação:
- Só marcar como `confirmado` o que aparece no código deste repositório.
- Marcar como `não confirmável localmente` tudo que depende do painel/CLI do Base44.
- Não inventar schema, RLS, automations, functions remotas ou configurações de auth.

Arquivos:
- `MIGRACAO_BASE44_AUDITORIA.md`: diagnóstico técnico do acoplamento com Base44.
- `ENTITY_INVENTORY.md`: entidades observadas no código, com operações e campos vistos em uso.
- `CHECKLIST_MANUAL_BASE44.md`: o que precisa ser extraído manualmente do Base44.
- `VEREDITO_RESPOSTA_BASE44_AI.md`: o que do texto gerado no Base44 pode ser aproveitado e o que deve ser descartado.
- `REVISAO_LOCAL_DISPONIBILIDADE.md`: o que já existe nas pastas locais e o que ainda depende do Base44.
- `BASE44_EXTRACAO_CONFIRMADA_POR_CAPTURAS.md`: schemas e nomes confirmados visualmente nas capturas do editor do Base44.
- `BASE44_SUPERFICIE_API_CONFIRMADA.md`: built-ins, endpoints REST/SDK e confirmações fortes da documentação do Base44, incluindo `User`.
- `MAPA_FUNCOES_E_INTEGRACOES_VERIFICADO.md`: mapa verificado de auth, bootstrap, integrations, storage, logs, serviços externos e function local.

Limites desta auditoria:
- Este repositório não contém o schema oficial das entities do Base44.
- Este repositório não contém as regras de segurança/RLS configuradas no painel.
- Este repositório não traz, de forma confiável, a lista completa de automations e backend functions publicadas.
- Os arquivos existentes no storage do Base44 não podem ser inventariados daqui.

Conclusão prática:
- O frontend pode ser migrado a partir deste repositório.
- O backend precisa ser reconstruído usando este código como mapa de consumo.
- Para uma migração fiel, ainda é obrigatório exportar dados, auth, functions, automations, storage e regras do Base44.
