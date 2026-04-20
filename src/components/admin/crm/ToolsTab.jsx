import { appClient } from '@/api/backendClient';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';


import { toast } from 'sonner';
import {
  FileText, MessageSquare, Send, Download, Plus,
  Calendar, BarChart, Mail, Loader2, FileSpreadsheet
} from 'lucide-react';

const QuickStatsCard = ({ title, value, icon: Icon, color, description }) => (
  <Card className={`${color} border-none`}>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white/80">{title}</p>
        <Icon className="w-5 h-5 text-white/70" />
      </div>
      <p className="text-2xl font-bold text-white mt-2">{value}</p>
      <p className="text-xs text-white/60">{description}</p>
    </CardContent>
  </Card>
);

const DocumentLibrary = ({ materials, onRefresh, salesRep }) => {
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ title: '', description: '', file: null, category: 'presentation', service_related: 'geral' });

  const handleFileChange = (e) => {
    setNewMaterial(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleUploadAndSave = async () => {
    if (!newMaterial.file || !newMaterial.title) {
      toast.error("TÃ­tulo e arquivo sÃ£o obrigatÃ³rios.");
      return;
    }
    setIsUploading(true);
    try {
      const file_url = await appClient.storage.uploadFile(newMaterial.file);
      await appClient.entities.SalesMaterial.create({
        title: newMaterial.title,
        description: newMaterial.description,
        file_url: file_url,
        file_type: newMaterial.file.type.split('/')[1] || 'document',
        category: newMaterial.category,
        service_related: newMaterial.service_related,
      });
      toast.success("Material salvo com sucesso!");
      setShowModal(false);
      setNewMaterial({ title: '', description: '', file: null, category: 'presentation', service_related: 'geral' }); // Reset form
      onRefresh();
    } catch (err) {
      toast.error("Erro ao salvar material.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (material) => {
    try {
      await appClient.entities.SalesMaterial.update(material.id, {
        usage_count: (material.usage_count || 0) + 1
      });
      window.open(material.file_url, '_blank');
      onRefresh(); // Refresh to update usage count
    } catch (error) {
      toast.error('Erro ao acessar arquivo');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-white">Biblioteca de Documentos</h4>
        <Button onClick={() => setShowModal(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" /> Novo Material
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.length === 0 ? (
          <div className="text-center py-8 text-gray-500 col-span-full">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum documento encontrado</p>
          </div>
        ) : (
          materials.map(material => (
            <Card key={material.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <FileText className="w-6 h-6 text-sky-400 mb-2" />
                <h5 className="font-semibold text-white text-sm truncate">{material.title}</h5>
                <p className="text-xs text-gray-400 mb-3 truncate">{material.description}</p>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">{material.category}</Badge>
                  <Button size="sm" variant="outline" onClick={() => handleDownload(material)}>
                    <Download className="w-3 h-3 mr-1" />Baixar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader><DialogTitle>Novo Material de Venda</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="TÃ­tulo do material"
              value={newMaterial.title}
              onChange={e => setNewMaterial(p => ({ ...p, title: e.target.value }))}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Textarea
              placeholder="DescriÃ§Ã£o"
              value={newMaterial.description}
              onChange={e => setNewMaterial(p => ({ ...p, description: e.target.value }))}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Input
              type="file"
              onChange={handleFileChange}
              className="bg-gray-800 border-gray-700 text-white file:text-white file:bg-gray-700 file:hover:bg-gray-600 file:cursor-pointer"
            />
            <div className="grid grid-cols-2 gap-4">
              <Select onValueChange={v => setNewMaterial(p => ({ ...p, category: v }))} defaultValue="presentation">
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border-gray-800">
                  <SelectItem value="contract">Contrato</SelectItem>
                  <SelectItem value="proposal">Proposta</SelectItem>
                  <SelectItem value="presentation">ApresentaÃ§Ã£o</SelectItem>
                  <SelectItem value="regulation">Regulamento</SelectItem>
                  <SelectItem value="brochure">Folder</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={v => setNewMaterial(p => ({ ...p, service_related: v }))} defaultValue="geral">
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="ServiÃ§o relacionado" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border-gray-800">
                  <SelectItem value="plano_carreira">Plano de Carreira</SelectItem>
                  <SelectItem value="revela_talentos">Revela Talentos</SelectItem>
                  <SelectItem value="intercambios">IntercÃ¢mbios</SelectItem>
                  <SelectItem value="campeonatos">Campeonatos</SelectItem>
                  <SelectItem value="geral">Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowModal(false)} className="text-gray-300 hover:bg-gray-700">Cancelar</Button>
            <Button onClick={handleUploadAndSave} disabled={isUploading} className="bg-green-600 hover:bg-green-700">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const MessageTemplates = () => (
  <div className="space-y-4">
    <h4 className="font-semibold text-white">Modelos de Mensagens</h4>
    <div className="text-center text-gray-400 p-8 bg-gray-800/50 rounded-lg">
      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p>Em construÃ§Ã£o</p>
    </div>
  </div>
);

const ProposalGenerator = () => (
  <div className="space-y-4">
    <h4 className="font-semibold text-white">Gerador de Propostas</h4>
    <div className="text-center text-gray-400 p-8 bg-gray-800/50 rounded-lg">
      <Send className="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p>Em construÃ§Ã£o</p>
    </div>
  </div>
);

const QuickActions = ({ onNavigate }) => {
  const actions = [
    { title: "Novo Lead", icon: Plus, action: () => { toast.info("Funcionalidade de novo lead em breve!"); }, color: "bg-blue-600 hover:bg-blue-700" },
    { title: "Iniciar Conversa", icon: MessageSquare, action: () => { toast.info("Abrindo chat..."); }, color: "bg-green-600 hover:bg-green-700" },
    { title: "Enviar Email", icon: Mail, action: () => { toast.info("Abrindo cliente de e-mail..."); }, color: "bg-orange-600 hover:bg-orange-700" },
    { title: "Agendar ReuniÃ£o", icon: Calendar, action: () => onNavigate('calendario'), color: "bg-purple-600 hover:bg-purple-700" },
    { title: "Ver RelatÃ³rios", icon: BarChart, action: () => onNavigate('relatorios'), color: "bg-cyan-600 hover:bg-cyan-700" },
    { title: "Importar Leads", icon: FileSpreadsheet, action: () => { toast.info("Funcionalidade de importaÃ§Ã£o de leads em breve!"); }, color: "bg-yellow-600 hover:bg-yellow-700" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {actions.map(action => (
        <button key={action.title} onClick={action.action} className={`flex flex-col items-center justify-center p-4 rounded-lg text-white transition-transform transform hover:scale-105 ${action.color}`}>
          <action.icon className="w-6 h-6 mb-2" />
          <span className="text-sm font-medium">{action.title}</span>
        </button>
      ))}
    </div>
  );
};

export default function ToolsTab({ materials: initialMaterials, salesRep, onNavigate }) {
  const [allMaterials, setAllMaterials] = useState(initialMaterials || []);

  const handleRefresh = useCallback(async () => {
    try {
      const updatedMaterials = await appClient.entities.SalesMaterial.list('-created_date'); // Assuming list accepts sort
      setAllMaterials(updatedMaterials || []);
    } catch (error) {
      toast.error('Erro ao recarregar materiais.');
    }
  }, []);

  useEffect(() => {
    handleRefresh(); // Initial load for materials if not passed or to ensure freshness
  }, [handleRefresh]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Caixa de Ferramentas - {salesRep.name}</h2>
          <p className="text-gray-400 text-sm">Tudo que vocÃª precisa para vender mais</p>
        </div>
      </div>

      <QuickActions onNavigate={onNavigate} />

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="documents" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" />Documentos
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            <MessageSquare className="w-4 h-4 mr-2" />Modelos de Mensagem
          </TabsTrigger>
          <TabsTrigger value="proposals" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            <Send className="w-4 h-4 mr-2" />Propostas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="documents" className="mt-6">
          <DocumentLibrary materials={allMaterials} onRefresh={handleRefresh} salesRep={salesRep} />
        </TabsContent>
        <TabsContent value="templates" className="mt-6">
          <MessageTemplates />
        </TabsContent>
        <TabsContent value="proposals" className="mt-6">
          <ProposalGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}



