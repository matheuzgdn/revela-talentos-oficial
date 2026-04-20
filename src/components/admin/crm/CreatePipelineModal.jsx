import { appClient } from '@/api/backendClient';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

import { toast } from 'sonner';

export default function CreatePipelineModal({ isOpen, onClose, salesRepId, services, onSuccess }) {
  const [pipelineName, setPipelineName] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [stages, setStages] = useState(['Novo Lead', 'Contato', 'Qualificado', 'Proposta', 'Fechado']);

  const handleAddStage = () => {
    setStages([...stages, '']);
  };

  const handleStageChange = (index, value) => {
    const newStages = [...stages];
    newStages[index] = value;
    setStages(newStages);
  };

  const handleRemoveStage = (index) => {
    setStages(stages.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!pipelineName || !serviceCategory) {
      toast.error("Por favor, preencha o nome e a categoria do pipeline.");
      return;
    }

    try {
      await appClient.entities.CRMPipeline.create({
        pipeline_name: pipelineName,
        service_category: serviceCategory,
        stages: stages.filter(s => s.trim() !== ''),
        sales_rep_id: salesRepId,
        is_active: true
      });
      toast.success("Pipeline criado com sucesso!");
      onSuccess(); // Corrigido: Usando onSuccess que Ã© passado como prop
    } catch (error) {
      toast.error("Erro ao criar pipeline.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Pipeline de Vendas</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nome do Pipeline</Label>
              <Input
                value={pipelineName}
                onChange={(e) => setPipelineName(e.target.value)}
                placeholder="Ex: Vendas - Plano de Carreira"
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <Label>ServiÃ§o Associado</Label>
              <Select value={serviceCategory} onValueChange={setServiceCategory}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Selecione um serviÃ§o" />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Etapas do Funil</Label>
              <Button size="sm" variant="outline" onClick={handleAddStage}><Plus className="w-4 h-4 mr-2" />Adicionar Etapa</Button>
            </div>
            <div className="space-y-2">
              {stages.map((stage, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={stage}
                    onChange={(e) => handleStageChange(index, e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                  {stages.length > 1 && (
                    <Button size="icon" variant="ghost" onClick={() => handleRemoveStage(index)}>
                      <X className="w-4 h-4 text-red-400" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Criar Pipeline</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

