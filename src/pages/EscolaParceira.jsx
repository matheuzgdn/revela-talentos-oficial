import { useState, useEffect, useMemo, useRef } from "react";
import MainLandingCarousel from "../components/hub/MainLandingCarousel";
import BeneficiosRevelaTalentos from "../components/hub/BeneficiosRevelaTalentos";
import { Link } from "react-router-dom";
import { 
  Sparkles, Award, LineChart, Users, Rocket, 
  ChevronDown, ChevronUp, Play, ArrowRight,
  Star, Globe, BookOpen, Shield, Zap, Calendar, User, Eye, MapPin, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

function isVideoMedia(value = '') {
  return /\.mp4($|\?)/i.test(value) || String(value).includes('/mp4/');
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border border-white/10 rounded-xl overflow-hidden transition-all duration-300 ${open ? 'bg-white/5' : 'bg-white/[0.02]'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left gap-4"
      >
        <span className="text-white font-medium text-lg">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-6 text-gray-300 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export default function EscolaParceira() {
  const [scrolled, setScrolled] = useState(false);
  
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

  const scrollTrack = (direction) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({
      left: direction * trackRef.current.clientWidth * 0.82,
      behavior: 'smooth',
    });
  };

  return (
    <div className="bg-[#040507] min-h-screen text-white overflow-x-hidden">
      {/* Background Effect globally */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(0,243,255,0.08),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%)]" />

      {/* STICKY HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative z-10">
          <Link to="/">
            <img src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" alt="Revela Talentos" className="h-10 w-auto" />
          </Link>
          <a href="#como-funciona">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold px-6 rounded-xl shadow-lg shadow-cyan-500/20 border-0">
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
            className="absolute inset-0 w-full h-full object-cover animate-cinematic-zoom opacity-55"
            style={{ pointerEvents: 'none' }}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-black/70 md:from-black/88 md:via-black/30 md:to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_45%,transparent_0%,rgba(0,0,0,0.12)_35%,rgba(0,0,0,0.62)_100%)]" />
          <div className="absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-black/85 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(37,99,235,0.16),transparent_28%),radial-gradient(circle_at_78%_25%,rgba(14,165,233,0.14),transparent_22%)]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100vh] w-full max-w-[1400px] flex-col justify-between px-6 pb-8 pt-28 md:px-10 md:pt-32 lg:px-14">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-4 font-['Inter']">
              <img
                src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png"
                alt="Revela Talentos"
                className="h-9 w-auto md:h-11"
              />
              <span className="border-l border-cyan-400/30 pl-4 text-base font-semibold uppercase tracking-[0.28em] text-cyan-300/90 md:text-lg">
                Escolas Parceiras
              </span>
            </div>

            <div className="space-y-5 font-['Inter']">
              <h1 className="max-w-3xl text-4xl font-extrabold uppercase tracking-tight text-white md:text-5xl lg:text-[3.45rem]">
                REVELA TALENTOS
              </h1>

              <p className="max-w-2xl text-base leading-7 text-white/88 md:text-[1.15rem] md:leading-8">
                Para os pais de atletas das nossas escolas parceiras, este é o momento de entender como a Revela Talentos pode fortalecer disciplina, confiança e visão de futuro no dia a dia dos seus filhos. Em uma apresentação com linguagem clara e impacto cinematográfico, você vai conhecer a metodologia, os benefícios da parceria e como essa jornada apoia o desenvolvimento esportivo, escolar e humano de cada aluno.
              </p>
            </div>

            <div className="mt-8 space-y-5 font-['Inter']">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <Button className="h-14 min-w-[168px] justify-center gap-3 rounded-none border-0 bg-white px-6 text-base font-semibold text-black shadow-[0_12px_35px_rgba(59,130,246,0.18)] hover:bg-white/90">
                    <Play className="h-5 w-5 fill-current" />
                    Assistir agora
                  </Button>
                </a>
                <Link to="/vsl-escola-parceira">
                  <Button className="h-14 min-w-[168px] justify-center gap-3 rounded-none border border-cyan-400/20 bg-[rgba(15,23,42,0.78)] px-6 text-base font-semibold text-white hover:bg-[rgba(30,41,59,0.92)]">
                    <span className="text-xl leading-none">+</span>
                    Minha lista
                  </Button>
                </Link>
              </div>

              <div className="flex max-w-[460px] items-center gap-4 rounded-[22px] border border-cyan-400/18 bg-[linear-gradient(135deg,rgba(15,23,42,0.88),rgba(8,47,73,0.52))] px-4 py-4 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-full bg-cyan-400/25 blur-md" />
                  <img
                    src="https://static.wixstatic.com/media/933cdd_1aef7b3f8c0742f787ce8be9ff553bb4~mv2.jpeg"
                    alt="Eric Cena"
                    className="relative h-14 w-14 rounded-full border border-white/20 object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
                    Apresentação Especial
                  </p>
                  <p className="mt-1 text-lg font-bold tracking-tight text-white">
                    Eric Cena
                  </p>
                  <p className="text-sm text-white/68">
                    Fundador da Revela Talentos e responsável pela live de lançamento.
                  </p>
                </div>
              </div>

              <div className="hero-icon-row flex flex-nowrap gap-3 overflow-x-auto pb-2 pr-2 font-['Inter']">
                {heroPreviewCards.map((card, index) => (
                  <div
                    key={card.title}
                    className={`flex shrink-0 items-center gap-2.5 rounded-full border px-3.5 py-2.5 backdrop-blur-xl ${index === 0 ? 'border-cyan-300/70 bg-[rgba(8,47,73,0.72)] text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.18)]' : 'border-white/12 bg-[rgba(15,23,42,0.62)] text-white/88 shadow-[0_10px_30px_rgba(0,0,0,0.2)]'}`}
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${index === 0 ? 'bg-cyan-400/14' : 'bg-white/8'}`}>
                      <card.icon className="h-4 w-4" strokeWidth={2.1} />
                    </div>
                    <span className="text-[13px] font-semibold tracking-wide whitespace-nowrap">
                      {card.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer">
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
            height: 160px;
            background: linear-gradient(180deg, transparent 0%, rgba(4,5,7,0.98) 100%);
            z-index: 2;
            pointer-events: none;
          }
        `}</style>
      </section>

      {/* 1. SOCIAL PROOF MARQUEE */}
      <MainLandingCarousel 
        eyebrow="/ Nossa Estrutura Global" 
        title="CONEXÕES EUROPEIAS E NACIONAIS" 
        description="A metodologia que será integrada à escola já levou centenas de atletas a oportunidades exclusivas nos maiores centros de excelência do mundo."
      />

      {/* DESAFIO DOS PAIS */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Badge className="bg-white/5 text-gray-400 border border-white/10 px-4 py-1.5 text-sm rounded-full mb-6">
            O Cenário Atual
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Seu Filho Está Pronto para{" "}
            <span className={`bg-gradient-to-r ${accentGlow} bg-clip-text text-transparent`}>
              os Desafios Reais?
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-12">No mundo exigente de hoje, estudar é metade do processo. A outra é forjar uma mente inabalável para esportes e pra vida.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Como dar confiança para ele acreditar nos próprios talentos além das telas e celulares?",
              "Como motivá-lo a manter dedicação aos estudos alinhada com seus sonhos, paixões e esporte?",
              "O que as grandes academias treinam na mente dos atletas de base e que pode ser trazido à escola?"
            ].map((q, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-left hover:border-cyan-500/30 transition-all duration-300 hover:bg-white/[0.06]">
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
      <section className="py-12 md:py-20 relative z-10 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className={`mb-4 block font-mono text-xs uppercase tracking-[0.3em] ${accentClass}`}>/ Nossa Força</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">NÚMEROS QUE COMPROVAM</h2>
          </div>
          <div className="grid max-w-6xl mx-auto grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Stat One */}
            <article className="relative flex h-[300px] flex-col justify-end overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0a0a0a] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:h-[390px] sm:rounded-[2rem] sm:p-6 md:h-[470px] md:p-10">
              <img src={statsData.statOneImage} alt="Atletas" className="absolute inset-0 h-full w-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040507] via-[#040507]/60 to-transparent" />
              <div className="relative z-10">
                <div className="mb-2 text-[2.7rem] font-black tracking-tighter text-white sm:text-6xl md:text-7xl">
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
            <article className="relative flex h-[300px] flex-col justify-end overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0a0a0a] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:h-[390px] sm:rounded-[2rem] sm:p-6 md:h-[470px] md:p-10">
              <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-55">
                <source src={statsData.statTwoVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-[#040507]/90 via-[#040507]/40 to-transparent" />
              <div className="relative z-10">
                <div className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-gray-300 sm:text-sm sm:tracking-[0.3em] md:text-base">
                  {statsData.statTwoEyebrow}
                </div>
                <div className="flex items-end gap-3">
                  <div className="text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">
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
      <section className="relative py-24 px-6 bg-[linear-gradient(180deg,#040507_0%,#07111f_48%,#040507_100%)] border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_26%),radial-gradient(circle_at_80%_30%,rgba(37,99,235,0.12),transparent_22%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl mb-12">
            <Badge className="bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 px-4 py-1.5 text-sm rounded-full mb-6">
              Oportunidades Abertas
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Oportunidades Dentro da{" "}
              <span className={`bg-gradient-to-r ${accentGlow} bg-clip-text text-transparent`}>
                Revela Talentos
              </span>
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">
              Conheça algumas oportunidades em destaque para atletas das escolas parceiras, com rotas abertas no Brasil e em mercados estratégicos da Europa.
            </p>
          </div>

          <div className="relative opportunities-carousel-mask">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#07111f] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#07111f] to-transparent" />

            <div className="opportunities-carousel-track flex w-max gap-6">
              {[...opportunitiesData, ...opportunitiesData].map((opportunity, index) => (
                <article
                  key={`${opportunity.title}-${opportunity.location}-${index}`}
                  aria-hidden={index >= opportunitiesData.length}
                  className={`group relative w-[250px] shrink-0 overflow-hidden rounded-[1.55rem] border bg-[rgba(5,10,18,0.92)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${index % opportunitiesData.length === 0 ? 'border-cyan-400/35' : 'border-white/10 hover:border-cyan-400/25'}`}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),transparent_42%)] opacity-70 pointer-events-none" />
                  <div className="absolute -right-3 top-1 text-[4.3rem] leading-none opacity-[0.12] saturate-150 pointer-events-none select-none">
                    {opportunity.flag}
                  </div>
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400/0 via-cyan-300/70 to-cyan-400/0 opacity-80" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
                        Aberta
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[rgba(8,47,73,0.28)] text-[1.35rem] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                        <span aria-hidden="true">{opportunity.flag}</span>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-200/75">
                          {opportunity.market}
                        </p>
                        <p className="text-xs text-white/55">
                          Plataforma Revela Talentos
                        </p>
                      </div>
                    </div>

                    <h3 className="mt-5 text-[1.65rem] font-black leading-[1.05] text-white">
                      {opportunity.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-3 text-[13px] text-white/70">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-cyan-300" />
                        {opportunity.location}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-gray-300">
                      {opportunity.teaser}
                    </p>

                    <a href="#" onClick={(e) => e.preventDefault()} className="mt-5 block">
                      <div className="flex items-center justify-between rounded-2xl border border-cyan-400/20 bg-[rgba(8,47,73,0.26)] px-4 py-3 text-sm font-semibold text-cyan-100 transition-all duration-300 group-hover:border-cyan-300/35 group-hover:bg-[rgba(8,47,73,0.34)]">
                        <span className="inline-flex items-center gap-3">
                          <Lock className="h-4 w-4" />
                          Ver oportunidade
                        </span>
                        <ArrowRight className="h-4 w-4" />
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
      <section id="como-funciona" className="py-24 relative bg-gradient-to-b from-[#040507] to-gray-950 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-1.5 text-sm rounded-full mb-6 relative z-10">
              Passos a Seguir
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 relative z-10">
              Tudo Começa no Dia{" "}
              <span className={`bg-gradient-to-r ${accentGlow} bg-clip-text text-transparent`}>
                20 de Abril
              </span>
            </h2>
            <p className="text-gray-400 text-xl relative z-10">Como vai funcionar esta trajetória inesquecível para pais e alunos nas próximas etapas.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-[2px] h-[calc(100%-96px)] bg-gradient-to-b from-cyan-500/50 to-transparent" />
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 hover:bg-white/[0.06] transition-all duration-300 z-10 relative">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-5xl font-black text-white/10">{step.num}</span>
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
      <section className="py-24 relative px-4 md:px-8 bg-gray-950 border-y border-white/5">
        <div className="container mx-auto">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <span className={`mb-4 block font-mono text-xs uppercase tracking-[0.3em] ${accentClass}`}>{spotlight.eyebrow}</span>
              <h2 className="text-[2rem] font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-4xl md:text-5xl">
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
      <section className="py-24 bg-[#040507]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              O Que Dizem os Pais{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Experientes
              </span>
            </h2>
            <p className="text-gray-400">Famílias que já vivenciam a metodologia de inteligência e disciplina.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-yellow-500/20 hover:bg-white/[0.06] transition-all duration-300">
                <div className="flex gap-1 mb-6">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed mb-6 text-lg italic">"{t.text}"</p>
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
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,229,255,0.1)_0%,_transparent_70%)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <Badge className="bg-red-500/20 text-red-500 border border-red-500/30 px-4 py-1.5 text-sm font-bold rounded-full mb-6">
            Dia 20 de Abril
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Sua Presença é{" "}
            <span className={`bg-gradient-to-r ${accentGlow} bg-clip-text text-transparent`}>
              Fundamental!
            </span>
          </h2>
          <p className="text-gray-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Nós te esperamos nesta live reveladora onde Eric Cena mergulha nos projetos pensados para o seu filho. Preste atenção nas mensagens oficiais enviadas pela escola e não perca!
          </p>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <Button className="h-16 px-12 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xl rounded-xl shadow-2xl shadow-red-500/30 transition-all duration-300 hover:-translate-y-1 border-0">
              <Calendar className="mr-3 w-6 h-6" /> Agendar Lembrete na Live
            </Button>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-950 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Perguntas Comuns</h2>
            <p className="text-gray-400">O que você precisa saber antes do lançamento de 20/04.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-[#040507] border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
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
