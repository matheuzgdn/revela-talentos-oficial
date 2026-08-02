import React, { useEffect, useMemo, useState } from 'react';
import { appClient } from '@/api/backendClient';
import {
  Activity, BarChart3, Bell, BookOpen, CalendarDays, ChevronRight,
  CirclePlay, Clock3, Dumbbell, Eye, Home, LockKeyhole, Megaphone,
  MessageCircle, Play, Search, ShieldCheck, Sparkles, Star, Target,
  TrendingUp, Trophy, User, Users, Video, Zap
} from 'lucide-react';

const GOLD = '#D99A19';
const logo = 'https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png';

const mentoriasDemo = [
  { id: 1, category: 'TÁTICA', title: 'Posicionamento inteligente', mentor: 'Henrique A.', duration: '32:15', progress: 75, image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=700&auto=format&fit=crop' },
  { id: 2, category: 'MENTAL', title: 'Mentalidade vencedora no futebol', mentor: 'Lucas Andrade', duration: '28:40', progress: 40, image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=700&auto=format&fit=crop' },
  { id: 3, category: 'NUTRIÇÃO', title: 'Alimentação para performance', mentor: 'Dra. Beatriz M.', duration: '26:10', progress: 60, image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=700&auto=format&fit=crop' },
];

const nav = [
  { id: 'inicio', label: 'Início', icon: Home },
  { id: 'mentorias', label: 'Mentorias', icon: Users },
  { id: 'explorar', label: 'Explorar', icon: Search },
  { id: 'comunidade', label: 'Comunidade', icon: MessageCircle },
  { id: 'perfil', label: 'Perfil', icon: User },
];

const quickActions = [
  { id: 'mentorias', label: 'Mentorias', icon: Users },
  { id: 'treinos', label: 'Treinos', icon: Dumbbell },
  { id: 'raiox', label: 'Raio-X', icon: Target },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
];

function ProgressRing({ value = 78, size = 92 }) {
  return (
    <div className="relative grid place-items-center rounded-full" style={{ width: size, height: size, background: `conic-gradient(${GOLD} ${value * 3.6}deg,#ECECEC 0)` }}>
      <div className="grid h-[76%] w-[76%] place-items-center rounded-full bg-white text-center">
        <strong className="text-2xl text-[#151515]">{value}%</strong>
      </div>
    </div>
  );
}

function MentoriaCard({ item }) {
  return (
    <article className="min-w-[244px] overflow-hidden rounded-[18px] border border-black/5 bg-white shadow-[0_8px_28px_rgba(20,20,20,.07)]">
      <div className="relative h-36 overflow-hidden">
        <img src={item.image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <span className="absolute left-3 top-3 rounded-md bg-[#E1A529] px-2 py-1 text-[10px] font-black text-[#201500]">{item.category}</span>
        <button className="absolute inset-0 m-auto grid h-11 w-11 place-items-center rounded-full bg-white/88 shadow-lg"><Play className="h-5 w-5 fill-[#1a1a1a]" /></button>
        <span className="absolute bottom-2 right-3 text-xs font-semibold text-white">{item.duration}</span>
      </div>
      <div className="p-3.5">
        <h3 className="min-h-12 text-[15px] font-bold leading-tight text-[#171717]">{item.title}</h3>
        <p className="mt-1 text-xs text-[#747474]">{item.mentor}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#ECECEC]"><div className="h-full rounded-full bg-[#D99A19]" style={{ width: `${item.progress}%` }} /></div>
          <span className="text-[11px] text-[#797979]">{item.progress}%</span>
        </div>
      </div>
    </article>
  );
}

function HomeView({ user, contents }) {
  const mentorias = useMemo(() => {
    const real = (contents || []).filter(item => item.category === 'mentoria').slice(0, 3).map((item, index) => ({
      id: item.id,
      category: 'MENTORIA', title: item.title, mentor: item.instructor || mentoriasDemo[index]?.mentor,
      duration: item.duration || mentoriasDemo[index]?.duration, progress: [75, 40, 60][index] || 0,
      image: item.thumbnail_url || mentoriasDemo[index]?.image,
    }));
    return real.length ? real : mentoriasDemo;
  }, [contents]);

  const firstName = user?.full_name?.split(' ')[0] || 'Miguel';
  return (
    <div className="space-y-6 pb-32">
      <header className="flex items-center justify-between pt-3">
        <img src={logo} alt="EC10 Talentos" className="h-14 w-auto object-contain" />
        <div className="flex-1 px-6">
          <h1 className="text-[25px] font-semibold text-[#171717]">Olá, {firstName}!</h1>
          <p className="text-sm text-[#8B8B8B]">Pronto para evoluir hoje?</p>
        </div>
        <button className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-[#D99A19] bg-[#F1F1F1]">
          {user?.profile_picture_url ? <img src={user.profile_picture_url} alt="" className="h-full w-full object-cover" /> : <User className="m-auto mt-3 h-8 w-8 text-[#777]" />}
          <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-[#D99A19] ring-2 ring-white" />
        </button>
      </header>

      <section className="relative min-h-[292px] overflow-hidden rounded-[26px] border border-black/5 bg-gradient-to-br from-white to-[#F8F3E9] p-7 shadow-[0_16px_45px_rgba(20,20,20,.08)]">
        <div className="relative z-10 max-w-[56%]">
          <p className="text-xs font-black tracking-[.16em] text-[#C48A17]">MENTORIA AO VIVO</p>
          <h2 className="mt-4 text-[30px] font-semibold leading-[1.08] text-[#161616]">Tomada de decisão no último terço</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#777]">Como escolher melhor e ser decisivo em campo.</p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs text-[#6B6B6B]"><span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> Hoje, 19:30</span><span className="flex items-center gap-1.5"><User className="h-4 w-4" /> Henrique A.</span></div>
          <button className="mt-6 flex min-w-52 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D79A1D] to-[#E9B73E] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#D99A19]/25"><CirclePlay className="h-5 w-5 fill-white" /> Entrar agora</button>
        </div>
        <div className="absolute right-4 top-5 rounded-full border border-black/5 bg-white/80 px-4 py-2 text-xs font-bold text-[#555]"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#D99A19]" />AO VIVO</div>
        <div className="absolute -bottom-10 right-0 h-[285px] w-[46%] rounded-tl-[110px] bg-gradient-to-br from-[#202020] to-[#050505] opacity-95" />
        <div className="absolute bottom-8 right-8 grid h-36 w-36 place-items-center rounded-full border border-white/10 bg-white/5"><Users className="h-20 w-20 text-white/85" /></div>
      </section>

      <section className="grid grid-cols-4 gap-3">
        {quickActions.map((item, index) => <button key={item.id} className={`rounded-[19px] border bg-white px-2 py-5 shadow-[0_7px_24px_rgba(20,20,20,.06)] ${index === 0 ? 'border-[#D99A19]/60 text-[#C88C14]' : 'border-black/5 text-[#252525]'}`}><item.icon className="mx-auto h-7 w-7" /><span className="mt-3 block text-sm font-semibold">{item.label}</span></button>)}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between"><h2 className="text-xl font-semibold text-[#1D1D1D]">Mentorias gravadas</h2><button className="text-xs font-semibold text-[#C78C17]">Ver todas</button></div>
        <div className="flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none]">{mentorias.map(item => <MentoriaCard key={item.id} item={item} />)}</div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between"><h2 className="text-xl font-semibold text-[#1D1D1D]">Próximas sessões</h2><button className="text-xs font-semibold text-[#C78C17]">Ver agenda</button></div>
        <div className="overflow-hidden rounded-[19px] border border-black/5 bg-white shadow-[0_8px_28px_rgba(20,20,20,.05)]">
          {[['24 MAI','19:30','Leitura de jogo e antecipação','Confirmado'],['27 MAI','18:00','Transição defensiva eficiente','Agendado'],['31 MAI','20:00','Resiliência e foco no objetivo','Pendente']].map((row,i)=><div key={row[2]} className={`grid grid-cols-[68px_68px_1fr_auto] items-center gap-3 px-4 py-3.5 ${i<2?'border-b border-black/5':''}`}><strong className="text-sm text-[#282828]">{row[0]}</strong><span className="text-sm text-[#8A8A8A]">{row[1]}</span><div><p className="text-sm font-semibold text-[#252525]">{row[2]}</p><p className="text-[11px] text-[#858585]">Com mentor EC10</p></div><span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${i===0?'bg-emerald-50 text-emerald-700':i===1?'bg-blue-50 text-blue-600':'bg-amber-50 text-amber-700'}`}>{row[3]}</span></div>)}
        </div>
      </section>

      <section className="grid grid-cols-[110px_1fr_180px] items-center gap-5 rounded-[22px] border border-black/5 bg-white p-5 shadow-[0_8px_28px_rgba(20,20,20,.06)]">
        <ProgressRing value={78} />
        <div><div className="flex items-center gap-2"><h3 className="font-bold text-[#202020]">Plano Atleta EC10</h3><span className="rounded-full bg-[#FFF5DA] px-2 py-1 text-[10px] font-bold text-[#B77B08]">Nível Ouro</span></div><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#ECECEC]"><div className="h-full w-[78%] bg-[#D99A19]" /></div><p className="mt-3 text-xs text-[#858585]">Foco atual: Performance e Visibilidade</p></div>
        <button className="rounded-xl bg-[#FAFAFA] p-4 text-left text-xs text-[#666]"><span className="block">Próximo passo</span><strong className="mt-1 block text-sm text-[#292929]">Mentoria ao vivo hoje 19:30</strong></button>
      </section>
    </div>
  );
}

function PlaceholderView({ active }) {
  const map = {
    mentorias: { title: 'Mentorias', desc: 'Trilhas gravadas, sessões ao vivo e especialistas para atleta e família.', icon: BookOpen },
    explorar: { title: 'Explorar', desc: 'Treinos, oportunidades, atletas em destaque e conteúdos recomendados.', icon: Search },
    comunidade: { title: 'Comunidade', desc: 'Uma rede segura de evolução, desafios e conquistas verificadas.', icon: Users },
    perfil: { title: 'Perfil profissional', desc: 'Vídeos, Raio-X, evolução, visualizações e passaporte esportivo.', icon: Trophy },
  };
  const item = map[active] || map.explorar;
  return <div className="pb-32 pt-8"><div className="rounded-[30px] border border-black/5 bg-white p-8 shadow-[0_16px_45px_rgba(20,20,20,.08)]"><div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#FFF4DA] text-[#C88C14]"><item.icon className="h-8 w-8" /></div><h1 className="mt-6 text-3xl font-bold text-[#181818]">{item.title}</h1><p className="mt-3 max-w-md text-[#747474]">{item.desc}</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{['Conteúdo personalizado','Progresso verificado','Acompanhamento dos pais','Recomendação inteligente'].map(x=><div key={x} className="flex items-center gap-3 rounded-2xl border border-black/5 p-4"><ShieldCheck className="h-5 w-5 text-[#D99A19]" /><span className="font-medium text-[#333]">{x}</span></div>)}</div></div></div>;
}

export default function RevelaAppPremium() {
  const [active, setActive] = useState('inicio');
  const [user, setUser] = useState(null);
  const [contents, setContents] = useState([]);

  useEffect(() => {
    Promise.all([
      appClient.auth.me().catch(() => null),
      appClient.entities.Content.filter({ is_published: true }, '-created_date', 20).catch(() => [])
    ]).then(([currentUser, currentContents]) => { setUser(currentUser); setContents(currentContents || []); });
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] overflow-y-auto bg-[#F8F7F4] text-[#171717]">
      <main className="mx-auto min-h-screen w-full max-w-[960px] px-5 pb-24 pt-5 sm:px-8">
        {active === 'inicio' ? <HomeView user={user} contents={contents} /> : <PlaceholderView active={active} />}
      </main>
      <nav className="fixed bottom-0 left-1/2 z-[1010] w-full max-w-[960px] -translate-x-1/2 border-t border-black/5 bg-white/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_30px_rgba(20,20,20,.08)] backdrop-blur-xl">
        <div className="grid grid-cols-5 gap-1">{nav.map(item=><button key={item.id} onClick={()=>setActive(item.id)} className={`flex flex-col items-center gap-1.5 rounded-xl py-1.5 text-[11px] font-medium transition ${active===item.id?'text-[#D99A19]':'text-[#777]'}`}><item.icon className={`h-6 w-6 ${active===item.id?'fill-[#D99A19]/15':''}`} />{item.label}</button>)}</div>
      </nav>
    </div>
  );
}
