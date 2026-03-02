import React, { useState, useEffect, useCallback } from "react";
import { Event } from "@/entities/Event";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    CalendarDays, MapPin, Clock, Monitor, Trophy, Zap, User, Users,
    Loader2, Calendar
} from "lucide-react";

const eventTypes = [
    { value: "presencial", label: "Presencial", icon: MapPin, color: "bg-green-600", gradient: "from-green-600 to-emerald-500" },
    { value: "online", label: "Online", icon: Monitor, color: "bg-blue-600", gradient: "from-blue-600 to-cyan-500" },
    { value: "jogo", label: "Jogo", icon: Trophy, color: "bg-red-600", gradient: "from-red-600 to-orange-500" },
    { value: "treino", label: "Treino", icon: Zap, color: "bg-yellow-600", gradient: "from-yellow-500 to-amber-500" },
    { value: "mentoria", label: "Mentoria", icon: User, color: "bg-purple-600", gradient: "from-purple-600 to-violet-500" },
];

function getEventTypeConfig(type) {
    return eventTypes.find((et) => et.value === type) || eventTypes[1];
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function EventCard({ event }) {
    const typeConfig = getEventTypeConfig(event.event_type);
    const Icon = typeConfig.icon;
    const isPast = new Date(event.start_date) < new Date();

    return (
        <Card className={`bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-200 ${isPast ? "opacity-60" : ""}`}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${typeConfig.gradient}`}>
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-base leading-tight">{event.title}</h3>
                            {event.event_category && (
                                <p className="text-xs text-gray-400 mt-0.5">{event.event_category}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                        {event.is_mandatory && (
                            <Badge className="bg-red-600/20 text-red-400 border border-red-600/40 text-[10px]">Obrigatório</Badge>
                        )}
                        <Badge className={`text-[10px] ${isPast ? "bg-gray-700 text-gray-400" : "bg-green-600/20 text-green-400 border border-green-600/40"}`}>
                            {isPast ? "Encerrado" : "Disponível"}
                        </Badge>
                    </div>
                </div>

                {event.description && (
                    <p className="text-sm text-gray-300 mb-4 line-clamp-2">{event.description}</p>
                )}

                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4 flex-shrink-0 text-cyan-500" />
                        <span>{formatDate(event.start_date)}</span>
                        {event.end_date && (
                            <span className="text-gray-600">→ {formatDate(event.end_date)}</span>
                        )}
                    </div>

                    {event.location && (
                        <div className="flex items-center gap-2 text-gray-400">
                            <MapPin className="w-4 h-4 flex-shrink-0 text-cyan-500" />
                            <span>{event.location}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-gray-400">
                        <Users className="w-4 h-4 flex-shrink-0 text-cyan-500" />
                        <span>
                            {event.target_users && event.target_users.length > 0
                                ? `${event.target_users.length} atleta(s) convidados`
                                : "Todos os atletas"}
                        </span>
                        {event.max_participants && (
                            <span className="ml-auto text-xs text-gray-500">Máx. {event.max_participants}</span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Eventos() {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("upcoming");

    const loadEvents = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await Event.list("-start_date");
            setEvents(data?.filter((e) => e.is_active) || []);
        } catch (error) {
            console.error("Erro ao carregar eventos:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    const now = new Date();
    const upcomingEvents = events.filter((e) => new Date(e.start_date) >= now);
    const pastEvents = events.filter((e) => new Date(e.start_date) < now);
    const displayedEvents = filter === "upcoming" ? upcomingEvents : pastEvents;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="relative bg-gradient-to-b from-gray-900 to-black border-b border-gray-800 px-6 py-10">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-gradient-to-br from-purple-600 to-violet-500 rounded-2xl">
                            <CalendarDays className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white">Eventos</h1>
                            <p className="text-gray-400 text-sm mt-0.5">Agenda de atividades e compromissos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    <button
                        onClick={() => setFilter("upcoming")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === "upcoming"
                                ? "bg-gradient-to-r from-purple-600 to-violet-500 text-white shadow-lg shadow-purple-500/25"
                                : "bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800"
                            }`}
                    >
                        Próximos ({upcomingEvents.length})
                    </button>
                    <button
                        onClick={() => setFilter("past")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === "past"
                                ? "bg-gradient-to-r from-gray-700 to-gray-600 text-white"
                                : "bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800"
                            }`}
                    >
                        Passados ({pastEvents.length})
                    </button>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                    </div>
                )}

                {/* Events Grid */}
                {!isLoading && (
                    <>
                        {displayedEvents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
                                    <Calendar className="w-10 h-10 text-gray-600" />
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-400 text-lg font-semibold">
                                        {filter === "upcoming" ? "Nenhum evento agendado" : "Nenhum evento passado"}
                                    </p>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {filter === "upcoming" ? "Fique atento às próximas novidades!" : "Os eventos encerrados aparecerão aqui."}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {displayedEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
