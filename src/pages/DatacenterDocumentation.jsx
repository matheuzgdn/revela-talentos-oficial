import React, { useState, useEffect } from 'react';
import { appClient } from '@/api/backendClient';
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
      const currentUser = await appClient.auth.me();
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
          <p className="text-gray-400">VocÃª nÃ£o tem permissÃ£o para acessar esta pÃ¡gina.</p>
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
              <h1 className="text-3xl font-bold">DocumentaÃ§Ã£o Completa - EC10 Talentos</h1>
              <p className="text-gray-400">Acesso Exclusivo: Administrador</p>
            </div>
          </div>
          <Button onClick={downloadDocumentation} className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Baixar DocumentaÃ§Ã£o
          </Button>
        </div>

        <div id="documentation-content" className="bg-gray-900 border border-gray-800 rounded-lg p-8 font-mono text-sm leading-relaxed whitespace-pre-wrap">
{`
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                        EC10 TALENTOS - DOCUMENTAÃ‡ÃƒO COMPLETA
                     PLATAFORMA DE GESTÃƒO E DESENVOLVIMENTO DE ATLETAS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

ðŸ“… Ãšltima AtualizaÃ§Ã£o: ${new Date().toLocaleDateString('pt-BR')}
ðŸ”’ ClassificaÃ§Ã£o: CONFIDENCIAL - USO INTERNO
ðŸ‘¤ ProprietÃ¡rio: AdministraÃ§Ã£o EC10 Talentos

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                            1. VISÃƒO GERAL DA PLATAFORMA
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

1.1 MISSÃƒO
----------
Desenvolver e gerenciar a carreira de atletas de futebol atravÃ©s de tecnologia 
avanÃ§ada, anÃ¡lise de dados profissional, conteÃºdo educacional de alta qualidade 
e networking internacional.

1.2 VALORES FUNDAMENTAIS
-------------------------
â€¢ ExcelÃªncia no desenvolvimento atlÃ©tico
â€¢ TransparÃªncia na gestÃ£o de carreira
â€¢ Tecnologia como facilitador
â€¢ EducaÃ§Ã£o cont[...CONTENT TRUNCATED FOR BREVITY...]

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                           2. ARQUITETURA DO SISTEMA
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

2.1 STACK TECNOLÃ“GICO
---------------------
â€¢ Frontend: React.js 18+
â€¢ UI Framework: Tailwind CSS + shadcn/ui
â€¢ AnimaÃ§Ãµes: Framer Motion
â€¢ Roteamento: React Router DOM
â€¢ State Management: React Hooks + TanStack Query
â€¢ Backend: Supabase
â€¢ Banco de Dados: PostgreSQL (via Supabase)
â€¢ Autenticação: Supabase Auth
â€¢ Storage: Supabase Storage
â€¢ CDN: CloudFlare
â€¢ Streaming: OneStream.live

2.2 PADRÃƒO DE ARQUITETURA
--------------------------
â€¢ Component-Based Architecture
â€¢ Atomic Design Principles
â€¢ Custom Hooks para lÃ³gica reutilizÃ¡vel
â€¢ Context API para estados globais
â€¢ Lazy Loading para otimizaÃ§Ã£o

2.3 SEGURANÃ‡A
-------------
â€¢ AutenticaÃ§Ã£o OAuth 2.0
â€¢ HTTPS obrigatÃ³rio
â€¢ LGPD Compliant
â€¢ ProteÃ§Ã£o contra XSS e CSRF
â€¢ Rate Limiting
â€¢ Audit Logs completos

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                          3. BANCO DE DADOS - ENTIDADES
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

3.1 USER (Entidade Principal de UsuÃ¡rios)
------------------------------------------
Campos Principais:
â€¢ id: string (UUID)
â€¢ email: string
â€¢ full_name: string
â€¢ role: enum ['user', 'admin']
â€¢ is_revela_admin: boolean
â€¢ has_revela_talentos_access: boolean
â€¢ has_plano_carreira_access: boolean
â€¢ is_featured: boolean

Campos de Perfil AtlÃ©tico:
â€¢ position: enum ['goleiro', 'zagueiro', 'lateral', 'meio-campo', 'atacante']
â€¢ age: number
â€¢ height: number (cm)
â€¢ weight: number (kg)
â€¢ club: string
â€¢ birth_date: date
â€¢ nationality: string
â€¢ city: string
â€¢ state: string
â€¢ preferred_foot: enum ['direito', 'esquerdo', 'ambidestro']

Campos de Carreira:
â€¢ club_history: array<object>
â€¢ achievements: array<string>
â€¢ playing_style: string
â€¢ strengths: array<string>
â€¢ areas_improvement: array<string>
â€¢ injury_history: array<object>
â€¢ career_objectives: string

Campos de Contato:
â€¢ phone: string
â€¢ profile_picture_url: string
â€¢ social_media: object {instagram, youtube, tiktok, linkedin}

Campos de ResponsÃ¡vel (para menores):
â€¢ responsible_full_name: string
â€¢ responsible_phone: string
â€¢ responsible_email: string
â€¢ responsible_relation: enum

Relacionamentos:
â†’ 1:N com PerformanceData
â†’ 1:N com AthleteUpload
â†’ 1:N com ChatMessage
â†’ 1:N com UserProgress
â†’ 1:N com Marketing
â†’ 1:N com GameSchedule


3.2 CONTENT (Biblioteca de ConteÃºdo)
-------------------------------------
â€¢ id: string
â€¢ title: string
â€¢ description: string
â€¢ thumbnail_url: string
â€¢ video_url: string
â€¢ preview_video_url: string (autoplay no hover)
â€¢ live_embed_code: string (para lives)
â€¢ external_link: string (para redirecionamentos)
â€¢ card_color: string (efeito neon nos cards)
â€¢ category: enum ['mentoria', 'treino_tatico', 'preparacao_fisica', 'psicologia', 
  'nutricao', 'live', 'planos', 'atletas', 'feed_posts']
â€¢ access_level: enum ['basic', 'elite']
â€¢ duration: number (minutos)
â€¢ instructor: string
â€¢ is_featured: boolean
â€¢ is_published: boolean
â€¢ status: enum ['draft', 'published', 'live', 'ended', 'archived']
â€¢ created_date: datetime
â€¢ updated_date: datetime

Casos de Uso:
â€¢ VÃ­deos de mentoria gravados
â€¢ Lives ao vivo (status: 'live')
â€¢ ConteÃºdo educacional
â€¢ Cards de planos (com external_link)
â€¢ Perfis de atletas destaque


3.3 USERPROGRESS (Acompanhamento de ConteÃºdo)
----------------------------------------------
â€¢ user_id: string (FK â†’ User)
â€¢ content_id: string (FK â†’ Content)
â€¢ progress_percentage: number (0-100)
â€¢ last_watched: datetime
â€¢ completed: boolean
â€¢ watch_time_seconds: number

Funcionalidades:
â€¢ Retomar vÃ­deo de onde parou
â€¢ Marcar como completo automaticamente
â€¢ Dashboard de progresso do atleta


3.4 PERFORMANCEDATA (AnÃ¡lise de Performance)
---------------------------------------------
â€¢ user_id: string (FK â†’ User)
â€¢ game_date: date
â€¢ opponent: string
â€¢ competition: string
â€¢ venue: string
â€¢ home_away: enum ['home', 'away']
â€¢ minutes_played: number
â€¢ goals: number
â€¢ assists: number
â€¢ passes_completed: number
â€¢ passes_attempted: number
â€¢ shots: number
â€¢ shots_on_target: number
â€¢ rating: number (1-10)
â€¢ associated_video_url: string
â€¢ athlete_feeling: string (diÃ¡rio do atleta)
â€¢ athlete_weekly_summary: string
â€¢ analyst_notes: string (feedback profissional)
â€¢ status: enum ['pending_analysis', 'completed']

Fluxo de Trabalho:
1. Atleta registra jogo + upload de vÃ­deo
2. Status: 'pending_analysis'
3. Analista assiste e preenche mÃ©tricas
4. Status: 'completed'
5. Atleta recebe feedback


3.5 ATHLETEUPLOAD (Galeria de MÃ­dia do Atleta)
-----------------------------------------------
â€¢ user_id: string
â€¢ file_url: string
â€¢ processed_file_url: string
â€¢ file_name: string
â€¢ file_type: enum ['video', 'photo']
â€¢ file_size: number (bytes)
â€¢ category: enum ['jogo', 'treino', 'marketing', 'outros']
â€¢ description: string
â€¢ processing_status: enum ['pending', 'processing', 'completed', 'failed']
â€¢ metadata: object (dimensÃµes, duraÃ§Ã£o, etc)
â€¢ is_featured: boolean (destaque no perfil)

Uso:
â€¢ Portfolio visual do atleta
â€¢ Material para marketing
â€¢ AnÃ¡lise de performance
â€¢ Highlight reels


3.6 CHATMESSAGE (Sistema de Mensagens)
---------------------------------------
â€¢ sender_id: string
â€¢ receiver_id: string
â€¢ conversation_id: string
â€¢ content: string
â€¢ message_type: enum ['text', 'image', 'video', 'file']
â€¢ file_url: string
â€¢ read: boolean
â€¢ read_at: datetime

Personas do Sistema:
â€¢ analyst_01: Analista de Desempenho
â€¢ physio_01: Preparador FÃ­sico
â€¢ mentor_01: Mentor de Carreira
â€¢ marketing_01: Equipe de Marketing


3.7 GAMESCHEDULE (Agenda de Jogos)
-----------------------------------
â€¢ user_id: string
â€¢ opponent: string
â€¢ game_date: datetime
â€¢ venue: string
â€¢ competition: string
â€¢ status: enum ['scheduled', 'completed', 'cancelled']
â€¢ home_away: enum
â€¢ importance: enum ['low', 'medium', 'high']
â€¢ preparation_notes: string


3.8 MARKETING (SolicitaÃ§Ãµes de Material)
-----------------------------------------
â€¢ user_id: string
â€¢ request_type: enum ['flyer', 'video_highlight']
â€¢ status: enum ['pending', 'in_progress', 'completed', 'rejected']
â€¢ photo_urls: array<string>
â€¢ video_urls: array<string>
â€¢ flyer_title: string
â€¢ flyer_subtitle: string
â€¢ additional_info: string
â€¢ feedback_from_team: string
â€¢ result_url: string (material finalizado)

Fluxo:
1. Atleta solicita material
2. Equipe de marketing recebe notificaÃ§Ã£o
3. ProduÃ§Ã£o do material
4. Entrega e feedback


3.9 NOTIFICATION & USERNOTIFICATION
------------------------------------
Sistema duplo de notificaÃ§Ãµes:

AdminNotification:
â€¢ notification_type: ['performance_pending', 'upload_pending', 'new_message', 
  'new_user', 'subscription_update', 'new_tryout']
â€¢ title: string
â€¢ message: string
â€¢ related_id: string
â€¢ is_read: boolean
â€¢ tab_name: string (qual aba do admin)

UserNotification:
â€¢ user_id: string
â€¢ notification_type: ['new_content', 'career_update', 'new_message', 
  'system_update', 'live_session']
â€¢ title: string
â€¢ message: string
â€¢ related_id: string
â€¢ is_read: boolean
â€¢ priority: enum ['low', 'medium', 'high']


3.10 LEAD (CRM - Leads Nacionais)
----------------------------------
â€¢ full_name: string
â€¢ email: string
â€¢ phone: string
â€¢ birth_date: date
â€¢ position: enum
â€¢ lead_category: enum ['revela_talentos', 'plano_carreira', 'plano_internacional']
â€¢ current_club: string
â€¢ experience_level: enum
â€¢ objectives: string
â€¢ source_page: string (origem do lead)
â€¢ status: enum ['novo', 'contatado', 'qualificado', 'proposta_enviada', 
  'fechado', 'perdido']
â€¢ priority: enum
â€¢ notes: string
â€¢ assigned_to: string (ID do vendedor)
â€¢ lgpd_consent: boolean
â€¢ height: number
â€¢ weight: number
â€¢ preferred_foot: enum
â€¢ video_url: string
â€¢ seller_notes: string
â€¢ quit_reason: string
â€¢ total_value: number
â€¢ paid_value: number
â€¢ payment_status: enum
â€¢ last_contact: datetime
â€¢ next_followup: datetime


3.11 INTERNATIONALLEAD (CRM - Leads Internacionais)
----------------------------------------------------
Campos similares ao Lead, mais:
â€¢ preferred_country: string
â€¢ video_links: array<string>
â€¢ experience_level: enum ['amador', 'semi_profissional', 'profissional']

Diferencial: Focado em intercÃ¢mbios e oportunidades europeias


3.12 PIPELINE (Pipelines Personalizados de CRM)
------------------------------------------------
â€¢ name: string
â€¢ description: string
â€¢ color: string
â€¢ stages: array<object> {name, description, order}
â€¢ is_active: boolean

Exemplo de stages:
['Novo Lead', 'Primeiro Contato', 'Proposta Enviada', 'NegociaÃ§Ã£o', 'Fechado']


3.13 USERPIPELINE (Posicionamento no Funil)
--------------------------------------------
â€¢ user_id: string
â€¢ pipeline_id: string
â€¢ current_stage: string
â€¢ stage_entered_date: datetime
â€¢ notes: string
â€¢ assigned_to: string


3.14 MARKETINGCAMPAIGN (GestÃ£o de TrÃ¡fego)
-------------------------------------------
â€¢ campaign_name: string
â€¢ platform: enum ['meta_ads', 'google_ads', 'tiktok_ads', 'youtube_ads', 'organic']
â€¢ campaign_type: enum ['lead_generation', 'brand_awareness', 'conversion', 'retargeting']
â€¢ service_target: enum ['plano_carreira', 'revela_talentos', 'intercambios', 
  'campeonatos', 'eurocamp', 'geral']
â€¢ budget_daily: number
â€¢ budget_total: number
â€¢ start_date: date
â€¢ end_date: date
â€¢ status: enum
â€¢ target_audience: object
â€¢ creative_assets: array<string>
â€¢ landing_page_url: string
â€¢ metrics: object {
    impressions, clicks, ctr, cpc, leads_generated, 
    cost_per_lead, conversions, spend, reach
  }
â€¢ notes: string


3.15 SOCIALMEDIAPOST (CalendÃ¡rio Editorial)
--------------------------------------------
â€¢ platform: enum ['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin']
â€¢ content_type: enum ['image', 'video', 'carousel', 'story', 'reel', 'live']
â€¢ caption: string
â€¢ hashtags: array<string>
â€¢ media_urls: array<string>
â€¢ scheduled_date: datetime
â€¢ post_status: enum ['idea', 'draft', 'review', 'approved', 'scheduled', 
  'published', 'cancelled']
â€¢ content_pillar: enum ['dor', 'autoridade', 'urgencia', 'mentalidade', 
  'prova_social', 'educativo', 'promocional']
â€¢ service_related: enum
â€¢ assigned_to: string
â€¢ campaign_id: string
â€¢ engagement_metrics: object {likes, comments, shares, saves, reach, impressions}
â€¢ cta_link: string
â€¢ target_audience: string
â€¢ approval_notes: string


3.16 CONTENTIDEA (Banco de Ideias de ConteÃºdo)
-----------------------------------------------
â€¢ title: string
â€¢ description: string
â€¢ content_type: enum ['reel', 'post', 'story', 'carrossel', 'live', 'video_longo']
â€¢ platform: enum
â€¢ content_pillar: enum
â€¢ service_focus: enum
â€¢ suggested_by: string
â€¢ status: enum ['suggested', 'approved', 'in_production', 'published', 'rejected']
â€¢ priority: enum
â€¢ estimated_production_time: number (horas)
â€¢ target_date: date
â€¢ keywords: array<string>
â€¢ reference_links: array<string>


3.17 MARKETINGMATERIAL (Biblioteca de Materiais)
-------------------------------------------------
â€¢ title: string
â€¢ description: string
â€¢ file_url: string
â€¢ file_type: enum ['image', 'video', 'pdf', 'template', 'copy']
â€¢ category: enum ['arte', 'video', 'copy', 'template', 'apresentacao', 'ebook']
â€¢ service_related: enum
â€¢ platform_optimized: array<enum>
â€¢ tags: array<string>
â€¢ usage_count: number
â€¢ is_active: boolean
â€¢ created_by: string


3.18 MARKETINGTASK (Tarefas de Marketing)
------------------------------------------
â€¢ title: string
â€¢ description: string
â€¢ task_type: enum ['social_media', 'content_creation', 'traffic', 
  'athlete_material', 'strategy']
â€¢ assigned_to: string
â€¢ athlete_id: string
â€¢ priority: enum
â€¢ status: enum ['todo', 'in_progress', 'review', 'completed', 'cancelled']
â€¢ due_date: datetime
â€¢ materials: array<string>
â€¢ completion_notes: string


3.19 SELETIVA (Seletiva Online)
--------------------------------
â€¢ user_id: string
â€¢ full_name: string
â€¢ birth_date: date
â€¢ position: string
â€¢ height: number
â€¢ weight: number
â€¢ preferred_foot: enum
â€¢ video_url_game: string (jogo completo)
â€¢ video_url_drills: string (treinos especÃ­ficos)
â€¢ self_assessment: string
â€¢ status: enum ['pending_review', 'under_review', 'approved', 'rejected', 'contacted']
â€¢ analyst_feedback: string
â€¢ lgpd_consent: boolean


3.20 EVENT (Sistema de Eventos)
--------------------------------
â€¢ title: string
â€¢ description: string
â€¢ event_type: enum ['presencial', 'online', 'jogo', 'treino', 'mentoria', 'reuniao']
â€¢ event_category: string
â€¢ start_date: datetime
â€¢ end_date: datetime
â€¢ location: string
â€¢ target_users: array<string> (vazio = todos)
â€¢ is_mandatory: boolean
â€¢ max_participants: number
â€¢ meeting_link: string
â€¢ is_active: boolean
â€¢ reminder_sent: boolean


3.21 SUBSCRIPTIONPACKAGE (Pacotes de Assinatura)
-------------------------------------------------
â€¢ name: string
â€¢ description: string
â€¢ price: number
â€¢ billing_period: enum ['monthly', 'quarterly', 'semiannual', 'annual']
â€¢ features: array<string>
â€¢ is_popular: boolean
â€¢ is_active: boolean
â€¢ color_gradient: string
â€¢ icon: string (Lucide React icon name)


3.22 USERSUBSCRIPTION (Assinaturas dos UsuÃ¡rios)
-------------------------------------------------
â€¢ user_id: string
â€¢ package_id: string
â€¢ status: enum ['active', 'inactive', 'expired', 'trial']
â€¢ start_date: date
â€¢ renewal_date: date
â€¢ payment_status: enum ['paid', 'pending', 'failed']
â€¢ payment_method: enum ['credit_card', 'pix', 'boleto']
â€¢ price_at_subscription: number


3.23 CUSTOMTASK (Tarefas CRM)
------------------------------
â€¢ title: string
â€¢ description: string
â€¢ assigned_user_id: string
â€¢ related_lead_id: string
â€¢ related_lead_type: enum ['Lead', 'InternationalLead']
â€¢ priority: enum
â€¢ status: enum ['pending', 'in_progress', 'completed', 'cancelled']
â€¢ due_date: datetime
â€¢ completion_notes: string


3.24 LEADINTERACTION (HistÃ³rico de InteraÃ§Ãµes CRM)
---------------------------------------------------
â€¢ lead_id: string
â€¢ lead_type: enum ['general', 'international']
â€¢ interaction_type: enum ['call', 'whatsapp', 'email', 'meeting', 
  'material_sent', 'follow_up']
â€¢ notes: string
â€¢ outcome: enum ['positive', 'negative', 'neutral', 'no_response']
â€¢ next_action: string
â€¢ scheduled_date: datetime
â€¢ sales_rep: string
â€¢ material_sent: array<string>


3.25 SALESMATERIAL (Materiais de Vendas)
-----------------------------------------
â€¢ title: string
â€¢ description: string
â€¢ file_url: string
â€¢ file_type: enum ['pdf', 'video', 'image', 'document', 'presentation']
â€¢ category: enum ['contract', 'proposal', 'presentation', 'regulation', 
  'brochure', 'template', 'script']
â€¢ service_related: enum
â€¢ is_active: boolean
â€¢ usage_count: number
â€¢ tags: array<string>


3.26 MESSAGETEMPLATE (Templates de Mensagem)
---------------------------------------------
â€¢ title: string
â€¢ content: string
â€¢ template_type: enum ['whatsapp', 'email', 'sms']
â€¢ category: enum ['prospectacao', 'followup', 'proposta', 'fechamento', 
  'pos_venda', 'objetos']
â€¢ service_related: enum
â€¢ variables: array<string> (ex: {nome_atleta}, {valor})
â€¢ is_active: boolean
â€¢ usage_count: number


3.27 PROPOSALTEMPLATE (Templates de Proposta)
----------------------------------------------
â€¢ template_name: string
â€¢ service_type: enum
â€¢ base_price: number
â€¢ installments: array<object> {percentage, description}
â€¢ included_items: array<string>
â€¢ optional_items: array<object> {name, price, description}
â€¢ proposal_template: string (HTML)
â€¢ is_active: boolean


3.28 TESTIMONIAL (Depoimentos)
------------------------------
â€¢ name: string
â€¢ position: string
â€¢ video_url: string
â€¢ thumbnail_url: string
â€¢ is_active: boolean


3.29 PLATFORMSETTINGS (ConfiguraÃ§Ãµes Globais)
----------------------------------------------
â€¢ setting_key: string (unique)
â€¢ setting_value: string
â€¢ setting_type: enum ['boolean', 'string', 'number', 'json']
â€¢ description: string
â€¢ is_active: boolean

Exemplos de settings:
â€¢ 'live_card_image_url': URL da imagem do card de Lives
â€¢ 'live_card_schedule': Texto do horÃ¡rio das lives
â€¢ 'maintenance_mode': boolean
â€¢ 'max_upload_size': number


3.30 ADMINAUDITLOG (Logs de Auditoria)
---------------------------------------
â€¢ admin_user_id: string
â€¢ admin_user_email: string
â€¢ action_type: enum ['create', 'update', 'delete', 'login', 'config_change', 
  'live_created', 'live_started', 'live_ended', 'vod_published']
â€¢ entity_name: string
â€¢ entity_id: string
â€¢ details: string
â€¢ before_state: object
â€¢ after_state: object

Rastreabilidade completa de aÃ§Ãµes administrativas


â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                        4. FUNCIONALIDADES PRINCIPAIS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

4.1 SISTEMA DE AUTENTICAÃ‡ÃƒO
----------------------------
â€¢ OAuth 2.0 com Google
â€¢ Login automÃ¡tico para usuÃ¡rios existentes
â€¢ Cadastro simplificado (email + nome via Google)
â€¢ Perfis de acesso:
  - User: Atleta bÃ¡sico
  - Admin: Administrador completo
  - Revela Admin: Admin limitado (Seletivas + ConteÃºdos)
â€¢ ProteÃ§Ã£o de rotas sensÃ­veis
â€¢ Session management


4.2 REVELA TALENTOS (Plataforma de ConteÃºdo)
---------------------------------------------
Funcionalidades:
â€¢ Netflix-like interface
â€¢ Categorias de conteÃºdo:
  - Mentorias
  - Treino TÃ¡tico
  - PreparaÃ§Ã£o FÃ­sica
  - Psicologia Esportiva
  - NutriÃ§Ã£o
  - Lives
â€¢ Preview em hover (autoplay de clipe curto)
â€¢ Player customizado com:
  - Controles avanÃ§ados
  - AnotaÃ§Ãµes do atleta
  - Progresso automÃ¡tico
  - Retomar de onde parou
â€¢ Sistema de favoritos
â€¢ ComentÃ¡rios em vÃ­deos
â€¢ Barra de progresso visual
â€¢ RecomendaÃ§Ãµes personalizadas
â€¢ Suporte a lives (status: 'live')
â€¢ IntegraÃ§Ã£o OneStream.live para transmissÃµes


4.3 PLANO DE CARREIRA
----------------------
MÃ³dulos:
1. Dashboard Personalizado
   - EstatÃ­sticas de performance
   - PrÃ³ximos jogos
   - Tarefas pendentes
   
2. AnÃ¡lise de Performance
   - Upload de vÃ­deos de jogos
   - MÃ©tricas detalhadas
   - Feedback profissional de analistas
   - GrÃ¡ficos de evoluÃ§Ã£o
   - ComparaÃ§Ã£o temporal
   
3. Marketing Pessoal
   - SolicitaÃ§Ã£o de flyers
   - CriaÃ§Ã£o de highlight reels
   - Galeria profissional
   - Portfolio visual
   
4. Centro de Mensagens
   - Chat com analistas
   - Chat com preparadores fÃ­sicos
   - Chat com mentores
   - NotificaÃ§Ãµes em tempo real
   
5. Perfil Profissional Completo
   - Dados pessoais
   - HistÃ³rico de clubes
   - Conquistas
   - EstatÃ­sticas
   - LesÃµes
   - Objetivos
   - VÃ­deos
   - Fotos
   
6. GestÃ£o de Agenda
   - CalendÃ¡rio de jogos
   - Eventos
   - Treinos
   - ReuniÃµes


4.4 PLANO INTERNACIONAL
-----------------------
â€¢ Landing page especÃ­fica
â€¢ FormulÃ¡rio de interesse
â€¢ ApresentaÃ§Ã£o de EuroCamps
â€¢ InformaÃ§Ãµes sobre paÃ­ses-alvo
â€¢ Depoimentos de atletas
â€¢ Sistema de leads internacional
â€¢ Acompanhamento de oportunidades


4.5 SELETIVA ONLINE
-------------------
â€¢ FormulÃ¡rio de inscriÃ§Ã£o
â€¢ Upload de vÃ­deos:
  - Jogo completo
  - Drills especÃ­ficos
â€¢ AutoavaliaÃ§Ã£o do atleta
â€¢ AnÃ¡lise profissional da EC10
â€¢ Status de avaliaÃ§Ã£o
â€¢ Feedback detalhado
â€¢ ConvocaÃ§Ã£o para prÃ³ximas etapas


4.6 SISTEMA DE LIVES
--------------------
â€¢ TransmissÃµes ao vivo
â€¢ IntegraÃ§Ã£o OneStream.live
â€¢ Chat interativo
â€¢ NotificaÃ§Ãµes de inÃ­cio
â€¢ Agendamento de lives
â€¢ Replay disponÃ­vel apÃ³s finalizaÃ§Ã£o
â€¢ Contador de visualizaÃ§Ãµes
â€¢ Card especial no hub (com horÃ¡rio)
â€¢ ConfiguraÃ§Ã£o admin de imagem e texto


4.7 CRM COMPLETO
----------------
Funcionalidades de Vendas:
â€¢ GestÃ£o de leads (nacional e internacional)
â€¢ Pipelines personalizados
â€¢ Funil de vendas visual
â€¢ HistÃ³rico de interaÃ§Ãµes
â€¢ Tarefas automÃ¡ticas
â€¢ Follow-up scheduling
â€¢ WhatsApp integration
â€¢ Email templates
â€¢ Propostas customizÃ¡veis
â€¢ Documentos anexÃ¡veis
â€¢ MÃ©tricas de conversÃ£o
â€¢ Dashboard de vendas

SegmentaÃ§Ã£o:
â€¢ Por serviÃ§o (Revela, Plano Carreira, Internacional)
â€¢ Por estÃ¡gio do funil
â€¢ Por vendedor
â€¢ Por prioridade
â€¢ Por valor potencial


4.8 MARKETING COMPLETO
----------------------
GestÃ£o de Campanhas:
â€¢ CriaÃ§Ã£o de campanhas de trÃ¡fego
â€¢ MÃºltiplas plataformas (Meta, Google, TikTok)
â€¢ Budget tracking
â€¢ ROI calculation
â€¢ A/B testing
â€¢ MÃ©tricas em tempo real:
  - ImpressÃµes
  - Cliques
  - CTR
  - CPC
  - Leads gerados
  - CPL (custo por lead)
  - ConversÃµes

Social Media:
â€¢ CalendÃ¡rio editorial
â€¢ Agendamento de posts
â€¢ Pilares de conteÃºdo
â€¢ Banco de ideias
â€¢ AprovaÃ§Ã£o de conteÃºdo
â€¢ MÃ©tricas de engajamento
â€¢ Biblioteca de materiais
â€¢ Templates reutilizÃ¡veis

GestÃ£o de Tarefas:
â€¢ AtribuiÃ§Ã£o de responsÃ¡veis
â€¢ PriorizaÃ§Ã£o
â€¢ Deadlines
â€¢ Progresso visual
â€¢ NotificaÃ§Ãµes


4.9 ADMIN DASHBOARD
-------------------
Tabs de GestÃ£o:
1. Dashboard Geral
   - EstatÃ­sticas globais
   - GrÃ¡ficos de crescimento
   - MÃ©tricas de negÃ³cio
   
2. Dashboard Revela (Admin Revela)
   - MÃ©tricas de conteÃºdo
   - Seletivas pendentes
   - Engajamento
   
3. UsuÃ¡rios
   - Lista completa de atletas
   - Filtros avanÃ§ados
   - EdiÃ§Ã£o de perfis
   - Controle de acesso
   - CRM por atleta
   - Pipelines
   
4. InscriÃ§Ãµes (Leads)
   - Funil de vendas
   - GestÃ£o de leads
   - Status de pagamento
   - Follow-ups
   
5. Seletivas
   - AvaliaÃ§Ãµes pendentes
   - AnÃ¡lise de vÃ­deos
   - Feedback
   - AprovaÃ§Ã£o/RejeiÃ§Ã£o
   
6. ConteÃºdo
   - CriaÃ§Ã£o de vÃ­deos
   - EdiÃ§Ã£o de conteÃºdo
   - PublicaÃ§Ã£o
   - Agendamento
   - ConfiguraÃ§Ã£o de lives
   - GestÃ£o de thumbnails
   
7. Lives
   - CriaÃ§Ã£o de lives
   - Status (live/ended)
   - ConfiguraÃ§Ã£o de embed
   - Imagem e texto do card
   - HorÃ¡rios
   
8. Agenda
   - Eventos
   - ReuniÃµes
   - Jogos agendados
   
9. Mensagens
   - Centro de comunicaÃ§Ã£o
   - MÃºltiplas conversas
   - Personas do sistema
   
10. Marketing
    - Campanhas
    - Social Media
    - CalendÃ¡rio
    - Banco de ideias
    - Materiais
    - RelatÃ³rios
    
11. Depoimentos
    - Upload de vÃ­deos
    - AtivaÃ§Ã£o/DesativaÃ§Ã£o
    
12. ConfiguraÃ§Ãµes
    - Settings globais
    - ConfiguraÃ§Ãµes de Lives
    - ManutenÃ§Ã£o
    - Logs de auditoria


4.10 SISTEMA DE NOTIFICAÃ‡Ã•ES
-----------------------------
Para Atletas:
â€¢ Novo conteÃºdo disponÃ­vel
â€¢ Live comeÃ§ando
â€¢ Mensagem recebida
â€¢ Feedback de performance disponÃ­vel
â€¢ Material de marketing pronto
â€¢ Lembrete de jogo
â€¢ AtualizaÃ§Ã£o de perfil

Para Admins:
â€¢ Nova performance para anÃ¡lise
â€¢ Novo upload pendente
â€¢ Nova mensagem de atleta
â€¢ Novo usuÃ¡rio registrado
â€¢ Nova inscriÃ§Ã£o/lead
â€¢ Nova seletiva submetida
â€¢ Tarefa vencendo


4.11 SISTEMA DE PROGRESSO
--------------------------
â€¢ Tracking automÃ¡tico de vÃ­deos assistidos
â€¢ Porcentagem de conclusÃ£o
â€¢ Tempo total assistido
â€¢ HistÃ³rico de visualizaÃ§Ãµes
â€¢ Certificados de conclusÃ£o (futuro)
â€¢ GamificaÃ§Ã£o (futuro)


4.12 GALERIA & PORTFOLIO
-------------------------
â€¢ Upload ilimitado de fotos
â€¢ Upload de vÃ­deos
â€¢ CategorizaÃ§Ã£o (jogo, treino, marketing)
â€¢ Destaque de mÃ­dias importantes
â€¢ Compartilhamento externo
â€¢ IncorporaÃ§Ã£o em perfil


4.13 INTERNACIONALIZAÃ‡ÃƒO
-------------------------
â€¢ Suporte a mÃºltiplos idiomas
â€¢ PortuguÃªs (PT)
â€¢ Espanhol (ES)
â€¢ Interface traduzida
â€¢ ConteÃºdo localizado


4.14 MOBILE RESPONSIVE
----------------------
â€¢ Design mobile-first
â€¢ Touch gestures
â€¢ Menus adaptÃ¡veis
â€¢ Player otimizado
â€¢ Upload via mobile
â€¢ Performance otimizada


â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                          5. PRODUTOS E SERVIÃ‡OS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

5.1 REVELA TALENTOS (R$ 197/mÃªs)
---------------------------------
PÃºblico: Atletas amadores 13-25 anos
Inclui:
â€¢ Acesso Ã  plataforma de conteÃºdo
â€¢ 50+ vÃ­deos de desenvolvimento
â€¢ Mentorias semanais ao vivo
â€¢ Certificados de conclusÃ£o
â€¢ Comunidade exclusiva
â€¢ Material didÃ¡tico
â€¢ Suporte via chat

NÃ£o Inclui:
â€¢ AnÃ¡lise de performance individual
â€¢ Marketing pessoal
â€¢ ConexÃµes com clubes


5.2 PLANO DE CARREIRA (R$ 997/mÃªs)
-----------------------------------
PÃºblico: Atletas profissionais e semi-profissionais
Inclui:
âœ“ TUDO do Revela Talentos +
â€¢ AnÃ¡lise profissional de performance
â€¢ Upload ilimitado de jogos
â€¢ Feedback individualizado de analistas
â€¢ Dashboard de mÃ©tricas
â€¢ Marketing pessoal (flyers, highlights)
â€¢ Perfil profissional completo
â€¢ ConexÃµes diretas com clubes
â€¢ Assessoria de carreira
â€¢ Chat direto com mentores
â€¢ Agenda personalizada
â€¢ RelatÃ³rios mensais

Diferencial: GestÃ£o 360Â° da carreira


5.3 PLANO INTERNACIONAL
-----------------------
Produto: IntercÃ¢mbio esportivo
Inclui:
â€¢ AvaliaÃ§Ã£o tÃ©cnica completa
â€¢ PreparaÃ§Ã£o documental
â€¢ Networking internacional
â€¢ EuroCamps na Europa
â€¢ Peneiras em clubes europeus
â€¢ Acompanhamento in loco
â€¢ Suporte de adaptaÃ§Ã£o
â€¢ Assessoria jurÃ­dica

PaÃ­ses-alvo:
â€¢ Portugal
â€¢ Espanha
â€¢ ItÃ¡lia
â€¢ Alemanha
â€¢ FranÃ§a


5.4 CAMPEONATOS EC10
--------------------
â€¢ Torneios mensais
â€¢ Categorias por idade
â€¢ Scouts presentes
â€¢ PremiaÃ§Ãµes
â€¢ Visibilidade
â€¢ Networking
â€¢ Gratuito para assinantes


5.5 EUROCAMP
------------
â€¢ ExperiÃªncia de 2 semanas na Europa
â€¢ Treinos em centros de alto rendimento
â€¢ Peneiras em clubes
â€¢ Turismo esportivo
â€¢ Mentoria cultural
â€¢ Networking internacional


â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                          6. DIFERENCIAIS DA PLATAFORMA
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

6.1 TECNOLOGIA
--------------
âœ“ Interface moderna e intuitiva
âœ“ Performance otimizada
âœ“ Responsive design
âœ“ PWA-ready
âœ“ Offline-first (futuro)
âœ“ Real-time updates
âœ“ Cloud infrastructure
âœ“ EscalÃ¡vel


6.2 INTELIGÃŠNCIA DE DADOS
--------------------------
âœ“ AnÃ¡lise preditiva de performance
âœ“ ComparaÃ§Ã£o com benchmark de mercado
âœ“ IdentificaÃ§Ã£o de pontos fortes/fracos
âœ“ RecomendaÃ§Ãµes personalizadas
âœ“ Reports automatizados
âœ“ Dashboard executivo


6.3 NETWORKING
--------------
âœ“ ConexÃ£o direta com clubes
âœ“ Base de scouts
âœ“ Agentes e empresÃ¡rios
âœ“ Rede internacional
âœ“ Eventos presenciais
âœ“ Comunidade ativa


6.4 CONTEÃšDO PROPRIETÃRIO
--------------------------
âœ“ 100+ horas de conteÃºdo exclusivo
âœ“ Profissionais certificados
âœ“ Metodologia comprovada
âœ“ AtualizaÃ§Ã£o constante
âœ“ Cases de sucesso
âœ“ Material didÃ¡tico


6.5 SUPORTE E MENTORIA
-----------------------
âœ“ Analistas dedicados
âœ“ Preparadores fÃ­sicos
âœ“ PsicÃ³logos esportivos
âœ“ Nutricionistas
âœ“ Mentores de carreira
âœ“ Equipe de marketing
âœ“ Suporte 24/7


6.6 COMPLIANCE E SEGURANÃ‡A
---------------------------
âœ“ LGPD compliant
âœ“ Dados criptografados
âœ“ Backups diÃ¡rios
âœ“ Audit logs
âœ“ Termos de uso claros
âœ“ Privacidade garantida
âœ“ Controle parental (menores)


6.7 MARKETING INTEGRADO
------------------------
âœ“ ProduÃ§Ã£o profissional de conteÃºdo
âœ“ GestÃ£o de redes sociais
âœ“ Campanhas de trÃ¡fego
âœ“ SEO otimizado
âœ“ Email marketing
âœ“ Funil automatizado
âœ“ Retargeting


6.8 ESCALABILIDADE
------------------
âœ“ Arquitetura serverless
âœ“ CDN global
âœ“ Load balancing
âœ“ Auto-scaling
âœ“ Multi-regiÃ£o
âœ“ 99.9% uptime SLA


â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                          7. FLUXOS DE TRABALHO PRINCIPAIS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

7.1 FLUXO: CADASTRO DE NOVO ATLETA
-----------------------------------
1. UsuÃ¡rio acessa a plataforma
2. Clica em "Entrar" ou "Cadastrar"
3. Redireciona para Google OAuth
4. Autoriza acesso
5. Sistema cria User automaticamente
6. Redireciona para pÃ¡gina de onboarding
7. Atleta preenche dados adicionais:
   - PosiÃ§Ã£o
   - Idade
   - Altura/Peso
   - Clube atual
   - Objetivos
8. Sistema salva dados
9. has_revela_talentos_access = true (padrÃ£o)
10. Redireciona para Hub


7.2 FLUXO: ASSISTIR CONTEÃšDO
-----------------------------
1. Atleta acessa Revela Talentos
2. Navega pelas categorias
3. Clica em um vÃ­deo
4. Sistema verifica acesso:
   - Revela Talentos: has_revela_talentos_access
   - Elite: has_plano_carreira_access
5. Se autorizado, abre player
6. Player inicia do progresso salvo
7. A cada 5 segundos, salva progresso
8. Ao atingir 90%, marca como completo
9. Atleta pode comentar
10. RecomendaÃ§Ãµes aparecem ao final


7.3 FLUXO: ANÃLISE DE PERFORMANCE
----------------------------------
[ATLETA]
1. Acessa "AnÃ¡lise de Performance"
2. Clica em "Registrar Nova Performance"
3. Preenche dados do jogo:
   - Data
   - AdversÃ¡rio
   - CompetiÃ§Ã£o
   - Local
4. Upload de vÃ­deo do jogo
5. Preenche diÃ¡rio:
   - Como se sentiu
   - Resumo da semana
6. Submete
7. Status: 'pending_analysis'

[SISTEMA]
8. Cria PerformanceData
9. Cria AdminNotification
10. Notifica analistas

[ANALISTA]
11. Recebe notificaÃ§Ã£o
12. Acessa Admin > Performance
13. Assiste ao vÃ­deo
14. Preenche mÃ©tricas:
    - Minutos jogados
    - Gols
    - AssistÃªncias
    - Passes
    - Nota
15. Escreve feedback detalhado
16. Salva
17. Status: 'completed'

[SISTEMA]
18. Cria UserNotification
19. Notifica atleta

[ATLETA]
20. Recebe notificaÃ§Ã£o
21. Visualiza feedback
22. Pode responder/comentar


7.4 FLUXO: SOLICITAÃ‡ÃƒO DE MARKETING
------------------------------------
[ATLETA]
1. Acessa "Marketing Hub"
2. Escolhe tipo:
   - Flyer
   - Highlight Reel
3. Upload de fotos/vÃ­deos
4. Preenche instruÃ§Ãµes
5. Submete
6. Status: 'pending'

[SISTEMA]
7. Cria registro Marketing
8. Notifica equipe de marketing

[MARKETING]
9. Recebe notificaÃ§Ã£o
10. Analisa solicitaÃ§Ã£o
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
2. Preenche formulÃ¡rio:
   - Nome
   - Email
   - WhatsApp
   - PosiÃ§Ã£o
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
10. Recebe notificaÃ§Ã£o
11. Lead aparece no pipeline
12. Vendedor liga/envia WhatsApp
13. Registra interaÃ§Ã£o (LeadInteraction)
14. Move no funil conforme conversa
15. Envia proposta
16. Status: 'proposta_enviada'
17. Acompanha atÃ© fechamento


7.6 FLUXO: LIVE AO VIVO
-----------------------
[ADMIN]
1. Acessa Admin > ConteÃºdo > Lives
2. Cria novo conteÃºdo:
   - Category: 'live'
   - Title: "Mentoria ao vivo - [Tema]"
   - Embed code do OneStream
3. is_published: true
4. status: 'live'
5. Salva

[SISTEMA]
6. Live aparece no card de Lives
7. Badge "AO VIVO" ativado
8. Envia notificaÃ§Ã£o para todos usuÃ¡rios
9. Push notification (se ativado)

[ATLETA]
10. Recebe notificaÃ§Ã£o
11. Clica no card de Lives
12. Redireciona para pÃ¡gina de Lives
13. Player carrega iframe OneStream
14. Chat interativo ativo
15. Pode comentar em tempo real

[PÃ“S-LIVE]
16. Admin muda status para 'ended'
17. Live move para aba "Mentorias"
18. Fica disponÃ­vel como VOD
19. Atletas podem assistir gravaÃ§Ã£o


7.7 FLUXO: SELETIVA ONLINE
---------------------------
[ATLETA]
1. Acessa "Seletiva Online"
2. LÃª sobre o processo
3. Preenche formulÃ¡rio:
   - Dados pessoais
   - PosiÃ§Ã£o
   - Altura/Peso
   - AutoavaliaÃ§Ã£o
4. Upload vÃ­deos:
   - Jogo completo
   - Drills especÃ­ficos
5. Aceita termos
6. Submete
7. Status: 'pending_review'

[SISTEMA]
8. Cria Seletiva
9. Notifica admin revela
10. Email de confirmaÃ§Ã£o

[ADMIN REVELA]
11. Acessa Admin > Seletivas
12. Lista de pendentes
13. Assiste aos vÃ­deos
14. Avalia:
    - TÃ©cnica
    - TÃ¡tico
    - FÃ­sico
    - Mental
15. Escreve feedback
16. DecisÃ£o:
    - Aprovado
    - Rejeitado
17. Status atualizado

[SISTEMA]
18. Notifica atleta
19. Se aprovado:
    - Convite para prÃ³xima fase
    - InstruÃ§Ãµes
20. Se rejeitado:
    - Feedback construtivo
    - Ãreas de melhoria


7.8 FLUXO: CAMPANHA DE MARKETING
---------------------------------
[MARKETING MANAGER]
1. Acessa Admin > Marketing
2. Cria nova campanha:
   - Nome
   - Plataforma (Meta Ads)
   - Tipo (Lead Generation)
   - ServiÃ§o (Plano Carreira)
   - Budget
   - PÃºblico-alvo
   - Criativos
   - Landing page
3. Status: 'draft'
4. Revisa
5. Ativa
6. Status: 'active'

[SISTEMA]
7. IntegraÃ§Ã£o com APIs de anÃºncios
8. Tracking de mÃ©tricas em tempo real
9. Atualiza dashboard automaticamente
10. Calcula ROI
11. Alerta se CPL acima do target
12. RelatÃ³rios diÃ¡rios

[LEADS GERADOS]
13. Visitante clica no anÃºncio
14. Chega na landing page
15. Preenche formulÃ¡rio
16. Lead criado automaticamente
17. AtribuÃ­do Ã  campanha
18. MÃ©tricas atualizadas:
    - Leads gerados +1
    - Cost per lead recalculado


â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                          8. INTEGRAÃ‡Ã•ES EXTERNAS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

8.1 ONESTREAM.LIVE
------------------
PropÃ³sito: TransmissÃµes ao vivo
ImplementaÃ§Ã£o:
â€¢ Iframe embed
â€¢ URL: https://ec10talentos141.onestream.live
â€¢ Chat interativo incluÃ­do
â€¢ EstatÃ­sticas de visualizaÃ§Ã£o
â€¢ Replay automÃ¡tico


8.2 GOOGLE OAUTH
----------------
PropÃ³sito: AutenticaÃ§Ã£o
Funcionalidades:
â€¢ Login social
â€¢ Cadastro simplificado
â€¢ Email verification automÃ¡tico
â€¢ Profile picture import


8.3 SUPABASE STORAGE
--------------------
PropÃ³sito: Armazenamento de arquivos
Uso:
â€¢ Upload de vÃ­deos
â€¢ Upload de fotos
â€¢ Arquivos de performance
â€¢ Materiais de marketing
â€¢ Thumbnails
â€¢ Documents


8.4 CLOUDFLARE
--------------
PropÃ³sito: CDN e seguranÃ§a
BenefÃ­cios:
â€¢ Cache global
â€¢ DDoS protection
â€¢ SSL/TLS
â€¢ Performance optimization
â€¢ Analytics


8.5 META ADS (Facebook/Instagram)
----------------------------------
PropÃ³sito: Publicidade
Features:
â€¢ Campaign management
â€¢ Audience targeting
â€¢ Conversion tracking
â€¢ Pixel integration
â€¢ Retargeting


8.6 GOOGLE ADS
--------------
PropÃ³sito: Search e Display ads
Features:
â€¢ Keyword targeting
â€¢ Display network
â€¢ YouTube ads
â€¢ Conversion tracking
â€¢ Analytics integration


8.7 TIKTOK ADS
--------------
PropÃ³sito: Alcance Gen Z
Features:
â€¢ Video ads
â€¢ Creator marketplace
â€¢ Pixel tracking


8.8 WHATSAPP BUSINESS
---------------------
PropÃ³sito: Atendimento
Features (futuro):
â€¢ Chatbot integration
â€¢ Message templates
â€¢ Quick replies
â€¢ Broadcasting
â€¢ Analytics


8.9 GOOGLE ANALYTICS
--------------------
PropÃ³sito: Analytics
MÃ©tricas:
â€¢ Page views
â€¢ User behavior
â€¢ Conversion funnels
â€¢ Demographics
â€¢ Device usage


8.10 HOTJAR
-----------
PropÃ³sito: UX research
Features:
â€¢ Heatmaps
â€¢ Session recordings
â€¢ Surveys
â€¢ Feedback widgets


â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                          9. SEGURANÃ‡A E COMPLIANCE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

9.1 LGPD (Lei Geral de ProteÃ§Ã£o de Dados)
------------------------------------------
Conformidade:
âœ“ Consentimento explÃ­cito
âœ“ Finalidade clara
âœ“ MinimizaÃ§Ã£o de dados
âœ“ TransparÃªncia
âœ“ Direito ao esquecimento
âœ“ Portabilidade de dados
âœ“ Encarregado de dados definido
âœ“ Registro de tratamento
âœ“ AvaliaÃ§Ã£o de impacto


9.2 SEGURANÃ‡A DE DADOS
----------------------
Medidas:
â€¢ Criptografia em repouso
â€¢ Criptografia em trÃ¢nsito (SSL/TLS)
â€¢ Hashing de senhas (bcrypt)
â€¢ Tokens JWT
â€¢ Rate limiting
â€¢ CORS configurado
â€¢ XSS protection
â€¢ CSRF protection
â€¢ SQL injection prevention
â€¢ Input sanitization


9.3 CONTROLE DE ACESSO
----------------------
NÃ­veis:
1. PÃºblico (sem login)
   - Landing pages
   - PÃ¡gina inicial
   
2. UsuÃ¡rio Autenticado
   - Hub
   - Revela Talentos (se has_revela_talentos_access)
   - Perfil
   
3. Plano de Carreira
   - AnÃ¡lise de performance
   - Marketing hub
   - Mensagens
   (requires: has_plano_carreira_access)
   
4. Admin Revela
   - Dashboard Revela
   - Seletivas
   - ConteÃºdos
   (requires: is_revela_admin)
   
5. Admin Geral
   - Acesso total
   (requires: role === 'admin')


9.4 AUDITORIA
-------------
Log de AÃ§Ãµes:
â€¢ Todas aÃ§Ãµes admin registradas
â€¢ HistÃ³rico de mudanÃ§as
â€¢ IP e timestamp
â€¢ Before/after states
â€¢ Rastreabilidade completa


9.5 BACKUP
----------
EstratÃ©gia:
â€¢ Backups diÃ¡rios automatizados
â€¢ RetenÃ§Ã£o: 30 dias
â€¢ Backup incremental
â€¢ Testes de restore mensais
â€¢ Geo-redundÃ¢ncia


9.6 PROTEÃ‡ÃƒO DE MENORES
------------------------
Medidas:
â€¢ VerificaÃ§Ã£o de idade
â€¢ Dados de responsÃ¡vel obrigatÃ³rios
â€¢ Consentimento parental
â€¢ ConteÃºdo apropriado
â€¢ Monitoramento de interaÃ§Ãµes


â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                          10. ROADMAP E FUTURO
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

10.1 EM DESENVOLVIMENTO
-----------------------
Q1 2025:
â€¢ App mÃ³vel nativo (iOS/Android)
â€¢ Sistema de gamificaÃ§Ã£o
â€¢ Badges e conquistas
â€¢ Ranking de atletas
â€¢ IntegraÃ§Ã£o WhatsApp Business
â€¢ IA para anÃ¡lise de vÃ­deo
â€¢ SugestÃµes automÃ¡ticas de melhoria

Q2 2025:
â€¢ Marketplace de serviÃ§os
â€¢ ConexÃ£o com clubes automatizada
â€¢ Sistema de avaliaÃ§Ã£o de clubes
â€¢ Comparador de propostas
â€¢ Agendamento automatizado
â€¢ VideoconferÃªncia integrada

Q3 2025:
â€¢ ExpansÃ£o internacional
â€¢ VersÃ£o em inglÃªs
â€¢ Clubes europeus parceiros
â€¢ Sistema de contrataÃ§Ã£o
â€¢ Smart contracts (blockchain)
â€¢ NFTs de conquistas


10.2 BACKLOG DE FEATURES
-------------------------
â€¢ Live streaming do prÃ³prio atleta
â€¢ Stories/Feed social
â€¢ Grupos de treinamento
â€¢ Desafios semanais
â€¢ Torneios online
â€¢ Simulador de carreira
â€¢ Financial planning
â€¢ Assessoria jurÃ­dica
â€¢ Seguro de atleta
â€¢ Programa de afiliados


10.3 MELHORIAS TÃ‰CNICAS
-----------------------
â€¢ MigraÃ§Ã£o para Next.js
â€¢ Server-side rendering
â€¢ Offline mode (PWA)
â€¢ Web push notifications
â€¢ WebRTC para calls
â€¢ GraphQL API
â€¢ Microservices architecture
â€¢ Kubernetes deployment
â€¢ AI/ML integration
â€¢ Blockchain integration


10.4 EXPANSÃƒO DE NEGÃ“CIO
-------------------------
â€¢ Parcerias com clubes de base
â€¢ ConvÃªnios com escolas
â€¢ Programa de embaixadores
â€¢ AfiliaÃ§Ã£o de treinadores
â€¢ Licenciamento de conteÃºdo
â€¢ Merchandising EC10
â€¢ Eventos presenciais
â€¢ ClÃ­nicas de futebol
â€¢ Torneios oficiais


â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                          11. MÃ‰TRICAS DE SUCESSO
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

11.1 KPIs DE PRODUTO
--------------------
â€¢ MAU (Monthly Active Users)
â€¢ DAU (Daily Active Users)
â€¢ Retention rate (D1, D7, D30)
â€¢ Churn rate
â€¢ Average session duration
â€¢ Videos watched per user
â€¢ Completion rate
â€¢ NPS (Net Promoter Score)
â€¢ CSAT (Customer Satisfaction)


11.2 KPIs DE NEGÃ“CIO
--------------------
â€¢ MRR (Monthly Recurring Revenue)
â€¢ ARR (Annual Recurring Revenue)
â€¢ CAC (Customer Acquisition Cost)
â€¢ LTV (Lifetime Value)
â€¢ LTV:CAC ratio
â€¢ Conversion rate (lead â†’ customer)
â€¢ Average ticket
â€¢ Upsell rate (Revela â†’ Carreira)


11.3 KPIs DE MARKETING
----------------------
â€¢ CPL (Cost Per Lead)
â€¢ CPM (Cost Per Mille)
â€¢ CTR (Click-Through Rate)
â€¢ CPC (Cost Per Click)
â€¢ ROAS (Return On Ad Spend)
â€¢ Organic traffic growth
â€¢ Social media engagement
â€¢ Email open rate
â€¢ Funnel conversion rate


11.4 KPIs DE CONTEÃšDO
---------------------
â€¢ Watch time total
â€¢ Average watch percentage
â€¢ Drop-off points
â€¢ Most watched videos
â€¢ Comments per video
â€¢ Shares
â€¢ Ratings
â€¢ Content ROI


â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                          12. CONCLUSÃƒO
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

A EC10 TALENTOS Ã© uma plataforma completa e robusta de gestÃ£o e desenvolvimento 
de atletas de futebol, que combina:

âœ“ Tecnologia de ponta
âœ“ ConteÃºdo exclusivo e profissional
âœ“ AnÃ¡lise de dados avanÃ§ada
âœ“ CRM e marketing integrados
âœ“ Networking internacional
âœ“ Suporte humanizado
âœ“ Escalabilidade comprovada

DIFERENCIAIS COMPETITIVOS:
--------------------------
1. Ãšnica plataforma all-in-one para atletas brasileiros
2. Tecnologia proprietÃ¡ria de anÃ¡lise de performance
3. Rede estabelecida de clubes e scouts
4. ConteÃºdo criado por profissionais de elite
5. Track record de atletas desenvolvidos
6. Sistema de CRM completo integrado
7. Marketing automation avanÃ§ado

CASOS DE SUCESSO:
----------------
â€¢ 50+ atletas profissionalizados
â€¢ 15+ atletas em clubes europeus
â€¢ 200+ atletas em desenvolvimento ativo
â€¢ 1000+ horas de conteÃºdo assistido
â€¢ 95% de satisfaÃ§Ã£o dos usuÃ¡rios
â€¢ 80% retention rate

INVESTIMENTO EM TECNOLOGIA:
---------------------------
â€¢ R$ 150k+ em desenvolvimento
â€¢ Infraestrutura escalÃ¡vel
â€¢ Time tÃ©cnico qualificado
â€¢ AtualizaÃ§Ãµes contÃ­nuas
â€¢ Suporte 24/7

A PLATAFORMA ESTÃ PRONTA PARA:
-------------------------------
âœ“ Escalar para 10.000+ usuÃ¡rios
âœ“ ExpansÃ£o internacional
âœ“ Novos produtos e serviÃ§os
âœ“ Parcerias estratÃ©gicas
âœ“ Levantamento de investimento

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

ðŸ“ž CONTATO TÃ‰CNICO
Email: dev@ec10talentos.com
Suporte: suporte@ec10talentos.com
Comercial: vendas@ec10talentos.com

ðŸ”’ CONFIDENCIAL - NÃƒO DISTRIBUIR

Â© ${new Date().getFullYear()} EC10 Talentos. Todos os direitos reservados.

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
`}
        </div>
      </div>
    </div>
  );
}
