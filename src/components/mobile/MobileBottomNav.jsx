import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Video, Plus, Search, User, Upload, Radio, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HMSRoomProvider } from "@100mslive/react-sdk";
import LiveBroadcaster from "@/components/live/LiveBroadcaster";

export default function MobileBottomNav({ onUploadClick, user }) {
  const location = useLocation();
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showMobileLive, setShowMobileLive] = useState(false);

  const isAdmin = user?.role === "admin";

  const navItems = [
    { id: "home", icon: Home, label: "Início", path: "RevelaTalentos" },
    { id: "videos", icon: Video, label: "Vídeos", path: "AthleteVideos" },
    { id: "upload", icon: Plus, label: "", isUpload: true },
    { id: "search", icon: Search, label: "Busca", path: "SearchAthletes" },
    { id: "profile", icon: User, label: "Perfil", path: "AthleteProfile" },
  ];

  const isActive = (path) => location.pathname.includes(path);

  const handlePlusClick = () => {
    if (isAdmin) {
      setShowActionSheet(true);
    } else {
      onUploadClick?.();
    }
  };

  const handleUpload = () => {
    setShowActionSheet(false);
    onUploadClick?.();
  };

  const handleStartLive = () => {
    setShowActionSheet(false);
    setShowMobileLive(true);
  };

  return (
    <>
      {/* ── Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#1a1a1a]">
        <div className="flex items-center justify-around px-2 py-2 relative">
          {navItems.map((item) => {
            if (item.isUpload) {
              return (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.85 }}
                  onClick={handlePlusClick}
                  className="relative -mt-6"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-4 border-[#0A0A0A] transition-all ${isAdmin
                      ? "bg-gradient-to-br from-red-500 to-pink-600 shadow-red-500/40"
                      : "bg-[#00E5FF] shadow-[#00E5FF]/40"
                    }`}>
                    {isAdmin ? (
                      <Radio className="w-6 h-6 text-white" strokeWidth={2.5} />
                    ) : (
                      <Plus className="w-6 h-6 text-black" strokeWidth={3} />
                    )}
                  </div>
                  <div className={`absolute inset-0 rounded-2xl blur-xl -z-10 ${isAdmin ? "bg-red-500/30" : "bg-[#00E5FF]/30"
                    }`} />
                </motion.button>
              );
            }

            const active = isActive(item.path);
            return (
              <Link
                key={item.id}
                to={createPageUrl(item.path)}
                className="flex flex-col items-center justify-center py-0.5 px-3 min-w-[48px]"
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`relative p-2 rounded-xl transition-all ${active ? "bg-[#00E5FF]/10" : ""}`}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${active ? "text-[#00E5FF]" : "text-[#666]"}`} />
                  {active && (
                    <motion.div layoutId="navGlow" className="absolute inset-0 bg-[#00E5FF]/20 rounded-xl blur-lg -z-10" />
                  )}
                </motion.div>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${active ? "text-[#00E5FF]" : "text-[#444]"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Admin Action Sheet ── */}
      <AnimatePresence>
        {showActionSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowActionSheet(false)}
              className="md:hidden fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-[#111] rounded-t-[28px] border-t border-[#2a2a2a] p-6 pb-10"
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-[#333] rounded-full mx-auto mb-6" />

              <h3 className="text-white font-black text-lg mb-6 text-center">O que deseja fazer?</h3>

              <div className="flex flex-col gap-3">
                {/* Upload */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleUpload}
                  className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] hover:border-[#00E5FF]/40 transition-all"
                >
                  <div className="w-12 h-12 bg-[#00E5FF]/10 rounded-xl flex items-center justify-center">
                    <Upload className="w-6 h-6 text-[#00E5FF]" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-base">Subir Vídeo</p>
                    <p className="text-[#666] text-sm">Publique um conteúdo gravado</p>
                  </div>
                </motion.button>

                {/* Live */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStartLive}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-950/60 to-pink-950/60 rounded-2xl border border-red-500/30 hover:border-red-400/60 transition-all"
                >
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <Radio className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-base flex items-center gap-2">
                      🔴 Iniciar Live
                    </p>
                    <p className="text-red-300/70 text-sm">Transmitir ao vivo agora</p>
                  </div>
                </motion.button>
              </div>

              <button
                onClick={() => setShowActionSheet(false)}
                className="w-full mt-4 py-3 text-[#555] font-bold text-sm"
              >
                Cancelar
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile Live Full-Screen ── */}
      <AnimatePresence>
        {showMobileLive && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="md:hidden fixed inset-0 z-[80] bg-[#0A0A0A] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white font-black text-lg">Transmissão ao Vivo</span>
              </div>
              <button
                onClick={() => setShowMobileLive(false)}
                className="w-9 h-9 bg-[#1a1a1a] rounded-xl flex items-center justify-center"
              >
                <X className="w-5 h-5 text-[#666]" />
              </button>
            </div>

            {/* LiveBroadcaster */}
            <div className="p-4">
              <HMSRoomProvider>
                <LiveBroadcaster
                  user={user}
                  onLiveStarted={() => { }}
                  onLiveStopped={() => setShowMobileLive(false)}
                />
              </HMSRoomProvider>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}