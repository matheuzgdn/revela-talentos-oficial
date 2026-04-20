import React, { useCallback, useEffect, useState } from 'react';
import { appClient } from '@/api/backendClient';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  CalendarDays,
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
  Clock,
  Monitor,
  Trophy,
  Zap,
  User,
  Save,
  Loader2,
  Link as LinkIcon,
} from 'lucide-react';
import { toast } from 'sonner';

const EMPTY_FORM = {
  title: '',
  description: '',
  event_type: 'online',
  event_category: '',
  start_date: '',
  end_date: '',
  location: '',
  meeting_link: '',
  target_users: [],
  is_mandatory: false,
  max_participants: '',
  is_active: true,
};

const EVENT_TYPES = [
  { value: 'presencial', label: 'Presencial', icon: MapPin, color: 'bg-green-600' },
  { value: 'online', label: 'Online', icon: Monitor, color: 'bg-blue-600' },
  { value: 'jogo', label: 'Jogo', icon: Trophy, color: 'bg-red-600' },
  { value: 'treino', label: 'Treino', icon: Zap, color: 'bg-yellow-600' },
  { value: 'mentoria', label: 'Mentoria', icon: User, color: 'bg-purple-600' },
];

const formatDateInput = (value) => (value ? String(value).slice(0, 16) : '');

export default function AdminEventsTab() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [customCategories, setCustomCategories] = useState([
    'Reuniao Geral',
    'Analise Individual',
    'Workshop',
    'Palestra',
  ]);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const eventData = await appClient.entities.Event.list('-start_date');
      setEvents(eventData || []);
    } catch (error) {
      toast.error('Erro ao carregar eventos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      max_participants: formData.max_participants ? Number(formData.max_participants) : null,
      target_users: Array.isArray(formData.target_users) ? formData.target_users : [],
    };

    try {
      if (editingEvent) {
        await appClient.entities.Event.update(editingEvent.id, payload);
        toast.success('Evento atualizado com sucesso.');
      } else {
        await appClient.entities.Event.create(payload);
        toast.success('Evento criado com sucesso.');
      }

      resetForm();
      loadEvents();
    } catch (error) {
      toast.error('Erro ao salvar evento.');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      ...EMPTY_FORM,
      ...event,
      start_date: formatDateInput(event.start_date),
      end_date: formatDateInput(event.end_date),
      max_participants: event.max_participants ?? '',
      target_users: Array.isArray(event.target_users) ? event.target_users : [],
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Tem certeza que deseja excluir este evento?')) {
      return;
    }

    try {
      await appClient.entities.Event.delete(eventId);
      toast.success('Evento excluido com sucesso.');
      loadEvents();
    } catch (error) {
      toast.error('Erro ao excluir evento.');
    }
  };

  const addCustomCategory = () => {
    const category = window.prompt('Nova categoria:');

    if (category && !customCategories.includes(category)) {
      setCustomCategories((previous) => [...previous, category]);
      setFormData((previous) => ({ ...previous, event_category: category }));
    }
  };

  const getEventTypeConfig = (type) =>
    EVENT_TYPES.find((eventType) => eventType.value === type) || EVENT_TYPES[1];

  const upcomingEvents = events.filter((event) => event?.start_date && new Date(event.start_date) >= new Date());
  const pastEvents = events.filter((event) => event?.start_date && new Date(event.start_date) < new Date());

  const renderEventCard = (event, muted = false) => {
    const typeConfig = getEventTypeConfig(event.event_type);
    const Icon = typeConfig.icon;
    const audienceSize = Array.isArray(event.target_users) ? event.target_users.length : 0;
    const place = event.meeting_link || event.location;

    return (
      <Card
        key={event.id}
        className={`border-gray-800 ${muted ? 'bg-gray-900/30 opacity-75' : 'bg-black/50'}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${typeConfig.color} ${muted ? 'opacity-60' : ''}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-white">{event.title}</h5>
                <p className="text-sm text-gray-400">{event.event_category || 'Sem categoria'}</p>
              </div>
            </div>

            {!muted && (
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            )}
          </div>

          {event.description ? (
            <p className="text-sm text-gray-300 mb-3">{event.description}</p>
          ) : null}

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              {event.start_date ? new Date(event.start_date).toLocaleString() : 'Sem data'}
            </div>

            {place ? (
              <div className="flex items-center gap-2 text-gray-400">
                {event.meeting_link ? <LinkIcon className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                <span className="truncate">{place}</span>
              </div>
            ) : null}

            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4" />
              {audienceSize > 0 ? `${audienceSize} atletas selecionados` : 'Todos os atletas'}
            </div>
          </div>

          {!muted && (
            <div className="flex flex-wrap gap-2 mt-3">
              {event.is_mandatory ? (
                <Badge className="bg-red-600 text-white text-xs">Obrigatorio</Badge>
              ) : null}
              {event.max_participants ? (
                <Badge className="bg-blue-600 text-white text-xs">Max. {event.max_participants}</Badge>
              ) : null}
              <Badge className={event.is_active ? 'bg-green-600' : 'bg-gray-600'}>
                {event.is_active ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Agenda de Eventos</h3>
        <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Criar Evento
        </Button>
      </div>

      {showForm ? (
        <Card className="bg-gray-800 border-purple-400/50">
          <CardHeader>
            <DialogTitle className="text-purple-400">
              {editingEvent ? 'Editar Evento' : 'Novo Evento'}
            </DialogTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Titulo do evento
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white border-gray-600"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="event_type" className="text-white">
                    Tipo de evento
                  </Label>
                  <Select
                    value={formData.event_type}
                    onValueChange={(value) => setFormData((previous) => ({ ...previous, event_type: value }))}
                  >
                    <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="event_category" className="text-white">
                    Categoria
                  </Label>
                  <Button type="button" variant="outline" size="sm" onClick={addCustomCategory}>
                    <Plus className="w-3 h-3 mr-1" />
                    Nova
                  </Button>
                </div>
                <Select
                  value={formData.event_category}
                  onValueChange={(value) =>
                    setFormData((previous) => ({ ...previous, event_category: value }))
                  }
                >
                  <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {customCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                name="description"
                placeholder="Descricao do evento"
                value={formData.description}
                onChange={handleInputChange}
                className="bg-gray-700 text-white border-gray-600"
                rows={3}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date" className="text-white">
                    Data/hora de inicio
                  </Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white border-gray-600"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="end_date" className="text-white">
                    Data/hora de fim
                  </Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-white">
                    Local
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Endereco ou referencia"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="meeting_link" className="text-white">
                    Link da reuniao
                  </Label>
                  <Input
                    id="meeting_link"
                    name="meeting_link"
                    placeholder="https://..."
                    value={formData.meeting_link}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max_participants" className="text-white">
                    Maximo de participantes
                  </Label>
                  <Input
                    id="max_participants"
                    name="max_participants"
                    type="number"
                    placeholder="Vazio para ilimitado"
                    value={formData.max_participants}
                    onChange={handleInputChange}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>

                <div className="flex items-center gap-6 pt-8">
                  <Label className="flex items-center gap-2 text-white">
                    <Switch
                      checked={formData.is_mandatory}
                      onCheckedChange={(checked) =>
                        setFormData((previous) => ({ ...previous, is_mandatory: checked }))
                      }
                    />
                    Participacao obrigatoria
                  </Label>

                  <Label className="flex items-center gap-2 text-white">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) =>
                        setFormData((previous) => ({ ...previous, is_active: checked }))
                      }
                    />
                    Evento ativo
                  </Label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  {editingEvent ? 'Atualizar Evento' : 'Criar Evento'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-purple-400" />
          Proximos Eventos ({upcomingEvents.length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingEvents.map((event) => renderEventCard(event))}
        </div>
      </div>

      {pastEvents.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-400 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Eventos Passados ({pastEvents.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pastEvents.slice(0, 6).map((event) => renderEventCard(event, true))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
