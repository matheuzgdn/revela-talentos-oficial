import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Video, Upload, BarChart, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const tutorialSteps = [
  {
    id: 1,
    title: "Bem-vindo ao EC10 Talentos",
    description: "Vamos fazer um tour rápido pelas funcionalidades do app",
    icon: Star,
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: 2,
    title: "Conteúdos Exclusivos",
    description: "Acesse vídeos, mentorias e treinamentos de alto nível",
    icon: Video,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    title: "Upload de Vídeos",
    description: "Compartilhe seus melhores momentos e jogadas",
    icon: Upload,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 4,
    title: "Acompanhe seu Progresso",
    description: "Monitore sua evolução e performance ao longo do tempo",
    icon: BarChart,
    color: "from-green-500 to-emerald-500"
  }
];

export default function AppTutorial({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  const currentStepData = tutorialSteps[currentStep];

  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('tutorial_completed');
    if (tutorialCompleted === 'true') {
      setHasSeenTutorial(true);
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen && !hasSeenTutorial) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, hasSeenTutorial]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('tutorial_completed', 'true');
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('tutorial_completed', 'true');
    onClose();
  };

  if (!isOpen || hasSeenTutorial) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {/* Close Button */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 z-[101] w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Tutorial Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md"
        >
          <div className={`relative bg-gradient-to-br ${currentStepData.color} p-[2px] rounded-3xl`}>
            <div className="bg-[#0A1A2A] rounded-3xl p-6 md:p-8">
              {/* Icon */}
              <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${currentStepData.color} flex items-center justify-center shadow-2xl`}>
                <currentStepData.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>

              {/* Content */}
              <div className="text-center mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                  {currentStepData.title}
                </h3>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>

              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {tutorialSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentStep
                        ? 'w-8 h-2 bg-gradient-to-r ' + currentStepData.color
                        : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-3">
                <Button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  variant="outline"
                  className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed h-12"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
                <Button
                  onClick={handleNext}
                  className={`flex-1 bg-gradient-to-r ${currentStepData.color} hover:opacity-90 text-white font-bold shadow-lg h-12`}
                >
                  {currentStep === tutorialSteps.length - 1 ? (
                    "Começar"
                  ) : (
                    <>
                      Próximo
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {/* Skip Button */}
              <button
                onClick={handleSkip}
                className="w-full mt-4 text-sm text-gray-400 hover:text-white transition-colors py-2"
              >
                Pular tutorial
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}