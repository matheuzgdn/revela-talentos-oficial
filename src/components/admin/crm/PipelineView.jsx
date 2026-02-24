
import React, { useState, useMemo, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, UserPlus, Loader2, DollarSign, MessageSquare, Instagram, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { CRMLead } from '@/entities/CRMLead';
import CreatePipelineModal from './CreatePipelineModal';
import LeadDetailsModal from './LeadDetailsModal';
import CreateLeadModal from './CreateLeadModal';

const LeadCard = ({ lead, index, onSelectLead }) => {
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(lead.birth_date);

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3"
          onClick={() => onSelectLead(lead)}
        >
          <Card className="bg-gray-800/80 border-gray-700 hover:bg-gray-700/80 cursor-pointer">
            <CardContent className="p-3">
              <div className="flex items-start gap-3 mb-2">
                {lead.avatar_url && (
                  <img src={lead.avatar_url} alt={lead.full_name} className="w-8 h-8 rounded-full object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-sm truncate">{lead.full_name}</h4>
                  {lead.internal_id && <p className="text-xs text-gray-500">ID: {lead.internal_id}</p>}
                  <p className="text-xs text-gray-400 truncate">
                    {lead.position && `${lead.position} `}
                    {lead.current_club && `• ${lead.current_club}`}
                  </p>
                  {age && <p className="text-xs text-gray-500">{age} anos</p>}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {lead.value > 0 && (
                    <Badge className="text-xs bg-green-600/20 text-green-300 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {lead.value.toLocaleString('pt-BR')}
                    </Badge>
                  )}
                  {lead.payment_status && lead.payment_status !== 'pending' && (
                    <Badge className={`text-xs ${
                      lead.payment_status === 'completed' ? 'bg-green-600/20 text-green-300' :
                      lead.payment_status === 'partial' ? 'bg-yellow-600/20 text-yellow-300' :
                      'bg-red-600/20 text-red-300'
                    }`}>
                      {lead.payment_status === 'completed' ? 'Pago' : 
                       lead.payment_status === 'partial' ? 'Parcial' : 'Atraso'}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {lead.phone && (
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6" 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}`, '_blank');
                      }}
                    >
                      <MessageSquare className="w-3 h-3 text-green-500"/>
                    </Button>
                  )}
                  {lead.instagram && (
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6" 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(lead.instagram, '_blank');
                      }}
                    >
                      <Instagram className="w-3 h-3 text-pink-500"/>
                    </Button>
                  )}
                </div>
              </div>
              
              {lead.city && (
                <div className="flex items-center gap-1 mt-2">
                  <MapPin className="w-3 h-3 text-gray-500"/>
                  <span className="text-xs text-gray-400">{lead.city}, {lead.state}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

const UnassignedLeadCard = ({ lead, onAssign }) => {
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssign = async () => {
    setIsAssigning(true);
    await onAssign(lead);
    setIsAssigning(false);
  };
  
  return (
    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-white text-sm truncate">{lead.full_name}</h4>
          <p className="text-xs text-gray-400 truncate">{lead.email}</p>
        </div>
        <Badge className="text-xs bg-blue-600/70 whitespace-nowrap">
          {lead.source_page || lead.lead_category || 'N/A'}
        </Badge>
      </div>
      <div className="flex justify-end items-center mt-3">
         <Button onClick={handleAssign} size="sm" variant="outline" className="text-xs h-7" disabled={isAssigning}>
           {isAssigning ? <Loader2 className="w-3 h-3 animate-spin"/> : <><UserPlus className="w-3 h-3 mr-1"/> Atribuir a mim</>}
         </Button>
      </div>
    </div>
  );
};


export default function PipelineView({ pipelines, leads, salesRepId, services, unassignedLeads, onRefresh }) {
  const [activePipelineId, setActivePipelineId] = useState(pipelines[0]?.id || null);
  const [showCreatePipeline, setShowCreatePipeline] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const activePipeline = useMemo(() => pipelines.find(p => p.id === activePipelineId), [pipelines, activePipelineId]);

  const onDragEnd = useCallback(async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId)) {
      return;
    }

    try {
      await CRMLead.update(draggableId, { current_stage: destination.droppableId });
      toast.success("Lead movido com sucesso!");
      onRefresh();
    } catch (error) {
      toast.error("Erro ao mover lead.");
    }
  }, [onRefresh]);
  
  const handleAssignLead = useCallback(async (rawLead) => {
    if (!activePipelineId) {
      toast.error("Selecione ou crie um pipeline primeiro.");
      return;
    }
    
    try {
      const newLeadData = {
        full_name: rawLead.full_name,
        email: rawLead.email,
        phone: rawLead.phone,
        source: rawLead.source_page || rawLead.lead_category || 'manual',
        service_interest: rawLead.lead_category || '',
        pipeline_id: activePipelineId,
        current_stage: pipelines.find(p => p.id === activePipelineId)?.stages[0] || 'Novo',
        sales_rep_id: salesRepId,
        value: 0
      };
      await CRMLead.create(newLeadData);
      toast.success(`${rawLead.full_name} atribuído com sucesso!`);
      onRefresh();
    } catch (error) {
      toast.error("Erro ao atribuir lead.");
    }
  }, [salesRepId, activePipelineId, onRefresh, pipelines]);

  const handleCreateNewLead = async (leadData) => {
    if (!activePipelineId) {
      toast.error("Selecione ou crie um pipeline primeiro.");
      return false;
    }
    try {
        await CRMLead.create({
            ...leadData,
            pipeline_id: activePipelineId,
            current_stage: pipelines.find(p => p.id === activePipelineId)?.stages[0] || 'Novo',
            sales_rep_id: salesRepId,
            source: 'manual'
        });
        toast.success("Novo lead criado com sucesso!");
        onRefresh();
        return true;
    } catch(e) {
        toast.error("Erro ao criar novo lead.");
        return false;
    }
  }

  return (
    <>
      <Tabs defaultValue="pipelines" className="w-full">
        <TabsList className="bg-gray-900/50 mb-4">
          <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
          <TabsTrigger value="unassigned_leads">
            Leads Não Atribuídos <Badge className="ml-2">{unassignedLeads.length}</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pipelines">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div className="flex items-center gap-2">
                    <Select value={activePipelineId} onValueChange={setActivePipelineId}>
                        <SelectTrigger className="w-[280px] bg-gray-800 border-gray-700">
                            <SelectValue placeholder="Selecione um Pipeline" />
                        </SelectTrigger>
                        <SelectContent>
                            {pipelines.map(p => <SelectItem key={p.id} value={p.id}>{p.pipeline_name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => setShowCreatePipeline(true)}><Plus className="w-4 h-4 mr-2" />Novo Pipeline</Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setShowCreateLead(true)}><Plus className="w-4 h-4 mr-2"/>Novo Lead</Button>
                </div>
            </div>
            {activePipeline ? (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid gap-5" style={{gridTemplateColumns: `repeat(${activePipeline.stages.length}, minmax(280px, 1fr))`}}>
                        {activePipeline.stages.map(stage => (
                            <Droppable key={stage} droppableId={stage}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`p-4 rounded-lg bg-black/30 ${snapshot.isDraggingOver ? 'bg-sky-900/50' : ''}`}
                                    >
                                        <h3 className="font-semibold text-white mb-4">{stage} ({leads.filter(l => l.pipeline_id === activePipelineId && l.current_stage === stage).length})</h3>
                                        <div className="space-y-3 min-h-[300px]">
                                            {leads.filter(l => l.pipeline_id === activePipelineId && l.current_stage === stage).map((lead, index) => (
                                                <LeadCard key={lead.id} lead={lead} index={index} onSelectLead={setSelectedLead} />
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            ) : <div className="text-center py-10 text-gray-400">Selecione ou crie um pipeline para começar.</div>}
        </TabsContent>
        <TabsContent value="unassigned_leads">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unassignedLeads.map(lead => (
              <UnassignedLeadCard key={lead.id} lead={lead} onAssign={handleAssignLead} />
            ))}
            {unassignedLeads.length === 0 && <p className="text-gray-500 col-span-full text-center">Nenhum lead novo.</p>}
          </div>
        </TabsContent>
      </Tabs>
      
      {showCreatePipeline && (
        <CreatePipelineModal 
          isOpen={showCreatePipeline}
          onClose={() => setShowCreatePipeline(false)}
          salesRepId={salesRepId}
          services={services}
          onSuccess={() => {
            setShowCreatePipeline(false);
            onRefresh();
          }}
        />
      )}

      {showCreateLead && (
        <CreateLeadModal
            isOpen={showCreateLead}
            onClose={() => setShowCreateLead(false)}
            onSave={handleCreateNewLead}
        />
      )}

      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={() => {
            setSelectedLead(null);
            onRefresh();
          }}
        />
      )}
    </>
  );
}
