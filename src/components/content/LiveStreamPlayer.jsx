import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { X, Radio, Send, MessageCircle, Volume2, VolumeX, Maximize, Users } from 'lucide-react';
import { appClient } from '@/api/backendClient';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LiveStreamPlayer({ content, onClose }) {
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liveViewers, setLiveViewers] = useState([]);

  const playerInstanceRef = useRef(null);
  const playerContainerRef = useRef(null);

  // Check if content uses external embed code (Wix, Twitch, etc.)
  const isExternalEmbed = !!content.live_embed_code;

  const onPlayerReady = useCallback((event) => {
    playerInstanceRef.current = event.target;
    event.target.setVolume(100);
    event.target.playVideo();
    setIsPlaying(true);
  }, []);

  const createPlayer = useCallback((videoId) => {
    if (window.YT && window.YT.Player) {
      playerInstanceRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          playsinline: 1,
          disablekb: 1,
          fs: 0,
          cc_load_policy: 0,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          'onReady': onPlayerReady,
        }
      });
    }
  }, [onPlayerReady]);

  useEffect(() => {
    if (isExternalEmbed && content.live_embed_code) {
      // Para vídeos/lives incorporados, usar o código embed diretamente
      const embedContainer = document.getElementById('live-embed-container');
      if (embedContainer) {
        let processedEmbed = content.live_embed_code;

        // Processar códigos do Wix
        if (processedEmbed.includes('wixstatic.com') || processedEmbed.includes('wix.com')) {
          // Para Wix, manter o embed original mas remover controles se possível
          processedEmbed = processedEmbed.replace(/controls/g, 'controls="false"');
          processedEmbed = processedEmbed.replace(/showinfo="1"/g, 'showinfo="0"');
        }

        // Processar códigos do YouTube
        if (processedEmbed.includes('youtube.com') || processedEmbed.includes('youtu.be')) {
          processedEmbed = processedEmbed.replace(/src="([^"]+)"/, (match, src) => {
            const url = new URL(src);
            url.searchParams.set('controls', '0');
            url.searchParams.set('modestbranding', '1');
            url.searchParams.set('rel', '0');
            url.searchParams.set('showinfo', '0');
            url.searchParams.set('iv_load_policy', '3');
            url.searchParams.set('disablekb', '1');
            url.searchParams.set('fs', '0');
            url.searchParams.set('cc_load_policy', '0');
            url.searchParams.set('enablejsapi', '1');
            return `src="${url.toString()}"`;
          });
        }

        // Para lives, sempre bloquear navegação externa
        processedEmbed = processedEmbed.replace(/allowfullscreen/g, '');
        processedEmbed = processedEmbed.replace(/allow="[^"]*"/g, '');

        embedContainer.innerHTML = processedEmbed;

        // Ajustar iframe
        const iframe = embedContainer.querySelector('iframe');
        if (iframe) {
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = 'none';
          iframe.removeAttribute('width');
          iframe.removeAttribute('height');

          // Bloquear navegação externa para lives
          iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
        }
      }
    } else if (content.video_url) {
      // Fallback para YouTube API se houver video_url
      let videoId = '';
      const youtubeUrl = content.video_url;
      if (youtubeUrl) {
        const match = youtubeUrl.match(/(?:youtube\.com\/(?:watch\?v=|live\/)|youtu\.be\/)([^&\n?#]+)/);
        if (match) videoId = match[1];
      }

      if (!videoId) return;

      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        window.onYouTubeIframeAPIReady = () => createPlayer(videoId);
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        createPlayer(videoId);
      }
    }

    // Cleanup
    return () => {
      const player = playerInstanceRef.current;
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
      playerInstanceRef.current = null;
      if (window.onYouTubeIframeAPIReady) {
        delete window.onYouTubeIframeAPIReady;
      }
    };

  }, [content.live_embed_code, content.video_url, createPlayer, isExternalEmbed]);

  useEffect(() => {
    // Simular espectadores
    const fetchViewers = async () => {
      try {
        const allUsers = await appClient.entities.User.list();
        if (allUsers && allUsers.length > 0) {
          const viewerCount = Math.floor(Math.random() * (allUsers.length / 2)) + 5;
          const shuffled = [...allUsers].sort(() => 0.5 - Math.random());
          setLiveViewers(shuffled.slice(0, Math.min(viewerCount, allUsers.length)));
        }
      } catch (error) {
        console.warn("Não foi possível carregar usuários para simular espectadores.", error);
      }
    };
    fetchViewers();
  }, []);

  const loadComments = useCallback(async () => {
    try {
      const allComments = await appClient.entities.Comment.filter({ content_id: content.id }, "-created_date");
      setComments(allComments || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }, [content.id]);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUser = await appClient.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };
    getCurrentUser();
    loadComments();
    const interval = setInterval(loadComments, 10000);
    return () => clearInterval(interval);
  }, [loadComments]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    try {
      await appClient.entities.Comment.create({ user_id: user.id, content_id: content.id, comment_text: newComment });
      setNewComment('');
      loadComments();
      toast.success('Comentário enviado!');
    } catch (error) {
      toast.error('Erro ao enviar comentário');
    }
  };

  const toggleMute = () => {
    const player = playerInstanceRef.current;
    if (!player) return;
    if (isMuted) {
      player.unMute();
      setIsMuted(false);
      if (volume === 0) {
        setVolume(50);
        player.setVolume(50);
      }
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (newVolume) => {
    const player = playerInstanceRef.current;
    if (!player) return;
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    player.setVolume(volumeValue);
    if (volumeValue > 0 && isMuted) {
      player.unMute();
      setIsMuted(false);
    } else if (volumeValue === 0 && !isMuted) {
      player.mute();
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const iframe = playerContainerRef.current?.querySelector('iframe') || document.querySelector('#live-embed-container iframe');
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex">
      <div className="flex-1 relative group">
        {/* Botão de Fechar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-black/70 hover:bg-black/90 text-white border border-gray-600 hover:border-gray-400"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="relative w-full h-full bg-black flex flex-col">
          {/* Header da Live */}
          <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between gap-4 w-full z-10">
            <div className="flex items-center gap-3">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="font-bold text-sm">AO VIVO</span>
              <div className="w-px h-4 bg-red-400"></div>
              <span className="text-sm opacity-80 truncate hidden md:block">{content.title}</span>
            </div>

            {/* Espectadores */}
            {liveViewers.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  {liveViewers.slice(0, 4).map(viewer => (
                    <Avatar key={viewer.id} className="h-6 w-6 border-2 border-red-500">
                      <AvatarImage src={viewer.profile_picture_url} />
                      <AvatarFallback className="text-xs bg-red-800">{viewer.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold">{liveViewers.length}</span>
                  <span className="opacity-80 hidden sm:inline">assistindo</span>
                </div>
              </div>
            )}
          </div>

          {/* Container do Player */}
          <div className="w-full flex-1 relative">
            {isExternalEmbed ? (
              // Player Incorporado (Wix, Twitch, etc.)
              <div id="live-embed-container" className="w-full h-full" />
            ) : (
              // Player do YouTube via API
              <div ref={playerContainerRef} id="youtube-player" className="w-full h-full" />
            )}

            {/* Camada Transparente para Interceptar Cliques */}
            <div
              className="absolute inset-0 z-20 bg-transparent cursor-pointer"
              onDoubleClick={toggleFullscreen}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                return false;
              }}
              style={{
                pointerEvents: 'auto',
                background: 'rgba(0,0,0,0.01)'
              }}
            />
          </div>
        </div>

        {/* Controles Customizados */}
        {!isExternalEmbed && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="text-white hover:bg-white/20 w-12 h-12"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </Button>
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  className="w-32"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="text-white hover:bg-white/20 w-12 h-12"
              >
                <Maximize className="w-6 h-6" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Chat Lateral */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col"
          >
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-white font-semibold">Chat da Live</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowComments(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-800 rounded-lg p-3 text-sm">
                    <p className="text-gray-300">
                      <span className="font-bold text-white mr-2">
                        {comment.created_by.split('@')[0]}:
                      </span>
                      {comment.comment_text}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="bg-gray-800 border-gray-700 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  disabled={!user}
                />
                <Button onClick={handleAddComment} size="icon" disabled={!user}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão para Mostrar Chat quando escondido */}
      {!showComments && (
        <Button
          className="fixed bottom-24 md:bottom-4 right-4 z-50 rounded-full bg-red-600 hover:bg-red-700"
          onClick={() => setShowComments(true)}
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Mostrar Chat
        </Button>
      )}
    </div>
  );
}
