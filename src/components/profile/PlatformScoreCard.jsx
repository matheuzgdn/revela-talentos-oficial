import React from "react";
import { motion } from "framer-motion";
import { Award, TrendingUp } from "lucide-react";

export default function PlatformScoreCard({ user }) {
  const points = user?.total_points || 0;
  const level = user?.level || 1;
  
  const levels = [
    { name: "Rookie", min: 0, max: 100 },
    { name: "Starter", min: 100, max: 500 },
    { name: "Professional", min: 500, max: 1500 },
    { name: "Elite", min: 1500, max: 3000 },
    { name: "Legend", min: 3000, max: 999999 }
  ];

  const currentLevel = levels.find(l => points >= l.min && points < l.max) || levels[0];
  const nextLevel = levels[levels.indexOf(currentLevel) + 1];
  const progressToNext = nextLevel 
    ? ((points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      whileHover={{ scale: 0.98 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-[24px] p-5 shadow-2xl border border-white/10 relative overflow-hidden"
      style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 blur-3xl" />

      <div className="relative z-10">
        <h2 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-5">
          Pontuação da Plataforma
        </h2>

        <div className="flex items-center gap-4 mb-6">
          {/* LevelBadge */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg">
              <span className="text-gray-900 text-2xl font-black">{level}</span>
            </div>
            <div className="absolute inset-0 bg-yellow-400/30 rounded-3xl blur-xl -z-10" />
          </div>

          {/* Points and level name */}
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-1 font-medium uppercase">{currentLevel.name}</p>
            <p className="text-[28px] font-semibold text-white">{points.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Points</p>
          </div>

          <TrendingUp className="w-8 h-8 text-green-400" />
        </div>

        {/* ProgressToNextLevelBar */}
        {nextLevel && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>{currentLevel.name}</span>
              <span>{nextLevel.name}</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1.5, delay: 0.8 }}
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              {nextLevel.min - points} pontos para o próximo nível
            </p>
          </div>
        )}

        {/* RankingPosition */}
        <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/50">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="text-2xl font-bold text-yellow-500">#12</span>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Ranking Global</p>
        </div>
      </div>
    </motion.div>
  );
}