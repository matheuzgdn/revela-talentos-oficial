import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Star, TrendingUp, Globe, Settings, Lock, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const services = [
  {
    title: "Revela Talentos",
    icon: Star,
    route: "RevelaTalentos",
    public: false,
    requiresAuth: true,
    gradient: "from-blue-500 to-cyan-400",
    bgColor: "bg-blue-950/30",
    description: "Conteúdos exclusivos e mentorias"
  },
  {
    title: "Plano de Carreira",
    icon: TrendingUp,
    route: "PlanoCarreira",
    public: false,
    requiresAuth: true,
    gradient: "from-green-400 to-emerald-500",
    bgColor: "bg-green-950/30",
    description: "Gestão completa da sua carreira"
  },
  {
    title: "Plano Internacional",
    icon: Globe,
    route: "PlanoInternacional",
    public: true,
    gradient: "from-cyan-400 to-blue-500",
    bgColor: "bg-cyan-950/30",
    description: "Sua porta para o futebol europeu",
    featured: true
  },
  {
    title: "Meus Serviços",
    icon: Settings,
    route: "MeusServicos",
    public: false,
    requiresAuth: true,
    gradient: "from-purple-400 to-pink-500",
    bgColor: "bg-purple-950/30",
    description: "Configure suas preferências"
  }
];

export default function ServiceIcons({ user }) {
  const canAccess = (service) => {
    if (service.public) return true;
    if (!user) return false;
    if (service.requiresElite) return user.subscription_level === 'elite';
    return true;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-4 md:px-12"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center">Nossos Serviços</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {services.map((service, index) => {
          const isAccessible = canAccess(service);
          
          const content = (
            <div className={`relative w-full h-36 md:h-48 ${service.bgColor} border-2 ${
              service.featured ? 'border-cyan-400 shadow-xl shadow-cyan-400/20' : 'border-gray-800'
            } rounded-2xl flex flex-col items-center justify-center space-y-2 md:space-y-4 p-3 md:p-6 group-hover:border-white/50 transition-all duration-300 hover:shadow-2xl ${
              service.featured ? 'hover:shadow-cyan-400/30' : 'hover:shadow-white/10'
            }`}>
              {service.featured && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-xs animate-pulse">
                    DESTAQUE
                  </Badge>
                </div>
              )}
              
              <div className="relative">
                <div className={`absolute -inset-3 md:-inset-4 bg-gradient-to-r ${service.gradient} rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300`}></div>
                <div className={`relative w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <service.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
              </div>
              
              <div className="text-center space-y-1 md:space-y-2">
                <h3 className={`font-bold text-sm md:text-lg ${service.featured ? 'text-cyan-300' : 'text-white'}`}>
                  {service.title}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm leading-tight hidden md:block">
                  {service.description}
                </p>
              </div>
              
              {!isAccessible && (
                <div className="absolute top-2 md:top-4 right-2 md:right-4 p-1 md:p-2 bg-gray-900/80 rounded-full">
                  <Lock className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                </div>
              )}

              {service.featured && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/10 to-blue-500/10 pointer-events-none"></div>
              )}
            </div>
          );

          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ 
                delay: index * 0.1,
                hover: { duration: 0.2 }
              }}
              className="group"
            >
              <Link to={createPageUrl(service.route)} className="block">
                {content}
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* CTA Section for Career Plans - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 md:mt-16"
      >
        <div className="relative bg-gradient-to-r from-slate-900/80 to-blue-900/80 border border-cyan-400/30 rounded-3xl p-6 md:p-8 lg:p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-500/5"></div>
          <div className="relative text-center space-y-4 md:space-y-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-cyan-400/30">
              <Crown className="w-8 h-8 md:w-10 md:h-10 text-black" />
            </div>
            
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              Acelere sua Carreira no Futebol
            </h3>
            
            <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg lg:text-xl px-2">
              Com nossos planos especializados, você tem acesso a mentoria personalizada, 
              análises técnicas e oportunidades internacionais exclusivas.
            </p>
            
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center px-2 md:px-0">
              <Button 
                asChild
                size="lg"
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-bold text-base md:text-lg px-6 md:px-8 py-4 rounded-xl shadow-lg shadow-cyan-400/25 w-full md:w-auto"
              >
                <Link to={createPageUrl("PlanoCarreira")}>
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Plano de Carreira
                </Link>
              </Button>
              
              <Button 
                asChild
                size="lg"
                variant="outline"
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold text-base md:text-lg px-6 md:px-8 py-4 rounded-xl w-full md:w-auto"
              >
                <Link to={createPageUrl("PlanoInternacional")}>
                  <Globe className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Plano Internacional
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}