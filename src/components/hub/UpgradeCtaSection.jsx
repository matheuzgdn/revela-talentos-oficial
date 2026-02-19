import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, TrendingUp, Users, Shield, Target, Award, Sparkles, Trophy, Star, Zap, Rocket, Flag, MessageCircle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { createPageUrl } from "@/utils";

const iconMap = {
  Crown, TrendingUp, Users, Shield, Target, Award, Sparkles, Trophy, Star, Zap, Rocket, Flag, MessageCircle, CheckCircle
};

const colorStyles = {
  green: {
    gradient: 'from-[#0a1f1f] via-[#0d2626] to-[#0a1f1f]',
    border: 'border-green-500/20',
    iconBg: 'from-green-400 to-emerald-500',
    iconShadow: 'shadow-green-500/30',
    titleGradient: 'from-green-400 to-emerald-400',
    buttonGradient: 'from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500',
    buttonShadow: 'shadow-green-500/30',
    featureBorder: 'border-green-500/20 hover:border-green-500/40',
    featureIconBg: 'bg-green-500/10 group-hover:bg-green-500/20',
    featureIcon: 'text-green-400',
    dotActive: 'bg-green-400'
  },
  blue: {
    gradient: 'from-[#0a1a2e] via-[#0d1f35] to-[#0a1a2e]',
    border: 'border-blue-500/20',
    iconBg: 'from-blue-400 to-cyan-500',
    iconShadow: 'shadow-blue-500/30',
    titleGradient: 'from-blue-400 to-cyan-400',
    buttonGradient: 'from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500',
    buttonShadow: 'shadow-blue-500/30',
    featureBorder: 'border-blue-500/20 hover:border-blue-500/40',
    featureIconBg: 'bg-blue-500/10 group-hover:bg-blue-500/20',
    featureIcon: 'text-blue-400',
    dotActive: 'bg-blue-400'
  },
  purple: {
    gradient: 'from-[#1a0a2e] via-[#250d35] to-[#1a0a2e]',
    border: 'border-purple-500/20',
    iconBg: 'from-purple-400 to-violet-500',
    iconShadow: 'shadow-purple-500/30',
    titleGradient: 'from-purple-400 to-violet-400',
    buttonGradient: 'from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500',
    buttonShadow: 'shadow-purple-500/30',
    featureBorder: 'border-purple-500/20 hover:border-purple-500/40',
    featureIconBg: 'bg-purple-500/10 group-hover:bg-purple-500/20',
    featureIcon: 'text-purple-400',
    dotActive: 'bg-purple-400'
  },
  orange: {
    gradient: 'from-[#2e1a0a] via-[#351f0d] to-[#2e1a0a]',
    border: 'border-orange-500/20',
    iconBg: 'from-orange-400 to-amber-500',
    iconShadow: 'shadow-orange-500/30',
    titleGradient: 'from-orange-400 to-amber-400',
    buttonGradient: 'from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500',
    buttonShadow: 'shadow-orange-500/30',
    featureBorder: 'border-orange-500/20 hover:border-orange-500/40',
    featureIconBg: 'bg-orange-500/10 group-hover:bg-orange-500/20',
    featureIcon: 'text-orange-400',
    dotActive: 'bg-orange-400'
  },
  red: {
    gradient: 'from-[#2e0a0a] via-[#350d0d] to-[#2e0a0a]',
    border: 'border-red-500/20',
    iconBg: 'from-red-400 to-rose-500',
    iconShadow: 'shadow-red-500/30',
    titleGradient: 'from-red-400 to-rose-400',
    buttonGradient: 'from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500',
    buttonShadow: 'shadow-red-500/30',
    featureBorder: 'border-red-500/20 hover:border-red-500/40',
    featureIconBg: 'bg-red-500/10 group-hover:bg-red-500/20',
    featureIcon: 'text-red-400',
    dotActive: 'bg-red-400'
  },
  cyan: {
    gradient: 'from-[#0a2e2e] via-[#0d3535] to-[#0a2e2e]',
    border: 'border-cyan-500/20',
    iconBg: 'from-cyan-400 to-teal-500',
    iconShadow: 'shadow-cyan-500/30',
    titleGradient: 'from-cyan-400 to-teal-400',
    buttonGradient: 'from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500',
    buttonShadow: 'shadow-cyan-500/30',
    featureBorder: 'border-cyan-500/20 hover:border-cyan-500/40',
    featureIconBg: 'bg-cyan-500/10 group-hover:bg-cyan-500/20',
    featureIcon: 'text-cyan-400',
    dotActive: 'bg-cyan-400'
  },
  yellow: {
    gradient: 'from-[#2e2a0a] via-[#35300d] to-[#2e2a0a]',
    border: 'border-yellow-500/20',
    iconBg: 'from-yellow-400 to-amber-500',
    iconShadow: 'shadow-yellow-500/30',
    titleGradient: 'from-yellow-400 to-amber-400',
    buttonGradient: 'from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500',
    buttonShadow: 'shadow-yellow-500/30',
    featureBorder: 'border-yellow-500/20 hover:border-yellow-500/40',
    featureIconBg: 'bg-yellow-500/10 group-hover:bg-yellow-500/20',
    featureIcon: 'text-yellow-400',
    dotActive: 'bg-yellow-400'
  },
  pink: {
    gradient: 'from-[#2e0a1f] via-[#350d26] to-[#2e0a1f]',
    border: 'border-pink-500/20',
    iconBg: 'from-pink-400 to-rose-500',
    iconShadow: 'shadow-pink-500/30',
    titleGradient: 'from-pink-400 to-rose-400',
    buttonGradient: 'from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500',
    buttonShadow: 'shadow-pink-500/30',
    featureBorder: 'border-pink-500/20 hover:border-pink-500/40',
    featureIconBg: 'bg-pink-500/10 group-hover:bg-pink-500/20',
    featureIcon: 'text-pink-400',
    dotActive: 'bg-pink-400'
  }
};

export default function UpgradeCtaSection() {
  const [services, setServices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await base44.entities.ServiceHighlight.filter(
        { is_active: true },
        'display_order'
      );
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (services.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % services.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [services.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  const handleButtonClick = (service) => {
    if (service.button_url) {
      if (service.button_url.startsWith('http')) {
        window.open(service.button_url, '_blank');
      } else {
        window.location.href = createPageUrl(service.button_url);
      }
    }
  };

  if (isLoading || services.length === 0) {
    return null;
  }

  const currentService = services[currentIndex];
  const IconComponent = iconMap[currentService?.icon_name] || Crown;
  const features = currentService?.features || [];
  const colors = colorStyles[currentService?.card_color] || colorStyles.green;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`relative bg-gradient-to-br ${colors.gradient} border-2 ${colors.border} rounded-3xl p-6 md:p-10 overflow-hidden shadow-2xl`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)]" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${colors.iconBg} rounded-2xl flex items-center justify-center shadow-lg ${colors.iconShadow}`}>
                <IconComponent className="w-9 h-9 text-white" />
              </div>

              <div>
                <h3 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4">
                  {currentService?.title || 'Serviço Premium'}{' '}
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${colors.titleGradient}`}>
                    {currentService?.title_highlight}
                  </span>
                </h3>
                
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  {currentService?.description || ''}
                </p>
              </div>

              <Button 
                onClick={() => handleButtonClick(currentService)}
                className={`bg-gradient-to-r ${colors.buttonGradient} text-white font-bold px-8 py-6 rounded-xl text-base shadow-lg ${colors.buttonShadow} transition-all`}
              >
                {currentService?.button_text || 'Ver Benefícios'}
              </Button>

              {services.length > 1 && (
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevSlide}
                    className="text-white hover:bg-white/10 h-10 w-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <div className="flex gap-2">
                    {services.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentIndex 
                            ? `w-8 ${colors.dotActive}` 
                            : 'w-2 bg-gray-600 hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextSlide}
                    className="text-white hover:bg-white/10 h-10 w-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {features.map((feature, index) => {
                const FeatureIcon = iconMap[feature?.icon] || TrendingUp;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`group bg-gradient-to-r from-gray-900/50 to-gray-800/30 backdrop-blur-sm border ${colors.featureBorder} rounded-xl p-4 transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${colors.featureIconBg} rounded-lg flex items-center justify-center transition-colors`}>
                        <FeatureIcon className={`w-5 h-5 ${colors.featureIcon}`} />
                      </div>
                      <span className="text-white font-medium text-sm md:text-base">
                        {feature?.text || ''}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}