import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, User, Video, Filter, ChevronRight, Star, Eye, Trophy, Zap, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileBottomNav from "../components/mobile/MobileBottomNav";
import VideoUploadModal from "../components/mobile/VideoUploadModal";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function SearchAthletes() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['searchAthleteVideos'],
    queryFn: () => base44.entities.AthleteVideo.filter({ status: "approved" }, "-created_date", 100),
  });

  const positions = [
    { value: "all", label: "Todas", icon: "⚽" },
    { value: "goleiro", label: "Goleiro", icon: "🧤" },
    { value: "zagueiro", label: "Zagueiro", icon: "🛡️" },
    { value: "lateral", label: "Lateral", icon: "🏃" },
    { value: "volante", label: "Volante", icon: "⚙️" },
    { value: "meia", label: "Meia", icon: "🎯" },
    { value: "atacante", label: "Atacante", icon: "⚡" },
  ];

  // Group videos by athlete
  const athleteMap = videos.reduce((acc, video) => {
    const key = video.athlete_id || video.athlete_name;
    if (!acc[key]) {
      acc[key] = {
        id: video.athlete_id,
        name: video.athlete_name,
        position: video.position,
        videos: [],
        totalViews: 0,
      };
    }
    acc[key].videos.push(video);
    acc[key].totalViews += video.views_count || 0;
    return acc;
  }, {});

  const athletes = Object.values(athleteMap);

  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = !searchQuery || 
      athlete.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = selectedPosition === "all" || 
      athlete.position === selectedPosition;
    return matchesSearch && matchesPosition;
  });

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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔥</span>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">TOP TEAMS</h1>
              <p className="text-[#666] text-xs">{filteredAthletes.length} atletas encontrados</p>
            </div>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 bg-[#111111] rounded-2xl flex items-center justify-center border border-[#222]"
          >
            <Share2 className="w-5 h-5 text-white" />
          </motion.button>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar atleta..."
            className="w-full pl-12 pr-14 py-6 bg-[#111111] border-[#222] text-white placeholder:text-[#666] rounded-2xl focus:border-[#00E5FF]/50 focus:ring-[#00E5FF]/20"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all ${
              showFilters 
                ? "bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/30" 
                : "bg-[#1a1a1a] text-[#666]"
            }`}
          >
            <Filter className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Position Quick Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          {positions.map((pos, index) => (
            <motion.button
              key={pos.value}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedPosition(pos.value)}
              className={`px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedPosition === pos.value
                  ? "bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/30"
                  : "bg-[#111111] text-[#B3B3B3] border border-[#222]"
              }`}
            >
              <span>{pos.icon}</span>
              {pos.label}
            </motion.button>
          ))}
        </div>
      </motion.header>

      {/* Results */}
      <section className="px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-2 border-[#00E5FF] border-t-transparent rounded-full"
            />
          </div>
        ) : filteredAthletes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111111] rounded-[20px] p-10 text-center border border-[#222]"
          >
            <User className="w-16 h-16 text-[#333] mx-auto mb-4" />
            <p className="text-[#666] mb-2">Nenhum atleta encontrado</p>
            <p className="text-[#444] text-sm">Tente ajustar os filtros</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredAthletes.map((athlete, index) => (
              <motion.div
                key={athlete.id || athlete.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#111111] rounded-[20px] border border-[#222] overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar with rank */}
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#00E5FF] to-[#0066FF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00E5FF]/20">
                        <span className="text-2xl font-black text-white">{athlete.name?.charAt(0)}</span>
                      </div>
                      {index < 3 && (
                        <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center border-2 border-[#111111] shadow-lg">
                          <span className="text-[10px] font-black text-black">{index + 1}</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-base truncate uppercase tracking-tight">{athlete.name}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        {athlete.position && (
                          <span className="px-2.5 py-1 bg-[#00E5FF]/15 text-[#00E5FF] text-[10px] font-bold rounded-lg border border-[#00E5FF]/30">
                            {positions.find(p => p.value === athlete.position)?.label || athlete.position}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-[#666] text-xs">
                        <span className="flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-[#00E5FF]" /> {athlete.videos.length}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-[#00E5FF]" /> {athlete.totalViews}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-[#444]" />
                  </div>
                </div>

                {/* Video Thumbnails */}
                {athlete.videos.length > 0 && (
                  <div className="px-4 pb-4">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                      {athlete.videos.slice(0, 4).map((video) => (
                        <Link
                          key={video.id}
                          to={createPageUrl("AthleteVideos")}
                          className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#222]"
                        >
                          <img
                            src={video.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100"}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-7 h-7 bg-[#00E5FF]/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <Video className="w-3 h-3 text-[#00E5FF]" />
                            </div>
                          </div>
                        </Link>
                      ))}
                      {athlete.videos.length > 4 && (
                        <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-[#222]">
                          <span className="text-white text-sm font-bold">+{athlete.videos.length - 4}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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