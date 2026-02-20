import React from "react";
import { motion } from "framer-motion";

export default function CareerTimeline({ clubHistory }) {
  if (!clubHistory || clubHistory.length === 0) {
    return (
      <div className="bg-[#111111] border border-[#222] rounded-3xl p-6">
        <h3 className="text-white text-lg font-black uppercase tracking-tight mb-4">História</h3>
        <p className="text-[#666] text-sm">Nenhum clube cadastrado ainda</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111111] border border-[#222] rounded-3xl p-6">
      <h3 className="text-white text-lg font-black uppercase tracking-tight mb-6">História</h3>
      
      {/* Timeline years */}
      <div className="flex items-center justify-between mb-4 text-[#666] text-xs font-bold">
        {clubHistory.map((club, index) => (
          <span key={index}>{club.year_start}</span>
        ))}
      </div>

      {/* Timeline line with clubs */}
      <div className="relative h-20 mb-6">
        {/* Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#333] -translate-y-1/2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#00E5FF] to-[#0066FF] shadow-lg shadow-[#00E5FF]/30"
          />
        </div>

        {/* Club crests */}
        {clubHistory.map((club, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.2 }}
            className="absolute top-1/2 -translate-y-1/2 w-14 h-14 bg-[#1a1a1a] border-2 border-[#00E5FF] rounded-full p-2 flex items-center justify-center"
            style={{ left: `${(index / (clubHistory.length - 1)) * 100}%`, transform: "translate(-50%, -50%)" }}
          >
            {club.crest_url ? (
              <img 
                src={club.crest_url} 
                alt={club.club_name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-white text-xs font-bold">{club.club_name.substring(0, 2)}</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Club details */}
      <div className="space-y-3">
        {clubHistory.map((club, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center justify-between bg-[#1a1a1a]/50 border border-[#333] rounded-xl p-3"
          >
            <div className="flex items-center gap-3">
              {club.crest_url && (
                <div className="w-8 h-8 bg-white/10 rounded-lg p-1">
                  <img src={club.crest_url} alt={club.club_name} className="w-full h-full object-contain" />
                </div>
              )}
              <div>
                <p className="text-white text-sm font-bold">{club.club_name}</p>
                <p className="text-[#666] text-xs">
                  {club.year_start} - {club.year_end || "Atual"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#00E5FF] text-lg font-black">{club.goals || 0}</p>
              <p className="text-[#666] text-xs">gols</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}