import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { 
  User, DollarSign, Edit2, Plus, Loader2, Paperclip, Send, Trash2, 
  CheckSquare, Square, Calendar, 
  FileText, MessageSquare, Target, Users as UsersIcon
} from 'lucide-react';

const BasicInfoSection = ({ lead, onFieldChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="text-gray-300">Nome Completo *</Label>
        <Input value={lead.full_name || ''} onChange={(e) => onFieldChange('full_name', e.target.value)} className="bg-gray-800 border-gray-700"/>
      </div>
      <div>
        <Label className="text-gray-300">ID Interno</Label>
        <Input value={lead.internal_id || ''} onChange={(e) => onFieldChange('internal_id', e.target.value)} className="bg-gray-800 border-gray-700"/>
      </div>
    </div>
    <div>
      <Label className="text-gray-300">Avatar/Foto do Atleta</Label>
      <Input value={lead.avatar_url || ''} onChange={(e) => onFieldChange('avatar_url', e.target.value)} placeholder="URL da foto" className="bg-gray-800 border-gray-700"/>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div>
        <Label className="text-gray-300">Cidade</Label>
        <Input value={lead.city || ''} onChange={(e) => onFieldChange('city', e.target.value)} className="bg-gray-800 border-gray-700"/>
      </div>
      <div>
        <Label className="text-gray-300">Estado</Label>
        <Input value={lead.state || ''} onChange={(e) => onFieldChange('state', e.target.value)} className="bg-gray-800 border-gray-700"/>
      </div>
      <div>
        <Label className="text-gray-300">País</Label>
        <Input value={lead.country || ''} onChange={(e) => onFieldChange('country', e.target.value)} className="bg-gray-800 border-gray-700"/>
      </div>
    </div>
  </div>
);

const ContactSection = ({ lead, onFieldChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="text-gray-300">Email *</Label>
        <Input type="email" value={lead.email || ''} onChange={(e) => onFieldChange('email', e.target.value)} className="bg-gray-800 border-gray-700"/>
      </div>
      <div>
        <Label className="text-gray-300">Telefone/WhatsApp</Label>
        <div className="flex gap-2">
          <Input value={lead.phone || ''} onChange={(e) => onFieldChange('phone', e.target.value)} className="bg-gray-800 border-gray-700"/>
          {lead.phone && (
            <Button size="sm" variant="outline" onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}`, '_blank')}>
              <MessageSquare className="w-4 h-4"/>
            </Button>
          )}
        </div>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div>
        <Label className="text-gray-300">Instagram</Label>
        <Input value={lead.instagram || ''} onChange={(e) => onFieldChange('instagram', e.target.value)} placeholder="@username" className="bg-gray-800 border-gray-700"/>
      </div>
      <div>
        <Label className="text-gray-300">YouTube</Label>
        <Input value={lead.youtube || ''} onChange={(e) => onFieldChange('youtube', e.target.value)} placeholder="Canal do YouTube" className="bg-gray-800 border-gray-700"/>
      </div>
      <div>
        <Label className="text-gray-300">Highlight Reel</Label>
        <Input value={lead.highlight_reel || ''} onChange={(e) => onFieldChange('highlight_reel', e.target.value)} placeholder="Link do vídeo" className="bg-gray-800 border-gray-700"/>
      </div>
    </div>
  </div>
);

const AthleteDataSection = ({ lead, onFieldChange }) => {
  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-300">Data de Nascimento</Label>
          <Input 
            type="date" 
            value={lead.birth_date || ''} 
            onChange={(e) => onFieldChange('birth_date', e.target.value)} 
            className="bg-gray-800 border-gray-700"
          />
        </div>
        <div>
          <Label className="text-gray-300">Idade</Label>
          <Input 
            value={calculateAge(lead.birth_date)} 
            disabled 
            className="bg-gray-700 border-gray-600 text-gray-300"
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label className="text-gray-300">Altura (cm)</Label>
          <Input 
            type="number" 
            value={lead.height || ''} 
            onChange={(e) => onFieldChange('height', parseInt(e.target.value))} 
            className="bg-gray-800 border-gray-700"
          />
        </div>
        <div>
          <Label className="text-gray-300">Peso (kg)</Label>
          <Input 
            type="number" 
            value={lead.weight || ''} 
            onChange={(e) => onFieldChange('weight', parseInt(e.target.value))} 
            className="bg-gray-800 border-gray-700"
          />
        </div>
        <div>
          <Label className="text-gray-300">Posição</Label>
          <Select value={lead.position || ''} onValueChange={(v) => onFieldChange('position', v)}>
            <SelectTrigger className="bg-gray-800 border-gray-700">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="goleiro">Goleiro</SelectItem>
              <SelectItem value="zagueiro">Zagueiro</SelectItem>
              <SelectItem value="lateral">Lateral</SelectItem>
              <SelectItem value="meio-campo">Meio-campo</SelectItem>
              <SelectItem value="atacante">Atacante</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-gray-300">Pé Dominante</Label>
          <Select value={lead.dominant_foot || ''} onValueChange={(v) => onFieldChange('dominant_foot', v)}>
            <SelectTrigger className="bg-gray-800 border-gray-700">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direito">Direito</SelectItem>
              <SelectItem value="esquerdo">Esquerdo</SelectItem>
              <SelectItem value="ambidestro">Ambidestro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-300">Clube Atual</Label>
          <Input value={lead.current_club || ''} onChange={(e) => onFieldChange('current_club', e.target.value)} className="bg-gray-800 border-gray-700"/>
        </div>
        <div>
          <Label className="text-gray-300">Clubes Anteriores</Label>
          <Input value={(lead.previous_clubs || []).join(', ')} onChange={(e) => onFieldChange('previous_clubs', e.target.value.split(', '))} placeholder="Separados por vírgula" className="bg-gray-800 border-gray-700"/>
        </div>
      </div>
      <div>
        <Label className="text-gray-300">Estatísticas</Label>
        <div className="grid grid-cols-5 gap-2 mt-2">
          <Input type="number" placeholder="Gols" value={lead.stats?.goals || ''} onChange={(e) => onFieldChange('stats', {...(lead.stats || {}), goals: parseInt(e.target.value) || 0})} className="bg-gray-800 border-gray-700"/>
          <Input type="number" placeholder="Assistências" value={lead.stats?.assists || ''} onChange={(e) => onFieldChange('stats', {...(lead.stats || {}), assists: parseInt(e.target.value) || 0})} className="bg-gray-800 border-gray-700"/>
          <Input type="number" placeholder="Jogos" value={lead.stats?.games || ''} onChange={(e) => onFieldChange('stats', {...(lead.stats || {}), games: parseInt(e.target.value) || 0})} className="bg-gray-800 border-gray-700"/>
          <Input type="number" placeholder="Cartões Amarelos" value={lead.stats?.yellow_cards || ''} onChange={(e) => onFieldChange('stats', {...(lead.stats || {}), yellow_cards: parseInt(e.target.value) || 0})} className="bg-gray-800 border-gray-700"/>
          <Input type="number" placeholder="Cartões Vermelhos" value={lead.stats?.red_cards || ''} onChange={(e) => onFieldChange('stats', {...(lead.stats || {}), red_cards: parseInt(e.target.value) || 0})} className="bg-gray-800 border-gray-700"/>
        </div>
      </div>
      <div>
        <Label className="text-gray-300">Vídeo do Atleta</Label>
        <Input value={lead.video_url || ''} onChange={(e) => onFieldChange('video_url', e.target.value)} placeholder="URL do vídeo" className="bg-gray-800 border-gray-700"/>
      </div>
    </div>
  );
};

const ResponsibleSection = ({ lead, onFieldChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="text-gray-300">Nome do Responsável</Label>
        <Input value={lead.responsible_name || ''} onChange={(e) => onFieldChange('responsible_name', e.target.value)} className="bg-gray-800 border-gray-700"/>
      </div>
      <div>
        <Label className="text-gray-300">Relação</Label>
        <Select value={lead.responsible_relation || ''} onValueChange={(v) => onFieldChange('responsible_relation', v)}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pai">Pai</SelectItem>
            <SelectItem value="mae">Mãe</SelectItem>
            <SelectItem value="empresario">Empresário</SelectItem>
            <SelectItem value="treinador">Treinador</SelectItem>
            <SelectItem value="tutor">Tutor</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="text-gray-300">Telefone do Responsável</Label>
        <Input value={lead.responsible_phone || ''} onChange={(e) => onFieldChange('responsible_phone', e.target.value)} className="bg-gray-800 border-gray-700"/>
      </div>
      <div>
        <Label className="text-gray-300">Email do Responsável</Label>
        <Input type="email" value={lead.responsible_email || ''} onChange={(e) => onFieldChange('responsible_email', e.target.value)} className="bg-gray-800 border-gray-700"/>
      </div>
    </div>
  </div>
);

const FinancialSection = ({ lead, onFieldChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="text-gray-300">Valor da Proposta (R$)</Label>
        <Input type="number" value={lead.value || ''} onChange={(e) => onFieldChange('value', parseFloat(e.target.value) || 0)} className="bg-gray-800 border-gray-700"/>
      </div>
      <div>
        <Label className="text-gray-300">Status do Pagamento</Label>
        <Select value={lead.payment_status || 'pending'} onValueChange={(v) => onFieldChange('payment_status', v)}>
          <SelectTrigger className="bg-gray-800 border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="partial">Pago Parcial</SelectItem>
            <SelectItem value="completed">Pago Completo</SelectItem>
            <SelectItem value="overdue">Em Atraso</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div>
      <Label className="text-gray-300">Comprovantes de Pagamento</Label>
      <Textarea 
        value={(lead.payment_receipts || []).join('\n')} 
        onChange={(e) => onFieldChange('payment_receipts', e.target.value.split('\n').filter(url => url.trim()))} 
        placeholder="URLs dos comprovantes (um por linha)" 
        className="bg-gray-800 border-gray-700 h-20"
      />
    </div>
  </div>
);

const HistorySection = ({ lead, onFieldChange }) => (
  <div className="space-y-4">
    <div>
      <Label className="text-gray-300">Origem do Lead</Label>
      <Input value={lead.lead_origin_detail || ''} onChange={(e) => onFieldChange('lead_origin_detail', e.target.value)} placeholder="Ex: Instagram via post X, Indicação de João" className="bg-gray-800 border-gray-700"/>
    </div>
    <div>
      <Label className="text-gray-300">Próximos Passos</Label>
      <Textarea value={lead.next_steps || ''} onChange={(e) => onFieldChange('next_steps', e.target.value)} placeholder="Descreva os próximos passos agendados..." className="bg-gray-800 border-gray-700"/>
    </div>
    <div>
      <Label className="text-gray-300">Anotações do Vendedor</Label>
      <Textarea value={lead.vendor_notes || ''} onChange={(e) => onFieldChange('vendor_notes', e.target.value)} placeholder="Observações internas sobre o lead..." className="bg-gray-800 border-gray-700 h-24"/>
    </div>
  </div>
);

const WhatsAppTab = ({ lead }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    setMessages([
      { direction: 'incoming', content: 'Olá, gostaria de saber mais sobre o Plano de Carreira.', timestamp: new Date().toISOString() },
      { direction: 'outgoing', content: 'Olá! Claro, posso te ajudar. Qual sua principal dúvida?', timestamp: new Date().toISOString() }
    ]);
  }, [lead.id]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, { direction: 'outgoing', content: newMessage, timestamp: new Date().toISOString() }]);
    setNewMessage('');
    toast.info("Simulação: Mensagem enviada via WhatsApp.");
  };
  
  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 space-y-2 overflow-y-auto p-2 bg-black/20 rounded">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2 rounded-lg max-w-xs text-sm ${msg.direction === 'outgoing' ? 'bg-green-600' : 'bg-gray-700'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Digite uma mensagem..." className="bg-gray-800 border-gray-700"/>
        <Button onClick={handleSend}><Send className="w-4 h-4"/></Button>
      </div>
    </div>
  );
};

const DocumentsTab = ({ lead, onUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { file_url } = await base44.storage.upload({ file });
      const newDocument = {
        name: file.name,
        url: file_url,
        type: file.type,
        uploaded_date: new Date().toISOString()
      };
      const updatedDocuments = [...(lead.documents || []), newDocument];
      onUpdate({ ...lead, documents: updatedDocuments });
      toast.success("Documento enviado com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar documento.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveDocument = (index) => {
    const updatedDocuments = lead.documents.filter((_, i) => i !== index);
    onUpdate({ ...lead, documents: updatedDocuments });
  };

  return (
    <div className="space-y-3">
      <Button asChild className="w-full">
        <label htmlFor="doc-upload">{isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Plus className="w-4 h-4 mr-2"/>} Anexar Documento</label>
      </Button>
      <Input id="doc-upload" type="file" className="hidden" onChange={handleFileUpload}/>
      <div className="text-xs text-gray-400 mb-2">Tipos: RG, Passaporte, Autorização dos pais, Carteirinha da federação, Contratos, Exames médicos</div>

      <div className="space-y-2">
        {(lead.documents || []).map((doc, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded">
            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-400 hover:underline">
              <Paperclip className="w-4 h-4"/>{doc.name}
            </a>
            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleRemoveDocument(index)}><Trash2 className="w-4 h-4"/></Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const TasksTab = ({ lead }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const loadTasks = useCallback(async () => {
    const relatedTasks = await CustomTask.filter({ related_lead_id: lead.id, related_lead_type: 'Lead' });
    setTasks(relatedTasks || []);
  }, [lead.id]);

  useEffect(() => { loadTasks() }, [loadTasks]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await CustomTask.create({ title: newTaskTitle, related_lead_id: lead.id, related_lead_type: 'Lead', status: 'pending' });
    setNewTaskTitle('');
    loadTasks();
  };
  
  const toggleTask = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await CustomTask.update(task.id, { status: newStatus });
    loadTasks();
  };

  // Checklist padrão de vendas
  const defaultChecklist = [
    'Contato inicial realizado',
    'Análise de perfil do atleta',
    'Envio de proposta comercial',
    'Reunião de apresentação agendada',
    'Negociação de valores',
    'Contrato assinado',
    'Pagamento confirmado'
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-gray-300 mb-2 block">Checklist de Vendas</Label>
        <div className="space-y-2 mb-4">
          {defaultChecklist.map((item, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
              <Square className="w-4 h-4 text-gray-500"/>
              <span className="text-sm text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-gray-300 mb-2 block">Tarefas Personalizadas</Label>
        <div className="flex gap-2 mb-3">
          <Input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Nova tarefa personalizada..." className="bg-gray-800 border-gray-700"/>
          <Button onClick={handleAddTask}><Plus className="w-4 h-4"/></Button>
        </div>
        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
              <Button variant="ghost" size="icon" onClick={() => toggleTask(task)}>
                {task.status === 'completed' ? <CheckSquare className="w-4 h-4 text-green-500"/> : <Square className="w-4 h-4 text-gray-500"/>}
              </Button>
              <span className={`flex-1 ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'}`}>{task.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function LeadDetailsModal({ lead, isOpen, onClose, onUpdate }) {
  const [currentLead, setCurrentLead] = useState(lead);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCurrentLead(lead);
  }, [lead]);

  if (!lead) return null;

  const handleFieldChange = (field, value) => {
    setCurrentLead(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { id, ...updateData } = currentLead;
      await CRMLead.update(id, updateData);
      onUpdate();
      toast.success("Lead salvo com sucesso!");
    } catch(e) {
      toast.error("Erro ao salvar lead.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl bg-gray-900 border-gray-800 text-white max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-sky-400" />
            {lead.full_name} - Gerenciamento Completo
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="flex-1 overflow-hidden">
          <TabsList className="bg-gray-800 mb-4">
            <TabsTrigger value="basic"><User className="w-4 h-4 mr-2"/>Básico</TabsTrigger>
            <TabsTrigger value="athlete"><Target className="w-4 h-4 mr-2"/>Atleta</TabsTrigger>
            <TabsTrigger value="responsible"><UsersIcon className="w-4 h-4 mr-2"/>Responsável</TabsTrigger>
            <TabsTrigger value="financial"><DollarSign className="w-4 h-4 mr-2"/>Financeiro</TabsTrigger>
            <TabsTrigger value="communication"><MessageSquare className="w-4 h-4 mr-2"/>Comunicação</TabsTrigger>
            <TabsTrigger value="tasks"><CheckSquare className="w-4 h-4 mr-2"/>Tarefas</TabsTrigger>
            <TabsTrigger value="docs"><FileText className="w-4 h-4 mr-2"/>Documentos</TabsTrigger>
            <TabsTrigger value="history"><Calendar className="w-4 h-4 mr-2"/>Histórico</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 pr-4">
            <TabsContent value="basic" className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader><CardTitle className="text-sky-400">Identificação Básica</CardTitle></CardHeader>
                <CardContent><BasicInfoSection lead={currentLead} onFieldChange={handleFieldChange} /></CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader><CardTitle className="text-sky-400">Dados de Contato</CardTitle></CardHeader>
                <CardContent><ContactSection lead={currentLead} onFieldChange={handleFieldChange} /></CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="athlete">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader><CardTitle className="text-green-400">Dados do Atleta</CardTitle></CardHeader>
                <CardContent><AthleteDataSection lead={currentLead} onFieldChange={handleFieldChange} /></CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="responsible">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader><CardTitle className="text-purple-400">Dados do Responsável</CardTitle></CardHeader>
                <CardContent><ResponsibleSection lead={currentLead} onFieldChange={handleFieldChange} /></CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader><CardTitle className="text-yellow-400">Informações Financeiras</CardTitle></CardHeader>
                <CardContent><FinancialSection lead={currentLead} onFieldChange={handleFieldChange} /></CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communication">
              <WhatsAppTab lead={currentLead} />
            </TabsContent>

            <TabsContent value="tasks">
              <TasksTab lead={currentLead} />
            </TabsContent>

            <TabsContent value="docs">
              <DocumentsTab lead={currentLead} onUpdate={setCurrentLead} />
            </TabsContent>

            <TabsContent value="history">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader><CardTitle className="text-cyan-400">Relacionamento e Histórico</CardTitle></CardHeader>
                <CardContent><HistorySection lead={currentLead} onFieldChange={handleFieldChange} /></CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="border-t border-gray-800 pt-4">
          <DialogClose asChild><Button variant="outline">Fechar</Button></DialogClose>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : "Salvar Todas as Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}