import React, { useState, useEffect, useCallback } from 'react';
import { PlatformSettings } from '@/entities/PlatformSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Settings, 
  Globe, 
  Lock, 
  Unlock, 
  Shield,
  AlertTriangle,
  Loader2,
  Star,
  TrendingUp
} from 'lucide-react';

export default function AdminPlatformSettingsTab() {
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Configurações padrão
  const defaultSettings = useCallback(() => [
    {
      key: 'open_revela_talentos',
      label: 'Revela Talentos em Acesso Livre',
      description: 'Libera o conteúdo da plataforma Revela Talentos para todos',
      type: 'boolean',
      defaultValue: 'false',
      category: 'acesso'
    },
    {
      key: 'open_plano_carreira',
      label: 'Plano de Carreira em Acesso Livre',
      description: 'Libera o conteúdo do Plano de Carreira para todos',
      type: 'boolean',
      defaultValue: 'false',
      category: 'acesso'
    },
    {
      key: 'maintenance_mode',
      label: 'Modo Manutenção',
      description: 'Coloca a plataforma em modo manutenção (apenas admins têm acesso)',
      type: 'boolean',
      defaultValue: 'false',
      category: 'sistema'
    },
    {
      key: 'maintenance_message',
      label: 'Mensagem de Manutenção',
      description: 'Mensagem exibida durante a manutenção',
      type: 'string',
      defaultValue: '🔧 Plataforma em manutenção. Voltaremos em breve!',
      category: 'sistema'
    }
  ], []);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const allSettings = await PlatformSettings.list();
      const settingsMap = {};
      
      allSettings.forEach(setting => {
        settingsMap[setting.setting_key] = {
          ...setting,
          value: setting.setting_value === 'true' ? true : setting.setting_value === 'false' ? false : setting.setting_value
        };
      });

      for (const defaultSetting of defaultSettings()) {
        if (!settingsMap[defaultSetting.key]) {
          const newSetting = await PlatformSettings.create({
            setting_key: defaultSetting.key,
            setting_value: defaultSetting.defaultValue,
            setting_type: defaultSetting.type,
            description: defaultSetting.description
          });
          settingsMap[defaultSetting.key] = {
            ...newSetting,
            value: defaultSetting.defaultValue === 'true' ? true : defaultSetting.defaultValue === 'false' ? false : defaultSetting.defaultValue
          };
        }
      }

      setSettings(settingsMap);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações da plataforma');
    } finally {
      setIsLoading(false);
    }
  }, [defaultSettings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSetting = async (key, value) => {
    setIsSaving(true);
    try {
      const setting = settings[key];
      const stringValue = typeof value === 'boolean' ? value.toString() : value;
      
      if (setting && setting.id) {
        await PlatformSettings.update(setting.id, {
          setting_value: stringValue
        });
      } else {
        // Se a configuração não existir, crie-a
        const defaultConfig = defaultSettings().find(s => s.key === key);
        if (defaultConfig) {
           await PlatformSettings.create({
            setting_key: key,
            setting_value: stringValue,
            setting_type: defaultConfig.type,
            description: defaultConfig.description
          });
        }
      }
      
      toast.success('Configuração atualizada com sucesso!');
      await loadSettings(); // Recarrega para garantir consistência
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      toast.error('Erro ao atualizar configuração');
    } finally {
      setIsSaving(false);
    }
  };

  const getSettingValue = (key, defaultValue = '') => {
    return settings[key]?.value ?? (defaultValue === 'true' ? true : defaultValue === 'false' ? false : defaultValue);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
      </div>
    );
  }

  const revelaTalentosOpen = getSettingValue('open_revela_talentos', 'false');
  const planoCarreiraOpen = getSettingValue('open_plano_carreira', 'false');
  const maintenanceEnabled = getSettingValue('maintenance_mode', 'false');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Configurações da Plataforma</h2>
          <p className="text-gray-400">Gerencie configurações globais de acesso e funcionamento</p>
        </div>
      </div>

      {/* Status Atual */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Status Atual da Plataforma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              {maintenanceEnabled ? (
                <>
                  <AlertTriangle className="w-10 h-10 text-orange-500 mx-auto mb-2" />
                  <Badge className="bg-orange-600 text-white">Manutenção</Badge>
                  <p className="text-sm text-gray-400 mt-2">Apenas admins têm acesso</p>
                </>
              ) : (!revelaTalentosOpen && !planoCarreiraOpen) ? (
                 <>
                  <Lock className="w-10 h-10 text-blue-500 mx-auto mb-2" />
                  <Badge className="bg-blue-600 text-white">Acesso Restrito</Badge>
                  <p className="text-sm text-gray-400 mt-2">Acesso por assinatura</p>
                </>
              ) : (
                <>
                  <Unlock className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <Badge className="bg-green-600 text-white">Acesso Livre Ativo</Badge>
                   <p className="text-sm text-gray-400 mt-2">Conteúdo liberado</p>
                </>
              )}
            </div>
            
            <div className="text-center p-4 bg-gray-900 rounded-lg">
              <Star className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-white">Revela Talentos</p>
              {revelaTalentosOpen ? (
                <Badge className="bg-green-600 text-white">Acesso Livre</Badge>
              ) : (
                <Badge variant="outline" className="text-gray-400">Restrito</Badge>
              )}
            </div>
            
            <div className="text-center p-4 bg-gray-900 rounded-lg">
               <TrendingUp className="w-10 h-10 text-cyan-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-white">Plano de Carreira</p>
              {planoCarreiraOpen ? (
                 <Badge className="bg-green-600 text-white">Acesso Livre</Badge>
              ) : (
                 <Badge variant="outline" className="text-gray-400">Restrito</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Acesso */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-400" />
            Controle de Acesso Livre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
            <div className="space-y-1">
              <Label className="text-white font-semibold flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400"/>Revela Talentos Aberto</Label>
              <p className="text-sm text-gray-400">
                Libera a plataforma Revela Talentos para qualquer usuário
              </p>
              {revelaTalentosOpen && (
                <Badge className="bg-green-600/20 text-green-400 text-xs">
                  ⚡ ATIVO - Revela Talentos está com acesso total
                </Badge>
              )}
            </div>
            <Switch
              checked={revelaTalentosOpen}
              onCheckedChange={(checked) => updateSetting('open_revela_talentos', checked)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
            <div className="space-y-1">
              <Label className="text-white font-semibold flex items-center gap-2"><TrendingUp className="w-4 h-4 text-cyan-400"/>Plano de Carreira Aberto</Label>
              <p className="text-sm text-gray-400">
                Libera o Plano de Carreira para qualquer usuário
              </p>
              {planoCarreiraOpen && (
                <Badge className="bg-green-600/20 text-green-400 text-xs">
                  ⚡ ATIVO - Plano de Carreira está com acesso total
                </Badge>
              )}
            </div>
            <Switch
              checked={planoCarreiraOpen}
              onCheckedChange={(checked) => updateSetting('open_plano_carreira', checked)}
              disabled={isSaving}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Sistema */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-400" />
            Configurações de Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
            <div className="space-y-1">
              <Label className="text-white font-semibold">Modo Manutenção</Label>
              <p className="text-sm text-gray-400">
                Bloqueia acesso de usuários comuns, apenas admins podem entrar
              </p>
              {maintenanceEnabled && (
                <Badge className="bg-orange-600/20 text-orange-400 text-xs">
                  🔧 ATIVO - Plataforma em manutenção
                </Badge>
              )}
            </div>
            <Switch
              checked={maintenanceEnabled}
              onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
              disabled={isSaving}
            />
          </div>

          {maintenanceEnabled && (
            <div className="space-y-2">
              <Label className="text-gray-300">Mensagem de Manutenção</Label>
              <Textarea
                value={getSettingValue('maintenance_message', '🔧 Plataforma em manutenção. Voltaremos em breve!')}
                onChange={(e) => updateSetting('maintenance_message', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white h-20"
                placeholder="Mensagem exibida durante a manutenção"
                disabled={isSaving}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Avisos Importantes */}
      {(revelaTalentosOpen || planoCarreiraOpen || maintenanceEnabled) && (
        <Card className="bg-yellow-900/20 border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="w-5 h-5" />
              Atenção - Configurações Especiais Ativas
            </CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-200">
            <ul className="space-y-2">
              {revelaTalentosOpen && (
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Revela Talentos está em <strong>acesso livre</strong>.</span>
                </li>
              )}
              {planoCarreiraOpen && (
                <li className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>Plano de Carreira está em <strong>acesso livre</strong>.</span>
                </li>
              )}
              {maintenanceEnabled && (
                <li className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  <span>Modo <strong>manutenção ativo</strong> - apenas administradores podem acessar</span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}