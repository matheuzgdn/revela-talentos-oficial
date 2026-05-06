import { useState, useEffect, useMemo, useRef } from "react";
import MainLandingCarousel from "../components/hub/MainLandingCarousel";
import { appClient as base44 } from "@/api/backendClient";
import BeneficiosRevelaTalentos from "../components/hub/BeneficiosRevelaTalentos";
import { Link } from "react-router-dom";
import {
  Sparkles, Award, Users,
  ChevronDown, ChevronUp,
  Star, Globe, Shield, Zap, Calendar, User, MapPin, Lock, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  createSchoolPartnerFormState,
  formatSchoolPartnerPhone,
  normalizeSchoolPartnerPhone,
  readSchoolPartnerPreRegistration,
  writeSchoolPartnerPreRegistration,
} from "@/lib/schoolPartnerRegistration";
import { syncSchoolPartnerLeadToSheets } from "@/lib/schoolPartnerSheets";

// FAQs adaptadas para os Pais de Atletas
const faqs = [
  {
    q: "O que é a nova parceria da escola com a Revela Talentos?",
    a: "É uma união inovadora onde a escola passa a contar com a metodologia de desenvolvimento humano, esportivo e socioemocional da EC10 Talentos, potencializando o aprendizado e a descoberta das vocações do seu filho dentro e fora das salas de aula."
  },
  {
    q: "Como será a Live de Lançamento com o Eric Cena?",
    a: "No dia 25/05, Eric Cena, nosso fundador, fará uma apresentação especial explicando todos os pilares da metodologia, os benefícios diretos para sua família e as novas oportunidades que seu filho terá na escola."
  },
  {
    q: "Posso acessar a plataforma para acompanhar meu filho?",
    a: "Com certeza! A plataforma estimula a conexão família-escola, permitindo que os pais acompanhem de perto o engajamento esportivo, as métricas de saúde e o desenvolvimento socioemocional."
  }
];

// benefits constant removed as it's now handled by BeneficiosRevelaTalentos component

const steps = [
  { num: "01", icon: Calendar, title: "Live de Lançamento - Dia 25/05", desc: "Marque na sua agenda e assista ao evento oficial com Eric Cena. Descubra os detalhes impactantes dessa transformação no ensino." },
  { num: "02", icon: User, title: "Recepção dos Acessos", desc: "A escola fará a orientação e distribuição das credenciais de acesso para que os atletas configurem seu perfil na EC10." },
  { num: "03", icon: Shield, title: "Acompanhe e Celebre", desc: "Veja a evolução através dos novos treinos, mentorias em vídeo e capacitações presentes no aplicativo." }
];

const testimonials = [
  {
    name: "Mãe do Matheus (14 anos)",
    school: "Colégio Horizonte Azul",
    text: "Meu filho mudou radicalmente de postura em casa e nos estudos. A mentalidade que ele adotou agora é de um verdadeiro atleta nota 10!",
    rating: 5,
    avatar: "M"
  },
  {
    name: "Pai da Sofia (12 anos)",
    school: "Instituto Nova Geração",
    text: "Assistir às explicações sobre a metodologia me deu imensa segurança. Ter essa excelência junto ao colégio é um projeto brilhante.",
    rating: 5,
    avatar: "P"
  },
  {
    name: "Mãe do Lucas (15 anos)",
    school: "Colégio Atlas do Saber",
    text: "Saber que a escola forma meu filho não somente como aluno, mas prepara o caráter humano pro mundo real, nos dá uma paz tremenda.",
    rating: 5,
    avatar: "M"
  }
];

// === DADOS E FUNÇÕES DE PROVAS SOCIAIS INJETADOS ===
const athleteSpotlights = {
  default: {
    eyebrow: '/ Atletas Revelados',
    highlight: 'DESENVOLVIMENTO',
    description: 'Atletas e alunos que já vêm sendo forjados por nossa metodologia desde a base até o exterior.',
    accent: 'cyan',
    items: [
      ['Theo e Luccas', 'America Mineiro', 'https://static.wixstatic.com/media/933cdd_cb57242b5d6a473cafa74fbdc70d897d~mv2.jpeg/v1/fill/w_600,h_437,al_c,q_80,enc_auto/933cdd_cb57242b5d6a473cafa74fbdc70d897d~mv2.jpeg'],
      ['Destaque Cruzeiro', 'Cruzeiro', 'https://static.wixstatic.com/media/933cdd_55eca19f9cf84b5da7f567431ebed772~mv2.jpg/v1/fill/w_448,h_600,al_c,lg_1,q_80,enc_auto/933cdd_55eca19f9cf84b5da7f567431ebed772~mv2.jpg'],
      ['Arthur', 'Inter de Limeira', 'https://video.wixstatic.com/video/933cdd_6c1ddd2b23494c7db12be6d59cad2ceb/480p/mp4/file.mp4'],
      ['Cristofer', 'SC Braga', 'https://static.wixstatic.com/media/933cdd_bd442822567b47b89fba73ff96de5ef9~mv2.jpg'],
      ['Eduardo', 'Estoril', 'https://video.wixstatic.com/video/933cdd_c5ddcbf7072b4f6aa12e3dc225532342/720p/mp4/file.mp4'],
      ['Juan', 'Atletico de Madrid', 'https://static.wixstatic.com/media/933cdd_57a7f61662d8485d876dfad0cd849b17~mv2.jpg'],
    ],
  }
};

const marqueeCards = [
  ['GETAFE CF', 'Espanha', 'https://static.wixstatic.com/media/933cdd_205438f6941b4a4ab93e71747b9d3d8e~mv2.png'],
  ['NOVOHORIZONTINO', 'Brasil', 'https://static.wixstatic.com/media/933cdd_1bd05dce59264c96aaf31a31e0a59341~mv2.png'],
  ['ATLETICO', 'Espanha', 'https://static.wixstatic.com/media/933cdd_57a7f61662d8485d876dfad0cd849b17~mv2.jpg'],
  ['SC BRAGA', 'Portugal', 'https://static.wixstatic.com/media/933cdd_7cc3cf595f684a1faec143ec04b34966~mv2.jpg'],
  ['ROYAL CITY', 'Índia', 'https://static.wixstatic.com/media/933cdd_a60fbc26f42f402c9674ca2f869bbafe~mv2.jpeg'],
  ['AMERICA', 'Brasil', 'https://static.wixstatic.com/media/933cdd_14ccc273b64f4cabbe2e143c50b26878~mv2.png'],
];

const statsData = {
  statOneValue: '150+',
  statOneLabel: 'ATLETAS AGENCIADOS / REVELADOS',
  statOneText: 'Jovens em preparação para oportunidades reais no Brasil e no exterior.',
  statOneImage: 'https://static.wixstatic.com/media/933cdd_5a8acbfba7eb428ca9a13031d12334db~mv2.jpg/v1/fill/w_450,h_600,al_c,q_80,enc_auto/933cdd_5a8acbfba7eb428ca9a13031d12334db~mv2.jpg',
  statTwoEyebrow: 'MERCADO INTERNACIONAL',
  statTwoValue: '+14',
  statTwoTitle: 'PAÍSES',
  statTwoCaption: 'ATIVOS AGORA',
  statTwoVideo: 'https://video.wixstatic.com/video/933cdd_eb14b07c4db843ac878f02fed62bb4c6/720p/mp4/file.mp4',
  countries: ['Espanha', 'Portugal', 'Polônia', 'Eslováquia', 'EUA'],
};

const heroServiceCards = [
  {
    title: 'Seletiva Online',
    tag: 'Avaliacao',
    icon: Sparkles,
    image: 'https://video.wixstatic.com/video/933cdd_508da8c819d846178e59499261f1d9dc/1080p/mp4/file.mp4',
    description: 'Envie o video do seu filho para uma avaliacao tecnica. Caso aprovado, o atleta passara a ser agenciado por nossa empresa, com foco no encaminhamento para clubes parceiros em territorio nacional e internacional.',
  },
  {
    title: 'Mentoria Esportiva',
    tag: 'Exclusivo',
    icon: Award,
    image: 'https://static.wixstatic.com/media/933cdd_5a16fbb433bd42a9917cf902c77c69a3~mv2.jpg/v1/fill/w_270,h_600,al_c,lg_1,q_80,enc_auto/933cdd_5a16fbb433bd42a9917cf902c77c69a3~mv2.jpg',
    description: 'Transforme o talento do seu filho em desempenho de elite. Com minha mentoria, focamos no preparo mental e tecnico para enfrentar os desafios das categorias de base. O objetivo e um so: destaque absoluto e a transicao segura para o futebol profissional.',
  },
  {
    title: 'Mentoria para os Pais',
    tag: 'Para os Pais',
    icon: Users,
    image: 'https://video.wixstatic.com/video/933cdd_0da06fefa3df4c7bab6f1a2d74824261/1080p/mp4/file.mp4',
    description: 'Prepare-se para ser o pilar estrategico na carreira do seu filho. Aprenda a tomar decisoes seguras, entender o mercado do futebol e assumir o papel de principal gestor da jornada esportiva dele. Transforme o sonho em um plano de carreira profissional.',
  },
  {
    title: 'Intercambio Avaliativo Internacional',
    tag: 'Exterior',
    icon: Globe,
    image: 'https://video.wixstatic.com/video/933cdd_eb14b07c4db843ac878f02fed62bb4c6/720p/mp4/file.mp4',
    description: 'Leve o futebol do seu filho para o proximo nivel. Agende agora um intercambio avaliativo nos principais clubes europeus. Oferecemos suporte completo para que ele mostre seu potencial nos grandes centros do futebol mundial. As vagas sao limitadas.',
  },
  {
    title: 'Seletiva Presencial',
    tag: 'Captacao',
    icon: Zap,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQac45BGNq3exmuKfbTi46FZvHP2kcxoL6e6g&s',
    description: 'Garanta sua vaga nas seletivas presenciais da EC10 Talentos. Estaremos em varios estados do Brasil com captadores de clubes parceiros e nosso staff completo para avaliar seu potencial.',
  },
];

const heroServiceCarouselCards = [...heroServiceCards, ...heroServiceCards];

const opportunitiesData = [
  { title: 'Avaliação Premium', location: 'São Paulo, Brasil', flag: '🇧🇷', country: 'Brasil', market: 'Base Nacional', format: 'Presencial', teaser: 'Vagas limitadas para escolas parceiras.' },
  { title: 'Alta Performance', location: 'Belo Horizonte, Brasil', flag: '🇧🇷', country: 'Brasil', market: 'Desenvolvimento', format: 'Presencial', teaser: 'Ambiente ideal para acelerar evolução.' },
  { title: 'Janela Portugal', location: 'Braga, Portugal', flag: '🇵🇹', country: 'Portugal', market: 'Europa', format: 'Híbrido', teaser: 'Uma rota aberta para o mercado europeu.' },
  { title: 'Camp Espanha', location: 'Madrid, Espanha', flag: '🇪🇸', country: 'Espanha', market: 'Europa', format: 'Híbrido', teaser: 'Curadoria especial para atletas promissores.' },
  { title: 'Exposição Polônia', location: 'Varsóvia, Polônia', flag: '🇵🇱', country: 'Polônia', market: 'Europa', format: 'Online + Presencial', teaser: 'Uma vitrine estratégica em crescimento.' },
  { title: 'Entrada Eslováquia', location: 'Bratislava, Eslováquia', flag: '🇸🇰', country: 'Eslováquia', market: 'Europa', format: 'Online + Presencial', teaser: 'Descubra uma porta de entrada competitiva.' },
];

const accentText = { cyan: 'text-[#00f3ff]' };
const accentGradient = { cyan: 'from-[#00f3ff] via-cyan-200 to-white' };
const schoolPartnerWhatsAppGroupUrl = "https://chat.whatsapp.com/G1xkIdMkAEv3auZ5tQZH5P";
const partnerSchoolEntityCandidates = ["PartnerSchool", "School", "Escola", "Institution", "PartnerInstitution", "SchoolUnit", "LeadPage"];
const schoolNameFieldCandidates = ["school_name", "name", "title", "display_name", "institution_name", "partner_name", "school", "full_name"];
const pageCopyByAudience = {
  schools: {
    sheetsPage: "escolas-parceiras",
    sourcePagePreRegistration: "escola_parceira_pre_cadastro",
    sourcePageSchedule: "escola_parceira",
    requiresEmail: true,
    requiresSchool: true,
    preRegistrationObjective: "Pré-cadastro inicial da Escola Parceira",
    scheduleObjective: "Agendamento para a apresentação da Escola Parceira",
    preRegistrationNote: (school) => `Escola parceira informada: ${school}. Pré-cadastro realizado antes do desbloqueio da página de escolas parceiras.`,
    scheduleNote: (school) => `Escola parceira informada: ${school}. Interesse: acompanhar a apresentação da parceria e metodologia da Revela Talentos.`,
    heroAudience: "Escolas Parceiras",
    heroDescription: "Plataforma especializada em educação esportiva e conectar atletas talentosos em clubes do mundo inteiro.",
    entryTitle: "Identifique-se para liberar a página da sua escola parceira",
    entryDescription: "Faça seu pré-cadastro logo na entrada. Depois disso, os botões de inscrição já vão usar esses dados automaticamente.",
    entryFooter: "Ao continuar, você registra seu interesse na Revela Talentos e na parceria da sua escola para não precisar preencher tudo de novo depois.",
    schoolLabel: "Escola parceira",
    schoolPlaceholder: "Selecione ou digite o nome da escola",
    schoolManualPlaceholder: "Digite o nome da escola parceira",
    schoolHelper: "Esse pré-cadastro libera a página e mantém seus dados prontos para os próximos botões.",
    scheduleTitle: "Garanta sua presença com os dados da sua escola parceira",
    scheduleDescription: "Seus dados do pré-cadastro já chegaram aqui. Revise, ajuste se quiser e confirme a presença na live da escola parceira.",
    scheduleSchoolHelper: "Para manter a identificação alinhada ao banco da Revela Talentos, escolha uma escola válida da lista.",
    scheduleSchoolManualHelper: "Se a lista pública das escolas não estiver acessível neste momento, ainda registraremos o nome informado para validação interna.",
    reminderAudienceLine: "Inscrição gratuita para famílias das escolas parceiras",
    validationRequiredError: "Preencha nome completo, WhatsApp, e-mail e escola parceira.",
    validationInvalidSchoolError: "Selecione uma escola parceira válida da lista da Revela Talentos.",
    footerBrand: "Revela Talentos & Escola Parceira",
  },
  families: {
    sheetsPage: "pais-atletas",
    sourcePagePreRegistration: "pais_atletas_pre_cadastro",
    sourcePageSchedule: "pais_atletas",
    requiresEmail: false,
    requiresSchool: false,
    preRegistrationObjective: "Pré-cadastro inicial para Pais e Atletas",
    scheduleObjective: "Agendamento para a apresentação para Pais e Atletas",
    preRegistrationNote: () => "Pré-cadastro realizado antes do desbloqueio da página para pais e atletas.",
    scheduleNote: () => "Interesse: acompanhar a apresentação da metodologia da Revela Talentos para pais e atletas.",
    heroAudience: "Pais e Atletas",
    heroDescription: "Página gratuita para pais, responsáveis e atletas entenderem como a Revela Talentos ajuda a transformar potencial esportivo em plano de carreira.",
    entryTitle: "Identifique-se para liberar a página de pais e atletas",
    entryDescription: "Faça seu pré-cadastro logo na entrada. Depois disso, os botões de inscrição já vão usar esses dados automaticamente para confirmar sua presença.",
    entryFooter: "Ao continuar, você registra seu interesse na Revela Talentos e deixa seus dados prontos para participar da apresentação.",
    schoolLabel: "Escola ou projeto",
    schoolPlaceholder: "Selecione ou digite o nome da escola/projeto",
    schoolManualPlaceholder: "Digite o nome da escola ou projeto do atleta",
    schoolHelper: "Esse pré-cadastro libera a página e mantém seus dados prontos para a inscrição da live.",
    scheduleTitle: "Garanta sua presença com os dados do responsável e do atleta",
    scheduleDescription: "Seus dados do pré-cadastro já chegaram aqui. Revise, ajuste se quiser e confirme sua presença na live para pais e atletas.",
    scheduleSchoolHelper: "Para manter a identificação alinhada ao banco da Revela Talentos, escolha uma escola ou projeto válido da lista.",
    scheduleSchoolManualHelper: "Se a lista não estiver acessível neste momento, registraremos o nome informado para validação interna.",
    reminderAudienceLine: "Inscrição gratuita para pais, responsáveis e atletas",
    validationRequiredError: "Preencha nome completo e WhatsApp.",
    validationInvalidSchoolError: "Selecione uma escola ou projeto válido da lista da Revela Talentos.",
    footerBrand: "Revela Talentos & Pais e Atletas",
  },
};

function isVideoMedia(value = '') { return /\.mp4($|\?)/i.test(value) || String(value).includes('/mp4/'); }
function normalizeSchoolName(value = "") { return String(value).trim().replace(/\s+/g, " ").toLowerCase(); }
function isSchoolLikeName(value = "") { return /(escola|col[eé]gio|instituto|academy|academia|school)/i.test(String(value)); }
function extractPartnerSchoolNames(records = [], entityName = "") {
  return [...new Set(
    (records || [])
      .map((record) => {
        for (const field of schoolNameFieldCandidates) {
          const candidate = record?.[field];
          if (typeof candidate !== "string") continue;
          const trimmed = candidate.trim();
          if (!trimmed) continue;
          if (entityName === "LeadPage") {
            if (!isSchoolLikeName(trimmed) || normalizeSchoolName(trimmed) === "escola parceira") {
              continue;
            }
          }
          return trimmed;
        }
        return null;
      })
      .filter(Boolean)
  )].sort((left, right) => left.localeCompare(right, "pt-BR"));
}
function validateSchoolPartnerForm(form = {}, partnerSchools = [], pageCopy = pageCopyByAudience.schools) {
  const fullName = String(form.full_name || "").trim();
  const email = String(form.email || "").trim();
  const school = String(form.school || "").trim();
  const phone = normalizeSchoolPartnerPhone(form.phone || "");
  const requiresEmail = pageCopy.requiresEmail !== false;
  const requiresSchool = pageCopy.requiresSchool !== false;

  if (!fullName || phone.length < 10 || (requiresEmail && !email) || (requiresSchool && !school)) {
    return { error: pageCopy.validationRequiredError };
  }

  if (
    requiresSchool &&
    partnerSchools.length > 0 &&
    !partnerSchools.some((option) => normalizeSchoolName(option) === normalizeSchoolName(school))
  ) {
    return { error: pageCopy.validationInvalidSchoolError };
  }

  return {
    data: {
      full_name: fullName,
      email: requiresEmail ? email : "",
      school: requiresSchool ? school : "",
      phone,
    },
  };
}

function hasCompleteAudiencePreRegistration(value = {}, pageCopy = pageCopyByAudience.schools) {
  const requiresEmail = pageCopy.requiresEmail !== false;
  const requiresSchool = pageCopy.requiresSchool !== false;

  return Boolean(
    value?.full_name &&
    normalizeSchoolPartnerPhone(value?.phone || "").length >= 10 &&
    (!requiresEmail || value?.email) &&
    (!requiresSchool || value?.school)
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border border-white/10 rounded-xl overflow-hidden transition-all duration-300 ${open ? 'bg-white/5' : 'bg-white/[0.02]'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 p-4 text-left sm:p-6">
        <span className="text-base font-medium text-white sm:text-lg">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (<div className="px-4 pb-4 leading-relaxed text-gray-300 sm:px-6 sm:pb-6">{a}</div>)}
    </div>
  );
}

function ReminderInvitationCard({ accentGlow, onPrimaryClick, audienceLine = pageCopyByAudience.schools.reminderAudienceLine }) {
  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-white/12 bg-[linear-gradient(180deg,rgba(8,12,20,0.92),rgba(4,7,12,0.98))] shadow-[0_30px_90px_rgba(0,0,0,0.38)]">
      <div className="relative bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_34%),linear-gradient(180deg,rgba(9,18,33,0.98),rgba(5,10,18,1))] px-5 py-7 text-center sm:px-8 sm:py-9">
        <Badge className="border border-red-500/25 bg-red-500/14 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-red-300">
          Dia 25/05
        </Badge>
        <h3 className="mt-5 text-[2.2rem] font-black leading-[0.95] text-white sm:text-[3rem]">
          <span className={`bg-gradient-to-r ${accentGlow} bg-clip-text text-transparent`}>INSCRIÇÃO GRATUITA</span>
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/76 sm:text-base">
          Evento on-line gratuito onde vamos revelar o segredo para chegar no futebol profissional e como seu filho pode se tornar um melhor atleta através da Revela Talentos.
        </p>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-300 sm:text-xs">
          {audienceLine}
        </p>
        <Button
          type="button"
          onClick={onPrimaryClick}
          className="hero-cta-alert mt-6 h-12 w-full rounded-[1.15rem] border border-red-300/20 px-6 text-sm font-bold text-white sm:h-14 sm:text-base"
        >
          <Calendar className="mr-2.5 h-4 w-4 sm:h-5 sm:w-5" />
          Agendar Lembrete na Live
        </Button>
      </div>
    </div>
  );
}

function StatsSection({ accentClass }) {
  return (
    <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-20">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <span className={`mb-4 block font-mono text-xs uppercase tracking-[0.3em] ${accentClass}`}>/ Nossa Força</span>
          <h2 className="text-[1.9rem] font-bold text-white sm:text-3xl md:text-4xl">NÚMEROS QUE COMPROVAM</h2>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          <article className="relative flex h-[260px] flex-col justify-end overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0a0a0a] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:h-[390px] sm:rounded-[2rem] sm:p-6 md:h-[470px] md:p-10">
            <img src={statsData.statOneImage} alt="Atletas" className="absolute inset-0 h-full w-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040507] via-[#040507]/60 to-transparent" />
            <div className="relative z-10">
              <div className="mb-2 text-[2.35rem] font-black tracking-tighter text-white sm:text-6xl md:text-7xl">{statsData.statOneValue.replace('+', '')}<span className={accentClass}>+</span></div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-gray-300 sm:text-sm sm:tracking-[0.3em] md:text-base">{statsData.statOneLabel}</div>
              <p className="mt-4 max-w-sm text-[12px] leading-relaxed text-gray-300 sm:mt-5 sm:text-sm">{statsData.statOneText}</p>
            </div>
          </article>

          <article className="relative flex h-[260px] flex-col justify-end overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0a0a0a] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:h-[390px] sm:rounded-[2rem] sm:p-6 md:h-[470px] md:p-10">
            <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-55">
              <source src={statsData.statTwoVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#040507]/90 via-[#040507]/40 to-transparent" />
            <div className="relative z-10">
              <div className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-gray-300 sm:text-sm sm:tracking-[0.3em] md:text-base">{statsData.statTwoEyebrow}</div>
              <div className="flex items-end gap-3">
                <div className="text-[2.6rem] font-black tracking-tight text-white sm:text-6xl md:text-7xl">{statsData.statTwoValue}</div>
                <div className="pb-1 font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-white/70 sm:text-xs">{statsData.statTwoCaption}</div>
              </div>
              <div className={`mt-2 text-2xl font-black uppercase tracking-tight sm:text-3xl ${accentClass}`}>{statsData.statTwoTitle}</div>
              <div className="mt-5 flex flex-wrap gap-2">
                {statsData.countries.map((country) => (
                  <span key={country} className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur sm:text-[11px]">
                    {country}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default function EscolaParceira({ audience = "schools" }) {
  const pageCopy = pageCopyByAudience[audience] || pageCopyByAudience.schools;
  const requiresEmail = pageCopy.requiresEmail !== false;
  const requiresSchool = pageCopy.requiresSchool !== false;
  const initialPreRegistration = readSchoolPartnerPreRegistration();
  const [scrolled, setScrolled] = useState(false);
  const [storedPreRegistration, setStoredPreRegistration] = useState(() => initialPreRegistration);
  const [isEntryGateOpen, setIsEntryGateOpen] = useState(() => !hasCompleteAudiencePreRegistration(initialPreRegistration, pageCopy));
  const [isSubmittingPreRegistration, setIsSubmittingPreRegistration] = useState(false);
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [activeHeroService, setActiveHeroService] = useState(null);
  const [isHeroCarouselPaused, setIsHeroCarouselPaused] = useState(false);
  const [partnerSchools, setPartnerSchools] = useState([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);
  const [isScheduleConfirmed, setIsScheduleConfirmed] = useState(false);
  const [scheduleForm, setScheduleForm] = useState(() => createSchoolPartnerFormState(initialPreRegistration));

  // Spotlight / Social Proof states
  const trackRef = useRef(null);
  const signupHighlightTimeoutRef = useRef(null);
  const heroCarouselResumeTimeoutRef = useRef(null);
  const whatsappRedirectTimeoutRef = useRef(null);
  const variant = 'default';
  const spotlight = useMemo(() => athleteSpotlights[variant] || athleteSpotlights.default, [variant]);
  const accentClass = accentText[spotlight.accent] || accentText.cyan;
  const accentGlow = accentGradient[spotlight.accent] || accentGradient.cyan;
  const hasPreRegistration = hasCompleteAudiencePreRegistration(storedPreRegistration, pageCopy);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const previousOverflow = document.body.style.overflow;
    if (isEntryGateOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isEntryGateOpen]);

  useEffect(() => {
    return () => {
      if (signupHighlightTimeoutRef.current) {
        window.clearTimeout(signupHighlightTimeoutRef.current);
      }
      if (heroCarouselResumeTimeoutRef.current) {
        window.clearTimeout(heroCarouselResumeTimeoutRef.current);
      }
      if (whatsappRedirectTimeoutRef.current) {
        window.clearTimeout(whatsappRedirectTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!requiresSchool || ((!isSchedulingOpen && !isEntryGateOpen) || partnerSchools.length > 0 || isLoadingSchools)) return;
    const loadPartnerSchools = async () => {
      setIsLoadingSchools(true);
      try {
        for (const entityName of partnerSchoolEntityCandidates) {
          try {
            const records = await base44.entities[entityName].list();
            const names = extractPartnerSchoolNames(records, entityName);
            if (names.length > 0) {
              setPartnerSchools(names);
              return;
            }
          } catch (error) {
            // Continua para o próximo candidato disponível publicamente.
          }
        }
      } finally {
        setIsLoadingSchools(false);
      }
    };
    loadPartnerSchools();
  }, [isEntryGateOpen, isSchedulingOpen, partnerSchools.length, isLoadingSchools, requiresSchool]);

  const persistPreRegistration = (payload, extras = {}) => {
    const nextValue = {
      ...storedPreRegistration,
      ...extras,
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone,
      school: payload.school,
    };

    setStoredPreRegistration(nextValue);
    setScheduleForm(createSchoolPartnerFormState(nextValue));
    writeSchoolPartnerPreRegistration(nextValue);
    return nextValue;
  };

  const ensurePreRegistration = () => {
    if (hasPreRegistration) return true;
    setIsEntryGateOpen(true);
    return false;
  };

  const scrollTrack = (direction) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: direction * trackRef.current.clientWidth * 0.82, behavior: 'smooth' });
  };

  const scrollToSignupCta = () => {
    const target = document.getElementById('inscricao-revela');
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: window.innerWidth < 640 ? 'center' : 'start' });
    target.classList.remove('signup-spotlight');
    void target.offsetWidth;
    target.classList.add('signup-spotlight');
    if (signupHighlightTimeoutRef.current) {
      window.clearTimeout(signupHighlightTimeoutRef.current);
    }
    signupHighlightTimeoutRef.current = window.setTimeout(() => {
      target.classList.remove('signup-spotlight');
    }, 1800);
  };

  const openHeroService = (card) => {
    setActiveHeroService(card);
  };

  const pauseHeroCarousel = () => {
    if (heroCarouselResumeTimeoutRef.current) {
      window.clearTimeout(heroCarouselResumeTimeoutRef.current);
    }
    setIsHeroCarouselPaused(true);
  };

  const resumeHeroCarouselSoon = () => {
    if (heroCarouselResumeTimeoutRef.current) {
      window.clearTimeout(heroCarouselResumeTimeoutRef.current);
    }
    heroCarouselResumeTimeoutRef.current = window.setTimeout(() => {
      setIsHeroCarouselPaused(false);
    }, 1800);
  };

  const handleHeroCarouselInteraction = () => {
    pauseHeroCarousel();
    resumeHeroCarouselSoon();
  };

  const handleHeroServiceSchedule = () => {
    setActiveHeroService(null);
    if (!ensurePreRegistration()) return;
    setIsSchedulingOpen(true);
  };

  const handleScheduleFieldChange = (field, value) => {
    setScheduleForm((current) => ({ ...current, [field]: field === "phone" ? formatSchoolPartnerPhone(value) : value }));
  };

  const redirectToSchoolPartnerWhatsAppGroup = () => {
    if (typeof window === "undefined") return;
    window.location.href = schoolPartnerWhatsAppGroupUrl;
  };

  const createLeadRecord = async ({ payload, sourcePage, objectives, notes, context }) => {
    try {
      await base44.entities.Lead.create({
        name: payload.full_name,
        email: payload.email,
        phone: payload.phone,
        source: sourcePage,
        status: "new",
        notes,
        extra_data: {
          full_name: payload.full_name,
          school: payload.school,
          lead_category: "revela_talentos",
          source_page: sourcePage,
          objectives,
          lgpd_consent: true,
          context,
        },
      });
    } catch (error) {
      console.error(`Erro ao registrar lead de ${context}:`, error);
    }
  };

  const syncLeadToSheets = async ({ flow, payload, page, context }) => {
    try {
      await syncSchoolPartnerLeadToSheets({
        flow,
        payload,
        page,
      });
    } catch (error) {
      console.error(`Erro ao sincronizar ${context} no Google Sheets:`, error);
    }
  };

  const handlePreRegistrationSubmit = async (event) => {
    event.preventDefault();
    const validation = validateSchoolPartnerForm(scheduleForm, partnerSchools, pageCopy);

    if (validation.error) {
      toast.error(validation.error);
      return;
    }

    setIsSubmittingPreRegistration(true);

    try {
      const payload = validation.data;
      persistPreRegistration(payload, {
        pre_registered_at: new Date().toISOString(),
      });
      setIsEntryGateOpen(false);
      toast.success("Pre-cadastro confirmado. Agora voce pode escolher como quer seguir.");

      void createLeadRecord({
        payload,
        sourcePage: pageCopy.sourcePagePreRegistration,
        objectives: pageCopy.preRegistrationObjective,
        notes: pageCopy.preRegistrationNote(payload.school),
        context: "pre-cadastro",
      });
      void syncLeadToSheets({
        flow: "pre_cadastro",
        payload,
        page: pageCopy.sheetsPage,
        context: "pre-cadastro",
      });
      return;

      try {
        await syncSchoolPartnerLeadToSheets({
          flow: "pre_cadastro",
          payload,
          page: pageCopy.sheetsPage,
        });
      } catch (sheetsError) {
        console.error("Erro ao sincronizar prÃ©-cadastro da escola parceira no Google Sheets:", sheetsError);
      }

      persistPreRegistration(payload, {
        pre_registered_at: new Date().toISOString(),
      });
      setIsEntryGateOpen(false);
      toast.success("Pré-cadastro confirmado. Agora você pode escolher como quer seguir.");
    } catch (error) {
      console.error("Erro ao registrar pré-cadastro da escola parceira:", error);
      toast.error("Não foi possível liberar a página agora. Tente novamente em instantes.");
    } finally {
      setIsSubmittingPreRegistration(false);
    }
  };

  const handleScheduleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateSchoolPartnerForm(scheduleForm, partnerSchools, pageCopy);

    if (validation.error) {
      toast.error(validation.error);
      return;
    }

    const payload = validation.data;
    setIsSubmittingSchedule(true);
    try {
      persistPreRegistration(payload, {
        last_choice: "inscrever_agora",
        last_choice_at: new Date().toISOString(),
        pre_registered_at: storedPreRegistration?.pre_registered_at || new Date().toISOString(),
      });
      toast.success("Agendamento confirmado para o lancamento dia 25/05.");
      setIsSchedulingOpen(false);
      setIsScheduleConfirmed(true);

      if (whatsappRedirectTimeoutRef.current) {
        window.clearTimeout(whatsappRedirectTimeoutRef.current);
      }
      whatsappRedirectTimeoutRef.current = window.setTimeout(() => {
        redirectToSchoolPartnerWhatsAppGroup();
      }, 1400);

      void createLeadRecord({
        payload,
        sourcePage: pageCopy.sourcePageSchedule,
        objectives: pageCopy.scheduleObjective,
        notes: pageCopy.scheduleNote(payload.school),
        context: "agendamento",
      });
      void syncLeadToSheets({
        flow: "agendamento_live",
        payload,
        page: pageCopy.sheetsPage,
        context: "agendamento",
      });
      return;

      try {
        await syncSchoolPartnerLeadToSheets({
          flow: "agendamento_live",
          payload,
          page: pageCopy.sheetsPage,
        });
      } catch (sheetsError) {
        console.error("Erro ao sincronizar agendamento da escola parceira no Google Sheets:", sheetsError);
      }

      persistPreRegistration(payload, {
        last_choice: "inscrever_agora",
        last_choice_at: new Date().toISOString(),
        pre_registered_at: storedPreRegistration?.pre_registered_at || new Date().toISOString(),
      });
      toast.success("Agendamento confirmado para o lançamento dia 25/05.");
      setIsSchedulingOpen(false);
      setIsScheduleConfirmed(true);

      if (whatsappRedirectTimeoutRef.current) {
        window.clearTimeout(whatsappRedirectTimeoutRef.current);
      }
      whatsappRedirectTimeoutRef.current = window.setTimeout(() => {
        redirectToSchoolPartnerWhatsAppGroup();
      }, 1400);
    } catch (error) {
      console.error("Erro ao registrar agendamento da escola parceira:", error);
      toast.error("Não foi possível registrar agora. Tente novamente em instantes.");
    } finally {
      setIsSubmittingSchedule(false);
    }
  };

  const handleSchedulingChoice = () => {
    if (!ensurePreRegistration()) return;
    setIsSchedulingOpen(true);
  };

  return (
    <div className="bg-[#040507] min-h-screen text-white overflow-x-hidden">
      {isEntryGateOpen && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-[#02040a]/50 px-4 py-4 backdrop-blur-xl sm:items-center sm:px-6 sm:py-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_26%),linear-gradient(180deg,rgba(2,4,10,0.42),rgba(2,4,10,0.82))]" />
          <div className="relative z-10 my-auto w-full max-w-2xl overflow-hidden rounded-[1.6rem] border border-cyan-400/16 bg-[linear-gradient(180deg,rgba(6,11,20,0.92),rgba(4,7,12,0.98))] shadow-[0_36px_120px_rgba(0,0,0,0.52)] sm:rounded-[2rem] max-sm:max-h-[calc(100dvh-1.5rem)] max-sm:overflow-y-auto">
            <div className="border-b border-white/8 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)] px-5 py-5 sm:px-8 sm:py-6">
              <Badge className="border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-300">
                Acesso com pré-cadastro
              </Badge>
              <h2 className="mt-4 max-w-[18ch] text-[1.8rem] font-black uppercase leading-[0.95] tracking-tight text-white sm:text-[2.45rem]">
                {pageCopy.entryTitle}
              </h2>
              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-white/72 sm:mt-4 sm:text-[15px] sm:leading-7">
                {pageCopy.entryDescription}
              </p>
            </div>

            <form className="space-y-4 px-5 py-5 sm:space-y-5 sm:px-8 sm:py-7" onSubmit={handlePreRegistrationSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="school-entry-full-name" className="text-white/86">Nome completo</Label>
                  <Input id="school-entry-full-name" value={scheduleForm.full_name} onChange={(e) => handleScheduleFieldChange("full_name", e.target.value)} placeholder="Seu nome completo" autoComplete="name" className="h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/35" />
                </div>
                <div className={`space-y-2 ${!requiresEmail && !requiresSchool ? "sm:col-span-2" : ""}`}>
                  <Label htmlFor="school-entry-phone" className="text-white/86">WhatsApp</Label>
                  <Input id="school-entry-phone" value={scheduleForm.phone} onChange={(e) => handleScheduleFieldChange("phone", e.target.value)} placeholder="(11) 99999-9999" autoComplete="tel" inputMode="numeric" className="h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/35" />
                </div>
                {requiresEmail && (
                  <div className="space-y-2">
                    <Label htmlFor="school-entry-email" className="text-white/86">E-mail</Label>
                    <Input id="school-entry-email" type="email" value={scheduleForm.email} onChange={(e) => handleScheduleFieldChange("email", e.target.value)} placeholder="voce@exemplo.com" autoComplete="email" className="h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/35" />
                  </div>
                )}
                {requiresSchool && (
                  <div className="space-y-2 sm:col-span-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor="school-entry-school" className="text-white/86">{pageCopy.schoolLabel}</Label>
                      <span className="text-[11px] uppercase tracking-[0.18em] text-cyan-300/75">
                        {isLoadingSchools ? "Sincronizando escolas" : partnerSchools.length > 0 ? `${partnerSchools.length} escolas carregadas` : "Identificação manual"}
                      </span>
                    </div>
                    <Input id="school-entry-school" list={partnerSchools.length > 0 ? "partner-schools-list-entry" : undefined} value={scheduleForm.school} onChange={(e) => handleScheduleFieldChange("school", e.target.value)} placeholder={partnerSchools.length > 0 ? pageCopy.schoolPlaceholder : pageCopy.schoolManualPlaceholder} autoComplete="organization" className="h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/35" />
                    {partnerSchools.length > 0 && (
                      <datalist id="partner-schools-list-entry">
                        {partnerSchools.map((school) => (<option key={`entry-${school}`} value={school} />))}
                      </datalist>
                    )}
                    <p className="text-xs leading-5 text-white/50">
                      {pageCopy.schoolHelper}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between sm:rounded-[1.4rem]">
                <p className="max-w-xl text-xs leading-5 text-white/54 sm:text-[13px]">
                  {pageCopy.entryFooter}
                </p>
                <Button type="submit" disabled={isSubmittingPreRegistration} className="hero-cta-submit h-12 w-full rounded-[1.05rem] border border-violet-300/20 px-6 text-sm font-semibold text-white sm:min-w-[220px] sm:w-auto">
                  {isSubmittingPreRegistration ? "Liberando..." : "Liberar minha entrada"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={`transition-[filter,transform,opacity] duration-500 ${isEntryGateOpen ? "pointer-events-none select-none blur-[16px] brightness-[0.72] saturate-[0.9]" : ""}`}>
      {/* Background Effect globally */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(0,243,255,0.08),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%)]" />

      <a
        href="https://wa.me/351960071218"
        target="_blank"
        rel="noreferrer"
        aria-label="Falar no WhatsApp"
        className="fixed bottom-4 right-4 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/30 bg-[linear-gradient(135deg,rgba(34,197,94,0.98),rgba(22,163,74,0.94))] text-white shadow-[0_0_0_1px_rgba(187,247,208,0.12),0_0_22px_rgba(34,197,94,0.42),0_22px_40px_rgba(20,83,45,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(220,252,231,0.2),0_0_28px_rgba(74,222,128,0.5),0_26px_44px_rgba(20,83,45,0.36)] sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
        style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      >
        <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
      </a>

      {isScheduleConfirmed && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-[#02040a]/88 px-4 text-center text-white backdrop-blur-xl">
          <div className="w-full max-w-lg rounded-[1.5rem] border border-cyan-300/20 bg-[linear-gradient(180deg,rgba(6,11,20,0.96),rgba(4,7,12,0.99))] p-6 shadow-[0_36px_120px_rgba(0,0,0,0.55)] sm:p-8">
            <Badge className="border border-emerald-400/25 bg-emerald-500/12 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              Inscrição confirmada
            </Badge>
            <h2 className="mt-5 text-2xl font-black uppercase leading-tight tracking-tight text-white sm:text-3xl">
              Agendamento confirmado para o lançamento dia 25/05
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/70 sm:text-base">
              Estamos direcionando você para o grupo oficial no WhatsApp.
            </p>
            <Button
              type="button"
              onClick={redirectToSchoolPartnerWhatsAppGroup}
              className="mt-6 h-12 w-full rounded-[1.05rem] bg-emerald-500 px-6 text-sm font-bold text-white hover:bg-emerald-400 sm:w-auto"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Entrar no grupo agora
            </Button>
          </div>
        </div>
      )}

      {/* STICKY HEADER */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link to="/">
            <img src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" alt="Revela Talentos" className="h-8 w-auto sm:h-10" />
          </Link>
          <a href="#como-funciona">
            <Button className="h-10 whitespace-nowrap rounded-lg border-0 bg-gradient-to-r from-blue-600 to-cyan-500 px-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-blue-500 hover:to-cyan-400 sm:h-auto sm:px-6 sm:text-base">
              Sobre a Live
            </Button>
          </a>
        </div>
      </header>

      {/* HERO — Netflix title-page layout */}
      <section className="relative min-h-0 overflow-hidden escola-parceira-hero bg-black sm:min-h-[100vh]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            src="https://video.wixstatic.com/video/933cdd_388c6e2a108d49f089ef70033306e785/1080p/mp4/file.mp4"
            autoPlay muted loop playsInline controls={false}
            className="absolute inset-0 hidden h-full w-full object-cover object-center animate-cinematic-zoom opacity-55 sm:block"
            style={{ pointerEvents: 'none' }}
          />
          <div className="absolute inset-x-0 top-0 h-[42svh] overflow-hidden sm:hidden">
            <video
              src="https://video.wixstatic.com/video/933cdd_388c6e2a108d49f089ef70033306e785/1080p/mp4/file.mp4"
              autoPlay muted loop playsInline controls={false}
              className="h-full w-full object-cover object-center animate-cinematic-zoom opacity-[0.96]"
              style={{ pointerEvents: 'none' }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_42%)]" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.78)_62%,#040507_100%)] shadow-[0_26px_48px_rgba(0,0,0,0.62)]" />
          </div>
          <div className="absolute inset-0 hidden bg-black/30 sm:block" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-black/90 via-black/45 to-black/70 md:from-black/88 md:via-black/30 md:to-black/50 sm:block" />
          <div className="absolute inset-0 hidden bg-gradient-to-t from-black via-black/25 to-transparent sm:block" />
          <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_55%_45%,transparent_0%,rgba(0,0,0,0.12)_35%,rgba(0,0,0,0.62)_100%)] sm:block" />
          <div className="absolute inset-y-0 left-0 hidden w-full bg-gradient-to-r from-black/85 to-transparent md:w-[58%] sm:block" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(37,99,235,0.16),transparent_28%),radial-gradient(circle_at_78%_25%,rgba(14,165,233,0.14),transparent_22%)]" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col justify-start px-4 pb-6 pt-[43svh] sm:min-h-[100svh] sm:justify-between sm:px-6 sm:pb-8 sm:pt-28 md:px-10 md:pt-32 lg:px-14">
          <div className="w-full">
            <div className="mb-5 flex flex-wrap items-center gap-3 font-['Inter'] mt-8 sm:mb-6 sm:gap-4 sm:mt-0">
              <img src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" alt="Revela Talentos" className="h-8 w-auto sm:h-9 md:h-11" />
              <span className="border-l border-cyan-400/30 pl-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/90 sm:pl-4 sm:text-base sm:tracking-[0.28em] md:text-lg">{pageCopy.heroAudience}</span>
            </div>

            <div className="max-w-3xl space-y-5 font-['Inter']">
              <h1 className="max-w-3xl text-[2.5rem] font-extrabold uppercase leading-[0.92] tracking-tight text-white sm:text-[3.15rem] md:text-5xl lg:text-[3.45rem]">REVELA TALENTOS</h1>
              <p className="max-w-2xl text-[15px] leading-7 text-white/88 sm:text-base md:text-[1.15rem] md:leading-8">
                {pageCopy.heroDescription}
              </p>
              <div className="pt-2">
                <h2 className="text-[1.55rem] font-black uppercase leading-[0.9] tracking-tight text-white sm:text-[1.9rem]">
                  BENEFÍCIOS
                  <span className="block text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>
                    REVELA TALENTOS
                  </span>
                </h2>
              </div>
            </div>

            <div id="inscricao-revela" className="relative mt-2 space-y-4 rounded-[1.75rem] font-['Inter'] transition-[box-shadow,transform] duration-500 sm:mt-8 sm:space-y-5">
              <div className="grid gap-4 sm:hidden">
                {heroServiceCards.map((card) => (
                  <article
                    key={card.title}
                    className="group relative min-h-[330px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#040507] text-left shadow-[0_30px_90px_rgba(0,0,0,0.38),0_0_30px_rgba(14,165,233,0.08)]"
                  >
                    {isVideoMedia(card.image) ? (
                      <video
                        className="absolute inset-0 h-full w-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      >
                        <source src={card.image} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        src={card.image}
                        alt={card.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.12)_24%,rgba(0,0,0,0.92)_100%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_32%)]" />
                    <div className="absolute inset-x-0 bottom-0 h-[72%] bg-[linear-gradient(180deg,transparent_0%,rgba(4,7,12,0.26)_24%,rgba(4,7,12,0.96)_100%)]" />

                    <div className="relative z-10 flex h-full flex-col justify-end p-5">
                      <h3 className="max-w-[12ch] text-[1.35rem] font-black uppercase leading-[0.95] tracking-tight text-white [text-shadow:0_6px_20px_rgba(0,0,0,0.9),0_14px_36px_rgba(0,0,0,0.86)]">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-[12px] leading-5 text-white/78 [text-shadow:0_5px_16px_rgba(0,0,0,0.82)]">
                        {card.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div
                className="hero-service-mask relative -mx-1 hidden overflow-x-auto overflow-y-visible px-1 [--hero-gap:0.75rem] sm:mx-0 sm:block sm:px-0 sm:[--hero-gap:1.25rem]"
                onTouchStart={pauseHeroCarousel}
                onTouchEnd={resumeHeroCarouselSoon}
                onTouchCancel={resumeHeroCarouselSoon}
                onScroll={handleHeroCarouselInteraction}
              >
                <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 bg-[linear-gradient(90deg,#040507_0%,rgba(4,5,7,0.78)_48%,transparent_100%)] sm:w-16" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 bg-[linear-gradient(270deg,#040507_0%,rgba(4,5,7,0.78)_48%,transparent_100%)] sm:w-16" />
                <div
                  className="hero-service-track flex w-max gap-[var(--hero-gap)] pb-2"
                  style={{ animationPlayState: activeHeroService || isHeroCarouselPaused ? 'paused' : 'running' }}
                >
                {heroServiceCarouselCards.map((card, index) => (
                  <article
                    key={`${card.title}-${index}`}
                    className="group relative aspect-square w-[255px] shrink-0 snap-start overflow-hidden rounded-[2rem] bg-[#040507] text-left shadow-[0_32px_90px_rgba(0,0,0,0.42),0_0_30px_rgba(14,165,233,0.08)] transition-all duration-300 hover:-translate-y-1 sm:w-[320px]"
                  >
                    {isVideoMedia(card.image) ? (
                      <video
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        autoPlay
                        loop
                        muted
                        playsInline
                      >
                        <source src={card.image} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        src={card.image}
                        alt={card.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 rounded-[2rem] border border-white/8" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.08)_26%,rgba(0,0,0,0.84)_100%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_30%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.01)_16%,transparent_34%)]" />
                    <div className="absolute inset-x-0 bottom-0 h-[52%] bg-[linear-gradient(180deg,transparent_0%,rgba(4,7,12,0.16)_22%,rgba(4,7,12,0.88)_100%)]" />

                    <div className="relative z-10 h-full p-4 sm:p-5">
                      <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                        <h3 className="max-w-[12ch] text-[1.12rem] font-black uppercase leading-[0.96] tracking-tight text-white [text-shadow:0_6px_20px_rgba(0,0,0,0.9),0_14px_36px_rgba(0,0,0,0.86)] sm:text-[1.3rem]">
                          {card.title}
                        </h3>
                        <button
                          type="button"
                          onClick={() => openHeroService(card)}
                          className="relative z-10 mt-4 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.24em] text-cyan-300 [text-shadow:0_6px_16px_rgba(0,0,0,0.85)] transition-colors duration-300 hover:text-white"
                        >
                          Saber mais
                          <span className="text-base leading-none">+</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-amber-300/35 bg-[linear-gradient(135deg,rgba(251,191,36,0.18),rgba(249,115,22,0.14),rgba(4,7,12,0.72))] px-5 py-4 shadow-[0_20px_70px_rgba(251,146,60,0.18)] md:max-w-[620px]">
                <p className="text-[11px] font-black uppercase tracking-[0.26em] text-amber-200">
                  Data oficial do lançamento
                </p>
                <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-1">
                  <span className="text-[2.35rem] font-black leading-none tracking-tight text-white sm:text-[3.1rem]">25/05</span>
                  <span className="pb-1 text-sm font-bold uppercase tracking-[0.14em] text-white/82 sm:text-base">evento online ao vivo</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-white/76 sm:text-[15px]">
                  Confirme sua presença para o lançamento da Revela Talentos no dia 25/05.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-stretch">
                <Button type="button" onClick={handleSchedulingChoice} className="hero-cta-primary h-auto min-h-[54px] w-full justify-center gap-3 whitespace-normal rounded-[1.15rem] border border-cyan-200/35 px-5 py-3 text-sm font-semibold uppercase leading-tight tracking-[0.04em] text-white sm:min-h-[58px] md:w-auto md:px-6 md:text-base">
                  <Calendar className="h-5 w-5" />
                  Quero me inscrever para 25/05
                </Button>
              </div>

            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 z-10 hidden -translate-x-1/2 animate-bounce cursor-pointer md:block">
          <ChevronDown className="w-10 h-10 text-white/30 hover:text-white/60 transition-colors" />
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

          @keyframes cinematic-zoom {
            0% { transform: scale(1.05); }
            50% { transform: scale(1.11); }
            100% { transform: scale(1.05); }
          }
          .animate-cinematic-zoom {
            animation: cinematic-zoom 26s ease-in-out infinite;
          }
          @keyframes neon-pulse-cyan {
            0%, 100% {
              box-shadow: 0 0 0 1px rgba(125,244,255,0.28), 0 0 18px rgba(34,211,238,0.28), 0 0 42px rgba(34,211,238,0.22), 0 18px 38px rgba(8,145,178,0.24);
            }
            50% {
              box-shadow: 0 0 0 1px rgba(207,250,254,0.42), 0 0 30px rgba(34,211,238,0.48), 0 0 72px rgba(34,211,238,0.34), 0 24px 52px rgba(14,116,144,0.34);
            }
          }
          @keyframes hero-cta-booking-pulse {
            0%, 100% {
              transform: translateY(0) scale(1);
              box-shadow: 0 0 0 0 rgba(250,204,21,0.54), 0 0 0 1px rgba(254,240,138,0.7), 0 0 28px rgba(251,191,36,0.52), 0 18px 44px rgba(194,65,12,0.34);
            }
            50% {
              transform: translateY(-2px) scale(1.035);
              box-shadow: 0 0 0 12px rgba(250,204,21,0), 0 0 0 2px rgba(255,255,255,0.82), 0 0 50px rgba(251,191,36,0.78), 0 28px 66px rgba(234,88,12,0.5);
            }
          }
          @keyframes hero-cta-primary-sheen {
            0% { transform: translateX(-140%) skewX(-18deg); opacity: 0; }
            16% { opacity: 0.95; }
            36% { transform: translateX(180%) skewX(-18deg); opacity: 0; }
            100% { transform: translateX(180%) skewX(-18deg); opacity: 0; }
          }
          @keyframes neon-pulse-blue {
            0%, 100% {
              box-shadow: 0 0 0 1px rgba(147,197,253,0.14), 0 0 14px rgba(59,130,246,0.18), 0 18px 34px rgba(30,64,175,0.22);
            }
            50% {
              box-shadow: 0 0 0 1px rgba(147,197,253,0.28), 0 0 28px rgba(59,130,246,0.34), 0 24px 48px rgba(30,64,175,0.3);
            }
          }
          @keyframes neon-pulse-red {
            0%, 100% {
              box-shadow: 0 0 0 1px rgba(252,165,165,0.14), 0 0 16px rgba(239,68,68,0.22), 0 18px 34px rgba(153,27,27,0.24);
            }
            50% {
              box-shadow: 0 0 0 1px rgba(254,202,202,0.24), 0 0 28px rgba(248,113,113,0.34), 0 24px 48px rgba(185,28,28,0.32);
            }
          }
          @keyframes neon-pulse-violet {
            0%, 100% {
              box-shadow: 0 0 0 1px rgba(196,181,253,0.14), 0 0 14px rgba(139,92,246,0.22), 0 18px 34px rgba(76,29,149,0.24);
            }
            50% {
              box-shadow: 0 0 0 1px rgba(221,214,254,0.26), 0 0 28px rgba(167,139,250,0.36), 0 24px 48px rgba(91,33,182,0.32);
            }
          }
          .hero-cta-primary {
            position: relative;
            overflow: hidden;
            isolation: isolate;
            background: linear-gradient(135deg, #fff200 0%, #ffb000 36%, #ff4d00 100%);
            color: #101010 !important;
            text-shadow: 0 1px 0 rgba(255,255,255,0.26);
            animation: hero-cta-booking-pulse 1.35s ease-in-out infinite;
          }
          .hero-cta-primary::after {
            content: '';
            position: absolute;
            inset: -10% auto -10% -30%;
            width: 40%;
            background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.94) 48%, rgba(255,255,255,0) 100%);
            filter: blur(8px);
            opacity: 0;
            pointer-events: none;
            animation: hero-cta-primary-sheen 2.25s ease-in-out infinite;
          }
          .hero-cta-primary:hover {
            background: linear-gradient(135deg, #fff76a 0%, #ffc400 34%, #ff6a00 100%);
            transform: translateY(-3px) scale(1.04);
          }
          .hero-cta-secondary {
            background: linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(30,64,175,0.9) 54%, rgba(37,99,235,0.95) 100%);
            animation: neon-pulse-blue 2.9s ease-in-out infinite;
          }
          .hero-cta-secondary span:not(.hero-cta-secondary-copy) {
            display: none;
          }
          .hero-cta-secondary:hover {
            background: linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(37,99,235,0.96) 55%, rgba(56,189,248,0.92) 100%);
            transform: translateY(-1px);
          }
          .hero-cta-alert {
            position: relative;
            overflow: hidden;
            isolation: isolate;
            background: linear-gradient(135deg, #fff200 0%, #ffb000 36%, #ff4d00 100%);
            color: #101010 !important;
            text-shadow: 0 1px 0 rgba(255,255,255,0.26);
            animation: hero-cta-booking-pulse 1.35s ease-in-out infinite;
          }
          .hero-cta-alert::after {
            content: '';
            position: absolute;
            inset: -10% auto -10% -30%;
            width: 40%;
            background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.94) 48%, rgba(255,255,255,0) 100%);
            filter: blur(8px);
            opacity: 0;
            pointer-events: none;
            animation: hero-cta-primary-sheen 2.25s ease-in-out infinite;
          }
          .hero-cta-alert:hover {
            background: linear-gradient(135deg, #fff76a 0%, #ffc400 34%, #ff6a00 100%);
            transform: translateY(-3px) scale(1.04);
          }
          .hero-cta-submit {
            background: linear-gradient(135deg, rgba(79,70,229,0.96) 0%, rgba(14,165,233,0.92) 100%);
            animation: neon-pulse-violet 2.9s ease-in-out infinite;
          }
          .hero-cta-submit:hover {
            background: linear-gradient(135deg, rgba(99,102,241,1) 0%, rgba(56,189,248,0.94) 100%);
            transform: translateY(-1px);
          }
          @keyframes hero-services-marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(calc(-50% - (var(--hero-gap) / 2)), 0, 0); }
          }
          .hero-service-mask {
            scrollbar-width: none;
            -ms-overflow-style: none;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-x;
            scroll-snap-type: x proximity;
          }
          .hero-service-mask::-webkit-scrollbar {
            display: none;
          }
          .hero-service-track {
            animation: hero-services-marquee 38s linear infinite;
            will-change: transform;
          }
          .hero-service-mask:hover .hero-service-track,
          .hero-service-mask:focus-within .hero-service-track {
            animation-play-state: paused;
          }
          @keyframes opportunities-marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(calc(-50% - 0.75rem), 0, 0); }
          }
          .opportunities-carousel-mask {
            overflow: hidden;
          }
          .signup-spotlight {
            animation: signup-spotlight 1.8s ease;
            box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.18), 0 0 0 10px rgba(34, 211, 238, 0.04), 0 30px 90px rgba(8, 145, 178, 0.2);
          }
          @keyframes signup-spotlight {
            0% {
              transform: translateY(0);
              box-shadow: 0 0 0 rgba(34, 211, 238, 0);
            }
            35% {
              transform: translateY(-4px);
              box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.22), 0 0 0 12px rgba(34, 211, 238, 0.08), 0 34px 94px rgba(8, 145, 178, 0.24);
            }
            100% {
              transform: translateY(0);
              box-shadow: 0 0 0 rgba(34, 211, 238, 0);
            }
          }
          .opportunities-carousel-track {
            animation: opportunities-marquee 34s linear infinite;
            will-change: transform;
          }
          .opportunities-carousel-mask:hover .opportunities-carousel-track {
            animation-play-state: paused;
          }
          .escola-parceira-hero::after {
            display: none;
          }
          @media (min-width: 640px) {
            .escola-parceira-hero::after { content: ''; position: absolute; inset: auto 0 0; height: 160px; background: linear-gradient(180deg, transparent 0%, rgba(4,5,7,0.98) 100%); z-index: 2; pointer-events: none; display: block; }
          }
          @media (max-width: 639px) {
            .hero-service-track { animation-duration: 32s; }
            .opportunities-carousel-track { animation-duration: 28s; }
          }
        `}</style>
      </section>

      <Dialog open={!!activeHeroService} onOpenChange={(open) => !open && setActiveHeroService(null)}>
        <DialogContent className="overflow-hidden border border-cyan-400/20 bg-[#050811] p-0 text-white sm:max-w-3xl">
          {activeHeroService && (
            <div className="relative">
              <div className="absolute inset-0">
                {isVideoMedia(activeHeroService.image) ? (
                  <video
                    className="h-full w-full object-cover opacity-30"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src={activeHeroService.image} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={activeHeroService.image}
                    alt={activeHeroService.title}
                    className="h-full w-full object-cover opacity-30"
                  />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(4,7,12,0.96)_12%,rgba(4,7,12,0.82)_48%,rgba(4,7,12,0.92)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_34%)]" />
              </div>

              <div className="relative z-10 p-6 sm:p-8">
                <DialogHeader className="space-y-4 text-left">
                  <Badge className="w-fit border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-300">
                    {activeHeroService.tag}
                  </Badge>
                  <DialogTitle className="max-w-[14ch] text-3xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-[2.6rem]">
                    {activeHeroService.title}
                  </DialogTitle>
                  <DialogDescription className="max-w-2xl text-sm leading-7 text-white/[0.76] sm:text-[15px]">
                    {activeHeroService.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-6 rounded-[1.6rem] border border-white/15 bg-[linear-gradient(180deg,rgba(13,20,32,0.38),rgba(5,10,18,0.74))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-[24px] sm:p-6">
                  <div className="flex flex-col gap-3 text-sm text-white/[0.72] sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xl leading-6">
                      Veja os detalhes da oportunidade e, se fizer sentido para sua familia, siga para o agendamento com a Revela Talentos.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="button"
                        onClick={handleHeroServiceSchedule}
                        className="hero-cta-primary h-12 rounded-[1.05rem] border border-cyan-200/35 px-6 text-sm font-semibold text-white"
                      >
                        Agendar agora
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveHeroService(null)}
                        className="hero-cta-secondary h-12 rounded-[1.05rem] border border-blue-300/25 px-6 text-sm font-semibold text-white"
                      >
                        Fechar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isSchedulingOpen} onOpenChange={setIsSchedulingOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto border border-cyan-400/20 bg-[#050811] p-0 text-white sm:max-w-2xl">
          <div className="bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)] p-6 sm:p-7">
            <DialogHeader className="space-y-3 text-left">
              <Badge className="w-fit border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-300">Agendamento da Live</Badge>
              <DialogTitle className="text-2xl font-black tracking-tight text-white sm:text-[2rem]">{pageCopy.scheduleTitle}</DialogTitle>
              <DialogDescription className="max-w-xl text-sm leading-6 text-white/70 sm:text-[15px]">{pageCopy.scheduleDescription}</DialogDescription>
            </DialogHeader>

            {hasPreRegistration && (
              <div className={`mt-5 grid gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4 ${requiresSchool ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300/78">Responsável</div>
                  <div className="mt-1 text-sm font-semibold text-white/88">{scheduleForm.full_name}</div>
                </div>
                {requiresSchool && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300/78">Escola</div>
                    <div className="mt-1 text-sm font-semibold text-white/88">{scheduleForm.school}</div>
                  </div>
                )}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300/78">Fluxo</div>
                  <div className="mt-1 text-sm font-semibold text-white/88">Inscrever agora</div>
                </div>
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleScheduleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="school-partner-full-name" className="text-white/86">Nome completo</Label>
                  <Input id="school-partner-full-name" value={scheduleForm.full_name} onChange={(e) => handleScheduleFieldChange("full_name", e.target.value)} placeholder="Seu nome completo" autoComplete="name" className="h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/35" />
                </div>
                <div className={`space-y-2 ${!requiresEmail && !requiresSchool ? "sm:col-span-2" : ""}`}>
                  <Label htmlFor="school-partner-phone" className="text-white/86">WhatsApp</Label>
                  <Input id="school-partner-phone" value={scheduleForm.phone} onChange={(e) => handleScheduleFieldChange("phone", e.target.value)} placeholder="(11) 99999-9999" autoComplete="tel" inputMode="numeric" className="h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/35" />
                </div>
                {requiresEmail && (
                  <div className="space-y-2">
                  <Label htmlFor="school-partner-email" className="text-white/86">E-mail</Label>
                  <Input id="school-partner-email" type="email" value={scheduleForm.email} onChange={(e) => handleScheduleFieldChange("email", e.target.value)} placeholder="voce@exemplo.com" autoComplete="email" className="h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/35" />
                </div>
                )}
                {requiresSchool && (
                  <div className="space-y-2 sm:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="school-partner-school" className="text-white/86">{pageCopy.schoolLabel}</Label>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-cyan-300/75">{isLoadingSchools ? "Sincronizando escolas" : partnerSchools.length > 0 ? `${partnerSchools.length} escolas carregadas` : "Identificação manual liberada"}</span>
                  </div>
                  <Input id="school-partner-school" list={partnerSchools.length > 0 ? "partner-schools-list" : undefined} value={scheduleForm.school} onChange={(e) => handleScheduleFieldChange("school", e.target.value)} placeholder={partnerSchools.length > 0 ? pageCopy.schoolPlaceholder : pageCopy.schoolManualPlaceholder} autoComplete="organization" className="h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/35" />
                  {partnerSchools.length > 0 && (
                    <datalist id="partner-schools-list">
                      {partnerSchools.map((school) => (<option key={school} value={school} />))}
                    </datalist>
                  )}
                  <p className="text-xs leading-5 text-white/50">{partnerSchools.length > 0 ? pageCopy.scheduleSchoolHelper : pageCopy.scheduleSchoolManualHelper}</p>
                </div>
                )}
              </div>
              <DialogFooter className="gap-3 border-t border-white/10 pt-5 sm:justify-between sm:space-x-0">
                <p className="text-xs leading-5 text-white/45">Ao enviar, a sua solicitação entra na base de leads da Revela Talentos para confirmação da apresentação.</p>
                <Button type="submit" disabled={isSubmittingSchedule} className="hero-cta-submit h-12 min-w-[180px] rounded-[1.05rem] border border-violet-300/20 px-6 text-sm font-semibold text-white">{isSubmittingSchedule ? "Enviando..." : "Confirmar agendamento"}</Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <section className="relative bg-[#040507] px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-[1400px]">
          <ReminderInvitationCard accentGlow={accentGlow} onPrimaryClick={handleSchedulingChoice} audienceLine={pageCopy.reminderAudienceLine} />
        </div>
      </section>

      {/* 1. SOCIAL PROOF MARQUEE */}
      <MainLandingCarousel eyebrow="/ Nossa Estrutura Global" title="CONEXÕES EUROPEIAS E NACIONAIS" description="A metodologia que será integrada à escola já levou centenas de atletas a oportunidades exclusivas nos maiores centros de excelência do mundo." onCardClick={scrollToSignupCta} />

      {/* BENEFÍCIOS REVELA TALENTOS */}
      <BeneficiosRevelaTalentos />

      {/* CRONOGRAMA */}
      <section id="como-funciona" className="relative bg-gradient-to-b from-[#040507] to-gray-950 px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-1.5 text-sm rounded-full mb-6 relative z-10">Passos a Seguir</Badge>
            <h2 className="relative z-10 mb-4 text-[2rem] font-bold sm:text-4xl md:text-5xl">Tudo Começa no Dia <span className={`bg-gradient-to-r ${accentGlow} bg-clip-text text-transparent`}>25/05</span></h2>
            <p className="relative z-10 text-base text-gray-400 sm:text-xl">Como vai funcionar esta trajetória inesquecível para pais e alunos nas próximas etapas.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-[2px] h-[calc(100%-96px)] bg-gradient-to-b from-cyan-500/50 to-transparent" />
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="relative z-10 flex-1 rounded-2xl border border-white/10 bg_white/[0.03] p-5 transition-all duration-300 hover:border-cyan-500/30 hover:bg_white/[0.06] sm:p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl font-black text-white/10 sm:text-5xl">{step.num}</span>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                        <step.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="hidden md:flex w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 items-center justify-center text-xl font-black text-white shadow-lg shadow-cyan-500/30 flex-shrink-0 z-10">{i + 1}</div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SOCIAL PROOF GALLERY (Spotlights) */}
      <section className="relative border-y border-white/5 bg-gray-950 px-4 py-16 md:px-8 sm:py-24">
        <div className="container mx-auto">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <span className={`mb-4 block font-mono text-xs uppercase tracking-[0.3em] ${accentClass}`}>{spotlight.eyebrow}</span>
              <h2 className="text-[1.95rem] font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-4xl md:text-5xl">Exemplos de <span className={`bg-gradient-to-r bg-clip-text text-transparent ${accentGlow}`}>{spotlight.highlight}</span></h2>
              <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-gray-400 md:text-base">{spotlight.description}</p>
            </div>
            <div className="flex items-center justify-end gap-2 md:px-6">
              <button type="button" onClick={() => scrollTrack(-1)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-white/20 hover:bg-white/10 sm:h-11 sm:w-11"><span className="text-lg leading_none">&lsaquo;</span></button>
              <button type="button" onClick={() => scrollTrack(1)} className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-white/20 hover:bg-white/10 sm:h-11 sm:w-11 ${accentClass}`}><span className="text-lg leading-none">&rsaquo;</span></button>
            </div>
          </div>
          <div className="relative mb-10 md:mb-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent md:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-gray-950 via-gray-950/80 to-transparent md:block" />
            <div ref={trackRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pl-1 pr-1 scroll-smooth sm:gap-5 md:px-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {spotlight.items.map(([name, club, image], index) => (
                <article key={`${name}-${club}-${index}`} className="group relative aspect-[4/5] w-[82vw] max-w-[280px] shrink-0 snap-start overflow-hidden rounded-[1.7rem] border border_white/10 bg-black/40 shadow-[0_25px_90px_rgba(0,0,0,0.35)] sm:w-[290px] sm:rounded-[2rem] md:w-[300px]">
                  {isVideoMedia(image) ? (<video src={image} controls playsInline preload="metadata" className="absolute inset-0 h-full w-full object_cover transition-transform duration-700 group-hover:scale-105" />) : (<img src={image} alt={`${name} - ${club}`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />)}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
                  <div className="pointer_events-none relative z-10 flex h-full flex-col justify-between p-4 sm:p-5 md:p-6">
                    <div className="flex justify-end gap-4"><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/70 sm:text-[10px]">Em destaque</span></div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60 sm:text-[11px] sm:tracking-[0.22em]">{club}</p>
                      <h3 className="mt-3 text-[1.7rem] font-black uppercase leading-[0.95] tracking-tight text-white sm:text-2xl md:text-3xl">{name}</h3>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS FAMÍLIA */}
      <section className="bg-[#040507] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-[2rem] font-bold sm:text-4xl md:text-5xl">O Que Dizem os Pais <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Experientes</span></h2>
            <p className="text-gray-400">Famílias que já vivenciam a metodologia de inteligência e disciplina.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-yellow-500/20 hover:bg-white/[0.06] sm:p-8">
                <div className="flex gap-1 mb-6">{Array(t.rating).fill(0).map((_, j) => (<Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />))}</div>
                <p className="mb-6 text-base italic leading-relaxed text-gray-300 sm:text-lg">"{t.text}"</p>
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">{t.avatar}</div>
                  <div>
                    <p className="text-white font-bold">{t.name}</p>
                    <p className="text-gray-500 text-sm">{t.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/5 bg-gray-950 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Perguntas Comuns</h2>
            <p className="text-gray-400">O que você precisa saber antes do lançamento de 25/05.</p>
          </div>
          <div className="space-y-4">{faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}</div>
        </div>
      </section>

      <StatsSection accentClass={accentClass} />

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#040507] py-10 sm:py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row">
          <img src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" alt="Revela Talentos" className="h-8 w-auto opacity-80" />
          <p className="text-gray-600 text-sm text-center">© {new Date().getFullYear()} {pageCopy.footerBrand}. Todos os direitos reservados.</p>
          <div className="flex gap-6 text-gray-600 text-sm">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
