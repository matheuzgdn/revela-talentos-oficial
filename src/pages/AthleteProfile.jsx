import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  User, Settings, Video, Eye, Heart, Edit2, 
  Camera, LogOut, ChevronRight, Shield, Award,
  Clock, Calendar
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
  const queryClient = useQueryClient();

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
  const pendingVideos = myVideos.filter(v => v.status === "pending");

  const handleLogout = () => {
    base44.auth.logout(createPageUrl("RevelaTalentos"));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white pb-24">
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <User className="w-12 h-12 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Faça Login</h2>
          <p className="text-gray-400 text-center mb-6">
            Entre para acessar seu perfil e enviar seus vídeos
          </p>
          <Button
            onClick={() => base44.auth.redirectToLogin()}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold px-8 py-6 rounded-xl"
          >
            Entrar com Google
          </Button>
        </div>
        <MobileBottomNav onUploadClick={() => base44.auth.redirectToLogin()} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white pb-24">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600" />

        {/* Profile Info */}
        <div className="px-4 -mt-16 relative z-10">
          <div className="flex items-end gap-4 mb-4">
            <Avatar className="w-28 h-28 border-4 border-black">
              <AvatarImage src={user.profile_picture_url} />
              <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-3xl">
                {user.full_name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-white">{user.full_name}</h1>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-800/50">
              <p className="text-2xl font-bold text-white">{myVideos.length}</p>
              <p className="text-gray-400 text-xs">Vídeos</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-800/50">
              <p className="text-2xl font-bold text-white">{totalViews}</p>
              <p className="text-gray-400 text-xs">Views</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-800/50">
              <p className="text-2xl font-bold text-white">{totalLikes}</p>
              <p className="text-gray-400 text-xs">Curtidas</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap mb-6">
            {user.has_plano_carreira_access && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black">
                <Award className="w-3 h-3 mr-1" />
                Plano Carreira
              </Badge>
            )}
            {user.role === "admin" && (
              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* My Videos */}
      <section className="px-4 py-6">
        <h2 className="text-lg font-bold text-white mb-4">Meus Vídeos</h2>

        {pendingVideos.length > 0 && (
          <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{pendingVideos.length} vídeo(s) em análise</span>
            </div>
            <p className="text-gray-400 text-sm">
              Seus vídeos serão publicados após aprovação
            </p>
          </div>
        )}

        {myVideos.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/30 rounded-2xl border border-gray-800/50">
            <Video className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Você ainda não enviou vídeos</p>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold mt-4"
            >
              Enviar Primeiro Vídeo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {myVideos.map((video) => (
              <div
                key={video.id}
                className="relative aspect-[3/4] rounded-lg overflow-hidden"
              >
                <img
                  src={video.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                {/* Status Badge */}
                {video.status === "pending" && (
                  <Badge className="absolute top-1 left-1 bg-yellow-500/80 text-black text-[10px] px-1.5">
                    Pendente
                  </Badge>
                )}

                <div className="absolute bottom-1 left-1 right-1">
                  <div className="flex items-center gap-2 text-white text-[10px]">
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-3 h-3" /> {video.views_count || 0}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Heart className="w-3 h-3" /> {video.likes_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Menu Options */}
      <section className="px-4 py-4">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 overflow-hidden">
          <Link
            to={createPageUrl("MeusServicos")}
            className="flex items-center gap-4 p-4 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-white flex-1">Configurações</span>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 p-4 w-full hover:bg-gray-800/30 transition-colors text-left"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="text-red-400">Sair</span>
          </button>
        </div>
      </section>

      {/* Bottom Navigation */}
      <MobileBottomNav onUploadClick={() => setShowUploadModal(true)} />

      {/* Upload Modal */}
      <VideoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        user={user}
      />
    </div>
  );
}