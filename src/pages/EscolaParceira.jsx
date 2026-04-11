import { useState, useEffect, useMemo, useRef } from "react";
import MainLandingCarousel from "../components/hub/MainLandingCarousel";
import { base44 } from "@/api/base44Client";
import BeneficiosRevelaTalentos from "../components/hub/BeneficiosRevelaTalentos";
import { Link } from "react-router-dom";
import { 
  Sparkles, Award, LineChart, Users, Rocket, 
  ChevronDown, ChevronUp, ArrowRight,
  Star, Globe, BookOpen, Shield, Zap, Calendar, User, Eye, MapPin, Lock
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

// FAQs adaptadas para os Pais de Atletas
const faqs = [
  {
    q: "O que é a nova parceria da escola com a Revela Talentos?",
    a: "É uma união inovadora onde a escola passa a contar com a metodologia de desenvolvimento humano, esportivo e socioemocional da EC10 Talentos, potencializando o aprendizado e a descoberta das vocações do seu filho dentro e fora das salas de aula."
  },
  {
    q: "Eu preciso pagar algo a mais por isso?",
    a: "Não. Como a instituição do seu filho tornou-se uma Escola Parceira, os acessos básicos às ferramentas educativas e à jornada da Revela Talentos já estão inclusos e estruturados pelo colégio."
  },
  {
    q: "Como será a Live de Lançamento com o Eric Cena?",
    a: "No dia 20/04, Eric Cena, nosso fundador, fará uma apresentação especial explicando todos os pilares da metodologia, os benefícios diretos para sua família e as novas oportunidades que seu filho terá na escola."
  },
  {
    q: "Posso acessar a plataforma para acompanhar meu filho?",
    a: "Com certeza! A plataforma estimula a conexão família-escola, permitindo que os pais acompanhem de perto o engajamento esportivo, as métricas de saúde e o desenvolvimento socioemocional."
  }
];

// benefits constant removed as it's now handled by BeneficiosRevelaTalentos component


const steps = [
  {
    num: "01",
    icon: Calendar,
    title: "Live de Lançamento - Dia 20/04",
    desc: "Marque na sua agenda e assista ao evento oficial com Eric Cena. Descubra os detalhes impactantes dessa transformação no ensino."
  },
  {
    num: "02",
    icon: User,
    title: "Recepção dos Acessos",
    desc: "A escola fará a orientação e distribuição das credenciais de acesso para que os estudantes configurem seu perfil na EC10."
  },
  {
    num: "03",
    icon: Shield,
    title: "Acompanhe e Celebre",
    desc: "Veja a evolução através dos novos treinos, mentorias em vídeo e capacitações presentes no aplicativo."
  }
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

const heroPreviewCards = [
  {
    title: 'Disciplina',
    icon: Shield,
  },
  {
    title: 'Performance',
    icon: Award,
  },
  {
    title: 'Visão',
    icon: Eye,
  },
  {
    title: 'Estratégia',
    icon: LineChart,
  },
  {
    title: 'Futuro',
    icon: Rocket,
  },
];

const opportunitiesData = [
  {
    title: 'Avaliação Premium',
    location: 'São Paulo, Brasil',
    flag: '🇧🇷',
    country: 'Brasil',
    market: 'Base Nacional',
    format: 'Presencial',
    teaser: 'Vagas limitadas para escolas parceiras.',
  },
  {
    title: 'Alta Performance',
    location: 'Belo Horizonte, Brasil',
    flag: '🇧🇷',
    country: 'Brasil',
    market: 'Desenvolvimento',
    format: 'Presencial',
    teaser: 'Ambiente ideal para acelerar evolução.',
  },
  {
    title: 'Janela Portugal',
    location: 'Braga, Portugal',
    flag: '🇵🇹',
    country: 'Portugal',
    market: 'Europa',
    format: 'Híbrido',
    teaser: 'Uma rota aberta para o mercado europeu.',
  },
  {
    title: 'Camp Espanha',
    location: 'Madrid, Espanha',
    flag: '🇪🇸',
    country: 'Espanha',
    market: 'Europa',
    format: 'Híbrido',
    teaser: 'Curadoria especial para atletas promissores.',
  },
  {
    title: 'Exposição Polônia',
    location: 'Varsóvia, Polônia',
    flag: '🇵🇱',
    country: 'Polônia',
    market: 'Europa',
    format: 'Online + Presencial',
    teaser: 'Uma vitrine estratégica em crescimento.',
  },
  {
    title: 'Entrada Eslováquia',
    location: 'Bratislava, Eslováquia',
    flag: '🇸🇰',
    country: 'Eslováquia',
    market: 'Europa',
    format: 'Online + Presencial',
    teaser: 'Descubra uma porta de entrada competitiva.',
  },
];

const accentText = { cyan: 'text-[#00f3ff]' };
const accentGradient = { cyan: 'from-[#00f3ff] via-cyan-200 to-white' };
const partnerSchoolEntityCandidates = [
  "PartnerSchool",
  "School",
  "Escola",
  "Institution",
  "PartnerInstitution",
  "SchoolUnit",
  "LeadPage",
];
const schoolNameFieldCandidates = [
  "school_name",
  "name",
  "title",
  "display_name",
  "institution_name",
  "partner_name",
  "school",
  "full_name",
];

function isVideoMedia(value = '') {
  return /\.mp4($|\?)/i.test(value) || String(value).includes('/mp4/');
}

function normalizeSchoolName(value = "") {
  return String(value).trim().replace(/\s+/g, " ").toLowerCase();
}

function isSchoolLikeName(value = "") {
  return /(escola|col[eé]gio|instituto|academy|academia|school)/i.test(String(value));
}

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

function normalizeWhatsapp(value = "") {
  return String(value).replace(/\D/g, "").slice(0, 11);
}

function formatWhatsapp(value = "") {
  const digits = normalizeWhatsapp(value);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border border-white/10 rounded-xl overflow-hidden transition-all duration-300 ${open ? 'bg-white/5' : 'bg-white/[0.02]'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left sm:p-6"
      >
        <span className="text-base font-medium text-white sm:text-lg">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 leading-relaxed text-gray-300 sm:px-6 sm:pb-6">
          {a}
        </div>
      )}
    </div>
  );
}

export default function EscolaParceira() {
  const [scrolled, setScrolled] = useState(false);
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [partnerSchools, setPartnerSchools] = useState([]);
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    school: "",
  });
  
  // Spotlight / Social Proof states
  const trackRef = useRef(null);
  const variant = 'default';
  const spotlight = useMemo(() => athleteSpotlights[variant] || athleteSpotlights.default, [variant]);
  const accentClass = accentText[spotlight.accent] || accentText.cyan;
  const accentGlow = accentGradient[spotlight.accent] || accentGradient.cyan;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isSchedulingOpen || partnerSchools.length > 0 || isLoadingSchools) return;

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
  }, [isSchedulingOpen, partnerSchools.length, isLoadingSchools]);

  const scrollTrack = (direction) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({
      left: direction * trackRef.current.clientWidth * 0.82,
      behavior: 'smooth',
    });
  };

  const handleScheduleFieldChange = (field, value) => {
    setScheduleForm((current) => ({
      ...current,
      [field]: field === "phone" ? formatWhatsapp(value) : value,
    }));
  };

  const resetScheduleForm = () => {
    setScheduleForm({
      full_name: "",
      phone: "",
      email: "",
      school: "",
    });
  };

  const handleScheduleSubmit = async (event) => {
    event.preventDefault();

    const fullName = scheduleForm.full_name.trim();
    const email = scheduleForm.email.trim();
    const school = scheduleForm.school.trim();
    const phone = normalizeWhatsapp(scheduleForm.phone);

    if (!fullName || !email || !school || phone.length < 10) {
      toast.error("Preencha nome completo, WhatsApp, e-mail e escola parceira.");
      return;
    }

    if (
      partnerSchools.length > 0 &&
      !partnerSchools.some((option) => normalizeSchoolName(option) === normalizeSchoolName(school))
    ) {
      toast.error("Selecione uma escola parceira válida da lista da Revela Talentos.");
      return;
    }

    setIsSubmittingSchedule(true);
    try {
      await base44.entities.Lead.create({
        full_name: fullName,
        email,
        phone,
        lead_category: "revela_talentos",
        source_page: "escola_parceira",
        objectives: "Agendamento para a apresentação da Escola Parceira",
        notes: `Escola parceira informada: ${school}. Interesse: acompanhar a apresentação da parceria e metodologia da Revela Talentos.`,
        lgpd_consent: true,
      });

      toast.success("Agendamento recebido! Nossa equipe vai considerar sua escola parceira no contato.");
      resetScheduleForm();
      setIsSchedulingOpen(false);
    } catch (error) {
      console.error("Erro ao registrar agendamento da escola parceira:", error);
      toast.error("Não foi possível registrar agora. Tente novamente em instantes.");
    } finally {
      setIsSubmittingSchedule(false);
    }
  };

  return (
    <div className="bg-[#040507] min-h-screen text-white overflow-x-hidden">
      {/* Background Effect globally */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(0,243,255,0.08),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%)]" />

      {/* STICKY HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
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

      {/* HERO â€” Netflix title-page layout */}
      <section className="relative min-h-[100vh] overflow-hidden escola-parceira-hero bg-black">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            src="https://video.wixstatic.com/video/933cdd_388c6e2a108d49f089ef70033306e785/1080p/mp4/file.mp4"
            autoPlay muted loop playsInline controls={false}
            className="absolute inset-0 hidden h-full w-full object-cover object-center animate-cinematic-zoom opacity-55 sm:block"
            style={{ pointerEvents: 'none' }}
          />
          <div className="absolute inset-x-0 top-0 h-[58svh] overflow-hidden sm:hidden">
            <video
              src="https://video.wixstatic.com/video/933cdd_388c6e2a108d49f089ef70033306e785/1080p/mp4/file.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              className="h-full w-full object-cover object-center animate-cinematic-zoom opacity-76"
              style={{ pointerEvents: 'none' }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.18)_0%,rgba(2,6,23,0.28)_26%,rgba(3,7,18,0.54)_58%,rgba(4,5,7,0.96)_100%)]" />
          </div>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-black/70 md:from-black/88 md:via-black/30 md:to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_45%,transparent_0%,rgba(0,0,0,0.12)_35%,rgba(0,0,0,0.62)_100%)]" />
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/85 to-transparent md:w-[58%]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(37,99,235,0.16),transparent_28%),radial-gradient(circle_at_78%_25%,rgba(14,165,233,0.14),transparent_22%)]" />
          <div className="absolute inset-x-0 top-0 z-[1] h-[58svh] sm:hidden">
            <div className="absolute right-4 top-5 flex items-center gap-2 rounded-full border border-white/12 bg-[rgba(15,23,42,0.84)] px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/90 shadow-[0_10px_25px_rgba(0,0,0,0.24)]">
              <Globe className="h-3.5 w-3.5 text-cyan-300" />
              PT
            </div>

            <img
              src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png"
              alt="Revela Talentos"
              className="absolute left-1/2 top-[17%] h-44 w-auto -translate-x-1/2 opacity-50"
            />

            <div className="relative z-10 absolute inset-x-0 bottom-0 px-4 pb-7">
              <div className="max-w-[340px] font-['Inter']">
                <h1 className="text-[2.85rem] font-extrabold leading-[0.92] tracking-tight text-white">
                  Revela Talentos
                </h1>
                <p className="mt-3 max-w-[17rem] text-[15px] leading-7 text-white/88">
                  Desenvolva suas habilidades com nosso conteudo exclusivo e mentorias de alto nivel.
                </p>

                <div className="mt-5 flex items-center gap-2">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <span
                      key={index}
                      className={`h-1.5 rounded-full ${index === 0 ? 'w-10 bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.9)]' : 'w-6 bg-white/22'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.92)_62%,#040507_100%)] shadow-[0_26px_48px_rgba(0,0,0,0.62)]" />
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1400px] flex-col justify-between px-4 pb-6 pt-[60svh] sm:px-6 sm:pb-8 sm:pt-28 md:px-10 md:pt-32 lg:px-14">
          <div className="max-w-3xl">
            <div className="mb-5 hidden flex-wrap items-center gap-3 font-['Inter'] sm:mb-6 sm:flex sm:gap-4">
              <img
                src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png"
                alt="Revela Talentos"
                className="h-8 w-auto sm:h-9 md:h-11"
              />
              <span className="border-l border-cyan-400/30 pl-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/90 sm:pl-4 sm:text-base sm:tracking-[0.28em] md:text-lg">
                Escolas Parceiras
              </span>
            </div>

            <div className="hidden space-y-5 font-['Inter'] sm:block">
              <h1 className="max-w-3xl text-[2.45rem] font-extrabold uppercase leading-[0.92] tracking-tight text-white sm:text-[3.15rem] md:text-5xl lg:text-[3.45rem]">
                REVELA TALENTOS
              </h1>

              <p className="max-w-2xl text-[15px] leading-7 text-white/88 sm:text-base md:text-[1.15rem] md:leading-8">
                Para os pais de atletas das nossas escolas parceiras, este é o momento de entender como a Revela Talentos pode fortalecer disciplina, confiança e visão de futuro no dia a dia dos seus filhos. Em uma apresentação com linguagem clara e impacto cinematográfico, você vai conhecer a metodologia, os benefícios da parceria e como essa jornada apoia o desenvolvimento esportivo, escolar e humano de cada aluno.
              </p>
            </div>

            <div className="mt-2 space-y-4 font-['Inter'] sm:mt-8 sm:space-y-5">
              <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-stretch">
                <Button
                  type="button"
                  onClick={() => setIsSchedulingOpen(true)}
                  className="h-auto min-h-[48px] w-full justify-center gap-3 whitespace-normal rounded-none border-0 bg-white px-5 py-3 text-sm font-semibold leading-tight text-black shadow-[0_12px_35px_rgba(59,130,246,0.18)] hover:bg-white/90 sm:min-h-[56px] md:w-auto md:px-6 md:text-base"
                >
                  <Calendar className="h-5 w-5" />
                  Agendar agora
                </Button>
                <Button
                  asChild
                  className="h-auto min-h-[48px] w-full justify-center gap-3 whitespace-normal rounded-none border border-cyan-400/20 bg-[rgba(15,23,42,0.78)] px-5 py-3 text-sm font-semibold leading-tight text-white hover:bg-[rgba(30,41,59,0.92)] sm:min-h-[56px] md:w-auto md:max-w-[320px] md:px-6 md:text-base"
                >
                  <Link to="/vsl-escola-parceira">
                    <ArrowRight className="h-4 w-4" />
                    Não poderei estar presente no dia
                  </Link>
                </Button>
              </div>

              <div className="flex max-w-full items-center gap-3 rounded-[20px] border border-cyan-400/18 bg-[linear-gradient(135deg,rgba(15,23,42,0.88),rgba(8,47,73,0.52))] px-3.5 py-3.5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:max-w-[460px] sm:gap-4 sm:rounded-[22px] sm:px-4 sm:py-4">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-full bg-cyan-400/25 blur-md" />
                  <img
                    src="https://static.wixstatic.com/media/933cdd_1aef7b3f8c0742f787ce8be9ff553bb4~mv2.jpeg"
                    alt="Eric Cena"
                    className="relative h-12 w-12 rounded-full border border-white/20 object-cover sm:h-14 sm:w-14"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-cyan-300/80 sm:text-[10px] sm:tracking-[0.28em]">
                    Apresentação Especial
                  </p>
                  <p className="mt-1 text-base font-bold tracking-tight text-white sm:text-lg">
                    Eric Cena
                  </p>
                  <p className="text-xs text-white/68 sm:text-sm">
                    Fundador da Revela Talentos e responsável pela live de lançamento.
                  </p>
                </div>
              </div>

              <div className="hero-icon-row flex flex-nowrap gap-2 overflow-x-auto pb-2 pr-2 font-['Inter'] sm:gap-3">
                {heroPreviewCards.map((card, index) => (
                  <div
                    key={card.title}
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 backdrop-blur-xl sm:gap-2.5 sm:px-3.5 sm:py-2.5 ${index === 0 ? 'border-cyan-300/70 bg-[rgba(8,47,73,0.72)] text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.18)]' : 'border-white/12 bg-[rgba(15,23,42,0.62)] text-white/88 shadow-[0_10px_30px_rgba(0,0,0,0.2)]'}`}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full sm:h-9 sm:w-9 ${index === 0 ? 'bg-cyan-400/14' : 'bg-white/8'}`}>
                      <card.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.1} />
                    </div>
                    <span className="whitespace-nowrap text-xs font-semibold tracking-wide sm:text-[13px]">
                      {card.title}
                    </span>
                  </div>
                ))}
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
          .hero-icon-row {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .hero-icon-row::-webkit-scrollbar {
            display: none;
          }
          @keyframes opportunities-marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(calc(-50% - 0.75rem), 0, 0); }
          }
          .opportunities-carousel-mask {
            overflow: hidden;
          }
          .opportunities-carousel-track {
            animation: opportunities-marquee 34s linear infinite;
            will-change: transform;
          }
          .opportunities-carousel-mask:hover .opportunities-carousel-track {
            animation-play-state: paused;
          }
          .escola-parceira-hero::after {
            content: '';
            position: absolute;
            inset: auto 0 0;
            height: 110px;
            background: linear-gradient(180deg, transparent 0%, rgba(4,5,7,0.98) 100%);
            z-index: 2;
            pointer-events: none;
          }
          @media (min-width: 640px) {
            .escola-parceira-hero::after {
              height: 160px;
            }
          }
          @media (max-width: 639px) {
            .opportunities-carousel-track {
              animation-duration: 28s;
            }
          }
        `}</style>
      </section>

      <Dialog open={isSchedulingOpen} onOpenChange={setIsSchedulingOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto border border-cyan-400/20 bg-[#050811] p-0 text-white sm:max-w-2xl">
          <div className="bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)] p-6 sm:p-7">
            <DialogHeader className="space-y-3 text-left">
              <Badge className="w-fit border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-300">
                Agendamento da Live
              </Badge>
              <DialogTitle className="text-2xl font-black tracking-tight text-white sm:text-[2rem]">
                Garanta sua presença com os dados da sua escola parceira
              </DialogTitle>
              <DialogDescription className="max-w-xl text-sm leading-6 text-white/70 sm:text-[15px]">
                Preencha nome completo, WhatsApp, e-mail e identifique a escola parceira. Se a lista pública do banco estiver disponível no navegador, você poderá selecionar a escola diretamente.
              </DialogDescription>
            </DialogHeader>

            <form className="mt-6 space-y-4" onSubmit={handleScheduleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="school-partner-full-name" className="text-white/86">
                    Nome completo
                  </Label>
                  <Input
                    id="school-partner-full-name"
                    value={scheduleForm.full_name}
                    onChange={(event) => handleScheduleFieldChange("full_name", event.target.value)}
                    placeholder="Seu nome completo"
                    autoComplete="name"
                    className="h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/35"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school-partner-phone" className="text-white/86">
                    WhatsApp
                  </Label>
                  <Input
                    id="school-partner-phone"
                    value={scheduleForm.phone}
                    onChange={(event) => handleScheduleFieldChange("phone", event.target.value)}
                    placeholder="(11) 99999-9999"
                    autoComplete="tel"
                    inputMode="numeric"
                    className="h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/35"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school-partner-email" className="text-white/86">
                    E-mail
                  </Label>
                  <Input
                    id="school-partner-email"
                    type="email"
                    value={scheduleForm.email}
                    onChange={(event) => handleScheduleFieldChange("email", event.target.value)}
                    placeholder="voce@exemplo.com"
                    autoComplete="email"
                    className="h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/35"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="school-partner-school" className="text-white/86">
                      Escola parceira
                    </Label>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-cyan-300/75">
                      {isLoadingSchools ? "Sincronizando escolas" : partnerSchools.length > 0 ? `${partnerSchools.length} escolas carregadas` : "Identificação manual liberada"}
                    </span>
                  </div>
                  <Input
                    id="school-partner-school"
                    list={partnerSchools.length > 0 ? "partner-schools-list" : undefined}
                    value={scheduleForm.school}
                    onChange={(event) => handleScheduleFieldChange("school", event.target.value)}
                    placeholder={partnerSchools.length > 0 ? "Selecione ou digite o nome da escola" : "Digite o nome da escola parceira"}
                    autoComplete="organization"
                    className="h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/35"
                  />
                  {partnerSchools.length > 0 && (
                    <datalist id="partner-schools-list">
                      {partnerSchools.map((school) => (
                        <option key={school} value={school} />
                      ))}
                    </datalist>
                  )}
                  <p className="text-xs leading-5 text-white/50">
                    {partnerSchools.length > 0
                      ? "Para manter a identificação alinhada ao banco da Revela Talentos, escolha uma escola válida da lista."
                      : "Se a lista pública das escolas não estiver acessível neste momento, ainda registraremos o nome informado para validação interna."}
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-3 border-t border-white/10 pt-5 sm:justify-between sm:space-x-0">
                <p className="text-xs leading-5 text-white/45">
                  Ao enviar, a sua solicitação entra na base de leads da Revela Talentos para confirmação da apresentação.
                </p>
                <Button
                  type="submit"
                  disabled={isSubmittingSchedule}
                  className="h-12 min-w-[180px] rounded-none border-0 bg-white px-6 text-sm font-semibold text-black hover:bg-white/90"
                >
                  {isSubmittingSchedule ? "Enviando..." : "Confirmar agendamento"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* 1. SOCIAL PROOF MARQUEE */}
      <MainLandingCarousel 
        eyebrow="/ Nossa Estrutura Global" 
        title="CONEXÕES EUROPEIAS E NACIONAIS" 
        description="A metodologia que será integrada à escola já levou centenas de atletas a oportunidades exclusivas nos maiores centros de excelência do mundo."
      />

      {/* DESAFIO DOS PAIS */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Badge className="bg-white/5 text-gray-400 border border-white/10 px-4 py-1.5 text-sm rounded-full mb-6">
            O Cenário Atual
          </Badge>
          <h2 className="mb-6 text-[2rem] font-bold sm:text-4xl md:text-5xl">
            Seu Filho Está Pronto para{" "}
            <span className={`bg-gradient-to-r ${accentGlow} bg-clip-text text-transparent`}>
              os Desafios Reais?
            </span>
          </h2>
          <p className="mb-10 text-base text-gray-400 sm:mb-12 sm:text-lg">No mundo exigente de hoje, estudar é metade do processo. A outra é forjar uma mente inabalável para esportes e pra vida.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Como dar confiança para ele acreditar nos próprios talentos além das telas e celulares?",
              "Como motivá-lo a manter dedicação aos estudos alinhada com seus sonhos, paixões e esporte?",
              "O que as grandes academias treinam na mente dos atletas de base e que pode ser trazido à escola?"
            ].map((q, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/[0.06] sm:p-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-sm font-bold mb-4">{i + 1}</div>
                <p className="text-gray-300 leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS REVELA TALENTOS (Cinematic Marquee) */}
      <BeneficiosRevelaTalentos />

      {/* 2. SOCIAL PROOF STATS */}
      <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className={`mb-4 block font-mono text-xs uppercase tracking-[0.3em] ${accentClass}`}>/ Nossa Força</span>
            <h2 className="text-[1.9rem] font-bold text-white sm:text-3xl md:text-4xl">NÚMEROS QUE COMPROVAM</h2>
          </div>
          <div className="grid max-w-6xl mx-auto grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Stat One */}
            <article className="relative flex h-[260px] flex-col justify-end overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0a0a0a] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:h-[390px] sm:rounded-[2rem] sm:p-6 md:h-[470px] md:p-10">
              <img src={statsData.statOneImage} alt="Atletas" className="absolute inset-0 h-full w-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040507] via-[#040507]/60 to-transparent" />
              <div className="relative z-10">
                <div className="mb-2 text-[2.35rem] font-black tracking-tighter text-white sm:text-6xl md:text-7xl">
                  {statsData.statOneValue.replace('+', '')}
                  <span className={accentClass}>+</span>
                </div>
                <div className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-gray-300 sm:text-sm sm:tracking-[0.3em] md:text-base">
                  {statsData.statOneLabel}
                </div>
                <p className="mt-4 max-w-sm text-[12px] leading-relaxed text-gray-300 sm:mt-5 sm:text-sm">{statsData.statOneText}</p>
              </div>
            </article>

            {/* Stat Two */}
            <article className="relative flex h-[260px] flex-col justify-end overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0a0a0a] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:h-[390px] sm:rounded-[2rem] sm:p-6 md:h-[470px] md:p-10">
              <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-55">
                <source src={statsData.statTwoVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-[#040507]/90 via-[#040507]/40 to-transparent" />
              <div className="relative z-10">
                <div className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-gray-300 sm:text-sm sm:tracking-[0.3em] md:text-base">
                  {statsData.statTwoEyebrow}
                </div>
                <div className="flex items-end gap-3">
                  <div className="text-[2.6rem] font-black tracking-tight text-white sm:text-6xl md:text-7xl">
                    {statsData.statTwoValue}
                  </div>
                  <div className="pb-1 font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-white/70 sm:text-xs">
                    {statsData.statTwoCaption}
                  </div>
                </div>
                <div className={`mt-2 text-2xl font-black uppercase tracking-tight sm:text-3xl ${accentClass}`}>
                  {statsData.statTwoTitle}
                </div>
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

      {/* OPORTUNIDADES ABERTAS */}
      <section className="relative overflow-hidden border-y border-white/5 bg-[linear-gradient(180deg,#040507_0%,#07111f_48%,#040507_100%)] px-4 py-16 sm:px-6 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_26%),radial-gradient(circle_at_80%_30%,rgba(37,99,235,0.12),transparent_22%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl mb-10 sm:mb-12">
            <Badge className="bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 px-4 py-1.5 text-sm rounded-full mb-6">
              Oportunidades Abertas
            </Badge>
            <h2 className="text-[2rem] font-bold text-white sm:text-4xl md:text-5xl">
              Oportunidades Dentro da{" "}
              <span className={`bg-gradient-to-r ${accentGlow} bg-clip-text text-transparent`}>
                Revela Talentos
              </span>
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-300 sm:mt-5 sm:text-lg sm:leading-8">
              Conheça algumas oportunidades em destaque para atletas das escolas parceiras, com rotas abertas no Brasil e em mercados estratégicos da Europa.
            </p>
          </div>

          <div className="relative opportunities-carousel-mask">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#07111f] to-transparent sm:w-20" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#07111f] to-transparent sm:w-20" />

            <div className="opportunities-carousel-track flex w-max gap-4 sm:gap-6">
              {[...opportunitiesData, ...opportunitiesData].map((opportunity, index) => (
                <article
                  key={`${opportunity.title}-${opportunity.location}-${index}`}
                  aria-hidden={index >= opportunitiesData.length}
                  className={`group relative w-[220px] shrink-0 overflow-hidden rounded-[1.35rem] border bg-[rgba(5,10,18,0.92)] p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 sm:w-[250px] sm:rounded-[1.55rem] sm:p-4 ${index % opportunitiesData.length === 0 ? 'border-cyan-400/35' : 'border-white/10 hover:border-cyan-400/25'}`}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),transparent_42%)] opacity-70 pointer-events-none" />
                  <div className="absolute -right-3 top-1 text-[4.3rem] leading-none opacity-[0.12] saturate-150 pointer-events-none select-none">
                    {opportunity.flag}
                  </div>
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400/0 via-cyan-300/70 to-cyan-400/0 opacity-80" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300 sm:px-3 sm:text-[11px] sm:tracking-[0.22em]">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
                        Aberta
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-3 sm:mt-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[rgba(8,47,73,0.28)] text-[1.2rem] shadow-[0_10px_30px_rgba(0,0,0,0.2)] sm:h-11 sm:w-11 sm:text-[1.35rem]">
                        <span aria-hidden="true">{opportunity.flag}</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/75 sm:text-[11px] sm:tracking-[0.24em]">
                          {opportunity.market}
                        </p>
                        <p className="text-xs text-white/55">
                          Plataforma Revela Talentos
                        </p>
                      </div>
                    </div>

                    <h3 className="mt-4 text-[1.4rem] font-black leading-[1.05] text-white sm:mt-5 sm:text-[1.65rem]">
                      {opportunity.title}
                    </h3>

                    <div className="mt-2.5 flex flex-wrap gap-3 text-[12px] text-white/70 sm:mt-3 sm:text-[13px]">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-cyan-300" />
                        {opportunity.location}
                      </span>
                    </div>

                    <p className="mt-3 text-[13px] leading-5 text-gray-300 sm:mt-4 sm:text-sm sm:leading-6">
                      {opportunity.teaser}
                    </p>

                    <a href="#" onClick={(e) => e.preventDefault()} className="mt-4 block sm:mt-5">
                      <div className="flex items-center justify-between rounded-2xl border border-cyan-400/20 bg-[rgba(8,47,73,0.26)] px-3.5 py-2.5 text-[13px] font-semibold text-cyan-100 transition-all duration-300 group-hover:border-cyan-300/35 group-hover:bg-[rgba(8,47,73,0.34)] sm:px-4 sm:py-3 sm:text-sm">
                        <span className="inline-flex items-center gap-2.5 sm:gap-3">
                          <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Ver oportunidade
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CRONOGRAMA */}
      <section id="como-funciona" className="relative bg-gradient-to-b from-[#040507] to-gray-950 px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-1.5 text-sm rounded-full mb-6 relative z-10">
              Passos a Seguir
            </Badge>
            <h2 className="relative z-10 mb-4 text-[2rem] font-bold sm:text-4xl md:text-5xl">
              Tudo Começa no Dia{" "}
              <span className={`bg-gradient-to-r ${accentGlow} bg-clip-text text-transparent`}>
                20 de Abril
              </span>
            </h2>
            <p className="relative z-10 text-base text-gray-400 sm:text-xl">Como vai funcionar esta trajetória inesquecível para pais e alunos nas próximas etapas.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-[2px] h-[calc(100%-96px)] bg-gradient-to-b from-cyan-500/50 to-transparent" />
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="relative z-10 flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/[0.06] sm:p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl font-black text-white/10 sm:text-5xl">{step.num}</span>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                        <step.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="hidden md:flex w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 items-center justify-center text-xl font-black text-white shadow-lg shadow-cyan-500/30 flex-shrink-0 z-10">
                    {i + 1}
                  </div>
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
              <h2 className="text-[1.95rem] font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-4xl md:text-5xl">
                Exemplos de <span className={`bg-gradient-to-r bg-clip-text text-transparent ${accentGlow}`}>{spotlight.highlight}</span>
              </h2>
              <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-gray-400 md:text-base">{spotlight.description}</p>
            </div>

            <div className="flex items-center justify-end gap-2 md:px-6">
              <button
                type="button"
                onClick={() => scrollTrack(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-white/20 hover:bg-white/10 sm:h-11 sm:w-11"
              >
                <span className="text-lg leading-none">&lsaquo;</span>
              </button>
              <button
                type="button"
                onClick={() => scrollTrack(1)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-white/20 hover:bg-white/10 sm:h-11 sm:w-11 ${accentClass}`}
              >
                <span className="text-lg leading-none">&rsaquo;</span>
              </button>
            </div>
          </div>

          <div className="relative mb-10 md:mb-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent md:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-gray-950 via-gray-950/80 to-transparent md:block" />

            <div
              ref={trackRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pl-1 pr-1 scroll-smooth sm:gap-5 md:px-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {spotlight.items.map(([name, club, image], index) => (
                <article
                  key={`${name}-${club}-${index}`}
                  className="group relative aspect-[4/5] w-[82vw] max-w-[280px] shrink-0 snap-start overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/40 shadow-[0_25px_90px_rgba(0,0,0,0.35)] sm:w-[290px] sm:rounded-[2rem] md:w-[300px]"
                >
                  {isVideoMedia(image) ? (
                    <video src={image} controls playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <img src={image} alt={`${name} - ${club}`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
                  <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between p-4 sm:p-5 md:p-6">
                    <div className="flex justify-between gap-4">
                      <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/80 backdrop-blur sm:text-[10px]">
                        EC10
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/70 sm:text-[10px]">
                        Evolução
                      </span>
                    </div>
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
            <h2 className="mb-4 text-[2rem] font-bold sm:text-4xl md:text-5xl">
              O Que Dizem os Pais{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Experientes
              </span>
            </h2>
            <p className="text-gray-400">Famílias que já vivenciam a metodologia de inteligência e disciplina.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-yellow-500/20 hover:bg-white/[0.06] sm:p-8">
                <div className="flex gap-1 mb-6">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="mb-6 text-base italic leading-relaxed text-gray-300 sm:text-lg">"{t.text}"</p>
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                    {t.avatar}
                  </div>
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

      {/* CTA INVITATION */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,229,255,0.1)_0%,_transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Badge className="bg-red-500/20 text-red-500 border border-red-500/30 px-4 py-1.5 text-sm font-bold rounded-full mb-6">
            Dia 20 de Abril
          </Badge>
          <h2 className="mb-6 text-[2rem] font-bold sm:text-4xl md:text-6xl">
            Sua Presença é{" "}
            <span className={`bg-gradient-to-r ${accentGlow} bg-clip-text text-transparent`}>
              Fundamental!
            </span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-gray-300 sm:mb-10 sm:text-xl">
            Nós te esperamos nesta live reveladora onde Eric Cena mergulha nos projetos pensados para o seu filho. Preste atenção nas mensagens oficiais enviadas pela escola e não perca!
          </p>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <Button className="h-14 w-full rounded-xl border-0 bg-gradient-to-r from-red-600 to-red-500 px-6 text-base font-bold text-white shadow-2xl shadow-red-500/30 transition-all duration-300 hover:-translate-y-1 hover:from-red-500 hover:to-red-400 sm:h-16 sm:w-auto sm:px-12 sm:text-xl">
              <Calendar className="mr-3 w-6 h-6" /> Agendar Lembrete na Live
            </Button>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/5 bg-gray-950 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Perguntas Comuns</h2>
            <p className="text-gray-400">O que você precisa saber antes do lançamento de 20/04.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#040507] py-10 sm:py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row">
          <img src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" alt="Revela Talentos" className="h-8 w-auto opacity-80" />
          <p className="text-gray-600 text-sm text-center">
            © 2026 Revela Talentos & Escola Parceira. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-gray-600 text-sm">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
