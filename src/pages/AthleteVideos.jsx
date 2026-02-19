import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Heart, Eye, Clock, User, Filter, X, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MobileBottomNav from "../components/mobile/MobileBottomNav";
import VideoUploadModal from "../components/mobile/VideoUploadModal";

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
    { id: "destaque", label: "Destaques" },
    { id: "treino", label: "Treino" },
    { id: "jogo", label: "Jogos" },
    { id: "habilidade", label: "Habilidades" },
  ];

  const filteredVideos = activeCategory === "all" 
    ? videos 
    : videos.filter(v => v.category === activeCategory);

  const featuredVideos = videos.filter(v => v.is_featured).slice(0, 5);

  if (selectedVideo) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        {/* Video Player */}
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

          {/* Video Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent pb-24">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">{selectedVideo.title}</h3>
                <p className="text-gray-400 text-sm">{selectedVideo.athlete_name}</p>
              </div>
            </div>

            {selectedVideo.description && (
              <p className="text-gray-300 text-sm mb-4">{selectedVideo.description}</p>
            )}

            <div className="flex items-center gap-4">
              {selectedVideo.position && (
                <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {selectedVideo.position}
                </Badge>
              )}
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Eye className="w-4 h-4" />
                <span>{selectedVideo.views_count || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Heart className="w-4 h-4" />
                <span>{selectedVideo.likes_count || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white pb-24">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-gray-800/50 px-4 py-4 pt-20 md:pt-4">
        <h1 className="text-2xl font-bold text-white mb-4">Vídeos</h1>
        
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black"
                  : "bg-gray-800/50 text-gray-400 hover:text-white"
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
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-cyan-400">Destaques</span>
            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs">
              RT
            </Badge>
          </h2>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
            {featuredVideos.map((video) => (
              <motion.div
                key={video.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedVideo(video)}
                className="relative flex-shrink-0 w-32 aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
              >
                <img
                  src={video.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className={`text-[10px] px-2 py-0.5 ${
                    video.is_featured 
                      ? "bg-yellow-500 text-black" 
                      : "bg-cyan-500/80 text-white"
                  }`}>
                    {video.is_featured ? "NOVIDADE" : "ATLETA"}
                  </Badge>
                </div>

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-medium truncate">{video.athlete_name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Videos Grid */}
      <section className="px-4 py-4">
        <h2 className="text-lg font-bold text-white mb-4">
          {activeCategory === "all" ? "Todos os Vídeos" : categories.find(c => c.id === activeCategory)?.label}
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500" />
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum vídeo encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedVideo(video)}
                className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={video.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300"}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                  </div>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-semibold text-sm line-clamp-1 mb-1">{video.title}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400 text-xs truncate">{video.athlete_name}</p>
                    {video.position && (
                      <Badge className="bg-gray-800/80 text-gray-300 text-[10px] px-1.5">
                        {video.position}
                      </Badge>
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