import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { UserNotification } from "@/entities/UserNotification";
import { 
  Star, 
  TrendingUp, 
  Globe, 
  Trophy
} from "lucide-react";
import HeroSection from "../components/hub/HeroSection";
import ModernServiceGrid from "../components/hub/ModernServiceGrid";
import AboutSection from "../components/hub/AboutSection";
import GlobalPresenceMap from "../components/hub/GlobalPresenceMap";
import FeaturedAthletesSection from "../components/hub/FeaturedAthletesSection";
import TestimonialsSection from "../components/hub/TestimonialsSection";
import CtaSection from "../components/hub/CtaSection";

export default function HubPage() {
  const [user, setUser] = useState(null);
  const [userNotifications, setUserNotifications] = useState(0);
  const [totalNotifications, setTotalNotifications] = useState(3);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me().catch(() => null);
      setUser(currentUser);
      
      // Load notifications in background only if needed
      if (currentUser) {
        UserNotification.filter({ 
          user_id: currentUser.id,
          is_read: false 
        }, null, 10).then(notifications => {
          setUserNotifications(notifications.length);
        }).catch(() => {});
      }
    } catch (error) {
      setUser(null);
    }
  };

  const services = [
    {
      id: "revela-talentos",
      title: "Revela Talentos",
      subtitle: "Conteúdo & Mentorias",
      description: "Acesse vídeos exclusivos, mentorias e desenvolvimento com especialistas.",
      icon: Star,
      route: "RevelaTalentos",
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-950/30",
      borderColor: "border-blue-500/20",
      hoverBorder: "hover:border-blue-400/60",
      glowColor: "hover:shadow-blue-500/20",
      features: ["Mentorias semanais", "Conteúdo técnico", "Lives exclusivas"],
      price: "R$ 197/mês",
      public: false
    },
    {
      id: "plano-carreira",
      title: "Plano de Carreira",
      subtitle: "Gestão Completa",
      description: "Análise de performance, marketing e conexões diretas com clubes.",
      icon: TrendingUp,
      route: "PlanoCarreira",
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-950/30",
      borderColor: "border-green-500/20",
      hoverBorder: "hover:border-green-400/60",
      glowColor: "hover:shadow-green-500/20",
      features: ["Análise de performance", "Marketing pessoal", "Conexões com clubes"],
      price: "R$ 997/mês",
      public: false,
      popular: true
    },
    {
      id: "plano-internacional",
      title: "Plano Internacional",
      subtitle: "Futebol Europeu & Mundial",
      description: "Sua porta de entrada para o futebol europeu com EuroCamps e avaliações diretas.",
      icon: Globe,
      route: "PlanoInternacional",
      gradient: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-950/30",
      borderColor: "border-purple-500/20",
      hoverBorder: "hover:border-purple-400/60",
      glowColor: "hover:shadow-purple-500/20",
      features: ["EuroCamp", "Avaliações diretas", "Network internacional"],
      price: "Consulte",
      public: true,
      featured: true
    },
    {
      id: "campeonatos-ec10",
      title: "Campeonatos EC10",
      subtitle: "Competições Exclusivas",
      description: "Participe dos campeonatos organizados e mostre seu talento em campo.",
      icon: Trophy,
      route: "CampeonatosEC10",
      gradient: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-950/30",
      borderColor: "border-amber-500/20",
      hoverBorder: "hover:border-amber-400/60",
      glowColor: "hover:shadow-amber-500/20",
      features: ["Torneios mensais", "Scouts presentes", "Premiações"],
      price: "Gratuito",
      public: true
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection 
        user={user} 
        totalNotifications={totalNotifications}
        userNotifications={userNotifications}
      />
      
      <main className="relative z-10 bg-black">
        <div className="relative py-16 px-4">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-950/80 to-black pointer-events-none" />
          <div className="max-w-7xl mx-auto relative">
            <ModernServiceGrid services={services} user={user} />
          </div>
        </div>
        
        <AboutSection />
        <GlobalPresenceMap />
        <FeaturedAthletesSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
    </div>
  );
}