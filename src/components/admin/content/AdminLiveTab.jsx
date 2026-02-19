import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Radio, Settings } from 'lucide-react';
import AdminLivesSettingsTab from '../../admin/AdminLivesSettingsTab';

export default function AdminLiveTab() {
  const [activeTab, setActiveTab] = useState('lives');

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Radio className="w-5 h-5" />
            Gerenciar Lives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-800">
              <TabsTrigger value="lives" className="data-[state=active]:bg-gray-700">
                <Radio className="w-4 h-4 mr-2" />
                Lives
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-gray-700">
                <Settings className="w-4 h-4 mr-2" />
                Configurações do Card
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lives" className="mt-6">
              <p className="text-gray-400 text-center py-8">
                Gerencie suas lives na aba de Conteúdos, categoria "live"
              </p>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <AdminLivesSettingsTab showVisibilityToggle={true} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}