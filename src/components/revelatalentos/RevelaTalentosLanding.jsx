import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LazyImage, LazySection, LazyVideo } from '../ui/LazyMedia';
import { redirectToPlatformLogin } from '@/lib/auth-routing';
const CTA_LINK = "https://ec10talentos.wixsite.com/website-10/_paylink/AZ5ihGoP";
const WHATSAPP_LINK = `https://wa.me/553182331411?text=${encodeURIComponent("Quero saber mais sobre o plano de carreira da Revela Talentos.")}`;
const HERO_VIDEO_SRC = "https://video.wixstatic.com/video/933cdd_388c6e2a108d49f089ef70033306e785/720p/mp4/file.mp4";
const FAST_SCROLL_MEDIA_ROOT_MARGIN = "900px 0px";
const FAST_SCROLL_SECTION_ROOT_MARGIN = "720px 0px";
const BeneficiosRevelaTalentos = React.lazy(() => import('../hub/BeneficiosRevelaTalentos'));
const socialProofCases = [
  {
    name: "Theo e Luccas",
    club: "America Mineiro",
    media: "https://static.wixstatic.com/media/933cdd_cb57242b5d6a473cafa74fbdc70d897d~mv2.jpeg/v1/fill/w_600,h_437,al_c,q_80,enc_auto/933cdd_cb57242b5d6a473cafa74fbdc70d897d~mv2.jpeg",
    status: "Em destaque",
  },
  {
    name: "Destaque Cruzeiro",
    club: "Cruzeiro",
    media: "https://static.wixstatic.com/media/933cdd_55eca19f9cf84b5da7f567431ebed772~mv2.jpg/v1/fill/w_448,h_600,al_c,lg_1,q_80,enc_auto/933cdd_55eca19f9cf84b5da7f567431ebed772~mv2.jpg",
    status: "Base premium",
  },
  {
    name: "Arthur",
    club: "Inter de Limeira",
    media: "https://video.wixstatic.com/video/933cdd_6c1ddd2b23494c7db12be6d59cad2ceb/480p/mp4/file.mp4",
    status: "Scout ao vivo",
  },
  {
    name: "Cristofer",
    club: "SC Braga",
    media: "https://static.wixstatic.com/media/933cdd_bd442822567b47b89fba73ff96de5ef9~mv2.jpg/v1/fill/w_600,h_750,al_c,q_78,enc_auto/933cdd_bd442822567b47b89fba73ff96de5ef9~mv2.jpg",
    status: "Portugal",
  },
  {
    name: "Eduardo",
    club: "Estoril",
    media: "https://video.wixstatic.com/video/933cdd_c5ddcbf7072b4f6aa12e3dc225532342/720p/mp4/file.mp4",
    status: "Europa",
  },
  {
    name: "Juan",
    club: "Atletico de Madrid",
    media: "https://static.wixstatic.com/media/933cdd_57a7f61662d8485d876dfad0cd849b17~mv2.jpg/v1/fill/w_600,h_750,al_c,q_78,enc_auto/933cdd_57a7f61662d8485d876dfad0cd849b17~mv2.jpg",
    status: "Internacional",
  },
];

const isVideoMedia = (value = "") => /\.mp4($|\?)/i.test(value) || String(value).includes('/mp4/');
const getFlagUrl = (code = "") => `https://flagcdn.com/w640/${String(code).toLowerCase()}.png`;
const marketPresence = [
  {
    id: 1,
    name: "Brasil",
    label: "Seletivas presenciais e online",
    description: "Atletas são preparados, avaliados e conectados diretamente com clubes do Brasil.",
    flagCodes: ["BR"],
    position: { top: "61.5%", left: "37.5%" },
  },
  {
    id: 2,
    name: "América do Sul",
    label: "Rotas regionais ativas",
    description: "Conexões reais com clubes da América do Sul para ampliar a rota competitiva do atleta.",
    flagCodes: ["BR", "AR", "UY"],
    position: { top: "76.4%", left: "34.3%" },
  },
  {
    id: 3,
    name: "Europa",
    label: "Carreiras em euro",
    description: "Hoje, já temos diversos jogadores atuando em clubes europeus, construindo carreiras sólidas e recebendo em euro 💶.",
    flagCodes: ["PT", "ES", "PL"],
    position: { top: "28%", left: "48.5%" },
  },
  {
    id: 4,
    name: "Emirados Árabes",
    label: "Mercado internacional",
    description: "Oportunidades reais de internacionalização com estratégia profissional e conexão certa.",
    flagCodes: ["AE"],
    position: { top: "43%", left: "61.5%" },
  },
  {
    id: 5,
    name: "Ásia",
    label: "Expansão global",
    description: "Mercados ativos para atletas que querem sair do anonimato e entrar na rota certa.",
    flagCodes: ["JP", "KR", "SG"],
    position: { top: "46%", left: "76%" },
  },
];

const heroSignalCards = [
  {
    value: '150+',
    label: 'atletas revelados e agenciados',
  },
  {
    value: '+14',
    label: 'mercados ativos com rota real',
  },
  {
    value: 'Live',
    label: 'mentorias semanais e seletivas reais',
  },
];

const strategicPillars = [
  {
    title: 'Visibilidade que vende valor',
    description: 'Sua imagem deixa de parecer amadora e começa a gerar percepção profissional no mercado.',
  },
  {
    title: 'Preparação que sustenta pressão',
    description: 'Mente, seletivas e rotina entram em um fluxo mais claro para performar quando a chance aparece.',
  },
  {
    title: 'Mercado ativo para acelerar rota',
    description: 'Brasil, América do Sul, Emirados, Ásia e Europa conectados em uma mesma estrutura comercial.',
  },
];

const careerStructureCards = [
  {
    eyebrow: "Projeto real",
    title: "Da sorte para a estratégia.",
    media: "https://video.wixstatic.com/video/933cdd_508da8c819d846178e59499261f1d9dc/720p/mp4/file.mp4",
    summary: "A carreira deixa de ser tentativa isolada e começa a seguir um projeto profissional.",
    chips: ["Projeto real", "Direção", "Estratégia profissional"],
    paragraphs: [
      "Na Plataforma Revela Talentos, a sua carreira deixa de ser um sonho… e passa a ser um projeto real.",
      "Deixa de depender da sorte e começa a ser construída com estratégia profissional.",
      "Você deixa de ser apenas mais um jogador tentando chamar atenção sozinho e entra no caminho do futebol profissional, com acesso a oportunidades que a maioria nunca chega nem perto.",
    ],
  },
  {
    eyebrow: "Ambiente estruturado",
    title: "Preparação, avaliação e conexão.",
    media: "https://static.wixstatic.com/media/933cdd_cb57242b5d6a473cafa74fbdc70d897d~mv2.jpeg/v1/fill/w_600,h_437,al_c,q_80,enc_auto/933cdd_cb57242b5d6a473cafa74fbdc70d897d~mv2.jpeg",
    summary: "Você entra em um ambiente onde atletas são preparados, avaliados e conectados diretamente com clubes.",
    chips: ["Clubes", "Scout", "Conexão real"],
    paragraphs: [
      "Ao se tornar membro da nossa plataforma, você entra em um ambiente estruturado, onde atletas são preparados, avaliados e conectados diretamente com clubes do Brasil, América do Sul, Emirados Árabes, Ásia e Europa.",
      "E não é promessa vazia.",
      "Hoje, já temos diversos jogadores atuando em clubes europeus, construindo carreiras sólidas e recebendo em euro 💶 fruto de um processo sério, validado e que funciona.",
    ],
  },
  {
    eyebrow: "Próximo nível",
    title: "Oportunidade real na frente certa.",
    media: "https://static.wixstatic.com/media/933cdd_bd442822567b47b89fba73ff96de5ef9~mv2.jpg/v1/fill/w_760,h_900,al_c,q_78,enc_auto/933cdd_bd442822567b47b89fba73ff96de5ef9~mv2.jpg",
    summary: "Seletivas reais, observação profissional e testes presenciais em clubes da Europa.",
    chips: ["Seletivas", "Europa", "Oportunidade real"],
    paragraphs: [
      "Dentro da Revela Talentos, você participa de seletivas presenciais e online, sendo observado por profissionais e clubes que realmente contratam.",
      "E vai além:",
      "Você também terá acesso a testes presenciais em clubes da Europa, colocando você frente a frente com oportunidades reais de internacionalização da sua carreira.",
    ],
  },
];

const strategicModules = [
  {
    title: "Marketing esportivo profissional",
    eyebrow: "Visibilidade e posicionamento",
    media: "https://video.wixstatic.com/video/933cdd_dda817e38175467796a8ba4ae14b52bc/720p/mp4/file.mp4",
    chips: ["Imagem", "Valor percebido", "Posicionamento"],
    paragraphs: [
      "Porque a verdade é uma só:",
      "Ter talento não basta.",
      "Existem milhares de jogadores talentosos que nunca conseguem uma oportunidade porque não sabem como se vender, não sabem como se posicionar e não têm direcionamento profissional.",
      "Hoje, no futebol moderno, quem não sabe usar o marketing fica invisível.",
      "É exatamente isso que você recebe dentro da Revela Talentos.",
    ],
  },
  {
    title: "Mente forte para alto nível",
    eyebrow: "Mentorias semanais ao vivo",
    media: "https://static.wixstatic.com/media/933cdd_5a16fbb433bd42a9917cf902c77c69a3~mv2.jpg/v1/fill/w_270,h_600,al_c,lg_1,q_80,enc_auto/933cdd_5a16fbb433bd42a9917cf902c77c69a3~mv2.jpg",
    chips: ["Confiança", "Foco", "Disciplina"],
    paragraphs: [
      "Além disso, você terá acesso a mentorias semanais ao vivo, trabalhando um dos pilares mais importantes para um atleta de alto nível:",
      "a mente.",
      "Porque não adianta ter talento, força física e capacidade técnica se a mente estiver fraca, insegura e sem direção.",
      "Muitos atletas perdem oportunidades não por falta de futebol, mas por falta de mentalidade.",
      "Na Revela Talentos, você desenvolve confiança, foco, disciplina e preparo emocional para suportar a pressão e aproveitar as oportunidades quando elas aparecerem.",
    ],
  },
  {
    title: "Clube, scout e internacionalização",
    eyebrow: "Seletivas e testes",
    media: "https://video.wixstatic.com/video/933cdd_eb14b07c4db843ac878f02fed62bb4c6/720p/mp4/file.mp4",
    chips: ["Scout", "Testes", "Internacionalização"],
    paragraphs: [
      "E claro, além de toda essa preparação estratégica, você ainda participa de seletivas online e presenciais, onde poderá ser observado por clubes e profissionais do Brasil 🇧🇷, América do Sul, Emirados Árabes, Ásia e Europa.",
      "Essa é a oportunidade de sair do anonimato e entrar na rota de clubes que realmente podem transformar a sua carreira.",
      "E isso já está acontecendo.",
      "Hoje, já temos atletas atuando em clubes internacionais, construindo carreiras de sucesso e recebendo em moedas fortes como euro 💶, porque tiveram acesso ao suporte, à preparação e às oportunidades certas.",
    ],
  },
];

const fullCopyPanels = [
  {
    title: "O que muda quando você entra",
    eyebrow: "Projeto de carreira",
    paragraphs: [
      "Ao se tornar membro da nossa plataforma, você entra em um ambiente estruturado, onde atletas são preparados, avaliados e conectados diretamente com clubes do Brasil, América do Sul, Emirados Árabes, Ásia e Europa.",
      "Se você leva o futebol a sério, aqui é o seu próximo nível.",
      "E tem mais! Ao se tornar membro da plataforma, você entra para um ambiente onde sua carreira será trabalhada de forma estratégica, com visibilidade, posicionamento, preparação mental e oportunidades reais com clubes.",
    ],
  },
  {
    title: "Por que o marketing muda tudo",
    eyebrow: "Valor percebido",
    paragraphs: [
      "Se um atleta tentar contratar tudo isso por fora marketing esportivo, posicionamento digital, produção estratégica, mentoria e acesso a clubes, o custo é altíssimo, muitas vezes inviável.",
      "E mesmo assim, sem orientação, ele corre o risco de produzir conteúdo errado, se posicionar da maneira errada e continuar sem ser visto.",
      "Porque no final, o marketing esportivo existe para vender valor.",
      "E no caso do atleta, o objetivo é claro:",
      "vender sua imagem, valorizar seu passe e tornar sua carreira atrativa para clubes e empresários.",
      "Ao se tornar membro, você terá acesso a uma estrutura de marketing esportivo profissional, criada para posicionar você da forma correta, aumentar sua visibilidade e fazer com que sua carreira seja percebida como oportunidade real no mercado.",
    ],
  },
  {
    title: "Oportunidades que a maioria nem vê",
    eyebrow: "Rota internacional",
    paragraphs: [
      "Dentro da Revela Talentos, você participa de seletivas presenciais e online, sendo observado por profissionais e clubes que realmente contratam.",
      "Você também terá acesso a testes presenciais em clubes da Europa, colocando você frente a frente com oportunidades reais de internacionalização da sua carreira.",
      "Essa é a oportunidade de sair do anonimato e entrar na rota de clubes que realmente podem transformar a sua carreira.",
    ],
  },
  {
    title: "O que a Revela realmente entrega",
    eyebrow: "Estrutura completa",
    paragraphs: [
      "A Revela Talentos não entrega apenas testes.",
      "Entrega estrutura, posicionamento, preparação e oportunidade real.",
      "Se você quer continuar tentando sozinho, sem direção e disputando espaço no escuro, tudo continua igual.",
      "Mas se você quer acelerar sua carreira com estratégia e apoio profissional, esse é o caminho.",
    ],
  },
];

const faqItems = [
  {
    q: "A Revela Talentos entrega apenas testes?",
    a: "Não. A Revela Talentos não entrega apenas testes. Entrega estrutura, posicionamento, preparação e oportunidade real para que o atleta seja percebido como oportunidade real no mercado.",
  },
  {
    q: "Qual é a grande diferença da plataforma?",
    a: "A carreira deixa de depender da sorte e começa a ser construída com estratégia profissional, com marketing esportivo, mentorias ao vivo, preparação mental, seletivas online e presenciais e acesso a testes em clubes da Europa.",
  },
  {
    q: "A plataforma serve para quem quer internacionalização?",
    a: "Sim. O atleta entra em uma rota com oportunidades no Brasil, América do Sul, Emirados Árabes, Ásia e Europa, inclusive com testes presenciais em clubes europeus.",
  },
];

export default function RevelaTalentosLanding({ onLoginClick }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [openCopyPanel, setOpenCopyPanel] = useState(0);
  const [expandedLongText, setExpandedLongText] = useState({});
  const [eventoAtivo, setEventoAtivo] = useState(3);
  const [enableHeroVideo, setEnableHeroVideo] = useState(false);
  const [isMobilePerformanceMode, setIsMobilePerformanceMode] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 767px)').matches
  ));
  const carouselRef = useRef(null);
  const casesRef = useRef(null);
  const anchorRetryTimeoutsRef = useRef([]);

  const clearAnchorRetries = useCallback(() => {
    if (typeof window === 'undefined') return;
    anchorRetryTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    anchorRetryTimeoutsRef.current = [];
  }, []);

  const scrollToAnchorTarget = useCallback((targetId, { offset = 96 } = {}) => (event) => {
    event.preventDefault();

    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const alignToTarget = (behavior = prefersReducedMotion ? 'auto' : 'smooth') => {
      const target = document.getElementById(targetId);
      if (!target) return false;

      const absoluteTop = Math.max(window.scrollY + target.getBoundingClientRect().top - offset, 0);
      window.scrollTo({ top: absoluteTop, behavior });
      return true;
    };

    clearAnchorRetries();

    if (!alignToTarget()) {
      return;
    }

    const nextHash = `#${targetId}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
    }

    [180, 420, 760, 1150].forEach((delay, index) => {
      const timeoutId = window.setTimeout(() => {
        alignToTarget(index === 3 ? 'auto' : undefined);
      }, delay);

      anchorRetryTimeoutsRef.current.push(timeoutId);
    });
  }, [clearAnchorRetries]);

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);
  const toggleLongText = (key) => setExpandedLongText((prev) => ({ ...prev, [key]: !prev[key] }));
  const activeCopyPanel = fullCopyPanels[Math.max(openCopyPanel, 0)] || fullCopyPanels[0];
  const secondaryCopyParagraphs = activeCopyPanel.paragraphs.slice(1);
  const activeMarket = marketPresence.find((market) => market.id === eventoAtivo) || marketPresence[2];
  const mediaRootMargin = isMobilePerformanceMode ? '360px 0px' : FAST_SCROLL_MEDIA_ROOT_MARGIN;
  const sectionRootMargin = isMobilePerformanceMode ? '300px 0px' : FAST_SCROLL_SECTION_ROOT_MARGIN;

  const handleLoginClick = useCallback((event) => {
    event.preventDefault();

    if (onLoginClick) {
      onLoginClick();
      return;
    }

    redirectToPlatformLogin(window.location.href);
  }, [onLoginClick]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateMobileMode = () => setIsMobilePerformanceMode(mediaQuery.matches);

    updateMobileMode();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMobileMode);
      return () => mediaQuery.removeEventListener('change', updateMobileMode);
    }

    mediaQuery.addListener?.(updateMobileMode);

    return () => mediaQuery.removeListener?.(updateMobileMode);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isConstrainedNetwork = ['slow-2g', '2g', '3g'].includes(connection?.effectiveType);

    if (connection?.saveData || isConstrainedNetwork) {
      return undefined;
    }

    const preloadBenefits = () => import('../hub/BeneficiosRevelaTalentos').catch(() => {});
    const delay = window.innerWidth < 768 ? 2600 : 900;
    let idleId;

    const timeoutId = window.setTimeout(() => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(preloadBenefits, { timeout: 2400 });
        return;
      }

      preloadBenefits();
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      if (idleId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const isReducedMotion = Boolean(mediaQuery?.matches);
    const isMobileViewport = window.innerWidth < 768;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isConstrainedNetwork = ['slow-2g', '2g', '3g'].includes(connection?.effectiveType);

    if (isReducedMotion || connection?.saveData || isConstrainedNetwork) {
      return undefined;
    }

    const activateVideo = () => setEnableHeroVideo(true);

    if (isMobileViewport) {
      const timeoutId = window.setTimeout(activateVideo, 1400);
      return () => window.clearTimeout(timeoutId);
    }

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(activateVideo, { timeout: 2600 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(activateVideo, 1800);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const links = [
      { rel: 'preconnect', href: 'https://static.wixstatic.com' },
      { rel: 'preconnect', href: 'https://flagcdn.com' },
      { rel: 'dns-prefetch', href: 'https://static.wixstatic.com' },
      { rel: 'dns-prefetch', href: 'https://flagcdn.com' },
    ];

    const created = links
      .filter(({ rel, href }) => !document.head.querySelector(`link[rel="${rel}"][href="${href}"]`))
      .map(({ rel, href }) => {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
        return link;
      });

    return () => {
      created.forEach((link) => link.remove());
    };
  }, []);

  useEffect(() => {
    if (!enableHeroVideo) return undefined;

    const links = [
      { rel: 'preconnect', href: 'https://video.wixstatic.com' },
      { rel: 'dns-prefetch', href: 'https://video.wixstatic.com' },
    ];

    const created = links
      .filter(({ rel, href }) => !document.head.querySelector(`link[rel="${rel}"][href="${href}"]`))
      .map(({ rel, href }) => {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
        return link;
      });

    return () => {
      created.forEach((link) => link.remove());
    };
  }, [enableHeroVideo]);

  useEffect(() => {
    return () => {
      clearAnchorRetries();
    };
  }, [clearAnchorRetries]);

  useEffect(() => {
    function setupCarousel(trackEl, prevEl, nextEl, dotClass) {
      if (!trackEl || !prevEl || !nextEl) return;
      const getScrollAmount = () => {
        const card = trackEl.firstElementChild;
        if (!card) return 0;
        const gap = parseFloat(getComputedStyle(trackEl).gap) || 16;
        return card.offsetWidth + gap;
      };
      const dots = document.querySelectorAll(dotClass);
      const updateButtons = () => {
        prevEl.classList.toggle('opacity-0', trackEl.scrollLeft <= 0);
        prevEl.classList.toggle('pointer-events-none', trackEl.scrollLeft <= 0);
        const atEnd = trackEl.scrollLeft + trackEl.clientWidth >= trackEl.scrollWidth - 5;
        nextEl.classList.toggle('opacity-0', atEnd);
        nextEl.classList.toggle('pointer-events-none', atEnd);
        if (dots.length > 0) {
          const maxScroll = trackEl.scrollWidth - trackEl.clientWidth;
          const pct = maxScroll > 0 ? trackEl.scrollLeft / maxScroll : 0;
          const active = Math.min(Math.max(Math.round(pct * (dots.length - 1)), 0), dots.length - 1);
          dots.forEach((dot, i) => {
            dot.classList.toggle('bg-[#38bdf8]', i === active);
            dot.classList.toggle('shadow-[0_0_8px_rgba(56,189,248,0.8)]', i === active);
            dot.classList.toggle('w-5', i === active);
            dot.classList.toggle('bg-slate-800', i !== active);
            dot.classList.toggle('w-3', i !== active);
          });
        }
      };
      const handleNextClick = () => trackEl.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      const handlePrevClick = () => trackEl.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      const initialUpdateId = window.setTimeout(updateButtons, 100);

      nextEl.addEventListener('click', handleNextClick);
      prevEl.addEventListener('click', handlePrevClick);
      trackEl.addEventListener('scroll', updateButtons);
      window.addEventListener('resize', updateButtons);
      return () => {
        window.clearTimeout(initialUpdateId);
        nextEl.removeEventListener('click', handleNextClick);
        prevEl.removeEventListener('click', handlePrevClick);
        trackEl.removeEventListener('scroll', updateButtons);
        window.removeEventListener('resize', updateButtons);
      };
    }
    const cleanup1 = setupCarousel(
      document.getElementById('carouselTrack'),
      document.getElementById('prevBtn'),
      document.getElementById('nextBtn'),
      '.pagination-dot'
    );
    const cleanup2 = setupCarousel(
      document.getElementById('casesTrack'),
      document.getElementById('prevCasesBtn'),
      document.getElementById('nextCasesBtn'),
      '.cases-dot'
    );
    return () => { cleanup1 && cleanup1(); cleanup2 && cleanup2(); };
  }, []);

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', sans-serif; }
        .atleta-ecossistema { offset-anchor: 10px 0px; animation: animation-path linear infinite; }
        .linha-1 { offset-path: path("M 10 20 h 79.5 q 5 0 5 5 v 30"); animation-duration: 5s; animation-delay: 1s; }
        .linha-2 { offset-path: path("M 180 10 h -69.7 q -5 0 -5 5 v 30"); animation-delay: 6s; animation-duration: 4s; }
        .linha-3 { offset-path: path("M 130 20 v 21.8 q 0 5 -5 5 h -10"); animation-delay: 4s; animation-duration: 6s; }
        .linha-4 { offset-path: path("M 170 80 v -21.8 q 0 -5 -5 -5 h -50"); animation-delay: 3s; animation-duration: 5s; }
        .linha-5 { offset-path: path("M 135 65 h 15 q 5 0 5 5 v 10 q 0 5 -5 5 h -39.8 q -5 0 -5 -5 v -20"); animation-delay: 2s; animation-duration: 6s; }
        .linha-6 { offset-path: path("M 94.8 95 v -36"); animation-delay: 3s; animation-duration: 4s; }
        .linha-7 { offset-path: path("M 88 88 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 14"); animation-delay: 1s; animation-duration: 5s; }
        .linha-8 { offset-path: path("M 30 30 h 25 q 5 0 5 5 v 6.5 q 0 5 5 h 20"); animation-delay: 5s; animation-duration: 3s; }
        @keyframes animation-path { 0% { offset-distance: 0%; } 100% { offset-distance: 100%; } }
        @keyframes blob { 0% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-50px) scale(1.1); } 66% { transform: translate(-20px,20px) scale(0.9); } 100% { transform: translate(0,0) scale(1); } }
        .animate-blob { animation: blob 8s infinite ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes shimmer-ray { 0% { transform: translateX(-150%) skewX(-15deg); } 40%, 100% { transform: translateX(200%) skewX(-15deg); } }
        .animate-shimmer-ray { animation: shimmer-ray 5s infinite cubic-bezier(0.4,0,0.2,1); }
        @keyframes pulse-line { 0%, 100% { opacity: 0.3; transform: scaleX(0.9); } 50% { opacity: 1; transform: scaleX(1); } }
        .animate-pulse-line { animation: pulse-line 4s infinite ease-in-out; }
        .bg-tactical-grid { background-image: linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px); background-size: 30px 30px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @supports (content-visibility: auto) {
          .rt-deferred-section { content-visibility: auto; contain-intrinsic-size: var(--rt-contain-size); }
        }
        @media (max-width: 430px), (prefers-reduced-motion: reduce) {
          .rt-mobile-soften-effects .animate-blob,
          .rt-mobile-soften-effects .animate-ping,
          .rt-mobile-soften-effects .animate-pulse,
          .rt-mobile-soften-effects .animate-pulse-line { animation: none !important; }
          .rt-mobile-soften-effects [class*="blur-["] { filter: none !important; }
          .rt-mobile-soften-effects [class*="mix-blend"] { mix-blend-mode: normal !important; }
          .rt-mobile-soften-effects .backdrop-blur-md,
          .rt-mobile-soften-effects .backdrop-blur-xl { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
        }
      `}</style>

      <div className="rt-mobile-soften-effects antialiased bg-[#02040a] text-white overflow-x-hidden" style={{ fontFamily: "'Inter',sans-serif" }}>

        {/* 1. Hero Section */}
        <section className="relative min-h-screen flex items-center w-full overflow-hidden bg-[#02040a]">
          <div className="absolute top-[20%] left-[10%] w-48 h-48 md:w-72 md:h-72 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[80px] md:blur-[100px] animate-blob z-0 pointer-events-none"></div>
          <div className="absolute top-[40%] right-[5%] md:right-[10%] w-64 h-64 md:w-96 md:h-96 bg-[#38bdf8]/20 rounded-full mix-blend-screen filter blur-[100px] md:blur-[120px] animate-blob animation-delay-2000 z-0 pointer-events-none"></div>
          <div className="absolute inset-0 z-0">
            {enableHeroVideo ? (
              <LazyVideo
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                src={HERO_VIDEO_SRC}
                className="absolute inset-x-0 top-[15vh] h-full w-full object-cover object-center opacity-[0.72] md:inset-0 md:opacity-[0.42]"
              />
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.58)_0%,rgba(2,6,23,0.66)_42%,rgba(2,6,23,0.9)_100%)] md:bg-[linear-gradient(90deg,rgba(2,6,23,0.97)_0%,rgba(2,6,23,0.88)_44%,rgba(2,6,23,0.36)_100%)]"></div>
            <div className="absolute inset-x-0 top-0 z-10 h-[43%] bg-[linear-gradient(180deg,#020617_0%,rgba(2,6,23,0.96)_54%,rgba(2,6,23,0)_100%)] pointer-events-none md:hidden"></div>
            <div className="absolute inset-x-0 top-[37%] bottom-0 z-10 bg-[linear-gradient(180deg,rgba(2,6,23,0.1)_0%,rgba(2,6,23,0.4)_34%,rgba(2,6,23,0.78)_100%)] pointer-events-none md:hidden"></div>
            <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-[#02040a]/92 via-[#02040a]/68 to-transparent pointer-events-none z-10 md:from-[#02040a] md:via-[#02040a]/95"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-[#02040a] pointer-events-none z-10"></div>
            <div className="absolute inset-0 bg-tactical-grid z-0 opacity-50"></div>
          </div>
          <header className="absolute top-0 left-0 w-full z-30 px-6 py-5 sm:px-10 lg:px-16 flex justify-between items-center bg-gradient-to-b from-[#020617]/90 to-transparent">
            <a href="#" onClick={handleLoginClick} className="ml-auto text-[13px] md:text-sm font-bold bg-gradient-to-r from-sky-600/90 to-blue-500/90 hover:from-sky-500 hover:to-blue-400 text-white border border-sky-400/50 hover:border-sky-200 transition-all duration-300 px-6 py-2 md:px-8 md:py-2.5 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.7)] flex items-center gap-2 transform hover:-translate-y-0.5 relative overflow-hidden group">
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shimmer-ray"></div>
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
              Entrar
            </a>
          </header>
          <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-36 pb-12 sm:px-10 md:pt-40 lg:px-16 lg:pt-44 lg:pb-12">
            <div className="max-w-[760px]">
              <h1 className="text-[40px] leading-none sm:text-5xl md:text-[58px] font-normal tracking-tight text-white drop-shadow-[0_12px_30px_rgba(2,6,23,0.5)] uppercase">
                REVELA TALENTOS<span className="text-xl md:text-2xl align-super text-[#38bdf8]">&trade;</span>
              </h1>
              <h2 className="mt-4 text-[11px] sm:text-xs font-bold tracking-[0.18em] text-[#38bdf8] uppercase">
                Plataforma de carreira para atletas
              </h2>
              <div className="mt-7 flex flex-wrap items-center gap-2.5 text-[10px] sm:text-[11px] text-sky-100/70">
                <span>Mercados ativos em</span>
                <span className="rounded-full border border-sky-500/30 bg-sky-950/30 px-3 py-1 font-medium tracking-wide text-sky-100 shadow-[0_0_10px_rgba(14,165,233,0.1)]">BRASIL</span>
                <span className="rounded-full border border-sky-500/30 bg-sky-950/30 px-3 py-1 font-medium tracking-wide text-sky-100 shadow-[0_0_10px_rgba(14,165,233,0.1)]">EUROPA</span>
                <span className="rounded-full border border-sky-500/30 bg-sky-950/30 px-3 py-1 font-medium tracking-wide text-sky-100 shadow-[0_0_10px_rgba(14,165,233,0.1)]">ÁSIA</span>
              </div>
              <div className="mt-6 flex items-center space-x-2.5">
                <span className="text-xl font-bold text-white tracking-tight">150+</span>
                <div className="flex items-center gap-0.5 text-[#38bdf8] drop-shadow-[0_0_5px_rgba(56,189,248,0.5)]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[12px] sm:text-sm text-sky-100/70">atletas revelados / agenciados</span>
                <a href="#casesTrack" onClick={scrollToAnchorTarget('casesTrack')} className="text-[12px] sm:text-sm font-semibold underline text-[#38bdf8] hover:text-sky-300 transition-colors underline-offset-2">
                  Ver provas sociais
                </a>
              </div>
              <div className="mt-6 mb-5">
                <div className="text-[30px] leading-[1.02] sm:text-[38px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-300 tracking-tight drop-shadow-[0_8px_22px_rgba(2,6,23,0.88)]">
                  Na Plataforma Revela Talentos, a sua carreira deixa de ser um sonho… e passa a ser um projeto real.
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] sm:text-sm">
                  <span className="font-bold text-[#38bdf8]">+14 países ativos agora</span>
                  <span className="text-sky-100/60">Brasil, América do Sul, Emirados Árabes, Ásia e Europa</span>
                </div>
                <div className="text-[13px] sm:text-[15px] text-sky-100/82 mt-4 leading-[1.9] max-w-2xl drop-shadow-[0_6px_18px_rgba(2,6,23,0.9)]">Deixa de depender da sorte e começa a ser construída com estratégia profissional. Você deixa de ser apenas mais um jogador tentando chamar atenção sozinho e entra no caminho do futebol profissional, com acesso a oportunidades que a maioria nunca chega nem perto.</div>
              </div>
              <a href="#oferta-preco" onClick={scrollToAnchorTarget('oferta-preco')} className="w-full sm:max-w-[340px] flex justify-center relative overflow-hidden group bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white text-[15px] sm:text-[16px] font-bold py-3.5 px-6 rounded-xl mt-2 mb-8 sm:mb-10 transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(14,165,233,0.4)] border border-sky-400/30">
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shimmer-ray"></div>
                Quero entrar agora
              </a>
              <div className="max-w-3xl">
                <div className="grid gap-4 sm:grid-cols-3">
                {heroSignalCards.map((signal, index) => (
                  <div key={index} className="border-t border-sky-500/25 pt-4">
                    <div className="text-2xl sm:text-[1.9rem] font-black text-white tracking-tight">{signal.value}</div>
                    <div className="mt-2 text-[11px] sm:text-[12px] leading-relaxed uppercase tracking-[0.16em] text-sky-100/58">
                      {signal.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-[12px] sm:text-[13px] font-medium text-sky-100/78">
                {[
                  "Seletivas online",
                  "Marketing esportivo profissional",
                  "Mentorias semanais ao vivo",
                  "Plano de carreira",
                  "Seletivas presenciais",
                  "Testes presenciais na Europa",
                ].map((label, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="h-[2px] w-5 bg-gradient-to-r from-[#38bdf8] to-transparent"></span>
                    <span>{label}</span>
                    </div>
                ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <LazySection
          className="rt-deferred-section"
          minHeight={960}
          rootMargin={sectionRootMargin}
          style={{ '--rt-contain-size': '1px 960px' }}
          placeholder={<div className="border-b border-white/5 bg-[#030305]" />}
        >
          <React.Suspense fallback={<div className="border-b border-white/5 bg-[#030305]" style={{ minHeight: 960 }} />}>
            <BeneficiosRevelaTalentos />
          </React.Suspense>
        </LazySection>

        {/* 3. Mercados Ativos */}
        <section
          className="rt-deferred-section bg-[#020617] py-16 md:py-24 relative w-full overflow-hidden border-t border-sky-900/30"
          style={{ '--rt-contain-size': '1px 1180px' }}
        >
          <div className="absolute top-[50%] left-[20%] w-64 h-64 bg-[#38bdf8]/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob z-0 pointer-events-none" />
          <div className="absolute bottom-[10%] right-[10%] w-48 h-48 bg-blue-700/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 z-0 pointer-events-none" />

          <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
            <div className="mb-10 grid grid-cols-1 gap-6 md:mb-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div className="max-w-3xl">
                <h4 className="inline-flex text-[9px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-[#38bdf8] mb-3 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] border border-sky-500/30 px-3 py-1 rounded bg-sky-900/20 backdrop-blur-sm">
                  Mercados ativos
                </h4>
                <h2 className="mb-3 text-3xl font-black uppercase tracking-tight text-white drop-shadow-lg md:text-4xl lg:text-[42px] lg:leading-[1.02]">
                  Clubes, scouts e mercados onde a sua carreira começa a circular
                </h2>
                <p className="max-w-3xl text-[13px] font-medium text-sky-100/70 md:text-[15px]">
                  Ao se tornar membro da nossa plataforma, você entra em um ambiente estruturado, onde atletas são preparados, avaliados e conectados diretamente com clubes do Brasil, América do Sul, Emirados Árabes, Ásia e Europa.
                </p>
              </div>
              <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,28,0.45),rgba(5,10,18,0.82))] p-5 shadow-[0_24px_70px_rgba(2,6,23,0.36)] backdrop-blur-xl md:p-6">
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#38bdf8]">Ambiente estruturado</div>
                <p className="mt-4 text-[14px] leading-[1.9] text-sky-100/76 md:text-[15px]">
                  Você entra em um ecossistema pensado para transformar exposição em oportunidade real, com conexão ativa entre seletivas, observação profissional e rotas internacionais.
                </p>
                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {['14+ mercados ativos', 'Scouts e clubes reais', 'Toque no mapa e explore as rotas'].map((item) => (
                    <div key={item} className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-3 text-[11px] font-semibold text-white/78">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative mb-8 w-full aspect-[1.12/1] group sm:mb-10 sm:aspect-[1.55/1] lg:mb-14 lg:aspect-[2/1]">
              <div className="absolute inset-0 bg-[#050508] border border-cyan-500/20 rounded-3xl shadow-[0_0_50px_rgba(0,243,255,0.05)] overflow-hidden">
                <div className="absolute inset-0 opacity-40 pointer-events-none transition-opacity duration-700 group-hover:opacity-60 flex items-center justify-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    className="h-full w-full object-contain drop-shadow-[0_0_8px_rgba(0,243,255,0.3)]"
                    style={{ filter: 'invert(1) sepia(1) saturate(5) hue-rotate(175deg) brightness(0.5) contrast(2)' }}
                  />
                </div>
              </div>

              {marketPresence.map((mercado) => {
                const isBottomHalf = parseFloat(mercado.position.top) > 50;
                return (
                  <div
                    key={mercado.id}
                    className={`absolute flex flex-col items-center transition-all duration-300 ${eventoAtivo === mercado.id ? 'z-50' : 'z-20'}`}
                    style={{ top: mercado.position.top, left: mercado.position.left, transform: 'translate(-50%, -50%)' }}
                  >
                    <button
                      type="button"
                      aria-label={`Ver mercado ${mercado.name}`}
                      onMouseEnter={() => setEventoAtivo(mercado.id)}
                      onFocus={() => setEventoAtivo(mercado.id)}
                      onClick={() => setEventoAtivo(mercado.id)}
                      className="relative flex items-center justify-center"
                    >
                      <div className={`absolute rounded-full bg-[#00f3ff]/20 transition-all duration-300 ${eventoAtivo === mercado.id ? 'h-12 w-12 md:h-14 md:w-14' : 'h-10 w-10 md:h-12 md:w-12'} animate-ping`} />
                      <div className={`absolute rounded-full bg-[#00f3ff]/40 transition-all duration-300 ${eventoAtivo === mercado.id ? 'h-6 w-6 md:h-7 md:w-7' : 'h-5 w-5 md:h-6 md:w-6'} animate-pulse`} />
                      <svg className={`relative text-[#00f3ff] drop-shadow-[0_0_10px_rgba(0,243,255,1)] transition-transform duration-300 ${eventoAtivo === mercado.id ? 'h-7 w-7 scale-110 md:h-8 md:w-8' : 'h-6 w-6 md:h-7 md:w-7'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                    </button>

                    <div className={`
                      absolute hidden w-60 p-1 transition-all duration-300 ease-out lg:block
                      ${isBottomHalf ? 'bottom-full mb-4 origin-bottom' : 'top-full mt-4 origin-top'}
                      ${eventoAtivo === mercado.id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                    `}>
                      <div className="relative bg-[#050505]/90 backdrop-blur-md border border-[#00f3ff]/40 rounded-xl p-4 shadow-[0_4px_30px_rgba(0,243,255,0.15)]">
                        {isBottomHalf
                          ? <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-gradient-to-t from-[#00f3ff] to-transparent" />
                          : <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-gradient-to-b from-[#00f3ff] to-transparent" />
                        }
                        <h3 className="text-[#00f3ff] font-bold text-base tracking-wide">{mercado.name}</h3>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 mb-2">{mercado.label}</p>
                        <p className="text-sm text-gray-300 leading-relaxed">{mercado.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mb-5 rounded-[1.7rem] border border-cyan-500/20 bg-[linear-gradient(180deg,rgba(8,15,28,0.72),rgba(4,9,18,0.9))] p-5 shadow-[0_18px_45px_rgba(2,6,23,0.34)] backdrop-blur-xl lg:hidden">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#38bdf8]">Mercado em foco</div>
                  <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">{activeMarket.name}</h3>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/72">
                  {activeMarket.label}
                </span>
              </div>
              <p className="mt-4 text-[14px] leading-[1.85] text-sky-100/72">{activeMarket.description}</p>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:max-w-6xl md:grid-cols-2 md:overflow-visible xl:grid-cols-5">
              {marketPresence.map((mercado) => (
                <div
                  key={`list-${mercado.id}`}
                  className={`group relative min-w-[78vw] overflow-hidden rounded-[1.7rem] border p-5 backdrop-blur-md transition-all duration-300 sm:min-w-[46vw] md:min-w-0 ${eventoAtivo === mercado.id ? 'border-[#00f3ff]/60 bg-[#07111f]/90 shadow-[0_0_30px_rgba(0,243,255,0.18)]' : 'border-cyan-500/20 bg-[#050505]/80 hover:border-[#00f3ff]/35 hover:shadow-[0_18px_45px_rgba(2,6,23,0.55)]'}`}
                  onClick={() => setEventoAtivo(mercado.id)}
                  onMouseEnter={() => setEventoAtivo(mercado.id)}
                >
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 flex">
                      {mercado.flagCodes.map((code, flagIndex) => (
                        <div key={`${mercado.id}-bg-${flagIndex}`} className="relative h-full flex-1 overflow-hidden">
                          <LazyImage
                            src={getFlagUrl(code)}
                            alt=""
                            rootMargin={mediaRootMargin}
                            className="absolute inset-0 h-full w-full object-cover opacity-35 transition-transform duration-700 group-hover:scale-110"
                            style={{ transform: `scale(1.22) translateY(${flagIndex === 0 ? '-2%' : flagIndex % 2 === 0 ? '4%' : '0%'})` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.38)_0%,rgba(2,6,23,0.75)_42%,rgba(2,6,23,0.96)_100%)]"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.88)_0%,rgba(2,6,23,0.58)_38%,rgba(2,6,23,0.86)_100%)]"></div>
                    <div className="absolute right-0 top-0 h-24 w-24 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_72%)]"></div>
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.88))]"></div>
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-[radial-gradient(circle_at_bottom,rgba(56,189,248,0.12),transparent_72%)] opacity-80"></div>
                  </div>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#38bdf8]">{mercado.label}</div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42 md:hidden">Toque para focar</span>
                  </div>
                  <h3 className="relative z-10 text-lg font-black text-white uppercase tracking-tight">{mercado.name}</h3>
                  <p className="relative z-10 mt-3 text-sm leading-relaxed text-sky-100/70">{mercado.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Estrutura Estratégica */}
        <section
          className="rt-deferred-section relative w-full bg-[#020617] overflow-hidden border-t border-sky-900/30"
          style={{ '--rt-contain-size': '1px 2200px' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.12),transparent_30%)]"></div>
          <div className="relative z-10 max-w-[1300px] mx-auto px-5 sm:px-8 md:px-12 py-16 md:py-24 space-y-14 md:space-y-20">
            <div className="max-w-4xl">
              <span className="inline-flex items-center rounded-full border border-sky-500/30 bg-sky-900/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#38bdf8]">
                Plano de carreira premium
              </span>
              <h2 className="mt-5 text-3xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-5xl">
                Revela Talentos, onde jogadores deixam de ser promessas e começam a se tornar profissionais de verdade.
              </h2>
              <p className="mt-6 max-w-3xl text-[14px] md:text-[16px] leading-[1.95] text-sky-100/80">
                Se você leva o futebol a sério, aqui é o seu próximo nível. A sua carreira passa a ter direção, visibilidade, preparação mental e oportunidades reais com clubes.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              {strategicPillars.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,28,0.54),rgba(4,9,18,0.9))] p-5 shadow-[0_20px_55px_rgba(2,6,23,0.26)] backdrop-blur-xl"
                >
                  <div className="mb-3 inline-flex rounded-full border border-sky-500/20 bg-sky-950/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#38bdf8]">
                    Pilar {index + 1}
                  </div>
                  <h3 className="text-[18px] font-black uppercase tracking-tight text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-[1.85] text-sky-100/72 md:text-[15px]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-16 md:space-y-20">
              {careerStructureCards.map((card, index) => {
                const longTextKey = `career-${index}`;
                const isExpanded = !!expandedLongText[longTextKey];
                const hasHiddenParagraphs = card.paragraphs.length > 2;
                const visibleParagraphs = isExpanded ? card.paragraphs : card.paragraphs.slice(0, 2);

                return (
                <article key={index} className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8 md:gap-10 items-center">
                  <div className={`${index % 2 === 1 ? 'lg:order-2' : ''} relative min-h-[340px] md:min-h-[430px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#06101d]/70 shadow-[0_28px_80px_rgba(2,6,23,0.54)]`}>
                    {isVideoMedia(card.media) ? (
                      <LazyVideo
                        autoPlay
                        loop
                        muted
                        playsInline
                        src={card.media}
                        rootMargin={mediaRootMargin}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <LazyImage
                        src={card.media}
                        alt={card.title}
                        rootMargin={mediaRootMargin}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.32)_34%,rgba(2,6,23,0.94)_100%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.24),transparent_34%)]"></div>
                    <div className="absolute top-5 left-5 rounded-full border border-sky-400/25 bg-sky-950/35 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[#38bdf8] backdrop-blur-sm">
                      {card.eyebrow}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                      <div className="max-w-md rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,28,0.2),rgba(5,10,18,0.84))] p-5 backdrop-blur-md">
                        <h3 className="text-[26px] md:text-[30px] font-black uppercase tracking-tight text-white leading-[0.95]">
                          {card.title}
                        </h3>
                        <p className="mt-3 text-[13px] md:text-[15px] leading-relaxed text-sky-100/72">
                          {card.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#38bdf8] mb-3">{card.eyebrow}</div>
                    <h3 className="text-[30px] md:text-[40px] font-black uppercase tracking-tight text-white leading-[0.95]">
                      {card.title}
                    </h3>
                    <p className="mt-4 text-[15px] md:text-[18px] leading-[1.8] text-sky-100/78 max-w-2xl">
                      {card.summary}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {card.chips.map((chip, chipIndex) => (
                        <span key={chipIndex} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/68">
                          {chip}
                        </span>
                      ))}
                    </div>
                    <div className="mt-7 space-y-4">
                      {visibleParagraphs.map((paragraph, idx) => (
                        <div key={idx} className="pl-4 border-l border-sky-500/20">
                          <p className="text-sm md:text-[15px] leading-[1.9] text-sky-100/70">{paragraph}</p>
                        </div>
                      ))}
                    </div>
                    {hasHiddenParagraphs && (
                      <button
                        type="button"
                        onClick={() => toggleLongText(longTextKey)}
                        className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#38bdf8] transition-colors hover:text-white"
                      >
                        {isExpanded ? 'Mostrar menos' : 'Mostrar mais'}
                        <svg className={`h-3.5 w-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                    )}
                  </div>
                </article>
                );
              })}
            </div>

            <div className="space-y-14 md:space-y-16">
              <article className="grid grid-cols-1 lg:grid-cols-[1.02fr_0.98fr] gap-8 md:gap-10 items-center">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#38bdf8] mb-3">{strategicModules[0].eyebrow}</div>
                  <h3 className="text-[30px] md:text-[42px] font-black uppercase tracking-tight text-white leading-[0.95]">
                    {strategicModules[0].title}
                  </h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {strategicModules[0].chips.map((chip, chipIndex) => (
                      <span key={chipIndex} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/68">
                        {chip}
                      </span>
                    ))}
                  </div>
                  {(() => {
                    const longTextKey = 'module-0';
                    const isExpanded = !!expandedLongText[longTextKey];
                    const hasHiddenParagraphs = strategicModules[0].paragraphs.length > 2;
                    const visibleParagraphs = isExpanded ? strategicModules[0].paragraphs : strategicModules[0].paragraphs.slice(0, 2);

                    return (
                      <>
                  <div className="mt-6 space-y-4">
                    {visibleParagraphs.map((paragraph, idx) => (
                      <p key={idx} className="text-sm md:text-[15px] leading-[1.9] text-sky-100/70">{paragraph}</p>
                    ))}
                  </div>
                        {hasHiddenParagraphs && (
                          <button
                            type="button"
                            onClick={() => toggleLongText(longTextKey)}
                            className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#38bdf8] transition-colors hover:text-white"
                          >
                            {isExpanded ? 'Mostrar menos' : 'Mostrar mais'}
                            <svg className={`h-3.5 w-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="m6 9 6 6 6-6" />
                            </svg>
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>
                <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#06101d]/70 shadow-[0_24px_70px_rgba(2,6,23,0.54)]">
                  <LazyVideo
                    autoPlay
                    loop
                    muted
                    playsInline
                    src={strategicModules[0].media}
                    rootMargin={mediaRootMargin}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.04),rgba(2,6,23,0.28)_30%,rgba(2,6,23,0.92)_100%)]"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,28,0.18),rgba(5,10,18,0.82))] p-5 backdrop-blur-md">
                      <p className="text-sm md:text-[15px] leading-relaxed text-sky-100/76">
                        Ao se tornar membro, você terá acesso a uma estrutura de marketing esportivo profissional, criada para posicionar você da forma correta, aumentar sua visibilidade e fazer com que sua carreira seja percebida como oportunidade real no mercado.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                {strategicModules.slice(1).map((module, index) => {
                  const longTextKey = `module-${index + 1}`;
                  const isExpanded = !!expandedLongText[longTextKey];
                  const hasHiddenParagraphs = module.paragraphs.length > 2;
                  const visibleParagraphs = isExpanded ? module.paragraphs : module.paragraphs.slice(0, 2);

                  return (
                  <article key={index} className="grid grid-cols-1 gap-5 items-start">
                    <div className="relative min-h-[280px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#06101d]/70 shadow-[0_20px_60px_rgba(2,6,23,0.48)]">
                      {isVideoMedia(module.media) ? (
                        <LazyVideo
                          autoPlay
                          loop
                          muted
                          playsInline
                          src={module.media}
                          rootMargin={mediaRootMargin}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <LazyImage
                          src={module.media}
                          alt={module.title}
                          rootMargin={mediaRootMargin}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.32)_35%,rgba(2,6,23,0.94)_100%)]"></div>
                      <div className="absolute top-4 left-4 rounded-full border border-sky-400/25 bg-sky-950/35 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[#38bdf8] backdrop-blur-sm">
                        {module.eyebrow}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[28px] md:text-[34px] font-black uppercase tracking-tight text-white leading-[0.95]">
                        {module.title}
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {module.chips.map((chip, chipIndex) => (
                          <span key={chipIndex} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/68">
                            {chip}
                          </span>
                        ))}
                      </div>
                      <div className="mt-5 space-y-4">
                        {visibleParagraphs.map((paragraph, idx) => (
                          <p key={idx} className="text-sm md:text-[15px] leading-[1.9] text-sky-100/70">{paragraph}</p>
                        ))}
                      </div>
                      {hasHiddenParagraphs && (
                        <button
                          type="button"
                          onClick={() => toggleLongText(longTextKey)}
                          className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#38bdf8] transition-colors hover:text-white"
                        >
                          {isExpanded ? 'Mostrar menos' : 'Mostrar mais'}
                          <svg className={`h-3.5 w-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="m6 9 6 6 6-6" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Success Cases Section */}
        <section
          className="rt-deferred-section bg-[#020617] py-16 md:py-24 relative w-full z-20 select-none overflow-hidden border-t border-sky-900/30"
          style={{ '--rt-contain-size': '1px 980px' }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-blue-600/10 rounded-full mix-blend-screen filter blur-[100px] md:blur-[150px] animate-blob z-0 pointer-events-none"></div>
          <div className="w-full max-w-[1600px] mx-auto relative z-10">
            <div className="mb-8 md:mb-14 px-5 sm:px-8 md:px-12 lg:px-16 max-w-[1300px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h4 className="text-[9px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-[#38bdf8] mb-2 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">Métricas Comprovadas</h4>
                <h2 className="text-2xl md:text-4xl font-black text-white flex items-center uppercase tracking-tight">
                  Transferências Concluídas
                  <svg className="w-5 h-5 md:w-8 md:h-8 ml-2 md:ml-3 text-[#38bdf8] mt-1 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </h2>
                <p className="mt-3 max-w-2xl text-[13px] leading-[1.85] text-sky-100/68 md:text-[15px]">
                  Casos reais para mostrar que a plataforma não vende só narrativa. Existe rota, existe conexão e existe histórico de movimentação profissional.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold text-sky-100/72 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.8)]"></span>
                Arraste para ver mais casos
              </div>
            </div>
            <div className="relative w-full group">
              <button id="prevCasesBtn" className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-[#0f172a]/90 backdrop-blur-md border border-sky-500/30 rounded-full items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:border-[#38bdf8] cursor-pointer hidden md:flex">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <div id="casesTrack" className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-5 sm:px-8 md:px-12 lg:px-16 pb-8 md:pb-12 pt-2 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                {socialProofCases.map((item, i) => (
                  <article key={`${item.name}-${i}`} className="group/card relative w-[76vw] max-w-[300px] flex-none aspect-[4/5] snap-start overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/40 shadow-[0_25px_90px_rgba(0,0,0,0.35)] transition-all duration-500 hover:border-[#38bdf8]/60 hover:shadow-[0_0_32px_rgba(56,189,248,0.24)] sm:w-[290px] md:w-[300px] md:rounded-[2rem]">
                    {isVideoMedia(item.media) ? (
                      <LazyVideo
                        src={item.media}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="none"
                        rootMargin={mediaRootMargin}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                      />
                    ) : (
                      <LazyImage
                        src={item.media}
                        alt={`${item.name} - ${item.club}`}
                        rootMargin={mediaRootMargin}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/58 to-black/10"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_45%)] opacity-80"></div>
                    <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-5 md:p-6">
                      <div className="flex justify-end">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm">
                          {item.status}
                        </span>
                      </div>
                      <div className="relative">
                        <div className="absolute left-0 bottom-1 h-10 md:h-12 w-1 md:w-1.5 bg-[#38bdf8] shadow-[0_0_14px_rgba(56,189,248,0.8)]"></div>
                        <p className="pl-4 md:pl-5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
                          {item.club}
                        </p>
                        <h3 className="mt-3 pl-4 md:pl-5 text-[1.7rem] sm:text-[1.9rem] md:text-3xl font-black uppercase leading-[0.95] tracking-tight text-white drop-shadow-md group-hover/card:text-sky-300 transition-colors">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <button id="nextCasesBtn" className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-[#0f172a]/90 backdrop-blur-md border border-sky-500/30 rounded-full items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:border-[#38bdf8] cursor-pointer hidden md:flex">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
            <div className="flex justify-center space-x-1.5 mt-2 relative z-10">
              {[true, false, false].map((a, i) => <div key={i} className={`h-[3px] rounded-full cases-dot transition-colors duration-300 ${a ? 'w-5 md:w-6 bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.8)]' : 'w-3 md:w-4 bg-slate-800'}`}></div>)}
            </div>
          </div>
        </section>

        {/* 6. Manifesto Completo */}
        <section
          className="rt-deferred-section bg-[#020617] py-16 md:py-24 relative w-full overflow-hidden border-t border-sky-900/30"
          style={{ '--rt-contain-size': '1px 880px' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.1),transparent_35%),linear-gradient(180deg,#020617_0%,#02040a_100%)]"></div>
          <div className="max-w-[1300px] mx-auto px-5 sm:px-8 md:px-12 relative z-20">
            <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.4rem] border border-sky-500/20 bg-[linear-gradient(180deg,rgba(4,9,18,0.86),rgba(3,7,15,0.72))] shadow-[0_30px_90px_rgba(2,6,23,0.68)]">
              <div className="absolute inset-0">
                <LazyImage
                  src="https://static.wixstatic.com/media/933cdd_57a7f61662d8485d876dfad0cd849b17~mv2.jpg/v1/fill/w_900,h_900,al_c,q_78,enc_auto/933cdd_57a7f61662d8485d876dfad0cd849b17~mv2.jpg"
                  alt="Revela Talentos internacional"
                  rootMargin={mediaRootMargin}
                  className="absolute right-0 top-0 h-full w-full object-cover opacity-[0.26] md:w-[46%]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.92)_0%,rgba(2,6,23,0.8)_42%,rgba(2,6,23,0.56)_100%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_28%)]"></div>
              </div>

              <div className="relative z-10 border-b border-white/10 px-4 py-4 md:px-7 md:py-5">
                <div className="grid gap-2 sm:grid-cols-2">
                  {fullCopyPanels.map((panel, index) => {
                    const isActive = openCopyPanel === index;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setOpenCopyPanel(index)}
                        className={`rounded-[1.1rem] border px-4 py-3 text-left transition-all duration-300 ${isActive ? 'border-[#38bdf8]/45 bg-[#07111f]/46 shadow-[0_0_18px_rgba(56,189,248,0.1)]' : 'border-white/8 bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.03]'}`}
                      >
                        <h3 className="text-[11px] font-black uppercase leading-tight tracking-[0.16em] text-white md:text-[13px]">
                          {panel.title}
                        </h3>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[0.78fr_1.22fr] gap-8 md:gap-12 px-5 py-8 md:px-8 md:py-10">
                <div className="h-fit lg:sticky lg:top-24">
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#38bdf8]">
                    {activeCopyPanel.eyebrow}
                  </div>
                  <div className="mt-4 max-w-[12ch] text-[2rem] font-black uppercase leading-[0.95] tracking-tight text-white md:text-[3.2rem]">
                    {activeCopyPanel.title}
                  </div>
                  <div className="mt-6 h-px w-24 bg-gradient-to-r from-[#38bdf8] to-transparent"></div>
                  <p className="mt-7 max-w-xl text-[15px] leading-[1.9] text-sky-100/84 md:text-[19px]">
                    {activeCopyPanel.paragraphs[0]}
                  </p>
                </div>

                <div className="space-y-0 border-l border-white/10 pl-0 lg:pl-8">
                  {(secondaryCopyParagraphs.length > 0 ? secondaryCopyParagraphs : activeCopyPanel.paragraphs).map((paragraph, idx) => (
                    <div key={idx} className="border-b border-white/10 py-5 first:pt-0 last:border-b-0 last:pb-0">
                      <p className="max-w-3xl text-[14px] leading-[1.9] text-sky-100/78 md:text-[17px]">
                        {paragraph}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FAQ Section */}
        <section
          className="rt-deferred-section bg-[#02040a] py-16 md:py-32 relative w-full"
          style={{ '--rt-contain-size': '1px 720px' }}
        >
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-[#38bdf8]/10 rounded-full mix-blend-screen filter blur-[100px] md:blur-[150px] animate-blob z-0 pointer-events-none"></div>
          <div className="max-w-[800px] mx-auto px-5 sm:px-8 relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <h4 className="text-[9px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-[#38bdf8] mb-3 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">Perguntas importantes</h4>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-tight uppercase tracking-tight">O que você precisa saber antes de entrar</h2>
            </div>
            <div className="space-y-3 md:space-y-4">
              {faqItems.map((faq, i) => (
                <div key={i} className="border border-sky-900/40 bg-[#0f172a]/50 rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-[#38bdf8]/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.1)]">
                  <button className="flex items-center justify-between w-full p-4 md:p-6 text-left text-white focus:outline-none group" onClick={() => toggleFaq(i)}>
                    <span className="font-bold text-[13px] sm:text-[16px] tracking-wide pr-4">{faq.q}</span>
                    <div className="p-1 rounded-full bg-sky-900/30 group-hover:bg-[#38bdf8]/20 transition-colors shrink-0">
                      <svg className={`w-4 h-4 md:w-5 md:h-5 text-[#38bdf8] transform transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </div>
                  </button>
                  {openFaq === i && <div className="px-4 md:px-6 pb-4 md:pb-6 text-[12px] md:text-sm text-sky-100/70 leading-relaxed font-medium border-t border-sky-900/30 pt-3 md:pt-4 mt-1 md:mt-2">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Final CTA Section */}
        <section
          className="rt-deferred-section bg-[#020617] py-16 md:py-32 relative w-full overflow-hidden border-t border-sky-900/30"
          style={{ '--rt-contain-size': '1px 860px' }}
        >
          <div className="absolute top-0 inset-x-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent animate-pulse-line"></div>
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute left-[8%] top-[18%] h-48 w-48 rounded-full bg-[#38bdf8]/10 blur-[90px] md:h-72 md:w-72 md:blur-[120px]"></div>
            <div className="absolute right-[10%] bottom-[8%] h-56 w-56 rounded-full bg-blue-600/15 blur-[95px] md:h-80 md:w-80 md:blur-[130px]"></div>
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-5">
            <div className="relative overflow-hidden rounded-[2.3rem] border border-sky-500/20 bg-[linear-gradient(135deg,rgba(3,8,18,0.98),rgba(4,10,20,0.9))] shadow-[0_30px_90px_rgba(2,6,23,0.62)]">
              <div className="absolute inset-0">
                <LazyImage
                  src="https://static.wixstatic.com/media/933cdd_55eca19f9cf84b5da7f567431ebed772~mv2.jpg/v1/fill/w_448,h_600,al_c,lg_1,q_80,enc_auto/933cdd_55eca19f9cf84b5da7f567431ebed772~mv2.jpg"
                  alt="Atleta Revela Talentos"
                  rootMargin={mediaRootMargin}
                  className="absolute right-0 top-0 hidden h-full w-[38%] object-cover opacity-[0.14] lg:block"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.99)_0%,rgba(2,6,23,0.94)_44%,rgba(2,6,23,0.88)_68%,rgba(2,6,23,0.72)_100%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_28%)]"></div>
                <div className="absolute inset-y-0 left-[54%] hidden w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block"></div>
              </div>

              <div className="relative z-10 grid grid-cols-1 gap-8 px-5 py-7 md:px-10 md:py-10 lg:grid-cols-2 lg:items-start lg:gap-12">
                <div className="lg:pr-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/35 px-3 py-1.5 backdrop-blur-sm">
                    <div className="h-2 w-2 rounded-full bg-[#00f3ff] shadow-[0_0_12px_rgba(0,243,255,0.9)]"></div>
                    <span className="text-[9px] md:text-[10px] font-bold text-[#38bdf8] tracking-[0.22em] uppercase">Decisão</span>
                  </div>

                  <h2 className="mt-6 max-w-[11ch] text-[1.9rem] font-black leading-[0.98] tracking-tight text-white sm:text-[2.6rem] md:text-[3.35rem]">
                    Se você quer acelerar sua carreira com estratégia e apoio profissional,
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] via-[#38bdf8] to-sky-200"> esse é o caminho.</span>
                  </h2>

                  <div className="mt-6 max-w-xl space-y-4">
                    <p className="text-[14px] leading-[1.9] text-sky-100/76 md:text-[16px]">
                      Se você quer continuar tentando sozinho, sem direção e disputando espaço no escuro, tudo continua igual.
                    </p>
                    <p className="text-[14px] leading-[1.9] text-sky-100/54 md:text-[16px]">
                      Mas se você quer algo diferente...
                    </p>
                    <p className="border-l border-[#38bdf8]/35 pl-4 text-[15px] font-semibold leading-[1.75] text-white/92 md:text-[18px]">
                      Revela Talentos — onde jogadores deixam de ser promessas e começam a se tornar
                      <span className="text-[#00f3ff]"> profissionais de verdade.</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-center lg:pl-2">
                  <div id="oferta-preco" className="relative w-full overflow-hidden rounded-[2.1rem] border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(8,15,28,0.68),rgba(4,9,18,0.94))] p-5 shadow-[0_30px_90px_rgba(2,6,23,0.52)] backdrop-blur-xl scroll-mt-24 md:p-7">
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute left-1/2 top-0 h-24 w-40 -translate-x-1/2 bg-[#00f3ff]/10 blur-[38px]"></div>
                      <div className="absolute right-[-10%] top-[22%] h-36 w-36 rounded-full bg-[#2563eb]/14 blur-[58px]"></div>
                      <div className="absolute left-[-10%] bottom-[12%] h-28 w-28 rounded-full bg-[#00f3ff]/10 blur-[52px]"></div>
                      <div className="absolute inset-x-8 top-[88px] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    </div>

                    <div className="relative z-10">
                      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {['Estratégia profissional', 'Seletivas reais', 'Mercado internacional'].map((item) => (
                          <div key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-100/70">
                            {item}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-950/35 px-3 py-1.5">
                          <div className="h-2 w-2 rounded-full bg-[#00f3ff] shadow-[0_0_12px_rgba(0,243,255,0.85)]"></div>
                          <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#7cecff]">Oferta anual</span>
                        </div>
                        <div className="rounded-full border border-emerald-400/20 bg-emerald-950/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300">
                          75% OFF
                        </div>
                      </div>

                      <div className="mt-7 rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] px-5 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-100/46">Investimento para entrar agora</div>
                        <div className="mt-4 flex items-start justify-center gap-1 text-white">
                          <span className="mt-2 text-lg font-bold text-sky-100/72">R$</span>
                          <span className="text-[3rem] md:text-[3.7rem] font-black tracking-[-0.04em] leading-none drop-shadow-[0_0_24px_rgba(0,243,255,0.2)]">297</span>
                          <span className="mt-2 text-xl font-black">,00</span>
                        </div>
                        <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-sky-100/40">pagamento anual</div>

                        <div className="mt-5 flex items-center justify-center gap-3">
                          <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/18"></span>
                          <span className="text-sm font-semibold text-white/28 line-through">de R$ 1.197,99</span>
                          <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/18"></span>
                        </div>

                        <div className="mt-4 inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-950/35 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.14)]">
                          Economize 75% - Oferta por tempo limitado
                        </div>
                      </div>

                      <a
                        href={CTA_LINK}
                        className="group relative mt-6 flex w-full justify-center overflow-hidden rounded-[1.1rem] border border-cyan-300/40 bg-gradient-to-r from-[#16d7ea] via-[#12c6ea] to-[#2d7cff] px-6 py-4 text-[14px] md:text-[16px] font-black uppercase tracking-[0.06em] text-[#02101e] shadow-[0_0_32px_rgba(17,211,232,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_48px_rgba(45,124,255,0.36)]"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_55%)] opacity-70"></div>
                        <div className="absolute top-0 -inset-full h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shimmer-ray"></div>
                        <span className="relative z-10">Quero me tornar membro agora</span>
                      </a>

                      <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-sky-100/52">
                        <div className="flex items-center gap-0.5 text-[#00f3ff]">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="h-3.5 w-3.5 drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                        <span>5.0 · 12.3mil avaliações</span>
                      </div>

                      <a
                        href={WHATSAPP_LINK}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#38bdf8] transition-colors hover:text-sky-300"
                      >
                        Falar com a equipe no WhatsApp
                      </a>

                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-center gap-2 text-[9px] md:text-[11px] font-semibold uppercase tracking-widest text-sky-100/34">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    Criptografia SSL 256-bit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Footer */}
        <footer
          className="rt-deferred-section bg-[#02040a] pt-12 md:pt-16 pb-8 relative w-full overflow-hidden border-t border-sky-900/30"
          style={{ '--rt-contain-size': '1px 420px' }}
        >
          <div className="max-w-[1300px] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-12 md:mb-16">
              <div className="lg:col-span-1">
                <div className="text-white font-black italic text-lg leading-[1.1] tracking-tighter mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#38bdf8] fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 3.14-2.14 4.14-.95.7-2.22.95-3.4.74-1.25-.22-2.34-1-3.04-2.07-.63-.97-.88-2.18-.58-3.32.32-1.2.1-2.48-.6-3.48l-.13-.18c2.16-1.5 5.06-1.63 7.37-.2 1.57.98 2.37 2.7 2.52 4.37z" /></svg>
                  <div><span>REVELA</span><br /><span className="text-[#38bdf8]">TALENTOS</span></div>
                </div>
                <p className="text-[12px] md:text-[13px] font-medium text-sky-100/60 leading-relaxed mb-6">Plataforma de carreira para atletas e famílias que querem preparação, posicionamento, marketing esportivo e oportunidades reais no futebol.</p>
                <div className="flex space-x-4">
                  {[
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />,
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />,
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />,
                  ].map((d, i) => (
                    <a key={i} href="#" className="text-sky-100/40 hover:text-[#38bdf8] transition-colors"><svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">{d}</svg></a>
                  ))}
                </div>
              </div>
              {[
                { title: "Plataforma", links: ["Plano de carreira", "Marketing esportivo", "Mentorias ao vivo"] },
                { title: "Oportunidades", links: ["Seletivas online", "Seletivas presenciais", "Testes na Europa"] },
                { title: "Suporte", links: ["Perguntas frequentes", "Falar com a equipe", "Privacidade"] },
              ].map((col, i) => (
                <div key={i}>
                  <h5 className="text-white font-bold mb-3 md:mb-4 tracking-wider text-[10px] md:text-[11px] uppercase text-sky-400">{col.title}</h5>
                  <ul className="space-y-2.5 md:space-y-3 text-[12px] md:text-[13px] font-medium text-sky-100/50">
                    {col.links.map((l, j) => <li key={j}><a href="#" className="hover:text-[#38bdf8] transition-colors relative group w-fit block"><span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#38bdf8] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>{l}</a></li>)}
                  </ul>
                </div>
              ))}
            </div>
            <div className="pt-6 md:pt-8 border-t border-sky-900/30 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] md:text-[11px] font-semibold tracking-wider uppercase text-sky-100/30">
              <p>&copy; 2026 Revela Talentos.</p>
              <div className="flex items-center space-x-2">
                <span>Powered by estratégia profissional</span>
                <svg className="w-3 h-3 text-[#38bdf8]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
