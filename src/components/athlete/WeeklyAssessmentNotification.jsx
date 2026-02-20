import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WeeklyAssessmentNotification({ user, onOpen, onDismiss }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Verificar se precisa mostrar notificação
    if (!user) return;
    
    const lastAssessment = user.last_weekly_assessment;
    const now = new Date();
    
    if (!lastAssessment) {
      // Nunca fez assessment
      setShow(true);
      return;
    }

    const lastDate = new Date(lastAssessment);
    const daysSinceLastAssessment = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
    
    // Mostrar se passou 7 dias ou mais
    if (daysSinceLastAssessment >= 7) {
      setShow(true);
    }
  }, [user]);

  const handleOpen = () => {
    setShow(false);
    onOpen();
  };

  const handleDismiss = () => {
    setShow(false);
    onDismiss?.();
    // Permitir dismiss temporário por 24h
    localStorage.setItem('weeklyAssessmentDismissed', Date.now().toString());
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:max-w-md z-50"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-[#00E5FF]/10 via-[#0066FF]/10 to-[#00E5FF]/5 backdrop-blur-xl border border-[#00E5FF]/30 rounded-3xl p-4 shadow-2xl shadow-[#00E5FF]/20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <img 
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop" 
              alt="Campo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-[#00E5FF]/10 blur-2xl opacity-50" />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-12 h-12 bg-gradient-to-br from-[#00E5FF] to-[#0066FF] rounded-2xl flex items-center justify-center"
                >
                  <Sparkles className="w-6 h-6 text-black" />
                </motion.div>
                <div>
                  <h4 className="text-white font-black text-base">Assessoria Semanal</h4>
                  <p className="text-gray-300 text-xs">É hora de conversar! 💬</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="w-7 h-7 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            <p className="text-gray-200 text-sm mb-4 leading-relaxed">
              Como foi sua semana? Vamos conversar sobre seus treinos, jogos e evolução! ⚽
            </p>

            <div className="flex gap-2">
              <Button
                onClick={handleOpen}
                className="flex-1 bg-gradient-to-r from-[#00E5FF] to-[#0066FF] hover:from-[#00BFFF] hover:to-[#0055FF] text-black font-bold shadow-lg shadow-[#00E5FF]/30"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Começar Agora
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-white/5"
              >
                Depois
              </Button>
            </div>

            {/* Stats Preview */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10">
              <div className="text-center">
                <p className="text-[#00E5FF] text-xs font-bold">+50 Pontos</p>
                <p className="text-gray-400 text-[10px]">Por completar</p>
              </div>
              <div className="text-center">
                <p className="text-[#00E5FF] text-xs font-bold">5 min</p>
                <p className="text-gray-400 text-[10px]">Tempo estimado</p>
              </div>
            </div>
          </div>

          {/* Animated Border */}
          <motion.div
            className="absolute inset-0 border-2 border-[#00E5FF]/30 rounded-3xl"
            animate={{
              boxShadow: [
                "0 0 20px rgba(0, 229, 255, 0.3)",
                "0 0 40px rgba(0, 229, 255, 0.5)",
                "0 0 20px rgba(0, 229, 255, 0.3)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}