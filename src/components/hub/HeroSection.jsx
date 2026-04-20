import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { redirectToPlatformLogin } from "@/lib/auth-routing";

export default function HeroSection({ user, totalNotifications, userNotifications }) {
  const handleLoginClick = () => {
    redirectToPlatformLogin();
  };

  return (
    <section className="relative overflow-hidden bg-black min-h-screen flex items-center justify-center text-center">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-50"
        >
          <source src="https://video.wixstatic.com/video/933cdd_388c6e2a108d49f089ef70033306e785/1080p/mp4/file.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      </div>

      {/* Notification Badges */}
      {user?.role === 'admin' && totalNotifications > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-6 right-6 z-20"
        >
          <Link to={createPageUrl("Admin")}>
            <Badge className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 cursor-pointer transition-colors shadow-lg text-xs rounded-full">
              <Bell className="w-3 h-3 mr-1" />
              {totalNotifications}
            </Badge>
          </Link>
        </motion.div>
      )}

      {/* Para todas as idades - Canto inferior esquerdo */}
      <div className="absolute bottom-6 left-6 z-20">
        <p className="text-white text-sm opacity-80">Para todas as idades</p>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Logo EC10 */}
          <img 
            src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" 
            alt="EC10 Logo" 
            className="h-12 md:h-20 mx-auto mb-8" 
          />

          {/* Título Principal - Responsivo e Proporcional */}
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
              <div className="text-white mb-1">DESPERTE O</div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-1">
                TALENTO
              </div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-300">
                EM VOCÊ
              </div>
            </h1>
          </div>

          {/* Subtítulo */}
          <p className="text-base md:text-lg text-slate-300 mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
            Transforme sua paixão em uma carreira de sucesso no futebol.
          </p>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={handleLoginClick}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-white font-bold py-3 px-6 rounded-2xl md:rounded-lg shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 text-sm sm:text-base w-full sm:w-auto uppercase tracking-wide"
            >
              <Play className="w-4 h-4 mr-2" />
              Começar Agora
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="bg-gray-800/60 border-gray-600/50 text-gray-200 font-bold py-3 px-6 rounded-2xl md:rounded-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-gray-700/60 w-full sm:w-auto uppercase tracking-wide text-sm sm:text-base"
            >
              Saiba Mais
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
