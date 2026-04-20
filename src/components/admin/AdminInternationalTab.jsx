import React, { useEffect, useMemo, useState } from 'react';
import { appClient } from '@/api/backendClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import {
  AlertCircle,
  Award,
  Briefcase,
  Calendar,
  CheckCircle,
  DollarSign,
  Edit,
  FileText,
  Globe,
  Phone,
  Search,
  Star,
  Target,
  TrendingUp,
  Upload,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_PIPELINE = {
  stages: [
    { name: 'Novo', order: 1 },
    { name: 'Contato Realizado', order: 2 },
    { name: 'Qualificado', order: 3 },
    { name: 'Proposta Enviada', order: 4 },
    { name: 'Fechado', order: 5 },
    { name: 'Perdido', order: 6 },
  ],
};

const getLeadEntity = (leadType) =>
  leadType === 'international' ? appClient.entities.InternationalLead : appClient.entities.Lead;

const formatMoney = (value) => {
  const number = Number(value || 0);
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

function KanbanCard({ lead, index, onSelectLead }) {
  return (
    <Draggable draggableId={String(lead.id)} index={index}>
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
              <p className="text-xs text-gray-400">{lead.position || 'Posicao nao informada'}</p>

              <div className="flex items-center justify-between mt-2">
                <Badge
                  className={`text-xs ${
                    lead.type === 'international'
                      ? 'bg-sky-500/20 text-sky-300'
                      : 'bg-green-500/20 text-green-300'
                  }`}
                >
                  {lead.type === 'international' ? 'Internacional' : 'Geral'}
                </Badge>

                {lead.priority ? (
                  <Badge variant="destructive" className="capitalize">
                    {lead.priority}
                  </Badge>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}

function DetailItem({ icon, label, value, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 text-gray-400 mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        {children || <p className="text-white font-medium break-words">{value || 'Nao informado'}</p>}
      </div>
    </div>
  );
}

function EditableDetailItem({ label, field, editingLead, setEditingLead, type = 'text' }) {
  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>
      <Input
        type={type}
        value={editingLead[field] || ''}
        onChange={(event) =>
          setEditingLead((previous) => ({ ...previous, [field]: event.target.value }))
        }
        className="bg-gray-800 border-gray-700"
      />
    </div>
  );
}

function LeadDetailsModal({ lead, interactions, salesMaterials, onClose, onRefresh }) {
  const [editingLead, setEditingLead] = useState({ ...lead });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditingLead({ ...lead });
  }, [lead]);

  const handleSave = async () => {
    try {
      const leadEntity = getLeadEntity(lead.type);
      await leadEntity.update(lead.id, editingLead);
      toast.success('Lead atualizado com sucesso.');
      setIsEditing(false);
      onRefresh?.();
    } catch (error) {
      toast.error('Falha ao atualizar lead.');
    }
  };

  const remainingValue = Number(editingLead.total_value || 0) - Number(editingLead.paid_value || 0);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] bg-gray-900 border-gray-800 text-white flex flex-col p-0">
        <DialogHeader className="p-6 border-b border-gray-800 flex-shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <DialogTitle className="text-2xl">{editingLead.full_name}</DialogTitle>
              <p className="text-gray-400">{editingLead.email}</p>
            </div>

            {editingLead.phone ? (
              <a
                href={`https://wa.me/${editingLead.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                WhatsApp
              </a>
            ) : null}
          </div>
        </DialogHeader>

        <div className="flex-grow overflow-hidden flex">
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {isEditing ? (
              <Card className="bg-gray-800/50 border-gray-700 p-6">
                <h4 className="font-bold mb-4">Editar Informacoes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EditableDetailItem
                    label="Nome completo"
                    field="full_name"
                    editingLead={editingLead}
                    setEditingLead={setEditingLead}
                  />
                  <EditableDetailItem
                    label="Email"
                    field="email"
                    type="email"
                    editingLead={editingLead}
                    setEditingLead={setEditingLead}
                  />
                  <EditableDetailItem
                    label="Telefone"
                    field="phone"
                    editingLead={editingLead}
                    setEditingLead={setEditingLead}
                  />
                  <EditableDetailItem
                    label="Data de nascimento"
                    field="birth_date"
                    type="date"
                    editingLead={editingLead}
                    setEditingLead={setEditingLead}
                  />
                  <EditableDetailItem
                    label="Posicao"
                    field="position"
                    editingLead={editingLead}
                    setEditingLead={setEditingLead}
                  />
                  <EditableDetailItem
                    label="Clube atual"
                    field="current_club"
                    editingLead={editingLead}
                    setEditingLead={setEditingLead}
                  />
                  <EditableDetailItem
                    label="Altura (cm)"
                    field="height"
                    type="number"
                    editingLead={editingLead}
                    setEditingLead={setEditingLead}
                  />
                  <EditableDetailItem
                    label="Peso (kg)"
                    field="weight"
                    type="number"
                    editingLead={editingLead}
                    setEditingLead={setEditingLead}
                  />
                  <EditableDetailItem
                    label="Video URL"
                    field="video_url"
                    editingLead={editingLead}
                    setEditingLead={setEditingLead}
                  />
                  <EditableDetailItem
                    label="Motivo da desistencia"
                    field="quit_reason"
                    editingLead={editingLead}
                    setEditingLead={setEditingLead}
                  />
                  <EditableDetailItem
                    label="Valor total"
                    field="total_value"
                    type="number"
                    editingLead={editingLead}
                    setEditingLead={setEditingLead}
                  />
                  <EditableDetailItem
                    label="Valor pago"
                    field="paid_value"
                    type="number"
                    editingLead={editingLead}
                    setEditingLead={setEditingLead}
                  />
                </div>

                <div className="mt-4">
                  <label className="text-xs text-gray-400">Notas do vendedor</label>
                  <Textarea
                    value={editingLead.seller_notes || ''}
                    onChange={(event) =>
                      setEditingLead((previous) => ({
                        ...previous,
                        seller_notes: event.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>Salvar alteracoes</Button>
                </div>
              </Card>
            ) : (
              <>
                <Card className="bg-gray-800/50 border-gray-700 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-lg">Detalhes do atleta</h4>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="w-3 h-3 mr-2" />
                      Editar
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DetailItem icon={<Briefcase />} label="Posicao" value={editingLead.position} />
                    <DetailItem
                      icon={<Calendar />}
                      label="Nascimento"
                      value={
                        editingLead.birth_date
                          ? new Date(editingLead.birth_date).toLocaleDateString()
                          : ''
                      }
                    />
                    <DetailItem
                      icon={<Target />}
                      label="Clube atual"
                      value={editingLead.current_club || editingLead.club}
                    />
                    <DetailItem
                      icon={<Users />}
                      label="Altura/Peso"
                      value={`${editingLead.height || '-'}cm / ${editingLead.weight || '-'}kg`}
                    />
                    <DetailItem
                      icon={<Star />}
                      label="Pe preferido"
                      value={editingLead.preferred_foot}
                    />
                    <DetailItem
                      icon={<Globe />}
                      label="Pais de interesse"
                      value={editingLead.preferred_country}
                    />

                    <div className="col-span-full">
                      <DetailItem icon={<FileText />} label="DVD/Video URL">
                        {editingLead.video_url ? (
                          <a
                            href={editingLead.video_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-400 hover:underline break-all"
                          >
                            {editingLead.video_url}
                          </a>
                        ) : (
                          <p className="text-white font-medium">Nao informado</p>
                        )}
                      </DetailItem>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700 p-6">
                  <h4 className="font-bold text-lg mb-4">Financeiro e venda</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DetailItem
                      icon={<DollarSign />}
                      label="Valor total"
                      value={formatMoney(editingLead.total_value)}
                    />
                    <DetailItem
                      icon={<CheckCircle />}
                      label="Valor pago"
                      value={formatMoney(editingLead.paid_value)}
                    />
                    <DetailItem
                      icon={<AlertCircle />}
                      label="Valor restante"
                      value={formatMoney(remainingValue)}
                    />
                    <DetailItem
                      icon={<TrendingUp />}
                      label="Status do pagamento"
                      value={editingLead.payment_status}
                    />
                    <DetailItem
                      icon={<Star />}
                      label="Eurocamp"
                      value={editingLead.will_participate_eurocamp ? 'Sim' : 'Nao'}
                    />
                    <DetailItem
                      icon={<Award />}
                      label="Campeonato EC10"
                      value={editingLead.will_participate_ec10_championship ? 'Sim' : 'Nao'}
                    />

                    <div className="col-span-full">
                      <DetailItem
                        icon={<FileText />}
                        label="Notas do vendedor"
                        value={editingLead.seller_notes}
                      />
                    </div>

                    <div className="col-span-full">
                      <DetailItem
                        icon={<AlertCircle />}
                        label="Motivo da desistencia"
                        value={editingLead.quit_reason}
                      />
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>

          <aside className="w-full max-w-sm border-l border-gray-800 bg-gray-900/50 p-4 flex flex-col">
            <h4 className="font-bold mb-4">Atividade recente</h4>
            <div className="flex-grow overflow-y-auto space-y-4">
              {interactions.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhuma interacao registrada.</p>
              ) : null}

              {interactions.map((interaction) => (
                <div key={interaction.id} className="text-sm">
                  <p className="font-semibold text-white">
                    {interaction.interaction_type} por {interaction.sales_rep || 'Sistema'}
                  </p>
                  <p className="text-gray-300">{interaction.notes}</p>
                  <p className="text-xs text-gray-500">
                    {interaction.created_date
                      ? new Date(interaction.created_date).toLocaleString()
                      : ''}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <h4 className="font-bold mb-2">Materiais disponiveis</h4>
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {salesMaterials.slice(0, 5).map((material) => (
                  <a
                    key={material.id}
                    href={material.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-sm text-sky-400 hover:underline"
                  >
                    {material.title}
                  </a>
                ))}
                {salesMaterials.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum material cadastrado.</p>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminInternationalTab({
  leads: initialLeads,
  internationalLeads: initialInternationalLeads,
  pipelines: initialPipelines,
  salesMaterials: initialSalesMaterials,
  interactions: initialInteractions,
  onRefresh,
}) {
  const [combinedLeads, setCombinedLeads] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [salesMaterials, setSalesMaterials] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [showMaterialUpload, setShowMaterialUpload] = useState(false);
  const [materialFile, setMaterialFile] = useState(null);
  const [materialForm, setMaterialForm] = useState({
    title: '',
    description: '',
    category: 'presentation',
  });

  useEffect(() => {
    const mergedLeads = [
      ...(initialLeads || []).map((lead) => ({ ...lead, type: 'general' })),
      ...(initialInternationalLeads || []).map((lead) => ({ ...lead, type: 'international' })),
    ].sort((first, second) => new Date(second.created_date) - new Date(first.created_date));

    setCombinedLeads(mergedLeads);
    setPipelines(initialPipelines || []);
    setSalesMaterials(initialSalesMaterials || []);
    setInteractions(initialInteractions || []);
  }, [
    initialInternationalLeads,
    initialInteractions,
    initialLeads,
    initialPipelines,
    initialSalesMaterials,
  ]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const lead = combinedLeads.find((item) => String(item.id) === String(draggableId));
    const newStatus = destination.droppableId;

    if (!lead || lead.status === newStatus) {
      return;
    }

    const originalLeads = [...combinedLeads];
    setCombinedLeads((previous) =>
      previous.map((item) => (item.id === lead.id ? { ...item, status: newStatus } : item)),
    );

    try {
      const leadEntity = getLeadEntity(lead.type);
      await leadEntity.update(lead.id, { status: newStatus });
      await appClient.entities.LeadInteraction.create({
        lead_id: lead.id,
        lead_type: lead.type,
        interaction_type: 'follow_up',
        notes: `Lead movido para a etapa: ${newStatus}`,
        sales_rep: 'Sistema',
      });
      toast.success(`Lead movido para ${newStatus}.`);
      onRefresh?.();
    } catch (error) {
      setCombinedLeads(originalLeads);
      toast.error('Erro ao mover lead.');
    }
  };

  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  const handleUploadMaterial = async (event) => {
    event.preventDefault();

    if (!materialFile) {
      toast.error('Selecione um arquivo para fazer upload.');
      return;
    }

    try {
      const { file_url } = await appClient.storage.uploadFile({ file: materialFile });

      await appClient.entities.SalesMaterial.create({
        ...materialForm,
        file_url,
        file_type: materialFile.type.startsWith('video/') ? 'video' : 'pdf',
      });

      toast.success('Material de venda adicionado.');
      setShowMaterialUpload(false);
      setMaterialFile(null);
      setMaterialForm({ title: '', description: '', category: 'presentation' });
      onRefresh?.();
    } catch (error) {
      toast.error('Falha ao adicionar material.');
    }
  };

  const filteredLeads = useMemo(() => {
    return combinedLeads.filter((lead) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const searchMatch =
        !normalizedSearch ||
        (lead.full_name || '').toLowerCase().includes(normalizedSearch) ||
        (lead.email || '').toLowerCase().includes(normalizedSearch);

      const priorityMatch = filterPriority === 'all' || lead.priority === filterPriority;
      return searchMatch && priorityMatch;
    });
  }, [combinedLeads, filterPriority, searchTerm]);

  const mainPipeline =
    pipelines.find((pipeline) => pipeline.name === 'Funil Principal') || DEFAULT_PIPELINE;

  const selectedLeadInteractions = interactions.filter(
    (interaction) => interaction.lead_id === selectedLead?.id,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Central de Vendas (CRM)</h3>
          <p className="text-gray-400">Gerencie todos os leads e oportunidades em um funil visual.</p>
        </div>

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
              <Input
                placeholder="Titulo do material"
                value={materialForm.title}
                onChange={(event) =>
                  setMaterialForm((previous) => ({ ...previous, title: event.target.value }))
                }
                className="bg-gray-800 border-gray-700"
                required
              />

              <Textarea
                placeholder="Descricao"
                value={materialForm.description}
                onChange={(event) =>
                  setMaterialForm((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                className="bg-gray-800 border-gray-700"
              />

              <Select
                value={materialForm.category}
                onValueChange={(value) =>
                  setMaterialForm((previous) => ({ ...previous, category: value }))
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presentation">Apresentacao</SelectItem>
                  <SelectItem value="contract">Contrato</SelectItem>
                  <SelectItem value="brochure">Brochura</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="file"
                onChange={(event) => setMaterialFile(event.target.files?.[0] || null)}
                className="bg-gray-800 border-gray-700"
                required
              />

              <DialogFooter>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
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
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="urgente">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {mainPipeline.stages.map((stage) => (
            <Droppable key={stage.name} droppableId={stage.name}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="w-72 flex-shrink-0">
                  <Card className="bg-gray-900/70 border-gray-800 h-full">
                    <CardHeader className="p-4 border-b border-gray-800">
                      <CardTitle className="text-sm font-semibold text-white flex justify-between items-center">
                        {stage.name}
                        <Badge className="bg-gray-700 text-gray-300">
                          {filteredLeads.filter((lead) => lead.status === stage.name).length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-2 h-full overflow-y-auto" style={{ maxHeight: '70vh' }}>
                      {filteredLeads
                        .filter((lead) => lead.status === stage.name)
                        .map((lead, index) => (
                          <KanbanCard
                            key={lead.id}
                            lead={lead}
                            index={index}
                            onSelectLead={handleSelectLead}
                          />
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

      {showLeadDetails && selectedLead ? (
        <LeadDetailsModal
          lead={selectedLead}
          interactions={selectedLeadInteractions}
          salesMaterials={salesMaterials}
          onClose={() => setShowLeadDetails(false)}
          onRefresh={onRefresh}
        />
      ) : null}
    </div>
  );
}
