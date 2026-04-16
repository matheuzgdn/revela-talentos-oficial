import { useState, useEffect, useMemo, useRef } from "react";
import MainLandingCarousel from "../components/hub/MainLandingCarousel";
import { base44 } from "@/api/base44Client";
import BeneficiosRevelaTalentos from "../components/hub/BeneficiosRevelaTalentos";
import { Link } from "react-router-dom";
import {
  Sparkles, Award, Users,
  ChevronDown, ChevronUp, ArrowRight,
  Star, Globe, Shield, Zap, Calendar, User, MapPin, Lock, MessageCircle, VolumeX
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
    q: "O que a Revela Talentos entrega para pais e atletas?",
    a: "A Revela Talentos une preparação física, mental e técnica com direcionamento estratégico de carreira, mentorias e conexão real com oportunidades em clubes do Brasil e do exterior."
  },
  {
    q: "Como funciona a plataforma da Revela Talentos?",
    a: "A plataforma reúne metodologia, mentorias, seletivas, conteúdos estratégicos e direcionamento prático para pais e atletas que querem acelerar a evolução com mais clareza e profissionalismo."
  },
  {
    q: "O que acontece depois que eu entro na plataforma?",
    a: "Você passa a ter acesso ao ecossistema da Revela Talentos para entender o processo, aplicar a metodologia, usar os conteúdos e avançar com mais preparo nas próximas etapas da jornada esportiva."
  }
];

// benefits constant removed as it's now handled by BeneficiosRevelaTalentos component

const testimonials = [
  {
    name: "Mãe do Matheus (14 anos)",
    school: "Família Revela Talentos",
    text: "Meu filho mudou radicalmente de postura em casa e nos estudos. A mentalidade que ele adotou agora é de um verdadeiro atleta nota 10!",
    rating: 5,
    avatar: "M"
  },
  {
    name: "Pai da Sofia (12 anos)",
    school: "Jornada de Desenvolvimento",
    text: "Assistir às explicações sobre a metodologia me deu segurança para entender o processo e enxergar um caminho mais profissional para a carreira da minha filha.",
    rating: 5,
    avatar: "P"
  },
  {
    name: "Mãe do Lucas (15 anos)",
    school: "Mentoria para Famílias",
    text: "Perceber que meu filho está sendo preparado como atleta e como ser humano nos deixou muito mais confiantes para apoiar essa caminhada.",
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
  { title: 'Avaliação Premium', location: 'São Paulo, Brasil', flag: '🇧🇷', country: 'Brasil', market: 'Base Nacional', format: 'Presencial', teaser: 'Vagas limitadas para atletas em avaliação.' },
  { title: 'Alta Performance', location: 'Belo Horizonte, Brasil', flag: '🇧🇷', country: 'Brasil', market: 'Desenvolvimento', format: 'Presencial', teaser: 'Ambiente ideal para acelerar evolução.' },
  { title: 'Janela Portugal', location: 'Braga, Portugal', flag: '🇵🇹', country: 'Portugal', market: 'Europa', format: 'Híbrido', teaser: 'Uma rota aberta para o mercado europeu.' },
  { title: 'Camp Espanha', location: 'Madrid, Espanha', flag: '🇪🇸', country: 'Espanha', market: 'Europa', format: 'Híbrido', teaser: 'Curadoria especial para atletas promissores.' },
  { title: 'Exposição Polônia', location: 'Varsóvia, Polônia', flag: '🇵🇱', country: 'Polônia', market: 'Europa', format: 'Online + Presencial', teaser: 'Uma vitrine estratégica em crescimento.' },
  { title: 'Entrada Eslováquia', location: 'Bratislava, Eslováquia', flag: '🇸🇰', country: 'Eslováquia', market: 'Europa', format: 'Online + Presencial', teaser: 'Descubra uma porta de entrada competitiva.' },
];

const supportContacts = ['+55 31 8233-1411', '+351 914 945 252'];

const accentText = { cyan: 'text-[#00f3ff]' };
const accentGradient = { cyan: 'from-[#00f3ff] via-cyan-200 to-white' };
function isVideoMedia(value = '') { return /\.mp4($|\?)/i.test(value) || String(value).includes('/mp4/'); }
function normalizeWhatsapp(value = "") { return String(value).replace(/\D/g, "").slice(0, 11); }
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
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 p-4 text-left sm:p-6">
        <span className="text-base font-medium text-white sm:text-lg">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (<div className="px-4 pb-4 leading-relaxed text-gray-300 sm:px-6 sm:pb-6">{a}</div>)}
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

export default function Evento() {
  const [isMobileViewport, setIsMobileViewport] = useState(() => typeof window !== "undefined" ? window.innerWidth < 640 : false);
  const [isMobileHeroLocked, setIsMobileHeroLocked] = useState(true);
  const [supportContactIndex, setSupportContactIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [activeHeroService, setActiveHeroService] = useState(null);
  const [isHeroCarouselPaused, setIsHeroCarouselPaused] = useState(false);
  const [isHeroVideoMuted, setIsHeroVideoMuted] = useState(true);
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    full_name: "",
    phone: "",
    email: "",
  });

  // Spotlight / Social Proof states
  const trackRef = useRef(null);
  const signupHighlightTimeoutRef = useRef(null);
  const heroCarouselResumeTimeoutRef = useRef(null);
  const desktopHeroVideoRef = useRef(null);
  const mobileHeroVideoRef = useRef(null);
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
    const updateViewport = () => setIsMobileViewport(window.innerWidth < 640);
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    return () => {
      if (signupHighlightTimeoutRef.current) {
        window.clearTimeout(signupHighlightTimeoutRef.current);
      }
      if (heroCarouselResumeTimeoutRef.current) {
        window.clearTimeout(heroCarouselResumeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMobileViewport || !isMobileHeroLocked) return undefined;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isMobileViewport, isMobileHeroLocked]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSupportContactIndex((current) => (current + 1) % supportContacts.length);
    }, 3000);
    return () => window.clearInterval(intervalId);
  }, []);

  const scrollTrack = (direction) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: direction * trackRef.current.clientWidth * 0.82, behavior: 'smooth' });
  };

  const scrollToSignupCta = () => {
    const target = Array.from(document.querySelectorAll('[data-signup-target="true"]')).find((element) => element.offsetParent !== null);
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

  const toggleHeroVideoAudio = () => {
    const video = [mobileHeroVideoRef.current, desktopHeroVideoRef.current].find((element) => element && element.offsetParent !== null)
      || mobileHeroVideoRef.current
      || desktopHeroVideoRef.current;
    if (!video || !isHeroVideoMuted) return;
    setIsHeroVideoMuted(false);
    video.muted = false;
    video.volume = 0.82;
    const playPromise = video.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
  };

  const handleMobileHeroComplete = () => {
    setIsMobileHeroLocked(false);
  };

  const handleHeroServiceSchedule = () => {
    setActiveHeroService(null);
    setIsSchedulingOpen(true);
  };

  const handleScheduleFieldChange = (field, value) => {
    setScheduleForm((current) => ({ ...current, [field]: field === "phone" ? formatWhatsapp(value) : value }));
  };

  const resetScheduleForm = () => {
    setScheduleForm({ full_name: "", phone: "", email: "" });
  };

  const handleScheduleSubmit = async (event) => {
    event.preventDefault();
    const fullName = scheduleForm.full_name.trim();
    const email = scheduleForm.email.trim();
    const phone = normalizeWhatsapp(scheduleForm.phone);
    if (!fullName || !email || phone.length < 10) {
      toast.error("Preencha nome completo, WhatsApp e e-mail.");
      return;
    }
    setIsSubmittingSchedule(true);
    try {
      await base44.entities.Lead.create({
        full_name: fullName,
        email,
        phone,
        lead_category: "revela_talentos",
        source_page: "evento",
        objectives: "Solicitação de acesso à plataforma Revela Talentos",
        notes: "Interesse em conhecer a plataforma, a metodologia, as mentorias e as seletivas da Revela Talentos.",
        lgpd_consent: true,
      });
      toast.success("Solicitação recebida! Nossa equipe fará o contato com os próximos passos.");
      resetScheduleForm();
      setIsSchedulingOpen(false);
    } catch (error) {
      console.error("Erro ao registrar inscricao do evento:", error);
      toast.error("Nao foi possivel registrar agora. Tente novamente em instantes.");
    } finally {
      setIsSubmittingSchedule(false);
    }
  };

  return (
    <div className="bg-[#040507] min-h-screen text-white overflow-x-hidden">
      {/* Background Effect globally */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(0,243,255,0.08),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%)]" />

      <a
        href="https://www.ec10talentos.com/_paylink/AZ1-ne5r"
        target="_blank"
        rel="noreferrer"
        aria-label={`Quero acessar agora - contato ${supportContacts[supportContactIndex]}`}
        className="fixed bottom-4 right-4 z-[60] inline-flex items-center gap-3 rounded-full border border-emerald-300/30 bg-[linear-gradient(135deg,rgba(34,197,94,0.98),rgba(22,163,74,0.94))] px-4 py-3 text-white shadow-[0_0_0_1px_rgba(187,247,208,0.12),0_0_22px_rgba(34,197,94,0.42),0_22px_40px_rgba(20,83,45,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(220,252,231,0.2),0_0_28px_rgba(74,222,128,0.5),0_26px_44px_rgba(20,83,45,0.36)] sm:bottom-6 sm:right-6"
        style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      >
        <MessageCircle className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
        <span className="flex flex-col leading-none">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">Contato</span>
          <span className="mt-1 text-[12px] font-bold tracking-[0.03em] text-white sm:text-[13px]">{supportContacts[supportContactIndex]}</span>
        </span>
      </a>

      {/* STICKY HEADER */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'} ${isMobileViewport && isMobileHeroLocked ? 'hidden sm:block' : ''}`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link to="/">
            <img src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" alt="Revela Talentos" className="h-8 w-auto sm:h-10" />
          </Link>
          <a href="#como-funciona">
            <Button className="h-10 whitespace-nowrap rounded-lg border-0 bg-gradient-to-r from-blue-600 to-cyan-500 px-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-blue-500 hover:to-cyan-400 sm:h-auto sm:px-6 sm:text-base">
              Sobre a Plataforma
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
          <div className="absolute inset-x-0 top-0 h-[78svh] overflow-hidden sm:hidden">
            <video
              ref={mobileHeroVideoRef}
              src="https://video.wixstatic.com/video/933cdd_d28be744cb8c4029b910896cf742e724/1080p/mp4/file.mp4"
              autoPlay
              onEnded={handleMobileHeroComplete}
              muted={isHeroVideoMuted}
              playsInline
              controls={false}
              className="h-full w-full object-cover object-center animate-cinematic-zoom opacity-[0.99]"
            />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,transparent_0%,rgba(4,5,7,0.08)_18%,rgba(4,5,7,0.97)_100%)] shadow-[0_34px_74px_rgba(0,0,0,0.82)]" />
          </div>
          <div className="absolute inset-0 hidden bg-black/30 sm:block" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-black/90 via-black/45 to-black/70 md:from-black/88 md:via-black/30 md:to-black/50 sm:block" />
          <div className="absolute inset-0 hidden bg-gradient-to-t from-black via-black/25 to-transparent sm:block" />
          <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_55%_45%,transparent_0%,rgba(0,0,0,0.12)_35%,rgba(0,0,0,0.62)_100%)] sm:block" />
          <div className="absolute inset-y-0 left-0 hidden w-full bg-gradient-to-r from-black/85 to-transparent md:w-[58%] sm:block" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(37,99,235,0.16),transparent_28%),radial-gradient(circle_at_78%_25%,rgba(14,165,233,0.14),transparent_22%)]" />
        </div>

        {isMobileViewport && (
          <div className="absolute inset-x-4 top-0 z-20 h-[78svh] sm:hidden">
            {isHeroVideoMuted && (
              <button
                type="button"
                onClick={toggleHeroVideoAudio}
                className="pointer-events-auto absolute right-0 top-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-black/55 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md transition-all duration-300 hover:border-cyan-200/40 hover:bg-black/60 hover:text-cyan-100"
              >
                <VolumeX className="h-4 w-4" />
                <span>Ativar áudio</span>
              </button>
            )}
            {isMobileHeroLocked && (
              <div className="pointer-events-none absolute inset-x-0 bottom-6">
                <h1 className="max-w-[12rem] text-[2.7rem] font-extrabold uppercase leading-[0.9] tracking-tight text-white [text-shadow:0_8px_24px_rgba(0,0,0,0.9),0_18px_40px_rgba(0,0,0,0.78)]">
                  REVELA TALENTOS
                </h1>
              </div>
            )}
          </div>
        )}

        <div className={`relative z-10 mx-auto flex w-full max-w-[1400px] flex-col justify-start px-4 pb-6 ${isMobileViewport ? (isMobileHeroLocked ? 'min-h-[100svh] pt-[73svh]' : 'pt-[48svh]') : 'pt-[43svh]'} sm:min-h-[100svh] sm:justify-between sm:px-6 sm:pb-8 sm:pt-28 md:px-10 md:pt-32 lg:px-14`}>
          <div className="relative w-full">
            <div className={`mb-5 mt-5 flex flex-wrap items-center gap-3 font-['Inter'] sm:mb-6 sm:mt-0 sm:gap-4 ${isMobileViewport && isMobileHeroLocked ? 'hidden sm:flex' : ''}`}>
              <img src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" alt="Revela Talentos" className="h-8 w-auto sm:h-9 md:h-11" />
              <span className="border-l border-cyan-400/30 pl-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/90 sm:pl-4 sm:text-base sm:tracking-[0.28em] md:text-lg">Plataforma Oficial</span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,420px)] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(360px,440px)] xl:gap-10">
              <div className="order-2 max-w-3xl space-y-5 font-['Inter'] lg:order-1 lg:pt-4 xl:pt-5">
                <h1 className={`${isMobileViewport && isMobileHeroLocked ? 'hidden sm:block' : 'block'} max-w-3xl text-[2.5rem] font-extrabold uppercase leading-[0.92] tracking-tight text-white sm:text-[3.15rem] md:text-5xl lg:text-[3.45rem]`}>REVELA TALENTOS</h1>
                {isMobileViewport && isMobileHeroLocked ? (
                  <div className="max-w-[19rem] rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm sm:hidden">
                    <p className="text-[0.98rem] leading-7 text-white/86">
                      Assista ao vídeo completo de 2 min para desbloquear todos os benefícios da plataforma.
                    </p>
                  </div>
                ) : (
                  <p className="max-w-2xl text-[15px] leading-7 text-white/88 sm:text-base md:text-[1.15rem] md:leading-8">
                    A plataforma da Revela Talentos foi criada para pais e atletas que querem evoluir com direção, mentoria, preparação completa e conexão real com oportunidades no Brasil e no exterior.
                  </p>
                )}
                <div className={`pt-2 sm:pt-3 ${isMobileViewport && isMobileHeroLocked ? 'hidden sm:block' : ''}`}>
                  <h2 className="max-w-[18rem] text-[1.55rem] font-black uppercase leading-[0.9] tracking-tight text-white sm:text-[1.9rem]">
                    BENEFÍCIOS
                    <span className="block text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>
                      REVELA TALENTOS
                    </span>
                  </h2>
                </div>

                <div id="inscricao-revela-desktop" data-signup-target="true" className="relative mt-5 hidden space-y-4 rounded-[1.75rem] font-['Inter'] transition-[box-shadow,transform] duration-500 lg:block">
                  <div
                    className="hero-service-mask relative overflow-x-auto overflow-y-visible [--hero-gap:0.9rem] xl:[--hero-gap:1rem]"
                    onTouchStart={pauseHeroCarousel}
                    onTouchEnd={resumeHeroCarouselSoon}
                    onTouchCancel={resumeHeroCarouselSoon}
                    onScroll={handleHeroCarouselInteraction}
                  >
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-14 bg-[linear-gradient(90deg,#040507_0%,rgba(4,5,7,0.78)_48%,transparent_100%)]" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-14 bg-[linear-gradient(270deg,#040507_0%,rgba(4,5,7,0.78)_48%,transparent_100%)]" />
                    <div
                      className="hero-service-track flex w-max gap-[var(--hero-gap)] pb-2"
                      style={{ animationPlayState: activeHeroService || isHeroCarouselPaused ? 'paused' : 'running' }}
                    >
                    {heroServiceCarouselCards.map((card, index) => (
                      <article
                        key={`desktop-${card.title}-${index}`}
                        className="group relative aspect-square w-[230px] shrink-0 snap-start overflow-hidden rounded-[2rem] bg-[#040507] text-left shadow-[0_32px_90px_rgba(0,0,0,0.42),0_0_30px_rgba(14,165,233,0.08)] transition-all duration-300 hover:-translate-y-1 xl:w-[248px] 2xl:w-[268px]"
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

                        <div className="relative z-10 h-full p-4">
                          <div className="absolute inset-x-4 bottom-4">
                            <h3 className="max-w-[12ch] text-[1.02rem] font-black uppercase leading-[0.96] tracking-tight text-white [text-shadow:0_6px_20px_rgba(0,0,0,0.9),0_14px_36px_rgba(0,0,0,0.86)] xl:text-[1.14rem]">
                              {card.title}
                            </h3>
                            <button
                              type="button"
                              onClick={() => openHeroService(card)}
                              className="relative z-10 mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300 [text-shadow:0_6px_16px_rgba(0,0,0,0.85)] transition-colors duration-300 hover:text-white"
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

                  <div className="flex flex-wrap items-stretch gap-3 pt-1">
                    <Button type="button" onClick={() => setIsSchedulingOpen(true)} className="hero-cta-primary h-auto min-h-[56px] justify-center gap-3 whitespace-normal rounded-[1.15rem] border border-cyan-200/35 px-6 py-3 text-sm font-semibold uppercase leading-tight tracking-[0.04em] text-white">
                      <Calendar className="h-5 w-5" />
                      Quero me inscrever agora
                    </Button>
                    <Button asChild className="hero-cta-secondary h-auto min-h-[56px] max-w-[420px] justify-center gap-3 whitespace-normal rounded-[1.15rem] border border-blue-300/25 px-6 py-3 text-sm font-medium normal-case leading-snug text-white">
                      <Link to="/vsl-evento">
                        <ArrowRight className="h-4 w-4" />
                        <span>Ainda não vou entrar agora, mas quero ver todos os detalhes da plataforma.</span>
                        <span>Não poderei estar nessa data, mas gostaria de saber mais sobre a Revela Talentos</span>
                        <span className="hidden">
                        Não poderei participar nessa data, mas gostaria de saber.
                        </span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="order-1 hidden w-full max-w-[460px] sm:block lg:order-2 lg:justify-self-end">
                <div className="group relative mx-auto max-w-[360px] overflow-hidden rounded-[1.8rem] border border-white/12 bg-[#05070b]/80 shadow-[0_34px_96px_rgba(0,0,0,0.55),0_0_30px_rgba(14,165,233,0.12)] backdrop-blur-sm sm:mx-0 sm:max-w-[460px] sm:rounded-[2rem]">
                  <div className="absolute inset-[1px] rounded-[calc(1.8rem-1px)] border border-white/6 sm:rounded-[calc(2rem-1px)]" />
                  <video
                    ref={desktopHeroVideoRef}
                    autoPlay
                    loop
                    muted={isHeroVideoMuted}
                    playsInline
                    className="aspect-[16/10] w-full object-cover object-center sm:aspect-[15/9] lg:aspect-[4/4.55] xl:aspect-[4/4.7]"
                  >
                    <source src="https://video.wixstatic.com/video/933cdd_d28be744cb8c4029b910896cf742e724/1080p/mp4/file.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.2),transparent_32%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,15,0.04)_0%,rgba(4,8,15,0.1)_42%,rgba(4,8,15,0.42)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent_0%,rgba(4,5,7,0.12)_26%,rgba(4,5,7,0.72)_100%)] shadow-[0_24px_48px_rgba(0,0,0,0.5)]" />
                  {isHeroVideoMuted && (
                    <button
                      type="button"
                      onClick={toggleHeroVideoAudio}
                      className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-black/45 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md transition-all duration-300 hover:border-cyan-200/40 hover:bg-black/60 hover:text-cyan-100 sm:bottom-5 sm:right-5"
                    >
                      <VolumeX className="h-4 w-4" />
                      <span>Ativar áudio</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div id="inscricao-revela" data-signup-target="true" className={`relative mt-3 space-y-4 rounded-[1.75rem] font-['Inter'] transition-[box-shadow,transform] duration-500 sm:mt-5 sm:space-y-5 lg:hidden ${isMobileViewport && isMobileHeroLocked ? 'hidden' : ''}`}>
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
                className="hero-service-mask relative -mx-1 hidden overflow-x-auto overflow-y-visible px-1 [--hero-gap:0.75rem] sm:mx-0 sm:block sm:px-0 sm:[--hero-gap:1.05rem] xl:[--hero-gap:1.25rem]"
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
                    className="group relative aspect-square w-[255px] shrink-0 snap-start overflow-hidden rounded-[2rem] bg-[#040507] text-left shadow-[0_32px_90px_rgba(0,0,0,0.42),0_0_30px_rgba(14,165,233,0.08)] transition-all duration-300 hover:-translate-y-1 sm:w-[292px] xl:w-[320px]"
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

              <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-stretch">
                <Button type="button" onClick={() => setIsSchedulingOpen(true)} className="hero-cta-primary h-auto min-h-[52px] w-full justify-center gap-3 whitespace-normal rounded-[1.15rem] border border-cyan-200/35 px-5 py-3 text-sm font-semibold uppercase leading-tight tracking-[0.04em] text-white sm:min-h-[58px] md:w-auto md:px-6 md:text-base">
                  <Calendar className="h-5 w-5" />
                  Quero me inscrever agora
                </Button>
                <Button asChild className="hero-cta-secondary h-auto min-h-[52px] w-full justify-center gap-3 whitespace-normal rounded-[1.15rem] border border-blue-300/25 px-5 py-3 text-sm font-medium normal-case leading-snug text-white sm:min-h-[58px] md:w-auto md:max-w-[560px] md:px-6 md:text-base">
                  <Link to="/vsl-evento">
                    <ArrowRight className="h-4 w-4" />
                    <span>Ainda não vou entrar agora, mas quero ver todos os detalhes da plataforma.</span>
                    <span>Não poderei estar nessa data, mas gostaria de saber mais sobre a Revela Talentos</span>
                    <span className="hidden">
                    Não poderei participar nessa data, mas gostaria de saber.
                    </span>
                  </Link>
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
          @keyframes hero-cta-primary-sheen {
            0% { transform: translateX(-140%) skewX(-18deg); opacity: 0; }
            18% { opacity: 0.82; }
            38% { transform: translateX(180%) skewX(-18deg); opacity: 0; }
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
            background: linear-gradient(135deg, rgba(11,238,255,0.98) 0%, rgba(29,78,216,0.96) 100%);
            animation: neon-pulse-cyan 2.15s ease-in-out infinite;
          }
          .hero-cta-primary::after {
            content: '';
            position: absolute;
            inset: -10% auto -10% -30%;
            width: 40%;
            background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.72) 48%, rgba(255,255,255,0) 100%);
            filter: blur(10px);
            opacity: 0;
            pointer-events: none;
            animation: hero-cta-primary-sheen 3.4s ease-in-out infinite;
          }
          .hero-cta-primary:hover {
            background: linear-gradient(135deg, rgba(57,243,255,1) 0%, rgba(37,99,235,1) 100%);
            transform: translateY(-1px);
          }
          .hero-cta-secondary {
            background: linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(30,64,175,0.9) 54%, rgba(37,99,235,0.95) 100%);
            animation: neon-pulse-blue 2.9s ease-in-out infinite;
          }
          .hero-cta-secondary span + span {
            display: none;
          }
          .hero-cta-secondary:hover {
            background: linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(37,99,235,0.96) 55%, rgba(56,189,248,0.92) 100%);
            transform: translateY(-1px);
          }
          .hero-cta-alert {
            background: linear-gradient(135deg, rgba(220,38,38,0.96) 0%, rgba(248,113,113,0.94) 100%);
            animation: neon-pulse-red 2.8s ease-in-out infinite;
          }
          .hero-cta-alert:hover {
            background: linear-gradient(135deg, rgba(239,68,68,1) 0%, rgba(251,113,133,0.96) 100%);
            transform: translateY(-1px);
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
                      Veja os detalhes do serviço e, se fizer sentido para sua família, siga para solicitar seu acesso à plataforma Revela Talentos.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="button"
                        onClick={handleHeroServiceSchedule}
                        className="hero-cta-primary h-12 rounded-[1.05rem] border border-cyan-200/35 px-6 text-sm font-semibold text-white"
                      >
                        Quero acessar agora
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
              <Badge className="w-fit border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-300">Solicitação de acesso</Badge>
              <DialogTitle className="text-2xl font-black tracking-tight text-white sm:text-[2rem]">Garanta seu acesso à plataforma Revela Talentos</DialogTitle>
              <DialogDescription className="max-w-xl text-sm leading-6 text-white/70 sm:text-[15px]">Preencha nome completo, WhatsApp e e-mail para receber o contato da nossa equipe com os próximos passos para entrar na plataforma.</DialogDescription>
            </DialogHeader>

            <form className="mt-6 space-y-4" onSubmit={handleScheduleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="school-partner-full-name" className="text-white/86">Nome completo</Label>
                  <Input id="school-partner-full-name" value={scheduleForm.full_name} onChange={(e) => handleScheduleFieldChange("full_name", e.target.value)} placeholder="Seu nome completo" autoComplete="name" className="h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/35" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school-partner-phone" className="text-white/86">WhatsApp</Label>
                  <Input id="school-partner-phone" value={scheduleForm.phone} onChange={(e) => handleScheduleFieldChange("phone", e.target.value)} placeholder="(11) 99999-9999" autoComplete="tel" inputMode="numeric" className="h-12 border-white/12 bg-white/[0.04] text-white placeholder:text-white/35" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school-partner-email" className="text-white/86">E-mail</Label>
                  <Input id="school-partner-email" type="email" value={scheduleForm.email} onChange={(e) => handleScheduleFieldChange("email", e.target.value)} placeholder="voce@exemplo.com" autoComplete="email" className="h-12 border-white/12 bg_white/[0.04] text-white placeholder:text-white/35" />
                </div>
              </div>
              <DialogFooter className="gap-3 border-t border-white/10 pt-5 sm:justify-between sm:space-x-0">
                <p className="text-xs leading-5 text-white/45">Ao enviar, seus dados entram na base da Revela Talentos para que nossa equipe apresente a plataforma e os próximos passos do seu acesso.</p>
                <Button type="submit" disabled={isSubmittingSchedule} className="hero-cta-submit h-12 min-w-[180px] rounded-[1.05rem] border border-violet-300/20 px-6 text-sm font-semibold text-white">{isSubmittingSchedule ? "Enviando..." : "Solicitar acesso"}</Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* 1. SOCIAL PROOF MARQUEE */}
      <MainLandingCarousel eyebrow="/ Nossa Estrutura Global" title="CONEXÕES EUROPEIAS E NACIONAIS" description="A metodologia da Revela Talentos já levou centenas de atletas a oportunidades exclusivas nos maiores centros de excelência do mundo." onCardClick={scrollToSignupCta} />

      {/* BENEFÍCIOS REVELA TALENTOS */}
      <BeneficiosRevelaTalentos />

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
            <h2 className="mb-4 text-[2rem] font-bold sm:text-4xl md:text-5xl">O Que Dizem as <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Famílias</span></h2>
            <p className="text-gray-400">Pais e atletas que já enxergam mais clareza, disciplina e direção na jornada esportiva.</p>
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
            <p className="text-gray-400">O que você precisa saber antes de entrar na plataforma Revela Talentos.</p>
          </div>
          <div className="space-y-4">{faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}</div>
        </div>
      </section>

      <StatsSection accentClass={accentClass} />

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#040507] py-10 sm:py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row">
          <img src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" alt="Revela Talentos" className="h-8 w-auto opacity-80" />
          <p className="text-gray-600 text-sm text-center">© {new Date().getFullYear()} Revela Talentos. Todos os direitos reservados.</p>
          <div className="flex gap-6 text-gray-600 text-sm">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
