import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Loader2, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';

export default function LiveViewer({ hlsUrl }) {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    // Always start muted to respect browser autoplay policy
    const [isMuted, setIsMuted] = useState(true);
    // Show tap-to-unmute overlay until user interacts
    const [showUnmuteOverlay, setShowUnmuteOverlay] = useState(true);
    const [retryCount, setRetryCount] = useState(0);

    const logPlaybackError = async (message, details = null) => {
        try {
            const user = await base44.auth.me();
            await base44.entities.LivePlaybackLogs.create({
                userId: user?.id || 'anonymous',
                device_info: navigator.userAgent,
                live_hls_url: hlsUrl || 'empty',
                error_message: message,
                error_details: details ? JSON.stringify(details) : ''
            });
        } catch (e) {
            console.warn('Could not log playback error:', e);
        }
    };

    useEffect(() => {
        if (!hlsUrl) {
            setIsLoading(false);
            setHasError(false);
            // It will show the "A live está iniciando" state
            return;
        }

        if (!videoRef.current) return;

        setIsLoading(true);
        setHasError(false);

        const video = videoRef.current;
        // Always start muted so browser allows autoplay
        video.muted = true;

        const onReady = () => {
            setIsLoading(false);
            // Play muted — this always succeeds with modern browsers
            video.play().catch((err) => {
                console.warn('[LiveViewer] play() failed even muted:', err);
            });
        };

        // Try native HLS first (Safari / iOS)
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = hlsUrl;
            video.addEventListener('loadedmetadata', onReady);
            video.addEventListener('error', (e) => {
                const errCode = video.error ? video.error.code : 'unknown';
                const errMsg = video.error ? video.error.message : 'Video native error';
                console.error('[LiveViewer] Native error', errCode, errMsg);
                logPlaybackError('Native Video Error', { code: errCode, message: errMsg });
                setHasError(true);
            });
            return () => {
                video.removeEventListener('loadedmetadata', onReady);
            };
        }

        // Use hls.js for Chrome / Firefox / Edge
        if (Hls.isSupported()) {
            const hls = new Hls({
                lowLatencyMode: true,
                backBufferLength: 30,
                maxBufferLength: 60,
            });
            hlsRef.current = hls;
            hls.loadSource(hlsUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, onReady);

            hls.on(Hls.Events.ERROR, (_event, data) => {
                if (data.fatal) {
                    console.error('[LiveViewer] HLS fatal error:', data);
                    logPlaybackError('HLS.js Fatal Error', { type: data.type, details: data.details });
                    setHasError(true);
                }
            });

            return () => {
                hls.destroy();
                hlsRef.current = null;
            };
        }

        logPlaybackError('HLS Unsupported', { message: 'Browser does not support HLS or HLS.js' });
        setHasError(true); // browser doesn't support HLS at all
    }, [hlsUrl, retryCount]);

    const unmute = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            setIsMuted(false);
            setShowUnmuteOverlay(false);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            const next = !isMuted;
            videoRef.current.muted = next;
            setIsMuted(next);
            if (!next) setShowUnmuteOverlay(false);
        }
    };

    const enterFullscreen = () => {
        videoRef.current?.requestFullscreen?.();
    };

    const retry = () => {
        setRetryCount(c => c + 1);
        setHasError(false);
        setIsLoading(true);
        setShowUnmuteOverlay(true);
        setIsMuted(true);
    };

    return (
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-red-500/20 group">

            {/* Waiting for URL overlay */}
            {!hlsUrl && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-20">
                    <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
                    <p className="text-gray-300 font-bold mb-2">A live está iniciando, aguarde alguns segundos...</p>
                    <p className="text-gray-500 text-sm mb-6">Estamos recebendo o vídeo do estúdio.</p>
                </div>
            )}

            {/* Loading overlay */}
            <AnimatePresence>
                {isLoading && !hasError && !!hlsUrl && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-950 to-black z-20"
                    >
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-30 animate-pulse" />
                            <Loader2 className="w-16 h-16 text-red-400 animate-spin relative z-10" />
                        </div>
                        <p className="text-white font-bold text-lg">Carregando live...</p>
                        <p className="text-gray-400 text-sm mt-2">Aguarde enquanto carregamos o stream</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error overlay */}
            {hasError && !!hlsUrl && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-20">
                    <Radio className="w-12 h-12 text-gray-600 mb-4" />
                    <p className="text-red-400 font-bold mb-2 text-center px-4">Não foi possível reproduzir a live. Tente novamente.</p>
                    <p className="text-gray-500 text-sm mb-6 text-center px-4">Pode ser uma instabilidade temporária na rede.</p>
                    <Button onClick={retry} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        🔄 Tentar novamente
                    </Button>
                </div>
            )}

            {/* ── TAP TO UNMUTE overlay — shown until user taps ── */}
            <AnimatePresence>
                {showUnmuteOverlay && !isLoading && !hasError && !!hlsUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={unmute}
                        className="absolute inset-0 flex flex-col items-center justify-center z-30 cursor-pointer"
                    >
                        {/* Frosted overlay - subtle, video still visible */}
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

                        <motion.div
                            animate={{ scale: [1, 1.06, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="relative flex flex-col items-center gap-3"
                        >
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30 shadow-2xl">
                                <VolumeX className="w-9 h-9 text-white" />
                            </div>
                            <Button
                                onClick={(e) => { e.stopPropagation(); unmute(); }}
                                className="bg-red-600 hover:bg-red-700 text-white font-black text-lg py-6 px-8 rounded-full shadow-2xl shadow-red-500/30"
                            >
                                ▶ Tocar Live
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video element — always muted initially */}
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                controls={false}
                muted
            />

            {/* Live badge */}
            <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white flex items-center gap-2 px-3 py-1.5 shadow-2xl shadow-red-500/50 border border-red-400/30 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    AO VIVO
                </Badge>
            </div>

            {/* Controls overlay (hover on desktop, always visible on mobile) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="flex items-center justify-between">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={toggleMute}
                        className="text-white hover:bg-white/20 rounded-xl w-9 h-9"
                    >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={enterFullscreen}
                        className="text-white hover:bg-white/20 rounded-xl w-9 h-9"
                    >
                        <Maximize className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
