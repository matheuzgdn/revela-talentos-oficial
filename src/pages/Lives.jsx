import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, Users, ArrowLeft, X, Loader2, Calendar, Clock, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import LiveViewer from "@/components/live/LiveViewer";

// Poll platform settings every 5 seconds
const POLL_INTERVAL = 5000;

async function fetchLiveSettings() {
  try {
    const allSettings = await base44.entities.PlatformSettings.list();
    const get = (key) => allSettings.find((s) => s.setting_key === key)?.setting_value;
    return {
      isLiveActive: get("is_live_active") === "true",
      hlsUrl: get("live_hls_url") || "",
      nextLiveDate: get("next_live_date") || "",
      isPostponed: get("live_is_postponed") === "true",
      postponeMessage: get("live_postpone_message") || "",
      schedule: get("live_custom_schedule") || get("live_default_schedule") || "Todas as segundas às 20h",
    };
  } catch {
    return null;
  }
}

// ─── Waiting / offline screen ─────────────────────────────────────────────────
function LiveOfflineScreen({ settings, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center px-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full blur-3xl opacity-20" />
        <div className="w-28 h-28 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border-2 border-gray-700/50 relative">
          <Radio className="w-14 h-14 text-gray-500" />
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-black text-white mb-3">
          {settings.isPostponed ? "Live Adiada" : "Nenhuma live ao vivo agora"}
        </h2>
        {settings.isPostponed && settings.postponeMessage && (
          <p className="text-yellow-400 font-medium mb-2">{settings.postponeMessage}</p>
        )}
        <p className="text-gray-400 text-lg">
          {settings.isPostponed ? "Fique atento às notificações" : "Você será notificado quando iniciar"}
        </p>
      </div>

      <div className="bg-gray-900/80 border border-gray-700/50 rounded-2xl p-6 max-w-sm w-full space-y-4">
        {settings.nextLiveDate && (
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20">
              <Calendar className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Próxima live</p>
              <p className="text-white font-bold">
                {new Date(settings.nextLiveDate).toLocaleString("pt-BR", {
                  day: "2-digit", month: "2-digit", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Horário regular</p>
            <p className="text-white font-bold">{settings.schedule}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
            <Bell className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-gray-400 text-xs">Notificações</p>
            <p className="text-white font-bold">Você será avisado quando iniciar</p>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        onClick={onBack}
        className="text-gray-400 hover:text-white hover:bg-white/5"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function LivesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [liveSettings, setLiveSettings] = useState(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Auth check
  useEffect(() => {
    (async () => {
      try {
        const currentUser = await base44.auth.me();
        if (!currentUser) {
          navigate(createPageUrl("RevelaTalentos"));
          return;
        }
        setUser(currentUser);
      } catch {
        navigate(createPageUrl("RevelaTalentos"));
      } finally {
        setIsLoadingUser(false);
      }
    })();
  }, []);

  // Poll live settings
  const pollSettings = useCallback(async () => {
    const s = await fetchLiveSettings();
    if (s) setLiveSettings(s);
    setIsLoadingSettings(false);
  }, []);

  useEffect(() => {
    pollSettings();
    const interval = setInterval(pollSettings, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [pollSettings]);

  const handleBack = () => navigate(createPageUrl("RevelaTalentos"));

  // Loading screen
  if (isLoadingUser || isLoadingSettings) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-2xl opacity-40 animate-pulse" />
            <Loader2 className="w-20 h-20 text-red-400 animate-spin relative z-10" />
          </div>
          <p className="text-gray-200 text-xl font-bold">Verificando transmissão...</p>
        </div>
      </div>
    );
  }

  const isLive = liveSettings?.isLiveActive;

  return (
    <>
      {/* ──────── MOBILE ──────── */}
      <div className="md:hidden fixed inset-0 bg-black text-white flex flex-col overflow-y-auto">
        {/* Top bar */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black via-black/80 to-transparent">
          <Button
            variant="ghost" size="icon"
            onClick={handleBack}
            className="bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-xl rounded-xl"
          >
            <X className="w-5 h-5" />
          </Button>
          <Badge className={`flex items-center gap-2 px-3 py-1.5 shadow-2xl border ${isLive
            ? "bg-gradient-to-r from-red-500 to-pink-600 border-red-400/30 animate-pulse shadow-red-500/50"
            : "bg-gray-800 border-gray-600 text-gray-400"
            }`}>
            <Radio className="w-3 h-3" />
            <span className="font-bold text-xs">{isLive ? "AO VIVO" : "OFFLINE"}</span>
          </Badge>
        </div>

        <div className="mt-16 flex-1">
          <AnimatePresence mode="wait">
            {isLive ? (
              <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LiveViewer hlsUrl={liveSettings.hlsUrl} />
                {/* Chat */}
                <div className="p-4 pt-0">
                  <div className="bg-gray-900/80 rounded-2xl overflow-hidden border border-gray-700/50 h-64">
                    <div className="flex items-center gap-2 p-3 border-b border-gray-700/50">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span className="text-white font-bold text-sm">Chat ao vivo</span>
                      <div className="ml-auto flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400 text-xs">Online</span>
                      </div>
                    </div>
                    <div className="h-48 bg-black/50" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="offline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LiveOfflineScreen settings={liveSettings || {}} onBack={handleBack} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ──────── DESKTOP ──────── */}
      <div className="hidden md:block min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
        <header className="relative bg-gradient-to-b from-black/80 via-gray-950/50 to-transparent py-8 px-6 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-gray-300 hover:text-white mb-6 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {isLive && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-full blur-md animate-pulse" />
                    <div className="w-4 h-4 bg-red-500 rounded-full relative animate-pulse" />
                  </div>
                )}
                <h1 className="text-5xl font-black">
                  <span className="text-white">Lives </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">EC10 Talentos</span>
                </h1>
              </div>
              <Badge className={`flex items-center gap-2 px-6 py-3 shadow-2xl border ${isLive
                ? "bg-gradient-to-r from-red-500 to-pink-600 border-red-400/30 animate-pulse shadow-red-500/50"
                : "bg-gray-800 border-gray-600 text-gray-400"
                }`}>
                <Radio className="w-5 h-5" />
                <span className="font-bold text-base">{isLive ? "AO VIVO AGORA" : "OFFLINE"}</span>
              </Badge>
            </div>
            <p className="text-gray-300 mt-4 text-lg">
              {isLive
                ? "Transmissão ao vivo em andamento — assista e interaja agora!"
                : "Você será notificado quando a próxima live começar"}
            </p>
          </div>
        </header>

        <main className="px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {isLive ? (
                <motion.div key="live-desktop" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <LiveViewer hlsUrl={liveSettings.hlsUrl} />
                </motion.div>
              ) : (
                <motion.div key="offline-desktop" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <LiveOfflineScreen settings={liveSettings || {}} onBack={handleBack} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
}