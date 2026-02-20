import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, X, Star, Trophy, Video, Calendar, 
  TrendingUp, Users, Target, Zap, MessageCircle, Award,
  Activity, Home, Upload, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

const tutorialSteps = [
  {
    id: "welcome",
    title: "Bem-vindo ao EC10 Talentos! 🎉",
    description: "Vamos fazer um tour rápido pelas principais funcionalidades do app",
    icon: Star,
    color: "from-yellow-500 to-orange-500",
    target: null,
    position: "center"
  },
  {
    id: "profile",
    title: "Seu Perfil de Atleta",
    description: "Aqui você visualiza suas estatísticas, evolução e gerencia seu perfil profissional",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    target: "profile-card",
    position: "bottom",
    highlight: true
  },
  {
    id: "stats",
    title: "Estatísticas",
    description: "Acompanhe seus gols, assistências, jogos e pontos conquistados",
    icon: BarChart3,
    color: "from-purple-500 to-pink-500",
    target: "stats-section",
    position: "bottom"
  },
  {
    id: "checkin",
    title: "Check-in Diário",
    description: "Registre como você se sente todos os dias. Mantenha a sequência para ganhar mais pontos!",
    icon: Calendar,
    color: "from-green-500 to-emerald-500",
    target: "daily-checkin",
    position: "top"
  },
  {
    id: "assessment",
    title: "Assessoria Semanal",
    description: "Toda semana, converse com nossos analistas sobre seus treinos e jogos",
    icon: MessageCircle,
    color: "from-cyan-500 to-blue-500",
    target: "weekly-assessment",
    position: "top"
  },
  {
    id: "upload",
    title: "Upload de Vídeos",
    description: "Envie vídeos dos seus jogos e treinos. Nossos analistas vão avaliar sua performance!",
    icon: Video,
    color: "from-red-500 to-orange-500",
    target: "upload-button",
    position: "top"
  },
  {
    id: "tasks",
    title: "Tarefas",
    description: "Complete tarefas e desafios para ganhar pontos e troféus",
    icon: Target,
    color: "from-orange-500 to-yellow-500",
    target: "tasks-card",
    position: "top"
  },
  {
    id: "trophies",
    title: "Troféus e Conquistas",
    description: "Cada marco alcançado gera troféus! Colecione todos!",
    icon: Trophy,
    color: "from-yellow-500 to-amber-500",
    target: "trophies-card",
    position: "top"
  },
  {
    id: "navigation",
    title: "Navegação",
    description: "Use o menu inferior para acessar rapidamente as principais funcionalidades",
    icon: Home,
    color: "from-indigo-500 to-purple-500",
    target: "bottom-nav",
    position: "top"
  },
  {
    id: "complete",
    title: "Tudo pronto! 🚀",
    description: "Agora você está pronto para começar sua jornada. Boa sorte, atleta!",
    icon: Zap,
    color: "from-green-500 to-emerald-500",
    target: null,
    position: "center"
  }
];

export default function AppTutorial({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState(null);

  const currentStepData = tutorialSteps[currentStep];

  useEffect(() => {
    if (currentStepData.target) {
      const element = document.getElementById(currentStepData.target);
      setTargetElement(element);
      
      // Scroll para o elemento
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    } else {
      setTargetElement(null);
    }
  }, [currentStep, currentStepData]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    onClose();
  };

  const handleComplete = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    onClose();
  };

  if (!isOpen) return null;

  const getTooltipPosition = () => {
    if (!targetElement || !currentStepData.target) return null;

    const rect = targetElement.getBoundingClientRect();
    const padding = 16;
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // No mobile, sempre posicionar na parte inferior da tela
      if (currentStepData.position === 'top') {
        return {
          bottom: '80px', // Acima da barra de navegação
          left: '16px',
          right: '16px',
          width: 'auto'
        };
      } else {
        return {
          top: `${rect.bottom + padding}px`,
          left: '16px',
          right: '16px',
          width: 'auto'
        };
      }
    }

    // Desktop
    const tooltipWidth = 320;
    const tooltipHeight = 200;

    if (currentStepData.position === 'top') {
      return {
        top: `${rect.top - tooltipHeight - padding}px`,
        left: `${Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, rect.left + rect.width / 2 - tooltipWidth / 2))}px`
      };
    } else if (currentStepData.position === 'bottom') {
      return {
        top: `${rect.bottom + padding}px`,
        left: `${Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, rect.left + rect.width / 2 - tooltipWidth / 2))}px`
      };
    }

    return null;
  };

  const tooltipStyle = getTooltipPosition() || {};

  return (
    <div className="fixed inset-0 z-[90]">
      {/* Overlay com recorte */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Highlight do elemento */}
      {targetElement && currentStepData.highlight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            top: targetElement.getBoundingClientRect().top - 8,
            left: targetElement.getBoundingClientRect().left - 8,
            width: targetElement.getBoundingClientRect().width + 16,
            height: targetElement.getBoundingClientRect().height + 16,
            border: '3px solid #00E5FF',
            borderRadius: '24px',
            boxShadow: '0 0 40px rgba(0, 229, 255, 0.6)',
            pointerEvents: 'none',
            zIndex: 91
          }}
        />
      )}

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed z-[92] left-4 right-4 md:left-auto md:right-auto md:w-80"
          style={{
            ...(currentStepData.target ? tooltipStyle : { 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              width: 'calc(100vw - 32px)',
              maxWidth: '360px'
            })
          }}
        >
          <div className={`relative bg-gradient-to-br ${currentStepData.color} p-[2px] rounded-3xl shadow-2xl`}>
            <div className="bg-[#0A1A2A] rounded-3xl p-5">
              {/* Close button */}
              <button
                onClick={handleSkip}
                className="absolute top-3 right-3 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2 }}
                className={`w-14 h-14 bg-gradient-to-br ${currentStepData.color} rounded-2xl flex items-center justify-center mb-4 shadow-xl`}
              >
                <currentStepData.icon className="w-7 h-7 text-white" />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-black text-white mb-2">
                {currentStepData.title}
              </h3>
              <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                {currentStepData.description}
              </p>

              {/* Progress dots */}
              <div className="flex items-center gap-1.5 mb-4">
                {tutorialSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentStep
                        ? 'w-8 bg-[#00E5FF]'
                        : idx < currentStep
                        ? 'w-4 bg-green-500'
                        : 'w-1.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    variant="outline"
                    className="flex-1 h-10 bg-white/5 border-2 border-white/10 text-white hover:bg-white/10 rounded-xl text-sm"
                  >
                    Voltar
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className={`flex-1 h-10 font-bold rounded-xl shadow-lg text-sm ${
                    currentStep === tutorialSteps.length - 1
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-[#00E5FF] to-[#0066FF]'
                  }`}
                >
                  {currentStep === tutorialSteps.length - 1 ? 'Começar!' : 'Próximo'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {currentStep < tutorialSteps.length - 1 && (
                <button
                  onClick={handleSkip}
                  className="w-full mt-3 text-gray-500 text-xs hover:text-white transition-colors"
                >
                  Pular tutorial
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}