import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Loader2, Volume2, VolumeX, Maximize, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';

export default function LiveViewer({ hlsUrl }) {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const loadTimerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [showUnmuteOverlay, setShowUnmuteOverlay] = useState(true);
    const [retryCount, setRetryCount] = useState(0);
    const [debugState, setDebugState] = useState('Iniciando...');

    const logPlaybackError = async (message, details = null) => {
        console.error('[LiveViewer]', message, details);
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
            // silent
        }
    };

    useEffect(() => {
        if (!hlsUrl) {
            setIsLoading(false);
            setDebugState('Aguardando URL...');
            return;
        }

        if (!videoRef.current) return;

        setIsLoading(true);
        setHasError(false);
        setDebugState('Conectando ao stream...');

        const video = videoRef.current;
        video.muted = true;

        // Safety timeout: after 20s of loading, try to play anyway or show error
        loadTimerRef.current = setTimeout(() => {
            if (isLoading) {
                console.warn('[LiveViewer] Load timeout — tentando reproduzir mesmo assim');
                setDebugState('Timeout — tentando mesmo assim...');
                video.play().catch(() => {
                    setHasError(true);
                    setIsLoading(false);
                    setDebugState('Erro: timeout ao carregar');
                });
            }
        }, 20000);

        const onReady = () => {
            clearTimeout(loadTimerRef.current);
            setDebugState('Stream pronto — reproduzindo');
            setIsLoading(false);
            video.play().catch((err) => {
                console.warn('[LiveViewer] play() falhou:', err);
                setDebugState('Clique em Tocar Live para iniciar');
            });
        };

        // Safari / iOS — native HLS
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            setDebugState('Usando HLS nativo (Safari/iOS)');
            video.src = hlsUrl;
            video.addEventListener('loadedmetadata', onReady);
            video.addEventListener('error', (e) => {
                clearTimeout(loadTimerRef.current);
                const code = video.error?.code || 'unknown';
                const msg = video.error?.message || 'erro nativo';
                logPlaybackError('Native Video Error', { code, message: msg });
                setDebugState(`Erro nativo: ${msg}`);
                setHasError(true);
                setIsLoading(false);
            });
            return () => {
                clearTimeout(loadTimerRef.current);
                video.removeEventListener('loadedmetadata', onReady);
            };
        }

        // Chrome / Firefox / Edge — HLS.js
        if (Hls.isSupported()) {
            setDebugState('Usando HLS.js (Chrome/Android)');
            const hls = new Hls({
                lowLatencyMode: true,
                backBufferLength: 30,
                maxBufferLength: 60,
                manifestLoadingTimeOut: 15000,
                manifestLoadingMaxRetry: 3,
            });
            hlsRef.current = hls;
            hls.loadSource(hlsUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setDebugState('Manifesto OK — carregando segmentos');
                onReady();
            });

            hls.on(Hls.Events.MANIFEST_LOADING, () => {
                setDebugState('Buscando manifesto M3U8...');
            });

            hls.on(Hls.Events.LEVEL_LOADED, () => {
                setDebugState('Nível carregado — aguardando vídeo');
            });

            hls.on(Hls.Events.ERROR, (_event, data) => {
                console.warn('[LiveViewer] HLS error:', data.type, data.details, data.fatal);
                if (data.fatal) {
                    clearTimeout(loadTimerRef.current);
                    logPlaybackError('HLS.js Fatal Error', { type: data.type, details: data.details });
                    setDebugState(`Erro fatal: ${data.details}`);
                    setHasError(true);
                    setIsLoading(false);
                } else {
                    setDebugState(`Aviso HLS: ${data.details}`);
                }
            });

            return () => {
                clearTimeout(loadTimerRef.current);
                hls.destroy();
                hlsRef.current = null;
            };
        }

        // Browser doesn't support HLS at all
        logPlaybackError('HLS Unsupported', { ua: navigator.userAgent });
        setDebugState('Navegador não suporta HLS');
        setHasError(true);
        setIsLoading(false);
    }, [hlsUrl, retryCount]);

    const unmute = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            setIsMuted(false);
            setShowUnmuteOverlay(false);
            setDebugState('Reproduzindo com som');
            videoRef.current.play().catch(e => console.warn('Play failed on unmute:', e));
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            const next = !isMuted;
            videoRef.current.muted = next;
            setIsMuted(next);
            if (!next) {
                setShowUnmuteOverlay(false);
                videoRef.current.play().catch(e => console.warn('Play failed on toggle:', e));
            }
        }
    };

    const enterFullscreen = () => {
        videoRef.current?.requestFullscreen?.();
    };

    const retry = () => {
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }
        setRetryCount(c => c + 1);
        setHasError(false);
        setIsLoading(true);
        setShowUnmuteOverlay(true);
        setIsMuted(true);
        setDebugState('Tentando novamente...');
    };

    return (
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-red-500/20 group">

            {/* Waiting for URL */}
            {!hlsUrl && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-20">
                    <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
                    <p className="text-gray-300 font-bold mb-2">A live está iniciando, aguarde...</p>
                    <p className="text-gray-500 text-sm">Estamos recebendo o vídeo do estúdio.</p>
                </div>
            )}

            {/* Loading overlay */}
            <AnimatePresence>
                {isLoading && !hasError && !!hlsUrl && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-20"
                    >
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-30 animate-pulse" />
                            <Loader2 className="w-16 h-16 text-red-400 animate-spin relative z-10" />
                        </div>
                        <p className="text-white font-bold text-lg">Carregando transmissão...</p>
                        <p className="text-gray-400 text-sm mt-2 px-4 text-center">{debugState}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error overlay */}
            {hasError && !!hlsUrl && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-20">
                    <Radio className="w-12 h-12 text-gray-600 mb-4" />
                    <p className="text-red-400 font-bold mb-1 text-center px-4">Não foi possível reproduzir a live.</p>
                    <p className="text-gray-500 text-xs mb-1 text-center px-8">{debugState}</p>
                    <p className="text-gray-600 text-xs mb-6 text-center px-8">Instabilidade temporária. Tente novamente.</p>
                    <Button onClick={retry} className="bg-red-600 hover:bg-red-700 text-white font-bold">
                        <RefreshCw className="w-4 h-4 mr-2" /> Tentar novamente
                    </Button>
                </div>
            )}

            {/* TAP TO UNMUTE overlay */}
            <AnimatePresence>
                {showUnmuteOverlay && !isLoading && !hasError && !!hlsUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={unmute}
                        className="absolute inset-0 flex flex-col items-center justify-center z-30 cursor-pointer bg-black/60"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
                                <VolumeX className="w-11 h-11 text-white" />
                            </div>
                            <p className="text-white font-black text-xl drop-shadow-lg">Toque para assistir a Live</p>
                            <p className="text-white/60 text-sm">A transmissão está ao vivo agora</p>
                            <Button
                                onClick={(e) => { e.stopPropagation(); unmute(); }}
                                className="bg-red-600 hover:bg-red-700 text-white font-black text-lg py-6 px-10 rounded-full shadow-2xl mt-2"
                            >
                                ▶ Tocar Live
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video element */}
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                controls={false}
                muted
                onWaiting={() => setDebugState('Buffering...')}
                onPlaying={() => setDebugState('Reproduzindo')}
                onCanPlay={() => setDebugState('Pronto')}
            />

            {/* Live badge */}
            <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white flex items-center gap-2 px-3 py-1.5 shadow-2xl shadow-red-500/50 border border-red-400/30 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    AO VIVO
                </Badge>
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 md:block hidden">
                <div className="flex items-center justify-between">
                    <Button size="icon" variant="ghost" onClick={toggleMute} className="text-white hover:bg-white/20 rounded-xl w-9 h-9">
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={enterFullscreen} className="text-white hover:bg-white/20 rounded-xl w-9 h-9">
                        <Maximize className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Mobile always-visible controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent z-10 md:hidden">
                <div className="flex items-center justify-between">
                    <Button size="icon" variant="ghost" onClick={toggleMute} className="text-white hover:bg-white/20 rounded-xl w-10 h-10">
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={enterFullscreen} className="text-white hover:bg-white/20 rounded-xl w-10 h-10">
                        <Maximize className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
