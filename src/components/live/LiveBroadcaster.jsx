import React, { useEffect, useRef, useState } from 'react';
import {
    HMSRoomProvider,
    useHMSActions,
    useHMSStore,
    useHMSNotifications,
    HMSNotificationTypes,
    selectIsConnectedToRoom,
    selectLocalVideoTrackID,
    selectHLSState,
    selectRemotePeers,
    selectIsLocalVideoEnabled,
    selectIsLocalAudioEnabled,
    selectHMSMessages,
} from '@100mslive/react-sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { generateHmsToken, HMS_MEETING_URL } from '@/lib/hmsUtils';
import { notifyLiveSession } from '@/components/admin/NotificationSystem';
import {
    Radio, Video, VideoOff, Mic, MicOff,
    Loader2, Users, StopCircle, RefreshCcw,
    X, Send, ChevronDown, MessageSquare,
    Eye, AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Avatar helper ─────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
    'from-rose-500 to-pink-600',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-green-600',
    'from-violet-500 to-purple-600',
    'from-orange-500 to-amber-500',
    'from-red-500 to-rose-600',
];

function PeerAvatar({ name = '?', avatarUrl, size = 'md' }) {
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
    const colorClass = AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
    const sizeClass = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' }[size];
    return (
        <div className={`${sizeClass} rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center font-black text-white border-2 border-black/60 shadow-md overflow-hidden flex-shrink-0`}>
            {avatarUrl
                ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                : <span>{initials}</span>
            }
        </div>
    );
}

// ─── Error handler inside HMSRoomProvider ──────────────────────────────────────
function HMSErrorListener() {
    const notification = useHMSNotifications(HMSNotificationTypes.ERROR);
    useEffect(() => {
        if (notification) {
            console.error('[100ms]', notification.data);
            toast.error(`❌ ${notification.data?.message || 'Erro no servidor de live'}`);
        }
    }, [notification]);
    return null;
}

// ─── Bottom sheet: Viewers ─────────────────────────────────────────────────────
function ViewersSheet({ viewers, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                className="relative w-full bg-[#111] border-t border-white/10 rounded-t-3xl overflow-hidden"
            >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 bg-white/20 rounded-full" />
                </div>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                    <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-black">
                            {viewers.length > 0 ? `${viewers.length} assistindo agora` : 'Nenhum espectador ainda'}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {/* Viewers grid */}
                <div className="max-h-72 overflow-y-auto px-4 py-4">
                    {viewers.length === 0 ? (
                        <p className="text-gray-600 text-center py-8 text-sm">Aguardando espectadores...</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {viewers.map(peer => {
                                const meta = (() => { try { return JSON.parse(peer.metadata || '{}'); } catch { return {}; } })();
                                return (
                                    <div key={peer.id} className="flex items-center gap-3 bg-white/5 rounded-2xl p-3">
                                        <PeerAvatar name={peer.name} avatarUrl={meta.avatar} size="sm" />
                                        <span className="text-white text-sm font-medium truncate">{peer.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Bottom sheet: Comments / Chat ─────────────────────────────────────────────
function CommentsSheet({ messages, hmsActions, onClose }) {
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    const send = async () => {
        const text = input.trim();
        if (!text) return;
        try {
            await hmsActions.sendBroadcastMessage(text);
            setInput('');
        } catch (e) {
            console.error('[Live] send message error:', e);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                className="relative w-full bg-[#111] border-t border-white/10 rounded-t-3xl flex flex-col max-h-[72vh]"
            >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                    <div className="w-10 h-1 bg-white/20 rounded-full" />
                </div>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-white/8 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                        <span className="text-white font-black">Comentários ao vivo</span>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                    {messages.length === 0
                        ? <p className="text-gray-600 text-center py-10 text-sm">Nenhum comentário ainda...</p>
                        : messages.map(msg => (
                            <div key={msg.id} className="flex items-start gap-3">
                                <PeerAvatar name={msg.senderName || 'Admin'} size="sm" />
                                <div className="min-w-0">
                                    <p className="text-cyan-400 text-xs font-bold leading-none mb-1">
                                        {msg.senderName || 'Admin'}
                                    </p>
                                    <p className="text-white text-sm break-words leading-snug">{msg.message}</p>
                                </div>
                            </div>
                        ))
                    }
                    <div ref={bottomRef} />
                </div>
                {/* Input */}
                <div className="flex items-center gap-3 px-4 pb-6 pt-3 border-t border-white/8 flex-shrink-0">
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()}
                        placeholder="Diga algo aos atletas..."
                        className="flex-1 bg-white/8 border border-white/15 rounded-full px-5 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-purple-500/60 transition-colors"
                    />
                    <button
                        onClick={send}
                        disabled={!input.trim()}
                        className="w-11 h-11 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center disabled:opacity-30 shadow-lg shadow-purple-500/30 transition-opacity active:scale-95"
                    >
                        <Send className="w-4 h-4 text-white" />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Inner studio component ────────────────────────────────────────────────────
function BroadcasterStudio({ user }) {
    const hmsActions = useHMSActions();
    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const localVideoTrackId = useHMSStore(selectLocalVideoTrackID);
    const hlsState = useHMSStore(selectHLSState);
    const remotePeers = useHMSStore(selectRemotePeers);
    const isVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);
    const isAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
    const messages = useHMSStore(selectHMSMessages);

    const videoRef = useRef(null);
    const prevMsgCountRef = useRef(0);

    const [isJoining, setIsJoining] = useState(false);
    const [isStartingLive, setIsStartingLive] = useState(false);
    const [isStoppingLive, setIsStoppingLive] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [deviceInUse, setDeviceInUse] = useState(false);
    const [isFrontCamera, setIsFrontCamera] = useState(true);
    const [showViewers, setShowViewers] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [newCommentDot, setNewCommentDot] = useState(0);
    const [liveSeconds, setLiveSeconds] = useState(0);

    // Live timer
    useEffect(() => {
        if (!isLive) { setLiveSeconds(0); return; }
        const t = setInterval(() => setLiveSeconds(s => s + 1), 1000);
        return () => clearInterval(t);
    }, [isLive]);

    const formatTime = s =>
        `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    // New comment badge
    useEffect(() => {
        if (messages.length > prevMsgCountRef.current && !showComments) {
            setNewCommentDot(n => n + messages.length - prevMsgCountRef.current);
        }
        prevMsgCountRef.current = messages.length;
    }, [messages.length]);
    useEffect(() => { if (showComments) setNewCommentDot(0); }, [showComments]);

    // Viewers = remote peers with viewer role
    const viewers = remotePeers.filter(p =>
        p.roleName?.includes('viewer')
    );

    // ─── Platform Settings helpers ────────────────────────────────────────────
    const upsertSetting = async (key, value) => {
        const all = await base44.entities.PlatformSettings.list();
        const existing = all.find(s => s.setting_key === key);
        if (existing) {
            await base44.entities.PlatformSettings.update(existing.id, { setting_value: String(value) });
        } else {
            await base44.entities.PlatformSettings.create({ setting_key: key, setting_value: String(value) });
        }
    };

    const saveLiveStatus = async (active, hlsUrl = '') => {
        try {
            await upsertSetting('is_live', String(active));
            await upsertSetting('is_live_active', String(active));
            if (active && hlsUrl) await upsertSetting('live_hls_url', hlsUrl);
            if (!active) await upsertSetting('live_hls_url', '');
        } catch (err) {
            console.warn('[Live] saveLiveStatus error:', err);
        }
    };

    // ─── Attach local video ───────────────────────────────────────────────────
    useEffect(() => {
        if (videoRef.current && localVideoTrackId) {
            hmsActions.attachVideo(localVideoTrackId, videoRef.current);
        }
        return () => {
            if (videoRef.current && localVideoTrackId) {
                hmsActions.detachVideo(localVideoTrackId, videoRef.current);
            }
        };
    }, [localVideoTrackId, hmsActions]);

    // ─── Join room ────────────────────────────────────────────────────────────
    const joinRoom = async (forceVideoOff = false) => {
        setIsJoining(true);
        setDeviceInUse(false);
        try {
            const token = await generateHmsToken('broadcaster', user?.id || 'admin');
            const metaData = JSON.stringify({
                avatar: user?.profile_photo_url || user?.avatar_url || '',
                role: 'admin',
            });
            await hmsActions.join({
                userName: user?.full_name || user?.email || 'Admin',
                authToken: token,
                metaData,
                settings: { isAudioMuted: false, isVideoMuted: forceVideoOff },
            });
        } catch (err) {
            console.error('[Live] joinRoom error:', err);
            if (err?.message?.toLowerCase().includes('device') ||
                err?.message?.toLowerCase().includes('notreadable') ||
                err?.message?.toLowerCase().includes('busy')) {
                setDeviceInUse(true);
            } else {
                toast.error(`Erro ao conectar: ${err?.message}`);
            }
        } finally {
            setIsJoining(false);
        }
    };

    // ─── Start live ───────────────────────────────────────────────────────────
    const startLive = async () => {
        setIsStartingLive(true);
        try {
            // Camera pre-flight
            if (!isVideoEnabled) {
                try { await hmsActions.setLocalVideoEnabled(true); } catch { }
            }
            if (!isAudioEnabled) {
                try { await hmsActions.setLocalAudioEnabled(true); } catch { }
            }
            // Immediately mark live as active (viewers use WebRTC directly)
            await saveLiveStatus(true, '');
            await upsertSetting('live_started_at', new Date().toISOString());
            setIsLive(true);
            toast.success('🔴 Live iniciada!');

            // Notify viewers (best-effort)
            base44.entities.User.list().then(users =>
                notifyLiveSession(users, { id: 'live-' + Date.now(), title: '🔴 Live EC10 Talentos' })
            ).catch(() => { });

            // Start HLS for recording in background (non-blocking)
            hmsActions.startHLSStreaming({
                variants: [{ meetingURL: HMS_MEETING_URL }],
                recording: { hlsVod: true, singleFilePerLayer: false },
            }).catch(e => console.warn('[Live] HLS start (background):', e.message));

        } catch (err) {
            console.error('[Live] startLive error:', err);
            toast.error(`Erro ao iniciar: ${err?.message}`);
            setIsLive(false);
        } finally {
            setIsStartingLive(false);
        }
    };

    // ─── Stop live ────────────────────────────────────────────────────────────
    const stopLive = async () => {
        setIsStoppingLive(true);
        try {
            if (hlsState?.running) await hmsActions.stopHLSStreaming().catch(() => { });
            await saveLiveStatus(false);
            await upsertSetting('live_ended_at', new Date().toISOString());
            setIsLive(false);
            await hmsActions.leave();
            toast.success('⏹ Live encerrada!');
        } catch (err) {
            console.error('[Live] stopLive error:', err);
            toast.error('Erro ao encerrar live');
        } finally {
            setIsStoppingLive(false);
        }
    };

    // ─── Camera switch ────────────────────────────────────────────────────────
    const switchCamera = async () => {
        const newFacing = isFrontCamera ? 'environment' : 'user';
        try {
            await hmsActions.setVideoSettings({ facingMode: newFacing });
            setIsFrontCamera(f => !f);
        } catch (e) {
            console.warn('[Live] switchCamera failed:', e);
            toast.error('Não foi possível trocar a câmera');
        }
    };

    const toggleVideo = () => hmsActions.setLocalVideoEnabled(!isVideoEnabled);
    const toggleAudio = () => hmsActions.setLocalAudioEnabled(!isAudioEnabled);

    // ── NOT CONNECTED ──────────────────────────────────────────────────────────
    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center gap-8 px-4 py-12">
                <HMSErrorListener />

                {deviceInUse ? (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-sm flex flex-col items-center text-center gap-5 p-7 bg-amber-950/40 border border-amber-500/30 rounded-3xl"
                    >
                        <div className="w-14 h-14 bg-amber-500/15 rounded-2xl flex items-center justify-center">
                            <AlertTriangle className="w-7 h-7 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-black text-lg mb-1">Câmera em uso</h3>
                            <p className="text-amber-200/60 text-sm leading-relaxed">
                                Outro aplicativo está usando a câmera (Teams, Zoom, OBS…). Feche-o ou entre só com áudio.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <Button
                                onClick={() => joinRoom(false)} disabled={isJoining}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black py-4 rounded-2xl"
                            >
                                {isJoining ? <Loader2 className="w-4 h-4 animate-spin" /> : '🔄 Tentar novamente'}
                            </Button>
                            <Button
                                onClick={() => joinRoom(true)} disabled={isJoining}
                                variant="outline"
                                className="w-full border-white/10 text-white bg-white/5 py-4 rounded-2xl"
                            >
                                🎙️ Entrar só com áudio
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500 rounded-full blur-3xl opacity-20 animate-pulse" />
                            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 relative">
                                <Radio className="w-10 h-10 text-red-400" />
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-white mb-1">Studio de Transmissão</h3>
                            <p className="text-gray-500 text-sm">Conecte-se para transmitir ao vivo</p>
                        </div>
                        <Button
                            onClick={() => joinRoom(false)} disabled={isJoining}
                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-black py-6 px-12 rounded-2xl shadow-2xl shadow-red-500/25 text-base"
                        >
                            {isJoining
                                ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Conectando...</>
                                : <>📡 Conectar ao Studio</>
                            }
                        </Button>
                    </motion.div>
                )}
            </div>
        );
    }

    // ── CONNECTED ──────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-3 w-full">
            {/* ─ Video panel ─ */}
            <div className="relative w-full rounded-3xl overflow-hidden bg-black shadow-2xl shadow-black/80">
                {/* Portrait video (9/16 on mobile, 16/9 on desktop) */}
                <div className="aspect-[9/16] md:aspect-video relative">
                    <video
                        ref={videoRef}
                        autoPlay muted playsInline
                        className="w-full h-full object-cover"
                    />

                    {/* Camera off placeholder */}
                    {!isVideoEnabled && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950">
                            <VideoOff className="w-10 h-10 text-gray-700 mb-2" />
                            <p className="text-gray-600 text-sm">Câmera desligada</p>
                        </div>
                    )}

                    {/* Top bar: LIVE badge + timer */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
                        {isLive && (
                            <span className="bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-red-600/50">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                AO VIVO
                            </span>
                        )}
                        {isLive && (
                            <span className="bg-black/50 backdrop-blur-md text-white font-mono text-xs px-3 py-1.5 rounded-full border border-white/10">
                                {formatTime(liveSeconds)}
                            </span>
                        )}
                    </div>

                    {/* ─ Minimalist control icons — bottom-right overlay ─ */}
                    <div className="absolute bottom-4 right-4 flex flex-col gap-2.5">
                        {/* Switch camera */}
                        <button
                            onClick={switchCamera}
                            className="w-11 h-11 bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/15 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-xl"
                            title="Trocar câmera"
                        >
                            <RefreshCcw className="w-4 h-4 text-white" />
                        </button>

                        {/* Toggle video */}
                        <button
                            onClick={toggleVideo}
                            className={`w-11 h-11 backdrop-blur-md border rounded-full flex items-center justify-center transition-all active:scale-90 shadow-xl ${isVideoEnabled
                                    ? 'bg-black/45 hover:bg-black/65 border-white/15'
                                    : 'bg-red-600/80 hover:bg-red-500/80 border-red-400/20'
                                }`}
                            title={isVideoEnabled ? 'Desligar câmera' : 'Ligar câmera'}
                        >
                            {isVideoEnabled
                                ? <Video className="w-4 h-4 text-white" />
                                : <VideoOff className="w-4 h-4 text-white" />
                            }
                        </button>

                        {/* Toggle audio */}
                        <button
                            onClick={toggleAudio}
                            className={`w-11 h-11 backdrop-blur-md border rounded-full flex items-center justify-center transition-all active:scale-90 shadow-xl ${isAudioEnabled
                                    ? 'bg-black/45 hover:bg-black/65 border-white/15'
                                    : 'bg-red-600/80 hover:bg-red-500/80 border-red-400/20'
                                }`}
                            title={isAudioEnabled ? 'Mutar microfone' : 'Ativar microfone'}
                        >
                            {isAudioEnabled
                                ? <Mic className="w-4 h-4 text-white" />
                                : <MicOff className="w-4 h-4 text-white" />
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* ─ Viewers row (collapsed — tap to expand) ─ */}
            <button
                onClick={() => setShowViewers(true)}
                className="flex items-center gap-3 w-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] rounded-2xl px-4 py-3.5 transition-colors text-left active:scale-[0.98]"
            >
                <Eye className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                {/* Avatar bubbles row */}
                <div className="flex -space-x-2 flex-shrink-0">
                    {viewers.slice(0, 4).map(peer => {
                        const meta = (() => { try { return JSON.parse(peer.metadata || '{}'); } catch { return {}; } })();
                        return <PeerAvatar key={peer.id} name={peer.name} avatarUrl={meta.avatar} size="sm" />;
                    })}
                    {viewers.length === 0 && (
                        <div className="w-8 h-8 rounded-full bg-white/8 border-2 border-black/40 flex items-center justify-center">
                            <Users className="w-3 h-3 text-gray-600" />
                        </div>
                    )}
                    {viewers.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-black/40 flex items-center justify-center">
                            <span className="text-white text-[10px] font-black">+{viewers.length - 4}</span>
                        </div>
                    )}
                </div>
                <span className="text-white font-semibold text-sm flex-1 truncate">
                    {viewers.length === 0 ? 'Aguardando espectadores...' : `${viewers.length} assistindo`}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
            </button>

            {/* ─ Comments row (collapsed — tap to expand) ─ */}
            <button
                onClick={() => setShowComments(true)}
                className="relative flex items-center gap-3 w-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] rounded-2xl px-4 py-3.5 transition-colors text-left active:scale-[0.98]"
            >
                <MessageSquare className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-white font-semibold text-sm flex-1 truncate">
                    {messages.length === 0
                        ? 'Nenhum comentário ainda'
                        : `${messages.length} comentário${messages.length !== 1 ? 's' : ''}`
                    }
                </span>
                {newCommentDot > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce flex-shrink-0">
                        {newCommentDot}
                    </span>
                )}
                <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
            </button>

            {/* ─ Start / End live button ─ */}
            {!isLive ? (
                <Button
                    onClick={startLive} disabled={isStartingLive}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-red-500/25 text-base mt-1"
                >
                    {isStartingLive
                        ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Iniciando...</>
                        : <><Radio className="w-5 h-5 mr-2" /> INICIAR LIVE</>
                    }
                </Button>
            ) : (
                <Button
                    onClick={stopLive} disabled={isStoppingLive}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black py-5 rounded-2xl text-base mt-1 transition-all"
                >
                    {isStoppingLive
                        ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Encerrando...</>
                        : <><StopCircle className="w-5 h-5 mr-2" /> ENCERRAR LIVE</>
                    }
                </Button>
            )}

            {/* ─ Bottom Sheets ─ */}
            <AnimatePresence>
                {showViewers && <ViewersSheet viewers={viewers} onClose={() => setShowViewers(false)} />}
            </AnimatePresence>
            <AnimatePresence>
                {showComments && (
                    <CommentsSheet messages={messages} hmsActions={hmsActions} onClose={() => setShowComments(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Main exported component ───────────────────────────────────────────────────
export default function LiveBroadcaster({ user }) {
    return (
        <HMSRoomProvider>
            <HMSErrorListener />
            <BroadcasterStudio user={user} />
        </HMSRoomProvider>
    );
}
