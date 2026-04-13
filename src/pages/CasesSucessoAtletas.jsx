import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Star, Target, Trophy, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';

const proofStats = [
  {
    value: '5.0',
    label: 'avaliacao media',
    detail: '12.3 mil reviews na landing atual',
    icon: Star,
  },
  {
    value: '1200+',
    label: 'atletas conectados',
    detail: 'base ativa em desenvolvimento',
    icon: Users,
  },
  {
    value: '800+',
    label: 'oportunidades criadas',
    detail: 'ponte com clubes e olheiros',
    icon: Trophy,
  },
  {
    value: '18',
    label: 'paises alcancados',
    detail: 'rede global de contatos',
    icon: Globe,
  },
  {
    value: '85%',
    label: 'taxa de sucesso',
    detail: 'atletas que alcancaram seus objetivos',
    icon: Target,
  },
];

const heroCases = [
  {
    name: 'Matheus Alves',
    tag: 'contratado',
    age: '18 anos',
    role: 'Extremo esquerdo',
    image: 'https://images.unsplash.com/photo-1600250395178-40fe752e5189?q=80&w=1200&auto=format&fit=crop',
    story: 'Aprovado na base de um gigante paulista em 4 semanas.',
  },
  {
    name: 'Joao "Foguete"',
    tag: 'pro',
    age: '17 anos',
    role: 'Lateral direito',
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1200&auto=format&fit=crop',
    story: 'Velocidade maxima no sistema virou atencao europeia e contrato profissional.',
  },
  {
    name: 'Lucas Pereira',
    tag: 'europa',
    age: '19 anos',
    role: 'Medio centro',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
    story: 'Entrou no radar internacional pelo perfil analitico e leitura de jogo.',
  },
];

const galleryCases = [
  {
    name: 'Gabriel Santos',
    badge: 'artilheiro',
    role: 'Atacante | 22 anos',
    club: 'Santos FC',
    image: 'https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=900&auto=format&fit=crop',
    highlight: 'Artilheiro Paulista Sub-20 e convocado para a Selecao Sub-23.',
  },
  {
    name: 'Maria Silva',
    badge: 'destaque',
    role: 'Meio-campo | 19 anos',
    club: 'Corinthians',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b332?w=900&auto=format&fit=crop',
    highlight: 'Melhor jogadora em SP e destaque na Copa do Brasil.',
  },
  {
    name: 'Lucas Oliveira',
    badge: 'campeao',
    role: 'Zagueiro | 24 anos',
    club: 'Palmeiras',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop',
    highlight: 'Zagueiro revelacao com titulo paulista no curriculo.',
  },
  {
    name: 'Ana Costa',
    badge: 'selecao',
    role: 'Goleira | 21 anos',
    club: 'Sao Paulo FC',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&auto=format&fit=crop',
    highlight: 'Melhor goleira paulista e presenca em convocacoes Sub-20.',
  },
  {
    name: 'Rafael Mendes',
    badge: 'base forte',
    role: 'Lateral | 20 anos',
    club: 'Flamengo',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop',
    highlight: 'Revelacao carioca e campeao brasileiro Sub-20.',
  },
  {
    name: 'Carla Rodrigues',
    badge: 'top scorer',
    role: 'Atacante | 23 anos',
    club: 'Internacional',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&auto=format&fit=crop',
    highlight: 'Artilheira gaucha com convocacao para a Selecao Brasileira.',
  },
];

const spotlightSteps = [
  {
    title: 'visibilidade imediata',
    text: 'Fotos, indicadores e posicionamento certo para chamar a atencao de quem decide.',
  },
  {
    title: 'analise que gera valor',
    text: 'Cada caso bem apresentado vira argumento real para o proximo contato com clubes.',
  },
  {
    title: 'resultado que vira prova social',
    text: 'Quando um atleta cresce, a propria landing passa a vender a autoridade da plataforma.',
  },
];

function StatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <div className="group relative overflow-hidden rounded-[1.6rem] border border-cyan-400/18 bg-[linear-gradient(180deg,rgba(5,10,18,0.92),rgba(5,10,18,0.78))] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_0_28px_rgba(34,211,238,0.14)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_38%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-3xl font-black text-white sm:text-4xl">{stat.value}</p>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300/80">{stat.label}</p>
          <p className="mt-2 max-w-[22ch] text-sm leading-6 text-white/58">{stat.detail}</p>
        </div>
        <div className="rounded-2xl border border-cyan-400/18 bg-cyan-400/10 p-3 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.18)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function HeroCaseCard({ item, featured }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-[1.8rem] border border-cyan-400/18 bg-[#07111f] shadow-[0_28px_70px_rgba(0,0,0,0.45)] transition-all duration-500 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_0_32px_rgba(34,211,238,0.16)] ${
        featured ? 'sm:col-span-2 sm:min-h-[28rem]' : 'min-h-[13rem]'
      }`}
    >
      <img
        src={item.image}
        alt={item.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.05),rgba(2,6,23,0.58)_52%,rgba(2,6,23,0.96)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.24),transparent_30%)] opacity-70" />

      <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex items-center rounded-full border border-cyan-300/28 bg-[rgba(8,47,73,0.76)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.16)]">
            {item.tag}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">{item.age}</span>
        </div>

        <div className="max-w-[24rem]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300/72">{item.role}</p>
          <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-white sm:text-4xl">{item.name}</h3>
          <p className="mt-3 text-sm leading-6 text-white/74 sm:text-base">{item.story}</p>
        </div>
      </div>
    </article>
  );
}

function GalleryCaseCard({ item }) {
  return (
    <article className="group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#08101b] shadow-[0_22px_58px_rgba(0,0,0,0.34)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.02),rgba(2,6,23,0.38)_48%,rgba(2,6,23,0.94)_100%)]" />
        <div className="absolute left-4 top-4 inline-flex rounded-full border border-cyan-300/22 bg-[rgba(8,47,73,0.72)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-100">
          {item.badge}
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white">{item.name}</h3>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300/80">{item.role}</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/72">
            {item.club}
          </span>
        </div>
        <p className="text-sm leading-6 text-white/68">{item.highlight}</p>
      </div>
    </article>
  );
}

export default function CasesSucessoAtletas() {
  return (
    <div className="relative overflow-hidden bg-[#040507] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.16),transparent_32%),linear-gradient(180deg,#040507_0%,#07111f_48%,#040507_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(56,189,248,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.06) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />

      <main className="relative z-10">
        <section className="border-b border-white/6 px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:gap-12">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/18 bg-cyan-400/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                  lead page de cases de sucesso
                </div>

                <h1 className="mt-6 text-4xl font-black uppercase leading-[0.92] tracking-tighter text-white sm:text-5xl lg:text-7xl">
                  uma landing
                  <span className="block bg-[linear-gradient(90deg,#ffffff_0%,#67e8f9_48%,#38bdf8_100%)] bg-clip-text text-transparent">
                    so com atletas
                  </span>
                  que ja provaram
                </h1>

                <p className="mt-6 max-w-xl text-base leading-8 text-white/72 sm:text-lg">
                  Esta pagina foi pensada para vender autoridade visualmente: fotos fortes, resultados claros,
                  status de evolucao e provas sociais que ja existem no universo da plataforma.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full border-0 bg-[linear-gradient(90deg,#06b6d4_0%,#2563eb_100%)] px-7 text-base font-semibold text-white shadow-[0_18px_45px_rgba(14,165,233,0.32)] hover:opacity-95"
                  >
                    <Link to={createPageUrl('RevelaTalentos')}>
                      Quero ser o proximo case
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-cyan-400/24 bg-[rgba(8,47,73,0.32)] px-7 text-base font-semibold text-cyan-100 hover:bg-[rgba(8,47,73,0.48)] hover:text-white"
                  >
                    <Link to={createPageUrl('PlanoCarreira')}>
                      Ver estrutura completa
                    </Link>
                  </Button>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/58 sm:gap-5">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
                    fotos + resultados + prova social
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
                    black premium + azul neon
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <HeroCaseCard item={heroCases[0]} featured />
                <HeroCaseCard item={heroCases[1]} />
                <HeroCaseCard item={heroCases[2]} />
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300/78">provas sociais da landing atual</p>
                <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
                  numeros que sustentam a pagina
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-white/58 sm:text-base">
                A ideia aqui e simples: antes mesmo do lead pedir mais informacoes, ele ja enxerga volume,
                alcance e resultado real.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {proofStats.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/6 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300/78">mural de atletas</p>
                <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
                  cases com rosto, clube e conquista
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-white/58 sm:text-base">
                Em vez de uma LP genérica, o foco desta versao esta todo nos atletas: foto forte, contexto
                esportivo e motivo claro para confiar.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {galleryCases.map((item) => (
                <GalleryCaseCard key={item.name} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="relative overflow-hidden rounded-[2rem] border border-cyan-400/16 bg-[#07111f] shadow-[0_28px_72px_rgba(0,0,0,0.4)]">
              <img
                src={heroCases[0].image}
                alt={heroCases[0].name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.12),rgba(2,6,23,0.72)_55%,rgba(2,6,23,0.96)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%)]" />

              <div className="relative flex min-h-[28rem] flex-col justify-end p-6 sm:p-8">
                <span className="mb-5 inline-flex w-fit rounded-full border border-cyan-300/24 bg-[rgba(8,47,73,0.72)] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-100">
                  flagship case
                </span>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300/78">{heroCases[0].role}</p>
                <h3 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">{heroCases[0].name}</h3>
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/74 sm:text-lg">{heroCases[0].story}</p>
                <div className="mt-6 inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm text-white/70 backdrop-blur">
                  <TrendingUp className="h-4 w-4 text-cyan-300" />
                  caso usado como ancora visual da landing
                </div>
              </div>
            </article>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-cyan-400/16 bg-[linear-gradient(180deg,rgba(6,10,20,0.95),rgba(7,17,31,0.82))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300/78">como a LP se sustenta</p>
                <h3 className="mt-3 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                  cada foto precisa vender um argumento
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
                  Por isso a pagina trabalha com estrutura curta, repeticao de prova visual e blocos
                  que deixam o visitante sempre perto de um novo case relevante.
                </p>
              </div>

              {spotlightSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,17,31,0.92),rgba(5,9,18,0.96))] p-5 shadow-[0_20px_48px_rgba(0,0,0,0.28)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/18 bg-cyan-400/10 text-lg font-black text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.16)]">
                      0{index + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-black uppercase tracking-tight text-white">{step.title}</h4>
                      <p className="mt-2 text-sm leading-7 text-white/60">{step.text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 pt-2 sm:px-6 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-[2.2rem] border border-cyan-400/18 bg-[linear-gradient(135deg,rgba(5,10,18,0.98),rgba(8,47,73,0.58))] p-8 shadow-[0_28px_74px_rgba(0,0,0,0.38)] sm:p-10 lg:p-14">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.18),transparent_34%)]" />
              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300/78">fechamento da lead page</p>
                  <h2 className="mt-3 text-3xl font-black uppercase leading-[0.96] tracking-tight text-white sm:text-5xl">
                    se os cases ja vendem por voce,
                    <span className="block bg-[linear-gradient(90deg,#ffffff_0%,#67e8f9_48%,#38bdf8_100%)] bg-clip-text text-transparent">
                      a conversa com o lead comeca mais quente
                    </span>
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-white/66 sm:text-lg">
                    Essa versao da LP foi desenhada para concentrar atencao total nas fotos e nos resultados
                    dos atletas, sem desviar para modulos, servicos ou explicacoes longas demais.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full border-0 bg-white px-7 text-base font-semibold text-black hover:bg-white/92"
                  >
                    <Link to={createPageUrl('RevelaTalentos')}>
                      Abrir plataforma
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-cyan-400/24 bg-cyan-400/10 px-7 text-base font-semibold text-cyan-100 hover:bg-cyan-400/16 hover:text-white"
                  >
                    <Link to={createPageUrl('PlanoInternacional')}>
                      Ver plano internacional
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
