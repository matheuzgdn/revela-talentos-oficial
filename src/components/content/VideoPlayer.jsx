
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import {
  X,
  MessageCircle,
  Send,
  Volume2,
  VolumeX,
  Maximize,
  Play,
  Pause
} from 'lucide-react';
import { appClient } from '@/api/backendClient';
import { toast } from 'sonner';

export default function VideoPlayer({
  content,
  onClose,
  onProgress,
  initialProgress = 0,
  autoPlay = true
}) {
  const videoRef = useRef(null);
  const progressSaveTimeoutRef = useRef(null);
  const lastSavedProgressRef = useRef(initialProgress);
  const playerInstanceRef = useRef(null);
  const playerContainerRef = useRef(null);

  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  let hideControlsTimeout;

  // Helper to determine if a URL is a YouTube video URL
  const isYouTubeUrl = (url) => url && (url.includes('youtube.com') || url.includes('youtu.be'));

  // Define player type flags
  const isLiveContent = content.category === 'live' && content.status === 'live';
  // Determine if we are using a generic external embed code (THIS IS THE PRIMARY FLAG FROM PROMPT)
  const isExternalEmbed = !!content.live_embed_code;

  // Flag for YouTube API player if it's not a generic embed, and content.video_url is a YouTube link
  const isYouTubeAPIPlayer = !isExternalEmbed && isYouTubeUrl(content.video_url);

  // Flag for HTML5 player if it's not a generic embed, not a YouTube API player, and has a video_url (e.g., MP4)
  const isHtml5PlayerWithVideoURL = !isExternalEmbed && !isYouTubeAPIPlayer && !!content.video_url;

  const loadComments = useCallback(async () => {
    try {
      const allComments = await appClient.entities.Comment.filter({ content_id: content.id });
      setComments(allComments || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }, [content.id]);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUser = await appClient.entities.User.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadComments();
    }
  }, [user, loadComments]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    try {
      await appClient.entities.Comment.create({
        user_id: user.id,
        content_id: content.id,
        comment_text: newComment
      });
      setNewComment('');
      loadComments();
      toast.success('ComentÃ¡rio adicionado!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Erro ao adicionar comentÃ¡rio');
    }
  };

  // YouTube Player Setup for API (when using content.video_url directly)
  const onPlayerReady = useCallback((event) => {
    playerInstanceRef.current = event.target;
    event.target.setVolume(volume);
    if (autoPlay) {
      event.target.playVideo();
      setIsPlaying(true);
    }
    setDuration(event.target.getDuration());
  }, [volume, autoPlay]);

  const onPlayerStateChange = useCallback((event) => {
    const YT = window.YT;
    if (event.data === YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (event.data === YT.PlayerState.PAUSED) {
      setIsPlaying(false);
    } else if (event.data === YT.PlayerState.ENDED) {
      setIsPlaying(false);
      setProgress(100);
    }
  }, []);

  const createYouTubePlayer = useCallback((videoId) => {
    if (window.YT && window.YT.Player) {
      playerInstanceRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: autoPlay ? 1 : 0,
          controls: 0,        // Remove ALL default controls
          rel: 0,             // Remove related videos
          showinfo: 0,        // Remove video info
          modestbranding: 1,  // Remove YouTube logo
          iv_load_policy: 3,  // Remove annotations
          playsinline: 1,
          disablekb: 1,       // Disable keyboard controls
          fs: 0,              // Disable YouTube's fullscreen button
          cc_load_policy: 0,  // Remove automatic captions
          enablejsapi: 1,     // Enable JavaScript API
          origin: window.location.origin
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }
  }, [onPlayerReady, onPlayerStateChange, autoPlay]);

  // Unified useEffect for player setup (Generic Embed, YouTube API)
  useEffect(() => {
    // Case 1: Generic Embed Code (takes precedence if present)
    if (isExternalEmbed) { // This means content.live_embed_code exists
      const embedContainer = document.getElementById('embed-container');
      if (embedContainer) {
        let processedEmbed = content.live_embed_code;

        // If it's YouTube within the embed code, add parameters to allow autoplay and show controls
        if (isYouTubeUrl(processedEmbed)) {
          processedEmbed = processedEmbed.replace(/src="([^"]+)"/, (match, src) => {
            const url = new URL(src);
            url.searchParams.set('autoplay', autoPlay ? '1' : '0');
            url.searchParams.set('controls', '1'); // Keep native controls for generic embeds if YouTube
            url.searchParams.set('modestbranding', '1');
            url.searchParams.set('rel', '0');
            url.searchParams.set('playsinline', '1');
            url.searchParams.set('enablejsapi', '1');
            return `src="${url.toString()}"`;
          });
        }

        // For Wix embeds, add autoplay parameters
        if (processedEmbed.includes('wixstatic.com') || processedEmbed.includes('wix.com')) {
          processedEmbed = processedEmbed.replace(/src="([^"]+)"/, (match, src) => {
            const separator = src.includes('?') ? '&' : '?';
            return `src="${src}${separator}autoplay=${autoPlay ? 1 : 0}"`;
          });
        }

        // For lives, remove some attributes but maintain basic functionality
        if (isLiveContent) {
          processedEmbed = processedEmbed.replace(/allowfullscreen/g, '');
        }

        embedContainer.innerHTML = processedEmbed;

        // Adjust iframe size and attributes
        const iframe = embedContainer.querySelector('iframe');
        if (iframe) {
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = 'none';
          iframe.removeAttribute('width');
          iframe.removeAttribute('height');

          // For lives, use a more restrictive sandbox; for normal embeds, allow forms too
          if (isLiveContent) {
            iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
          } else {
            iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-forms');
          }
        }
      }
    }
    // Case 2: YouTube API Player via content.video_url (if no generic embed code)
    else if (isYouTubeAPIPlayer) {
      let videoId = '';
      const youtubeUrl = content.video_url;
      const match = youtubeUrl.match(/(?:youtube\.com\/(?:watch\?v=|live\/)|youtu\.be\/)([^&\n?#]+)/);
      if (match) videoId = match[1];

      if (videoId) {
        if (!window.YT) {
          const tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          window.onYouTubeIframeAPIReady = () => createYouTubePlayer(videoId);
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          createYouTubePlayer(videoId);
        }

        // Update progress for YouTube videos
        const updateProgress = setInterval(() => {
          const player = playerInstanceRef.current;
          if (player && typeof player.getCurrentTime === 'function') {
            const current = player.getCurrentTime();
            const total = player.getDuration();
            setCurrentTime(current);
            setDuration(total);
            if (total > 0) {
              setProgress((current / total) * 100);
            }
          }
        }, 1000);

        return () => {
          clearInterval(updateProgress);
          const player = playerInstanceRef.current;
          if (player && typeof player.destroy === 'function') {
            player.destroy();
          }
          playerInstanceRef.current = null;
        };
      }
    }
  }, [isExternalEmbed, isYouTubeAPIPlayer, content.live_embed_code, content.video_url, isLiveContent, autoPlay, createYouTubePlayer]);

  // Regular video setup (for HTML5 <video> tag)
  useEffect(() => {
    // This block runs only if it's an HTML5 video (not external embed and not YouTube API)
    if (isHtml5PlayerWithVideoURL && videoRef.current) {
      const video = videoRef.current;

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        setProgress((video.currentTime / video.duration) * 100);
      };

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
        if (initialProgress > 0) {
          video.currentTime = (initialProgress / 100) * video.duration;
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);

      if (autoPlay) {
        video.play().then(() => setIsPlaying(true));
      }

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [isHtml5PlayerWithVideoURL, initialProgress, autoPlay]);

  const togglePlay = () => {
    if (isYouTubeAPIPlayer) {
      const player = playerInstanceRef.current;
      if (player) {
        if (isPlaying) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
      }
    } else if (isHtml5PlayerWithVideoURL && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleProgressClick = (e) => {
    if (!duration || duration === 0) return; // Prevent division by zero or errors before metadata is loaded
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * duration;

    if (isYouTubeAPIPlayer) {
      const player = playerInstanceRef.current;
      if (player && typeof player.seekTo === 'function') {
        player.seekTo(time, true);
      }
    } else if (isHtml5PlayerWithVideoURL && videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (isYouTubeAPIPlayer) {
      const player = playerInstanceRef.current;
      if (player) {
        if (player.isMuted()) {
          player.unMute();
          setIsMuted(false);
        } else {
          player.mute();
          setIsMuted(true);
        }
      }
    } else if (isHtml5PlayerWithVideoURL && videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (newVolume) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);

    if (isYouTubeAPIPlayer) {
      const player = playerInstanceRef.current;
      if (player && typeof player.setVolume === 'function') {
        player.setVolume(volumeValue);
        if (volumeValue > 0 && player.isMuted()) {
          player.unMute();
          setIsMuted(false);
        } else if (volumeValue === 0 && !player.isMuted()) {
          player.mute();
          setIsMuted(true);
        }
      }
    } else if (isHtml5PlayerWithVideoURL && videoRef.current) {
      videoRef.current.volume = volumeValue / 100;
      if (volumeValue > 0 && videoRef.current.muted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      } else if (volumeValue === 0 && !videoRef.current.muted) {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    const playerContainer = document.querySelector('.video-player-container');
    if (!playerContainer) return;

    try {
      if (!document.fullscreenElement) {
        if (playerContainer.requestFullscreen) {
          playerContainer.requestFullscreen();
        } else if (playerContainer.webkitRequestFullscreen) {
          playerContainer.webkitRequestFullscreen();
        } else if (playerContainer.mozRequestFullScreen) {
          playerContainer.mozRequestFullScreen();
        } else if (playerContainer.msRequestFullscreen) {
          playerContainer.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    } catch (error) {
      console.warn('Fullscreen error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex">
      <div className="flex-1 relative video-player-container">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Video Container */}
        <div
          className="relative w-full h-full bg-black flex items-center justify-center"
          onMouseMove={() => {
            // Only show controls if not an external embed (meaning it's YouTube API or HTML5)
            if (!isExternalEmbed) {
              setShowControls(true);
              clearTimeout(hideControlsTimeout);
              hideControlsTimeout = setTimeout(() => setShowControls(false), 3000);
            }
          }}
        >
          {isExternalEmbed ? (
            // VÃ­deo Incorporado via Embed Code (e.g., Twitch, custom streams)
            <div id="embed-container" className="w-full h-full" />
          ) : isYouTubeAPIPlayer ? (
            // YouTube Player via API (from content.video_url, if not external embed)
            <div ref={playerContainerRef} id="youtube-player" className="w-full h-full" />
          ) : isHtml5PlayerWithVideoURL ? (
            // Player Customizado (HTML5 video tag, if not external embed and not YouTube API)
            <video
              ref={videoRef}
              className="max-w-full max-h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={content.video_url} type="video/mp4" />
              Seu navegador nÃ£o suporta o elemento de vÃ­deo.
            </video>
          ) : (
            <div className="text-white text-center">
              <p>ConteÃºdo nÃ£o disponÃ­vel</p>
            </div>
          )}

          {/* Camada de proteÃ§Ã£o APENAS para lives incorporadas */}
          {isLiveContent && isExternalEmbed && (
            <div
              className="absolute inset-0 z-10 bg-transparent"
              style={{
                pointerEvents: 'none',
                background: 'transparent'
              }}
              onClick={(e) => e.preventDefault()}
            />
          )}
        </div>

        {/* Controles Customizados - Apenas para YouTube API e HTML5 */}
        <AnimatePresence>
          {showControls && !isExternalEmbed && ( // Controls only for non-external embeds
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6"
            >
              {/* Barra de Progresso - only show for non-live content if duration is known */}
              {duration > 0 && !isLiveContent && (
                <div className="mb-4">
                  <div
                    className="w-full h-2 bg-gray-700 rounded-full cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 mt-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              )}

              {/* BotÃµes de Controle */}
              <div className="flex items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                  {/* Play/Pause */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20 w-12 h-12"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </Button>

                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                    <Slider
                      value={[volume]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      className="w-24"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowComments(!showComments)}
                    className="text-white hover:bg-white/20"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Comments Panel */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col"
          >
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-white font-semibold">
                {isLiveContent ? 'Chat da Live' : 'ComentÃ¡rios'}
              </h3>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-800 rounded-lg p-3">
                    <p className="text-white text-sm">{comment.comment_text}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(comment.created_date).toLocaleDateString()}
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
                  placeholder={isLiveContent ? "Digite sua mensagem..." : "Adicionar comentÃ¡rio..."}
                  className="bg-gray-800 border-gray-700 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button onClick={handleAddComment} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

