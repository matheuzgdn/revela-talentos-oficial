import React from 'react';
import { Star, TrendingUp, Globe, Trophy } from 'lucide-react';
import GuestLayout from '@/components/layout/GuestLayout';
import HeroSection from '@/components/hub/HeroSection';
import ModernServiceGrid from '@/components/hub/ModernServiceGrid';
import AboutSection from '@/components/hub/AboutSection';
import GlobalPresenceMap from '@/components/hub/GlobalPresenceMap';
import FeaturedAthletesSection from '@/components/hub/FeaturedAthletesSection';
import TestimonialsSection from '@/components/hub/TestimonialsSection';
import CtaSection from '@/components/hub/CtaSection';

// Dados dos serviços para a grade
const services = [
    {
      id: "revela-talentos",
      title: "Revela Talentos",
      description: "Acesse vídeos exclusivos, mentorias e desenvolvimento com especialistas.",
      icon: Star,
      route: "RevelaTalentos",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "plano-carreira",
      title: "Plano de Carreira",
      description: "Análise de performance, marketing e conexões diretas com clubes.",
      icon: TrendingUp,
      route: "PlanoCarreira",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "plano-internacional",
      title: "Plano Internacional",
      description: "Sua porta de entrada para o futebol europeu com EuroCamps e avaliações.",
      icon: Globe,
      route: "PlanoInternacional",
      gradient: "from-purple-500 to-violet-500",
    },
    {
      id: "campeonatos-ec10",
      title: "Campeonatos EC10",
      description: "Participe dos campeonatos organizados e mostre seu talento em campo.",
      icon: Trophy,
      route: "CampeonatosEC10",
      gradient: "from-amber-500 to-orange-500",
    }
  ];

export default function HomePage() {
  return (
    <GuestLayout>
      <HeroSection user={null} />
      <main className="relative z-10 bg-black">
        <div className="relative py-16 px-4">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-950/80 to-black pointer-events-none" />
          <div className="max-w-7xl mx-auto relative">
            <ModernServiceGrid services={services} user={null} />
          </div>
        </div>
        
        <AboutSection />
        <GlobalPresenceMap />
        <FeaturedAthletesSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
    </GuestLayout>
  );
}