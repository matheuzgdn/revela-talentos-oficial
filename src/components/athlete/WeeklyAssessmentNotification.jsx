import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, TrendingUp, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WeeklyAssessmentNotification({ user, onOpen }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user || dismissed) return;

    const lastAssessment = user.last_weekly_assessment;
    const now = new Date();

    if (!lastAssessment) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }

    const lastDate = new Date(lastAssessment);
    const daysSinceLastAssessment = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

    if (daysSinceLastAssessment >= 7) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [user, dismissed]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
  };

  const handleStart = () => {
    setShow(false);
    onOpen();
  };

  if (!show) return null;

  const getTimeMessage = () => {
    const lastAssessment = user?.last_weekly_assessment;
    if (!lastAssessment) return "Seu primeiro relatório semanal aguarda!";
    
    const lastDate = new Date(lastAssessment);
    const now = new Date();
    const daysSince = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
    
    return `Já se passaram ${daysSince} dias desde seu último relatório.`;
  };

  const timeMessage = getTimeMessage();

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
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-500/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
                y: [0, -50, -100],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: Math.random() * 3,
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
          {/* Glow effect VIP */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 via-blue-500/40 to-purple-500/40 blur-3xl rounded-3xl" />
          
          {/* Card principal */}
          <div className="relative bg-gradient-to-br from-[#1A1A1A] via-[#0A0A0A] to-[#1A1A1A] border-2 border-cyan-500/50 rounded-3xl p-8 overflow-hidden">
            {/* Border glow animation */}
            <div className="absolute inset-0 rounded-3xl">
              <motion.div
                className="absolute inset-0 opacity-50"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.5), transparent)",
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

            {/* Icon épico */}
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
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 blur-2xl opacity-60" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-3xl flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-white drop-shadow-2xl" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Title épico */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-black text-center mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text"
            >
              Momento de Evolução
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-300 text-center mb-6 text-sm leading-relaxed"
            >
              {timeMessage} Complete seu relatório semanal e receba feedback personalizado dos analistas.
            </motion.p>

            {/* Stats preview cinematográfico */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-3 mb-6"
            >
              <div className="bg-white/5 border border-cyan-500/30 rounded-2xl p-4 text-center">
                <TrendingUp className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                <p className="text-2xl font-black text-white">+50</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Pontos XP</p>
              </div>
              <div className="bg-white/5 border border-cyan-500/30 rounded-2xl p-4 text-center">
                <Sparkles className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-black text-white">IA</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Feedback</p>
              </div>
            </motion.div>

            {/* CTA Cinematográfico */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleStart}
                className="w-full h-14 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white font-black text-lg rounded-2xl shadow-2xl shadow-cyan-500/50 relative overflow-hidden group"
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
                  <Trophy className="w-6 h-6" />
                  Começar Avaliação
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