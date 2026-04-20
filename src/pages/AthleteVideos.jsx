import React, { useState, useEffect } from "react";
import { appClient } from "@/api/backendClient";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Play, Heart, Eye, Star, Zap, Sparkles, Flame, Target, Dumbbell, Trophy } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageContext";
import { Badge } from "@/components/ui/badge";
import MobileBottomNav from "../components/mobile/MobileBottomNav";
import VideoUploadModal from "../components/mobile/VideoUploadModal";
import VideoAnalysisModal from "../components/athlete/VideoAnalysisModal";

export default function AthleteVideos() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    appClient.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: allVideos = [], isLoading } = useQuery({
    queryKey: ['athleteVideos', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return appClient.entities.AthleteVideo.filter({ status: "approved" }, "-created_date", 50);
      }
      // Para o usuário logado, mostrar todos os seus vídeos
      const myVideos = await appClient.entities.AthleteVideo.filter({ athlete_id: user.id }, "-created_date", 50);
      return myVideos;
    },
    enabled: true
  });

  const videos = allVideos || [];

  const categories = [
    { id: "all", label: t('videos.all'), icon: Target },
    { id: "destaque", label: t('videos.highlights'), icon: Flame },
    { id: "treino", label: t('videos.training'), icon: Dumbbell },
    { id: "jogo", label: t('videos.matches'), icon: Trophy },
    { id: "habilidade", label: t('videos.skills'), icon: Star },
  ];

  const filteredVideos = activeCategory === "all" 
    ? videos 
    : videos.filter(v => v.category === activeCategory);

  const featuredVideos = videos.filter(v => v.is_featured).slice(0, 6);

  // Video Analysis Modal
  if (selectedVideo) {
    return (
      <VideoAnalysisModal
        video={selectedVideo}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        user={user}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24 overflow-x-hidden">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1a1a1a] px-4 py-4 pt-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">{t('videos.title')}</h1>
            <p className="text-[#666] text-xs mt-1">{videos.length} {t('videos.available')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#00E5FF]/20 text-[#00E5FF] border-0 font-black px-3 py-1">
              <Zap className="w-3 h-3 mr-1" />
              {videos.length}
            </Badge>
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {categories.map((cat, index) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeCategory === cat.id
                  ? "bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/30"
                  : "bg-[#111111] text-[#B3B3B3] border border-[#222]"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </motion.button>
          ))}
        </div>
      </motion.header>

      {/* Featured Section */}
      {activeCategory === "all" && featuredVideos.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-4 py-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-black text-white tracking-tight">{t('videos.featured')}</h2>
            <Badge className="bg-gradient-to-r from-[#00E5FF] to-[#0066FF] text-black text-[10px] font-black px-2 py-0.5">
              RT
            </Badge>
          </div>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
            {featuredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedVideo(video)}
                className="relative flex-shrink-0 w-40 aspect-[3/4] rounded-[20px] overflow-hidden cursor-pointer bg-[#111111] border border-[#222]"
              >
                <img
                  src={video.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <div className={`px-2.5 py-1 rounded-xl text-[10px] font-black ${
                    video.is_featured 
                      ? "bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/30" 
                      : "bg-[#111111]/90 text-white border border-[#333]"
                  }`}>
                    {video.is_featured ? "NOVIDADE" : "ATLETA"}
                  </div>
                  {video.ai_analysis && (
                    <div className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-purple-500/90 text-white border border-purple-400/50 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      IA
                    </div>
                  )}
                </div>

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-14 bg-[#00E5FF]/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#00E5FF]/30"
                  >
                    <Play className="w-6 h-6 text-[#00E5FF] ml-1" fill="#00E5FF" />
                  </motion.div>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-sm font-bold truncate">{video.athlete_name}</p>
                  <p className="text-[#666] text-[11px] truncate mt-0.5">{video.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Videos Grid */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-4 py-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-white uppercase tracking-widest">
            {activeCategory === "all" ? t('videos.allVideos') : categories.find(c => c.id === activeCategory)?.label}
          </h2>
          <span className="text-[#666] text-xs">{filteredVideos.length} {t('videos.count')}</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-2 border-[#00E5FF] border-t-transparent rounded-full"
            />
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="bg-[#111111] rounded-[20px] p-10 text-center border border-[#222]">
            <Star className="w-12 h-12 text-[#333] mx-auto mb-4" />
            <p className="text-[#666]">{t('videos.noVideos')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedVideo(video)}
                className="relative aspect-[3/4] rounded-[18px] overflow-hidden cursor-pointer bg-[#111111] border border-[#222] group"
              >
                <img
                  src={video.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300"}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
                
                {/* AI Analysis Badge */}
                {video.ai_analysis && (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-lg text-[9px] font-black bg-purple-500/90 text-white border border-purple-400/50 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    IA
                  </div>
                )}

                {/* Play Icon - Appears on hover/active */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 bg-[#00E5FF] rounded-full flex items-center justify-center shadow-lg shadow-[#00E5FF]/40">
                    <Play className="w-6 h-6 text-black ml-1" fill="black" />
                  </div>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-bold text-sm line-clamp-1 mb-1">{video.title}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[#999] text-xs truncate flex-1">{video.athlete_name}</p>
                    {video.position && (
                      <span className="px-2 py-0.5 bg-[#00E5FF]/20 text-[#00E5FF] text-[9px] font-bold rounded-lg">
                        {video.position?.substring(0, 3).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-[#666] text-[11px]">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {video.views_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {video.likes_count || 0}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      <MobileBottomNav onUploadClick={() => setShowUploadModal(true)} />

      <VideoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        user={user}
      />
    </div>
  );
}
