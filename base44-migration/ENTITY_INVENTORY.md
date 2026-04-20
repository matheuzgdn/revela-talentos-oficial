# Entity Inventory Observado no Código

Este arquivo não descreve o schema oficial das entities. Ele lista apenas:
- entities realmente observadas no código
- operações realmente usadas
- campos vistos em filtros, ordenações, updates ou leitura

Se um campo não aparece aqui, isso não significa que ele não exista no Base44. Significa apenas que este repositório não o confirma.

## Entidades Observadas

### Acesso / usuários

- `User`
  Campos observados: `id`, `email`, `role`, `is_revela_admin`, `profile_picture_url`, `full_name`, `has_zona_membros_access`, `has_plano_carreira_access`, `has_revela_talentos_access`, `onboarding_completed`, `has_seen_welcome`
  Operações observadas: `list`, `filter`, `create`, `update`

- `AccessWhitelist`
  Campos observados: `email`, `is_active`, `expires_at`, `created_date`
  Operações observadas: `filter`

### Conteúdo / membros

- `Content`
  Campos observados: `is_published`, `category`, `display_order`, `created_date`, `title`, `thumbnail_url`, `access_level`, `duration`
  Operações observadas: `list`, `filter`, `create`, `update`, `delete`

- `Comment`
  Campos observados: `content_id`, `created_date`, `comment_text`, `user_id`
  Operações observadas: `filter`, `create`

- `UserProgress`
  Campos observados: `user_id`, `updated_date`
  Operações observadas: `filter`

- `PlatformSettings`
  Campos observados: `setting_key`, `setting_value`, `setting_type`, `description`, `is_active`
  Operações observadas: `list`, `filter`, `create`, `update`

- `LivePlaybackLogs`
  Campos observados: `created_date`
  Operações observadas: `filter`

- `Story`
  Campos observados: `order`
  Operações observadas: `list`, `create`, `update`, `delete`

- `AthleteStory`
  Campos observados: `display_order`
  Operações observadas: `list`, `filter`, `create`, `update`, `delete`

- `Testimonial`
  Campos observados: `is_active`
  Operações observadas: `list`, `filter`, `create`, `update`, `delete`

- `ServiceHighlight`
  Campos observados: `display_order`
  Operações observadas: `list`, `filter`, `create`, `update`, `delete`

### Atleta / performance

- `AthleteUpload`
  Campos observados: `user_id`, `file_type`, `processing_status`, `updated_date`, `created_date`
  Operações observadas: `filter`, `create`, `update`, `delete`

- `AthleteVideo`
  Campos observados: `athlete_id`, `status`, `created_date`
  Operações observadas: `list`, `filter`, `create`, `update`

- `PerformanceData`
  Campos observados: `user_id`, `game_date`, `status`, `updated_date`
  Operações observadas: `filter`, `create`, `update`

- `DailyCheckin`
  Campos observados: `user_id`, `checkin_date`
  Operações observadas: `filter`, `create`

- `WeeklyAssessment`
  Campos observados: `user_id`, `week_start_date`
  Operações observadas: `filter`, `create`

- `AthleteTask`
  Campos observados: `user_id`, `status`
  Operações observadas: `filter`

- `AthleteTrophy`
  Campos observados: `user_id`
  Operações observadas: `filter`

### Comunicação / notificações

- `ChatMessage`
  Campos observados: `user_id`
  Operações observadas: `filter`, `create`

- `Notification`
  Campos observados: `is_read`, `user_id`
  Operações observadas: `filter`, `create`, `update`

- `AdminNotification`
  Campos observados: não confirmados além do create
  Operações observadas: `create`

- `UserNotification`
  Campos observados: não confirmados além do create
  Operações observadas: `create`

### Comercial / CRM / leads

- `Lead`
  Campos observados: não há schema confiável no repositório
  Operações observadas: `list`, `create`

- `InternationalLead`
  Campos observados: não há schema confiável no repositório
  Operações observadas: `list`, `create`

- `LeadInteraction`
  Campos observados: não confirmados além do create
  Operações observadas: `create`

- `LeadPage`
  Campos observados: `url_slug`, `is_active`, `created_date`
  Operações observadas: `list`, `filter`, `create`, `update`, `delete`

- `CRMLead`
  Campos observados: `sales_rep_id`, `current_stage`, `created_date`
  Operações observadas: `list`, `filter`, `create`, `update`

- `CRMPipeline`
  Campos observados: `sales_rep_id`
  Operações observadas: `list`, `filter`, `create`

- `CustomTask`
  Campos observados: `status`, `related_lead_id`, `related_lead_type`, `assigned_user_id`, `updated_date`
  Operações observadas: `list`, `filter`, `create`, `update`

- `SalesMaterial`
  Campos observados: `created_date`
  Operações observadas: `list`, `create`, `update`

- `Marketing`
  Campos observados: `user_id`, `status`, `updated_date`
  Operações observadas: `filter`, `create`, `update`

- `MarketingCampaign`
  Campos observados: `created_date`, `status`
  Operações observadas: `list`, `create`, `update`

- `MarketingMaterial`
  Campos observados: `created_date`
  Operações observadas: `list`, `create`, `delete`

- `MarketingTask`
  Campos observados: `created_date`
  Operações observadas: `list`

- `ContentIdea`
  Campos observados: `created_date`, `status`
  Operações observadas: `list`, `create`, `update`

- `SocialMediaPost`
  Campos observados: `scheduled_date`
  Operações observadas: `list`, `create`, `update`

### Eventos / agenda / seletiva

- `Event`
  Campos observados: `start_date`, `target_users`
  Operações observadas: `list`, `filter`, `create`, `update`, `delete`

- `GameSchedule`
  Campos observados: `game_date`, `user_id`
  Operações observadas: `list`, `filter`, `create`, `update`, `delete`

- `Seletiva`
  Campos observados: `user_id`, `created_date`
  Operações observadas: `list`, `filter`, `create`

- `SeletivaEvent`
  Campos observados: `is_published`, `status`, `created_date`
  Operações observadas: `list`, `filter`, `create`, `update`, `delete`

- `SeletivaApplication`
  Campos observados: `user_id`, `created_date`
  Operações observadas: `list`, `filter`, `create`, `update`

### Produtos / planos

- `SubscriptionPackage`
  Campos observados: `is_active`
  Operações observadas: `filter`, `get`, `create`, `update`, `delete`

- `UserSubscription`
  Campos observados: `user_id`, `status`, `renewal_date`
  Operações observadas: `filter`, `update`

- `InternationalPlan`
  Campos observados: `is_active`, `order`
  Operações observadas: `filter`

### Outras entidades observadas

- `ActivityLog`
  Operações observadas: `list`

- `CareerPost`
  Campos observados: `is_active`, `created_date`
  Operações observadas: `list`, `filter`, `create`, `update`, `delete`

## Totais

- `46` entidades observadas no código
- operações CRUD espalhadas por múltiplos domínios
- schema oficial ainda ausente deste repositório

## Recomendação

Antes de recriar o banco:
- exportar o schema real do Base44
- validar tipos, obrigatoriedades e relações
- confirmar RLS/permissões
- cruzar os campos exportados com esta lista de consumo
