import React, { useState, useEffect, useCallback } from "react";
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  CalendarDays, Plus, Edit, Trash2, Users, MapPin, Clock, Monitor, 
  Trophy, Zap, User, Save, Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function AdminEventsTab() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]); // Assuming you might need users for targeting
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', event_type: 'online', event_category: '',
    start_date: '', end_date: '', location: '', target_users: [],
    is_mandatory: false, max_participants: null, meeting_link: '', is_active: true
  });
  const [customCategories, setCustomCategories] = useState(['Reunião Geral', 'Análise Individual', 'Workshop', 'Palestra']);

  const eventTypes = [
    { value: 'presencial', label: 'Presencial', icon: MapPin, color: 'bg-green-600' },
    { value: 'online', label: 'Online', icon: Monitor, color: 'bg-blue-600' },
    { value: 'jogo', label: 'Jogo', icon: Trophy, color: 'bg-red-600' },
    { value: 'treino', label: 'Treino', icon: Zap, color: 'bg-yellow-600' },
    { value: 'mentoria', label: 'Mentoria', icon: User, color: 'bg-purple-600' }
  ];

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const [eventData] = await Promise.all([
          Event.list('-start_date')
          // If you need all users for the target list, fetch them here:
          // User.list() 
      ]);
      setEvents(eventData || []);
    } catch (error) {
      toast.error("Erro ao carregar eventos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({...prev, [name]: type === 'checkbox' ? checked : value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {...formData, max_participants: formData.max_participants ? parseInt(formData.max_participants) : null, target_users: formData.target_users.length === 0 ? [] : formData.target_users};
      if (editingEvent) {
        await Event.update(editingEvent.id, payload);
        toast.success("Evento atualizado!");
      } else {
        const newEvent = await Event.create(payload);
        // Simplified notification logic
        toast.success("Evento criado!");
      }
      resetForm();
      loadEvents();
    } catch (error) {
      toast.error("Erro ao salvar evento.");
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', event_type: 'online', event_category: '', start_date: '', end_date: '', location: '', target_users: [], is_mandatory: false, max_participants: null, meeting_link: '', is_active: true });
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({...event, start_date: event.start_date ? event.start_date.slice(0, 16) : '', end_date: event.end_date ? event.end_date.slice(0, 16) : ''});
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Tem certeza?")) return;
    try {
      await Event.delete(eventId);
      toast.success("Evento excluído!");
      loadEvents();
    } catch (error) {
      toast.error("Erro ao excluir evento.");
    }
  };

  const addCustomCategory = () => {
    const category = prompt("Nova categoria:");
    if (category && !customCategories.includes(category)) {
      setCustomCategories(prev => [...prev, category]);
    }
  };
  
  const getEventTypeConfig = (type) => eventTypes.find(et => et.value === type) || eventTypes[1];

  const upcomingEvents = events.filter(e => e && new Date(e.start_date) >= new Date() && e.is_active);
  const pastEvents = events.filter(e => e && new Date(e.start_date) < new Date());

  if (isLoading) {
      return (
          <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h3 className="text-lg font-semibold text-white">Agenda de Eventos</h3><Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700"><Plus className="w-4 h-4 mr-2" />Criar Evento</Button></div>
      {showForm && (<Card className="bg-gray-800 border-purple-400/50"><CardHeader><DialogTitle className="text-purple-400">{editingEvent ? 'Editar Evento' : 'Novo Evento'}</DialogTitle></CardHeader><CardContent><form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><Label htmlFor="title" className="text-white">Título do Evento</Label><Input id="title" name="title" value={formData.title} onChange={handleInputChange} className="bg-gray-700 text-white border-gray-600" required /></div><div><Label htmlFor="event_type" className="text-white">Tipo de Evento</Label><Select value={formData.event_type} onValueChange={(v) => setFormData(p => ({...p, event_type: v}))}><SelectTrigger className="bg-gray-700 text-white border-gray-600"><SelectValue /></SelectTrigger><SelectContent>{eventTypes.map(type => (<SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>))}</SelectContent></Select></div></div><div><div className="flex items-center justify-between mb-2"><Label htmlFor="event_category" className="text-white">Categoria</Label><Button type="button" variant="outline" size="sm" onClick={addCustomCategory}><Plus className="w-3 h-3 mr-1" />Nova</Button></div><Select value={formData.event_category} onValueChange={(v) => setFormData(p => ({...p, event_category: v}))}><SelectTrigger className="bg-gray-700 text-white border-gray-600"><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger><SelectContent>{customCategories.map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent></Select></div><Textarea name="description" placeholder="Descrição do evento" value={formData.description} onChange={handleInputChange} className="bg-gray-700 text-white border-gray-600" rows={3} /><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><Label htmlFor="start_date" className="text-white">Data/Hora de Início</Label><Input id="start_date" name="start_date" type="datetime-local" value={formData.start_date} onChange={handleInputChange} className="bg-gray-700 text-white border-gray-600" required /></div><div><Label htmlFor="end_date" className="text-white">Data/Hora de Fim</Label><Input id="end_date" name="end_date" type="datetime-local" value={formData.end_date} onChange={handleInputChange} className="bg-gray-700 text-white border-gray-600" /></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><Label htmlFor="location" className="text-white">Local/Link</Label><Input id="location" name="location" placeholder={formData.event_type === 'online' ? 'Link da reunião' : 'Endereço do local'} value={formData.location} onChange={handleInputChange} className="bg-gray-700 text-white border-gray-600" /></div><div><Label htmlFor="max_participants" className="text-white">Máx. Participantes</Label><Input id="max_participants" name="max_participants" type="number" placeholder="Deixe vazio para ilimitado" value={formData.max_participants || ''} onChange={handleInputChange} className="bg-gray-700 text-white border-gray-600" /></div></div><div><Label className="text-white">Participantes Alvo</Label><Select value={formData.target_users.length > 0 ? "specific" : "all"} onValueChange={(v) => { if (v === "all") { setFormData(p => ({...p, target_users: []})); } }}><SelectTrigger className="bg-gray-700 text-white border-gray-600"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos os Atletas</SelectItem><SelectItem value="specific">Atletas Específicos</SelectItem></SelectContent></Select></div><div className="flex items-center justify-between"><div className="flex items-center gap-4"><Label className="flex items-center gap-2 text-white"><Switch checked={formData.is_mandatory} onCheckedChange={(c) => setFormData(p => ({...p, is_mandatory: c}))} />Participação Obrigatória</Label><Label className="flex items-center gap-2 text-white"><Switch checked={formData.is_active} onCheckedChange={(c) => setFormData(p => ({...p, is_active: c}))} />Evento Ativo</Label></div></div><div className="flex gap-3"><Button type="submit" className="bg-purple-600 hover:bg-purple-700"><Save className="w-4 h-4 mr-2" />{editingEvent ? 'Atualizar' : 'Criar'} Evento</Button><Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button></div></form></CardContent></Card>)}
      <div className="space-y-4"><h4 className="text-lg font-medium text-white flex items-center gap-2"><CalendarDays className="w-5 h-5 text-purple-400" />Próximos Eventos ({upcomingEvents.length})</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{upcomingEvents.map(event => { const typeConfig = getEventTypeConfig(event.event_type); const Icon = typeConfig.icon; return (<Card key={event.id} className="bg-black/50 border-gray-800"><CardContent className="p-4"><div className="flex items-start justify-between mb-3"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${typeConfig.color}`}><Icon className="w-4 h-4 text-white" /></div><div><h5 className="font-semibold text-white">{event.title}</h5><p className="text-sm text-gray-400">{event.event_category}</p></div></div><div className="flex gap-2"><Button variant="ghost" size="icon" onClick={() => handleEdit(event)}><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button></div></div>{event.description && (<p className="text-sm text-gray-300 mb-3">{event.description}</p>)}<div className="space-y-2 text-sm"><div className="flex items-center gap-2 text-gray-400"><Clock className="w-4 h-4" />{new Date(event.start_date).toLocaleString()}</div>{event.location && (<div className="flex items-center gap-2 text-gray-400"><MapPin className="w-4 h-4" />{event.location}</div>)}<div className="flex items-center gap-2 text-gray-400"><Users className="w-4 h-4" />{event.target_users.length > 0 ? `${event.target_users.length} atletas` : 'Todos os atletas'}</div></div><div className="flex gap-2 mt-3">{event.is_mandatory && (<Badge className="bg-red-600 text-white text-xs">Obrigatório</Badge>)}{event.max_participants && (<Badge className="bg-blue-600 text-white text-xs">Máx. {event.max_participants}</Badge>)}<Badge className={event.is_active ? 'bg-green-600' : 'bg-gray-600'}>{event.is_active ? 'Ativo' : 'Inativo'}</Badge></div></CardContent></Card>);})}</div></div>
      {pastEvents.length > 0 && (<div className="space-y-4"><h4 className="text-lg font-medium text-gray-400 flex items-center gap-2"><Clock className="w-5 h-5" />Eventos Passados ({pastEvents.length})</h4><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{pastEvents.slice(0, 6).map(event => { const typeConfig = getEventTypeConfig(event.event_type); const Icon = typeConfig.icon; return (<Card key={event.id} className="bg-gray-900/30 border-gray-800 opacity-75"><CardContent className="p-4"><div className="flex items-center gap-3 mb-2"><div className={`p-2 rounded-lg ${typeConfig.color} opacity-60`}><Icon className="w-4 h-4 text-white" /></div><div><h5 className="font-medium text-gray-300">{event.title}</h5><p className="text-xs text-gray-500">{new Date(event.start_date).toLocaleDateString()}</p></div></div></CardContent></Card>);})}</div></div>)}
    </div>
  );
}