import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Video, Plus, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-gray-800/50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2 relative">
        {navItems.map((item) => {
          if (item.isUpload) {
            return (
              <button
                key={item.id}
                onClick={onUploadClick}
                className="relative -mt-6"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 border-4 border-black">
                  <Plus className="w-7 h-7 text-black" strokeWidth={3} />
                </div>
              </button>
            );
          }

          const active = isActive(item.path);
          
          return (
            <Link
              key={item.id}
              to={createPageUrl(item.path)}
              className="flex flex-col items-center justify-center py-2 px-3 min-w-[60px]"
            >
              <div className={`relative ${active ? 'text-white' : 'text-gray-500'}`}>
                <item.icon className="w-6 h-6" />
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full"
                  />
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${active ? 'text-white' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}