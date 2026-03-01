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
    selectPeers,
    selectIsLocalVideoEnabled,
    selectIsLocalAudioEnabled,
} from '@100mslive/react-sdk';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { generateHmsToken, HMS_MEETING_URL } from '@/lib/hmsUtils';
import { notifyLiveSession } from '@/components/admin/NotificationSystem';
import {
    Radio, Video, VideoOff, Mic, MicOff, MonitorPlay,
    Loader2, Users, PlayCircle, StopCircle, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Error catcher from 100ms SDK event system ───────────────────────────────
function HMSErrorHandler() {
    const notification = useHMSNotifications(HMSNotificationTypes.ERROR);
    useEffect(() => {
        if (notification) {
            const msg = notification.data?.message || 'Erro desconhecido no servidor de live';
            console.error('[100ms Error]', notification.data);
            toast.error(`❌ Erro na live: ${msg}`);
        }
    }, [notification]);
    return null;
}

// ─── Inner component (needs HMSRoomProvider context) ─────────────────────────
function BroadcasterControls({ user, onLiveStarted, onLiveStopped }) {
    const hmsActions = useHMSActions();
    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const localVideoTrackId = useHMSStore(selectLocalVideoTrackID);
    const hlsState = useHMSStore(selectHLSState);
    const peers = useHMSStore(selectPeers);
    const isVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);
    const isAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);

    const videoRef = useRef(null);
    const [isJoining, setIsJoining] = useState(false);
    const [isStartingHLS, setIsStartingHLS] = useState(false);
    const [isStoppingLive, setIsStoppingLive] = useState(false);
    const [hlsUrl, setHlsUrl] = useState(null);
    const [debugInfo, setDebugInfo] = useState('');

    // Attach local video to video element
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

    // Watch HLS state changes — when HLS starts, variants have the stream URL
    useEffect(() => {
        if (hlsState?.running && hlsState?.variants?.length > 0) {
            const url = hlsState.variants[0].url;
            console.log('[100ms] HLS stream URL:', url);
            setHlsUrl(url);
            onLiveStarted(url);
        }
    }, [hlsState]);

    const joinRoom = async () => {
        console.log('[Live] joinRoom called. User:', user?.id);
        setIsJoining(true);
        setDebugInfo('Gerando token...');

        try {
            const token = await generateHmsToken('broadcaster', user.id || 'admin');
            console.log('[Live] Token gerado com sucesso:', token.substring(0, 40) + '...');
            setDebugInfo('Conectando ao servidor 100ms...');

            await hmsActions.join({
                userName: user.full_name || user.email || 'Admin',
                authToken: token,
                // Start muted — user can unmute manually to avoid permission issues
                settings: {
                    isAudioMuted: true,
                    isVideoMuted: false,
                },
            });

            console.log('[Live] join() chamado com sucesso');
            setDebugInfo('');
        } catch (err) {
            console.error('[Live] Erro ao conectar:', err);
            const msg = err?.message || err?.description || String(err);
            toast.error(`❌ Falha ao conectar: ${msg}`);
            setDebugInfo(`Erro: ${msg}`);
        } finally {
            setIsJoining(false);
        }
    };

    const startHLS = async () => {
        setIsStartingHLS(true);
        console.log('[Live] Iniciando HLS. Meeting URL:', HMS_MEETING_URL);
        try {
            await hmsActions.startHLSStreaming({
                variants: [{ meetingURL: HMS_MEETING_URL, metadata: 'revela-live' }],
                recording: { singleFilePerLayer: true, hlsVod: true },
            });
            toast.success('🔴 HLS iniciado! Aguardando URL do stream...');
        } catch (err) {
            console.error('[Live] Erro ao iniciar HLS:', err);
            toast.error(`❌ Falha no HLS: ${err?.message || err}`);
        } finally {
            setIsStartingHLS(false);
        }
    };

    const stopLive = async () => {
        setIsStoppingLive(true);
        try {
            if (hlsState?.running) await hmsActions.stopHLSStreaming();
            await hmsActions.leave();
            onLiveStopped();
        } catch (err) {
            console.error('[Live] Erro ao encerrar:', err);
            toast.error('Erro ao encerrar live');
        } finally {
            setIsStoppingLive(false);
        }
    };

    const toggleVideo = () => hmsActions.setLocalVideoEnabled(!isVideoEnabled);
    const toggleAudio = () => hmsActions.setLocalAudioEnabled(!isAudioEnabled);

    // ── NOT CONNECTED ──
    if (!isConnected) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-8 p-12"
            >
                <HMSErrorHandler />

                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-3xl opacity-30 animate-pulse" />
                    <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center border-2 border-red-500/30 relative">
                        <Radio className="w-12 h-12 text-red-400" />
                    </div>
                </div>

                <div className="text-center">
                    <h3 className="text-2xl font-black text-white mb-2">Pronto para transmitir?</h3>
                    <p className="text-gray-400">
                        {isJoining ? debugInfo || 'Conectando...' : 'Sua câmera será ativada ao conectar'}
                    </p>
                </div>

                {/* Debug info */}
                {debugInfo && !isJoining && (
                    <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-xl w-full max-w-sm">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        <p className="text-red-400 text-xs break-all">{debugInfo}</p>
                    </div>
                )}

                <Button
                    onClick={joinRoom}
                    disabled={isJoining}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-black text-lg px-10 py-6 rounded-2xl shadow-2xl shadow-red-500/40 transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isJoining ? (
                        <><Loader2 className="w-6 h-6 mr-3 animate-spin" />{debugInfo || 'Conectando...'}</>
                    ) : (
                        <><Radio className="w-6 h-6 mr-3" />🔴 ENTRAR NA SALA DE LIVE</>
                    )}
                </Button>

                <p className="text-gray-600 text-xs text-center max-w-xs">
                    Abra o console do browser (F12) para ver logs detalhados caso haja erros
                </p>
            </motion.div>
        );
    }

    // ── CONNECTED ──
    return (
        <div className="space-y-6">
            <HMSErrorHandler />

            {/* Status Bar */}
            <div className="flex items-center justify-between p-4 bg-gray-900/80 rounded-2xl border border-gray-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white font-bold">
                        {hlsState?.running ? '🔴 AO VIVO' : 'Conectado — aguardando início'}
                    </span>
                    {hlsState?.running && (
                        <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                            TRANSMITINDO
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{peers.length} peer(s)</span>
                </div>
            </div>

            {/* Video Preview */}
            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border-2 border-gray-700/50 shadow-2xl">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                />
                {!isVideoEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
                        <VideoOff className="w-16 h-16 text-gray-600" />
                    </div>
                )}
                {hlsState?.running && (
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-red-600 text-white flex items-center gap-2 px-3 py-1.5 animate-pulse shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            AO VIVO
                        </Badge>
                    </div>
                )}
            </div>

            {/* Camera / Mic controls */}
            <div className="grid grid-cols-2 gap-3">
                <Button
                    onClick={toggleVideo}
                    variant="outline"
                    className={`border-gray-700 ${isVideoEnabled ? 'text-white hover:bg-gray-800' : 'text-red-400 border-red-500/50 hover:bg-red-500/10'}`}
                >
                    {isVideoEnabled ? <Video className="w-4 h-4 mr-2" /> : <VideoOff className="w-4 h-4 mr-2" />}
                    {isVideoEnabled ? 'Câmera ON' : 'Câmera OFF'}
                </Button>
                <Button
                    onClick={toggleAudio}
                    variant="outline"
                    className={`border-gray-700 ${isAudioEnabled ? 'text-white hover:bg-gray-800' : 'text-red-400 border-red-500/50 hover:bg-red-500/10'}`}
                >
                    {isAudioEnabled ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
                    {isAudioEnabled ? 'Mic ON' : 'Mic OFF'}
                </Button>
            </div>

            {/* HLS Start / Stop */}
            {!hlsState?.running ? (
                <Button
                    onClick={startHLS}
                    disabled={isStartingHLS}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-black text-lg py-6 rounded-2xl shadow-2xl shadow-red-500/30"
                >
                    {isStartingHLS ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Iniciando transmissão...</>
                    ) : (
                        <><PlayCircle className="w-5 h-5 mr-2" />▶ INICIAR TRANSMISSÃO PARA TODOS</>
                    )}
                </Button>
            ) : (
                <div className="space-y-3">
                    {hlsUrl && (
                        <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-xl">
                            <p className="text-green-400 text-xs font-mono break-all">{hlsUrl}</p>
                        </div>
                    )}
                    <Button
                        onClick={stopLive}
                        disabled={isStoppingLive}
                        className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-5 rounded-2xl border border-gray-600"
                    >
                        {isStoppingLive ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Encerrando...</>
                        ) : (
                            <><StopCircle className="w-5 h-5 mr-2" />⏹ ENCERRAR LIVE</>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}

// ─── Main exported component (with HMSRoomProvider) ──────────────────────────
export default function LiveBroadcaster({ user }) {
    const [isSendingNotification, setIsSendingNotification] = useState(false);

    const saveLiveStatus = async (active, hlsUrl = '') => {
        const settings = [
            { key: 'is_live_active', value: String(active) },
            { key: 'live_hls_url', value: hlsUrl },
        ];
        for (const { key, value } of settings) {
            try {
                const existing = await base44.entities.PlatformSettings.filter({ setting_key: key });
                if (existing.length > 0) {
                    await base44.entities.PlatformSettings.update(existing[0].id, { setting_value: value, setting_type: 'string' });
                } else {
                    await base44.entities.PlatformSettings.create({ setting_key: key, setting_value: value, setting_type: 'string', is_active: true });
                }
            } catch (e) {
                console.error('[Live] Erro salvando setting', key, e);
            }
        }
    };

    const handleLiveStarted = async (hlsUrl) => {
        try {
            setIsSendingNotification(true);
            await saveLiveStatus(true, hlsUrl);
            const allUsers = await base44.entities.User.list();
            await notifyLiveSession(allUsers, { id: 'live-' + Date.now(), title: '🔴 Live EC10 Talentos' });
            toast.success(`✅ Live iniciada! ${allUsers.length} atletas notificados.`);
        } catch (err) {
            console.error('[Live] handleLiveStarted error:', err);
            toast.error('Erro ao notificar usuários');
        } finally {
            setIsSendingNotification(false);
        }
    };

    const handleLiveStopped = async () => {
        try {
            await saveLiveStatus(false, '');
            toast.success('⏹ Live encerrada com sucesso!');
        } catch (err) {
            console.error('[Live] handleLiveStopped error:', err);
        }
    };

    return (
        <HMSRoomProvider>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-red-500/10 to-pink-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
                            <MonitorPlay className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-black text-lg">Estúdio de Transmissão</h3>
                            <p className="text-gray-400 text-sm">Transmita ao vivo diretamente pelo browser</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isSendingNotification && (
                        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl flex items-center gap-3">
                            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                            <span className="text-blue-400 text-sm">Notificando todos os atletas...</span>
                        </div>
                    )}
                    <BroadcasterControls
                        user={user}
                        onLiveStarted={handleLiveStarted}
                        onLiveStopped={handleLiveStopped}
                    />
                </div>
            </div>
        </HMSRoomProvider>
    );
}
