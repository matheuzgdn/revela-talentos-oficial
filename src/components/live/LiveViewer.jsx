import React, { useEffect, useRef, useState } from 'react';
import {
    HMSRoomProvider,
    useHMSActions,
    useHMSStore,
    useHMSNotifications,
    HMSNotificationTypes,
    selectIsConnectedToRoom,
    selectRemotePeers,
    selectHMSMessages,
    selectPeerCount,
} from '@100mslive/react-sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, VolumeX, Volume2, RefreshCw, Send, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateHmsToken } from '@/lib/hmsUtils';

// ─── Avatar helper ─────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
    'from-rose-500 to-pink-600', 'from-blue-500 to-cyan-500',
    'from-emerald-500 to-green-600', 'from-violet-500 to-purple-600',
    'from-orange-500 to-amber-500',
];

function PeerAvatar({ name = '?', avatarUrl, size = 'sm' }) {
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
    const colorClass = AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
    const sizeClass = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm' }[size] || 'w-7 h-7 text-xs';
    return (
        <div className={`${sizeClass} rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center font-black text-white flex-shrink-0 overflow-hidden`}>
            {avatarUrl ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" /> : <span>{initials}</span>}
        </div>
    );
}

// ─── Inner viewer component ────────────────────────────────────────────────────
function ViewerControls({ user }) {
    const hmsActions = useHMSActions();
    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const remotePeers = useHMSStore(selectRemotePeers);
    const messages = useHMSStore(selectHMSMessages);
    const autoplayNotif = useHMSNotifications(HMSNotificationTypes.AUTOPLAY_ERROR);

    const videoRef = useRef(null);
    const hasUnblockedRef = useRef(false);

    const [isJoining, setIsJoining] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isAudioBlocked, setIsAudioBlocked] = useState(true);
    const [debugState, setDebugState] = useState('Iniciando...');
    const [chatInput, setChatInput] = useState('');
    const [visibleMessages, setVisibleMessages] = useState([]);
    const [isLandscape, setIsLandscape] = useState(false);
    const chatEndRef = useRef(null);

    // Rotation detection
    useEffect(() => {
        const detectOrientation = () => {
            const angle = window?.screen?.orientation?.angle ?? 0;
            setIsLandscape(angle === 90 || angle === 270 || angle === -90);
        };
        detectOrientation();
        window.screen?.orientation?.addEventListener('change', detectOrientation);
        window.addEventListener('resize', detectOrientation);
        return () => {
            window.screen?.orientation?.removeEventListener('change', detectOrientation);
            window.removeEventListener('resize', detectOrientation);
        };
    }, []);

    // Autoplay block detection
    useEffect(() => {
        if (!autoplayNotif) return;
        if (hasUnblockedRef.current) {
            hmsActions.unblockAudio().catch(() => { });
        } else {
            setIsAudioBlocked(true);
        }
    }, [autoplayNotif]);

    // Scrolling chat — keep last 20 messages visible with fade-out
    useEffect(() => {
        setVisibleMessages(messages.slice(-20));
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Join room as viewer-realtime
    useEffect(() => {
        const join = async () => {
            if (isJoining) return;
            setIsJoining(true);
            setDebugState('Gerando token...');
            try {
                const userId = user?.id || user?.email || ('viewer-' + Date.now());
                const token = await generateHmsToken('viewer-realtime', userId);
                const metaData = JSON.stringify({
                    avatar: user?.profile_photo_url || user?.avatar_url || '',
                });
                setDebugState('Conectando...');
                await hmsActions.join({
                    userName: user?.full_name || user?.email || 'Espectador',
                    authToken: token,
                    metaData,
                    settings: { isAudioMuted: true, isVideoMuted: true },
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
        return () => { hmsActions.leave().catch(() => { }); };
    }, []);

    // Find broadcaster's video track
    const broadcaster = remotePeers.find(p =>
        p.roleName === 'broadcaster' || p.roleName === 'co-broadcaster'
    );
    const videoTrackId = broadcaster?.videoTrack;

    // Attach broadcaster video
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

    // Unblock audio
    const handleUnmute = async () => {
        hasUnblockedRef.current = true;
        try { await hmsActions.unblockAudio(); } catch { }
        setIsAudioBlocked(false);
    };

    // Send chat message
    const sendMessage = async () => {
        const text = chatInput.trim();
        if (!text || !isConnected) return;
        try {
            await hmsActions.sendBroadcastMessage(text);
            setChatInput('');
        } catch (e) {
            console.error('[LiveViewer] sendMessage error:', e);
        }
    };

    const viewerCount = remotePeers.filter(p => p.roleName?.includes('viewer')).length + 1; // +1 for self
    const isLoading = !isConnected || !videoTrackId;

    // ── Full-screen landscape
    const containerClass = isLandscape
        ? 'fixed inset-0 z-50 bg-black'
        : 'relative w-full';

    const videoContainerClass = isLandscape
        ? 'w-full h-full'
        : 'w-full aspect-[9/16] md:aspect-video';

    return (
        <div className={containerClass}>
            {/* ─ Video container ─ */}
            <div className={`${videoContainerClass} relative bg-black overflow-hidden rounded-3xl shadow-2xl shadow-black/80 ${isLandscape ? 'rounded-none' : ''}`}>

                {/* Loading overlay */}
                <AnimatePresence>
                    {isLoading && !hasError && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20"
                        >
                            <div className="relative mb-5">
                                <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-25 animate-pulse" />
                                <Loader2 className="w-14 h-14 text-red-400 animate-spin relative z-10" />
                            </div>
                            <p className="text-white font-bold">Conectando à transmissão...</p>
                            <p className="text-gray-500 text-sm mt-1">{debugState}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error overlay */}
                {hasError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
                        <p className="text-red-400 font-bold mb-1">Não foi possível conectar</p>
                        <p className="text-gray-600 text-xs mb-6 px-8 text-center">{errorMsg}</p>
                        <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
                            <RefreshCw className="w-4 h-4 mr-2" /> Recarregar
                        </Button>
                    </div>
                )}

                {/* Unmute overlay */}
                <AnimatePresence>
                    {!isLoading && !hasError && isAudioBlocked && (
                        <motion.div
                            key="unmute"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={handleUnmute}
                            className="absolute inset-0 z-30 flex flex-col items-center justify-center cursor-pointer bg-black/65"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.06, 1] }}
                                transition={{ duration: 1.6, repeat: Infinity }}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/40">
                                    <VolumeX className="w-9 h-9 text-white" />
                                </div>
                                <p className="text-white font-black text-xl drop-shadow-lg">Toque para assistir</p>
                                <p className="text-white/50 text-sm">A transmissão está ao vivo</p>
                                <button
                                    onClick={handleUnmute}
                                    className="bg-red-600 hover:bg-red-500 text-white font-black text-base px-10 py-4 rounded-full shadow-2xl mt-1 transition-colors"
                                >
                                    ▶ Tocar Live
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Broadcaster video */}
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

                {/* ─ Top HUD ─ */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                    <span className="bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        AO VIVO
                    </span>
                    <span className="bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                        <Eye className="w-3 h-3" />
                        {viewerCount}
                    </span>
                </div>

                {/* ─ Floating chat overlay (bottom-left) ─ */}
                {!isLoading && !hasError && !isAudioBlocked && (
                    <div className="absolute bottom-[72px] left-3 right-16 z-10 flex flex-col gap-1.5 max-h-48 overflow-hidden pointer-events-none">
                        <AnimatePresence initial={false}>
                            {visibleMessages.map((msg, i) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: -20, y: 10 }}
                                    animate={{ opacity: i >= visibleMessages.length - 3 ? 1 : 0.5, x: 0, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="flex items-start gap-2"
                                >
                                    <PeerAvatar name={msg.senderName || '?'} size="sm" />
                                    <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-3 py-1.5 max-w-full">
                                        <span className="text-cyan-300 text-xs font-black">
                                            {msg.senderName?.split(' ')[0] || 'Admin'}
                                        </span>
                                        <span className="text-white text-xs ml-1">{msg.message}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={chatEndRef} />
                    </div>
                )}

                {/* ─ Volume button ─ */}
                {!isAudioBlocked && !isLoading && (
                    <button
                        onClick={() => { hasUnblockedRef.current = false; setIsAudioBlocked(true); }}
                        className="absolute bottom-20 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-md border border-white/15 rounded-full flex items-center justify-center transition-all active:scale-90"
                    >
                        <Volume2 className="w-4 h-4 text-white" />
                    </button>
                )}

                {/* ─ Chat input bar ─ */}
                {!isLoading && !hasError && !isAudioBlocked && isConnected && (
                    <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center gap-2">
                        <input
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            placeholder="Comentar..."
                            className="flex-1 bg-black/55 backdrop-blur-md border border-white/15 rounded-full px-4 py-2.5 text-white text-sm placeholder-white/40 outline-none focus:border-white/30 transition-colors"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!chatInput.trim()}
                            className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center disabled:opacity-30 shadow-lg transition-all active:scale-90"
                        >
                            <Send className="w-3.5 h-3.5 text-white" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main exported component ───────────────────────────────────────────────────
export default function LiveViewer({ user }) {
    return (
        <HMSRoomProvider>
            <ViewerControls user={user} />
        </HMSRoomProvider>
    );
}
