import React from "react";
import { motion } from "framer-motion";
import { Trophy, Target, Activity, Clock, Star, TrendingUp } from "lucide-react";

export default function PerformanceStatsCard({ performanceData }) {
  const totalGames = performanceData.length;
  const totalGoals = performanceData.reduce((sum, p) => sum + (p.goals || 0), 0);
  const totalAssists = performanceData.reduce((sum, p) => sum + (p.assists || 0), 0);
  const totalMinutes = performanceData.reduce((sum, p) => sum + (p.minutes_played || 0), 0);
  const avgRating = performanceData.length > 0 
    ? (performanceData.reduce((sum, p) => sum + (p.rating || 0), 0) / performanceData.length).toFixed(1)
    : 0;
  
  const consistency = performanceData.length > 3 ? 85 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      whileHover={{ scale: 0.98 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-[24px] p-5 shadow-2xl border border-white/10"
      style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
    >
      <h2 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-5">
        Estatísticas de Desempenho
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <StatItem icon={Trophy} label="Jogos" value={totalGames} delay={0.2} />
        <StatItem icon={Target} label="Gols" value={totalGoals} delay={0.25} />
        <StatItem icon={Activity} label="Assistências" value={totalAssists} delay={0.3} />
        <StatItem icon={Clock} label="Minutos" value={totalMinutes} delay={0.35} />
        <StatItem icon={Star} label="Nota Média" value={avgRating} delay={0.4} />
        <StatItem icon={TrendingUp} label="Consistência" value={`${consistency}%`} delay={0.45} />
      </div>
    </motion.div>
  );
}

function StatItem({ icon: Icon, label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gray-800/50 rounded-2xl p-4 text-center border border-gray-700/50 hover:border-cyan-400/50 transition-all"
    >
      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
        className="text-[28px] font-semibold text-white mb-1"
      >
        {value}
      </motion.p>
      <p className="text-[13px] font-medium text-gray-400 uppercase tracking-wide">{label}</p>
    </motion.div>
  );
}