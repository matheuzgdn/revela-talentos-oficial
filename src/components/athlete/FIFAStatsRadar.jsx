import React from "react";
import { motion } from "framer-motion";

export default function FIFAStatsRadar({ stats }) {
  if (!stats) return null;

  const attributes = [
    { key: "pace", label: "PAC", color: "#00FF00" },
    { key: "shooting", label: "SHO", color: "#FFD700" },
    { key: "passing", label: "PAS", color: "#00E5FF" },
    { key: "dribbling", label: "DRI", color: "#FF00FF" },
    { key: "defending", label: "DEF", color: "#FF0000" },
    { key: "physicality", label: "PHY", color: "#FFA500" }
  ];

  const getOverallRating = () => {
    const values = Object.values(stats);
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + (val || 0), 0);
    return Math.round(sum / values.length);
  };

  const overall = getOverallRating();

  return (
    <div className="bg-[#111111] border border-[#222] rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-black uppercase tracking-tight">FIFA Stats</h3>
        <div className="w-16 h-16 bg-gradient-to-br from-[#00E5FF] to-[#0066FF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00E5FF]/30">
          <span className="text-black text-2xl font-black">{overall}</span>
        </div>
      </div>

      {/* Radar chart simulation */}
      <div className="relative w-full aspect-square mb-6">
        {/* Background hexagon */}
        <svg viewBox="0 0 200 200" className="absolute inset-0">
          <defs>
            <linearGradient id="statGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#00E5FF", stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: "#0066FF", stopOpacity: 0.3 }} />
            </linearGradient>
          </defs>
          
          {/* Grid */}
          {[1, 2, 3, 4, 5].map((level) => (
            <polygon
              key={level}
              points="100,20 173,50 173,150 100,180 27,150 27,50"
              fill="none"
              stroke="#333"
              strokeWidth="1"
              style={{
                transform: `scale(${level * 0.2})`,
                transformOrigin: "100px 100px"
              }}
            />
          ))}

          {/* Data polygon */}
          <motion.polygon
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            points={`
              ${100 + (stats.pace || 0) * 0.73},${20 + (stats.pace || 0) * 0.3}
              ${173 - (stats.shooting || 0) * 0.73},${50 + (stats.shooting || 0) * 1}
              ${173 - (stats.passing || 0) * 0.73},${150 - (stats.passing || 0) * 1}
              ${100 - (stats.dribbling || 0) * 0.73},${180 - (stats.dribbling || 0) * 0.3}
              ${27 + (stats.defending || 0) * 0.73},${150 - (stats.defending || 0) * 1}
              ${27 + (stats.physicality || 0) * 0.73},${50 + (stats.physicality || 0) * 1}
            `}
            fill="url(#statGradient)"
            stroke="#00E5FF"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Stats bars */}
      <div className="space-y-3">
        {attributes.map((attr, index) => (
          <motion.div
            key={attr.key}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="text-[#666] text-xs font-bold w-10 uppercase">{attr.label}</span>
            <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats[attr.key] || 0}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="h-full rounded-full shadow-lg"
                style={{ 
                  backgroundColor: attr.color,
                  boxShadow: `0 0 10px ${attr.color}50`
                }}
              />
            </div>
            <span className="text-white text-sm font-black w-8 text-right">
              {stats[attr.key] || 0}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}