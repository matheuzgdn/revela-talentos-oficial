import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DailyCheckinNotification({ user, dailyCheckins, onOpen }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user || dismissed) return;

    // Verificar se já fez check-in hoje
    const today = new Date().toISOString().split('T')[0];
    const hasCheckinToday = dailyCheckins?.some(checkin => {
      const checkinDate = new Date(checkin.checkin_date).toISOString().split('T')[0];
      return checkinDate === today;
    });

    // Mostrar notificação se não fez check-in hoje
    if (!hasCheckinToday) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [user, dailyCheckins, dismissed]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
  };

  const handleOpen = () => {
    setShow(false);
    onOpen();
  };

  if (!show) return null;

  const streak = dailyCheckins?.[0]?.streak_days || 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ 
          backgroundColor: "rgba(0, 0, 0, 0.95)",
          backdropFilter: "blur(20px)"
        }}
      >
        {/* Partículas de fundo */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-500/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Conteúdo Principal */}
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative max-w-md w-full"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/40 via-red-500/40 to-yellow-500/40 blur-3xl rounded-3xl" />
          
          {/* Card principal */}
          <div className="relative bg-gradient-to-br from-[#1A1A1A] via-[#0A0A0A] to-[#1A1A1A] border-2 border-orange-500/50 rounded-3xl p-8 overflow-hidden">
            {/* Border glow animation */}
            <div className="absolute inset-0 rounded-3xl">
              <motion.div
                className="absolute inset-0 opacity-50"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255, 136, 0, 0.5), transparent)",
                }}
                animate={{
                  x: ["-200%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            {/* Botão fechar */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Ícone principal animado */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 blur-2xl opacity-60" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500 rounded-3xl flex items-center justify-center">
                  <Flame className="w-12 h-12 text-white drop-shadow-2xl" />
                </div>
              </div>
            </motion.div>

            {/* Título épico */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-black text-center mb-3 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 text-transparent bg-clip-text"
            >
              Mantenha a Chama Acesa
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-300 text-center mb-6 text-sm leading-relaxed"
            >
              Você ainda não registrou seu check-in diário. Mantenha sua sequência e evolua continuamente!
            </motion.p>

            {/* Estatísticas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-3 mb-6"
            >
              <div className="bg-white/5 border border-orange-500/30 rounded-2xl p-4 text-center">
                <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-black text-white">{streak}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Dias de Sequência</p>
              </div>
              <div className="bg-white/5 border border-orange-500/30 rounded-2xl p-4 text-center">
                <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-black text-white">+10</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Pontos Hoje</p>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleOpen}
                className="w-full h-14 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 hover:from-orange-600 hover:via-red-600 hover:to-yellow-600 text-white font-black text-lg rounded-2xl shadow-2xl shadow-orange-500/50 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Fazer Check-in Agora
                </span>
              </Button>

              <button
                onClick={handleDismiss}
                className="w-full mt-3 text-gray-400 hover:text-white text-sm transition-colors"
              >
                Fazer mais tarde
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}