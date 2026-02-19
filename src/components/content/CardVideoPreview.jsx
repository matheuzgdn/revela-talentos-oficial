import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Lock, Clock, CheckCircle, Sparkles, Plus, ThumbsUp, Volume2, VolumeX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function CardVideoPreview({ content, onClick, progress = 0, isLocked = false, rankNumber = null }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Determinar se é novidade (últimos 7 dias)
  const isNew = () => {
    if (!content.created_date) return false;
    const createdDate = new Date(content.created_date);
    const daysDiff = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  };

  // Cores de sombra baseadas na categoria
  const getShadowColor = () => {
    switch(content.category) {
      case 'mentoria': return 'shadow-blue-500/50';
      case 'treino_tatico': return 'shadow-green-500/50';
      case 'preparacao_fisica': return 'shadow-red-500/50';
      case 'psicologia': return 'shadow-purple-500/50';
      case 'nutricao': return 'shadow-yellow-500/50';
      case 'live': return 'shadow-red-600/50';
      default: return 'shadow-cyan-500/50';
    }
  };

  const shadowColor = getShadowColor();

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
      if (videoRef.current && content.preview_video_url) {
        videoRef.current.play().catch(err => console.log('Autoplay prevented:', err));
      }
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="cursor-pointer group relative"
      initial={false}
      animate={{
        width: isHovered ? '280px' : '160px',
        zIndex: isHovered ? 50 : 1,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ flexShrink: 0 }}
    >
      {/* Card Container */}
      <motion.div 
        className={`relative w-full rounded-lg overflow-hidden shadow-2xl bg-gray-900 transition-all duration-300 ${
          isHovered ? `shadow-3xl ${shadowColor}` : ''
        }`}
        animate={{
          height: isHovered ? '157px' : '240px', // Mantém proporção 16:9 quando expandido (280 * 9/16 = 157.5)
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        
        {/* Número de Rank (apenas quando não hover) */}
        {rankNumber && !isHovered && (
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <div className="text-[120px] font-black text-stroke-white text-transparent"
                 style={{
                   WebkitTextStroke: '3px white',
                   textShadow: '0 4px 20px rgba(0,0,0,0.8)'
                 }}>
              {rankNumber}
            </div>
          </div>
        )}

        {/* Thumbnail Image / Video */}
        <AnimatePresence mode="wait">
          {!isHovered ? (
            // Vista Normal - Poster vertical
            <motion.div
              key="poster"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <img
                src={content.thumbnail_url || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400&auto=format&fit=crop"}
                alt={content.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Badges Superior */}
              <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-20">
                <div className="flex flex-col gap-2">
                  {isNew() && (
                    <Badge className="bg-red-600 text-white font-bold shadow-lg shadow-red-600/50 flex items-center gap-1 text-[10px] px-2 py-0.5">
                      <Sparkles className="w-3 h-3" />
                      Novidade
                    </Badge>
                  )}
                  
                  {content.category === 'live' && content.status === 'live' && (
                    <Badge className="bg-red-600 text-white animate-pulse font-bold shadow-lg shadow-red-600/50 text-[10px] px-2 py-0.5">
                      AO VIVO
                    </Badge>
                  )}
                </div>

                {progress >= 100 && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {progress > 0 && progress < 100 && (
                <div className="absolute bottom-14 left-0 right-0 h-1 bg-gray-800 z-20">
                  <div 
                    className="h-full bg-red-600 transition-all duration-300 shadow-lg shadow-red-600/50"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* Content Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1"
                    style={{
                      textShadow: '0 0 8px rgba(255, 255, 255, 0.6), 0 0 12px rgba(34, 211, 238, 0.4)'
                    }}>
                  {content.title}
                </h3>
                
                {content.duration && (
                  <div className="flex items-center gap-1 text-xs text-gray-300">
                    <Clock className="w-3 h-3" />
                    <span>{content.duration} min</span>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            // Vista Hover - Card expandido horizontal
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full bg-gray-900"
            >
              {/* Video Preview ou Imagem */}
              <div className="relative w-full h-full">
                {content.preview_video_url ? (
                  <video
                    ref={videoRef}
                    src={content.preview_video_url}
                    muted={isMuted}
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={content.thumbnail_url || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400&auto=format&fit=crop"}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                
                {/* Botão de Mute (se houver vídeo) */}
                {content.preview_video_url && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                    className="absolute top-2 right-2 z-30 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center border border-gray-600 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-3 h-3 text-white" />
                    ) : (
                      <Volume2 className="w-3 h-3 text-white" />
                    )}
                  </button>
                )}

                {/* Info Expandida */}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                  {/* Badges */}
                  <div className="flex gap-1 mb-2">
                    {isNew() && (
                      <Badge className="bg-red-600 text-white text-[9px] px-1.5 py-0.5">
                        Novidade
                      </Badge>
                    )}
                    {content.category === 'live' && content.status === 'live' && (
                      <Badge className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 animate-pulse">
                        AO VIVO
                      </Badge>
                    )}
                    {progress >= 100 && (
                      <Badge className="bg-green-600 text-white text-[9px] px-1.5 py-0.5">
                        Completo
                      </Badge>
                    )}
                  </div>

                  {/* Título */}
                  <h3 className="text-white font-bold text-xs mb-1 line-clamp-1"
                      style={{
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 15px rgba(34, 211, 238, 0.5)'
                      }}>
                    {content.title}
                  </h3>

                  {/* Botões de Ação */}
                  <div className="flex items-center gap-1 mb-1">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClick(content);
                      }}
                      className="bg-white hover:bg-gray-200 text-black font-semibold h-6 px-2 rounded-full text-[10px]"
                    >
                      <Play className="w-2.5 h-2.5 mr-1 fill-current" />
                      Assistir
                    </Button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-6 h-6 bg-gray-800/80 hover:bg-gray-700 rounded-full flex items-center justify-center border border-gray-600 transition-colors"
                    >
                      <Plus className="w-2.5 h-2.5 text-white" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-6 h-6 bg-gray-800/80 hover:bg-gray-700 rounded-full flex items-center justify-center border border-gray-600 transition-colors"
                    >
                      <ThumbsUp className="w-2.5 h-2.5 text-white" />
                    </button>
                  </div>

                  {/* Metadados */}
                  <div className="flex items-center gap-2 text-[9px] text-gray-300">
                    {content.duration && (
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {content.duration} min
                      </span>
                    )}
                    {content.instructor && (
                      <span className="truncate">{content.instructor}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="text-center">
              <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400 font-semibold">Plano Elite</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}