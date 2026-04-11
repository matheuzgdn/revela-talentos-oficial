import React from 'react';

const playerCards = [
  ['GETAFE CF', 'Espanha', 'https://static.wixstatic.com/media/933cdd_205438f6941b4a4ab93e71747b9d3d8e~mv2.png'],
  ['NOVOHORIZONTINO', 'Brasil', 'https://static.wixstatic.com/media/933cdd_1bd05dce59264c96aaf31a31e0a59341~mv2.png'],
  ['ATLETICO', 'Espanha', 'https://static.wixstatic.com/media/933cdd_57a7f61662d8485d876dfad0cd849b17~mv2.jpg'],
  ['SC BRAGA', 'Portugal', 'https://static.wixstatic.com/media/933cdd_7cc3cf595f684a1faec143ec04b34966~mv2.jpg'],
  ['ROYAL CITY', 'India', 'https://static.wixstatic.com/media/933cdd_a60fbc26f42f402c9674ca2f869bbafe~mv2.jpeg'],
  ['AMERICA', 'Brasil', 'https://static.wixstatic.com/media/933cdd_14ccc273b64f4cabbe2e143c50b26878~mv2.png'],
];

export default function MainLandingCarousel({
  eyebrow = '/ Plano de Carreira EC10 Talentos',
  title = 'PLANO DE CARREIRA EC10 TALENTOS',
  description = 'Descubra o melhor caminho para o atleta de acordo com a idade, momento e objetivo no futebol.',
  cards = playerCards,
  hideIntro = false,
  onCardClick,
}) {
  return (
    <section className="relative z-20 overflow-hidden border-y border-white/5 bg-[linear-gradient(180deg,#05060a,#030305)] py-12 sm:py-14 md:py-20">
      {!hideIntro ? (
        <div className="container relative z-20 mx-auto mb-8 px-4 md:mb-10 md:px-8">
          <div className="max-w-3xl">
            <span className="mb-4 block font-mono text-xs uppercase tracking-[0.3em] text-[#00f3ff]">
              {eyebrow}
            </span>
            <h2 className="text-[2rem] font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-4xl md:text-5xl">
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-gray-400 md:mt-5 md:text-base">
              {description}
            </p>
          </div>
        </div>
      ) : null}

      <div className="relative flex w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 bg-gradient-to-r from-[#020202] via-[#020202]/96 via-45% to-transparent sm:w-14 md:w-20">
          <div className="absolute inset-y-3 left-0 w-5 rounded-r-full bg-black/55 blur-2xl sm:w-8 md:w-10" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-gradient-to-l from-[#020202] via-[#020202]/96 via-45% to-transparent sm:w-14 md:w-20">
          <div className="absolute inset-y-3 right-0 w-5 rounded-l-full bg-black/55 blur-2xl sm:w-8 md:w-10" />
        </div>

        <div
          className="flex shrink-0 gap-3 px-4 sm:gap-5 md:p-6"
          style={{ width: 'max-content', animation: 'marquee 42s linear infinite' }}
        >
          {[...cards, ...cards, ...cards].map(([club, country, img], index) => (
            <button
              key={`${club}-${country}-${index}`}
              type="button"
              onClick={onCardClick}
              className="relative h-[16rem] w-[11.25rem] overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#0b0d12] text-left shadow-[0_30px_80px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:-translate-y-1 sm:h-[24rem] sm:w-[17rem] sm:rounded-[1.8rem] md:h-[26rem] md:w-[18.5rem] lg:h-[27rem] lg:w-[19rem]"
            >
              <img
                src={img}
                alt={club}
                className="absolute inset-0 h-full w-full object-cover object-top opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
              <div className="absolute bottom-0 w-full p-3 sm:p-4 md:p-5">
                <span className="mb-2 block truncate text-sm font-black uppercase leading-none tracking-tight text-white sm:text-xl md:text-2xl">
                  {club}
                </span>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                    {country}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
      `}</style>
    </section>
  );
}
