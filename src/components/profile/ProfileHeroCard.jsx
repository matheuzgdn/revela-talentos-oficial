import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProfileHeroCard({ user, onEdit, onBack }) {
  const positionColors = {
    goleiro: "bg-yellow-500",
    zagueiro: "bg-blue-600",
    lateral: "bg-green-500",
    volante: "bg-purple-600",
    meia: "bg-cyan-500",
    atacante: "bg-red-600"
  };

  const positionLabels = {
    goleiro: "GOALKEEPER",
    zagueiro: "DEFENDER",
    lateral: "FULLBACK",
    volante: "MIDFIELDER",
    meia: "MIDFIELDER",
    atacante: "FORWARD"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-[24px] p-5 shadow-2xl border border-white/10"
      style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
    >
      {/* ProfileTopBar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="w-11 h-11 bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-gray-700/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="flex gap-2">
          <button className="w-11 h-11 bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-gray-700/80 transition-colors">
            <Share2 className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={onEdit}
            className="w-11 h-11 bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-gray-700/80 transition-colors"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* ProfileIdentityBlock */}
      <div className="flex items-start gap-5 mb-6">
        {/* ClubBadge + CountryFlag */}
        <div className="relative flex-shrink-0">
          {/* Club badge overlay */}
          {user?.current_club_crest_url && (
            <div className="absolute -top-3 -left-3 w-12 h-12 bg-white rounded-full p-2 shadow-lg z-20 border-2 border-gray-900">
              <img src={user.current_club_crest_url} alt="Club" className="w-full h-full object-contain" />
            </div>
          )}
          
          {/* Country flag overlay */}
          {user?.country_flag_url && (
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full p-1 shadow-lg z-20 border-2 border-gray-900">
              <img src={user.country_flag_url} alt="Country" className="w-full h-full object-cover rounded-full" />
            </div>
          )}

          {/* AthleteAvatar */}
          <div className="relative w-32 h-40 rounded-3xl overflow-hidden bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-white/20">
            <img 
              src={user?.profile_picture_url || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400"}
              alt={user?.full_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
          </div>
        </div>

        {/* AthleteName + PositionTag */}
        <div className="flex-1 pt-2">
          <h1 className="text-[34px] font-bold text-white leading-none mb-3 tracking-tight">
            {user?.full_name || "Athlete"}
          </h1>
          
          {user?.athlete_position && (
            <Badge className={`${positionColors[user.athlete_position]} text-white font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider mb-2`}>
              {positionLabels[user.athlete_position]}
            </Badge>
          )}

          {/* ShirtNumberBadge */}
          {user?.shirt_number && (
            <div className="inline-flex items-center gap-2 mt-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">{user.shirt_number}</span>
              </div>
              <span className="text-gray-400 text-sm font-medium">JERSEY</span>
            </div>
          )}
        </div>
      </div>

      {/* QuickInfoRow */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <InfoCard label="Age" value={user?.age || "-"} />
        <InfoCard label="Height" value={user?.height ? `${user.height}cm` : "-"} />
        <InfoCard label="Weight" value={user?.weight ? `${user.weight}kg` : "-"} />
      </div>

      {/* EditProfileButton */}
      <button
        onClick={onEdit}
        className="w-full py-3 border-2 border-gray-600 hover:border-cyan-400 rounded-xl font-bold text-white text-sm uppercase tracking-wider transition-all hover:bg-cyan-400/10"
      >
        Edit Profile
      </button>
    </motion.div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-gray-800/50 rounded-2xl p-3 text-center border border-gray-700/50">
      <p className="text-[13px] font-medium text-gray-400 mb-1 uppercase tracking-wide">{label}</p>
      <p className="text-[28px] font-semibold text-white">{value}</p>
    </div>
  );
}