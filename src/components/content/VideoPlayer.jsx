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

const PROGRESS_SAVE_INTERVAL_MS = 15000;
const MIN_PROGRESS_SAVE_SECONDS = 5;
const MIN_PROGRESS_DELTA_SECONDS = 10;
const MIN_PROGRESS_DELTA_PERCENT = 1;

const clampNumber = (value, min, max) => Math.min(max, Math.max(min, value));

const isYouTubeUrl = (url) => url && (url.includes('youtube.com') || url.includes('youtu.be'));

const extractYouTubeVideoId = (url) => {
  if (!url) return '';

  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|live\/)|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : '';
};

export default function VideoPlayer({
  content,
  user: initialUser = null,
  onClose,
  onProgress,
  progressEntry = null,
  initialProgress = 0,
  initialTimeSeconds = 0,
  autoPlay = true
}) {
  const videoRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const playerContainerRef = useRef(null);
  const hideControlsTimeoutRef = useRef(null);
  const saveInFlightRef = useRef(null);
  const progressRecordRef = useRef(progressEntry);
  const userRef = useRef(initialUser);
  const onProgressRef = useRef(onProgress);
  const volumeRef = useRef(100);
  const progressStateRef = useRef(Number(progressEntry?.progress_percent ?? initialProgress ?? 0));
  const initialSeekAppliedRef = useRef(false);
  const initialResumeProgressRef = useRef(Number(progressEntry?.progress_percent ?? initialProgress ?? 0));
  const initialResumeTimeRef = useRef(
    Number(progressEntry?.last_position_seconds ?? progressEntry?.watch_time_seconds ?? initialTimeSeconds ?? 0)
  );
  const lastSavedProgressRef = useRef(initialResumeProgressRef.current);
  const lastSavedPositionRef = useRef(initialResumeTimeRef.current);

  const [user, setUser] = useState(initialUser);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(initialResumeTimeRef.current);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(initialResumeProgressRef.current);

  const isLiveContent = content.category === 'live' && content.status === 'live';
  const isExternalEmbed = Boolean(content.live_embed_code);
  const isYouTubeAPIPlayer = !isExternalEmbed && isYouTubeUrl(content.video_url);
  const isHtml5PlayerWithVideoURL = !isExternalEmbed && !isYouTubeAPIPlayer && Boolean(content.video_url);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    progressStateRef.current = progress;
  }, [progress]);

  useEffect(() => {
    progressRecordRef.current = progressEntry ?? null;

    if (!initialSeekAppliedRef.current) {
      const resumeProgress = Number(progressEntry?.progress_percent ?? initialProgress ?? 0);
      const resumeTime = Number(
        progressEntry?.last_position_seconds
        ?? progressEntry?.watch_time_seconds
        ?? initialTimeSeconds
        ?? 0
      );

      lastSavedProgressRef.current = resumeProgress;
      lastSavedPositionRef.current = resumeTime;
      setProgress(resumeProgress);
      setCurrentTime(resumeTime);
    }
  }, [progressEntry, initialProgress, initialTimeSeconds]);

  const loadComments = useCallback(async () => {
    try {
      const allComments = await appClient.entities.Comment.filter({ content_id: content.id });
      setComments(allComments || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }, [content.id]);

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      return undefined;
    }

    let isMounted = true;

    const getCurrentUser = async () => {
      try {
        const currentUser = await appClient.entities.User.me();

        if (isMounted) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };

    getCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [initialUser]);

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
      toast.success('Comentario adicionado!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Erro ao adicionar comentario');
    }
  };

  const applyInitialSeek = useCallback((seekToSeconds, totalDuration = 0) => {
    if (initialSeekAppliedRef.current) {
      return;
    }

    let resumeSeconds = initialResumeTimeRef.current;

    if (resumeSeconds <= 0 && totalDuration > 0 && initialResumeProgressRef.current > 0) {
      resumeSeconds = (initialResumeProgressRef.current / 100) * totalDuration;
    }

    if (resumeSeconds <= 0) {
      return;
    }

    const normalizedDuration = Number(totalDuration || 0);
    const clampedSeconds = normalizedDuration > 0
      ? clampNumber(resumeSeconds, 0, Math.max(normalizedDuration - 1, 0))
      : Math.max(0, resumeSeconds);

    seekToSeconds(clampedSeconds);
    initialSeekAppliedRef.current = true;
    setCurrentTime(clampedSeconds);

    if (normalizedDuration > 0) {
      setProgress((clampedSeconds / normalizedDuration) * 100);
    }
  }, []);

  useEffect(() => {
    if (!user || progressEntry || initialSeekAppliedRef.current) {
      return undefined;
    }

    let isMounted = true;

    const loadExistingProgress = async () => {
      try {
        const existingProgressEntries = await appClient.entities.UserProgress.filter(
          { user_id: user.id, content_id: content.id },
          '-last_watched',
          1
        );
        const existingProgress = existingProgressEntries?.[0];

        if (!isMounted || !existingProgress) {
          return;
        }

        progressRecordRef.current = existingProgress;
        initialResumeProgressRef.current = Number(existingProgress.progress_percent ?? 0);
        initialResumeTimeRef.current = Number(
          existingProgress.last_position_seconds
          ?? existingProgress.watch_time_seconds
          ?? 0
        );
        lastSavedProgressRef.current = initialResumeProgressRef.current;
        lastSavedPositionRef.current = initialResumeTimeRef.current;
        setProgress(initialResumeProgressRef.current);
        setCurrentTime(initialResumeTimeRef.current);

        if (isYouTubeAPIPlayer) {
          const player = playerInstanceRef.current;

          if (player && typeof player.seekTo === 'function') {
            const playerDuration = Number(player.getDuration?.() || 0);
            applyInitialSeek((seconds) => player.seekTo(seconds, true), playerDuration);
          }
        } else if (isHtml5PlayerWithVideoURL && videoRef.current && videoRef.current.readyState >= 1) {
          applyInitialSeek((seconds) => {
            videoRef.current.currentTime = seconds;
          }, Number(videoRef.current.duration || 0));
        }
      } catch (error) {
        console.error('Error loading existing progress:', error);
      }
    };

    loadExistingProgress();

    return () => {
      isMounted = false;
    };
  }, [applyInitialSeek, content.id, isHtml5PlayerWithVideoURL, isYouTubeAPIPlayer, progressEntry, user]);

  const getPlaybackSnapshot = useCallback(() => {
    if (isYouTubeAPIPlayer) {
      const player = playerInstanceRef.current;

      if (!player || typeof player.getCurrentTime !== 'function') {
        return null;
      }

      return {
        currentTime: Number(player.getCurrentTime() || 0),
        duration: Number(player.getDuration?.() || 0)
      };
    }

    if (isHtml5PlayerWithVideoURL && videoRef.current) {
      const video = videoRef.current;

      return {
        currentTime: Number(video.currentTime || 0),
        duration: Number(Number.isFinite(video.duration) ? video.duration : 0)
      };
    }

    return null;
  }, [isYouTubeAPIPlayer, isHtml5PlayerWithVideoURL]);

  const persistProgress = useCallback(async ({ force = false, markCompleted = false } = {}) => {
    const activeUser = userRef.current;

    if (!activeUser || !content?.id || isLiveContent || isExternalEmbed) {
      return null;
    }

    const snapshot = getPlaybackSnapshot();

    if (!snapshot) {
      return null;
    }

    const currentSeconds = Math.max(0, Number(snapshot.currentTime || 0));
    const durationSeconds = Math.max(0, Number(snapshot.duration || 0));
    let progressPercent = durationSeconds > 0
      ? (currentSeconds / durationSeconds) * 100
      : Number(progressStateRef.current || 0);

    const shouldMarkCompleted = markCompleted
      || (durationSeconds > 0 && currentSeconds >= Math.max(durationSeconds - 5, durationSeconds * 0.98));

    if (shouldMarkCompleted) {
      progressPercent = 100;
    }

    progressPercent = clampNumber(Number(progressPercent || 0), 0, 100);

    const completed = progressPercent >= 99.5;
    const positionSeconds = completed ? 0 : Math.round(currentSeconds);
    const normalizedProgress = Number(progressPercent.toFixed(2));

    if (!force && currentSeconds < MIN_PROGRESS_SAVE_SECONDS && !completed) {
      return progressRecordRef.current;
    }

    if (!force && !completed) {
      const progressDelta = Math.abs(normalizedProgress - Number(lastSavedProgressRef.current || 0));
      const timeDelta = Math.abs(positionSeconds - Number(lastSavedPositionRef.current || 0));

      if (progressDelta < MIN_PROGRESS_DELTA_PERCENT && timeDelta < MIN_PROGRESS_DELTA_SECONDS) {
        return progressRecordRef.current;
      }
    }

    if (saveInFlightRef.current) {
      try {
        await saveInFlightRef.current;
      } catch (error) {
        console.error('Previous progress save failed:', error);
      }
    }

    const payload = {
      user_id: activeUser.id,
      content_id: content.id,
      progress_percent: normalizedProgress,
      completed,
      last_watched: new Date().toISOString(),
      watch_time_seconds: Math.round(currentSeconds),
      last_position_seconds: positionSeconds
    };

    const pendingSave = (async () => {
      const savedRecord = progressRecordRef.current?.id
        ? await appClient.entities.UserProgress.update(progressRecordRef.current.id, payload)
        : await appClient.entities.UserProgress.create(payload);

      progressRecordRef.current = savedRecord;
      lastSavedProgressRef.current = Number(savedRecord.progress_percent ?? payload.progress_percent ?? 0);
      lastSavedPositionRef.current = Number(savedRecord.last_position_seconds ?? payload.last_position_seconds ?? 0);
      onProgressRef.current?.(savedRecord);

      return savedRecord;
    })();

    const finalizedSave = pendingSave.finally(() => {
      if (saveInFlightRef.current === finalizedSave) {
        saveInFlightRef.current = null;
      }
    });
    saveInFlightRef.current = finalizedSave;

    try {
      return await finalizedSave;
    } catch (error) {
      console.error('Error saving playback progress:', error);
      return null;
    }
  }, [content?.id, getPlaybackSnapshot, isExternalEmbed, isLiveContent]);

  const handlePlayerPause = useCallback(() => {
    setIsPlaying(false);
    persistProgress({ force: true }).catch((error) => {
      console.error('Error persisting progress on pause:', error);
    });
  }, [persistProgress]);

  const handlePlayerEnded = useCallback(() => {
    setIsPlaying(false);
    setProgress(100);
    persistProgress({ force: true, markCompleted: true }).catch((error) => {
      console.error('Error persisting completed progress:', error);
    });
  }, [persistProgress]);

  const onPlayerReady = useCallback((event) => {
    playerInstanceRef.current = event.target;
    event.target.setVolume(volumeRef.current);

    const playerDuration = Number(event.target.getDuration?.() || 0);
    setDuration(playerDuration);

    window.setTimeout(() => {
      if (playerDuration > 0) {
        applyInitialSeek((seconds) => event.target.seekTo(seconds, true), playerDuration);
      }

      if (autoPlay) {
        event.target.playVideo();
      }
    }, 150);
  }, [applyInitialSeek, autoPlay]);

  const onPlayerStateChange = useCallback((event) => {
    const YT = window.YT;

    if (!YT) {
      return;
    }

    if (event.data === YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      return;
    }

    if (event.data === YT.PlayerState.PAUSED) {
      handlePlayerPause();
      return;
    }

    if (event.data === YT.PlayerState.ENDED) {
      handlePlayerEnded();
    }
  }, [handlePlayerEnded, handlePlayerPause]);

  const createYouTubePlayer = useCallback((videoId) => {
    if (!window.YT || !window.YT.Player) {
      return;
    }

    playerInstanceRef.current = new window.YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId,
      playerVars: {
        autoplay: autoPlay ? 1 : 0,
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
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  }, [autoPlay, onPlayerReady, onPlayerStateChange]);

  useEffect(() => {
    if (isExternalEmbed) {
      const embedContainer = document.getElementById('embed-container');

      if (!embedContainer) {
        return undefined;
      }

      let processedEmbed = content.live_embed_code;

      if (isYouTubeUrl(processedEmbed)) {
        processedEmbed = processedEmbed.replace(/src="([^"]+)"/, (match, src) => {
          const url = new URL(src);
          url.searchParams.set('autoplay', autoPlay ? '1' : '0');
          url.searchParams.set('controls', '1');
          url.searchParams.set('modestbranding', '1');
          url.searchParams.set('rel', '0');
          url.searchParams.set('playsinline', '1');
          url.searchParams.set('enablejsapi', '1');
          return `src="${url.toString()}"`;
        });
      }

      if (processedEmbed.includes('wixstatic.com') || processedEmbed.includes('wix.com')) {
        processedEmbed = processedEmbed.replace(/src="([^"]+)"/, (match, src) => {
          const separator = src.includes('?') ? '&' : '?';
          return `src="${src}${separator}autoplay=${autoPlay ? 1 : 0}"`;
        });
      }

      if (isLiveContent) {
        processedEmbed = processedEmbed.replace(/allowfullscreen/g, '');
      }

      embedContainer.innerHTML = processedEmbed;

      const iframe = embedContainer.querySelector('iframe');

      if (iframe) {
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.removeAttribute('width');
        iframe.removeAttribute('height');

        if (isLiveContent) {
          iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
        } else {
          iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-forms');
        }
      }

      return () => {
        embedContainer.innerHTML = '';
      };
    }

    if (!isYouTubeAPIPlayer) {
      return undefined;
    }

    const videoId = extractYouTubeVideoId(content.video_url);

    if (!videoId) {
      return undefined;
    }

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = () => createYouTubePlayer(videoId);
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      createYouTubePlayer(videoId);
    }

    const updateProgressTimer = window.setInterval(() => {
      const player = playerInstanceRef.current;

      if (!player || typeof player.getCurrentTime !== 'function') {
        return;
      }

      const nextCurrentTime = Number(player.getCurrentTime() || 0);
      const nextDuration = Number(player.getDuration?.() || 0);

      setCurrentTime(nextCurrentTime);
      setDuration(nextDuration);

      if (nextDuration > 0) {
        setProgress((nextCurrentTime / nextDuration) * 100);
      }
    }, 1000);

    return () => {
      window.clearInterval(updateProgressTimer);

      const player = playerInstanceRef.current;

      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }

      playerInstanceRef.current = null;
    };
  }, [
    autoPlay,
    content.live_embed_code,
    content.video_url,
    createYouTubePlayer,
    isExternalEmbed,
    isLiveContent,
    isYouTubeAPIPlayer
  ]);

  useEffect(() => {
    if (!isHtml5PlayerWithVideoURL || !videoRef.current) {
      return undefined;
    }

    const video = videoRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);

      if (video.duration > 0) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      applyInitialSeek((seconds) => {
        video.currentTime = seconds;
      }, video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    if (autoPlay) {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.warn('Autoplay prevented:', error);
      });
    }

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [applyInitialSeek, autoPlay, isHtml5PlayerWithVideoURL]);

  useEffect(() => {
    if (!isPlaying || isExternalEmbed || isLiveContent) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      persistProgress().catch((error) => {
        console.error('Error persisting periodic progress:', error);
      });
    }, PROGRESS_SAVE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isExternalEmbed, isLiveContent, isPlaying, persistProgress]);

  useEffect(() => {
    return () => {
      window.clearTimeout(hideControlsTimeoutRef.current);
      persistProgress({ force: true }).catch((error) => {
        console.error('Error persisting progress on unmount:', error);
      });
    };
  }, [persistProgress]);

  const handleClose = async () => {
    await persistProgress({ force: true });
    onClose?.();
  };

  const togglePlay = () => {
    if (isYouTubeAPIPlayer) {
      const player = playerInstanceRef.current;

      if (!player) {
        return;
      }

      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }

      return;
    }

    if (isHtml5PlayerWithVideoURL && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.warn('Error playing HTML5 video:', error);
        });
      }
    }
  };

  const handleProgressClick = (event) => {
    if (!duration || duration === 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const time = percent * duration;

    if (isYouTubeAPIPlayer) {
      const player = playerInstanceRef.current;

      if (player && typeof player.seekTo === 'function') {
        player.seekTo(time, true);
      }
    } else if (isHtml5PlayerWithVideoURL && videoRef.current) {
      videoRef.current.currentTime = time;
    }

    setCurrentTime(time);
    setProgress(percent * 100);
  };

  const toggleMute = () => {
    if (isYouTubeAPIPlayer) {
      const player = playerInstanceRef.current;

      if (!player) {
        return;
      }

      if (player.isMuted()) {
        player.unMute();
        setIsMuted(false);
      } else {
        player.mute();
        setIsMuted(true);
      }

      return;
    }

    if (isHtml5PlayerWithVideoURL && videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (newVolume) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);

    if (isYouTubeAPIPlayer) {
      const player = playerInstanceRef.current;

      if (!player || typeof player.setVolume !== 'function') {
        return;
      }

      player.setVolume(volumeValue);

      if (volumeValue > 0 && player.isMuted()) {
        player.unMute();
        setIsMuted(false);
      } else if (volumeValue === 0 && !player.isMuted()) {
        player.mute();
        setIsMuted(true);
      }

      return;
    }

    if (isHtml5PlayerWithVideoURL && videoRef.current) {
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
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen error:', error);
    }
  };

  const handleMouseMove = () => {
    if (isExternalEmbed) {
      return;
    }

    setShowControls(true);
    window.clearTimeout(hideControlsTimeoutRef.current);
    hideControlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex">
      <div className="flex-1 relative video-player-container">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white"
        >
          <X className="w-5 h-5" />
        </Button>

        <div
          className="relative w-full h-full bg-black flex items-center justify-center"
          onMouseMove={handleMouseMove}
        >
          {isExternalEmbed ? (
            <div id="embed-container" className="w-full h-full" />
          ) : isYouTubeAPIPlayer ? (
            <div ref={playerContainerRef} id="youtube-player" className="w-full h-full" />
          ) : isHtml5PlayerWithVideoURL ? (
            <video
              ref={videoRef}
              className="max-w-full max-h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={handlePlayerPause}
              onEnded={handlePlayerEnded}
            >
              <source src={content.video_url} type="video/mp4" />
              Seu navegador nao suporta o elemento de video.
            </video>
          ) : (
            <div className="text-white text-center">
              <p>Conteudo nao disponivel</p>
            </div>
          )}

          {isLiveContent && isExternalEmbed && (
            <div
              className="absolute inset-0 z-10 bg-transparent"
              style={{
                pointerEvents: 'none',
                background: 'transparent'
              }}
              onClick={(event) => event.preventDefault()}
            />
          )}
        </div>

        <AnimatePresence>
          {showControls && !isExternalEmbed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6"
            >
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

              <div className="flex items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
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
                {isLiveContent ? 'Chat da live' : 'Comentarios'}
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
                  onChange={(event) => setNewComment(event.target.value)}
                  placeholder={isLiveContent ? 'Digite sua mensagem...' : 'Adicionar comentario...'}
                  className="bg-gray-800 border-gray-700 text-white"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleAddComment();
                    }
                  }}
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
