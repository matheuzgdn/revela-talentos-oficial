import React, { useEffect, useRef, useState } from 'react';
import {
    HMSRoomProvider,
    useHMSActions,
    useHMSStore,
    useHMSNotifications,
    HMSNotificationTypes,
    selectIsConnectedToRoom,
    selectRemotePeers,
} from '@100mslive/react-sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Loader2, VolumeX, Volume2, RefreshCw, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateHmsToken } from '@/lib/hmsUtils';

// ─── Inner viewer (needs HMSRoomProvider context) ──────────────────────────────
function ViewerControls({ user }) {
    const hmsActions = useHMSActions();
    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const remotePeers = useHMSStore(selectRemotePeers);
    const autoplayNotif = useHMSNotifications(HMSNotificationTypes.AUTOPLAY_ERROR);

    const videoRef = useRef(null);
    const hasUnblockedRef = useRef(false); // tracks if user already clicked overlay
    const [isJoining, setIsJoining] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isAudioBlocked, setIsAudioBlocked] = useState(true); // Start assuming blocked (safe default)
    const [debugState, setDebugState] = useState('Iniciando...');

    // Detect browser autoplay block
    useEffect(() => {
        if (!autoplayNotif) return;
        if (hasUnblockedRef.current) {
            // User already clicked once — silently re-unblock without showing overlay
            hmsActions.unblockAudio().catch(() => { });
        } else {
            console.warn('[LiveViewer] Autoplay blocked — user gesture needed');
            setIsAudioBlocked(true);
        }
    }, [autoplayNotif]);

    // Join room as viewer-realtime
    useEffect(() => {
        const join = async () => {
            if (isJoining) return;
            setIsJoining(true);
            setDebugState('Gerando token...');
            try {
                const userId = user?.id || user?.email || ('viewer-' + Date.now());
                const token = await generateHmsToken('viewer-realtime', userId);
                setDebugState('Conectando ao servidor 100ms...');
                await hmsActions.join({
                    userName: user?.full_name || user?.email || 'Espectador',
                    authToken: token,
                    settings: {
                        isAudioMuted: true,  // own mic muted (viewer doesn't broadcast)
                        isVideoMuted: true,  // own camera off
                    },
                });
                setDebugState('Aguardando broadcaster...');
            } catch (err) {
                console.error('[LiveViewer] Join error:', err);
                setHasError(true);
                setErrorMsg(err?.message || 'Falha ao conectar');
            } finally {
                setIsJoining(false);
            }
        };
        join();

        return () => {
            hmsActions.leave().catch(() => { });
        };
    }, []);

    // Find broadcaster peer + their video track
    const broadcaster = remotePeers.find(p =>
        p.roleName === 'broadcaster' || p.roleName === 'co-broadcaster'
    );
    const videoTrackId = broadcaster?.videoTrack;

    // Attach broadcaster's video track to the <video> element
    useEffect(() => {
        if (!videoRef.current || !videoTrackId) return;
        hmsActions.attachVideo(videoTrackId, videoRef.current);
        setDebugState('Reproduzindo');
        return () => {
            if (videoRef.current && videoTrackId) {
                hmsActions.detachVideo(videoTrackId, videoRef.current).catch(() => { });
            }
        };
    }, [videoTrackId]);

    // Unblock audio after user gesture — remember permanently via ref
    const handleUnmute = async () => {
        hasUnblockedRef.current = true;
        try {
            await hmsActions.unblockAudio();
        } catch (e) {
            console.warn('[LiveViewer] unblockAudio failed:', e);
        }
        setIsAudioBlocked(false);
    };

    const isLoading = !isConnected || !videoTrackId;

    return (
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-red-500/20">

            {/* Loading overlay */}
            <AnimatePresence>
                {isLoading && !hasError && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-20"
                    >
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-30 animate-pulse" />
                            <Loader2 className="w-16 h-16 text-red-400 animate-spin relative z-10" />
                        </div>
                        <p className="text-white font-bold text-lg">Conectando à transmissão...</p>
                        <p className="text-gray-400 text-sm mt-2 px-4 text-center">{debugState}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error overlay */}
            {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-20">
                    <Wifi className="w-12 h-12 text-gray-600 mb-4" />
                    <p className="text-red-400 font-bold mb-1 text-center px-4">
                        Não foi possível conectar à live.
                    </p>
                    <p className="text-gray-500 text-xs mb-6 text-center px-8">{errorMsg}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" /> Recarregar
                    </Button>
                </div>
            )}

            {/* TAP TO PLAY overlay — shown until user clicks (audio unblock) */}
            <AnimatePresence>
                {!isLoading && !hasError && isAudioBlocked && (
                    <motion.div
                        key="unmute"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleUnmute}
                        className="absolute inset-0 flex flex-col items-center justify-center z-30 cursor-pointer bg-black/70"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40">
                                <VolumeX className="w-11 h-11 text-white" />
                            </div>
                            <p className="text-white font-black text-xl drop-shadow-lg">
                                Toque para assistir a Live
                            </p>
                            <p className="text-white/60 text-sm">A transmissão está ao vivo agora</p>
                            <Button
                                onClick={(e) => { e.stopPropagation(); handleUnmute(); }}
                                className="bg-red-600 hover:bg-red-700 text-white font-black text-lg py-6 px-10 rounded-full shadow-2xl mt-2"
                            >
                                ▶ Tocar Live
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mute button when audio is unblocked */}
            {!isAudioBlocked && !isLoading && !hasError && (
                <button
                    onClick={() => {
                        hmsActions.setVolume(0);
                        setIsAudioBlocked(true);
                    }}
                    className="absolute bottom-14 right-4 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2.5 border border-white/20 transition-all"
                    title="Silenciar"
                >
                    <Volume2 className="w-5 h-5" />
                </button>
            )}

            {/* Video element — shows broadcaster's WebRTC video */}
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
            />

            {/* LIVE badge */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white flex items-center gap-2 px-3 py-1.5 shadow-2xl shadow-red-500/50 border border-red-400/30 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    AO VIVO
                </Badge>
            </div>
        </div>
    );
}

// ─── Main exported component — wraps with HMSRoomProvider ──────────────────────
export default function LiveViewer({ user }) {
    return (
        <HMSRoomProvider>
            <ViewerControls user={user} />
        </HMSRoomProvider>
    );
}
