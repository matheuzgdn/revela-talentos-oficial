import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, User, MapPin, Calendar, Video, Filter, X, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    { value: "all", label: "Todas Posições" },
    { value: "goleiro", label: "Goleiro" },
    { value: "zagueiro", label: "Zagueiro" },
    { value: "lateral", label: "Lateral" },
    { value: "volante", label: "Volante" },
    { value: "meia", label: "Meia" },
    { value: "atacante", label: "Atacante" },
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

  // Filter athletes
  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = !searchQuery || 
      athlete.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = selectedPosition === "all" || 
      athlete.position === selectedPosition;
    return matchesSearch && matchesPosition;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white pb-24">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-gray-800/50 px-4 py-4 pt-20 md:pt-4">
        <h1 className="text-2xl font-bold text-white mb-4">Buscar Atletas</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full pl-12 pr-12 py-6 bg-gray-900/50 border-gray-800 text-white placeholder:text-gray-500 rounded-xl"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
              showFilters ? "bg-cyan-500 text-black" : "bg-gray-800 text-gray-400"
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pb-4"
          >
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger className="bg-gray-900/50 border-gray-800 text-white">
                <SelectValue placeholder="Posição" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((pos) => (
                  <SelectItem key={pos.value} value={pos.value}>
                    {pos.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        )}

        {/* Position Quick Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          {positions.map((pos) => (
            <button
              key={pos.value}
              onClick={() => setSelectedPosition(pos.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedPosition === pos.value
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black"
                  : "bg-gray-800/50 text-gray-400 hover:text-white"
              }`}
            >
              {pos.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <section className="px-4 py-6">
        <p className="text-gray-400 text-sm mb-4">
          {filteredAthletes.length} atleta{filteredAthletes.length !== 1 ? 's' : ''} encontrado{filteredAthletes.length !== 1 ? 's' : ''}
        </p>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500" />
          </div>
        ) : filteredAthletes.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Nenhum atleta encontrado</p>
            <p className="text-gray-600 text-sm">Tente ajustar os filtros</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAthletes.map((athlete, index) => (
              <motion.div
                key={athlete.id || athlete.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-8 h-8 text-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-lg truncate">{athlete.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {athlete.position && (
                          <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs">
                            {positions.find(p => p.value === athlete.position)?.label || athlete.position}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
                        <span className="flex items-center gap-1">
                          <Video className="w-4 h-4" /> {athlete.videos.length} vídeo{athlete.videos.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-600" />
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
                          className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden"
                        >
                          <img
                            src={video.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100"}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <Video className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        </Link>
                      ))}
                      {athlete.videos.length > 4 && (
                        <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-gray-800 flex items-center justify-center">
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