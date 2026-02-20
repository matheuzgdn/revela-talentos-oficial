import React from "react";
import { motion } from "framer-motion";

export default function CareerTimelineCard({ clubHistory }) {
  if (!clubHistory || clubHistory.length === 0) return null;

  const sortedHistory = [...clubHistory].sort((a, b) => a.year_start - b.year_start);
  const years = sortedHistory.map(club => club.year_start);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      whileHover={{ scale: 0.98 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-[24px] p-5 shadow-2xl border border-white/10 mb-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
    >
      <h2 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-5">
        Histórico de Carreira
      </h2>

      {/* YearChipsHorizontalScroll */}
      <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
        {years.map((year, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + index * 0.05 }}
            className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm text-gray-300 font-bold whitespace-nowrap"
          >
            {year}
          </motion.div>
        ))}
      </div>

      {/* TimelineBarWithClubs */}
      <div className="relative h-24 mb-6">
        {/* Timeline line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -translate-y-1/2 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 1 }}
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
          />
        </div>

        {/* ClubLogoNodes */}
        {sortedHistory.map((club, index) => {
          const position = (index / (sortedHistory.length - 1)) * 100;
          
          return (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2 + index * 0.15, type: "spring" }}
              className="absolute top-1/2 -translate-y-1/2 w-16 h-16"
              style={{ left: `${position}%`, transform: `translate(-50%, -50%)` }}
            >
              <div className="w-full h-full bg-gray-800 border-4 border-cyan-500 rounded-full p-2 shadow-lg">
                {club.crest_url ? (
                  <img 
                    src={club.crest_url} 
                    alt={club.club_name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                    {club.club_name.substring(0, 2)}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Club details */}
      <div className="space-y-3">
        {sortedHistory.map((club, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.5 + index * 0.1 }}
            className="flex items-center justify-between bg-gray-800/50 border border-gray-700/50 rounded-xl p-3 hover:border-cyan-400/50 transition-all"
          >
            <div className="flex items-center gap-3">
              {club.crest_url && (
                <div className="w-10 h-10 bg-gray-700/50 rounded-lg p-1">
                  <img src={club.crest_url} alt={club.club_name} className="w-full h-full object-contain" />
                </div>
              )}
              <div>
                <p className="text-white text-sm font-bold">{club.club_name}</p>
                <p className="text-gray-400 text-xs">
                  {club.year_start} - {club.year_end || "Present"}
                </p>
              </div>
            </div>
            {club.goals !== undefined && (
              <div className="text-right">
                <p className="text-cyan-400 text-xl font-bold">{club.goals}</p>
                <p className="text-gray-500 text-[10px] uppercase">Gols</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}