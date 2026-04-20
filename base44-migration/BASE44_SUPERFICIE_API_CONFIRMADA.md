# Base44 Superfície de API Confirmada

Este arquivo registra o que foi confirmado por documentação do Base44 fornecida diretamente na conversa.

Diferença para os outros arquivos:
- [BASE44_EXTRACAO_CONFIRMADA_POR_CAPTURAS.md](</C:/Users/Admin/revela - Copia/revela-talentos-1/base44-migration/BASE44_EXTRACAO_CONFIRMADA_POR_CAPTURAS.md>) guarda schemas confirmados por prints e blocos brutos.
- Este arquivo foca na `superfície de API`, `built-ins` e em algumas confirmações fortes de schema vindas da documentação gerada do Base44.

## Cliente e Authentication

Documentação fornecida diretamente na conversa em 2026-04-17 confirmou mais um padrão de inicialização do SDK:

```javascript
import { createClient } from '@base44/sdk';

const base44 = createClient({
  appId: "69e19b3919f766ee492935f4",
  headers: {
    "api_key": "[redacted]"
  }
});
```

Confirmações úteis desse trecho:

- o SDK aceita inicialização por `createClient(...)`
- existe suporte a autenticação por `headers.api_key`
- o `appId` informado na documentação fornecida foi `69e19b3919f766ee492935f4`

Divergência importante com o código local:

- o frontend salvo neste repositório usa `src/api/base44Client.js` com `appId`, `token`, `functionsVersion`, `requiresAuth: false` e `appBaseUrl`
- o fallback local em [app-params.js](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/lib/app-params.js:43>) aponta para `69965fa12ed67581f8d115e7`
- portanto, o `appId` da documentação recebida e o `appId` embutido no frontend local não batem

Implicações:

- antes da migração final, precisamos reconciliar qual `appId` representa o ambiente real em produção
- se esse `api_key` ainda estiver ativo, ele deve ser tratado como credencial sensível exposta e precisa ser rotacionado
- esse trecho sugere que parte do acesso ao Base44 podia acontecer sem depender só do fluxo de `access_token` visto no frontend local

## Padrão de API Confirmado

Para várias entities, a documentação confirma este padrão de endpoints:

- `GET /entities/<Entity>` para `list`
- `POST /entities/<Entity>` para `create`
- `DELETE /entities/<Entity>` para `deleteMany`
- `POST /entities/<Entity>/bulk` para `bulkCreate`
- `GET /entities/<Entity>/{id}` para `get`
- `PUT /entities/<Entity>/{id}` para `update`
- `DELETE /entities/<Entity>/{id}` para `delete`
- `PUT /entities/<Entity>/{id}/restore` para `restore`

Também ficou confirmado repetidamente:

- `PUT /entities/<Entity>/bulk` existe no REST, mas `bulk update` não fica disponível no SDK
- `PATCH /entities/<Entity>/update-many` existe no REST, mas `update-many` não fica disponível no SDK

Observação:
- a entity `User`, no material fornecido, apareceu com uma superfície mais curta: `list`, `create`, `get`, `update`, `delete`

## Built-ins Confirmados

A documentação confirma de forma consistente estes campos built-in em várias entities:

- `id`
- `created_date`
- `updated_date`
- `created_by`

Isso vale, por exemplo, para:

- `AthleteUpload`
- `ChatMessage`
- `Content`
- `UserProgress`
- `UserSubscription`
- `PerformanceData`
- `GameSchedule`
- `AnalystProfile`
- `Comment`
- `AdminNotification`
- `UserNotification`
- `SubscriptionPackage`
- `Marketing`
- `CareerPost`
- `Event`
- `Notification`
- `CustomTask`
- `Pipeline`
- `UserPipeline`
- `InternationalLead`
- `Lead`
- `SalesMaterial`
- `LeadInteraction`
- `AdminAuditLog`
- `LeadPageBuilder`
- `ServicePackage`
- `DynamicForm`
- `LeadPage`
- `MarketingTask`
- `SocialMediaPost`
- `TrafficCampaign`
- `CRMService`
- `CRMPipeline`
- `CRMLead`
- `WhatsAppIntegration`
- `MessageTemplate`
- `ProposalTemplate`
- `MarketingCampaign`
- `ContentIdea`
- `MarketingMaterial`
- `Testimonial`
- `PlatformSettings`
- `Seletiva`
- `SeletivaEvent`
- `SeletivaApplication`
- `AthleteStory`
- `ServiceHighlight`
- `AthleteVideo`
- `WeeklyAssessment`
- `DailyCheckin`
- `AthleteTrophy`
- `AthleteTask`
- `FeaturedPlayer`
- `Story`
- `AccessWhitelist`
- `ActivityLog`

## User

O maior ganho desta rodada foi a documentação da entity `User`, porque ela confirma vários campos que no código já apareciam como suspeita, mas ainda não estavam todos consolidados.

Campos confirmados na documentação:

- `email`
- `full_name`
- `role`
- `is_revela_admin`
- `has_revela_talentos_access`
- `has_plano_carreira_access`
- `is_approved`
- `is_featured`
- `has_seen_welcome`
- `profile_picture_url`
- `position`
- `birth_date`
- `nationality`
- `current_club_name`
- `current_club_crest_url`
- `height`
- `weight`
- `foot`
- `jersey_number`
- `previous_clubs`
- `achievements`
- `career_level`
- `total_points`
- `career_stats`
- `fifa_attributes`
- `player_cutout_url`
- `career_highlights`
- `id`
- `created_date`
- `updated_date`
- `created_by`

Campos marcados como `required` na documentação recebida:

- `email`
- `full_name`
- `profile_picture_url`
- `position`
- `birth_date`
- `nationality`
- `current_club_name`
- `current_club_crest_url`
- `height`
- `weight`
- `jersey_number`
- `previous_clubs`
- `achievements`
- `career_stats`
- `fifa_attributes`
- `player_cutout_url`
- `career_highlights`

Observações importantes sobre `User`:

- a documentação confirma `has_revela_talentos_access`, que o app usa amplamente
- a documentação confirma `has_seen_welcome`, que o frontend usa na criação da notificação de boas-vindas
- a documentação confirma `is_approved`, que aparece no fluxo de aprovação pendente
- a documentação confirma `total_points`, `career_stats` e `fifa_attributes`, que já eram fortes suspeitas pelo código
- o campo documentado é `foot`, enquanto várias outras entities usam `preferred_foot`; isso merece atenção na migração
- o enum documentado para `foot` usa `ambos`, enquanto em outras entities aparece `ambidestro`; isso também precisa ser normalizado no backend novo

## Divergências Entre Fontes

O lote mais recente de documentação também deixou visíveis alguns pontos que precisam de normalização na migração:

- `CRMService.service_category`: nas capturas anteriores apareceu `bolsa_clubes`, enquanto na documentação textual apareceu `gestao_clubes`
- `ServicePackage.service_category`: nas capturas anteriores apareceu `material_individual`, enquanto na documentação textual apareceu `mentoria_individual`
- `User` já está fortemente confirmado por documentação textual, mas ainda continua valendo a pena obter uma captura ou JSON bruto do editor para fechar qualquer divergência residual entre docs geradas e schema real

## Entidades com documentação de API recebida na conversa

O material fornecido documentou explicitamente schema e endpoints para estas entities:

- `AthleteUpload`
- `ChatMessage`
- `Content`
- `UserProgress`
- `UserSubscription`
- `PerformanceData`
- `GameSchedule`
- `AnalystProfile`
- `Comment`
- `AdminNotification`
- `UserNotification`
- `SubscriptionPackage`
- `Marketing`
- `CareerPost`
- `Event`
- `Notification`
- `CustomTask`
- `Pipeline`
- `UserPipeline`
- `InternationalLead`
- `InternationalPlan`
- `Lead`
- `SalesMaterial`
- `LeadInteraction`
- `AdminAuditLog`
- `LeadPageBuilder`
- `ServicePackage`
- `DynamicForm`
- `LeadPage`
- `MarketingTask`
- `SocialMediaPost`
- `TrafficCampaign`
- `CRMService`
- `CRMPipeline`
- `CRMLead`
- `WhatsAppIntegration`
- `MessageTemplate`
- `ProposalTemplate`
- `MarketingCampaign`
- `ContentIdea`
- `MarketingMaterial`
- `Testimonial`
- `PlatformSettings`
- `Seletiva`
- `SeletivaEvent`
- `SeletivaApplication`
- `AthleteStory`
- `ServiceHighlight`
- `AthleteVideo`
- `WeeklyAssessment`
- `DailyCheckin`
- `AthleteTrophy`
- `AthleteTask`
- `FeaturedPlayer`
- `Story`
- `ActivityLog`
- `AccessWhitelist`
- `User`

## Implicações Práticas

Com esse material, o projeto agora já tem:

- um inventário forte do schema real do Base44
- confirmação dos campos built-in
- confirmação da superfície REST/SDK de muitas entities
- confirmação do schema amplo da entity `User`

O que ainda falta para fechar a migração com segurança:

- regras de `Security/RLS`
- `automations`
- lista completa de `cloud-functions`
- inventário/export do `storage`
- idealmente, uma captura bruta do schema do `User` diretamente do editor, para conferir divergências entre documentação e JSON
