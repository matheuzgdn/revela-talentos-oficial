import React from "react";
import { motion } from "framer-motion";
import { Share2, Bookmark, Edit2, Trophy, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AthleteProfileHero({ user, onEdit }) {
  const positionColors = {
    goleiro: "bg-yellow-500",
    zagueiro: "bg-blue-600",
    lateral: "bg-green-500",
    volante: "bg-purple-600",
    meia: "bg-cyan-500",
    atacante: "bg-red-600"
  };

  const positionLabels = {
    goleiro: "GOLEIRO",
    zagueiro: "ZAGUEIRO",
    lateral: "LATERAL",
    volante: "VOLANTE",
    meia: "MEIA",
    atacante: "ATACANTE"
  };

  return (
    <div className="relative">
      {/* Background with club crest - grayscale and opacity */}
      {user?.current_club_crest_url && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 grayscale"
          style={{ backgroundImage: `url(${user.current_club_crest_url})` }}
        />
      )}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-[#0A0A0A]/90 to-[#0A0A0A]" />

      {/* Content */}
      <div className="relative px-4 pt-6 pb-8">
        {/* Action buttons */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10"
          >
            <Share2 className="w-4 h-4 text-white" />
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10"
            >
              <Edit2 className="w-4 h-4 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10"
            >
              <Bookmark className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>

        {/* Player section */}
        <div className="flex items-start gap-4 mb-6">
          {/* Club badge small */}
          {user?.current_club_crest_url && (
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-2 flex items-center justify-center">
              <img 
                src={user.current_club_crest_url} 
                alt="Club" 
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Player info */}
          <div className="flex-1">
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
              {user?.full_name || "Atleta"}
            </h1>
            
            {user?.athlete_position && (
              <Badge 
                className={`${positionColors[user.athlete_position]} text-white font-black text-xs px-3 py-1 uppercase tracking-wider`}
              >
                {positionLabels[user.athlete_position]}
              </Badge>
            )}
          </div>

          {/* Player image */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-32 h-32 -mt-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/20 to-[#0066FF]/20 rounded-full blur-xl" />
            <img 
              src={user?.profile_picture_url || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400"}
              alt={user?.full_name}
              className="relative w-full h-full object-cover rounded-full border-4 border-[#00E5FF]/30 shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Age" value={user?.age || "-"} />
          <StatCard label="Games" value={user?.total_games || 0} />
          <StatCard label="Goals" value={user?.total_goals || 0} />
        </div>

        {/* Level and points */}
        {user?.level && (
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-4 flex items-center justify-between bg-gradient-to-r from-[#00E5FF]/10 to-[#0066FF]/10 border border-[#00E5FF]/20 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#00E5FF] rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-[#666] text-xs font-bold uppercase tracking-wider">Level</p>
                <p className="text-white text-2xl font-black">{user.level}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#666] text-xs font-bold uppercase tracking-wider">Pontos</p>
              <p className="text-[#00E5FF] text-2xl font-black">{user.total_points || 0}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-[#333] rounded-2xl p-4 text-center"
    >
      <p className="text-[#666] text-xs font-medium mb-1 uppercase tracking-wider">{label}</p>
      <p className="text-white text-3xl font-black">{value}</p>
    </motion.div>
  );
}