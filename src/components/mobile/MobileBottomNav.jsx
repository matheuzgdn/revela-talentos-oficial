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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-gray-800/50">
      <div className="flex items-center justify-around px-2 py-3 relative">
        {navItems.map((item) => {
          if (item.isUpload) {
            return (
              <button
                key={item.id}
                onClick={onUploadClick}
                className="relative -mt-8"
              >
                <motion.div 
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/40 border-4 border-[#0a0a0a]"
                >
                  <Plus className="w-7 h-7 text-black" strokeWidth={3} />
                </motion.div>
              </button>
            );
          }

          const active = isActive(item.path);
          
          return (
            <Link
              key={item.id}
              to={createPageUrl(item.path)}
              className="flex flex-col items-center justify-center py-1 px-4 min-w-[56px]"
            >
              <motion.div 
                whileTap={{ scale: 0.9 }}
                className={`relative p-2 rounded-xl transition-all ${active ? 'bg-cyan-500/10' : ''}`}
              >
                <item.icon className={`w-6 h-6 transition-colors ${active ? 'text-cyan-400' : 'text-gray-500'}`} />
              </motion.div>
              <span className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${active ? 'text-cyan-400' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}