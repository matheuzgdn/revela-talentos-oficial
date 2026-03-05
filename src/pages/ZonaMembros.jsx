import React, { useState, useEffect, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Home, Tv, Globe, BookOpen, Award, X, Play, Calendar, Check, Star, Search, Clock, AlertTriangle, Trophy, Flame, CheckCircle, Map, AlertCircle, Hourglass, Rocket, ShieldCheck, Bell, MoreHorizontal, LockKeyhole, MapPin, Sparkles, ShoppingCart, Lock } from 'lucide-react';

/* ================== CONSTANTS ================== */
const PURCHASE_URL = 'https://ec10talentos.wixsite.com/website-10/checkout-1?checkoutId=ca727402-ea59-4e7a-84dc-e0f05aa8f174&currency=BRL&contentAppId=324cf725-53d9-4bb2-b8f6-0c8ec9a77f45&contentComponentId=4ca49999-12ba-46d7-8dca-03ee4a6c1b7c';
const EVENTS = [
    { id: 1, nome: 'Sudacademy', city: 'Belo Horizonte', country: 'Brasil', month: 'Dezembro', pos: { top: '61.5%', left: '37.5%' } },
    { id: 2, nome: 'Libertacademy', city: 'Buenos Aires', country: 'Argentina', month: 'Julho', pos: { top: '76.4%', left: '34.3%' } },
    { id: 3, nome: 'Eurocamp', city: 'Madrid', country: 'Espanha', month: 'Agosto', pos: { top: '28%', left: '48.5%' } },
];
const LOGO_FULL = 'https://static.wixstatic.com/media/933cdd_2a46d0206f1149cc87acf3ca1dfc003b~mv2.png/v1/fill/w_537,h_537,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/933cdd_2a46d0206f1149cc87acf3ca1dfc003b~mv2.png';
const LOGO_ICON = 'https://static.wixstatic.com/media/933cdd_4d0be2018e134c90accb37a4a6261fa4~mv2.png/v1/fill/w_537,h_537,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/933cdd_4d0be2018e134c90accb37a4a6261fa4~mv2.png';

/* ================== BASE COMPONENTS ================== */
const GS = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    :root{font-family:'Inter',sans-serif;}
    .zh::-webkit-scrollbar{display:none;}.zh{-ms-overflow-style:none;scrollbar-width:none;}
    .zc{transition:all 0.4s cubic-bezier(0.2,0.8,0.2,1);}
    .zc:hover{transform:translateY(-4px);box-shadow:0 15px 30px -10px rgba(0,0,0,0.9),0 0 20px rgba(0,168,225,0.3);border-color:#00a8e1;}
    @keyframes zp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
    .zp{animation:zp 0.5s cubic-bezier(0.2,0.8,0.2,1) forwards;}
  `}</style>
);

const Bdg = ({ txt, type = 'df', Ic }) => {
    const s = {
        rv: 'bg-black/50 border border-[#00a8e1] shadow-[0_0_10px_rgba(0,168,225,0.5)] text-[#00a8e1] font-bold',
        al: 'bg-amber-500/20 border border-amber-500 text-amber-400 font-bold',
        df: 'bg-white/10 border border-white/20 text-white font-semibold',
    };
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] md:text-[11px] uppercase tracking-wider ${s[type] || s.df}`}>
            {Ic && <Ic className="w-2.5 h-2.5 md:w-3 md:h-3" />}{txt}
        </span>
    );
};

const PBtn = ({ children, cls = '', v = 'pr', Ic, ...p }) => {
    const vv = {
        pr: 'bg-white text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]',
        bl: 'bg-[#00a8e1] text-white hover:shadow-[0_0_20px_rgba(0,168,225,0.5)]',
        ou: 'bg-transparent text-white border border-white/20 hover:bg-white/10',
        ob: 'bg-transparent text-[#00a8e1] border border-[#00a8e1]/50 hover:bg-[#00a8e1]/10',
    };
    return (
        <button className={`flex items-center justify-center gap-1.5 md:gap-2 font-black py-2.5 md:py-3 px-5 md:px-8 rounded-full transition-all duration-300 hover:scale-105 ${vv[v]} ${cls}`} {...p}>
            {Ic && <Ic className="w-4 h-4 md:w-5 md:h-5 fill-current" />}
            <span className="tracking-wide text-xs md:text-sm">{children}</span>
        </button>
    );
};

const UpgModal = ({ onClose }) => (
    <div className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
        <div className="w-full max-w-sm bg-gradient-to-br from-[#0A0A0A] via-[#0D1117] to-[#0A0A0A] border border-[#00a8e1]/30 rounded-3xl p-7 shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#00a8e1]/5 via-transparent to-[#0066FF]/5 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-[#00a8e1] to-transparent" />
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center border border-white/10"><X className="w-4 h-4 text-white" /></button>
            <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-[#00a8e1]/20 rounded-full blur-2xl" />
                <div className="w-20 h-20 bg-gradient-to-br from-[#00a8e1]/20 to-[#0066FF]/20 border border-[#00a8e1]/30 rounded-full flex items-center justify-center relative">
                    <Lock className="w-9 h-9 text-[#00a8e1]" />
                </div>
            </div>
            <h2 className="text-white font-black text-2xl text-center mb-2 tracking-tight">
                Conteudo <span className="text-[#00a8e1]">Bloqueado</span>
            </h2>
            <p className="text-gray-400 text-sm text-center mb-6 leading-relaxed">
                Este conteudo faz parte do pacote completo da plataforma EC10 Talentos. Adquira agora para ter acesso ilimitado.
            </p>
            <a href={PURCHASE_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-[#00a8e1] to-[#0066FF] text-black font-black text-base rounded-2xl shadow-xl shadow-[#00a8e1]/30 transition-all duration-300 hover:-translate-y-0.5 mb-3">
                <ShoppingCart className="w-5 h-5" />Adquirir Acesso Completo
            </a>
            <button onClick={onClose} className="w-full py-3 text-gray-500 text-sm font-medium hover:text-gray-300 transition-colors">Agora nao</button>
        </div>
    </div>
);

const VCard = ({ item, onPlay }) => {
    const isLocked = !item.is_zona_membros_unlocked;
    return (
        <div className="flex-none w-[130px] md:w-[220px] aspect-[3/4] relative rounded-2xl overflow-hidden zc bg-[#0a0f14] cursor-pointer snap-start border border-white/5 shadow-lg group" onClick={onPlay}>
            <img src={item.thumbnail_url || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400'} alt={item.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${isLocked ? 'blur-[3px] brightness-50' : 'opacity-70 group-hover:opacity-90'}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05080a] via-[#05080a]/50 to-transparent opacity-90" />
            {isLocked ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-20">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0a0f14]/80 border border-white/20 flex items-center justify-center">
                        <LockKeyhole className="w-4 h-4 md:w-5 md:h-5 text-[#00a8e1]" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black text-[#00a8e1] uppercase tracking-[0.2em]">Bloqueado</span>
                </div>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-black/20">
                    <div className="w-10 h-10 md:w-14 md:h-14 border-2 border-[#00a8e1] rounded-full flex items-center justify-center text-[#00a8e1] bg-[#00a8e1]/20">
                        <Play className="w-4 h-4 md:w-6 md:h-6 fill-current ml-0.5" />
                    </div>
                </div>
            )}
            <div className="absolute inset-x-0 bottom-0 p-2.5 md:p-4 z-20">
                <h4 className="font-bold text-white text-[10px] md:text-sm leading-tight line-clamp-2 drop-shadow-lg">{item.title}</h4>
                {item.duration && <div className="flex items-center gap-1 mt-1 text-[8px] md:text-[10px] text-white/70 font-bold"><Clock className="w-2.5 h-2.5 text-[#00a8e1]" />{item.duration}</div>}
            </div>
        </div>
    );
};

const CRow = ({ title, items, onPlay }) => {
    const r = useRef(null);
    if (!items || items.length === 0) return null;
    return (
        <div className="mb-8 md:mb-12 w-full">
            <h3 className="text-lg md:text-2xl font-black text-white tracking-tight flex items-center gap-2 md:gap-3 mb-4 md:mb-6 px-1">
                <div className="w-1 h-4 md:w-1.5 md:h-6 bg-[#00a8e1] rounded-full shadow-[0_0_10px_#00a8e1]" />
                {title}
            </h3>
            <div ref={r} className="flex gap-3 md:gap-5 overflow-x-auto zh pb-4 pt-1 snap-x snap-mandatory">
                {items.map((item, i) => <VCard key={item.id || i} item={item} onPlay={() => onPlay(item)} />)}
            </div>
        </div>
    );
};

/* ================== PAGE VIEWS ================== */

const InicioView = ({ contents, onPlay, onNav }) => {
    const [sl, setSl] = useState(0);
    const slides = [
        { title: 'El proximo paso profesional', desc: 'Entrenamos familias y atletas.', badge: 'BIENVENIDA', img: 'https://images.unsplash.com/photo-1518659739433-286828987456?auto=format&fit=crop&q=80&w=1000' },
        { title: 'Aulas en vivo', desc: 'Proyectos y planos de carrera.', badge: 'ATENCION', img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=1000' },
    ];
    useEffect(() => { const t = setInterval(() => setSl(p => (p + 1) % slides.length), 6000); return () => clearInterval(t); }, []);
    const s = slides[sl];
    const latest = [...contents].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 10);
    const ment = contents.filter(c => c.category === 'mentoria').slice(0, 10);
    const trein = contents.filter(c => c.category === 'treino_tatico').slice(0, 10);
    const fis = contents.filter(c => c.category === 'preparacao_fisica').slice(0, 10);
    return (
        <div className="pb-8 md:pb-12 zp max-w-7xl mx-auto w-full">
            <div className="relative w-full rounded-3xl md:rounded-[2.5rem] bg-black p-5 md:p-14 overflow-hidden flex items-center shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(0,168,225,0.15)] border border-[#00a8e1]/40 mb-10 group">
                <div className="absolute inset-0">
                    <img src={s.img} alt="" className="w-full h-full object-cover opacity-50 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#05080a] via-[#05080a]/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05080a] via-[#05080a]/40 to-transparent" />
                </div>
                <div className="relative z-10 max-w-xl w-full">
                    <Bdg txt={s.badge} type="rv" Ic={ShieldCheck} />
                    <h1 className="text-2xl md:text-5xl font-black text-white leading-[1.1] mt-4 mb-3 drop-shadow-2xl">{s.title}</h1>
                    <p className="text-white/80 text-xs md:text-base font-medium mb-6 max-w-sm leading-relaxed">{s.desc}</p>
                    <PBtn onClick={() => onNav('empieza')} Ic={Play} v="pr">Comecar Agora</PBtn>
                </div>
            </div>
            <CRow title="Latest Release" items={latest} onPlay={onPlay} />
            {ment.length > 0 && <CRow title="Mentorias" items={ment} onPlay={onPlay} />}
            {trein.length > 0 && <CRow title="Treino Tatico" items={trein} onPlay={onPlay} />}
            {fis.length > 0 && <CRow title="Preparacao Fisica" items={fis} onPlay={onPlay} />}
            {contents.length === 0 && (
                <div className="text-center py-16 text-white/40">
                    <Play className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-bold">O admin adicionara videos em breve.</p>
                </div>
            )}
        </div>
    );
};

const EmpiezaView = ({ contents, onPlay }) => {
    const intro = contents[0];
    const isLocked = intro ? !intro.is_zona_membros_unlocked : true;
    return (
        <div className="zp max-w-7xl mx-auto pb-10 pt-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 md:p-3 bg-[#00a8e1]/10 rounded-xl border border-[#00a8e1]/40"><Rocket className="w-6 h-6 md:w-8 md:h-8 text-[#00a8e1]" /></div>
                <div><h2 className="text-xl md:text-3xl font-black text-white">EMPIEZA AQUI</h2><p className="text-[#8197a4] text-xs md:text-sm">Introduccion de la plataforma</p></div>
            </div>
            {intro ? (
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden group cursor-pointer border border-[#00a8e1]/30 bg-[#0a0f14] shadow-[0_15px_40px_rgba(0,0,0,0.8)] mb-6" onClick={() => onPlay(intro)}>
                    <img src={intro.thumbnail_url || 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1200'} alt="" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-5 md:p-10 z-20 w-full">
                        <Bdg txt="VIDEO PRINCIPAL" type="rv" Ic={Play} />
                        <h3 className="font-black text-xl md:text-4xl text-white mt-3 mb-2 drop-shadow-2xl">{intro.title}</h3>
                        {intro.description && <p className="text-white/80 text-xs md:text-base line-clamp-2">{intro.description}</p>}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30 backdrop-blur-sm">
                        {isLocked
                            ? <LockKeyhole className="w-12 h-12 text-[#00a8e1]" />
                            : <div className="w-16 h-16 md:w-24 md:h-24 border-2 border-[#00a8e1] rounded-full flex items-center justify-center text-[#00a8e1] group-hover:bg-[#00a8e1]/20 transition-colors"><Play className="w-6 h-6 md:w-10 md:h-10 ml-1.5 fill-current" /></div>
                        }
                    </div>
                </div>
            ) : (
                <div className="bg-[#0a0f14] border border-[#00a8e1]/20 rounded-2xl p-6 flex items-center justify-between mb-6">
                    <div><h3 className="font-bold text-white text-sm md:text-lg">Tus clases te esperan aqui.</h3><p className="text-[#00a8e1] font-bold text-xs">Disponibles muy pronto!</p></div>
                    <Hourglass className="w-8 h-8 text-[#00a8e1] animate-pulse" />
                </div>
            )}
            <CRow title="Todos os Cursos" items={contents.slice(0, 8)} onPlay={onPlay} />
        </div>
    );
};

const EnVivoView = ({ isLive }) => (
    <div className="zp max-w-4xl mx-auto h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className={`relative flex items-center justify-center w-20 h-20 md:w-32 md:h-32 bg-[#0a0f14] border rounded-full mb-6 ${isLive ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'border-[#00a8e1]/50 shadow-[0_0_30px_rgba(0,168,225,0.3)]'}`}>
            {isLive && <div className="absolute inset-0 border-2 border-red-500 rounded-full animate-ping opacity-30" />}
            <Tv className={`w-8 h-8 md:w-14 md:h-14 ${isLive ? 'text-red-400' : 'text-[#00a8e1]'}`} />
        </div>
        {isLive ? (
            <>
                <Bdg txt="AO VIVO AGORA" type="al" />
                <h1 className="text-3xl md:text-5xl font-black text-white mt-5 mb-4 tracking-tighter uppercase">Transmissao Ao Vivo!</h1>
                <a href="?page=Lives" className="mt-4 flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black py-3 px-8 rounded-full transition-all"><Play className="w-5 h-5 fill-white" /> Assistir Agora</a>
            </>
        ) : (
            <>
                <Bdg txt="Transmision en directo" type="rv" />
                <h1 className="text-3xl md:text-5xl font-black text-white mt-5 mb-4 tracking-tighter uppercase">Tus clases te esperan aqui.</h1>
                <p className="text-sm md:text-xl text-[#00a8e1] font-black flex items-center gap-2"><Hourglass className="w-4 h-4 animate-pulse" /> Disponibles muy pronto!</p>
            </>
        )}
    </div>
);

const IntercambioView = () => {
    const [at, setAt] = useState(null);
    return (
        <div className="zp max-w-7xl mx-auto pb-10 pt-4">
            <div className="bg-black rounded-[2rem] border border-[#00a8e1]/30 p-5 md:p-12 relative shadow-[0_20px_40px_rgba(0,0,0,0.9)] mb-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#00a8e1]/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="relative z-10">
                    <Bdg txt="OPORTUNIDAD GLOBAL" type="rv" Ic={Globe} />
                    <h1 className="text-2xl md:text-5xl font-black text-white mt-5 mb-6 uppercase leading-tight tracking-tighter">
                        INTERCAMBIOS EN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8e1] to-emerald-400">EUROPA Y BRASIL</span>
                    </h1>
                    <div className="bg-[#0a0f14]/80 rounded-2xl p-5 mb-6 border border-white/5">
                        <p className="text-white font-bold mb-3 text-sm flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Para participar:</p>
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/30 mb-3 text-emerald-400 font-bold text-xs"><CheckCircle className="w-4 h-4" /> Preseleccion obligatoria</div>
                        <ul className="space-y-3 text-white/80 text-xs md:text-sm">
                            {['Subir el video de tu hijo', 'Prepararlo mental y fisicamente', 'Nuevas reglas de alimentacion'].map((t, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <span className="w-6 h-6 shrink-0 rounded-full bg-[#0a0f14] border border-[#00a8e1]/50 flex items-center justify-center font-bold text-[#00a8e1] text-xs">{i + 1}</span>{t}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3"><PBtn v="bl">INSCRIBIRSE</PBtn><PBtn v="ou">LISTA DE ESPERA</PBtn></div>
                </div>
            </div>
            <div className="flex items-center justify-center gap-3 mb-8">
                <Trophy className="w-6 h-6 text-[#00a8e1] animate-pulse" />
                <h2 className="text-2xl md:text-4xl font-black uppercase">EC10 <span className="text-[#00a8e1]">Talentos</span></h2>
                <Trophy className="w-6 h-6 text-[#00a8e1] animate-pulse" />
            </div>
            <div className="relative w-full max-w-5xl mx-auto aspect-[2/1] group mb-10">
                <div className="absolute inset-0 bg-[#05080a] border border-[#00a8e1]/20 rounded-[2rem] overflow-hidden">
                    <div className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity flex items-center justify-center">
                        <svg viewBox="0 0 1000 500" className="w-full h-full">
                            <image href="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" width="1000" height="500" style={{ filter: 'invert(1) sepia(1) saturate(5) hue-rotate(175deg) brightness(0.6) contrast(2)' }} />
                        </svg>
                    </div>
                </div>
                {EVENTS.map(ev => (
                    <div key={ev.id} className="absolute flex flex-col items-center z-20"
                        style={{ top: ev.pos.top, left: ev.pos.left, transform: 'translate(-50%,-50%)' }}
                        onMouseEnter={() => setAt(ev.id)} onMouseLeave={() => setAt(null)}>
                        <div className="relative flex items-center justify-center cursor-pointer">
                            <div className="absolute w-8 h-8 bg-[#00a8e1]/30 rounded-full animate-ping" />
                            <MapPin className="relative w-5 h-5 md:w-7 md:h-7 text-[#00a8e1] drop-shadow-[0_0_10px_rgba(0,168,225,1)]" />
                        </div>
                        <div className={`absolute ${parseFloat(ev.pos.top) > 50 ? 'bottom-full mb-3' : 'top-full mt-3'} w-48 transition-all duration-300 ${at === ev.id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                            <div className="bg-[#05080a]/95 border border-[#00a8e1]/50 rounded-xl p-3">
                                <p className="text-[#00a8e1] font-bold text-sm flex items-center gap-1 mb-1"><Sparkles className="w-3 h-3" />{ev.nome}</p>
                                <p className="text-gray-300 text-xs mb-1"><Map className="w-3 h-3 inline mr-1 text-gray-500" />{ev.city}, {ev.country}</p>
                                <p className="text-[#00a8e1] font-bold uppercase text-xs"><Calendar className="w-3 h-3 inline mr-1" />{ev.month}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <h2 className="text-xl font-bold text-center text-white mb-4 uppercase tracking-widest flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5 text-[#00a8e1]" /> Agenda <span className="text-[#00a8e1]">Global</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {EVENTS.map(ev => (
                    <div key={ev.id + 'l'} className={`bg-[#0a0f14]/80 border rounded-2xl p-5 flex flex-col items-center text-center gap-3 transition-all duration-300 cursor-pointer ${at === ev.id ? 'border-[#00a8e1] -translate-y-2' : 'border-[#00a8e1]/20 hover:border-[#00a8e1]/60 hover:-translate-y-1'}`}
                        onMouseEnter={() => setAt(ev.id)} onMouseLeave={() => setAt(null)}>
                        <Trophy className="w-8 h-8 text-[#00a8e1]" />
                        <div><h3 className="text-lg font-bold text-white mb-1">{ev.nome}</h3><p className="text-gray-400 text-sm">{ev.city} - {ev.country}</p></div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#00a8e1]/30 bg-[#00a8e1]/10 w-full justify-center">
                            <Calendar className="w-4 h-4 text-[#00a8e1]" /><span className="font-bold text-[#00a8e1] uppercase text-xs tracking-wider">{ev.month}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ConsejosView = ({ contents, onPlay }) => {
    const d = contents.filter(c => ['preparacao_fisica', 'psicologia', 'nutricao'].includes(c.category)).slice(0, 6);
    return (
        <div className="zp max-w-7xl mx-auto pb-10 pt-4">
            <div className="mb-8">
                <h2 className="text-xl md:text-4xl font-black text-white uppercase mb-2 flex items-center gap-2">
                    <Flame className="w-6 h-6 md:w-9 md:h-9 text-amber-500 shrink-0" /> Consejos y Entrenamiento
                </h2>
                <p className="text-[#8197a4] font-medium text-xs md:text-base ml-1">Prepara a tu atleta para los intercambios.</p>
            </div>
            {d.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-10">
                    {d.map(item => {
                        const isLocked = !item.is_zona_membros_unlocked;
                        return (
                            <div key={item.id} className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer border border-[#00a8e1]/20 bg-[#0a0f14]" onClick={() => onPlay(item)}>
                                <img src={item.thumbnail_url || 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800'} alt={item.title}
                                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${isLocked ? 'blur-[3px] brightness-50' : 'opacity-60 group-hover:opacity-80'}`} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                {isLocked ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-20">
                                        <LockKeyhole className="w-8 h-8 text-[#00a8e1]" />
                                        <span className="text-[9px] font-black text-[#00a8e1] uppercase tracking-[0.2em]">Bloqueado</span>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-10 h-10 md:w-14 md:h-14 border border-[#00a8e1] rounded-full flex items-center justify-center text-[#00a8e1]">
                                            <Play className="w-4 h-4 md:w-6 md:h-6 fill-current ml-0.5" />
                                        </div>
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 p-3 md:p-5 z-20"><h3 className="font-black text-sm md:text-lg text-white leading-tight">{item.title}</h3></div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16 text-white/40 mb-10">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="font-bold">Nenhum conselho disponivel ainda.</p>
                </div>
            )}
            <div className="bg-[#05080a] border border-[#00a8e1]/40 rounded-3xl p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl md:text-2xl font-black text-white mb-2 uppercase">Quer ir mais alem?</h3>
                    <p className="text-[#00a8e1] font-bold mb-3 text-xs md:text-base">Acesse nossa MENTORIA COMPLETA.</p>
                    <ul className="text-white/80 text-xs md:text-base space-y-2">
                        {['Planos personalizados', 'Acompanhamento', 'Preparacao mental'].map((b, i) => (
                            <li key={i} className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-[#00a8e1]" /> {b}</li>
                        ))}
                    </ul>
                </div>
                <a href={PURCHASE_URL} target="_blank" rel="noopener noreferrer">
                    <PBtn v="bl">COMUNIQUE-SE CONOSCO</PBtn>
                </a>
            </div>
        </div>
    );
};

const MentoriasView = () => (
    <div className="zp max-w-7xl mx-auto pb-10 pt-4">
        <div className="bg-black rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-xl border border-[#00a8e1]/30 relative">
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#00a8e1]/10 rounded-full blur-[80px] pointer-events-none z-0" />
            <div className="p-6 md:p-12 lg:p-16 flex-1 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5 relative z-10">
                <div className="mb-4"><Bdg txt="ATENCAO FAMILIAS" type="al" Ic={AlertCircle} /></div>
                <h2 className="text-3xl md:text-5xl font-black text-[#00a8e1] leading-tight uppercase mb-3 tracking-tighter">
                    NOSSA MENTORIA ESTA EM ANALISE
                </h2>
                <p className="text-white/90 text-sm md:text-xl mb-6 font-bold max-w-lg">Prepare seu filho para o proximo nivel profissional.</p>
                <div className="flex flex-col gap-3">
                    <a href={PURCHASE_URL} target="_blank" rel="noopener noreferrer"><PBtn v="pr" cls="w-full">VAGAS LIMITADAS</PBtn></a>
                    <PBtn v="ob" cls="w-full">ENTRAR NA LISTA DE ESPERA</PBtn>
                </div>
            </div>
            <div className="p-6 md:p-12 lg:p-16 bg-[#05080a]/80 flex-1 flex flex-col justify-center relative z-10">
                <h3 className="text-xl md:text-2xl font-black text-white mb-6 uppercase flex items-center gap-2"><Star className="w-6 h-6 text-[#00a8e1]" /> Beneficios</h3>
                <ul className="space-y-4 mb-8">
                    {['Acompanhamento completo', 'Preparacao para eventos', 'Assessoria em viagens e documentacao', 'Cuidados fisicos e mentais'].map((b, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="w-6 h-6 shrink-0 rounded-full bg-[#0a0f14] border border-[#00a8e1]/50 flex items-center justify-center mt-0.5">
                                <Check className="w-3 h-3 text-[#00a8e1]" />
                            </div>
                            <span className="text-gray-200 font-medium text-xs md:text-base leading-snug">{b}</span>
                        </li>
                    ))}
                </ul>
                <div className="bg-amber-500/5 border border-amber-500/30 p-4 rounded-xl">
                    <h4 className="text-amber-500 font-bold flex items-center gap-2 mb-2 text-xs md:text-base"><AlertTriangle className="w-4 h-4" /> IMPORTANTE</h4>
                    <p className="text-white/70 text-[10px] md:text-sm leading-relaxed">
                        Considere nossos eventos e a preparacao adequada para que seu atleta esteja pronto.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

/* ================== MAIN APP ================== */
export default function ZonaMembros() {
    const [tab, setTab] = useState('inicio');
    const [mob, setMob] = useState(false);
    const [hov, setHov] = useState(false);
    const [user, setUser] = useState(null);
    const [contents, setContents] = useState([]);
    const [live, setLive] = useState(false);
    const [upg, setUpg] = useState(false);
    const [sel, setSel] = useState(null);
    const [loading, setLoading] = useState(true);

    const MENU = [
        { id: 'inicio', label: 'Inicio', icon: Home },
        { id: 'empieza', label: 'Empieza aqui', icon: Play },
        { id: 'envivo', label: 'En vivo', icon: Tv },
        { id: 'intercambio', label: 'Intercambio', icon: Globe },
        { id: 'consejos', label: 'Consejos', icon: BookOpen },
        { id: 'mentorias', label: 'Mentorias', icon: Award },
    ];
    const BOT = [
        { id: 'inicio', label: 'Home', icon: Home },
        { id: 'empieza', label: 'Cursos', icon: Play },
        { id: 'consejos', label: 'Tips', icon: BookOpen },
        { id: 'menu', label: 'Menu', icon: MoreHorizontal, isMenu: true },
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                const [u, c, ps] = await Promise.all([
                    base44.auth.me().catch(() => null),
                    base44.entities.Content.filter({ is_published: true }, '-created_date', 50).catch(() => []),
                    base44.entities.PlatformSettings.list().catch(() => []),
                ]);
                setUser(u);
                setContents(c || []);
                setLive(ps.find(s => s.setting_key === 'is_live')?.setting_value === 'true');
            } catch (e) {
                console.error('ZonaMembros loadData:', e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
        // Polling: atualiza user e live status a cada 30s para refletir mudancas do admin em tempo real
        const iv = setInterval(async () => {
            try {
                const [u, ps] = await Promise.all([
                    base44.auth.me().catch(() => null),
                    base44.entities.PlatformSettings.list().catch(() => []),
                ]);
                if (u) {
                    setUser(u);
                    // Se admin removeu o acesso a Area de Membros, redirecionar de volta
                    if (u.has_zona_membros_access !== true) {
                        window.location.href = '?page=RevelaTalentos';
                        return;
                    }
                }
                setLive(ps.find(s => s.setting_key === 'is_live')?.setting_value === 'true');
            } catch { }
        }, 30000);
        return () => clearInterval(iv);
    }, []);


    const handlePlay = useCallback((item) => {
        const itemIsLocked = !item.is_zona_membros_unlocked;
        if (itemIsLocked) { setUpg(true); return; }
        setSel(item);
    }, []);

    // Video player view
    if (sel) return (
        <>
            <GS />
            <div className="min-h-screen bg-[#05080a] text-white flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                    <button onClick={() => setSel(null)} className="mb-4 flex items-center gap-2 text-[#00a8e1] font-bold text-sm hover:text-white transition-colors">
                        Voltar
                    </button>
                    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-[#00a8e1]/30">
                        {sel.live_embed_code ? (
                            <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: sel.live_embed_code }} />
                        ) : sel.video_url
                            ? <video src={sel.video_url} controls autoPlay className="w-full h-full" />
                            : <div className="w-full h-full flex items-center justify-center text-white/40"><Play className="w-12 h-12 opacity-20" /></div>
                        }
                    </div>
                    <h2 className="mt-4 text-xl font-black text-white">{sel.title}</h2>
                    {sel.description && <p className="mt-2 text-gray-400 text-sm">{sel.description}</p>}
                </div>
            </div>
        </>
    );

    // Loading state
    if (loading) return (
        <>
            <GS />
            <div className="min-h-screen bg-[#05080a] flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-[#00a8e1] border-t-transparent rounded-full animate-spin" />
            </div>
        </>
    );

    const VIEWS = {
        inicio: <InicioView contents={contents} onPlay={handlePlay} onNav={setTab} />,
        empieza: <EmpiezaView contents={contents} onPlay={handlePlay} />,
        envivo: <EnVivoView isLive={live} />,
        intercambio: <IntercambioView />,
        consejos: <ConsejosView contents={contents} onPlay={handlePlay} />,
        mentorias: <MentoriasView />,
    };

    return (
        <>
            <GS />
            <div className="flex h-screen bg-[#05080a] text-white overflow-hidden">

                {/* ---- Sidebar Desktop ---- */}
                <aside
                    className={`hidden md:flex flex-col bg-[#080d12] border-r border-white/5 z-40 transition-all duration-300 ${hov ? 'w-[260px]' : 'w-[88px]'}`}
                    onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
                    <div className="pt-6 pb-0 flex items-center justify-center px-4 h-20">
                        <img
                            src={hov ? LOGO_FULL : LOGO_ICON}
                            alt="Revela Talentos"
                            className={`${hov ? 'w-40' : 'w-12'} h-auto transition-all duration-500 cursor-pointer`}
                            onClick={() => setTab('inicio')} />
                    </div>
                    <nav className={`flex-1 pt-4 pb-6 flex flex-col gap-1 overflow-y-auto zh ${hov ? 'px-5' : 'px-3'}`}>
                        {hov && <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1 ml-3">Navegacao</div>}
                        {MENU.map(item => {
                            const active = tab === item.id;
                            return (
                                <button key={item.id} onClick={() => setTab(item.id)}
                                    className={`flex items-center gap-4 py-3 rounded-2xl transition-all border ${active ? 'bg-[#00a8e1]/10 text-white border-[#00a8e1]/50' : 'border-transparent text-white/60 hover:bg-white/5 hover:text-white'} ${hov ? 'px-5 justify-start' : 'px-0 justify-center w-14 h-14 mx-auto'}`}
                                    title={!hov ? item.label : ''}>
                                    <item.icon className={`w-5 h-5 shrink-0 ${active ? 'text-[#00a8e1]' : ''}`} />
                                    {hov && <span className="font-semibold text-sm whitespace-nowrap">{item.label}</span>}
                                </button>
                            );
                        })}
                    </nav>
                    {user && hov && (
                        <div className="border-t border-white/5 p-4">
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                <img src={user.profile_picture_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200'} alt="" className="w-8 h-8 rounded-full object-cover border border-[#00a8e1]/40" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-xs font-bold truncate">{user.full_name}</p>
                                    <p className={`text-[10px] font-semibold ${locked ? 'text-red-400' : 'text-emerald-400'}`}>{locked ? 'Bloqueado' : 'Acesso Ativo'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>

                {/* ---- Modal Mobile ---- */}
                {mob && (
                    <div className="fixed inset-0 z-50 bg-[#05080a]/98 backdrop-blur-2xl md:hidden flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-white/5">
                            <img src={LOGO_FULL} alt="Revela" className="w-32 h-auto" />
                            <button onClick={() => setMob(false)} className="p-2.5 bg-white/5 rounded-full border border-white/10"><X className="w-5 h-5" /></button>
                        </div>
                        {user && (
                            <div className="px-5 pt-4 pb-2">
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                    <img src={user.profile_picture_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200'} alt="" className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <p className="text-white text-sm font-bold">{user.full_name}</p>
                                        <p className={`text-xs font-semibold ${locked ? 'text-red-400' : 'text-emerald-400'}`}>{locked ? 'Bloqueado' : 'Acesso Ativo'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <nav className="flex-1 px-5 pt-3 pb-6 flex flex-col gap-2">
                            {MENU.map(item => (
                                <button key={item.id} onClick={() => { setTab(item.id); setMob(false); }}
                                    className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all border ${tab === item.id ? 'bg-[#00a8e1]/10 text-white border-[#00a8e1]/50' : 'border-transparent bg-white/5 text-white/70'}`}>
                                    <item.icon className={`w-5 h-5 ${tab === item.id ? 'text-[#00a8e1]' : ''}`} /> {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                )}

                {/* ---- Main Content ---- */}
                <main className="flex-1 h-screen overflow-y-auto scroll-smooth relative pb-24 md:pb-0">
                    <header className="flex items-center justify-between px-4 md:px-12 py-5 md:py-7 sticky top-0 z-30 bg-[#05080a]/90 backdrop-blur-xl border-b border-white/5">
                        <div className="flex items-center gap-3">
                            {user ? (
                                <>
                                    <div className="w-10 h-10 rounded-full p-[2px] border-2 border-[#00a8e1] shadow-[0_0_10px_rgba(0,168,225,0.4)]">
                                        <img src={user.profile_picture_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200'} alt="" className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Bem-vindo,</p>
                                        <p className="text-sm md:text-base font-black text-white leading-tight">{user.full_name}</p>
                                    </div>
                                </>
                            ) : (
                                <div><p className="text-sm font-black text-white">Zona de Membros</p><p className="text-[10px] text-[#00a8e1]">EC10 Talentos</p></div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {locked && (
                                <button onClick={() => setUpg(true)} className="flex items-center gap-1.5 bg-[#00a8e1]/10 border border-[#00a8e1]/40 text-[#00a8e1] text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full hover:bg-[#00a8e1]/20 transition-all">
                                    <LockKeyhole className="w-3 h-3" /> Desbloquear
                                </button>
                            )}
                            <button className="w-9 h-9 rounded-full bg-[#0a0f14] flex items-center justify-center text-white/80 border border-white/10"><Search className="w-4 h-4" /></button>
                            <button className="w-9 h-9 rounded-full bg-[#0a0f14] flex items-center justify-center text-white/80 border border-white/10 relative">
                                <Bell className="w-4 h-4" />
                                {live && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                            </button>
                        </div>
                    </header>
                    <div className="px-4 md:px-12 relative z-20 pt-4">{VIEWS[tab] || VIEWS.inicio}</div>
                </main>

                {/* ---- Bottom Nav Mobile ---- */}
                <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] bg-[#080d12]/95 backdrop-blur-2xl text-white rounded-3xl px-4 py-2.5 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_15px_rgba(0,168,225,0.15)] z-40 border border-white/10">
                    {BOT.map(item => {
                        const active = tab === item.id && !item.isMenu;
                        return (
                            <button key={item.id} onClick={() => item.isMenu ? setMob(true) : setTab(item.id)} className="flex flex-col items-center gap-1 group relative w-16">
                                <div className={`p-2 rounded-xl transition-all duration-300 ${active ? 'bg-[#00a8e1]/15 text-[#00a8e1]' : 'text-gray-400 group-hover:text-white'}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className={`text-[9px] font-bold ${active ? 'text-[#00a8e1]' : 'text-gray-400'}`}>{item.label}</span>
                                {active && <div className="absolute -bottom-1 w-1 h-1 bg-[#00a8e1] rounded-full shadow-[0_0_5px_#00a8e1]" />}
                            </button>
                        );
                    })}
                </div>

                {upg && <UpgModal onClose={() => setUpg(false)} />}
            </div>
        </>
    );
}
