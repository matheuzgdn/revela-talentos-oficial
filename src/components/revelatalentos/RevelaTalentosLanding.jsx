import React, { useState, useEffect, useRef } from 'react';

export default function RevelaTalentosLanding({ onLoginClick }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [eventoAtivo, setEventoAtivo] = useState(null);
  const carouselRef = useRef(null);
  const casesRef = useRef(null);

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  useEffect(() => {
    function setupCarousel(trackEl, prevEl, nextEl, dotClass) {
      if (!trackEl || !prevEl || !nextEl) return;
      const getScrollAmount = () => {
        const card = trackEl.querySelector('div');
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
      nextEl.addEventListener('click', () => trackEl.scrollBy({ left: getScrollAmount(), behavior: 'smooth' }));
      prevEl.addEventListener('click', () => trackEl.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' }));
      trackEl.addEventListener('scroll', updateButtons);
      setTimeout(updateButtons, 100);
      window.addEventListener('resize', updateButtons);
      return () => {
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
      `}</style>

      <div className="antialiased bg-[#02040a] text-white overflow-x-hidden" style={{ fontFamily: "'Inter',sans-serif" }}>

        {/* 1. Hero Section */}
        <section className="relative min-h-screen flex items-center w-full overflow-hidden bg-[#02040a]">
          <div className="absolute top-[20%] left-[10%] w-48 h-48 md:w-72 md:h-72 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[80px] md:blur-[100px] animate-blob z-0 pointer-events-none"></div>
          <div className="absolute top-[40%] right-[5%] md:right-[10%] w-64 h-64 md:w-96 md:h-96 bg-[#38bdf8]/20 rounded-full mix-blend-screen filter blur-[100px] md:blur-[120px] animate-blob animation-delay-2000 z-0 pointer-events-none"></div>
          <div className="absolute inset-0 z-0">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center opacity-80 md:opacity-70">
              <source src="https://video.wixstatic.com/video/933cdd_6205df9cdfb1479cb5ff3dde437ec5ac/1080p/mp4/file.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-[#020617]/20 md:bg-gradient-to-r md:from-[#020617] md:via-[#020617]/90 md:to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-[#02040a] via-[#02040a]/95 to-transparent pointer-events-none z-10"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-[#02040a] pointer-events-none z-10"></div>
            <div className="absolute inset-0 bg-tactical-grid z-0 opacity-50"></div>
          </div>
          <header className="absolute top-0 left-0 w-full z-30 py-4 px-5 sm:px-8 lg:px-12 flex justify-between items-center bg-gradient-to-b from-[#020617]/90 to-transparent">
            <div className="hidden md:flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse shadow-[0_0_8px_#38bdf8]"></div>
              <span className="text-[10px] font-bold text-sky-400/70 tracking-[0.2em] uppercase">Sistema Ativo</span>
            </div>
            <a href="https://revelatalentos.com/login?from_url=https%3A%2F%2Frevelatalentos.com%2F" className="ml-auto text-[13px] md:text-sm font-bold bg-gradient-to-r from-sky-600/90 to-blue-500/90 hover:from-sky-500 hover:to-blue-400 text-white border border-sky-400/50 hover:border-sky-200 transition-all duration-300 px-6 py-2 md:px-8 md:py-2.5 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.7)] flex items-center gap-2 transform hover:-translate-y-0.5 relative overflow-hidden group">
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shimmer-ray"></div>
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
              Entrar
            </a>
          </header>
          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full pt-24 pb-12 lg:py-0 mt-8 lg:mt-0">
            <div className="max-w-[650px]">
              <h1 className="text-[40px] leading-none sm:text-5xl font-normal tracking-tight text-white mb-2 drop-shadow-lg">REVELA TALENTOS<span className="text-2xl align-super text-[#38bdf8]">&trade;</span></h1>
              <h2 className="text-[11px] sm:text-xs font-bold tracking-[0.15em] text-[#38bdf8] mb-6 md:mb-7 uppercase drop-shadow-md">Futuro do Futebol Ltda.</h2>
              <div className="flex items-center text-[10px] sm:text-[11px] text-sky-100/70 mb-4 space-x-2.5">
                <span>Disponível para</span>
                <span className="border border-sky-500/30 bg-sky-950/30 rounded-sm px-1.5 py-0.5 font-medium tracking-wide text-sky-100 shadow-[0_0_10px_rgba(14,165,233,0.1)]">iOS</span>
                <span className="border border-sky-500/30 bg-sky-950/30 rounded-sm px-1.5 py-0.5 font-medium tracking-wide text-sky-100 shadow-[0_0_10px_rgba(14,165,233,0.1)]">ANDROID</span>
              </div>
              <div className="flex items-center space-x-2.5 mb-6 md:mb-9">
                <span className="text-xl font-bold text-white tracking-tight">5.0</span>
                <div className="flex items-center space-x-0.5 text-[#38bdf8] drop-shadow-[0_0_5px_rgba(56,189,248,0.5)]">
                  {[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>)}
                </div>
                <span className="text-[12px] sm:text-sm text-sky-100/70">12.3mil</span>
                <a href="#" className="text-[12px] sm:text-sm font-semibold underline text-[#38bdf8] hover:text-sky-300 transition-colors underline-offset-2">Ler avaliações</a>
              </div>
              <div className="mb-5">
                <div className="flex items-baseline space-x-2 sm:space-x-3">
                  <span className="text-[32px] sm:text-[36px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-sky-200 tracking-tight">R$ 397,00 <span className="text-[16px] sm:text-[18px] font-medium text-sky-100/70">/ anual</span></span>
                  <span className="text-[15px] sm:text-[17px] font-medium text-sky-200/40 line-through">R$ 897,00</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] sm:text-sm">
                  <span className="font-bold text-[#38bdf8]">Economize 56%</span>
                  <span className="text-sky-100/60">A oferta termina em 10/01/2027</span>
                </div>
                <div className="text-[11px] sm:text-[13px] text-sky-100/40 mt-1 sm:mt-0.5">Menor preço nos últimos 30 dias: R$ 897,00</div>
              </div>
              <a href="https://ec10talentos.wixsite.com/website-10/_paylink/AZyWWUK_" className="w-full sm:max-w-[340px] flex justify-center relative overflow-hidden group bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white text-[15px] sm:text-[16px] font-bold py-3.5 px-6 rounded-xl mt-2 mb-8 sm:mb-10 transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(14,165,233,0.4)] border border-sky-400/30">
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shimmer-ray"></div>
                Comprar agora
              </a>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-6 text-[12px] sm:text-[13px] font-medium text-sky-100/80 max-w-2xl">
                {[
                  { icon: <><path d="M12 13v8" /><path d="m4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="m8 17 4 4 4-4" /></>, label: "Conteúdo Offline" },
                  { icon: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></>, label: "Análise de Desempenho" },
                  { icon: <><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></>, label: "Treinamento Exclusivo" },
                  { icon: <><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></>, label: "Relatórios para Olheiros" },
                  { icon: <><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></>, label: "Compatível com Dispositivos Móveis" },
                  { icon: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>, label: "Integração com Clubs" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center space-x-3 group cursor-default">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-[#38bdf8] group-hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
                    <span className="group-hover:text-white transition-colors">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Video Carousel Section */}
        <section className="bg-[#020617] py-12 md:py-16 relative w-full select-none">
          <div className="absolute top-0 inset-x-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent animate-pulse-line"></div>
          <div className="relative z-10 flex justify-end mb-6 pr-5 sm:pr-8 md:pr-12 lg:pr-16 w-full max-w-[1600px] mx-auto">
            <div className="flex items-center space-x-3 bg-[#0f172a]/80 backdrop-blur-md p-1.5 md:p-2 rounded-lg border border-sky-500/20 shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
              <div className="bg-sky-900/30 rounded flex flex-col items-center justify-center w-8 h-8 md:w-10 md:h-10 leading-none">
                <span className="font-bold text-[#38bdf8] text-[13px] md:text-[15px]">+8</span>
              </div>
              <div className="text-sky-100/60 text-[9px] md:text-[11px] leading-tight flex flex-col justify-center pr-2">
                <span className="text-white font-medium tracking-wide uppercase">Classificação</span>
                <span>Linguagem (8)</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 w-full group max-w-[1600px] mx-auto">
            <button id="prevBtn" className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-[#0f172a]/90 backdrop-blur-md border border-sky-500/30 rounded-full items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:border-[#38bdf8] cursor-pointer hidden md:flex">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <div id="carouselTrack" className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-5 sm:px-8 md:px-12 lg:px-16 pb-6 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              {[
                { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg02taTda0G1gdxEXwBg4BtjsdYj9KBUraoQ&s", title: "SELETIVA\nONLINE", alt: "Seletiva Online" },
                { img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop", title: "PLANO DE\nCARREIRA", alt: "Plano de Carreira" },
                { img: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop", title: "PLANO\nNACIONAL", alt: "Plano Nacional" },
                { img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop", title: "TORNEIOS\nMUNDIAIS", alt: "Torneios" },
              ].map((card, i) => (
                <div key={i} className="relative w-[85vw] sm:w-[320px] md:w-[380px] aspect-[16/9] flex-none snap-start rounded-xl overflow-hidden group/card cursor-pointer border border-sky-900/40 hover:border-[#38bdf8]/60 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-300">
                  <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-xl"><div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer-ray opacity-0 group-hover/card:opacity-100"></div></div>
                  <img src={card.img} alt={card.alt} className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/95 via-[#020617]/70 to-[#020617]/20 z-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/90 via-transparent to-transparent z-10"></div>
                  <div className="absolute top-3 left-4 flex items-start space-x-1 z-20"><div className="text-white font-black italic text-[9px] md:text-[11px] leading-[1.1] tracking-tighter"><span>REVELA</span><br /><span className="text-[#38bdf8]">TALENTOS</span></div></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-300 z-20">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-600/80 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.6)] border border-[#38bdf8]">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                  <div className="absolute bottom-4 md:bottom-5 left-0 flex items-center border-l-[3px] md:border-l-4 border-[#38bdf8] ml-4 pl-3 z-20">
                    <h3 className="text-white font-black text-lg md:text-2xl uppercase tracking-tighter leading-[0.9] drop-shadow-md">{card.title.split('\n').map((l, j) => <React.Fragment key={j}>{l}{j === 0 && <br />}</React.Fragment>)}</h3>
                  </div>
                  <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 bg-[#0f172a]/90 rounded-md px-2 md:px-2.5 py-1.5 flex items-center space-x-2 backdrop-blur-md border border-sky-500/20 z-20">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-[#38bdf8]"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                    <span className="text-white text-[9px] md:text-[10px] font-bold tracking-wider uppercase">Reproduzir</span>
                  </div>
                </div>
              ))}
            </div>
            <button id="nextBtn" className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-[#0f172a]/90 backdrop-blur-md border border-sky-500/30 rounded-full items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:border-[#38bdf8] cursor-pointer hidden md:flex">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
          <div className="flex justify-center space-x-1.5 mt-4 relative z-10">
            {[true, false, false, false].map((active, i) => <div key={i} className={`h-[3px] rounded-full pagination-dot transition-colors duration-300 ${active ? 'w-5 md:w-6 bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.8)]' : 'w-3 md:w-4 bg-slate-800'}`}></div>)}
          </div>
        </section>

        {/* 3. Eventos Revela Section */}
        <section className="bg-[#020617] py-16 md:py-24 relative w-full overflow-hidden border-t border-sky-900/30">
          <div className="absolute top-[50%] left-[20%] w-64 h-64 bg-[#38bdf8]/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob z-0 pointer-events-none" />
          <div className="absolute bottom-[10%] right-[10%] w-48 h-48 bg-blue-700/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 z-0 pointer-events-none" />

          <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-10 md:mb-14">
              <h4 className="text-[9px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-[#38bdf8] mb-3 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] border border-sky-500/30 px-3 py-1 rounded bg-sky-900/20 backdrop-blur-sm">
                Calendário Internacional
              </h4>
              <h2 className="text-3xl md:text-4xl lg:text-[42px] font-black text-white leading-tight drop-shadow-lg mb-3 uppercase tracking-tight flex items-center gap-3">
                <svg className="w-8 h-8 text-[#38bdf8] animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" /></svg>
                Eventos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-blue-500">Revela</span>
                <svg className="w-8 h-8 text-[#38bdf8] animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" /></svg>
              </h2>
              <p className="text-[13px] md:text-[15px] text-sky-100/70 font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                EVENTOS EC10 2026
              </p>
            </div>

            {/* Map Panel */}
            <div className="relative w-full aspect-[2/1] group mb-16">
              {/* Map Background */}
              <div className="absolute inset-0 bg-[#050508] border border-cyan-500/20 rounded-3xl shadow-[0_0_50px_rgba(0,243,255,0.05)] overflow-hidden">
                <div className="absolute inset-0 opacity-40 pointer-events-none transition-opacity duration-700 group-hover:opacity-60 flex items-center justify-center">
                  <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" className="w-full h-full drop-shadow-[0_0_8px_rgba(0,243,255,0.3)]">
                    <image
                      href="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
                      width="1000"
                      height="500"
                      style={{ filter: 'invert(1) sepia(1) saturate(5) hue-rotate(175deg) brightness(0.5) contrast(2)' }}
                    />
                  </svg>
                </div>
              </div>

              {/* Map Pins */}
              {[
                { id: 1, nome: 'Sudacademy', cidade: 'Belo Horizonte', pais: 'Brasil', mes: 'Dezembro', posicao: { top: '61.5%', left: '37.5%' } },
                { id: 2, nome: 'Libertacademy', cidade: 'Buenos Aires', pais: 'Argentina', mes: 'Julho', posicao: { top: '76.4%', left: '34.3%' } },
                { id: 3, nome: 'Eurocamp', cidade: 'Madrid', pais: 'Espanha', mes: 'Agosto', posicao: { top: '28%', left: '48.5%' } },
              ].map((evento) => {
                const isBottomHalf = parseFloat(evento.posicao.top) > 50;
                return (
                  <div
                    key={evento.id}
                    className={`absolute flex flex-col items-center transition-all duration-300 ${eventoAtivo === evento.id ? 'z-50' : 'z-20'}`}
                    style={{ top: evento.posicao.top, left: evento.posicao.left, transform: 'translate(-50%, -50%)' }}
                    onMouseEnter={() => setEventoAtivo(evento.id)}
                    onMouseLeave={() => setEventoAtivo(null)}
                  >
                    {/* Pulsing Pin */}
                    <div className="relative flex justify-center items-center cursor-pointer">
                      <div className="absolute w-12 h-12 bg-[#00f3ff]/20 rounded-full animate-ping" />
                      <div className="absolute w-6 h-6 bg-[#00f3ff]/40 rounded-full animate-pulse" />
                      <svg className="relative w-8 h-8 text-[#00f3ff] drop-shadow-[0_0_10px_rgba(0,243,255,1)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                    </div>

                    {/* Info Card */}
                    <div className={`
                      absolute w-56 p-1
                      transition-all duration-300 ease-out
                      ${isBottomHalf ? 'bottom-full mb-4 origin-bottom' : 'top-full mt-4 origin-top'}
                      ${eventoAtivo === evento.id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                    `}>
                      <div className="relative bg-[#050505]/90 backdrop-blur-md border border-[#00f3ff]/40 rounded-xl p-4 shadow-[0_4px_30px_rgba(0,243,255,0.15)]">
                        {isBottomHalf
                          ? <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-gradient-to-t from-[#00f3ff] to-transparent" />
                          : <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-gradient-to-b from-[#00f3ff] to-transparent" />
                        }
                        <h3 className="text-[#00f3ff] font-bold text-base tracking-wide flex items-center gap-2 mb-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                          {evento.nome}
                        </h3>
                        <div className="space-y-1.5 text-sm text-gray-300">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            <span>{evento.cidade}, <span className="text-white">{evento.pais}</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#00f3ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            <span className="font-semibold uppercase text-[#00f3ff]">{evento.mes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Event List */}
            <div className="flex flex-col gap-4 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center text-white mb-4 uppercase tracking-widest flex items-center justify-center gap-3">
                <svg className="w-6 h-6 text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                Agenda <span className="text-[#38bdf8]">Global</span>
              </h2>

              {[
                { id: 1, nome: 'Sudacademy', cidade: 'Belo Horizonte', pais: 'Brasil', mes: 'Dezembro' },
                { id: 2, nome: 'Libertacademy', cidade: 'Buenos Aires', pais: 'Argentina', mes: 'Julho' },
                { id: 3, nome: 'Eurocamp', cidade: 'Madrid', pais: 'Espanha', mes: 'Agosto' },
              ].map((evento) => (
                <div
                  key={`list-${evento.id}`}
                  className={`bg-[#050505]/80 backdrop-blur-md border rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.05)] cursor-pointer group ${eventoAtivo === evento.id
                      ? 'border-[#00f3ff]/60 shadow-[0_0_30px_rgba(0,243,255,0.2)] -translate-y-1'
                      : 'border-cyan-500/20 hover:border-[#00f3ff]/40 hover:-translate-y-1'
                    }`}
                  onMouseEnter={() => setEventoAtivo(evento.id)}
                  onMouseLeave={() => setEventoAtivo(null)}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${eventoAtivo === evento.id ? 'bg-[#00f3ff]/20 shadow-[0_0_15px_rgba(0,243,255,0.4)]' : 'bg-cyan-950/40 group-hover:bg-[#00f3ff]/10'
                      }`}>
                      <svg className={`w-7 h-7 transition-colors ${eventoAtivo === evento.id ? 'text-[#00f3ff]' : 'text-cyan-600 group-hover:text-[#00f3ff]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold flex items-center gap-2 transition-colors ${eventoAtivo === evento.id ? 'text-[#00f3ff]' : 'text-white group-hover:text-cyan-100'}`}>
                        {evento.nome}
                        <svg className={`w-4 h-4 text-[#00f3ff] transition-opacity duration-300 ${eventoAtivo === evento.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                      </h3>
                      <div className="flex items-center gap-2 text-gray-400 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        <span>{evento.cidade}, <span className="text-gray-200">{evento.pais}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-colors w-full md:w-auto justify-center ${eventoAtivo === evento.id
                      ? 'bg-[#00f3ff]/15 border-[#00f3ff]/40'
                      : 'bg-[#00f3ff]/5 border-[#00f3ff]/10 group-hover:bg-[#00f3ff]/10 group-hover:border-[#00f3ff]/30'
                    }`}>
                    <svg className="w-5 h-5 text-[#00f3ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    <span className="font-bold text-[#00f3ff] uppercase tracking-wider">{evento.mes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. About Section */}
        <section className="relative w-full min-h-[60vh] md:min-h-[85vh] flex flex-col pt-16 md:pt-28 pb-0 bg-[#020617] overflow-hidden">
          <div className="absolute top-0 inset-x-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#38bdf8]/50 to-transparent animate-pulse-line"></div>
          <div className="absolute inset-0 z-0 top-0 mt-24 md:mt-40">
            <img src="https://static.wixstatic.com/media/933cdd_cf7148f5f8864f8190aff7dbd6f6ef21~mv2.jpg" alt="Visão do Estádio" className="w-full h-full object-cover object-top opacity-60 mix-blend-luminosity" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/85 to-transparent h-1/2"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent"></div>
            <div className="absolute inset-0 bg-blue-900/10 mix-blend-color"></div>
          </div>
          <div className="relative z-10 w-full max-w-[1300px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 flex-grow mb-20 md:mb-64">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 lg:gap-24 items-start bg-[#020617]/60 p-6 md:p-8 rounded-2xl backdrop-blur-md border border-sky-500/20 shadow-[0_0_40px_rgba(2,6,23,0.8)] relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#38bdf8]/10 rounded-full blur-[50px] pointer-events-none"></div>
              <div className="flex flex-col">
                <h4 className="text-[9px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-[#38bdf8] mb-2.5 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] flex items-center gap-2">
                  <svg className="w-3 h-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Motor de Oportunidades
                </h4>
                <h2 className="text-3xl md:text-4xl lg:text-[42px] font-black text-white leading-tight drop-shadow-lg tracking-tight uppercase">O que é a<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-blue-500">REVELA TALENTOS?</span></h2>
              </div>
              <div className="flex flex-col space-y-4 md:space-y-6 text-[13px] md:text-[15.5px] leading-[1.8] text-sky-100/90 font-medium border-l border-sky-500/20 pl-4 md:pl-6 relative">
                <div className="absolute -left-px top-0 w-[2px] h-10 bg-gradient-to-b from-[#38bdf8] to-transparent"></div>
                <p>Realize o seu sonho. A REVELA TALENTOS é a sua ponte digital e infraestrutura de dados para o futebol profissional, conectando a sua performance em campo diretamente aos ecrãs dos grandes clubes.</p>
                <p className="text-sky-100/70">A nossa missão é transformar potencial bruto em dados mensuráveis e realidade palpável, oferecendo o HUD (Heads-Up Display) necessário para que brilhe nos maiores palcos do mundo.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Advantages Section */}
        <section className="bg-[#020617] py-16 md:py-28 relative w-full overflow-hidden">
          <div className="absolute top-[30%] left-[20%] w-48 h-48 md:w-64 md:h-64 bg-[#38bdf8]/20 rounded-full mix-blend-screen filter blur-[80px] md:blur-[120px] animate-blob z-0 pointer-events-none"></div>
          <div className="absolute bottom-[20%] right-[10%] w-64 h-64 md:w-80 md:h-80 bg-blue-700/10 rounded-full mix-blend-screen filter blur-[80px] md:blur-[100px] animate-blob animation-delay-2000 z-0 pointer-events-none"></div>
          <div className="max-w-[1300px] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
            <div className="w-full flex flex-col items-center text-center mb-16 md:mb-28">
              <h4 className="text-[9px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-[#38bdf8] mb-3 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] border border-sky-500/30 px-3 py-1 rounded bg-sky-900/20 backdrop-blur-sm">Features Premium</h4>
              <h2 className="text-3xl md:text-4xl lg:text-[42px] font-black text-white leading-tight drop-shadow-lg mb-4 md:mb-6 uppercase tracking-tight">Por que integrar a<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-blue-500">REVELA TALENTOS?</span></h2>
              <p className="text-[13px] md:text-[15.5px] leading-[1.7] text-sky-100/80 font-medium max-w-2xl mb-8">Com a nossa plataforma, é monitorizado por quem realmente importa. Substituímos a sorte por estatística, dando-lhe ferramentas de análise tática para evoluir o seu jogo diariamente.</p>
              <button className="bg-gradient-to-r from-blue-600/20 to-sky-500/20 hover:from-blue-600/40 hover:to-sky-500/40 text-white border border-sky-400/30 hover:border-sky-400/60 transition-all duration-300 px-6 py-3 md:px-8 md:py-3.5 rounded-full text-xs md:text-sm font-semibold tracking-wide backdrop-blur-md shadow-[0_0_15px_rgba(14,165,233,0.15)] hover:shadow-[0_0_25px_rgba(14,165,233,0.3)]">Conhecer Planos</button>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-20 lg:gap-16 xl:gap-32 lg:px-10 pb-16 md:pb-20">
              {/* Stack 1 */}
              <div className="grid place-items-center relative w-full max-w-[280px] sm:max-w-[360px] ml-0 lg:-ml-10">
                {[
                  { z: "z-10", trans: "hover:-translate-y-4 md:hover:-translate-y-8", offset: "", bg: "bg-[#02040a]/90", border: "border-sky-900/50", icon: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>, label: "Mentoria em grupo", desc: "Aulas táticas com profissionais do futebol brasileiro e internacional.", iconBg: "bg-blue-900/30 border-sky-500/20", grayscale: "grayscale-[50%]" },
                  { z: "z-20", trans: "hover:translate-y-2 md:hover:translate-y-4", offset: "translate-x-3 translate-y-6 sm:translate-x-5 sm:translate-y-10 md:translate-x-10 md:translate-y-14", bg: "bg-[#0a1128]/95", border: "border-sky-800/60", icon: <><circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" /><line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" /></>, label: "Seletivas Reais", desc: "Avaliações baseadas em dados com clubes e olheiros profissionais.", iconBg: "bg-blue-900/40 border-sky-500/30", grayscale: "grayscale-[50%]" },
                  { z: "z-30", trans: "hover:translate-y-8 md:hover:translate-y-16", offset: "translate-x-6 translate-y-12 sm:translate-x-10 sm:translate-y-20 md:translate-x-20 md:translate-y-28", bg: "bg-[#0f172a]", border: "border-sky-500/50", icon: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></>, label: "Radar Mapeado", desc: "Feedback detalhado através de heatmaps e análises técnicas.", iconBg: "bg-[#38bdf8]/20 border-[#38bdf8]/50 shadow-[0_0_15px_rgba(56,189,248,0.4)]", grayscale: "" },
                ].map((card, i) => (
                  <div key={i} className={`col-start-1 row-start-1 relative flex w-[16rem] h-[9rem] sm:w-[17rem] sm:h-[10.5rem] md:w-[22rem] md:h-[10.5rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border ${card.border} ${card.bg} backdrop-blur-md px-4 sm:px-5 py-3 sm:py-4 transition-all duration-700 ${card.offset} ${card.trans} hover:border-[#38bdf8]/80 hover:bg-[#0f172a] ${card.grayscale} hover:grayscale-0 ${card.z} hover:z-50 group shadow-[0_15px_30px_-10px_rgba(2,6,23,0.9)] cursor-pointer overflow-hidden`}>
                    <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer-ray pointer-events-none"></div>
                    <div className="flex items-center space-x-3.5 relative z-10">
                      <span className={`relative flex-shrink-0 inline-flex items-center justify-center rounded-lg ${card.iconBg} p-2 md:p-2.5 group-hover:bg-[#38bdf8]/20 transition-colors border`}>
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-sky-400 group-hover:text-[#38bdf8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{card.icon}</svg>
                      </span>
                      <p className="text-[15px] sm:text-[17px] md:text-[18px] font-black text-white uppercase tracking-tight group-hover:text-[#38bdf8] transition-colors leading-tight">{card.label}</p>
                    </div>
                    <p className="text-[11px] md:text-[13px] text-sky-100/70 font-medium leading-relaxed relative z-10">{card.desc}</p>
                  </div>
                ))}
              </div>
              {/* Stack 2 */}
              <div className="grid place-items-center relative w-full max-w-[280px] sm:max-w-[360px] mt-16 lg:mt-0">
                {[
                  { z: "z-10", trans: "hover:-translate-y-4 md:hover:-translate-y-8", offset: "", bg: "bg-[#02040a]/90", border: "border-sky-900/50", icon: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></>, label: "Rede Conectada", desc: "Hub de conexões com outros atletas e diretores desportivos.", iconBg: "bg-blue-900/30 border-sky-500/20", grayscale: "grayscale-[50%]" },
                  { z: "z-20", trans: "hover:translate-y-2 md:hover:translate-y-4", offset: "translate-x-3 translate-y-6 sm:translate-x-5 sm:translate-y-10 md:translate-x-10 md:translate-y-14", bg: "bg-[#0a1128]/95", border: "border-sky-800/60", icon: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>, label: "Planeamento IA", desc: "Cronogramas de treino ajustados para otimizar métricas corporais.", iconBg: "bg-blue-900/40 border-sky-500/30", grayscale: "grayscale-[50%]" },
                  { z: "z-30", trans: "hover:translate-y-8 md:hover:translate-y-16", offset: "translate-x-6 translate-y-12 sm:translate-x-10 sm:translate-y-20 md:translate-x-20 md:translate-y-28", bg: "bg-[#0f172a]", border: "border-sky-500/50", icon: <><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></>, label: "Suporte 360º", desc: "Acesso constante à nossa base de especialistas em performance.", iconBg: "bg-[#38bdf8]/20 border-[#38bdf8]/50 shadow-[0_0_15px_rgba(56,189,248,0.4)]", grayscale: "" },
                ].map((card, i) => (
                  <div key={i} className={`col-start-1 row-start-1 relative flex w-[16rem] h-[9rem] sm:w-[17rem] sm:h-[10.5rem] md:w-[22rem] md:h-[10.5rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border ${card.border} ${card.bg} backdrop-blur-md px-4 sm:px-5 py-3 sm:py-4 transition-all duration-700 ${card.offset} ${card.trans} hover:border-[#38bdf8]/80 hover:bg-[#0f172a] ${card.grayscale} hover:grayscale-0 ${card.z} hover:z-50 group shadow-[0_15px_30px_-10px_rgba(2,6,23,0.9)] cursor-pointer overflow-hidden`}>
                    <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer-ray pointer-events-none"></div>
                    <div className="flex items-center space-x-3.5 relative z-10">
                      <span className={`relative flex-shrink-0 inline-flex items-center justify-center rounded-lg ${card.iconBg} p-2 md:p-2.5 group-hover:bg-[#38bdf8]/20 transition-colors border`}>
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-sky-400 group-hover:text-[#38bdf8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{card.icon}</svg>
                      </span>
                      <p className="text-[15px] sm:text-[17px] md:text-[18px] font-black text-white uppercase tracking-tight group-hover:text-[#38bdf8] transition-colors leading-tight">{card.label}</p>
                    </div>
                    <p className="text-[11px] md:text-[13px] text-sky-100/70 font-medium leading-relaxed relative z-10">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Success Cases Section */}
        <section className="bg-[#020617] py-16 md:py-24 relative w-full z-20 select-none overflow-hidden border-t border-sky-900/30">
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-blue-600/10 rounded-full mix-blend-screen filter blur-[100px] md:blur-[150px] animate-blob z-0 pointer-events-none"></div>
          <div className="w-full max-w-[1600px] mx-auto relative z-10">
            <div className="mb-8 md:mb-14 px-5 sm:px-8 md:px-12 lg:px-16 max-w-[1300px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h4 className="text-[9px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-[#38bdf8] mb-2 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">Métricas Comprovadas</h4>
                <h2 className="text-2xl md:text-4xl font-black text-white flex items-center uppercase tracking-tight">
                  Transferências Concluídas
                  <svg className="w-5 h-5 md:w-8 md:h-8 ml-2 md:ml-3 text-[#38bdf8] mt-1 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </h2>
              </div>
            </div>
            <div className="relative w-full group">
              <button id="prevCasesBtn" className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-[#0f172a]/90 backdrop-blur-md border border-sky-500/30 rounded-full items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:border-[#38bdf8] cursor-pointer hidden md:flex">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <div id="casesTrack" className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-5 sm:px-8 md:px-12 lg:px-16 pb-8 md:pb-12 pt-2 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                {[
                  { img: "https://images.unsplash.com/photo-1600250395178-40fe752e5189?q=80&w=800&auto=format&fit=crop", id: "8942", badge: "CONTRATADO", badgeBg: "bg-green-950/80 border-green-500/30", badgeText: "text-green-400", dotColor: "bg-green-500", name: "Matheus Alves", pos: "Extremo Esquerdo", age: "18 Anos", desc: "Métricas táticas destacadas pela IA. Aprovado na base de um gigante paulista em 4 semanas." },
                  { img: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop", id: "7102", badge: "PRO", badgeBg: "bg-green-950/80 border-green-500/30", badgeText: "text-green-400", dotColor: "bg-green-500", name: 'João "Foguete"', pos: "Lateral Direito", age: "17 Anos", desc: "Velocidade máxima registada no sistema atraiu atenção europeia. Assinou contrato profissional." },
                  { img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop", id: "9021", badge: "EUROPA", badgeBg: "bg-green-950/80 border-green-500/30", badgeText: "text-green-400", dotColor: "bg-green-500", name: "Lucas Pereira", pos: "Médio Centro", age: "19 Anos", desc: "Perfil analítico perfeito para o estilo de jogo holandês. Captado pelo radar internacional." },
                ].map((c, i) => (
                  <div key={i} className="relative w-[85vw] sm:w-[280px] md:w-[320px] aspect-[3/4] flex-none snap-start rounded-2xl overflow-hidden group/card cursor-pointer border border-sky-500/20 hover:border-[#38bdf8] transition-all duration-500 shadow-[0_10px_20px_rgba(2,6,23,0.8)] hover:shadow-[0_0_30px_rgba(56,189,248,0.4)]">
                    <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700 ease-out mix-blend-luminosity opacity-80 group-hover/card:mix-blend-normal group-hover/card:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-transparent"></div>
                    <div className="absolute inset-0 bg-sky-900/10 group-hover/card:bg-transparent transition-colors duration-500 mix-blend-color"></div>
                    <div className="absolute top-3 md:top-4 left-3 md:left-4 right-3 md:right-4 flex justify-between items-start opacity-90">
                      <div className="bg-sky-950/80 backdrop-blur-sm border border-sky-500/30 px-2 py-1 rounded text-[8px] md:text-[9px] font-bold text-sky-400 tracking-wider">SCOUT ID: {c.id}</div>
                      <div className={`flex items-center gap-1 ${c.badgeBg} border px-2 py-1 rounded`}>
                        <div className={`w-1 h-1 md:w-1.5 md:h-1.5 ${c.dotColor} rounded-full animate-pulse`}></div>
                        <span className={`text-[8px] md:text-[9px] font-bold ${c.badgeText} tracking-wider`}>{c.badge}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-5 md:bottom-6 left-5 md:left-6 right-5 md:right-6 transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
                      <div className="w-1 md:w-1.5 h-8 md:h-10 bg-[#38bdf8] absolute -left-4 md:-left-5 top-1 shadow-[0_0_12px_rgba(56,189,248,0.8)]"></div>
                      <h3 className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter leading-none drop-shadow-md mb-2 group-hover/card:text-sky-300 transition-colors">{c.name}</h3>
                      <div className="flex gap-2 mb-2 md:mb-3">
                        <span className="text-[9px] md:text-[10px] bg-slate-800/80 border border-slate-600 px-2 py-0.5 rounded text-gray-300">{c.pos}</span>
                        <span className="text-[9px] md:text-[10px] bg-slate-800/80 border border-slate-600 px-2 py-0.5 rounded text-gray-300">{c.age}</span>
                      </div>
                      <p className="text-sky-100/70 text-[11px] md:text-[13px] font-medium leading-snug drop-shadow-md line-clamp-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">{c.desc}</p>
                    </div>
                  </div>
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

        {/* 6. Athlete Ecosystem Section */}
        <section className="bg-[#020617] py-16 md:py-32 relative w-full overflow-hidden border-t border-sky-900/30">
          <div className="absolute inset-0 z-0">
            <img src="https://espnpressroom.com/brazil/files/2024/08/702c3535-22b5-46fd-aeeb-d7c34ccb5a51.jpeg" alt="Fundo" className="w-full h-full object-cover object-center opacity-20 md:opacity-30 mix-blend-luminosity grayscale-[70%]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0ea5e9]/10 via-[#020617]/90 to-[#020617] z-10"></div>
            <div className="absolute top-0 left-0 w-full h-24 md:h-40 bg-gradient-to-b from-[#020617] to-transparent z-20"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent z-20"></div>
          </div>
          <div className="max-w-[1300px] mx-auto px-5 sm:px-8 md:px-12 relative z-20">
            <div className="w-full flex flex-col items-center text-center mb-12 md:mb-24">
              <h4 className="text-[9px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-sky-400 mb-3 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] border border-sky-400/30 px-3 py-1 rounded bg-sky-900/20 backdrop-blur-sm">Painel Central do Atleta</h4>
              <h2 className="text-3xl md:text-5xl lg:text-[56px] font-black text-white tracking-tighter leading-[1.1] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] mb-4 md:mb-6 uppercase">O Seu Hub de<br /><span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#38bdf8]">PERFORMANCE</span></h2>
              <p className="text-[13px] md:text-[17px] leading-[1.7] text-sky-100/90 font-medium max-w-2xl drop-shadow-xl" style={{ textShadow: '1px 1px 3px rgba(0,0,0,1)' }}>A infraestrutura que liga o seu rendimento aos decisores do mercado. Dados, análise e oportunidades no mesmo ecrã.</p>
            </div>
            <div className="w-full max-w-5xl mx-auto relative aspect-[4/3] sm:aspect-video md:aspect-[21/9] rounded-2xl md:rounded-3xl bg-[#02040a]/60 border border-sky-500/30 shadow-[0_0_50px_rgba(2,6,23,0.9)] md:shadow-[0_0_80px_rgba(2,6,23,0.9)] p-2 md:p-8 backdrop-blur-xl flex items-center justify-center overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[#38bdf8] blur-sm opacity-50"></div>
              <svg className="text-sky-800/80 w-full h-full drop-shadow-2xl" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet">
                <g style={{ fontFamily: "'Inter',sans-serif", textShadow: "0px 2px 4px rgba(0,0,0,0.9)" }}>
                  <text x="10" y="17" fill="#38bdf8" fontSize="5" fontWeight="900" letterSpacing="0.15em">CLUBES</text>
                  <text x="30" y="27" fill="#818cf8" fontSize="5" fontWeight="900" letterSpacing="0.15em">TREINOS</text>
                  <text x="95" y="98" fill="#fb923c" textAnchor="middle" fontSize="5" fontWeight="900" letterSpacing="0.15em">SCOUTING</text>
                  <text x="86" y="91" fill="#22d3ee" textAnchor="end" fontSize="5" fontWeight="900" letterSpacing="0.15em">DADOS</text>
                  <text x="180" y="7" fill="#facc15" textAnchor="end" fontSize="5" fontWeight="900" letterSpacing="0.15em">MÉTRICAS</text>
                  <text x="130" y="17" fill="#ec4899" textAnchor="middle" fontSize="5" fontWeight="900" letterSpacing="0.15em">ANÁLISE</text>
                  <text x="170" y="86" fill="white" textAnchor="middle" fontSize="5" fontWeight="900" letterSpacing="0.15em">RADAR</text>
                  <text x="135" y="62" fill="#4ade80" fontSize="5" fontWeight="900" letterSpacing="0.15em">PERFORMANCE</text>
                </g>
                <g stroke="currentColor" fill="none" strokeWidth="0.3" strokeDasharray="100 100" pathLength="100" opacity="0.4">
                  <path d="M 10 20 h 79.5 q 5 0 5 5 v 30"><animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" fill="freeze" calcMode="spline" keySplines="0.25,0.1,0.5,1" keyTimes="0; 1" /></path>
                  <path d="M 180 10 h -69.7 q -5 0 -5 5 v 30"><animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" fill="freeze" calcMode="spline" keySplines="0.25,0.1,0.5,1" keyTimes="0; 1" /></path>
                  <path d="M 130 20 v 21.8 q 0 5 -5 5 h -10" />
                  <path d="M 170 80 v -21.8 q 0 -5 -5 -5 h -50" />
                  <path d="M 135 65 h 15 q 5 0 5 5 v 10 q 0 5 -5 5 h -39.8 q -5 0 -5 -5 v -20"><animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" fill="freeze" calcMode="spline" keySplines="0.25,0.1,0.5,1" keyTimes="0; 1" /></path>
                  <path d="M 94.8 95 v -36" />
                  <path d="M 88 88 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 14" />
                  <path d="M 30 30 h 25 q 5 0 5 5 v 6.5 q 0 5 5 h 20" />
                </g>
                <g mask="url(#atleta-mask-1)"><circle className="atleta-ecossistema linha-1" cx="0" cy="0" r="6" fill="url(#luz-azul)" /></g>
                <g mask="url(#atleta-mask-2)"><circle className="atleta-ecossistema linha-2" cx="0" cy="0" r="6" fill="url(#luz-amarela)" /></g>
                <g mask="url(#atleta-mask-3)"><circle className="atleta-ecossistema linha-3" cx="0" cy="0" r="6" fill="url(#luz-rosa)" /></g>
                <g mask="url(#atleta-mask-4)"><circle className="atleta-ecossistema linha-4" cx="0" cy="0" r="6" fill="url(#luz-branca)" /></g>
                <g mask="url(#atleta-mask-5)"><circle className="atleta-ecossistema linha-5" cx="0" cy="0" r="6" fill="url(#luz-verde)" /></g>
                <g mask="url(#atleta-mask-6)"><circle className="atleta-ecossistema linha-6" cx="0" cy="0" r="6" fill="url(#luz-laranja)" /></g>
                <g mask="url(#atleta-mask-7)"><circle className="atleta-ecossistema linha-7" cx="0" cy="0" r="6" fill="url(#luz-ciano)" /></g>
                <g mask="url(#atleta-mask-8)"><circle className="atleta-ecossistema linha-8" cx="0" cy="0" r="6" fill="url(#luz-indigo)" /></g>
                <circle cx="100" cy="50" r="24" fill="url(#center-glow)"><animate attributeName="opacity" values="0.4; 0.8; 0.4" dur="2s" repeatCount="indefinite" /></circle>
                <g>
                  <g fill="none" stroke="#38bdf8" strokeWidth="0.8">
                    <line x1="94" y1="38" x2="94" y2="42" /><line x1="106" y1="38" x2="106" y2="42" />
                    <line x1="94" y1="58" x2="94" y2="62" /><line x1="106" y1="58" x2="106" y2="62" />
                  </g>
                  <rect x="75" y="42" width="50" height="16" rx="4" fill="#020617" stroke="#38bdf8" strokeWidth="1.2" filter="url(#sombra-caixa)" />
                  <text x="100" y="52.5" textAnchor="middle" fontSize="7" fill="white" fontWeight="900" letterSpacing="0.2em" style={{ fontFamily: "'Inter',sans-serif" }}>PROFILE</text>
                </g>
                <defs>
                  <radialGradient id="center-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                  <mask id="atleta-mask-1"><path d="M 10 20 h 79.5 q 5 0 5 5 v 24" strokeWidth="0.5" stroke="white" /></mask>
                  <mask id="atleta-mask-2"><path d="M 180 10 h -69.7 q -5 0 -5 5 v 24" strokeWidth="0.5" stroke="white" /></mask>
                  <mask id="atleta-mask-3"><path d="M 130 20 v 21.8 q 0 5 -5 5 h -10" strokeWidth="0.5" stroke="white" /></mask>
                  <mask id="atleta-mask-4"><path d="M 170 80 v -21.8 q 0 -5 -5 -5 h -50" strokeWidth="0.5" stroke="white" /></mask>
                  <mask id="atleta-mask-5"><path d="M 135 65 h 15 q 5 0 5 5 v 10 q 0 5 -5 5 h -39.8 q -5 0 -5 -5 v -20" strokeWidth="0.5" stroke="white" /></mask>
                  <mask id="atleta-mask-6"><path d="M 94.8 95 v -36" strokeWidth="0.5" stroke="white" /></mask>
                  <mask id="atleta-mask-7"><path d="M 88 88 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 14" strokeWidth="0.5" stroke="white" /></mask>
                  <mask id="atleta-mask-8"><path d="M 30 30 h 25 q 5 0 5 5 v 6.5 q 0 5 5 h 20" strokeWidth="0.5" stroke="white" /></mask>
                  <radialGradient id="luz-azul" fx="1"><stop offset="0%" stopColor="#38bdf8" /><stop offset="50%" stopColor="#0284c7" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                  <radialGradient id="luz-amarela" fx="1"><stop offset="0%" stopColor="#facc15" /><stop offset="50%" stopColor="#ca8a04" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                  <radialGradient id="luz-rosa" fx="1"><stop offset="0%" stopColor="#ec4899" /><stop offset="50%" stopColor="#be185d" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                  <radialGradient id="luz-branca" fx="1"><stop offset="0%" stopColor="white" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                  <radialGradient id="luz-verde" fx="1"><stop offset="0%" stopColor="#4ade80" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                  <radialGradient id="luz-laranja" fx="1"><stop offset="0%" stopColor="#fb923c" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                  <radialGradient id="luz-ciano" fx="1"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                  <radialGradient id="luz-indigo" fx="1"><stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                  <filter id="sombra-caixa" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.9" /></filter>
                </defs>
              </svg>
            </div>
          </div>
        </section>

        {/* 7. FAQ Section */}
        <section className="bg-[#02040a] py-16 md:py-32 relative w-full">
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-[#38bdf8]/10 rounded-full mix-blend-screen filter blur-[100px] md:blur-[150px] animate-blob z-0 pointer-events-none"></div>
          <div className="max-w-[800px] mx-auto px-5 sm:px-8 relative z-10">
            <div className="text-center mb-12 md:mb-16">
              <h4 className="text-[9px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-[#38bdf8] mb-3 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">Base de Conhecimento</h4>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-tight uppercase tracking-tight">Parâmetros do Sistema</h2>
            </div>
            <div className="space-y-3 md:space-y-4">
              {[
                { q: "Preciso ter experiência profissional base?", a: "Não! O algoritmo REVELA TALENTOS foi desenhado para processar o talento bruto. Seja um atleta de formação ou um talento amador à procura de oportunidade, o nosso sistema cruza as suas métricas com as necessidades reais dos clubes conectados." },
                { q: "Como é feito o encaminhamento dos dados?", a: "Possuímos protocolos API com os departamentos de scouting de dezenas de clubes. Os seus vídeos e relatórios alimentam diretamente os painéis de análise destes profissionais, sendo filtrados por posição, idade e atributos táticos desejados." },
                { q: "Qual é a probabilidade estatística de contratação?", a: "O sistema não garante contratos, pois o futebol depende da performance em tempo real. Garantimos, no entanto, a maior montra digital da América Latina e ferramentas de análise de performance de nível de Liga dos Campeões para acelerar a sua evolução." },
              ].map((faq, i) => (
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
        <section className="bg-[#020617] py-20 md:py-32 relative w-full overflow-hidden border-t border-sky-900/30">
          <div className="absolute top-0 inset-x-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent animate-pulse-line"></div>
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            <div className="w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#38bdf8]/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse"></div>
            <div className="absolute w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-blue-600/20 rounded-full blur-[60px] md:blur-[80px]"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-5 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-green-500/30 bg-green-950/40 mb-6 md:mb-8 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
              <span className="text-[9px] md:text-[10px] font-bold text-green-400 tracking-wider uppercase">Inscrições Abertas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-black text-white mb-4 md:mb-6 tracking-tighter uppercase drop-shadow-xl leading-none">Inicie a sua<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-blue-500">Transferência.</span></h2>
            <p className="text-[14px] md:text-xl text-sky-100/80 mb-8 md:mb-10 max-w-2xl mx-auto font-medium">Sincronize os seus dados com o maior radar de talentos do mundo. O mercado está à procura do seu perfil.</p>
            <div className="flex flex-col items-center justify-center gap-4">
              <button className="relative overflow-hidden group bg-blue-600 hover:bg-blue-500 text-white text-[14px] md:text-[18px] font-black tracking-wide uppercase py-4 md:py-5 px-8 md:px-12 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(14,165,233,0.5)] hover:shadow-[0_0_50px_rgba(56,189,248,0.7)] border border-sky-400/40 w-full sm:w-auto">
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shimmer-ray"></div>
                Processar Assinatura
              </button>
              <p className="mt-2 md:mt-4 text-[9px] md:text-[11px] font-semibold text-sky-100/40 uppercase tracking-widest flex items-center justify-center gap-1.5 md:gap-2">
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#38bdf8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Criptografia SSL 256-bit
              </p>
            </div>
          </div>
        </section>

        {/* 9. Footer */}
        <footer className="bg-[#02040a] pt-12 md:pt-16 pb-8 relative w-full overflow-hidden border-t border-sky-900/30">
          <div className="max-w-[1300px] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-12 md:mb-16">
              <div className="lg:col-span-1">
                <div className="text-white font-black italic text-lg leading-[1.1] tracking-tighter mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#38bdf8] fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 3.14-2.14 4.14-.95.7-2.22.95-3.4.74-1.25-.22-2.34-1-3.04-2.07-.63-.97-.88-2.18-.58-3.32.32-1.2.1-2.48-.6-3.48l-.13-.18c2.16-1.5 5.06-1.63 7.37-.2 1.57.98 2.37 2.7 2.52 4.37z" /></svg>
                  <div><span>REVELA</span><br /><span className="text-[#38bdf8]">TALENTOS</span></div>
                </div>
                <p className="text-[12px] md:text-[13px] font-medium text-sky-100/60 leading-relaxed mb-6">Data Scouting Platform. Conectando performance em campo a gabinetes profissionais.</p>
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
                { title: "Sistema", links: ["Algoritmo", "Planos de Acesso", "Acesso Scouting"] },
                { title: "Operações", links: ["Documentação", "Parâmetros (FAQ)", "Suporte Técnico"] },
                { title: "Segurança", links: ["Termos de Utilização", "Proteção de Dados", "Compliance"] },
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
              <p>&copy; 2026 Revela Talentos Data Systems.</p>
              <div className="flex items-center space-x-2">
                <span>Powered by Performance</span>
                <svg className="w-3 h-3 text-[#38bdf8]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}