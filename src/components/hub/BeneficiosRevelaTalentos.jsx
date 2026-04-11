import React from 'react';

const servicesSection = {
  eyebrow: '/ Vantagens Exclusivas',
  title: 'BENEFÍCIOS',
  outlinedWord: 'REVELA TALENTOS',
  services: [
    {
      title: 'Mentoria Coletiva',
      highlight: 'Exclusivo',
      text: 'Encontros coletivos com orientação avançada para fortalecer a mentalidade do atleta, aumentar a confiança e direcionar a tomada de decisão dentro do futebol adolescente.',
      media:
        'https://static.wixstatic.com/media/933cdd_5a16fbb433bd42a9917cf902c77c69a3~mv2.jpg/v1/fill/w_270,h_600,al_c,lg_1,q_80,enc_auto/933cdd_5a16fbb433bd42a9917cf902c77c69a3~mv2.jpg',
      isVideo: false,
    },
    {
      title: 'SELETIVA ONLINE',
      highlight: 'Exclusivo',
      text: 'Envio online de vídeo e informações do atleta para análise da nossa equipe, facilitando a avaliação e o direcionamento para oportunidades reais sem precisar viajar.',
      media:
        'https://video.wixstatic.com/video/933cdd_508da8c819d846178e59499261f1d9dc/1080p/mp4/file.mp4',
      isVideo: true,
    },
    {
      title: 'Marketing Esportivo',
      highlight: '',
      text: 'Edição de vídeo, flyers, fotos e divulgação da imagem do atleta em nossas redes sociais, criando uma vitrine profissional de alto nível.',
      media:
        'https://video.wixstatic.com/video/933cdd_dda817e38175467796a8ba4ae14b52bc/1080p/mp4/file.mp4',
      isVideo: true,
    },
    {
      title: 'Curso de Inglês',
      highlight: '',
      text: 'Curso preparatório para o futebol internacional e adaptação a novas experiências. Essencial para jovens sonhando com bolsas.',
      media: 'https://cdn.awsli.com.br/800x800/900/900758/produto/171893169/3714a6d43e.jpg',
      isVideo: false,
    },
    {
      title: 'Avaliação Internacional',
      highlight: 'Exterior',
      text: 'Avaliação em clubes parceiros da nossa empresa no exterior, sem depender da imprecisão de processos de peneira.',
      media:
        'https://video.wixstatic.com/video/933cdd_eb14b07c4db843ac878f02fed62bb4c6/720p/mp4/file.mp4',
      isVideo: true,
    },
    {
      title: 'Preparação Física',
      highlight: '',
      text: 'Preparação física focada em força, velocidade e desenvolvimento global para aprimorar a saúde geral.',
      media: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800',
      isVideo: false,
    },
  ],
};

function normalizeSearchText(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function InfoCard({ title, text, media, isVideo, highlight, expanded, onToggle }) {
  const normalizedTitle = normalizeSearchText(title);
  const coverPositionClass = normalizedTitle.includes('mentoria')
    ? 'object-[center_18%]'
    : 'object-center';

  return (
    <article className="group relative min-h-[22rem] overflow-hidden rounded-[1.4rem] border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.45)] transition-all duration-500 hover:-translate-y-2 hover:border-[#00f3ff]/25 sm:min-h-[30rem] sm:rounded-[2rem]">
      {isVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-50 transition-opacity duration-700 group-hover:opacity-70"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={media} type="video/mp4" />
        </video>
      ) : (
        <img
          className={`absolute inset-0 h-full w-full ${coverPositionClass} object-cover opacity-50 transition-opacity duration-700 group-hover:opacity-70`}
          src={media}
          alt={title}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/84 via-black/36 to-transparent" />

      {highlight ? (
        <div className="absolute left-4 top-4 rounded-full border border-[#00f3ff]/35 bg-black/55 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#7cecff] backdrop-blur sm:left-5 sm:top-5 sm:text-[10px] sm:tracking-[0.24em]">
          {highlight}
        </div>
      ) : null}

      <div className="absolute bottom-0 left-0 z-10 w-full p-3.5 text-left sm:p-6 md:p-7">
        <div
          className={`rounded-[1.2rem] border border-white/10 px-4 py-4 shadow-[0_18px_38px_rgba(0,0,0,0.34)] backdrop-blur-md transition-all duration-300 sm:rounded-[1.5rem] sm:px-5 sm:py-5 ${
            expanded
              ? 'bg-[linear-gradient(180deg,rgba(5,9,18,0.84),rgba(5,9,18,0.96))]'
              : 'bg-[linear-gradient(180deg,rgba(8,12,22,0.14),rgba(5,9,18,0.82))]'
          }`}
        >
          <h3 className="font-display text-base font-black uppercase leading-tight text-white sm:text-2xl">
            {title}
          </h3>

          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              expanded
                ? 'mt-3 max-h-32 border-t border-white/10 pt-3 opacity-100 sm:max-h-40'
                : 'mt-0 max-h-0 border-t border-transparent pt-0 opacity-0'
            }`}
          >
            <div className="max-h-28 overflow-y-auto pr-1 sm:max-h-36">
              <p className="text-[11px] leading-relaxed text-white/88 sm:text-sm">{text}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggle}
            className="mt-3 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#00f3ff] transition-colors hover:text-white sm:mt-4 md:text-xs md:tracking-[0.24em]"
          >
            {expanded ? 'Fechar' : 'Saber mais'}
            <span className={`text-base leading-none transition-transform duration-300 ${expanded ? 'rotate-45' : ''}`}>
              +
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function BeneficiosRevelaTalentos() {
  const [expandedCard, setExpandedCard] = React.useState(null);
  const services = servicesSection.services;
  const marqueeServices = [...services, ...services];

  const getCardKey = (service, index) => `${service.title}-${index}`;

  const handleToggle = (cardKey) => {
    setExpandedCard((current) => (current === cardKey ? null : cardKey));
  };

  return (
    <section
      id="servicos"
      className="relative overflow-hidden border-b border-white/5 bg-[#030305] py-12 sm:py-14 md:py-24"
    >
      <div className="container relative z-10 mx-auto border-t border-white/5 px-4 pt-10 text-center sm:pt-12 md:pt-16">
        <div className="mx-auto mb-10 max-w-4xl sm:mb-16">
          <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-[#00f3ff]">
            {servicesSection.eyebrow}
          </span>
          <h2 className="font-display text-[2rem] font-bold uppercase leading-[0.95] text-white md:text-5xl">
            {servicesSection.title}{' '}
            <span style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.4)', color: 'transparent' }}>
              {servicesSection.outlinedWord}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:hidden">
          {services.map((service, index) => (
            <InfoCard
              key={`${service.title}-${index}`}
              title={service.title}
              text={service.text}
              media={service.media}
              isVideo={service.isVideo}
              highlight={service.highlight}
              expanded={expandedCard === getCardKey(service, index)}
              onToggle={() => handleToggle(getCardKey(service, index))}
            />
          ))}
        </div>

        <div className="relative mx-auto hidden max-w-7xl overflow-hidden md:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#030305] via-[#030305]/90 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#030305] via-[#030305]/90 to-transparent" />

          <div
            className="flex gap-6"
            style={{
              width: 'max-content',
              animation: 'servicesMarquee 34s linear infinite',
              animationPlayState: expandedCard ? 'paused' : 'running',
            }}
          >
            {marqueeServices.map((service, index) => (
              <div key={`${service.title}-${index}`} className="w-[18.5rem] shrink-0 lg:w-[19rem]">
                <InfoCard
                  title={service.title}
                  text={service.text}
                  media={service.media}
                  isVideo={service.isVideo}
                  highlight={service.highlight}
                  expanded={expandedCard === getCardKey(service, index)}
                  onToggle={() => handleToggle(getCardKey(service, index))}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes servicesMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }
      `}</style>
    </section>
  );
}
