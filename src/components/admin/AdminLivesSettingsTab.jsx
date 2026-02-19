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
import { Radio, Calendar, Clock, Eye, EyeOff, AlertCircle, Save, Trash2, RefreshCw } from 'lucide-react';

export default function AdminLivesSettingsTab() {
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

  useEffect(() => {
    loadSettings();
  }, []);

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
      
      console.log('Admin loaded settings:', settingsMap);
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Erro ao carregar configurações');
    }
    setIsLoading(false);
  };

  const saveSetting = async (key, value) => {
    try {
      const existingSettings = await base44.entities.PlatformSettings.filter({ setting_key: key });
      
      const settingValue = String(value);
      const settingType = typeof value === 'boolean' ? 'boolean' : 'string';
      
      if (existingSettings.length > 0) {
        await base44.entities.PlatformSettings.update(existingSettings[0].id, {
          setting_value: settingValue,
          setting_type: settingType
        });
      } else {
        await base44.entities.PlatformSettings.create({
          setting_key: key,
          setting_value: settingValue,
          setting_type: settingType,
          description: `Live setting: ${key}`,
          is_active: true
        });
      }
      
      console.log(`Saved ${key} = ${settingValue}`);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await saveSetting('show_live_card', settings.show_live_card);
      await saveSetting('live_default_schedule', settings.default_schedule);
      await saveSetting('live_custom_schedule', settings.custom_schedule);
      await saveSetting('live_custom_image', settings.custom_image_url);
      await saveSetting('is_live_active', settings.is_live_active);
      await saveSetting('next_live_date', settings.next_live_date);
      await saveSetting('live_is_postponed', settings.is_postponed);
      await saveSetting('live_postpone_message', settings.postpone_message);
      
      toast.success('✅ Configurações salvas! O card de Lives foi atualizado.');
      await loadSettings(); // Recarrega para confirmar
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('❌ Erro ao salvar configurações');
    }
    setIsSaving(false);
  };

  const handleActivateLive = async () => {
    const newSettings = {
      ...settings,
      is_live_active: true,
      is_postponed: false
    };
    setSettings(newSettings);
  };

  const handlePostponeLive = async () => {
    const newSettings = {
      ...settings,
      is_live_active: false,
      is_postponed: true
    };
    setSettings(newSettings);
  };

  const handleRemoveBanner = async () => {
    const newSettings = {
      ...settings,
      show_live_card: false,
      is_live_active: false,
      is_postponed: false
    };
    setSettings(newSettings);
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
      {/* Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-500" />
            Configurações de Lives
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Exibir Card de Lives no Hub */}
          <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
            <div className="flex items-center gap-3">
              {settings.show_live_card ? (
                <Eye className="w-5 h-5 text-green-500" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-500" />
              )}
              <div>
                <Label className="text-white">Exibir Card de Lives no Hub</Label>
                <p className="text-sm text-gray-400">Mostrar ou ocultar o card para os usuários</p>
              </div>
            </div>
            <Switch
              checked={settings.show_live_card}
              onCheckedChange={(checked) => setSettings({...settings, show_live_card: checked})}
            />
          </div>

          {/* Status da Transmissão */}
          <div className="p-4 bg-gray-900 rounded-lg space-y-4">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500" />
              <Label className="text-white">Status da Transmissão</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={`${settings.is_live_active ? 'bg-red-600' : 'bg-gray-600'} text-white`}>
                {settings.is_live_active ? 'AO VIVO' : 'OFFLINE'}
              </Badge>
              {settings.is_postponed && (
                <Badge className="bg-yellow-500 text-black">ADIADO</Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleActivateLive}
                className="bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                <Radio className="w-4 h-4 mr-2" />
                Ativar Live
              </Button>
              <Button
                onClick={handlePostponeLive}
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                size="sm"
              >
                <Clock className="w-4 h-4 mr-2" />
                Adiar Live
              </Button>
              <Button
                onClick={handleRemoveBanner}
                variant="outline"
                className="border-gray-600 text-gray-400 hover:bg-gray-800"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remover Banner
              </Button>
            </div>
          </div>

          {/* Horário Padrão das Lives */}
          <div className="space-y-2">
            <Label className="text-white">Horário Padrão das Lives</Label>
            <Input
              value={settings.default_schedule}
              onChange={(e) => setSettings({...settings, default_schedule: e.target.value})}
              placeholder="Ex: Todas as segundas às 20h"
              className="bg-gray-900 border-gray-700 text-white"
            />
            <p className="text-xs text-gray-500">Este será o horário exibido no card</p>
          </div>

          {/* Horário Customizado (Opcional) */}
          <div className="space-y-2">
            <Label className="text-white">Horário Customizado (Opcional)</Label>
            <Textarea
              value={settings.custom_schedule}
              onChange={(e) => setSettings({...settings, custom_schedule: e.target.value})}
              placeholder="Ex: Próxima live especial: Sexta-feira, 15/12 às 21h"
              className="bg-gray-900 border-gray-700 text-white"
              rows={2}
            />
            <p className="text-xs text-gray-500">Se preenchido, substituirá o horário padrão</p>
          </div>

          {/* Data da Próxima Live */}
          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Data da Próxima Live
            </Label>
            <Input
              type="datetime-local"
              value={settings.next_live_date}
              onChange={(e) => setSettings({...settings, next_live_date: e.target.value})}
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>

          {/* URL da Imagem Customizada (Opcional) */}
          <div className="space-y-2">
            <Label className="text-white">URL da Imagem Customizada (Opcional)</Label>
            <Input
              value={settings.custom_image_url}
              onChange={(e) => setSettings({...settings, custom_image_url: e.target.value})}
              placeholder="https://exemplo.com/imagem-live.jpg"
              className="bg-gray-900 border-gray-700 text-white"
            />
            {settings.custom_image_url && (
              <div className="mt-2">
                <img 
                  src={settings.custom_image_url} 
                  alt="Preview" 
                  className="w-32 h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '';
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Mensagem de Adiamento */}
          {settings.is_postponed && (
            <div className="space-y-2 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <Label className="text-yellow-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Mensagem de Adiamento
              </Label>
              <Textarea
                value={settings.postpone_message}
                onChange={(e) => setSettings({...settings, postpone_message: e.target.value})}
                placeholder="Ex: Live adiada para terça às 20h"
                className="bg-gray-900 border-gray-700 text-white"
                rows={2}
              />
            </div>
          )}

          {/* Botão Salvar */}
          <Button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Salvar Todas as Configurações
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}