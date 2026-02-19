import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Play, Heart, Eye, ChevronLeft, X, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MobileBottomNav from "../components/mobile/MobileBottomNav";
import VideoUploadModal from "../components/mobile/VideoUploadModal";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function AthleteVideos() {
  const [user, setUser] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['athleteVideos'],
    queryFn: () => base44.entities.AthleteVideo.filter({ status: "approved" }, "-created_date", 50),
  });

  const categories = [
    { id: "all", label: "Todos" },
    { id: "destaque", label: "🔥 Destaques" },
    { id: "treino", label: "Treino" },
    { id: "jogo", label: "Jogos" },
    { id: "habilidade", label: "Skills" },
  ];

  const filteredVideos = activeCategory === "all" 
    ? videos 
    : videos.filter(v => v.category === activeCategory);

  const featuredVideos = videos.filter(v => v.is_featured).slice(0, 5);

  if (selectedVideo) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="relative h-full flex flex-col">
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 left-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <div className="flex-1 flex items-center justify-center bg-black">
            <video
              src={selectedVideo.video_url}
              className="w-full h-full object-contain"
              controls
              autoPlay
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent pb-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <span className="text-black font-bold text-lg">{selectedVideo.athlete_name?.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">{selectedVideo.title}</h3>
                <p className="text-gray-400 text-sm">{selectedVideo.athlete_name}</p>
              </div>
            </div>

            {selectedVideo.position && (
              <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 mb-4">
                {selectedVideo.position}
              </Badge>
            )}

            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {selectedVideo.views_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> {selectedVideo.likes_count || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-gray-800/50 px-4 py-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">Vídeos</h1>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-0 font-bold">
            {videos.length}
          </Badge>
        </div>
        
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-cyan-500 to-cyan-400 text-black"
                  : "bg-[#1a1a1a] text-gray-400 border border-gray-800/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      {activeCategory === "all" && featuredVideos.length > 0 && (
        <section className="px-4 py-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🔥</span>
            <h2 className="text-lg font-black text-white uppercase tracking-wider">Destaques</h2>
            <Badge className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-black text-[10px] font-black px-2">
              RT
            </Badge>
          </div>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
            {featuredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedVideo(video)}
                className="relative flex-shrink-0 w-36 aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer bg-[#1a1a1a] border border-gray-800/50"
              >
                <img
                  src={video.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-2 left-2">
                  <div className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                    video.is_featured 
                      ? "bg-gradient-to-r from-cyan-500 to-cyan-400 text-black" 
                      : "bg-[#1a1a1a]/80 text-white border border-gray-700"
                  }`}>
                    {video.is_featured ? "NOVO" : "ATLETA"}
                  </div>
                </div>

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                    <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-bold truncate">{video.athlete_name}</p>
                  <p className="text-gray-400 text-[10px] truncate">{video.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Videos Grid */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-white uppercase tracking-wider">
            {activeCategory === "all" ? "Todos" : categories.find(c => c.id === activeCategory)?.label}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500" />
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-2xl p-8 text-center border border-gray-800/50">
            <p className="text-gray-500">Nenhum vídeo encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => setSelectedVideo(video)}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group bg-[#1a1a1a] border border-gray-800/50"
              >
                <img
                  src={video.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300"}
                  alt={video.title}
                  className="w-full h-full object-cover group-active:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 bg-cyan-500/90 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Play className="w-6 h-6 text-black ml-0.5" fill="black" />
                  </div>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-bold text-sm line-clamp-1 mb-1">{video.title}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400 text-xs truncate flex-1">{video.athlete_name}</p>
                    {video.position && (
                      <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 text-[10px] font-bold rounded">
                        {video.position?.substring(0, 3).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-gray-500 text-xs">
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