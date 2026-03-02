import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Radio, Calendar, Clock, Eye, EyeOff, AlertCircle, Save, Trash2, RefreshCw, Activity, MonitorSmartphone } from 'lucide-react';
import LiveBroadcaster from '@/components/live/LiveBroadcaster';

export default function AdminLivesSettingsTab() {
  const [currentUser, setCurrentUser] = useState(null);
  const [settings, setSettings] = useState({
    show_live_card: true,
    default_schedule: 'Todas as segundas às 20h',
    custom_schedule: '',
    custom_image_url: '',
    is_live_active: false,
    next_live_date: '',
    is_postponed: false,
    postpone_message: 'Live adiada para terça às 20h'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackLogs, setPlaybackLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
      } catch (e) {
        console.error(e);
      }
      await loadSettings();
      await loadLogs();
    };
    init();
  }, []);

  const loadLogs = async () => {
    setIsLoadingLogs(true);
    try {
      // Usando filter para ordenar, limitando do lado do client para os ultimos 50
      const logs = await base44.entities.LivePlaybackLogs.filter({}, "-created_date");
      setPlaybackLogs(logs?.slice(0, 50) || []);
    } catch (err) {
      console.warn('Playback Logs entity might not exist yet', err);
      setPlaybackLogs([]);
    }
    setIsLoadingLogs(false);
  };

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const allSettings = await base44.entities.PlatformSettings.list();
      const settingsMap = {
        show_live_card: allSettings.find(s => s.setting_key === 'show_live_card')?.setting_value === 'true',
        default_schedule: allSettings.find(s => s.setting_key === 'live_default_schedule')?.setting_value || 'Todas as segundas às 20h',
        custom_schedule: allSettings.find(s => s.setting_key === 'live_custom_schedule')?.setting_value || '',
        custom_image_url: allSettings.find(s => s.setting_key === 'live_custom_image')?.setting_value || '',
        is_live_active: allSettings.find(s => s.setting_key === 'is_live_active')?.setting_value === 'true',
        next_live_date: allSettings.find(s => s.setting_key === 'next_live_date')?.setting_value || '',
        is_postponed: allSettings.find(s => s.setting_key === 'live_is_postponed')?.setting_value === 'true',
        postpone_message: allSettings.find(s => s.setting_key === 'live_postpone_message')?.setting_value || 'Live adiada para terça às 20h'
      };
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Erro ao carregar configurações');
    }
    setIsLoading(false);
  };

  const saveSetting = async (key, value) => {
    const existingSettings = await base44.entities.PlatformSettings.filter({ setting_key: key });
    const settingValue = String(value);
    const settingType = typeof value === 'boolean' ? 'boolean' : 'string';
    if (existingSettings.length > 0) {
      await base44.entities.PlatformSettings.update(existingSettings[0].id, { setting_value: settingValue, setting_type: settingType });
    } else {
      await base44.entities.PlatformSettings.create({ setting_key: key, setting_value: settingValue, setting_type: settingType, description: `Live setting: ${key}`, is_active: true });
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await saveSetting('show_live_card', settings.show_live_card);
      await saveSetting('live_default_schedule', settings.default_schedule);
      await saveSetting('live_custom_schedule', settings.custom_schedule);
      await saveSetting('live_custom_image', settings.custom_image_url);
      await saveSetting('next_live_date', settings.next_live_date);
      await saveSetting('live_is_postponed', settings.is_postponed);
      await saveSetting('live_postpone_message', settings.postpone_message);
      toast.success('✅ Configurações salvas!');
      await loadSettings();
    } catch (error) {
      toast.error('❌ Erro ao salvar configurações');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <RefreshCw className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── LIVE BROADCASTER ── */}
      <div>
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <Radio className="w-5 h-5 text-red-500" />
          Estúdio de Transmissão
        </h2>
        {currentUser ? (
          <LiveBroadcaster user={currentUser} />
        ) : (
          <div className="flex items-center justify-center p-8 bg-gray-900 rounded-2xl">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        )}
      </div>

      {/* ── SETTINGS ── */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-500" />
            Configurações do Card de Lives
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Show live card */}
          <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
            <div className="flex items-center gap-3">
              {settings.show_live_card ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-gray-500" />}
              <div>
                <Label className="text-white">Exibir Card de Lives no Hub</Label>
                <p className="text-sm text-gray-400">Mostrar ou ocultar o card para os usuários</p>
              </div>
            </div>
            <Switch
              checked={settings.show_live_card}
              onCheckedChange={(checked) => setSettings({ ...settings, show_live_card: checked })}
            />
          </div>

          {/* Live status badges */}
          <div className="flex items-center gap-2">
            <Badge className={`${settings.is_live_active ? 'bg-red-600' : 'bg-gray-600'} text-white`}>
              {settings.is_live_active ? '🔴 AO VIVO' : 'OFFLINE'}
            </Badge>
            {settings.is_postponed && <Badge className="bg-yellow-500 text-black">ADIADO</Badge>}
          </div>

          {/* Postpone toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <div>
                <Label className="text-white">Marcar Live como Adiada</Label>
                <p className="text-sm text-gray-400">Mostra aviso de adiamento para os usuários</p>
              </div>
            </div>
            <Switch
              checked={settings.is_postponed}
              onCheckedChange={(checked) => setSettings({ ...settings, is_postponed: checked })}
            />
          </div>

          {settings.is_postponed && (
            <div className="space-y-2 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <Label className="text-yellow-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />Mensagem de Adiamento
              </Label>
              <Textarea
                value={settings.postpone_message}
                onChange={(e) => setSettings({ ...settings, postpone_message: e.target.value })}
                className="bg-gray-900 border-gray-700 text-white"
                rows={2}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-white">Horário Padrão das Lives</Label>
            <Input
              value={settings.default_schedule}
              onChange={(e) => setSettings({ ...settings, default_schedule: e.target.value })}
              placeholder="Ex: Todas as segundas às 20h"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              <Calendar className="w-4 h-4" />Data da Próxima Live
            </Label>
            <Input
              type="datetime-local"
              value={settings.next_live_date}
              onChange={(e) => setSettings({ ...settings, next_live_date: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>

          <Button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            {isSaving ? (
              <><RefreshCw className="w-5 h-5 mr-2 animate-spin" />Salvando...</>
            ) : (
              <><Save className="w-5 h-5 mr-2" />Salvar Configurações</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ── LOGS DE REPRODUÇÃO ── */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Logs de Reprodução (Erros dos Usuários)
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadLogs}
            disabled={isLoadingLogs}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {isLoadingLogs ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Atualizar Logs
          </Button>
        </CardHeader>
        <CardContent>
          {playbackLogs.length === 0 ? (
            <div className="text-center p-8 bg-gray-900 rounded-lg border border-gray-700">
              <p className="text-gray-400">Nenhum erro de reprodução registrado recentemente.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {playbackLogs.map((log) => (
                <div key={log.id} className="p-4 bg-gray-900 border border-gray-700 rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="destructive" className="mb-2">{log.error_message}</Badge>
                      <p className="text-sm font-medium text-white flex items-center gap-2">
                        <MonitorSmartphone className="w-4 h-4 text-gray-400" />
                        {log.device_info ? log.device_info.substring(0, 50) + '...' : 'Dispositivo desconhecido'}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(log.created_date).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-black/50 p-2 rounded text-xs text-gray-400 font-mono break-all">
                    URL: {log.live_hls_url}
                  </div>
                  {log.error_details && (
                    <div className="bg-red-900/10 p-2 rounded text-xs text-red-400 font-mono break-all mt-1">
                      Detalhes: {log.error_details}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">User ID: {log.userId}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}