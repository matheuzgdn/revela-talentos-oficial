import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Video, Plus, Search, User } from "lucide-react";
import { motion } from "framer-motion";

export default function MobileBottomNav({ onUploadClick }) {
  const location = useLocation();
  
  const navItems = [
    { id: "home", icon: Home, label: "Início", path: "RevelaTalentos" },
    { id: "videos", icon: Video, label: "Vídeos", path: "AthleteVideos" },
    { id: "upload", icon: Plus, label: "", isUpload: true },
    { id: "search", icon: Search, label: "Busca", path: "SearchAthletes" },
    { id: "profile", icon: User, label: "Perfil", path: "AthleteProfile" },
  ];

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#1a1a1a]">
      <div className="flex items-center justify-around px-2 py-2 relative">
        {navItems.map((item) => {
          if (item.isUpload) {
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.85 }}
                onClick={onUploadClick}
                className="relative -mt-6"
              >
                <div className="w-12 h-12 bg-[#00E5FF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00E5FF]/40 border-4 border-[#0A0A0A]">
                  <Plus className="w-6 h-6 text-black" strokeWidth={3} />
                </div>
                <div className="absolute inset-0 bg-[#00E5FF]/30 rounded-2xl blur-xl -z-10" />
              </motion.button>
            );
          }

          const active = isActive(item.path);
          
          return (
            <Link
              key={item.id}
              to={createPageUrl(item.path)}
              className="flex flex-col items-center justify-center py-0.5 px-3 min-w-[48px]"
            >
              <motion.div 
                whileTap={{ scale: 0.85 }}
                className={`relative p-2 rounded-xl transition-all ${
                  active 
                    ? 'bg-[#00E5FF]/10' 
                    : ''
                }`}
              >
                <item.icon 
                  className={`w-5 h-5 transition-colors ${
                    active 
                      ? 'text-[#00E5FF]' 
                      : 'text-[#666]'
                  }`} 
                />
                {active && (
                  <motion.div 
                    layoutId="navGlow"
                    className="absolute inset-0 bg-[#00E5FF]/20 rounded-xl blur-lg -z-10"
                  />
                )}
              </motion.div>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${
                active 
                  ? 'text-[#00E5FF]' 
                  : 'text-[#444]'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}