import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  User, Settings, Video, Eye, Heart, Share2,
  ChevronLeft, Award, MapPin, Calendar, Flag,
  Play, Star, TrendingUp, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MobileBottomNav from "../components/mobile/MobileBottomNav";
import VideoUploadModal from "../components/mobile/VideoUploadModal";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function AthleteProfile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    base44.auth.me()
      .then(u => {
        setUser(u);
        setIsLoading(false);
      })
      .catch(() => {
        setUser(null);
        setIsLoading(false);
      });
  }, []);

  const { data: myVideos = [] } = useQuery({
    queryKey: ['myVideos', user?.id],
    queryFn: () => base44.entities.AthleteVideo.filter({ athlete_id: user.id }, "-created_date", 50),
    enabled: !!user?.id,
  });

  const totalViews = myVideos.reduce((acc, v) => acc + (v.views_count || 0), 0);
  const totalLikes = myVideos.reduce((acc, v) => acc + (v.likes_count || 0), 0);
  const approvedVideos = myVideos.filter(v => v.status === "approved");

  const handleLogout = () => {
    base44.auth.logout(createPageUrl("RevelaTalentos"));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
          <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6 border border-gray-800">
            <User className="w-12 h-12 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Faça Login</h2>
          <p className="text-gray-500 text-center mb-6">
            Entre para acessar seu perfil e enviar seus vídeos
          </p>
          <Button
            onClick={() => base44.auth.redirectToLogin()}
            className="bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black font-bold px-8 py-6 rounded-2xl"
          >
            Entrar com Google
          </Button>
        </div>
        <MobileBottomNav onUploadClick={() => base44.auth.redirectToLogin()} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-6">
        <Link to={createPageUrl("RevelaTalentos")}>
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <button className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-gray-800">
          <Share2 className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Profile Card */}
      <div className="px-4 pb-6">
        <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] rounded-3xl overflow-hidden border border-gray-800/50">
          {/* Badge Number */}
          <div className="absolute top-4 right-4 flex items-center gap-1">
            <div className="w-16 h-16 flex items-center justify-center">
              <span className="text-5xl font-black text-cyan-400/20">10</span>
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex flex-col items-center pt-8 pb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                {user.profile_picture_url ? (
                  <img 
                    src={user.profile_picture_url} 
                    alt={user.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">{user.full_name?.charAt(0)}</span>
                  </div>
                )}
              </div>
              {/* Status indicator */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-500 rounded-full">
                <span className="text-xs font-bold text-black">ATLETA</span>
              </div>
            </div>

            {/* Name */}
            <h1 className="text-2xl font-black text-white mt-6 tracking-wide uppercase">
              {user.full_name}
            </h1>
            
            {/* Location */}
            <div className="flex items-center gap-2 mt-2">
              <Flag className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-400 text-sm">BRASIL</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 px-6 py-4 border-t border-gray-800/50">
            <div className="text-center">
              <p className="text-2xl font-black text-white">{myVideos.length}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Vídeos</p>
            </div>
            <div className="text-center border-x border-gray-800/50">
              <p className="text-2xl font-black text-white">{totalViews}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Views</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white">{totalLikes}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Curtidas</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800/50"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Impacto</span>
              <Star className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-3xl font-black text-cyan-400">25%</p>
            <div className="flex items-center gap-1 mt-2">
              <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="w-1/4 h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800/50"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Progresso</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-3xl font-black text-white">{approvedVideos.length}</p>
            <p className="text-xs text-gray-500 mt-1">vídeos aprovados</p>
          </motion.div>
        </div>
      </div>

      {/* My Videos */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Meus Vídeos</h2>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-0">
            {myVideos.length}
          </Badge>
        </div>

        {myVideos.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-2xl p-8 text-center border border-gray-800/50">
            <div className="w-16 h-16 bg-[#252525] rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 mb-4">Nenhum vídeo enviado ainda</p>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold rounded-xl"
            >
              Enviar Primeiro Vídeo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {myVideos.map((video) => (
              <motion.div
                key={video.id}
                whileTap={{ scale: 0.95 }}
                className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1a1a1a]"
              >
                <img
                  src={video.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                {video.status === "pending" && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-yellow-500/90 rounded-full">
                    <span className="text-[10px] font-bold text-black">PENDENTE</span>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-white">
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-3 h-3" /> {video.views_count || 0}
                    </span>
                  </div>
                  <div className="w-6 h-6 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                    <Play className="w-3 h-3 text-white ml-0.5" fill="white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Menu Options */}
      <section className="px-4 py-4">
        <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800/50">
          <Link
            to={createPageUrl("MeusServicos")}
            className="flex items-center gap-4 p-4 border-b border-gray-800/50 active:bg-gray-800/30"
          >
            <div className="w-10 h-10 bg-[#252525] rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-white flex-1">Configurações</span>
            <ChevronLeft className="w-5 h-5 text-gray-600 rotate-180" />
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 p-4 w-full active:bg-gray-800/30"
          >
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-red-400">Sair da conta</span>
          </button>
        </div>
      </section>

      <MobileBottomNav onUploadClick={() => setShowUploadModal(true)} />

      <VideoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        user={user}
      />
    </div>
  );
}