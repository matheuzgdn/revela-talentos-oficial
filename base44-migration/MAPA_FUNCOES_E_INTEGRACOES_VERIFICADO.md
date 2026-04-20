# Mapa Verificado de Funções, Integrações e Serviços Externos

Este arquivo consolida, com base no código local, as superfícies de backend e integração realmente observadas no app.

Ele complementa:
- [ENTITY_INVENTORY.md](</C:/Users/Admin/revela - Copia/revela-talentos-1/base44-migration/ENTITY_INVENTORY.md>), que lista entities, operações e campos vistos em uso
- [MIGRACAO_BASE44_AUDITORIA.md](</C:/Users/Admin/revela - Copia/revela-talentos-1/base44-migration/MIGRACAO_BASE44_AUDITORIA.md>), que resume o acoplamento estrutural com Base44

## Veredito Sobre o Mapa Colado na Conversa

O mapa fornecido pelo usuário é útil como base, mas não está completo.

O que ficou claramente de fora no código:
- `base44.auth.login(...)`
- `base44.auth.signup(...)`
- `base44.users.inviteUser(...)`
- `base44.integrations.Core.SendEmail(...)`
- `base44.integrations.Core.InvokeLLM(...)`
- bootstrap via `createAxiosClient(...).get('/prod/public-settings/by-id/${appId}')`
- integração externa com `100ms`
- function local [checkHlsUrlHealth.js](</C:/Users/Admin/revela - Copia/revela-talentos-1/cloud-functions/checkHlsUrlHealth.js:1>)
- várias entities e telas administrativas que não apareciam no inventário resumido

## 1. Auth e Bootstrap do App

### `base44.auth.*`

Métodos confirmados:
- `base44.auth.me()`
- `base44.auth.updateMe(data)`
- `base44.auth.logout()`
- `base44.auth.redirectToLogin(url?)`
- `base44.auth.signup(...)`
- `base44.auth.login(email, password)`

Arquivos principais observados:
- [App.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/App.jsx:25>)
- [Layout.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/Layout.jsx:75>)
- [AuthContext.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/lib/AuthContext.jsx:94>)
- [ProfileSetup.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/athlete/ProfileSetup.jsx:263>)
- [ManualRegistrationModal.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/revelatalentos/ManualRegistrationModal.jsx:223>)

Finalidades confirmadas:
- obter o usuário atual
- atualizar campos customizados do usuário
- logout
- redirecionar para login
- cadastro manual
- login manual

### Bootstrap auxiliar via SDK interno

Também existe bootstrap fora de `base44.auth.*`, usando utilitário interno do SDK:

- [AuthContext.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/lib/AuthContext.jsx:24>) cria um `axios client`
- chama `GET /api/apps/public/prod/public-settings/by-id/${appParams.appId}`

Isso é importante para migração porque o app não depende só de `auth.me()`: ele consulta `public settings` do app antes de concluir o estado de autenticação.

## 2. Usuários, Convites e E-mail

### `base44.users.*`

Método confirmado:
- `base44.users.inviteUser(email, "user")`

Arquivo:
- [InviteAthleteModal.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/admin/InviteAthleteModal.jsx:29>)

Finalidade:
- convidar atleta por e-mail via infraestrutura do Base44

### `base44.integrations.Core.SendEmail(...)`

Arquivo:
- [InviteAthleteModal.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/admin/InviteAthleteModal.jsx:39>)

Finalidade:
- envio opcional de e-mail de boas-vindas

Observação:
- [CreateMemberUserModal.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/admin/CreateMemberUserModal.jsx:40>) deixa explícito que, em outro fluxo, o time decidiu evitar `inviteUser` para não disparar e-mails automáticos da plataforma

## 3. Entities do Base44

O uso de entities é muito maior do que o mapa resumido sugeria.

Resumo factual levantado no código:
- `46` entities observadas
- `228` chamadas de métodos `list/filter/get/create/update/delete` encontradas por busca local

As entities confirmadas e suas operações estão documentadas em:
- [ENTITY_INVENTORY.md](</C:/Users/Admin/revela - Copia/revela-talentos-1/base44-migration/ENTITY_INVENTORY.md>)

Algumas entities que ficaram fora do mapa resumido, mas aparecem claramente no código:
- `AthleteVideo`
- `DailyCheckin`
- `WeeklyAssessment`
- `AthleteTask`
- `AthleteTrophy`
- `LeadPage`
- `Story`
- `Testimonial`
- `MarketingCampaign`
- `MarketingMaterial`
- `MarketingTask`
- `SocialMediaPost`
- `ContentIdea`
- `Seletiva`
- `SeletivaEvent`
- `SeletivaApplication`
- `InternationalPlan`
- `LivePlaybackLogs`

Também há uso dinâmico de entity:
- [EscolaParceira.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/pages/EscolaParceira.jsx:335>) usa `base44.entities[entityName].list()`
- [RenderPage.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/pages/RenderPage.jsx:70>) usa `Entity.create(submissionData)` para submissão de formulários dinâmicos

Isso reforça que a migração precisa de uma camada adapter, não de substituições pontuais.

## 4. Storage

### `base44.storage.uploadFile(...)`

Arquivos confirmados:
- [MaterialGallery.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/career/MaterialGallery.jsx:89>)
- [MarketingHub.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/career/MarketingHub.jsx:155>)
- [MeusServicos.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/pages/MeusServicos.jsx:108>)
- [AdminInternationalTab.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/admin/AdminInternationalTab.jsx:126>)
- [ToolsTab.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/admin/crm/ToolsTab.jsx:49>)

Finalidades confirmadas:
- upload de vídeos/fotos de atletas
- upload de materiais comerciais
- upload de anexos para serviços

## 5. Integrações Core do Base44

### `base44.integrations.Core.UploadFile(...)`

Arquivos confirmados:
- [ProfileSetup.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/athlete/ProfileSetup.jsx:259>)
- [VideoUploadModal.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/mobile/VideoUploadModal.jsx:61>)
- [AdminStoriesManagement.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/admin/AdminStoriesManagement.jsx:72>)
- [AdminStoriesTab.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/admin/AdminStoriesTab.jsx:102>)
- [AdminFeaturedAthletesTab.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/admin/AdminFeaturedAthletesTab.jsx:108>)

Finalidades confirmadas:
- upload de foto de perfil
- upload de vídeos
- upload de stories e mídia administrativa

### `base44.integrations.Core.InvokeLLM(...)`

Arquivos confirmados:
- [WeeklyAssessmentChat.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/athlete/WeeklyAssessmentChat.jsx:152>)
- [VideoAnalysisModal.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/athlete/VideoAnalysisModal.jsx:98>)
- [AdminAthleteDetailsModal.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/admin/AdminAthleteDetailsModal.jsx:176>)
- [AdminVideoReviewModal.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/admin/AdminVideoReviewModal.jsx:71>)

Finalidades confirmadas:
- gerar análise de desempenho
- analisar vídeos de atleta
- apoiar revisão/administração com IA

### `base44.integrations.Core.SendEmail(...)`

Arquivo confirmado:
- [InviteAthleteModal.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/admin/InviteAthleteModal.jsx:39>)

Finalidade:
- envio de e-mail de boas-vindas no fluxo de convite

## 6. Analytics e Logs

### `base44.appLogs.logUserInApp(pageName)`

Arquivo:
- [NavigationTracker.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/lib/NavigationTracker.jsx:35>)

Finalidade:
- registrar navegação do usuário por página

## 7. Function Local Encontrada

Function local confirmada:
- [checkHlsUrlHealth.js](</C:/Users/Admin/revela - Copia/revela-talentos-1/cloud-functions/checkHlsUrlHealth.js:1>)

Finalidade:
- receber `POST` com URL HLS
- testar `HEAD`
- se necessário, testar `GET`
- retornar se a URL parece saudável para playback

Status atual observado:
- a function existe localmente
- não encontrei chamada direta a `checkHlsUrlHealth` no `src/`

Isso sugere uma destas hipóteses:
- era chamada por automação/backend e não pelo frontend
- deixou de ser usada
- o frontend que a consumia não está mais neste repositório

## 8. Serviços Externos Fora do Base44

### MyMemory Translation API

Chamada confirmada:
- `fetch('https://api.mymemory.translated.net/get?...')`

Arquivo:
- [ZonaMembros.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/pages/ZonaMembros.jsx:23>)

Finalidade:
- tradução automática pt -> es de texto de conteúdo

### 100ms

Pacotes e arquivos confirmados:
- `@100mslive/react-sdk`
- [hmsUtils.js](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/lib/hmsUtils.js:1>)
- [LiveBroadcaster.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/live/LiveBroadcaster.jsx:19>)
- [LiveViewer.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/live/LiveViewer.jsx:1>)
- [MobileBottomNav.jsx](</C:/Users/Admin/revela - Copia/revela-talentos-1/src/components/mobile/MobileBottomNav.jsx:6>)

Chamadas externas confirmadas:
- `fetch('https://api.100ms.live/v2/rooms/${HMS_ROOM_ID}', ...)`
- `fetch('https://api.100ms.live/v2/templates/${roomData.template_id}', ...)`
- uso de meeting URL `https://${HMS_SUBDOMAIN}.app.100ms.live/...`

Finalidades confirmadas:
- geração de token JWT do 100ms no frontend
- lookup de room/template
- transmissão e visualização de lives

Risco crítico já documentado em outro arquivo:
- o segredo do 100ms está exposto no cliente

## 9. Pontos de Atenção Para a Migração

Os pontos abaixo precisam entrar explicitamente no plano de substituição:

- substituir `base44.auth.*` por auth próprio
- substituir bootstrap de `public-settings` do app
- substituir `base44.users.inviteUser(...)`
- substituir `base44.integrations.Core.SendEmail(...)`
- substituir `base44.integrations.Core.InvokeLLM(...)`
- substituir `base44.storage.uploadFile(...)` e `Core.UploadFile(...)`
- decidir o destino de `base44.appLogs.logUserInApp(...)`
- reconstruir ou aposentar a function `checkHlsUrlHealth`
- mover toda a integração `100ms` para backend seguro
- mapear as entities via adapter, usando [ENTITY_INVENTORY.md](</C:/Users/Admin/revela - Copia/revela-talentos-1/base44-migration/ENTITY_INVENTORY.md>) como referência

## 10. Conclusão

O resumo colado na conversa identifica uma parte importante do backend consumido, mas subestima a superfície real.

Factualmente, o app depende de:
- auth Base44
- bootstrap HTTP auxiliar do SDK
- entities espalhadas por dezenas de telas
- storage do Base44
- integrações Core para upload, IA e e-mail
- convites via `base44.users`
- logging do Base44
- 100ms para lives
- uma API externa de tradução
- ao menos uma cloud function local para HLS

Em outras palavras: a migração não é só "trocar CRUD". Ela envolve auth, storage, IA, e-mail, lives e bootstrap do app.
