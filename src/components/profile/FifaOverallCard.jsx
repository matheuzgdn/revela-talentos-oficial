import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function FifaOverallCard({ stats }) {
  if (!stats) return null;

  const attributes = [
    { key: "pace", label: "PAC", max: 100 },
    { key: "shooting", label: "SHO", max: 100 },
    { key: "passing", label: "PAS", max: 100 },
    { key: "dribbling", label: "DRI", max: 100 },
    { key: "defending", label: "DEF", max: 100 },
    { key: "physicality", label: "PHY", max: 100 }
  ];

  const getOverallRating = () => {
    const values = Object.values(stats);
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + (val || 0), 0);
    return Math.round(sum / values.length);
  };

  const overall = getOverallRating();
  const evolution = 3; // Simulated evolution

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      whileHover={{ scale: 0.98 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-[24px] p-5 shadow-2xl border border-white/10"
      style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
          FIFA Overall
        </h2>
        
        {/* EvolutionIndicator */}
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-bold text-sm">+{evolution}</span>
        </div>
      </div>

      <div className="flex items-center gap-5 mb-6">
        {/* OverallBadgeLarge */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg">
            <span className="text-white text-4xl font-black">{overall}</span>
          </div>
          <div className="absolute inset-0 bg-cyan-400/30 rounded-3xl blur-xl -z-10" />
        </div>

        {/* RadarChartComponent */}
        <div className="flex-1 relative h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            
            {/* Background hexagon */}
            <polygon
              points="50,10 85,30 85,70 50,90 15,70 15,30"
              fill="none"
              stroke="#374151"
              strokeWidth="1"
            />
            
            {/* Data polygon */}
            <motion.polygon
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              points={`
                ${50 + (stats.pace || 0) * 0.35},${10 + (100 - (stats.pace || 0)) * 0.2}
                ${85 - (100 - (stats.shooting || 0)) * 0.35},${30 + (100 - (stats.shooting || 0)) * 0.4}
                ${85 - (100 - (stats.passing || 0)) * 0.35},${70 - (100 - (stats.passing || 0)) * 0.4}
                ${50 - (stats.dribbling || 0) * 0.35},${90 - (100 - (stats.dribbling || 0)) * 0.2}
                ${15 + (100 - (stats.defending || 0)) * 0.35},${70 - (100 - (stats.defending || 0)) * 0.4}
                ${15 + (100 - (stats.physicality || 0)) * 0.35},${30 + (100 - (stats.physicality || 0)) * 0.4}
              `}
              fill="url(#radarGradient)"
              stroke="#06b6d4"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* AttributeGrid */}
      <div className="grid grid-cols-3 gap-3">
        {attributes.map((attr, index) => (
          <motion.div
            key={attr.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.05 }}
            className="bg-gray-800/50 rounded-xl p-3 text-center border border-gray-700/50"
          >
            <p className="text-[13px] font-medium text-gray-400 mb-1 uppercase">{attr.label}</p>
            <p className="text-2xl font-semibold text-cyan-400">{stats[attr.key] || 0}</p>
          </motion.div>
        ))}
      </div>

      {/* LastUpdatedByAdmin */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        Last updated by admin • 2 days ago
      </p>
    </motion.div>
  );
}