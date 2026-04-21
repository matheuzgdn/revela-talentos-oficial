import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { appClient } from '@/api/backendClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  AlertCircle,
  Calendar,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Link2,
  Loader2,
  Mic,
  MonitorSmartphone,
  Radio,
  RefreshCcw,
  Save,
  ScanSearch,
  Server,
  Settings2,
  ShieldCheck,
  Video,
  Wifi,
  WifiOff,
  XCircle
} from 'lucide-react';
import LiveBroadcaster from '@/components/live/LiveBroadcaster';
import { generateHmsToken, HMS_MEETING_URL, HMS_ROOM_ID_VALUE } from '@/lib/hmsUtils';

const formatDateTime = (value) => {
  if (!value) return 'Nao definido';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('pt-BR');
};

const getStatusMeta = (tone) => {
  if (tone === 'success') {
    return {
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
      icon: CheckCircle2,
      iconClass: 'text-emerald-400'
    };
  }

  if (tone === 'warning') {
    return {
      badgeClass: 'bg-amber-500/15 text-amber-200 border border-amber-500/20',
      icon: AlertCircle,
      iconClass: 'text-amber-400'
    };
  }

  return {
    badgeClass: 'bg-red-500/15 text-red-200 border border-red-500/20',
    icon: XCircle,
    iconClass: 'text-red-400'
  };
};

function StatusBadge({ tone, label }) {
  const meta = getStatusMeta(tone);
  const Icon = meta.icon;

  return (
    <Badge className={`${meta.badgeClass} gap-1.5 font-medium`}>
      <Icon className={`h-3.5 w-3.5 ${meta.iconClass}`} />
      {label}
    </Badge>
  );
}

function SummaryCard({ title, value, description, icon: Icon, tone = 'default' }) {
  const toneClasses = {
    default: 'from-white/5 to-white/[0.02] border-white/10',
    danger: 'from-red-500/10 to-pink-500/10 border-red-500/20',
    success: 'from-emerald-500/10 to-green-500/10 border-emerald-500/20',
    warning: 'from-amber-500/10 to-orange-500/10 border-amber-500/20',
    info: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20'
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-4 ${toneClasses[tone] || toneClasses.default}`}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-300">{title}</p>
        <Icon className="h-5 w-5 text-cyan-400" />
      </div>
      <p className="text-xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs leading-relaxed text-gray-500">{description}</p>
    </div>
  );
}

function DeviceGroup({ title, icon: Icon, items, emptyText }) {
  return (
    <Card className="border-gray-800 bg-gray-900/80">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-white">
          <Icon className="h-4 w-4 text-cyan-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-700 bg-black/20 px-4 py-6 text-sm text-gray-500">
            {emptyText}
          </div>
        ) : (
          items.map((item) => (
            <div key={item.deviceId || `${title}-${item.label}`} className="rounded-xl border border-gray-800 bg-black/20 px-4 py-3">
              <p className="truncate text-sm font-medium text-white">
                {item.label || 'Permissao ainda nao concedida'}
              </p>
              <p className="mt-1 text-xs text-gray-500">{item.deviceId || 'Sem identificador exposto pelo navegador'}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function DiagnosticRow({ label, value, tone, hint }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-gray-800 bg-black/20 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{label}</p>
        {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge tone={tone} label={value} />
      </div>
    </div>
  );
}

export default function AdminLivesSettingsTab({ showVisibilityToggle = true }) {
  const [activeTab, setActiveTab] = useState('studio');
  const [currentUser, setCurrentUser] = useState(null);
  const [settings, setSettings] = useState({
    show_live_card: true,
    default_schedule: 'Todas as segundas as 20h',
    custom_schedule: '',
    custom_image_url: '',
    is_live_active: false,
    next_live_date: '',
    is_postponed: false,
    postpone_message: 'Live adiada para terca as 20h',
    live_hls_url: '',
    live_started_at: '',
    live_ended_at: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackLogs, setPlaybackLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [deviceSummary, setDeviceSummary] = useState({
    mediaDevicesSupported: false,
    secureContext: false,
    online: true,
    browserLabel: '',
    network: null,
    permissions: {
      camera: 'indisponivel',
      microphone: 'indisponivel'
    },
    cameras: [],
    microphones: [],
    speakers: [],
    lastCheckedAt: null
  });
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [connectionDiagnostics, setConnectionDiagnostics] = useState({
    hasRoomConfig: Boolean(HMS_ROOM_ID_VALUE),
    hasMeetingUrl: Boolean(HMS_MEETING_URL),
    tokenReady: false,
    tokenPreview: '',
    browserOnline: true,
    secureContext: false,
    latestErrorCount: 0,
    issues: [],
    lastCheckedAt: null
  });
  const [isRunningConnectionCheck, setIsRunningConnectionCheck] = useState(false);

  const loadLogs = useCallback(async () => {
    setIsLoadingLogs(true);
    try {
      const logs = await appClient.entities.LivePlaybackLogs.filter({}, '-created_date');
      setPlaybackLogs(logs?.slice(0, 50) || []);
    } catch (err) {
      console.warn('LivePlaybackLogs indisponivel ou ainda nao criado', err);
      setPlaybackLogs([]);
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const allSettings = await appClient.entities.PlatformSettings.list();
      const getValue = (key, fallback = '') =>
        allSettings.find((setting) => setting.setting_key === key)?.setting_value || fallback;

      setSettings({
        show_live_card: getValue('show_live_card', 'true') === 'true',
        default_schedule: getValue('live_default_schedule', 'Todas as segundas as 20h'),
        custom_schedule: getValue('live_custom_schedule', ''),
        custom_image_url: getValue('live_custom_image', ''),
        is_live_active: getValue('is_live_active', 'false') === 'true',
        next_live_date: getValue('next_live_date', ''),
        is_postponed: getValue('live_is_postponed', 'false') === 'true',
        postpone_message: getValue('live_postpone_message', 'Live adiada para terca as 20h'),
        live_hls_url: getValue('live_hls_url', ''),
        live_started_at: getValue('live_started_at', ''),
        live_ended_at: getValue('live_ended_at', '')
      });
    } catch (error) {
      console.error('Erro ao carregar configuracoes de lives:', error);
      toast.error('Erro ao carregar configuracoes de lives');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const inspectDevices = useCallback(async () => {
    if (typeof window === 'undefined') return;

    setIsLoadingDevices(true);

    try {
      const permissionsApi = navigator.permissions?.query;
      const readPermissionState = async (name) => {
        if (!permissionsApi) return 'indisponivel';
        try {
          const result = await navigator.permissions.query({ name });
          return result.state;
        } catch {
          return 'indisponivel';
        }
      };

      const mediaDevicesSupported = Boolean(navigator.mediaDevices?.enumerateDevices);
      const secureContext = Boolean(window.isSecureContext);
      const browserLabel = navigator.userAgentData?.brands
        ? navigator.userAgentData.brands.map((brand) => `${brand.brand} ${brand.version}`).join(', ')
        : navigator.userAgent;

      let cameras = [];
      let microphones = [];
      let speakers = [];

      if (mediaDevicesSupported) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        cameras = devices.filter((device) => device.kind === 'videoinput');
        microphones = devices.filter((device) => device.kind === 'audioinput');
        speakers = devices.filter((device) => device.kind === 'audiooutput');
      }

      setDeviceSummary({
        mediaDevicesSupported,
        secureContext,
        online: navigator.onLine,
        browserLabel,
        network: navigator.connection
          ? {
              effectiveType: navigator.connection.effectiveType || 'indisponivel',
              downlink: navigator.connection.downlink || null
            }
          : null,
        permissions: {
          camera: await readPermissionState('camera'),
          microphone: await readPermissionState('microphone')
        },
        cameras,
        microphones,
        speakers,
        lastCheckedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao inspecionar dispositivos:', error);
      toast.error('Nao foi possivel listar os dispositivos deste navegador');
    } finally {
      setIsLoadingDevices(false);
    }
  }, []);

  const runConnectionChecks = useCallback(async () => {
    if (typeof window === 'undefined') return;

    setIsRunningConnectionCheck(true);
    try {
      const issues = [];
      const browserOnline = navigator.onLine;
      const secureContext = Boolean(window.isSecureContext);
      const hasRoomConfig = Boolean(HMS_ROOM_ID_VALUE);
      const hasMeetingUrl = Boolean(HMS_MEETING_URL);
      const latestErrorCount = playbackLogs.length;
      let tokenReady = false;
      let tokenPreview = '';

      if (!browserOnline) {
        issues.push('O navegador esta offline.');
      }

      if (!secureContext) {
        issues.push('O navegador nao esta em contexto seguro, o que bloqueia camera e microfone.');
      }

      if (!hasRoomConfig) {
        issues.push('VITE_HMS_ROOM_ID nao esta configurado.');
      }

      if (!hasMeetingUrl) {
        issues.push('A URL da reuniao do viewer nao foi gerada.');
      }

      if (!deviceSummary.mediaDevicesSupported) {
        issues.push('O navegador nao expoe navigator.mediaDevices.');
      }

      if (!currentUser?.id) {
        issues.push('Sessao admin ainda nao foi resolvida para testar o token.');
      } else if (hasRoomConfig) {
        try {
          const token = await generateHmsToken('broadcaster', `${currentUser.id}-diagnostic`);
          tokenReady = Boolean(token);
          tokenPreview = token ? `${token.slice(0, 10)}...${token.slice(-6)}` : '';
        } catch (error) {
          issues.push(error?.message || 'A edge function nao conseguiu gerar token.');
        }
      }

      setConnectionDiagnostics({
        hasRoomConfig,
        hasMeetingUrl,
        tokenReady,
        tokenPreview,
        browserOnline,
        secureContext,
        latestErrorCount,
        issues,
        lastCheckedAt: new Date().toISOString()
      });
    } finally {
      setIsRunningConnectionCheck(false);
    }
  }, [currentUser?.id, deviceSummary.mediaDevicesSupported, playbackLogs.length]);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await appClient.auth.me();
        setCurrentUser(user);
      } catch (error) {
        console.error('Erro ao carregar usuario atual da live:', error);
      }

      await Promise.all([loadSettings(), loadLogs(), inspectDevices()]);
    };

    init();
  }, [inspectDevices, loadLogs, loadSettings]);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.addEventListener) return undefined;

    const handleDeviceChange = () => {
      inspectDevices();
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
  }, [inspectDevices]);

  useEffect(() => {
    runConnectionChecks();
  }, [runConnectionChecks]);

  const saveSetting = async (key, value) => {
    const existingSettings = await appClient.entities.PlatformSettings.filter({ setting_key: key });
    const settingValue = String(value);
    const settingType = typeof value === 'boolean' ? 'boolean' : 'string';

    if (existingSettings.length > 0) {
      await appClient.entities.PlatformSettings.update(existingSettings[0].id, {
        setting_value: settingValue,
        setting_type: settingType
      });
      return;
    }

    await appClient.entities.PlatformSettings.create({
      setting_key: key,
      setting_value: settingValue,
      setting_type: settingType,
      description: `Live setting: ${key}`,
      is_active: true
    });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      if (showVisibilityToggle) {
        await saveSetting('show_live_card', settings.show_live_card);
      }
      await saveSetting('live_default_schedule', settings.default_schedule);
      await saveSetting('live_custom_schedule', settings.custom_schedule);
      await saveSetting('live_custom_image', settings.custom_image_url);
      await saveSetting('next_live_date', settings.next_live_date);
      await saveSetting('live_is_postponed', settings.is_postponed);
      await saveSetting('live_postpone_message', settings.postpone_message);
      toast.success('Configuracoes de lives salvas');
      await loadSettings();
      await runConnectionChecks();
    } catch (error) {
      console.error('Erro ao salvar configuracoes de lives:', error);
      toast.error('Erro ao salvar configuracoes de lives');
    } finally {
      setIsSaving(false);
    }
  };

  const summaryCards = useMemo(() => {
    const errorCount = playbackLogs.length;
    return [
      {
        title: 'Card no Hub',
        value: settings.show_live_card ? 'Visivel' : 'Oculto',
        description: settings.show_live_card
          ? 'Os usuarios ja conseguem ver o card de lives.'
          : 'O card esta escondido no Hub neste momento.',
        icon: Eye,
        tone: settings.show_live_card ? 'success' : 'warning'
      },
      {
        title: 'Status da live',
        value: settings.is_live_active ? 'Ao vivo' : 'Offline',
        description: settings.is_live_active
          ? 'A transmissao esta marcada como ativa.'
          : 'Nao ha live ativa no momento.',
        icon: Radio,
        tone: settings.is_live_active ? 'danger' : 'default'
      },
      {
        title: 'Proxima live',
        value: settings.next_live_date ? formatDateTime(settings.next_live_date) : 'Nao agendada',
        description: settings.custom_schedule || settings.default_schedule || 'Defina um horario para orientar os usuarios.',
        icon: Calendar,
        tone: settings.next_live_date ? 'info' : 'warning'
      },
      {
        title: 'Erros recentes',
        value: String(errorCount),
        description: errorCount > 0
          ? 'Ha erros recentes em Logs de reproducao.'
          : 'Nenhum erro de reproducao registrado recentemente.',
        icon: AlertCircle,
        tone: errorCount > 0 ? 'warning' : 'success'
      }
    ];
  }, [playbackLogs.length, settings.custom_schedule, settings.default_schedule, settings.is_live_active, settings.next_live_date, settings.show_live_card]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-black text-white">
            <Radio className="h-6 w-6 text-red-500" />
            Central de Lives
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Organize a operacao da live, valide dispositivos e acompanhe conexoes antes de entrar no ar.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-800"
            onClick={async () => {
              await Promise.all([inspectDevices(), loadLogs(), loadSettings()]);
              await runConnectionChecks();
            }}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Atualizar painel
          </Button>
          <StatusBadge tone={settings.is_live_active ? 'warning' : 'success'} label={settings.is_live_active ? 'Live em operacao' : 'Studio pronto'} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900 md:grid-cols-3 xl:grid-cols-5">
          <TabsTrigger value="studio" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
            <Video className="mr-2 h-4 w-4" />
            Studio
          </TabsTrigger>
          <TabsTrigger value="devices" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
            <MonitorSmartphone className="mr-2 h-4 w-4" />
            Dispositivos
          </TabsTrigger>
          <TabsTrigger value="connections" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
            <Link2 className="mr-2 h-4 w-4" />
            Conexoes
          </TabsTrigger>
          <TabsTrigger value="card" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
            <Settings2 className="mr-2 h-4 w-4" />
            Card da live
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
            <ScanSearch className="mr-2 h-4 w-4" />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="studio" className="space-y-6">
          <Card className="border-gray-800 bg-gray-900/80">
            <CardHeader>
              <CardTitle className="text-white">Operacao do estudio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-gray-800 bg-black/20 p-4">
                  <p className="text-sm font-semibold text-white">Token da live</p>
                  <p className="mt-2 text-sm text-gray-400">
                    {connectionDiagnostics.tokenReady
                      ? 'A edge function respondeu corretamente no ultimo diagnostico.'
                      : 'Execute o diagnostico de conexoes se quiser validar o token agora.'}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-800 bg-black/20 p-4">
                  <p className="text-sm font-semibold text-white">Ultimo inicio</p>
                  <p className="mt-2 text-sm text-gray-400">{formatDateTime(settings.live_started_at)}</p>
                </div>
                <div className="rounded-2xl border border-gray-800 bg-black/20 p-4">
                  <p className="text-sm font-semibold text-white">Ultimo encerramento</p>
                  <p className="mt-2 text-sm text-gray-400">{formatDateTime(settings.live_ended_at)}</p>
                </div>
              </div>

              {currentUser ? (
                <LiveBroadcaster user={currentUser} />
              ) : (
                <div className="flex items-center justify-center rounded-2xl border border-gray-800 bg-black/20 p-10">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <Card className="border-gray-800 bg-gray-900/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <MonitorSmartphone className="h-5 w-5 text-cyan-400" />
                Auditoria de dispositivos
              </CardTitle>
              <Button
                variant="outline"
                className="border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-800"
                onClick={inspectDevices}
                disabled={isLoadingDevices}
              >
                {isLoadingDevices ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                Atualizar dispositivos
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                  title="Contexto seguro"
                  value={deviceSummary.secureContext ? 'Ativo' : 'Inseguro'}
                  description="Camera e microfone exigem HTTPS ou localhost."
                  icon={ShieldCheck}
                  tone={deviceSummary.secureContext ? 'success' : 'danger'}
                />
                <SummaryCard
                  title="Cameras"
                  value={String(deviceSummary.cameras.length)}
                  description="Entradas de video detectadas neste navegador."
                  icon={Camera}
                  tone={deviceSummary.cameras.length > 0 ? 'success' : 'warning'}
                />
                <SummaryCard
                  title="Microfones"
                  value={String(deviceSummary.microphones.length)}
                  description="Entradas de audio detectadas para a live."
                  icon={Mic}
                  tone={deviceSummary.microphones.length > 0 ? 'success' : 'warning'}
                />
                <SummaryCard
                  title="Saida de audio"
                  value={String(deviceSummary.speakers.length)}
                  description="Dispositivos de reproducao que o navegador revelou."
                  icon={MonitorSmartphone}
                  tone={deviceSummary.speakers.length > 0 ? 'info' : 'warning'}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <DiagnosticRow
                  label="Permissao da camera"
                  value={deviceSummary.permissions.camera}
                  tone={deviceSummary.permissions.camera === 'granted' ? 'success' : deviceSummary.permissions.camera === 'denied' ? 'danger' : 'warning'}
                  hint="Se estiver denied, o estudio nao vai conseguir abrir a camera."
                />
                <DiagnosticRow
                  label="Permissao do microfone"
                  value={deviceSummary.permissions.microphone}
                  tone={deviceSummary.permissions.microphone === 'granted' ? 'success' : deviceSummary.permissions.microphone === 'denied' ? 'danger' : 'warning'}
                  hint="Se estiver denied, a transmissao entra sem audio."
                />
              </div>

              <div className="rounded-2xl border border-gray-800 bg-black/20 p-4">
                <p className="text-sm font-semibold text-white">Ambiente atual</p>
                <p className="mt-2 text-sm text-gray-400 break-words">{deviceSummary.browserLabel || 'Navegador nao identificado'}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                  <span>Online: {deviceSummary.online ? 'sim' : 'nao'}</span>
                  {deviceSummary.network?.effectiveType ? <span>Rede: {deviceSummary.network.effectiveType}</span> : null}
                  {deviceSummary.network?.downlink ? <span>Downlink: {deviceSummary.network.downlink} Mbps</span> : null}
                  {deviceSummary.lastCheckedAt ? <span>Ultima leitura: {formatDateTime(deviceSummary.lastCheckedAt)}</span> : null}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <DeviceGroup
                  title="Cameras"
                  icon={Camera}
                  items={deviceSummary.cameras}
                  emptyText="Nenhuma camera detectada ou o navegador ainda nao recebeu permissao."
                />
                <DeviceGroup
                  title="Microfones"
                  icon={Mic}
                  items={deviceSummary.microphones}
                  emptyText="Nenhum microfone detectado ou a permissao ainda nao foi concedida."
                />
                <DeviceGroup
                  title="Saidas de audio"
                  icon={MonitorSmartphone}
                  items={deviceSummary.speakers}
                  emptyText="Este navegador nao listou saidas de audio separadas."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections" className="space-y-6">
          <Card className="border-gray-800 bg-gray-900/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <Link2 className="h-5 w-5 text-cyan-400" />
                Diagnostico de conexoes
              </CardTitle>
              <Button
                variant="outline"
                className="border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-800"
                onClick={runConnectionChecks}
                disabled={isRunningConnectionCheck}
              >
                {isRunningConnectionCheck ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanSearch className="mr-2 h-4 w-4" />}
                Executar diagnostico
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                  title="Navegador"
                  value={connectionDiagnostics.browserOnline ? 'Online' : 'Offline'}
                  description="Sem internet o estudio nao conecta nem envia token."
                  icon={connectionDiagnostics.browserOnline ? Wifi : WifiOff}
                  tone={connectionDiagnostics.browserOnline ? 'success' : 'danger'}
                />
                <SummaryCard
                  title="100ms Room"
                  value={connectionDiagnostics.hasRoomConfig ? 'Configurado' : 'Ausente'}
                  description="Verifica se a room da live esta presente no frontend."
                  icon={Server}
                  tone={connectionDiagnostics.hasRoomConfig ? 'success' : 'danger'}
                />
                <SummaryCard
                  title="Meeting URL"
                  value={connectionDiagnostics.hasMeetingUrl ? 'Gerada' : 'Indisponivel'}
                  description="URL usada para HLS e viewers em tempo real."
                  icon={Link2}
                  tone={connectionDiagnostics.hasMeetingUrl ? 'success' : 'warning'}
                />
                <SummaryCard
                  title="Token de acesso"
                  value={connectionDiagnostics.tokenReady ? 'Pronto' : 'Falhou'}
                  description={connectionDiagnostics.tokenPreview || 'A edge function precisa responder para o estudio iniciar.'}
                  icon={ShieldCheck}
                  tone={connectionDiagnostics.tokenReady ? 'success' : 'warning'}
                />
              </div>

              <DiagnosticRow
                label="Contexto seguro do navegador"
                value={connectionDiagnostics.secureContext ? 'OK' : 'Falhou'}
                tone={connectionDiagnostics.secureContext ? 'success' : 'danger'}
                hint="Camera, microfone e parte das APIs de media dependem disso."
              />
              <DiagnosticRow
                label="URL de reproducao do viewer"
                value={HMS_MEETING_URL ? 'Disponivel' : 'Nao gerada'}
                tone={HMS_MEETING_URL ? 'success' : 'warning'}
                hint={HMS_MEETING_URL || 'Configure room id e subdomain para gerar a URL automaticamente.'}
              />
              <DiagnosticRow
                label="Logs recentes de reproducao"
                value={connectionDiagnostics.latestErrorCount === 0 ? 'Sem erros' : `${connectionDiagnostics.latestErrorCount} ocorrencias`}
                tone={connectionDiagnostics.latestErrorCount === 0 ? 'success' : 'warning'}
                hint="Os erros listados em Logs ajudam a encontrar falhas reais dos usuarios."
              />

              <div className="rounded-2xl border border-gray-800 bg-black/20 p-4">
                <p className="text-sm font-semibold text-white">Checklist operacional</p>
                <div className="mt-3 space-y-2">
                  {connectionDiagnostics.issues.length === 0 ? (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                      Nenhum bloqueio detectado no ultimo diagnostico. O estudio esta pronto para uso.
                    </div>
                  ) : (
                    connectionDiagnostics.issues.map((issue) => (
                      <div key={issue} className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                        {issue}
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                  <span>Room ID: {HMS_ROOM_ID_VALUE || 'nao configurado'}</span>
                  <span>Live card: {settings.show_live_card ? 'visivel' : 'oculto'}</span>
                  <span>Proxima live: {settings.next_live_date ? formatDateTime(settings.next_live_date) : 'nao agendada'}</span>
                  {connectionDiagnostics.lastCheckedAt ? <span>Ultimo diagnostico: {formatDateTime(connectionDiagnostics.lastCheckedAt)}</span> : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="card" className="space-y-6">
          <Card className="border-gray-800 bg-gray-900/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings2 className="h-5 w-5 text-cyan-400" />
                Configuracoes do card de lives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {showVisibilityToggle ? (
                <div className="flex items-center justify-between rounded-2xl border border-gray-800 bg-black/20 p-4">
                  <div className="flex items-center gap-3">
                    {settings.show_live_card ? <Eye className="h-5 w-5 text-emerald-400" /> : <EyeOff className="h-5 w-5 text-gray-500" />}
                    <div>
                      <Label className="text-white">Exibir card de lives no Hub</Label>
                      <p className="mt-1 text-sm text-gray-500">Controle rapido da visibilidade do card para os usuarios.</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.show_live_card}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, show_live_card: checked }))}
                  />
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone={settings.is_live_active ? 'warning' : 'success'} label={settings.is_live_active ? 'Ao vivo' : 'Offline'} />
                {settings.is_postponed ? <StatusBadge tone="warning" label="Live adiada" /> : null}
                {settings.live_hls_url ? <StatusBadge tone="success" label="HLS registrado" /> : <StatusBadge tone="warning" label="Sem HLS registrado" />}
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-gray-800 bg-black/20 p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                  <div>
                    <Label className="text-white">Marcar live como adiada</Label>
                    <p className="mt-1 text-sm text-gray-500">Exibe um aviso explicito no card do Hub.</p>
                  </div>
                </div>
                <Switch
                  checked={settings.is_postponed}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, is_postponed: checked }))}
                />
              </div>

              {settings.is_postponed ? (
                <div className="space-y-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <Label className="text-amber-200">Mensagem de adiamento</Label>
                  <Textarea
                    value={settings.postpone_message}
                    onChange={(event) => setSettings((prev) => ({ ...prev, postpone_message: event.target.value }))}
                    className="border-gray-700 bg-gray-950 text-white"
                    rows={3}
                  />
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">Horario padrao</Label>
                  <Input
                    value={settings.default_schedule}
                    onChange={(event) => setSettings((prev) => ({ ...prev, default_schedule: event.target.value }))}
                    placeholder="Ex: Todas as segundas as 20h"
                    className="border-gray-700 bg-gray-950 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Horario customizado</Label>
                  <Input
                    value={settings.custom_schedule}
                    onChange={(event) => setSettings((prev) => ({ ...prev, custom_schedule: event.target.value }))}
                    placeholder="Ex: Hoje as 19h30"
                    className="border-gray-700 bg-gray-950 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white">Data da proxima live</Label>
                  <Input
                    type="datetime-local"
                    value={settings.next_live_date}
                    onChange={(event) => setSettings((prev) => ({ ...prev, next_live_date: event.target.value }))}
                    className="border-gray-700 bg-gray-950 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Imagem customizada do card</Label>
                  <Input
                    value={settings.custom_image_url}
                    onChange={(event) => setSettings((prev) => ({ ...prev, custom_image_url: event.target.value }))}
                    placeholder="https://..."
                    className="border-gray-700 bg-gray-950 text-white"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-black/20 p-4">
                <p className="text-sm font-semibold text-white">Ultimo HLS registrado</p>
                <p className="mt-2 break-all text-xs text-gray-500">
                  {settings.live_hls_url || 'Nenhuma URL HLS salva ate agora.'}
                </p>
              </div>

              <Button onClick={handleSaveAll} disabled={isSaving} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                Salvar configuracoes do card
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card className="border-gray-800 bg-gray-900/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <ScanSearch className="h-5 w-5 text-cyan-400" />
                Logs de reproducao
              </CardTitle>
              <Button
                variant="outline"
                className="border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-800"
                onClick={loadLogs}
                disabled={isLoadingLogs}
              >
                {isLoadingLogs ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                Atualizar logs
              </Button>
            </CardHeader>
            <CardContent>
              {playbackLogs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-800 bg-black/20 px-4 py-10 text-center">
                  <p className="text-sm text-gray-400">Nenhum erro de reproducao registrado recentemente.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {playbackLogs.map((log) => (
                    <div key={log.id} className="rounded-2xl border border-gray-800 bg-black/20 p-4">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-2">
                          <StatusBadge tone="warning" label={log.error_message || 'Erro sem mensagem'} />
                          <p className="flex items-center gap-2 text-sm font-medium text-white">
                            <MonitorSmartphone className="h-4 w-4 text-gray-500" />
                            {log.device_info || 'Dispositivo nao identificado'}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">{formatDateTime(log.created_date)}</span>
                      </div>

                      <div className="mt-3 rounded-xl border border-gray-800 bg-black/30 px-3 py-2 text-xs text-gray-400 break-all">
                        URL: {log.live_hls_url || 'Nao informada'}
                      </div>

                      {log.error_details ? (
                        <div className="mt-3 rounded-xl border border-red-500/15 bg-red-500/10 px-3 py-2 text-xs text-red-200 break-all">
                          Detalhes: {log.error_details}
                        </div>
                      ) : null}

                      <p className="mt-3 text-xs text-gray-600">User ID: {log.userId || 'Nao informado'}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
