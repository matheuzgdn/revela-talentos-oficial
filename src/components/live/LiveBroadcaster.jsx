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
    const [isPollingHls, setIsPollingHls] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');
    const [deviceInUse, setDeviceInUse] = useState(false); // camera busy by another app

    // Upsert a PlatformSetting key
    const upsertSetting = async (key, value) => {
        const all = await base44.entities.PlatformSettings.list();
        const existing = all.find(s => s.setting_key === key);
        if (existing) {
            await base44.entities.PlatformSettings.update(existing.id, { setting_value: String(value) });
        } else {
            await base44.entities.PlatformSettings.create({ setting_key: key, setting_value: String(value) });
        }
    };

    // Save live on/off status — writes BOTH keys Lives.jsx and the banner card check
    const saveLiveStatus = async (isLive, hlsUrl = null) => {
        try {
            await upsertSetting('is_live', String(isLive));          // banner card
            await upsertSetting('is_live_active', String(isLive));   // Lives.jsx check
            if (hlsUrl) {
                await upsertSetting('live_hls_url', hlsUrl);         // Lives.jsx player URL
            } else if (!isLive) {
                await upsertSetting('live_hls_url', '');             // clear on stop
            }
        } catch (err) {
            console.warn('[Live] Não foi possível salvar status de live:', err);
        }
    };


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

    // Polling logic to check HLS URL health (sem dependência da cloud function)
    const pollHlsUrl = async (url) => {
        setIsPollingHls(true);
        setDebugInfo('Sincronizando feed de vídeo...');

        let attempts = 0;
        const maxAttempts = 15; // 30 seconds
        let serverErrorCount = 0;

        const activateLive = async (u) => {
            setIsPollingHls(false);
            setDebugInfo('');
            setHlsUrl(u);
            await saveLiveStatus(true, u);
            await upsertSetting('live_started_at', new Date().toISOString());
            if (onLiveStarted) onLiveStarted(u);
        };

        const checkHealth = async () => {
            if (attempts >= maxAttempts) {
                // Timeout — activate anyway, URL came from 100ms SDK (trusted source)
                console.warn('[Live] HLS health check timed out — ativando com URL do SDK mesmo assim');
                activateLive(url);
                return;
            }

            let isReady = false;

            // Try the cloud function first (if deployed)
            try {
                const res = await base44.functions.invoke('checkHlsUrlHealth', { url });
                if (res && res.ok) isReady = true;
                serverErrorCount = 0;
            } catch (e) {
                serverErrorCount++;
                console.warn('[Live] checkHlsUrlHealth indisponível (tentativa ' + serverErrorCount + '):', e.message);
                // After 3 consecutive failures, function is not deployed — fallback to direct fetch
                if (serverErrorCount >= 3) {
                    try {
                        // no-cors: can't read status but absence of network error means URL is reachable
                        await fetch(url, { method: 'HEAD', mode: 'no-cors' });
                        isReady = true;
                    } catch {
                        // URL not yet reachable, keep polling
                    }
                }
            }

            if (isReady) {
                activateLive(url);
            } else {
                attempts++;
                setTimeout(checkHealth, 2000);
            }
        };

        checkHealth();
    };

    // Watch HLS state changes — when HLS starts, variants have the stream URL
    useEffect(() => {
        if (hlsState?.running && hlsState?.variants?.length > 0) {
            const url = hlsState.variants[0].url;
            console.log('[100ms] HLS stream URL:', url);

            // If we don't have the URL set yet and we are not polling or stopping
            if (!hlsUrl && !isPollingHls && !isStoppingLive) {
                pollHlsUrl(url);
            }
        }
    }, [hlsState, hlsUrl, isPollingHls, isStoppingLive]);

    const joinRoom = async (forceVideoOff = false) => {
        console.log('[Live] joinRoom called. User:', user?.id, '| videoOff:', forceVideoOff);
        setIsJoining(true);
        setDeviceInUse(false);
        setDebugInfo('Gerando token...');

        try {
            const token = await generateHmsToken('broadcaster', user.id || 'admin');
            console.log('[Live] Token gerado com sucesso:', token.substring(0, 40) + '...');
            setDebugInfo('Conectando ao servidor 100ms...');

            await hmsActions.join({
                userName: user.full_name || user.email || 'Admin',
                authToken: token,
                settings: {
                    isAudioMuted: true,
                    isVideoMuted: forceVideoOff, // audio-only fallback
                },
            });

            console.log('[Live] join() chamado com sucesso');
            setDebugInfo('');
        } catch (err) {
            console.error('[Live] Erro ao conectar:', err);
            // DeviceInUse = camera occupied by another app (code 3003)
            if (err?.code === 3003 || err?.name === 'DeviceInUse' || err?.message?.includes('videosource')) {
                setDeviceInUse(true);
                setDebugInfo('');
            } else {
                const msg = err?.message || err?.description || String(err);
                toast.error(`❌ Falha ao conectar: ${msg}`);
                setDebugInfo(`Erro: ${msg}`);
            }
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
            toast.success('🔴 HLS iniciado! Verificando link de transmissão...');
            // Removido o saveLiveStatus e onLiveStarted daqui para acontecer apenas pós-polling
        } catch (err) {
            console.error('[Live] Erro ao iniciar HLS:', err);
            toast.error(`❌ Falha no HLS: ${err?.message || err}`);
        } finally {
            setIsStartingHLS(false);
        }
    };

    const stopLive = async () => {
        setIsStoppingLive(true);
        setIsPollingHls(false);
        try {
            if (hlsState?.running) await hmsActions.stopHLSStreaming();
            await hmsActions.leave();
            // Mark live as offline
            await saveLiveStatus(false);
            await upsertSetting('live_ended_at', new Date().toISOString());
            setHlsUrl(null);
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

                {/* ── DeviceInUse Error Card ── */}
                {deviceInUse ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-sm flex flex-col items-center gap-5 p-6 bg-amber-950/40 border border-amber-500/40 rounded-2xl"
                    >
                        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-amber-400" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-white font-black text-lg mb-1">📷 Câmera em uso</h3>
                            <p className="text-amber-200/80 text-sm leading-relaxed">
                                Outro aplicativo está usando a câmera (Teams, Zoom, OBS, etc).
                                Feche-o ou transmita <strong>só com áudio</strong> agora.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <Button
                                onClick={() => joinRoom(true)}
                                disabled={isJoining}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black py-4 rounded-xl"
                            >
                                {isJoining ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : '🎙️ '}
                                Entrar só com áudio
                            </Button>
                            <Button
                                onClick={() => joinRoom(false)}
                                disabled={isJoining}
                                variant="outline"
                                className="w-full border-white/20 text-white hover:bg-white/10 py-4 rounded-xl"
                            >
                                🔄 Tentar novamente com câmera
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <>
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

                        {debugInfo && !isJoining && (
                            <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-xl w-full max-w-sm">
                                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                                <p className="text-red-400 text-xs break-all">{debugInfo}</p>
                            </div>
                        )}

                        <Button
                            onClick={() => joinRoom()}
                            disabled={isJoining}
                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-black text-lg px-10 py-6 rounded-2xl shadow-2xl shadow-red-500/40 transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isJoining ? (
                                <><Loader2 className="w-6 h-6 mr-3 animate-spin" />{debugInfo || 'Conectando...'}</>
                            ) : (
                                <><Radio className="w-6 h-6 mr-3" />🔴 ENTRAR NA SALA DE LIVE</>
                            )}
                        </Button>
                    </>
                )}
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
                    <div className={`w-3 h-3 rounded-full ${hlsState?.running && !isPollingHls ? 'bg-red-500' : 'bg-green-400'} animate-pulse`} />
                    <span className="text-white font-bold">
                        {hlsState?.running && !isPollingHls ? '🔴 AO VIVO' : isPollingHls ? '⏳ Sincronizando sinal...' : 'Conectado — aguardando início'}
                    </span>
                    {hlsState?.running && !isPollingHls && (
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
                {hlsState?.running && !isPollingHls && (
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
                    disabled={isStartingHLS || isPollingHls}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-black text-lg py-6 rounded-2xl shadow-2xl shadow-red-500/30"
                >
                    {isStartingHLS || isPollingHls ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{isPollingHls ? 'Sincronizando feed...' : 'Iniciando transmissão...'}</>
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
