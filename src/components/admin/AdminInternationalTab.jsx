import React, { useState, useEffect } from "react";
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { 
  Users, Search, Edit, Trash2, Phone, Calendar, Target, CheckCircle, AlertCircle, TrendingUp, Star, Globe, Award, FileText, Upload, Briefcase, DollarSign
} from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

const KanbanCard = ({ lead, index, onSelectLead }) => (
  <Draggable draggableId={lead.id} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={() => onSelectLead(lead)}
        className="mb-3"
      >
        <Card className="bg-gray-800 hover:bg-gray-700/80 border-gray-700 transition-colors cursor-pointer">
          <CardContent className="p-3">
            <p className="font-semibold text-white text-sm">{lead.full_name}</p>
            <p className="text-xs text-gray-400">{lead.position || "Posição não informada"}</p>
            <div className="flex items-center justify-between mt-2">
              <Badge className={`text-xs ${lead.type === 'international' ? 'bg-sky-500/20 text-sky-300' : 'bg-green-500/20 text-green-300'}`}>
                {lead.type === 'international' ? 'Internacional' : 'Geral'}
              </Badge>
              {lead.priority && (
                <Badge variant="destructive" className="capitalize">{lead.priority}</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )}
  </Draggable>
);

// ... (LeadDetailsModal will be a large new component, defined below)

export default function AdminInternationalTab({ leads: initialLeads, internationalLeads: initialInternationalLeads, pipelines: initialPipelines, salesMaterials: initialSalesMaterials, interactions: initialInteractions, onRefresh }) {
  const [combinedLeads, setCombinedLeads] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [salesMaterials, setSalesMaterials] = useState([]);
  const [interactions, setInteractions] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");

  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  
  const [showMaterialUpload, setShowMaterialUpload] = useState(false);
  const [materialFile, setMaterialFile] = useState(null);
  const [materialForm, setMaterialForm] = useState({ title: '', description: '', category: 'presentation' });


  useEffect(() => {
    const allLeads = [
      ...(initialLeads || []).map(l => ({ ...l, type: 'general' })),
      ...(initialInternationalLeads || []).map(l => ({ ...l, type: 'international' })),
    ].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

    setCombinedLeads(allLeads);
    setPipelines(initialPipelines || []);
    setSalesMaterials(initialSalesMaterials || []);
    setInteractions(initialInteractions || []);
  }, [initialLeads, initialInternationalLeads, initialPipelines, initialSalesMaterials, initialInteractions]);


  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
    const lead = combinedLeads.find(l => l.id === draggableId);
    const newStatus = destination.droppableId;

    if (lead && lead.status !== newStatus) {
      const originalLeads = [...combinedLeads];
      const updatedLeads = combinedLeads.map(l => l.id === draggableId ? { ...l, status: newStatus } : l);
      setCombinedLeads(updatedLeads);

      try {
        const leadEntity = lead.type === 'general' ? Lead : InternationalLead;
        await leadEntity.update(draggableId, { status: newStatus });
        await LeadInteraction.create({
          lead_id: draggableId,
          lead_type: lead.type,
          interaction_type: 'follow_up',
          notes: `Lead movido para a etapa: ${newStatus}`,
          sales_rep: 'Sistema' // Or current admin user email
        });
        toast.success(`Lead movido para ${newStatus}`);
        onRefresh();
      } catch (error) {
        setCombinedLeads(originalLeads);
        toast.error("Erro ao mover o lead.");
      }
    }
  };
  
  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };
  
  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!materialFile) {
        toast.error("Selecione um arquivo para fazer upload.");
        return;
    }
    
    try {
        const { file_url } = await base44.storage.upload({ file: materialFile });
        await SalesMaterial.create({
            ...materialForm,
            file_url,
            file_type: materialFile.type.split('/')[0] === 'video' ? 'video' : 'pdf',
        });
        toast.success("Material de venda adicionado!");
        setShowMaterialUpload(false);
        setMaterialFile(null);
        onRefresh();
    } catch (error) {
        toast.error("Falha ao adicionar material.");
    }
  };

  const filteredLeads = combinedLeads.filter(lead => {
    const searchMatch = !searchTerm || 
      lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const priorityMatch = filterPriority === 'all' || lead.priority === filterPriority;
    return searchMatch && priorityMatch;
  });
  
  const mainPipeline = pipelines.find(p => p.name === "Funil Principal") || { stages: [
      { name: "Novo", order: 1 }, { name: "Contato Realizado", order: 2 },
      { name: "Qualificado", order: 3 }, { name: "Proposta Enviada", order: 4 },
      { name: "Fechado", order: 5 }, { name: "Perdido", order: 6 }
  ]};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Central de Vendas (CRM)</h3>
          <p className="text-gray-400">Gerencie todos os leads e oportunidades em um funil visual.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showMaterialUpload} onOpenChange={setShowMaterialUpload}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Upload className="w-4 h-4 mr-2" />
                Adicionar Material
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>Novo Material de Venda</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUploadMaterial} className="space-y-4">
                <Input placeholder="Título do material" value={materialForm.title} onChange={e => setMaterialForm({...materialForm, title: e.target.value})} className="bg-gray-800 border-gray-700" required/>
                <Textarea placeholder="Descrição" value={materialForm.description} onChange={e => setMaterialForm({...materialForm, description: e.target.value})} className="bg-gray-800 border-gray-700" />
                <Select value={materialForm.category} onValueChange={val => setMaterialForm({...materialForm, category: val})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700"><SelectValue/></SelectTrigger>
                  <SelectContent><SelectItem value="presentation">Apresentação</SelectItem><SelectItem value="contract">Contrato</SelectItem><SelectItem value="brochure">Brochura</SelectItem></SelectContent>
                </Select>
                <Input type="file" onChange={e => setMaterialFile(e.target.files[0])} className="bg-gray-800 border-gray-700" required/>
                <DialogFooter><Button type="submit">Salvar</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white pl-10"
          />
        </div>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-full lg:w-48 bg-gray-800 border-gray-700">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Prioridades</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="urgente">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {mainPipeline.stages.map((stage) => (
            <Droppable key={stage.name} droppableId={stage.name}>
              {(provided) => (
                <div 
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                  className="w-72 flex-shrink-0"
                >
                  <Card className="bg-gray-900/70 border-gray-800 h-full">
                    <CardHeader className="p-4 border-b border-gray-800">
                      <CardTitle className="text-sm font-semibold text-white flex justify-between items-center">
                        {stage.name}
                        <Badge className="bg-gray-700 text-gray-300">{filteredLeads.filter(l => l.status === stage.name).length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 h-full overflow-y-auto" style={{maxHeight: '70vh'}}>
                      {filteredLeads.filter(l => l.status === stage.name).map((lead, index) => (
                        <KanbanCard key={lead.id} lead={lead} index={index} onSelectLead={handleSelectLead} />
                      ))}
                      {provided.placeholder}
                    </CardContent>
                  </Card>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      
      {/* Lead Details Modal */}
      <AnimatePresence>
        {showLeadDetails && selectedLead && (
            <LeadDetailsModal 
                lead={selectedLead} 
                interactions={interactions.filter(i => i.lead_id === selectedLead.id)}
                salesMaterials={salesMaterials}
                onClose={() => setShowLeadDetails(false)}
                onRefresh={onRefresh}
            />
        )}
      </AnimatePresence>
    </div>
  );
}

const LeadDetailsModal = ({ lead, interactions, salesMaterials, onClose, onRefresh }) => {
    const [activeTab, setActiveTab] = useState('details');
    const [editingLead, setEditingLead] = useState({...lead});
    const [isEditing, setIsEditing] = useState(false);
    
    const handleSave = async () => {
        try {
            const leadEntity = lead.type === 'general' ? Lead : InternationalLead;
            await leadEntity.update(lead.id, editingLead);
            toast.success("Lead atualizado com sucesso!");
            setIsEditing(false);
            onRefresh();
        } catch(e) {
            toast.error("Falha ao atualizar lead.");
        }
    }

    const DetailItem = ({ icon, label, value, children }) => (
        <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-gray-400 mt-1">{icon}</div>
            <div className="flex-1">
                <p className="text-xs text-gray-500">{label}</p>
                {children || <p className="text-white font-medium">{value || 'Não informado'}</p>}
            </div>
        </div>
    );
    
    const EditableDetailItem = ({ label, field, type = 'text', children }) => (
        <div>
            <label className="text-xs text-gray-400">{label}</label>
            {children || <Input type={type} value={editingLead[field] || ''} onChange={e => setEditingLead({...editingLead, [field]: e.target.value})} className="bg-gray-800 border-gray-700"/>}
        </div>
    )

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[90vh] bg-gray-900 border-gray-800 text-white flex flex-col p-0">
                <DialogHeader className="p-6 border-b border-gray-800 flex-shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="text-2xl">{lead.full_name}</DialogTitle>
                            <p className="text-gray-400">{lead.email}</p>
                        </div>
                        <a href={`https://wa.me/${lead.phone}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                            <Phone className="w-4 h-4"/> WhatsApp
                        </a>
                    </div>
                </DialogHeader>

                <div className="flex-grow overflow-hidden flex">
                    {/* Main content */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-6">
                        {isEditing ? (
                            <Card className="bg-gray-800/50 border-gray-700 p-6">
                                <h4 className="font-bold mb-4">Editar Informações</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <EditableDetailItem label="Nome Completo" field="full_name" />
                                    <EditableDetailItem label="Email" field="email" type="email"/>
                                    <EditableDetailItem label="Telefone" field="phone" />
                                    <EditableDetailItem label="Data de Nascimento" field="birth_date" type="date" />
                                    <EditableDetailItem label="Posição" field="position" />
                                    <EditableDetailItem label="Clube Atual" field="current_club" />
                                    <EditableDetailItem label="Altura (cm)" field="height" type="number"/>
                                    <EditableDetailItem label="Peso (kg)" field="weight" type="number"/>
                                    <EditableDetailItem label="DVD/Vídeo URL" field="video_url" />
                                    <EditableDetailItem label="Motivo da Desistência" field="quit_reason" />
                                    <EditableDetailItem label="Valor Total" field="total_value" type="number"/>
                                    <EditableDetailItem label="Valor Pago" field="paid_value" type="number"/>
                                </div>
                                <div className="mt-4">
                                    <label className="text-xs text-gray-400">Notas do Vendedor</label>
                                    <Textarea value={editingLead.seller_notes} onChange={e => setEditingLead({...editingLead, seller_notes: e.target.value})} className="bg-gray-800 border-gray-700"/>
                                </div>
                                <div className="mt-6 flex justify-end gap-2">
                                    <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancelar</Button>
                                    <Button onClick={handleSave}>Salvar Alterações</Button>
                                </div>
                            </Card>
                        ) : (
                            <>
                               <Card className="bg-gray-800/50 border-gray-700 p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-lg">Detalhes do Atleta</h4>
                                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}><Edit className="w-3 h-3 mr-2"/>Editar</Button>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <DetailItem icon={<Briefcase/>} label="Posição" value={lead.position} />
                                        <DetailItem icon={<Calendar/>} label="Nascimento" value={lead.birth_date ? new Date(lead.birth_date).toLocaleDateString() : ''} />
                                        <DetailItem icon={<Target/>} label="Clube Atual" value={lead.club} />
                                        <DetailItem icon={<Users/>} label="Altura/Peso" value={`${lead.height || '-'}cm / ${lead.weight || '-'}kg`} />
                                        <DetailItem icon={<Star/>} label="Pé Preferido" value={lead.preferred_foot} />
                                        <DetailItem icon={<Globe/>} label="País de Interesse" value={lead.preferred_country} />
                                        <div className="col-span-full">
                                            <DetailItem icon={<FileText/>} label="DVD/Vídeo URL">
                                                <a href={lead.video_url} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline break-all">{lead.video_url}</a>
                                            </DetailItem>
                                        </div>
                                    </div>
                               </Card>
                                <Card className="bg-gray-800/50 border-gray-700 p-6">
                                    <h4 className="font-bold text-lg mb-4">Financeiro & Venda</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <DetailItem icon={<DollarSign/>} label="Valor Total" value={`R$ ${lead.total_value || 0}`} />
                                        <DetailItem icon={<CheckCircle/>} label="Valor Pago" value={`R$ ${lead.paid_value || 0}`} />
                                        <DetailItem icon={<AlertCircle/>} label="Valor Restante" value={`R$ ${lead.total_value - lead.paid_value || 0}`} />
                                        <DetailItem icon={<TrendingUp/>} label="Status Pagamento" value={lead.payment_status} />
                                        <DetailItem icon={<Star/>} label="Eurocamp" value={lead.will_participate_eurocamp ? 'Sim' : 'Não'} />
                                        <DetailItem icon={<Award/>} label="Campeonato EC10" value={lead.will_participate_ec10_championship ? 'Sim' : 'Não'} />
                                        <div className="col-span-full">
                                            <DetailItem icon={<FileText/>} label="Notas do Vendedor" value={lead.seller_notes} />
                                        </div>
                                         <div className="col-span-full">
                                            <DetailItem icon={<Trash2/>} label="Motivo Desistência" value={lead.quit_reason} />
                                        </div>
                                    </div>
                               </Card>
                            </>
                        )}
                    </div>
                     {/* Sidebar de interações */}
                    <aside className="w-1/3 border-l border-gray-800 bg-gray-900/50 p-4 flex flex-col">
                        <h4 className="font-bold mb-4">Atividade Recente</h4>
                        <div className="flex-grow overflow-y-auto space-y-4">
                            {interactions.map(inter => (
                                <div key={inter.id} className="text-sm">
                                    <p className="font-semibold text-white">{inter.interaction_type} por {inter.sales_rep}</p>
                                    <p className="text-gray-300">{inter.notes}</p>
                                    <p className="text-xs text-gray-500">{new Date(inter.created_date).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-800">
                             <h4 className="font-bold mb-2">Registrar Interação</h4>
                             {/* Formulário para nova interação aqui */}
                        </div>
                    </aside>
                </div>
            </DialogContent>
        </Dialog>
    );
};