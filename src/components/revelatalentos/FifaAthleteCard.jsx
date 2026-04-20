import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function FifaAthleteCard({ story, index }) {
  const gradient = 'from-[#FFD700] via-[#FFA500] to-[#FF6B00]';
  const title = story.title || story.athlete_name || 'Atleta em destaque';
  const imageUrl = story.thumbnail_url || story.photo_url || story.media_url;
  const description = story.description || story.bio;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative flex-shrink-0 w-[200px] md:w-[220px] group perspective-1000 cursor-pointer"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* FIFA Card Container */}
      <div className={`relative bg-gradient-to-br ${gradient} p-[2px] rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105`}>
        <div className="relative bg-gradient-to-b from-black/95 via-[#0A1520] to-black rounded-2xl overflow-hidden">
          
          {/* Card Header - Rating & Position Style */}
          <div className="absolute top-2 left-2 z-10">
            <div className="flex flex-col items-center">
              <div className={`text-4xl font-black bg-gradient-to-br ${gradient} bg-clip-text text-transparent drop-shadow-lg`}>
                {story.display_order || 99}
              </div>
              <div className={`text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                EC10
              </div>
            </div>
          </div>

          {/* Featured Badge */}
          {story.is_featured && (
            <div className="absolute top-2 right-2 z-10">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-1.5 shadow-xl animate-pulse">
                <Star className="w-3 h-3 text-black" fill="black" />
              </div>
            </div>
          )}

          {/* Player Image/Media */}
          <div className="relative aspect-[3/4]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
            
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover filter contrast-125 brightness-110"
            />

            {/* Holographic Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Card Footer - Player Name & Details */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-3 pt-6">
            <div className="relative">
              {/* Name */}
              <h3 className="text-white font-black text-base uppercase tracking-tight leading-tight line-clamp-1 mb-1">
                {title}
              </h3>
              
              {/* Description */}
              {description && (
                <p className="text-gray-400 text-[10px] leading-snug line-clamp-2 mb-2">
                  {description}
                </p>
              )}

              {/* Stats Bar */}
              <div className={`h-1 bg-gradient-to-r ${gradient} rounded-full`} />
            </div>
          </div>

          {/* Shine Effect */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
            style={{ 
              background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
              backgroundSize: '200% 200%',
              animation: 'shine 3s ease-in-out infinite'
            }} 
          />
        </div>
      </div>

      {/* Shadow Effect */}
      <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4/5 h-3 bg-gradient-to-r ${gradient} blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
      
      <style>{`
        @keyframes shine {
          0%, 100% {
            background-position: 200% 0;
          }
          50% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </motion.div>
  );
}
