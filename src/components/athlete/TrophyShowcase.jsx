import React from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Star, Crown, Shield } from "lucide-react";

export default function TrophyShowcase({ trophies }) {
  const iconMap = {
    trophy: Trophy,
    medal: Medal,
    star: Star,
    crown: Crown,
    shield: Shield
  };

  if (!trophies || trophies.length === 0) {
    return (
      <div className="bg-[#111111] border border-[#222] rounded-3xl p-6">
        <h3 className="text-white text-lg font-black uppercase tracking-tight mb-4">Troféus</h3>
        <p className="text-[#666] text-sm">Nenhum troféu cadastrado ainda</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111111] border border-[#222] rounded-3xl p-6">
      <h3 className="text-white text-lg font-black uppercase tracking-tight mb-6">Troféus</h3>
      
      <div className="grid grid-cols-3 gap-4">
        {trophies.map((trophy, index) => {
          const Icon = iconMap[trophy.trophy_icon] || Trophy;
          
          return (
            <motion.div
              key={trophy.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              className="relative bg-[#1a1a1a]/80 border border-[#333] rounded-2xl p-4 flex flex-col items-center justify-center aspect-square"
            >
              {/* Quantity badge */}
              {trophy.quantity > 1 && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-[#00E5FF] rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-black">{trophy.quantity}</span>
                </div>
              )}

              {/* Trophy icon */}
              <div className="w-16 h-16 mb-2 flex items-center justify-center">
                {trophy.icon_url ? (
                  <img 
                    src={trophy.icon_url} 
                    alt={trophy.trophy_name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Icon className="w-12 h-12 text-[#FFD700]" />
                )}
              </div>

              {/* Trophy name */}
              <p className="text-white text-xs font-bold text-center line-clamp-2">
                {trophy.trophy_name}
              </p>
              
              {/* Year */}
              {trophy.year_won && (
                <p className="text-[#666] text-[10px] mt-1">{trophy.year_won}</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}