import React, { useState, useEffect } from "react";
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, Users, ArrowLeft, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function LivesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await base44.auth.me();
      
      if (!currentUser) {
        navigate(createPageUrl("RevelaTalentos"));
        return;
      }
      
      setUser(currentUser);
      setIsLoadingUser(false);
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate(createPageUrl("RevelaTalentos"));
    }
  };

  const handlePlayerLoad = () => {
    setIsIframeLoading(false);
  };

  // Loading screen fullscreen
  if (isLoadingUser) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <Loader2 className="w-20 h-20 text-cyan-400 animate-spin relative z-10" />
          </div>
          <p className="text-gray-200 text-xl font-bold">Carregando transmissão...</p>
          <div className="flex items-center gap-3 text-gray-400">
            <Radio className="w-5 h-5 animate-pulse" />
            <span>Conectando ao servidor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ========== MOBILE VIEW ========== */}
      <div className="md:hidden fixed inset-0 bg-black text-white flex flex-col overflow-y-auto">
        {/* Botão Voltar - Fixo no topo */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black via-black/80 to-transparent">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(createPageUrl("RevelaTalentos"))}
            className="bg-black/60 hover:bg-black/80 text-white border border-cyan-500/30 hover:border-cyan-400 transition-all backdrop-blur-xl rounded-xl shadow-lg"
          >
            <X className="w-5 h-5" />
          </Button>

          <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white flex items-center gap-2 px-3 py-1.5 shadow-2xl shadow-red-500/50 border border-red-400/30 animate-pulse">
            <Radio className="w-3 h-3" />
            <span className="font-bold text-xs">AO VIVO</span>
          </Badge>
        </div>

        {/* Player Section */}
        <div className="relative w-full aspect-video bg-black mt-16">
          <AnimatePresence>
            {isIframeLoading && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center bg-black z-10"
              >
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                  <p className="text-gray-300 text-sm">Carregando player...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <iframe
            src="https://player.onestream.live/embed?token=NDU0NTE0Mw==&type=up"
            className="w-full h-full border-0"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            sandbox="allow-same-origin allow-scripts allow-presentation"
            onLoad={handlePlayerLoad}
          />
        </div>

        {/* Chat Section */}
        <div className="flex-1 bg-gradient-to-b from-gray-950 to-black flex flex-col min-h-[40vh]">
          <div className="flex-shrink-0 h-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border-b border-cyan-500/20 flex items-center px-4">
            <Users className="w-4 h-4 text-cyan-400 mr-2" />
            <span className="text-white font-bold text-sm">Chat ao vivo</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs font-medium">Online</span>
            </div>
          </div>
          
          <div className="flex-1 min-h-0">
            <iframe
              src="https://chat.onestream.live/embed?token=dW5pdmVyc2FsLWNoYXQtNDU0NTE0Mw=="
              className="w-full h-full border-0"
              frameBorder="0"
              allow="autoplay"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>
      </div>

      {/* ========== DESKTOP VIEW ========== */}
      <div className="hidden md:block min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
        {/* Header */}
        <header className="relative bg-gradient-to-b from-black/80 via-gray-950/50 to-transparent py-8 px-6 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative">
            <Button
              variant="ghost"
              onClick={() => navigate(createPageUrl("RevelaTalentos"))}
              className="text-gray-300 hover:text-white mb-6 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-md animate-pulse"></div>
                  <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full relative animate-pulse shadow-lg shadow-red-500/50"></div>
                </div>
                <h1 className="text-5xl font-black">
                  <span className="text-white">Lives </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">EC10 Talentos</span>
                </h1>
              </div>
              
              <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white flex items-center gap-2 px-6 py-3 shadow-2xl shadow-red-500/50 border border-red-400/30 animate-pulse">
                <Radio className="w-5 h-5" />
                <span className="font-bold text-base">AO VIVO AGORA</span>
              </Badge>
            </div>
            <p className="text-gray-300 mt-4 text-lg">
              Assista à transmissão ao vivo e interaja com outros atletas no chat
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 pb-12 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_65%)] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto relative space-y-8">
            {/* Player Container */}
            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-cyan-500/20">
              <AnimatePresence>
                {isIframeLoading && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-black z-10"
                  >
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                        <Loader2 className="w-20 h-20 text-cyan-400 animate-spin relative z-10" />
                      </div>
                      <p className="text-gray-200 text-xl font-bold">Carregando player...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <iframe
                src="https://player.onestream.live/embed?token=NDU0NTE0Mw==&type=up"
                className="absolute inset-0 w-full h-full border-0"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
                sandbox="allow-same-origin allow-scripts allow-presentation"
                onLoad={handlePlayerLoad}
              />
            </div>

            {/* Chat Container */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/50 border-2 border-cyan-500/20 overflow-hidden backdrop-blur-sm shadow-2xl rounded-2xl">
              <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
                      <Users className="w-5 h-5 text-cyan-400" />
                    </div>
                    Chat ao vivo
                  </h2>
                  <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Online
                  </Badge>
                </div>
              </div>
              
              <div className="w-full h-[400px] bg-black">
                <iframe
                  src="https://chat.onestream.live/embed?token=dW5pdmVyc2FsLWNoYXQtNDU0NTE0Mw=="
                  className="w-full h-full border-0"
                  frameBorder="0"
                  allow="autoplay"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}