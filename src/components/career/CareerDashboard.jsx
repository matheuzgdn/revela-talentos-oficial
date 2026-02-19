
import React, { useState, useEffect } from "react";
import { Content } from "@/entities/Content";
import { User } from "@/entities/User"; // Added User import
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Star,
  BarChart3,
  Video,
  TrendingUp,
  Users,
  Award,
  Target,
  Play
} from "lucide-react";
// REMOVED: import NextGameForm from "./NextGameForm";
import FaqSection from "./FaqSection";
import AthleteProfile from "./AthleteProfile"; // Added AthleteProfile import
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function CareerDashboard({ user, uploads, setActiveView, progress, performance }) {
  const [featuredContents, setFeaturedContents] = useState([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [currentUser, setCurrentUser] = useState(user); // Added currentUser state

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    loadFeaturedContent();
  }, []);

  const loadFeaturedContent = async () => {
    setIsLoadingContent(true);
    try {
      const contents = await Content.filter({ is_published: true }, "-created_date", 6);
      setFeaturedContents(contents.slice(0, 6)); // Pega os 6 mais recentes
    } catch (error) {
      console.error("Error loading featured content:", error);
      setFeaturedContents([]);
    }
    setIsLoadingContent(false);
  };

  // Added handleUserUpdate function
  const handleUserUpdate = async () => {
    try {
      const updatedUser = await User.me();
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  const completedMentorias = progress?.filter(p => p.completed).length || 0;

  const completedAnalyses = performance?.filter(p => p.status === 'completed') || [];
  const averageRating = completedAnalyses.length > 0
    ? (completedAnalyses.reduce((sum, p) => sum + p.rating, 0) / completedAnalyses.length)
    : 0;

  const generalProgress = (averageRating / 10) * 100;

  const stats = [
    { label: "Vídeos Enviados", value: uploads?.length || 0, icon: Video, color: "text-cyan-400" },
    { label: "Mentorias Assistidas", value: completedMentorias, icon: Star, color: "text-yellow-400" },
    { label: "Progresso Geral", value: `${Math.round(generalProgress)}%`, icon: TrendingUp, color: "text-green-400" },
    { label: "Nota Média", value: averageRating.toFixed(1), icon: Award, color: "text-purple-400" }
  ];

  return (
    <div className="space-y-8">
      {/* Athlete Profile Section */}
      {/* Replaced the original header with AthleteProfile */}
      <AthleteProfile user={currentUser} onUserUpdate={handleUserUpdate} />

      {/* Stats Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="bg-gray-900/50 border-gray-800 hover:border-cyan-400/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions Grid - AGORA APENAS COM UPLOAD */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ delay: 0.2 }}
      >
        <Card
          className="bg-gray-900/50 border-gray-800 hover:border-cyan-400/50 h-full transition-all duration-300 cursor-pointer"
          onClick={() => setActiveView('material')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Upload className="w-5 h-5" />
              Central de Uploads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-6">Envie seus vídeos de desempenho e fotos para marketing.</p>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-cyan-400/50 transition-colors duration-300">
              <Upload className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Clique aqui para ir à galeria de material</p>
              <p className="text-xs text-gray-600 mt-2">Envie vídeos de jogos, treinos ou marketing</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Módulos de Acompanhamento */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Módulos de Acompanhamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Performance Analysis - ATIVADO */}
          <Card className="bg-black border-2 border-blue-400/50 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-400/20 hover:scale-105">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-blue-400 text-xl">
                <div className="w-12 h-12 bg-blue-400/10 border border-blue-400/30 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                Análise de Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                Acesse relatórios detalhados sobre sua performance em campo com dados reais conectados ao seu perfil.
              </p>
              <Button asChild className="w-full bg-black text-blue-400 hover:bg-blue-400/10 font-bold py-3 rounded-lg shadow-lg border border-blue-400">
                <Link to={createPageUrl("AnalisePerformance")}>
                  Ver Relatórios
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Mentoria Access */}
          <Card className="bg-black border-2 border-green-400/50 hover:border-green-400 transition-all duration-300 hover:shadow-xl hover:shadow-green-400/20 hover:scale-105">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-green-400 text-xl">
                <div className="w-12 h-12 bg-green-400/10 border border-green-400/30 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                Mentorias Exclusivas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                Acesse conteúdos e sessões de mentoria com especialistas reais cadastrados na plataforma.
              </p>
              <Button asChild className="w-full bg-black text-green-400 hover:bg-green-400/10 font-bold py-3 rounded-lg shadow-lg border border-green-400">
                <Link to={createPageUrl("RevelaTalentos")}>
                  Acessar Revela Talentos
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* International Plan */}
          <Card className="bg-black border-2 border-purple-400/50 hover:border-purple-400 transition-all duration-300 hover:shadow-xl hover:shadow-purple-400/20 hover:scale-105">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-purple-400 text-xl">
                <div className="w-12 h-12 bg-purple-400/10 border border-purple-400/30 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                Plano Internacional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                Explore oportunidades no futebol europeu através de nossa rede de scouts.
              </p>
              <Button asChild className="w-full bg-black text-purple-400 hover:bg-purple-400/10 font-bold py-3 rounded-lg shadow-lg border border-purple-400">
                <Link to={createPageUrl("PlanoInternacional")}>
                  Ver Oportunidades
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Featured Content from Revela Talentos */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Conteúdos Destacados do Revela Talentos</h2>
        {isLoadingContent ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-gray-900/50 border-gray-800 animate-pulse">
                <div className="h-24 bg-gray-800 rounded-t-lg"></div>
                <CardContent className="p-3">
                  <div className="h-3 bg-gray-800 rounded mb-2"></div>
                  <div className="h-2 bg-gray-800 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredContents.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <Link to={createPageUrl("RevelaTalentos")}>
                  <Card className="bg-gray-900/50 border-gray-800 hover:border-cyan-400/50 transition-all duration-300 h-full">
                    <div className="relative h-24 overflow-hidden">
                      <img
                        src={content.thumbnail_url || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400&h=225&auto=format&fit=crop"}
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={`absolute top-1 right-1 text-xs ${content.access_level === 'elite' ? 'bg-yellow-500/80 text-black' : 'bg-blue-500/80 text-white'}`}>
                        {content.access_level === 'elite' ? 'E' : 'B'}
                      </Badge>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="text-white text-sm font-medium line-clamp-2 leading-tight">
                        {content.title}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1">
                        {content.duration || 15}min
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-6">
          <Button asChild variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black">
            <Link to={createPageUrl("RevelaTalentos")}>
              Ver Todos os Conteúdos
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <FaqSection />
    </div>
  );
}
