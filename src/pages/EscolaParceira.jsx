import { useState, useEffect, useMemo, useRef } from "react";
import MainLandingCarousel from "../components/hub/MainLandingCarousel";
import BeneficiosRevelaTalentos from "../components/hub/BeneficiosRevelaTalentos";
import { Link } from "react-router-dom";
import { 
  Sparkles, Award, LineChart, Users, Rocket, 
  ChevronDown, ChevronUp, Play, ArrowRight,
  Star, Globe, BookOpen, Shield, Zap, Calendar, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// FAQs adaptadas para os Pais de Atletas
const faqs = [
  {
    q: "O que Ã© a nova parceria da escola com a Revela Talentos?",
    a: "Ã‰ uma uniÃ£o inovadora onde a escola passa a contar com a metodologia de desenvolvimento humano, esportivo e socioemocional da EC10 Talentos, potencializando o aprendizado e a descoberta das vocaÃ§Ãµes do seu filho dentro e fora das salas de aula."
  },
  {
    q: "Eu preciso pagar algo a mais por isso?",
    a: "NÃ£o. Como a instituiÃ§Ã£o do seu filho tornou-se uma Escola Parceira, os acessos bÃ¡sicos Ã s ferramentas educativas e Ã  jornada da Revela Talentos jÃ¡ estÃ£o inclusos e estruturados pelo colÃ©gio."
  },
  {
    q: "Como serÃ¡ a Live de LanÃ§amento com o Eric Cena?",
    a: "No dia 20/04, Eric Cena, nosso fundador, farÃ¡ uma apresentaÃ§Ã£o especial explicando todos os pilares da metodologia, os benefÃ­cios diretos para sua famÃ­lia e as novas oportunidades que seu filho terÃ¡ na escola."
  },
  {
    q: "Posso acessar a plataforma para acompanhar meu filho?",
    a: "Com certeza! A plataforma estimula a conexÃ£o famÃ­lia-escola, permitindo que os pais acompanhem de perto o engajamento esportivo, as mÃ©tricas de saÃºde e o desenvolvimento socioemocional."
  }
];

// benefits constant removed as it's now handled by BeneficiosRevelaTalentos component


const steps = [
  {
    num: "01",
    icon: Calendar,
    title: "Live de LanÃ§amento â€” Dia 20/04",
    desc: "Marque na sua agenda e assista ao evento oficial com Eric Cena. Descubra os detalhes impactantes dessa transformaÃ§Ã£o no ensino."
  },
  {
    num: "02",
    icon: User,
    title: "RecepÃ§Ã£o dos Acessos",
    desc: "A escola farÃ¡ a orientaÃ§Ã£o e distribuiÃ§Ã£o das credenciais de acesso para que os estudantes configurem seu perfil na EC10."
  },
  {
    num: "03",
    icon: Shield,
    title: "Acompanhe e Celebre",
    desc: "Veja a evoluÃ§Ã£o atravÃ©s dos novos treinos, mentorias em vÃ­deo, e capacitaÃ§Ãµes presentes no aplicativo."
  }
];

const testimonials = [
  {
    name: "MÃ£e do Matheus (14 anos)",
    school: "Escola Parceira",
    text: "Meu filho mudou radicalmente de postura em casa e nos estudos. A mentalidade que ele adotou agora Ã© de um verdadeiro atleta nota 10!",
    rating: 5,
    avatar: "M"
  },
  {
    name: "Pai da Sofia (12 anos)",
    school: "Escola Parceira",
    text: "Assistir as explicaÃ§Ãµes sobre a metodologia me deu imensa seguranÃ§a. Ter essa excelÃªncia junto ao colÃ©gio Ã© um projeto brilhante.",
    rating: 5,
    avatar: "P"
  },
  {
    name: "MÃ£e do Lucas (15 anos)",
    school: "Escola Parceira",
    text: "Saber que a escola forma meu filho nÃ£o somente como aluno, mas prepara o carÃ¡ter humano pro mundo real, nos dÃ¡ uma paz tremenda.",
    rating: 5,
    avatar: "M"
  }
];

// === DADOS E FUNÃ‡Ã•ES DE PROVAS SOCIAIS INJETADOS ===
const athleteSpotlights = {
  default: {
    eyebrow: '/ Atletas Revelados',
    highlight: 'DESENVOLVIMENTO',
    description: 'Atletas e alunos que jÃ¡ vÃªm sendo forjados por nossa metodologia desde a base atÃ© o exterior.',
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
  ['ROYAL CITY', 'Ãndia', 'https://static.wixstatic.com/media/933cdd_a60fbc26f42f402c9674ca2f869bbafe~mv2.jpeg'],
  ['AMERICA', 'Brasil', 'https://static.wixstatic.com/media/933cdd_14ccc273b64f4cabbe2e143c50b26878~mv2.png'],
];

const statsData = {
  statOneValue: '150+',
  statOneLabel: 'ATLETAS AGENCIADOS / REVELADOS',
  statOneText: 'Jovens em preparaÃ§Ã£o para oportunidades reais no Brasil e no exterior.',
  statOneImage: 'https://static.wixstatic.com/media/933cdd_5a8acbfba7eb428ca9a13031d12334db~mv2.jpg/v1/fill/w_450,h_600,al_c,q_80,enc_auto/933cdd_5a8acbfba7eb428ca9a13031d12334db~mv2.jpg',
  statTwoEyebrow: 'MERCADO INTERNACIONAL',
  statTwoValue: '+14',
  statTwoTitle: 'PAÃSES',
  statTwoCaption: 'ATIVOS AGORA',
  statTwoVideo: 'https://video.wixstatic.com/video/933cdd_eb14b07c4db843ac878f02fed62bb4c6/720p/mp4/file.mp4',
  countries: ['Espanha', 'Portugal', 'PolÃ´nia', 'EslovÃ¡quia', 'EUA'],
};

const heroPreviewCards = [
  {
    title: 'Disciplina',
    image: 'https://static.wixstatic.com/media/933cdd_5a8acbfba7eb428ca9a13031d12334db~mv2.jpg/v1/fill/w_450,h_600,al_c,q_80,enc_auto/933cdd_5a8acbfba7eb428ca9a13031d12334db~mv2.jpg',
  },
  {
    title: 'Performance',
    image: 'https://static.wixstatic.com/media/933cdd_bd442822567b47b89fba73ff96de5ef9~mv2.jpg',
  },
  {
    title: 'Visão',
    image: 'https://static.wixstatic.com/media/933cdd_57a7f61662d8485d876dfad0cd849b17~mv2.jpg',
  },
  {
    title: 'Estratégia',
    image: 'https://static.wixstatic.com/media/933cdd_7cc3cf595f684a1faec143ec04b34966~mv2.jpg',
  },
  {
    title: 'Futuro',
    image: 'https://static.wixstatic.com/media/933cdd_55eca19f9cf84b5da7f567431ebed772~mv2.jpg/v1/fill/w_448,h_600,al_c,lg_1,q_80,enc_auto/933cdd_55eca19f9cf84b5da7f567431ebed772~mv2.jpg',
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

            <div className="mt-8 flex flex-col gap-3 sm:flex-row font-['Inter']">
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
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-16 lg:grid-cols-5">
            {heroPreviewCards.map((card, index) => (
              <article
                key={card.title}
                className={`group relative aspect-[16/9] overflow-hidden bg-black/40 shadow-[0_18px_50px_rgba(0,0,0,0.45)] ${index === 0 ? 'ring-2 ring-cyan-300/80' : 'ring-1 ring-white/10'}`}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 px-3 py-2 font-['Inter']">
                  <p className="text-sm font-semibold tracking-wide text-white md:text-[15px]">
                    {card.title}
                  </p>
                </div>
              </article>
            ))}
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
        title="CONEXÃ•ES EUROPEIAS E NACIONAIS" 
        description="A metodologia que serÃ¡ integrada Ã  escola jÃ¡ levou centenas de atletas a oportunidades exclusivas nos maiores centros de excelÃªncia do mundo."
      />

      {/* DESAFIO DOS PAIS */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Badge className="bg-white/5 text-gray-400 border border-white/10 px-4 py-1.5 text-sm rounded-full mb-6">
            O CenÃ¡rio Atual
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Seu Filho EstÃ¡ Pronto para{" "}
            <span className={`bg-gradient-to-r ${accentGlow} bg-clip-text text-transparent`}>
              os Desafios Reais?
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-12">No mundo exigente de hoje, estudar Ã© metade do processo. A outra Ã© forjar uma mente inabalÃ¡vel para esportes e pra vida.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Como dar confianÃ§a para ele acreditar nos prÃ³prios talentos alÃ©m das telas e celulares?",
              "Como motivÃ¡-lo a manter dedicaÃ§Ã£o aos estudos alinhada com seus sonhos e paixÃµes e esporte?",
              "O que as grandes academias treinam na mente dos atletas de base e que pode ser trazido Ã  escola?"
            ].map((q, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-left hover:border-cyan-500/30 transition-all duration-300 hover:bg-white/[0.06]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-sm font-bold mb-4">{i + 1}</div>
                <p className="text-gray-300 leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÃCIOS REVELA TALENTOS (Cinematic Marquee) */}
      <BeneficiosRevelaTalentos />

      {/* 2. SOCIAL PROOF STATS */}
      <section className="py-12 md:py-20 relative z-10 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <span className={`mb-4 block font-mono text-xs uppercase tracking-[0.3em] ${accentClass}`}>/ Nossa ForÃ§a</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">NÃšMEROS QUE COMPROVAM</h2>
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

      {/* CRONOGRAMA */}
      <section id="como-funciona" className="py-24 relative bg-gradient-to-b from-[#040507] to-gray-950 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-1.5 text-sm rounded-full mb-6 relative z-10">
              Passos a Seguir
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 relative z-10">
              Tudo ComeÃ§a no Dia{" "}
              <span className={`bg-gradient-to-r ${accentGlow} bg-clip-text text-transparent`}>
                20 de Abril
              </span>
            </h2>
            <p className="text-gray-400 text-xl relative z-10">Como vai funcionar esta trajetÃ³ria inesquecÃ­vel para pais e alunos nas prÃ³ximas etapas.</p>
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
                        EvoluÃ§Ã£o
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

      {/* DEPOIMENTOS FAMÃLIA */}
      <section className="py-24 bg-[#040507]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              O Que Dizem os Pais{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Experientes
              </span>
            </h2>
            <p className="text-gray-400">FamÃ­lias que jÃ¡ vivenciam a metodologia de inteligÃªncia e disciplina.</p>
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
            Sua PresenÃ§a Ã©{" "}
            <span className={`bg-gradient-to-r ${accentGlow} bg-clip-text text-transparent`}>
              Fundamental!
            </span>
          </h2>
          <p className="text-gray-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            NÃ³s te esperamos nesta live reveladora onde Eric Cena mergulha nos projetos pensados para o seu filho. Preste atenÃ§Ã£o nas mensagens oficiais enviadas pela escola e nÃ£o perca!
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
            <p className="text-gray-400">O que vocÃª precisa saber antes do lanÃ§amento de 20/04.</p>
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
            Â© 2026 Revela Talentos & Escola Parceira. Todos os direitos reservados.
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
