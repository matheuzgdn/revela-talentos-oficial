import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, Lock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DatacenterDocumentation() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    setIsLoading(true);
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      // Apenas admin geral tem acesso
      if (currentUser?.role === 'admin') {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      setUser(null);
      setHasAccess(false);
    }
    setIsLoading(false);
  };

  const downloadDocumentation = () => {
    const element = document.createElement('a');
    const file = new Blob([document.getElementById('documentation-content').innerText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'EC10_Talentos_Documentacao_Completa.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <Lock className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h1>
          <p className="text-gray-400">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Shield className="w-10 h-10 text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold">Documentação Completa - EC10 Talentos</h1>
              <p className="text-gray-400">Acesso Exclusivo: Administrador</p>
            </div>
          </div>
          <Button onClick={downloadDocumentation} className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Baixar Documentação
          </Button>
        </div>

        <div id="documentation-content" className="bg-gray-900 border border-gray-800 rounded-lg p-8 font-mono text-sm leading-relaxed whitespace-pre-wrap">
{`
════════════════════════════════════════════════════════════════════════════════
                        EC10 TALENTOS - DOCUMENTAÇÃO COMPLETA
                     PLATAFORMA DE GESTÃO E DESENVOLVIMENTO DE ATLETAS
════════════════════════════════════════════════════════════════════════════════

📅 Última Atualização: ${new Date().toLocaleDateString('pt-BR')}
🔒 Classificação: CONFIDENCIAL - USO INTERNO
👤 Proprietário: Administração EC10 Talentos

════════════════════════════════════════════════════════════════════════════════
                            1. VISÃO GERAL DA PLATAFORMA
════════════════════════════════════════════════════════════════════════════════

1.1 MISSÃO
----------
Desenvolver e gerenciar a carreira de atletas de futebol através de tecnologia 
avançada, análise de dados profissional, conteúdo educacional de alta qualidade 
e networking internacional.

1.2 VALORES FUNDAMENTAIS
-------------------------
• Excelência no desenvolvimento atlético
• Transparência na gestão de carreira
• Tecnologia como facilitador
• Educação cont[...CONTENT TRUNCATED FOR BREVITY...]

════════════════════════════════════════════════════════════════════════════════
                           2. ARQUITETURA DO SISTEMA
════════════════════════════════════════════════════════════════════════════════

2.1 STACK TECNOLÓGICO
---------------------
• Frontend: React.js 18+
• UI Framework: Tailwind CSS + shadcn/ui
• Animações: Framer Motion
• Roteamento: React Router DOM
• State Management: React Hooks + TanStack Query
• Backend: Base44 Platform (Serverless)
• Banco de Dados: PostgreSQL (via Base44)
• Autenticação: Base44 Auth (OAuth Google)
• Storage: Supabase Storage
• CDN: CloudFlare
• Streaming: OneStream.live

2.2 PADRÃO DE ARQUITETURA
--------------------------
• Component-Based Architecture
• Atomic Design Principles
• Custom Hooks para lógica reutilizável
• Context API para estados globais
• Lazy Loading para otimização

2.3 SEGURANÇA
-------------
• Autenticação OAuth 2.0
• HTTPS obrigatório
• LGPD Compliant
• Proteção contra XSS e CSRF
• Rate Limiting
• Audit Logs completos

════════════════════════════════════════════════════════════════════════════════
                          3. BANCO DE DADOS - ENTIDADES
════════════════════════════════════════════════════════════════════════════════

3.1 USER (Entidade Principal de Usuários)
------------------------------------------
Campos Principais:
• id: string (UUID)
• email: string
• full_name: string
• role: enum ['user', 'admin']
• is_revela_admin: boolean
• has_revela_talentos_access: boolean
• has_plano_carreira_access: boolean
• is_featured: boolean

Campos de Perfil Atlético:
• position: enum ['goleiro', 'zagueiro', 'lateral', 'meio-campo', 'atacante']
• age: number
• height: number (cm)
• weight: number (kg)
• club: string
• birth_date: date
• nationality: string
• city: string
• state: string
• preferred_foot: enum ['direito', 'esquerdo', 'ambidestro']

Campos de Carreira:
• club_history: array<object>
• achievements: array<string>
• playing_style: string
• strengths: array<string>
• areas_improvement: array<string>
• injury_history: array<object>
• career_objectives: string

Campos de Contato:
• phone: string
• profile_picture_url: string
• social_media: object {instagram, youtube, tiktok, linkedin}

Campos de Responsável (para menores):
• responsible_full_name: string
• responsible_phone: string
• responsible_email: string
• responsible_relation: enum

Relacionamentos:
→ 1:N com PerformanceData
→ 1:N com AthleteUpload
→ 1:N com ChatMessage
→ 1:N com UserProgress
→ 1:N com Marketing
→ 1:N com GameSchedule


3.2 CONTENT (Biblioteca de Conteúdo)
-------------------------------------
• id: string
• title: string
• description: string
• thumbnail_url: string
• video_url: string
• preview_video_url: string (autoplay no hover)
• live_embed_code: string (para lives)
• external_link: string (para redirecionamentos)
• card_color: string (efeito neon nos cards)
• category: enum ['mentoria', 'treino_tatico', 'preparacao_fisica', 'psicologia', 
  'nutricao', 'live', 'planos', 'atletas', 'feed_posts']
• access_level: enum ['basic', 'elite']
• duration: number (minutos)
• instructor: string
• is_featured: boolean
• is_published: boolean
• status: enum ['draft', 'published', 'live', 'ended', 'archived']
• created_date: datetime
• updated_date: datetime

Casos de Uso:
• Vídeos de mentoria gravados
• Lives ao vivo (status: 'live')
• Conteúdo educacional
• Cards de planos (com external_link)
• Perfis de atletas destaque


3.3 USERPROGRESS (Acompanhamento de Conteúdo)
----------------------------------------------
• user_id: string (FK → User)
• content_id: string (FK → Content)
• progress_percentage: number (0-100)
• last_watched: datetime
• completed: boolean
• watch_time_seconds: number

Funcionalidades:
• Retomar vídeo de onde parou
• Marcar como completo automaticamente
• Dashboard de progresso do atleta


3.4 PERFORMANCEDATA (Análise de Performance)
---------------------------------------------
• user_id: string (FK → User)
• game_date: date
• opponent: string
• competition: string
• venue: string
• home_away: enum ['home', 'away']
• minutes_played: number
• goals: number
• assists: number
• passes_completed: number
• passes_attempted: number
• shots: number
• shots_on_target: number
• rating: number (1-10)
• associated_video_url: string
• athlete_feeling: string (diário do atleta)
• athlete_weekly_summary: string
• analyst_notes: string (feedback profissional)
• status: enum ['pending_analysis', 'completed']

Fluxo de Trabalho:
1. Atleta registra jogo + upload de vídeo
2. Status: 'pending_analysis'
3. Analista assiste e preenche métricas
4. Status: 'completed'
5. Atleta recebe feedback


3.5 ATHLETEUPLOAD (Galeria de Mídia do Atleta)
-----------------------------------------------
• user_id: string
• file_url: string
• processed_file_url: string
• file_name: string
• file_type: enum ['video', 'photo']
• file_size: number (bytes)
• category: enum ['jogo', 'treino', 'marketing', 'outros']
• description: string
• processing_status: enum ['pending', 'processing', 'completed', 'failed']
• metadata: object (dimensões, duração, etc)
• is_featured: boolean (destaque no perfil)

Uso:
• Portfolio visual do atleta
• Material para marketing
• Análise de performance
• Highlight reels


3.6 CHATMESSAGE (Sistema de Mensagens)
---------------------------------------
• sender_id: string
• receiver_id: string
• conversation_id: string
• content: string
• message_type: enum ['text', 'image', 'video', 'file']
• file_url: string
• read: boolean
• read_at: datetime

Personas do Sistema:
• analyst_01: Analista de Desempenho
• physio_01: Preparador Físico
• mentor_01: Mentor de Carreira
• marketing_01: Equipe de Marketing


3.7 GAMESCHEDULE (Agenda de Jogos)
-----------------------------------
• user_id: string
• opponent: string
• game_date: datetime
• venue: string
• competition: string
• status: enum ['scheduled', 'completed', 'cancelled']
• home_away: enum
• importance: enum ['low', 'medium', 'high']
• preparation_notes: string


3.8 MARKETING (Solicitações de Material)
-----------------------------------------
• user_id: string
• request_type: enum ['flyer', 'video_highlight']
• status: enum ['pending', 'in_progress', 'completed', 'rejected']
• photo_urls: array<string>
• video_urls: array<string>
• flyer_title: string
• flyer_subtitle: string
• additional_info: string
• feedback_from_team: string
• result_url: string (material finalizado)

Fluxo:
1. Atleta solicita material
2. Equipe de marketing recebe notificação
3. Produção do material
4. Entrega e feedback


3.9 NOTIFICATION & USERNOTIFICATION
------------------------------------
Sistema duplo de notificações:

AdminNotification:
• notification_type: ['performance_pending', 'upload_pending', 'new_message', 
  'new_user', 'subscription_update', 'new_tryout']
• title: string
• message: string
• related_id: string
• is_read: boolean
• tab_name: string (qual aba do admin)

UserNotification:
• user_id: string
• notification_type: ['new_content', 'career_update', 'new_message', 
  'system_update', 'live_session']
• title: string
• message: string
• related_id: string
• is_read: boolean
• priority: enum ['low', 'medium', 'high']


3.10 LEAD (CRM - Leads Nacionais)
----------------------------------
• full_name: string
• email: string
• phone: string
• birth_date: date
• position: enum
• lead_category: enum ['revela_talentos', 'plano_carreira', 'plano_internacional']
• current_club: string
• experience_level: enum
• objectives: string
• source_page: string (origem do lead)
• status: enum ['novo', 'contatado', 'qualificado', 'proposta_enviada', 
  'fechado', 'perdido']
• priority: enum
• notes: string
• assigned_to: string (ID do vendedor)
• lgpd_consent: boolean
• height: number
• weight: number
• preferred_foot: enum
• video_url: string
• seller_notes: string
• quit_reason: string
• total_value: number
• paid_value: number
• payment_status: enum
• last_contact: datetime
• next_followup: datetime


3.11 INTERNATIONALLEAD (CRM - Leads Internacionais)
----------------------------------------------------
Campos similares ao Lead, mais:
• preferred_country: string
• video_links: array<string>
• experience_level: enum ['amador', 'semi_profissional', 'profissional']

Diferencial: Focado em intercâmbios e oportunidades europeias


3.12 PIPELINE (Pipelines Personalizados de CRM)
------------------------------------------------
• name: string
• description: string
• color: string
• stages: array<object> {name, description, order}
• is_active: boolean

Exemplo de stages:
['Novo Lead', 'Primeiro Contato', 'Proposta Enviada', 'Negociação', 'Fechado']


3.13 USERPIPELINE (Posicionamento no Funil)
--------------------------------------------
• user_id: string
• pipeline_id: string
• current_stage: string
• stage_entered_date: datetime
• notes: string
• assigned_to: string


3.14 MARKETINGCAMPAIGN (Gestão de Tráfego)
-------------------------------------------
• campaign_name: string
• platform: enum ['meta_ads', 'google_ads', 'tiktok_ads', 'youtube_ads', 'organic']
• campaign_type: enum ['lead_generation', 'brand_awareness', 'conversion', 'retargeting']
• service_target: enum ['plano_carreira', 'revela_talentos', 'intercambios', 
  'campeonatos', 'eurocamp', 'geral']
• budget_daily: number
• budget_total: number
• start_date: date
• end_date: date
• status: enum
• target_audience: object
• creative_assets: array<string>
• landing_page_url: string
• metrics: object {
    impressions, clicks, ctr, cpc, leads_generated, 
    cost_per_lead, conversions, spend, reach
  }
• notes: string


3.15 SOCIALMEDIAPOST (Calendário Editorial)
--------------------------------------------
• platform: enum ['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin']
• content_type: enum ['image', 'video', 'carousel', 'story', 'reel', 'live']
• caption: string
• hashtags: array<string>
• media_urls: array<string>
• scheduled_date: datetime
• post_status: enum ['idea', 'draft', 'review', 'approved', 'scheduled', 
  'published', 'cancelled']
• content_pillar: enum ['dor', 'autoridade', 'urgencia', 'mentalidade', 
  'prova_social', 'educativo', 'promocional']
• service_related: enum
• assigned_to: string
• campaign_id: string
• engagement_metrics: object {likes, comments, shares, saves, reach, impressions}
• cta_link: string
• target_audience: string
• approval_notes: string


3.16 CONTENTIDEA (Banco de Ideias de Conteúdo)
-----------------------------------------------
• title: string
• description: string
• content_type: enum ['reel', 'post', 'story', 'carrossel', 'live', 'video_longo']
• platform: enum
• content_pillar: enum
• service_focus: enum
• suggested_by: string
• status: enum ['suggested', 'approved', 'in_production', 'published', 'rejected']
• priority: enum
• estimated_production_time: number (horas)
• target_date: date
• keywords: array<string>
• reference_links: array<string>


3.17 MARKETINGMATERIAL (Biblioteca de Materiais)
-------------------------------------------------
• title: string
• description: string
• file_url: string
• file_type: enum ['image', 'video', 'pdf', 'template', 'copy']
• category: enum ['arte', 'video', 'copy', 'template', 'apresentacao', 'ebook']
• service_related: enum
• platform_optimized: array<enum>
• tags: array<string>
• usage_count: number
• is_active: boolean
• created_by: string


3.18 MARKETINGTASK (Tarefas de Marketing)
------------------------------------------
• title: string
• description: string
• task_type: enum ['social_media', 'content_creation', 'traffic', 
  'athlete_material', 'strategy']
• assigned_to: string
• athlete_id: string
• priority: enum
• status: enum ['todo', 'in_progress', 'review', 'completed', 'cancelled']
• due_date: datetime
• materials: array<string>
• completion_notes: string


3.19 SELETIVA (Seletiva Online)
--------------------------------
• user_id: string
• full_name: string
• birth_date: date
• position: string
• height: number
• weight: number
• preferred_foot: enum
• video_url_game: string (jogo completo)
• video_url_drills: string (treinos específicos)
• self_assessment: string
• status: enum ['pending_review', 'under_review', 'approved', 'rejected', 'contacted']
• analyst_feedback: string
• lgpd_consent: boolean


3.20 EVENT (Sistema de Eventos)
--------------------------------
• title: string
• description: string
• event_type: enum ['presencial', 'online', 'jogo', 'treino', 'mentoria', 'reuniao']
• event_category: string
• start_date: datetime
• end_date: datetime
• location: string
• target_users: array<string> (vazio = todos)
• is_mandatory: boolean
• max_participants: number
• meeting_link: string
• is_active: boolean
• reminder_sent: boolean


3.21 SUBSCRIPTIONPACKAGE (Pacotes de Assinatura)
-------------------------------------------------
• name: string
• description: string
• price: number
• billing_period: enum ['monthly', 'quarterly', 'semiannual', 'annual']
• features: array<string>
• is_popular: boolean
• is_active: boolean
• color_gradient: string
• icon: string (Lucide React icon name)


3.22 USERSUBSCRIPTION (Assinaturas dos Usuários)
-------------------------------------------------
• user_id: string
• package_id: string
• status: enum ['active', 'inactive', 'expired', 'trial']
• start_date: date
• renewal_date: date
• payment_status: enum ['paid', 'pending', 'failed']
• payment_method: enum ['credit_card', 'pix', 'boleto']
• price_at_subscription: number


3.23 CUSTOMTASK (Tarefas CRM)
------------------------------
• title: string
• description: string
• assigned_user_id: string
• related_lead_id: string
• related_lead_type: enum ['Lead', 'InternationalLead']
• priority: enum
• status: enum ['pending', 'in_progress', 'completed', 'cancelled']
• due_date: datetime
• completion_notes: string


3.24 LEADINTERACTION (Histórico de Interações CRM)
---------------------------------------------------
• lead_id: string
• lead_type: enum ['general', 'international']
• interaction_type: enum ['call', 'whatsapp', 'email', 'meeting', 
  'material_sent', 'follow_up']
• notes: string
• outcome: enum ['positive', 'negative', 'neutral', 'no_response']
• next_action: string
• scheduled_date: datetime
• sales_rep: string
• material_sent: array<string>


3.25 SALESMATERIAL (Materiais de Vendas)
-----------------------------------------
• title: string
• description: string
• file_url: string
• file_type: enum ['pdf', 'video', 'image', 'document', 'presentation']
• category: enum ['contract', 'proposal', 'presentation', 'regulation', 
  'brochure', 'template', 'script']
• service_related: enum
• is_active: boolean
• usage_count: number
• tags: array<string>


3.26 MESSAGETEMPLATE (Templates de Mensagem)
---------------------------------------------
• title: string
• content: string
• template_type: enum ['whatsapp', 'email', 'sms']
• category: enum ['prospectacao', 'followup', 'proposta', 'fechamento', 
  'pos_venda', 'objetos']
• service_related: enum
• variables: array<string> (ex: {nome_atleta}, {valor})
• is_active: boolean
• usage_count: number


3.27 PROPOSALTEMPLATE (Templates de Proposta)
----------------------------------------------
• template_name: string
• service_type: enum
• base_price: number
• installments: array<object> {percentage, description}
• included_items: array<string>
• optional_items: array<object> {name, price, description}
• proposal_template: string (HTML)
• is_active: boolean


3.28 TESTIMONIAL (Depoimentos)
------------------------------
• name: string
• position: string
• video_url: string
• thumbnail_url: string
• is_active: boolean


3.29 PLATFORMSETTINGS (Configurações Globais)
----------------------------------------------
• setting_key: string (unique)
• setting_value: string
• setting_type: enum ['boolean', 'string', 'number', 'json']
• description: string
• is_active: boolean

Exemplos de settings:
• 'live_card_image_url': URL da imagem do card de Lives
• 'live_card_schedule': Texto do horário das lives
• 'maintenance_mode': boolean
• 'max_upload_size': number


3.30 ADMINAUDITLOG (Logs de Auditoria)
---------------------------------------
• admin_user_id: string
• admin_user_email: string
• action_type: enum ['create', 'update', 'delete', 'login', 'config_change', 
  'live_created', 'live_started', 'live_ended', 'vod_published']
• entity_name: string
• entity_id: string
• details: string
• before_state: object
• after_state: object

Rastreabilidade completa de ações administrativas


════════════════════════════════════════════════════════════════════════════════
                        4. FUNCIONALIDADES PRINCIPAIS
════════════════════════════════════════════════════════════════════════════════

4.1 SISTEMA DE AUTENTICAÇÃO
----------------------------
• OAuth 2.0 com Google
• Login automático para usuários existentes
• Cadastro simplificado (email + nome via Google)
• Perfis de acesso:
  - User: Atleta básico
  - Admin: Administrador completo
  - Revela Admin: Admin limitado (Seletivas + Conteúdos)
• Proteção de rotas sensíveis
• Session management


4.2 REVELA TALENTOS (Plataforma de Conteúdo)
---------------------------------------------
Funcionalidades:
• Netflix-like interface
• Categorias de conteúdo:
  - Mentorias
  - Treino Tático
  - Preparação Física
  - Psicologia Esportiva
  - Nutrição
  - Lives
• Preview em hover (autoplay de clipe curto)
• Player customizado com:
  - Controles avançados
  - Anotações do atleta
  - Progresso automático
  - Retomar de onde parou
• Sistema de favoritos
• Comentários em vídeos
• Barra de progresso visual
• Recomendações personalizadas
• Suporte a lives (status: 'live')
• Integração OneStream.live para transmissões


4.3 PLANO DE CARREIRA
----------------------
Módulos:
1. Dashboard Personalizado
   - Estatísticas de performance
   - Próximos jogos
   - Tarefas pendentes
   
2. Análise de Performance
   - Upload de vídeos de jogos
   - Métricas detalhadas
   - Feedback profissional de analistas
   - Gráficos de evolução
   - Comparação temporal
   
3. Marketing Pessoal
   - Solicitação de flyers
   - Criação de highlight reels
   - Galeria profissional
   - Portfolio visual
   
4. Centro de Mensagens
   - Chat com analistas
   - Chat com preparadores físicos
   - Chat com mentores
   - Notificações em tempo real
   
5. Perfil Profissional Completo
   - Dados pessoais
   - Histórico de clubes
   - Conquistas
   - Estatísticas
   - Lesões
   - Objetivos
   - Vídeos
   - Fotos
   
6. Gestão de Agenda
   - Calendário de jogos
   - Eventos
   - Treinos
   - Reuniões


4.4 PLANO INTERNACIONAL
-----------------------
• Landing page específica
• Formulário de interesse
• Apresentação de EuroCamps
• Informações sobre países-alvo
• Depoimentos de atletas
• Sistema de leads internacional
• Acompanhamento de oportunidades


4.5 SELETIVA ONLINE
-------------------
• Formulário de inscrição
• Upload de vídeos:
  - Jogo completo
  - Drills específicos
• Autoavaliação do atleta
• Análise profissional da EC10
• Status de avaliação
• Feedback detalhado
• Convocação para próximas etapas


4.6 SISTEMA DE LIVES
--------------------
• Transmissões ao vivo
• Integração OneStream.live
• Chat interativo
• Notificações de início
• Agendamento de lives
• Replay disponível após finalização
• Contador de visualizações
• Card especial no hub (com horário)
• Configuração admin de imagem e texto


4.7 CRM COMPLETO
----------------
Funcionalidades de Vendas:
• Gestão de leads (nacional e internacional)
• Pipelines personalizados
• Funil de vendas visual
• Histórico de interações
• Tarefas automáticas
• Follow-up scheduling
• WhatsApp integration
• Email templates
• Propostas customizáveis
• Documentos anexáveis
• Métricas de conversão
• Dashboard de vendas

Segmentação:
• Por serviço (Revela, Plano Carreira, Internacional)
• Por estágio do funil
• Por vendedor
• Por prioridade
• Por valor potencial


4.8 MARKETING COMPLETO
----------------------
Gestão de Campanhas:
• Criação de campanhas de tráfego
• Múltiplas plataformas (Meta, Google, TikTok)
• Budget tracking
• ROI calculation
• A/B testing
• Métricas em tempo real:
  - Impressões
  - Cliques
  - CTR
  - CPC
  - Leads gerados
  - CPL (custo por lead)
  - Conversões

Social Media:
• Calendário editorial
• Agendamento de posts
• Pilares de conteúdo
• Banco de ideias
• Aprovação de conteúdo
• Métricas de engajamento
• Biblioteca de materiais
• Templates reutilizáveis

Gestão de Tarefas:
• Atribuição de responsáveis
• Priorização
• Deadlines
• Progresso visual
• Notificações


4.9 ADMIN DASHBOARD
-------------------
Tabs de Gestão:
1. Dashboard Geral
   - Estatísticas globais
   - Gráficos de crescimento
   - Métricas de negócio
   
2. Dashboard Revela (Admin Revela)
   - Métricas de conteúdo
   - Seletivas pendentes
   - Engajamento
   
3. Usuários
   - Lista completa de atletas
   - Filtros avançados
   - Edição de perfis
   - Controle de acesso
   - CRM por atleta
   - Pipelines
   
4. Inscrições (Leads)
   - Funil de vendas
   - Gestão de leads
   - Status de pagamento
   - Follow-ups
   
5. Seletivas
   - Avaliações pendentes
   - Análise de vídeos
   - Feedback
   - Aprovação/Rejeição
   
6. Conteúdo
   - Criação de vídeos
   - Edição de conteúdo
   - Publicação
   - Agendamento
   - Configuração de lives
   - Gestão de thumbnails
   
7. Lives
   - Criação de lives
   - Status (live/ended)
   - Configuração de embed
   - Imagem e texto do card
   - Horários
   
8. Agenda
   - Eventos
   - Reuniões
   - Jogos agendados
   
9. Mensagens
   - Centro de comunicação
   - Múltiplas conversas
   - Personas do sistema
   
10. Marketing
    - Campanhas
    - Social Media
    - Calendário
    - Banco de ideias
    - Materiais
    - Relatórios
    
11. Depoimentos
    - Upload de vídeos
    - Ativação/Desativação
    
12. Configurações
    - Settings globais
    - Configurações de Lives
    - Manutenção
    - Logs de auditoria


4.10 SISTEMA DE NOTIFICAÇÕES
-----------------------------
Para Atletas:
• Novo conteúdo disponível
• Live começando
• Mensagem recebida
• Feedback de performance disponível
• Material de marketing pronto
• Lembrete de jogo
• Atualização de perfil

Para Admins:
• Nova performance para análise
• Novo upload pendente
• Nova mensagem de atleta
• Novo usuário registrado
• Nova inscrição/lead
• Nova seletiva submetida
• Tarefa vencendo


4.11 SISTEMA DE PROGRESSO
--------------------------
• Tracking automático de vídeos assistidos
• Porcentagem de conclusão
• Tempo total assistido
• Histórico de visualizações
• Certificados de conclusão (futuro)
• Gamificação (futuro)


4.12 GALERIA & PORTFOLIO
-------------------------
• Upload ilimitado de fotos
• Upload de vídeos
• Categorização (jogo, treino, marketing)
• Destaque de mídias importantes
• Compartilhamento externo
• Incorporação em perfil


4.13 INTERNACIONALIZAÇÃO
-------------------------
• Suporte a múltiplos idiomas
• Português (PT)
• Espanhol (ES)
• Interface traduzida
• Conteúdo localizado


4.14 MOBILE RESPONSIVE
----------------------
• Design mobile-first
• Touch gestures
• Menus adaptáveis
• Player otimizado
• Upload via mobile
• Performance otimizada


════════════════════════════════════════════════════════════════════════════════
                          5. PRODUTOS E SERVIÇOS
════════════════════════════════════════════════════════════════════════════════

5.1 REVELA TALENTOS (R$ 197/mês)
---------------------------------
Público: Atletas amadores 13-25 anos
Inclui:
• Acesso à plataforma de conteúdo
• 50+ vídeos de desenvolvimento
• Mentorias semanais ao vivo
• Certificados de conclusão
• Comunidade exclusiva
• Material didático
• Suporte via chat

Não Inclui:
• Análise de performance individual
• Marketing pessoal
• Conexões com clubes


5.2 PLANO DE CARREIRA (R$ 997/mês)
-----------------------------------
Público: Atletas profissionais e semi-profissionais
Inclui:
✓ TUDO do Revela Talentos +
• Análise profissional de performance
• Upload ilimitado de jogos
• Feedback individualizado de analistas
• Dashboard de métricas
• Marketing pessoal (flyers, highlights)
• Perfil profissional completo
• Conexões diretas com clubes
• Assessoria de carreira
• Chat direto com mentores
• Agenda personalizada
• Relatórios mensais

Diferencial: Gestão 360° da carreira


5.3 PLANO INTERNACIONAL
-----------------------
Produto: Intercâmbio esportivo
Inclui:
• Avaliação técnica completa
• Preparação documental
• Networking internacional
• EuroCamps na Europa
• Peneiras em clubes europeus
• Acompanhamento in loco
• Suporte de adaptação
• Assessoria jurídica

Países-alvo:
• Portugal
• Espanha
• Itália
• Alemanha
• França


5.4 CAMPEONATOS EC10
--------------------
• Torneios mensais
• Categorias por idade
• Scouts presentes
• Premiações
• Visibilidade
• Networking
• Gratuito para assinantes


5.5 EUROCAMP
------------
• Experiência de 2 semanas na Europa
• Treinos em centros de alto rendimento
• Peneiras em clubes
• Turismo esportivo
• Mentoria cultural
• Networking internacional


════════════════════════════════════════════════════════════════════════════════
                          6. DIFERENCIAIS DA PLATAFORMA
════════════════════════════════════════════════════════════════════════════════

6.1 TECNOLOGIA
--------------
✓ Interface moderna e intuitiva
✓ Performance otimizada
✓ Responsive design
✓ PWA-ready
✓ Offline-first (futuro)
✓ Real-time updates
✓ Cloud infrastructure
✓ Escalável


6.2 INTELIGÊNCIA DE DADOS
--------------------------
✓ Análise preditiva de performance
✓ Comparação com benchmark de mercado
✓ Identificação de pontos fortes/fracos
✓ Recomendações personalizadas
✓ Reports automatizados
✓ Dashboard executivo


6.3 NETWORKING
--------------
✓ Conexão direta com clubes
✓ Base de scouts
✓ Agentes e empresários
✓ Rede internacional
✓ Eventos presenciais
✓ Comunidade ativa


6.4 CONTEÚDO PROPRIETÁRIO
--------------------------
✓ 100+ horas de conteúdo exclusivo
✓ Profissionais certificados
✓ Metodologia comprovada
✓ Atualização constante
✓ Cases de sucesso
✓ Material didático


6.5 SUPORTE E MENTORIA
-----------------------
✓ Analistas dedicados
✓ Preparadores físicos
✓ Psicólogos esportivos
✓ Nutricionistas
✓ Mentores de carreira
✓ Equipe de marketing
✓ Suporte 24/7


6.6 COMPLIANCE E SEGURANÇA
---------------------------
✓ LGPD compliant
✓ Dados criptografados
✓ Backups diários
✓ Audit logs
✓ Termos de uso claros
✓ Privacidade garantida
✓ Controle parental (menores)


6.7 MARKETING INTEGRADO
------------------------
✓ Produção profissional de conteúdo
✓ Gestão de redes sociais
✓ Campanhas de tráfego
✓ SEO otimizado
✓ Email marketing
✓ Funil automatizado
✓ Retargeting


6.8 ESCALABILIDADE
------------------
✓ Arquitetura serverless
✓ CDN global
✓ Load balancing
✓ Auto-scaling
✓ Multi-região
✓ 99.9% uptime SLA


════════════════════════════════════════════════════════════════════════════════
                          7. FLUXOS DE TRABALHO PRINCIPAIS
════════════════════════════════════════════════════════════════════════════════

7.1 FLUXO: CADASTRO DE NOVO ATLETA
-----------------------------------
1. Usuário acessa a plataforma
2. Clica em "Entrar" ou "Cadastrar"
3. Redireciona para Google OAuth
4. Autoriza acesso
5. Sistema cria User automaticamente
6. Redireciona para página de onboarding
7. Atleta preenche dados adicionais:
   - Posição
   - Idade
   - Altura/Peso
   - Clube atual
   - Objetivos
8. Sistema salva dados
9. has_revela_talentos_access = true (padrão)
10. Redireciona para Hub


7.2 FLUXO: ASSISTIR CONTEÚDO
-----------------------------
1. Atleta acessa Revela Talentos
2. Navega pelas categorias
3. Clica em um vídeo
4. Sistema verifica acesso:
   - Revela Talentos: has_revela_talentos_access
   - Elite: has_plano_carreira_access
5. Se autorizado, abre player
6. Player inicia do progresso salvo
7. A cada 5 segundos, salva progresso
8. Ao atingir 90%, marca como completo
9. Atleta pode comentar
10. Recomendações aparecem ao final


7.3 FLUXO: ANÁLISE DE PERFORMANCE
----------------------------------
[ATLETA]
1. Acessa "Análise de Performance"
2. Clica em "Registrar Nova Performance"
3. Preenche dados do jogo:
   - Data
   - Adversário
   - Competição
   - Local
4. Upload de vídeo do jogo
5. Preenche diário:
   - Como se sentiu
   - Resumo da semana
6. Submete
7. Status: 'pending_analysis'

[SISTEMA]
8. Cria PerformanceData
9. Cria AdminNotification
10. Notifica analistas

[ANALISTA]
11. Recebe notificação
12. Acessa Admin > Performance
13. Assiste ao vídeo
14. Preenche métricas:
    - Minutos jogados
    - Gols
    - Assistências
    - Passes
    - Nota
15. Escreve feedback detalhado
16. Salva
17. Status: 'completed'

[SISTEMA]
18. Cria UserNotification
19. Notifica atleta

[ATLETA]
20. Recebe notificação
21. Visualiza feedback
22. Pode responder/comentar


7.4 FLUXO: SOLICITAÇÃO DE MARKETING
------------------------------------
[ATLETA]
1. Acessa "Marketing Hub"
2. Escolhe tipo:
   - Flyer
   - Highlight Reel
3. Upload de fotos/vídeos
4. Preenche instruções
5. Submete
6. Status: 'pending'

[SISTEMA]
7. Cria registro Marketing
8. Notifica equipe de marketing

[MARKETING]
9. Recebe notificação
10. Analisa solicitação
11. Status: 'in_progress'
12. Produz material
13. Upload do resultado
14. Status: 'completed'
15. Notifica atleta

[ATLETA]
16. Download do material
17. Pode solicitar ajustes


7.5 FLUXO: LEAD GENERATION
---------------------------
[VISITANTE]
1. Acessa landing page
2. Preenche formulário:
   - Nome
   - Email
   - WhatsApp
   - Posição
   - Objetivos
3. Aceita LGPD
4. Submete

[SISTEMA]
5. Cria Lead
6. Status: 'novo'
7. Cria AdminNotification
8. Envia email de boas-vindas
9. Webhook para CRM externo (opcional)

[VENDEDOR]
10. Recebe notificação
11. Lead aparece no pipeline
12. Vendedor liga/envia WhatsApp
13. Registra interação (LeadInteraction)
14. Move no funil conforme conversa
15. Envia proposta
16. Status: 'proposta_enviada'
17. Acompanha até fechamento


7.6 FLUXO: LIVE AO VIVO
-----------------------
[ADMIN]
1. Acessa Admin > Conteúdo > Lives
2. Cria novo conteúdo:
   - Category: 'live'
   - Title: "Mentoria ao vivo - [Tema]"
   - Embed code do OneStream
3. is_published: true
4. status: 'live'
5. Salva

[SISTEMA]
6. Live aparece no card de Lives
7. Badge "AO VIVO" ativado
8. Envia notificação para todos usuários
9. Push notification (se ativado)

[ATLETA]
10. Recebe notificação
11. Clica no card de Lives
12. Redireciona para página de Lives
13. Player carrega iframe OneStream
14. Chat interativo ativo
15. Pode comentar em tempo real

[PÓS-LIVE]
16. Admin muda status para 'ended'
17. Live move para aba "Mentorias"
18. Fica disponível como VOD
19. Atletas podem assistir gravação


7.7 FLUXO: SELETIVA ONLINE
---------------------------
[ATLETA]
1. Acessa "Seletiva Online"
2. Lê sobre o processo
3. Preenche formulário:
   - Dados pessoais
   - Posição
   - Altura/Peso
   - Autoavaliação
4. Upload vídeos:
   - Jogo completo
   - Drills específicos
5. Aceita termos
6. Submete
7. Status: 'pending_review'

[SISTEMA]
8. Cria Seletiva
9. Notifica admin revela
10. Email de confirmação

[ADMIN REVELA]
11. Acessa Admin > Seletivas
12. Lista de pendentes
13. Assiste aos vídeos
14. Avalia:
    - Técnica
    - Tático
    - Físico
    - Mental
15. Escreve feedback
16. Decisão:
    - Aprovado
    - Rejeitado
17. Status atualizado

[SISTEMA]
18. Notifica atleta
19. Se aprovado:
    - Convite para próxima fase
    - Instruções
20. Se rejeitado:
    - Feedback construtivo
    - Áreas de melhoria


7.8 FLUXO: CAMPANHA DE MARKETING
---------------------------------
[MARKETING MANAGER]
1. Acessa Admin > Marketing
2. Cria nova campanha:
   - Nome
   - Plataforma (Meta Ads)
   - Tipo (Lead Generation)
   - Serviço (Plano Carreira)
   - Budget
   - Público-alvo
   - Criativos
   - Landing page
3. Status: 'draft'
4. Revisa
5. Ativa
6. Status: 'active'

[SISTEMA]
7. Integração com APIs de anúncios
8. Tracking de métricas em tempo real
9. Atualiza dashboard automaticamente
10. Calcula ROI
11. Alerta se CPL acima do target
12. Relatórios diários

[LEADS GERADOS]
13. Visitante clica no anúncio
14. Chega na landing page
15. Preenche formulário
16. Lead criado automaticamente
17. Atribuído à campanha
18. Métricas atualizadas:
    - Leads gerados +1
    - Cost per lead recalculado


════════════════════════════════════════════════════════════════════════════════
                          8. INTEGRAÇÕES EXTERNAS
════════════════════════════════════════════════════════════════════════════════

8.1 ONESTREAM.LIVE
------------------
Propósito: Transmissões ao vivo
Implementação:
• Iframe embed
• URL: https://ec10talentos141.onestream.live
• Chat interativo incluído
• Estatísticas de visualização
• Replay automático


8.2 GOOGLE OAUTH
----------------
Propósito: Autenticação
Funcionalidades:
• Login social
• Cadastro simplificado
• Email verification automático
• Profile picture import


8.3 SUPABASE STORAGE
--------------------
Propósito: Armazenamento de arquivos
Uso:
• Upload de vídeos
• Upload de fotos
• Arquivos de performance
• Materiais de marketing
• Thumbnails
• Documents


8.4 CLOUDFLARE
--------------
Propósito: CDN e segurança
Benefícios:
• Cache global
• DDoS protection
• SSL/TLS
• Performance optimization
• Analytics


8.5 META ADS (Facebook/Instagram)
----------------------------------
Propósito: Publicidade
Features:
• Campaign management
• Audience targeting
• Conversion tracking
• Pixel integration
• Retargeting


8.6 GOOGLE ADS
--------------
Propósito: Search e Display ads
Features:
• Keyword targeting
• Display network
• YouTube ads
• Conversion tracking
• Analytics integration


8.7 TIKTOK ADS
--------------
Propósito: Alcance Gen Z
Features:
• Video ads
• Creator marketplace
• Pixel tracking


8.8 WHATSAPP BUSINESS
---------------------
Propósito: Atendimento
Features (futuro):
• Chatbot integration
• Message templates
• Quick replies
• Broadcasting
• Analytics


8.9 GOOGLE ANALYTICS
--------------------
Propósito: Analytics
Métricas:
• Page views
• User behavior
• Conversion funnels
• Demographics
• Device usage


8.10 HOTJAR
-----------
Propósito: UX research
Features:
• Heatmaps
• Session recordings
• Surveys
• Feedback widgets


════════════════════════════════════════════════════════════════════════════════
                          9. SEGURANÇA E COMPLIANCE
════════════════════════════════════════════════════════════════════════════════

9.1 LGPD (Lei Geral de Proteção de Dados)
------------------------------------------
Conformidade:
✓ Consentimento explícito
✓ Finalidade clara
✓ Minimização de dados
✓ Transparência
✓ Direito ao esquecimento
✓ Portabilidade de dados
✓ Encarregado de dados definido
✓ Registro de tratamento
✓ Avaliação de impacto


9.2 SEGURANÇA DE DADOS
----------------------
Medidas:
• Criptografia em repouso
• Criptografia em trânsito (SSL/TLS)
• Hashing de senhas (bcrypt)
• Tokens JWT
• Rate limiting
• CORS configurado
• XSS protection
• CSRF protection
• SQL injection prevention
• Input sanitization


9.3 CONTROLE DE ACESSO
----------------------
Níveis:
1. Público (sem login)
   - Landing pages
   - Página inicial
   
2. Usuário Autenticado
   - Hub
   - Revela Talentos (se has_revela_talentos_access)
   - Perfil
   
3. Plano de Carreira
   - Análise de performance
   - Marketing hub
   - Mensagens
   (requires: has_plano_carreira_access)
   
4. Admin Revela
   - Dashboard Revela
   - Seletivas
   - Conteúdos
   (requires: is_revela_admin)
   
5. Admin Geral
   - Acesso total
   (requires: role === 'admin')


9.4 AUDITORIA
-------------
Log de Ações:
• Todas ações admin registradas
• Histórico de mudanças
• IP e timestamp
• Before/after states
• Rastreabilidade completa


9.5 BACKUP
----------
Estratégia:
• Backups diários automatizados
• Retenção: 30 dias
• Backup incremental
• Testes de restore mensais
• Geo-redundância


9.6 PROTEÇÃO DE MENORES
------------------------
Medidas:
• Verificação de idade
• Dados de responsável obrigatórios
• Consentimento parental
• Conteúdo apropriado
• Monitoramento de interações


════════════════════════════════════════════════════════════════════════════════
                          10. ROADMAP E FUTURO
════════════════════════════════════════════════════════════════════════════════

10.1 EM DESENVOLVIMENTO
-----------------------
Q1 2025:
• App móvel nativo (iOS/Android)
• Sistema de gamificação
• Badges e conquistas
• Ranking de atletas
• Integração WhatsApp Business
• IA para análise de vídeo
• Sugestões automáticas de melhoria

Q2 2025:
• Marketplace de serviços
• Conexão com clubes automatizada
• Sistema de avaliação de clubes
• Comparador de propostas
• Agendamento automatizado
• Videoconferência integrada

Q3 2025:
• Expansão internacional
• Versão em inglês
• Clubes europeus parceiros
• Sistema de contratação
• Smart contracts (blockchain)
• NFTs de conquistas


10.2 BACKLOG DE FEATURES
-------------------------
• Live streaming do próprio atleta
• Stories/Feed social
• Grupos de treinamento
• Desafios semanais
• Torneios online
• Simulador de carreira
• Financial planning
• Assessoria jurídica
• Seguro de atleta
• Programa de afiliados


10.3 MELHORIAS TÉCNICAS
-----------------------
• Migração para Next.js
• Server-side rendering
• Offline mode (PWA)
• Web push notifications
• WebRTC para calls
• GraphQL API
• Microservices architecture
• Kubernetes deployment
• AI/ML integration
• Blockchain integration


10.4 EXPANSÃO DE NEGÓCIO
-------------------------
• Parcerias com clubes de base
• Convênios com escolas
• Programa de embaixadores
• Afiliação de treinadores
• Licenciamento de conteúdo
• Merchandising EC10
• Eventos presenciais
• Clínicas de futebol
• Torneios oficiais


════════════════════════════════════════════════════════════════════════════════
                          11. MÉTRICAS DE SUCESSO
════════════════════════════════════════════════════════════════════════════════

11.1 KPIs DE PRODUTO
--------------------
• MAU (Monthly Active Users)
• DAU (Daily Active Users)
• Retention rate (D1, D7, D30)
• Churn rate
• Average session duration
• Videos watched per user
• Completion rate
• NPS (Net Promoter Score)
• CSAT (Customer Satisfaction)


11.2 KPIs DE NEGÓCIO
--------------------
• MRR (Monthly Recurring Revenue)
• ARR (Annual Recurring Revenue)
• CAC (Customer Acquisition Cost)
• LTV (Lifetime Value)
• LTV:CAC ratio
• Conversion rate (lead → customer)
• Average ticket
• Upsell rate (Revela → Carreira)


11.3 KPIs DE MARKETING
----------------------
• CPL (Cost Per Lead)
• CPM (Cost Per Mille)
• CTR (Click-Through Rate)
• CPC (Cost Per Click)
• ROAS (Return On Ad Spend)
• Organic traffic growth
• Social media engagement
• Email open rate
• Funnel conversion rate


11.4 KPIs DE CONTEÚDO
---------------------
• Watch time total
• Average watch percentage
• Drop-off points
• Most watched videos
• Comments per video
• Shares
• Ratings
• Content ROI


════════════════════════════════════════════════════════════════════════════════
                          12. CONCLUSÃO
════════════════════════════════════════════════════════════════════════════════

A EC10 TALENTOS é uma plataforma completa e robusta de gestão e desenvolvimento 
de atletas de futebol, que combina:

✓ Tecnologia de ponta
✓ Conteúdo exclusivo e profissional
✓ Análise de dados avançada
✓ CRM e marketing integrados
✓ Networking internacional
✓ Suporte humanizado
✓ Escalabilidade comprovada

DIFERENCIAIS COMPETITIVOS:
--------------------------
1. Única plataforma all-in-one para atletas brasileiros
2. Tecnologia proprietária de análise de performance
3. Rede estabelecida de clubes e scouts
4. Conteúdo criado por profissionais de elite
5. Track record de atletas desenvolvidos
6. Sistema de CRM completo integrado
7. Marketing automation avançado

CASOS DE SUCESSO:
----------------
• 50+ atletas profissionalizados
• 15+ atletas em clubes europeus
• 200+ atletas em desenvolvimento ativo
• 1000+ horas de conteúdo assistido
• 95% de satisfação dos usuários
• 80% retention rate

INVESTIMENTO EM TECNOLOGIA:
---------------------------
• R$ 150k+ em desenvolvimento
• Infraestrutura escalável
• Time técnico qualificado
• Atualizações contínuas
• Suporte 24/7

A PLATAFORMA ESTÁ PRONTA PARA:
-------------------------------
✓ Escalar para 10.000+ usuários
✓ Expansão internacional
✓ Novos produtos e serviços
✓ Parcerias estratégicas
✓ Levantamento de investimento

════════════════════════════════════════════════════════════════════════════════

📞 CONTATO TÉCNICO
Email: dev@ec10talentos.com
Suporte: suporte@ec10talentos.com
Comercial: vendas@ec10talentos.com

🔒 CONFIDENCIAL - NÃO DISTRIBUIR

© ${new Date().getFullYear()} EC10 Talentos. Todos os direitos reservados.

════════════════════════════════════════════════════════════════════════════════
`}
        </div>
      </div>
    </div>
  );
}