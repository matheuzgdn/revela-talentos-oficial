import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Loader2, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function LiveViewer({ hlsUrl }) {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (!hlsUrl || !videoRef.current) return;

        setIsLoading(true);
        setHasError(false);

        const video = videoRef.current;

        // Try native HLS first (Safari)
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = hlsUrl;
            video.addEventListener('loadedmetadata', () => setIsLoading(false));
            video.addEventListener('error', () => setHasError(true));
            return;
        }

        // Use hls.js for other browsers
        if (Hls.isSupported()) {
            const hls = new Hls({
                lowLatencyMode: true,
                backBufferLength: 30,
                maxBufferLength: 60,
            });
            hlsRef.current = hls;

            hls.loadSource(hlsUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setIsLoading(false);
                video.play().catch(() => { });
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.error('HLS fatal error:', data);
                    setHasError(true);
                }
            });

            return () => {
                hls.destroy();
                hlsRef.current = null;
            };
        }
    }, [hlsUrl, retryCount]);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const enterFullscreen = () => {
        if (videoRef.current) {
            videoRef.current.requestFullscreen?.();
        }
    };

    const retry = () => {
        setRetryCount(c => c + 1);
        setHasError(false);
        setIsLoading(true);
    };

    return (
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-red-500/20 group">
            {/* Loading overlay */}
            <AnimatePresence>
                {isLoading && !hasError && (
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
                        <p className="text-white font-bold text-lg">Conectando à live...</p>
                        <p className="text-gray-400 text-sm mt-2">Aguarde enquanto carregamos o stream</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error overlay */}
            {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-20">
                    <Radio className="w-12 h-12 text-gray-600 mb-4" />
                    <p className="text-gray-300 font-bold mb-2">Stream temporariamente indisponível</p>
                    <p className="text-gray-500 text-sm mb-6">O stream pode estar sendo preparado</p>
                    <Button onClick={retry} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        Tentar novamente
                    </Button>
                </div>
            )}

            {/* Video element */}
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                controls={false}
                muted={isMuted}
            />

            {/* Live badge */}
            <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white flex items-center gap-2 px-3 py-1.5 shadow-2xl shadow-red-500/50 border border-red-400/30 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    AO VIVO
                </Badge>
            </div>

            {/* Controls overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={toggleMute}
                            className="text-white hover:bg-white/20 rounded-xl w-9 h-9"
                        >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                    </div>
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
