import React, { useState, useEffect, useCallback } from 'react';
import { Event } from "@/entities/Event";
import { MapPin, Calendar, Map as MapIcon, Trophy, Globe, Sparkles, Loader2 } from 'lucide-react';

// Paleta de cores por tipo de evento
const typeMeta = {
    presencial: { cor: '#00f3ff', label: 'Presencial' },
    online: { cor: '#a78bfa', label: 'Online' },
    jogo: { cor: '#f87171', label: 'Jogo' },
    treino: { cor: '#fbbf24', label: 'Treino' },
    mentoria: { cor: '#34d399', label: 'Mentoria' },
};

function getMeta(type) {
    return typeMeta[type] || typeMeta.presencial;
}

// Fallback: eventos estáticos EC10 (exibidos se não houver eventos no banco)
const eventosEC10 = [
    {
        id: 'ec10-1',
        nome: 'Sudacademy',
        cidade: 'Belo Horizonte',
        pais: 'Brasil',
        mes: 'Dezembro',
        posicao: { top: '61.5%', left: '37.5%' },
        cor: '#00f3ff',
    },
    {
        id: 'ec10-2',
        nome: 'Libertacademy',
        cidade: 'Buenos Aires',
        pais: 'Argentina',
        mes: 'Julho',
        posicao: { top: '76.4%', left: '34.3%' },
        cor: '#00f3ff',
    },
    {
        id: 'ec10-3',
        nome: 'Eurocamp',
        cidade: 'Madrid',
        pais: 'Espanha',
        mes: 'Agosto',
        posicao: { top: '28%', left: '48.5%' },
        cor: '#00f3ff',
    },
];

function formatMes(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
}

export default function Eventos() {
    const [eventoAtivo, setEventoAtivo] = useState(null);
    const [dbEvents, setDbEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadEvents = useCallback(async () => {
        try {
            const data = await Event.list('-start_date');
            setDbEvents(data?.filter((e) => e.is_active) || []);
        } catch {
            setDbEvents([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadEvents(); }, [loadEvents]);

    // Mapeia eventos do banco para o formato do mapa (usa posição do campo `location` se tiver coordenadas, senão usa fallback)
    // Eventos do banco são listados embaixo; os marcadores do mapa são sempre os estáticos EC10
    const listaEventos = dbEvents.length > 0 ? dbEvents : null;

    return (
        <div className="min-h-screen bg-[#020202] text-white font-sans overflow-x-hidden relative selection:bg-cyan-900 selection:text-cyan-100 flex flex-col items-center">

            {/* Efeitos de Fundo */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Cabeçalho */}
            <header className="w-full max-w-7xl mx-auto pt-12 pb-6 px-6 relative z-10 flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Trophy className="w-8 h-8 text-[#00f3ff] animate-pulse" />
                    <h1
                        className="text-4xl md:text-5xl font-black tracking-wider uppercase"
                        style={{ textShadow: '0 0 15px rgba(0, 243, 255, 0.6)' }}
                    >
                        EC10 <span className="text-[#00f3ff]">Talentos</span>
                    </h1>
                    <Trophy className="w-8 h-8 text-[#00f3ff] animate-pulse" />
                </div>
                <p className="text-gray-400 text-lg md:text-xl uppercase tracking-widest font-light flex items-center gap-2">
                    <Globe className="w-5 h-5" /> EVENTOS EC10 2026
                </p>
            </header>

            {/* Mapa */}
            <main className="w-full max-w-6xl mx-auto px-4 relative z-10 flex-1 flex flex-col justify-center items-center pb-20">

                <div className="relative w-full aspect-[2/1] group">
                    {/* Fundo do mapa */}
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

                    {/* Marcadores */}
                    {eventosEC10.map((evento) => {
                        const isBottomHalf = parseFloat(evento.posicao.top) > 50;
                        const isAtivo = eventoAtivo === evento.id;

                        return (
                            <div
                                key={evento.id}
                                className={`absolute flex flex-col items-center transition-all duration-300 ${isAtivo ? 'z-50' : 'z-20'}`}
                                style={{ top: evento.posicao.top, left: evento.posicao.left, transform: 'translate(-50%, -50%)' }}
                                onMouseEnter={() => setEventoAtivo(evento.id)}
                                onMouseLeave={() => setEventoAtivo(null)}
                            >
                                {/* Ponto Pulsante */}
                                <div className="relative flex justify-center items-center cursor-pointer">
                                    <div className="absolute w-12 h-12 bg-[#00f3ff]/20 rounded-full animate-ping" />
                                    <div className="absolute w-6 h-6 bg-[#00f3ff]/40 rounded-full animate-pulse" />
                                    <MapPin className="relative w-8 h-8 text-[#00f3ff] drop-shadow-[0_0_10px_rgba(0,243,255,1)]" />
                                </div>

                                {/* Cartão de Popup */}
                                <div className={`
                  absolute w-64 p-1 transition-all duration-300 ease-out
                  ${isBottomHalf ? 'bottom-full mb-4 origin-bottom' : 'top-full mt-4 origin-top'}
                  ${isAtivo ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                `}>
                                    <div className="relative bg-[#050505]/90 backdrop-blur-md border border-[#00f3ff]/40 rounded-xl p-4 shadow-[0_4px_30px_rgba(0,243,255,0.15)]">
                                        {isBottomHalf ? (
                                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-gradient-to-t from-[#00f3ff] to-transparent" />
                                        ) : (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-gradient-to-b from-[#00f3ff] to-transparent" />
                                        )}
                                        <div className="flex items-center gap-2 mb-2">
                                            <Sparkles className="w-4 h-4 text-[#00f3ff]" />
                                            <h3 className="text-[#00f3ff] font-bold text-lg tracking-wide">{evento.nome}</h3>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <MapIcon className="w-4 h-4 text-gray-500" />
                                                <span>{evento.cidade}, <span className="text-white">{evento.pais}</span></span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-[#00f3ff]" />
                                                <span className="font-semibold uppercase text-[#00f3ff]">{evento.mes}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Lista abaixo do mapa */}
                <div className="w-full mt-16 flex flex-col gap-4 max-w-4xl mx-auto z-20">
                    <h2 className="text-2xl font-bold text-center text-white mb-4 uppercase tracking-widest flex items-center justify-center gap-3">
                        <Calendar className="w-6 h-6 text-[#00f3ff]" />
                        Agenda <span className="text-[#00f3ff]">Global</span>
                    </h2>

                    {/* Eventos estáticos EC10 */}
                    {eventosEC10.map((evento) => (
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
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${eventoAtivo === evento.id ? 'bg-[#00f3ff]/20 shadow-[0_0_15px_rgba(0,243,255,0.4)]' : 'bg-cyan-950/40 group-hover:bg-[#00f3ff]/10'}`}>
                                    <Trophy className={`w-7 h-7 transition-colors ${eventoAtivo === evento.id ? 'text-[#00f3ff]' : 'text-cyan-600 group-hover:text-[#00f3ff]'}`} />
                                </div>
                                <div>
                                    <h3 className={`text-2xl font-bold flex items-center gap-2 transition-colors ${eventoAtivo === evento.id ? 'text-[#00f3ff]' : 'text-white group-hover:text-cyan-100'}`}>
                                        {evento.nome}
                                        <Sparkles className={`w-4 h-4 text-[#00f3ff] transition-opacity duration-300 ${eventoAtivo === evento.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-400 mt-1">
                                        <MapIcon className="w-4 h-4" />
                                        <span>{evento.cidade}, <span className="text-gray-200">{evento.pais}</span></span>
                                    </div>
                                </div>
                            </div>
                            <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-colors w-full md:w-auto justify-center ${eventoAtivo === evento.id ? 'bg-[#00f3ff]/15 border-[#00f3ff]/40' : 'bg-[#00f3ff]/5 border-[#00f3ff]/10 group-hover:bg-[#00f3ff]/10 group-hover:border-[#00f3ff]/30'}`}>
                                <Calendar className="w-5 h-5 text-[#00f3ff]" />
                                <span className="font-bold text-[#00f3ff] uppercase tracking-wider">{evento.mes}</span>
                            </div>
                        </div>
                    ))}

                    {/* Eventos do banco de dados */}
                    {isLoading && (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                        </div>
                    )}

                    {!isLoading && listaEventos && listaEventos.length > 0 && (
                        <>
                            <h2 className="text-xl font-bold text-center text-white mt-4 mb-2 uppercase tracking-widest flex items-center justify-center gap-3">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                                Eventos <span className="text-purple-400">Programados</span>
                            </h2>
                            {listaEventos.map((evento) => {
                                const meta = getMeta(evento.event_type);
                                return (
                                    <div
                                        key={evento.id}
                                        className="bg-[#050505]/80 backdrop-blur-md border border-purple-500/20 hover:border-purple-400/40 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-1 cursor-default"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-purple-950/40" style={{ boxShadow: `0 0 15px ${meta.cor}33` }}>
                                                <Trophy className="w-7 h-7" style={{ color: meta.cor }} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{evento.title}</h3>
                                                <div className="flex items-center gap-2 text-gray-400 mt-1 text-sm">
                                                    <MapIcon className="w-4 h-4" />
                                                    <span>{evento.location || meta.label}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-purple-500/20 bg-purple-500/5 w-full md:w-auto justify-center">
                                            <Calendar className="w-5 h-5" style={{ color: meta.cor }} />
                                            <span className="font-bold uppercase tracking-wider capitalize" style={{ color: meta.cor }}>
                                                {formatMes(evento.start_date)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            </main>

            {/* Rodapé */}
            <footer className="w-full text-center py-6 text-gray-600 text-sm border-t border-cyan-900/30 relative z-10">
                <p>© 2026 EC10 Talentos. Todos os direitos reservados.</p>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #020202; }
        ::-webkit-scrollbar-thumb { background: #004d4d; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #00f3ff; }
      `}} />
        </div>
    );
}
