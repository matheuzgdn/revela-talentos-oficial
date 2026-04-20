import React, { useState } from 'react';
import { appClient } from '@/api/backendClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Trophy, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Users,
  Video,
  Calendar,
  MapPin,
  Star,
  ExternalLink,
  MessageSquare,
  Loader2,
  User as UserIcon,
  Phone,
  MapPinned,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function AdminSeletivasTab() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const queryClient = useQueryClient();

  // Queries
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['seletiva-events'],
    queryFn: () => appClient.entities.SeletivaEvent.list('-created_date'),
  });

  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ['seletiva-applications'],
    queryFn: () => appClient.entities.SeletivaApplication.list('-created_date'),
  });

  const { data: allUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const users = await appClient.entities.User.list('-created_date');
      return users;
    },
  });

  // Buscar cadastros diretos na Seletiva Online
  const { data: seletivaRegistrations = [], isLoading: registrationsLoading } = useQuery({
    queryKey: ['seletiva-registrations'],
    queryFn: () => appClient.entities.Seletiva.list('-created_date'),
  });

  // Usar cadastros da Seletiva Online (entidade Seletiva)
  const uniqueAthletes = React.useMemo(() => {
    const athleteMap = new Map();
    
    // Processar cadastros diretos da Seletiva Online
    seletivaRegistrations.forEach(reg => {
      const userRecord = allUsers.find(u => u.id === reg.user_id);
      const key = userRecord?.email || reg.user_id || reg.full_name;
      
      if (!key) return; // Skip if no identifier
      
      const athleteApplications = applications.filter(app => 
        app.user_id === reg.user_id || app.email === userRecord?.email
      );
      
      athleteMap.set(key, {
        id: reg.id,
        full_name: reg.full_name,
        email: userRecord?.email || '',
        phone: userRecord?.phone || '',
        birth_date: reg.birth_date,
        position: reg.position,
        city: userRecord?.city || '',
        state: userRecord?.state || '',
        height: reg.height,
        weight: reg.weight,
        preferred_foot: reg.preferred_foot,
        current_club: userRecord?.current_club || userRecord?.current_club_name || userRecord?.club || '',
        created_date: reg.created_date,
        applications: athleteApplications,
        user: userRecord || null,
        source: 'seletiva_online'
      });
    });
    
    return Array.from(athleteMap.values());
  }, [seletivaRegistrations, applications, allUsers]);

  // Stats
  const stats = {
    totalEvents: events.length,
    activeEvents: events.filter(e => e.status === 'open').length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === 'pending').length,
    approvedApplications: applications.filter(a => a.status === 'approved').length,
    totalAthletes: uniqueAthletes.length,
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header com Tabs */}
      <div className="flex items-center justify-between">
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="dashboard">
              <Trophy className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="w-4 h-4 mr-2" />
              Eventos ({events.length})
            </TabsTrigger>
            <TabsTrigger value="applications">
              <Users className="w-4 h-4 mr-2" />
              Candidaturas ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="athletes">
              <UserIcon className="w-4 h-4 mr-2" />
              Atletas ({uniqueAthletes.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-600 to-cyan-500 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total de Eventos</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.totalEvents}</p>
                  </div>
                  <Calendar className="w-10 h-10 text-blue-100" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600 to-emerald-500 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Eventos Ativos</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.activeEvents}</p>
                  </div>
                  <Trophy className="w-10 h-10 text-green-100" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-600 to-orange-500 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">Candidaturas Pendentes</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.pendingApplications}</p>
                  </div>
                  <Clock className="w-10 h-10 text-yellow-100" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600 to-pink-500 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total de Candidaturas</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.totalApplications}</p>
                  </div>
                  <Users className="w-10 h-10 text-purple-100" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-600 to-blue-500 border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-100 text-sm">Atletas Cadastrados</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.totalAthletes}</p>
                  </div>
                  <UserIcon className="w-10 h-10 text-cyan-100" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Applications */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Candidaturas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {applications.slice(0, 5).map((app) => {
                  const event = events.find(e => e.id === app.event_id);
                  return (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-white">{app.full_name}</p>
                        <p className="text-sm text-gray-400">{event?.title || 'Evento desconhecido'}</p>
                      </div>
                      <Badge className={getStatusColor(app.status)}>
                        {getStatusLabel(app.status)}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedApplication(app);
                          setShowApplicationModal(true);
                        }}
                        className="ml-4"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Events View */}
      {activeView === 'events' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Gestão de Eventos de Seletiva</h2>
            <Button
              onClick={() => {
                setSelectedEvent(null);
                setShowEventModal(true);
              }}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Evento
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                applications={applications.filter(a => a.event_id === event.id)}
                onEdit={() => {
                  setSelectedEvent(event);
                  setShowEventModal(true);
                }}
                onDelete={async () => {
                  if (confirm('Tem certeza que deseja excluir este evento?')) {
                    try {
                      await appClient.entities.SeletivaEvent.delete(event.id);
                      queryClient.invalidateQueries(['seletiva-events']);
                      toast.success('Evento excluído com sucesso');
                    } catch (error) {
                      toast.error('Erro ao excluir evento');
                    }
                  }
                }}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Applications View */}
      {activeView === 'applications' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome do atleta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="under_review">Em Análise</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
                <SelectItem value="waitlist">Lista de Espera</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredApplications.map((app, index) => {
              const event = events.find(e => e.id === app.event_id);
              return (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  event={event}
                  onClick={() => {
                    setSelectedApplication(app);
                    setShowApplicationModal(true);
                  }}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Athletes View */}
      {activeView === 'athletes' && (
        <AthletesView 
          athletes={uniqueAthletes}
          applications={applications}
          events={events}
          isLoading={registrationsLoading || usersLoading}
        />
      )}

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          event={selectedEvent}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
          onSave={() => {
            queryClient.invalidateQueries(['seletiva-events']);
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
        />
      )}

      {/* Application Modal */}
      {showApplicationModal && selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          event={events.find(e => e.id === selectedApplication.event_id)}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedApplication(null);
          }}
          onUpdate={() => {
            queryClient.invalidateQueries(['seletiva-applications']);
          }}
        />
      )}
    </div>
  );
}

// Event Card Component
function EventCard({ event, applications, onEdit, onDelete, index }) {
  const spotsLeft = event.max_participants ? event.max_participants - event.current_participants : null;
  const pendingCount = applications.filter(a => a.status === 'pending').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500/50 transition-colors">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={event.thumbnail_url || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            {event.is_featured && (
              <Badge className="bg-yellow-500 text-black">
                <Star className="w-3 h-3 mr-1" />
                Destaque
              </Badge>
            )}
            <Badge className={event.is_published ? 'bg-green-600' : 'bg-gray-600'}>
              {event.is_published ? 'Publicado' : 'Rascunho'}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="font-bold text-xl text-white mb-2">{event.title}</h3>
            <p className="text-gray-400 text-sm line-clamp-2">{event.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {event.event_type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {event.status}
            </Badge>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Até: {new Date(event.end_date).toLocaleDateString('pt-BR')}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span>{applications.length} candidaturas</span>
              {pendingCount > 0 && (
                <Badge className="bg-yellow-600 text-xs">
                  {pendingCount} pendentes
                </Badge>
              )}
            </div>
            {spotsLeft !== null && (
              <div className="flex items-center gap-2 text-gray-400">
                <Trophy className="w-4 h-4" />
                <span>{spotsLeft} vagas restantes</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onDelete}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Application Card Component
function ApplicationCard({ application, event, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card 
        className="bg-gray-800 border-gray-700 hover:border-yellow-500/50 transition-colors cursor-pointer"
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-lg text-white">{application.full_name}</h3>
                <Badge className={getStatusColor(application.status)}>
                  {getStatusLabel(application.status)}
                </Badge>
              </div>
              
              <p className="text-gray-400 mb-3">{event?.title || 'Evento desconhecido'}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Posição</p>
                  <p className="text-white font-medium">{application.position}</p>
                </div>
                <div>
                  <p className="text-gray-500">Cidade/Estado</p>
                  <p className="text-white font-medium">{application.city}/{application.state}</p>
                </div>
                <div>
                  <p className="text-gray-500">Idade</p>
                  <p className="text-white font-medium">
                    {application.birth_date ? calculateAge(application.birth_date) : '-'} anos
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Data</p>
                  <p className="text-white font-medium">
                    {new Date(application.created_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {application.rating && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-gray-400">Avaliação:</span>
                  <div className="flex gap-0.5">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-5 rounded ${
                          i < application.rating ? 'bg-yellow-400' : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-yellow-400 font-bold ml-2">{application.rating}/10</span>
                </div>
              )}
            </div>

            <Button size="sm" variant="ghost" className="text-yellow-400">
              <Eye className="w-4 h-4 mr-2" />
              Ver Detalhes
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Event Modal Component
function EventModal({ event, onClose, onSave }) {
  const [formData, setFormData] = useState(event || {
    title: '',
    description: '',
    event_type: 'clube',
    club_name: '',
    thumbnail_url: '',
    start_date: '',
    end_date: '',
    event_date: '',
    location: '',
    is_virtual: true,
    criteria: {
      min_age: '',
      max_age: '',
      positions: [],
      states: [],
      gender: 'ambos'
    },
    max_participants: '',
    status: 'draft',
    benefits: [],
    requirements: [],
    is_featured: false,
    is_published: false,
    registration_fee: 0
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.start_date || !formData.end_date) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSaving(true);
    try {
      if (event) {
        await appClient.entities.SeletivaEvent.update(event.id, formData);
        toast.success('Evento atualizado com sucesso');
      } else {
        await appClient.entities.SeletivaEvent.create(formData);
        toast.success('Evento criado com sucesso');
      }
      onSave();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Erro ao salvar evento');
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {event ? 'Editar Evento' : 'Novo Evento de Seletiva'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400">Informações Básicas</h3>
            
            <div>
              <Label>Título *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Peneira Flamengo Sub-17"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label>Descrição *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva a oportunidade..."
                className="bg-gray-800 border-gray-700 text-white h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Evento *</Label>
                <Select 
                  value={formData.event_type} 
                  onValueChange={(v) => setFormData({...formData, event_type: v})}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clube">Clube</SelectItem>
                    <SelectItem value="evento">Evento</SelectItem>
                    <SelectItem value="eurocamp">EuroCamp</SelectItem>
                    <SelectItem value="showcase">Showcase</SelectItem>
                    <SelectItem value="geral">Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status *</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(v) => setFormData({...formData, status: v})}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Completo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome do Clube (se aplicável)</Label>
                <Input
                  value={formData.club_name}
                  onChange={(e) => setFormData({...formData, club_name: e.target.value})}
                  placeholder="Ex: Flamengo"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label>URL da Imagem</Label>
                <Input
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                  placeholder="https://..."
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Data de Início *</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label>Data de Término *</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label>Data do Evento</Label>
                <Input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Local</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Ex: São Paulo - SP"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label>Máximo de Participantes</Label>
                <Input
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({...formData, max_participants: parseInt(e.target.value)})}
                  placeholder="Ex: 100"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_virtual}
                  onChange={(e) => setFormData({...formData, is_virtual: e.target.checked})}
                  className="w-4 h-4"
                />
                <span className="text-white">Seletiva Virtual (análise de vídeos)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                  className="w-4 h-4"
                />
                <span className="text-white">Destacar</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                  className="w-4 h-4"
                />
                <span className="text-white">Publicar</span>
              </label>
            </div>
          </div>

          {/* Criteria */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400">Critérios de Elegibilidade</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Idade Mínima</Label>
                <Input
                  type="number"
                  value={formData.criteria.min_age}
                  onChange={(e) => setFormData({
                    ...formData, 
                    criteria: {...formData.criteria, min_age: parseInt(e.target.value)}
                  })}
                  placeholder="Ex: 16"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label>Idade Máxima</Label>
                <Input
                  type="number"
                  value={formData.criteria.max_age}
                  onChange={(e) => setFormData({
                    ...formData, 
                    criteria: {...formData.criteria, max_age: parseInt(e.target.value)}
                  })}
                  placeholder="Ex: 21"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div>
              <Label>Posições Aceitas (separadas por vírgula)</Label>
              <Input
                value={formData.criteria.positions?.join(', ') || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  criteria: {
                    ...formData.criteria,
                    positions: e.target.value.split(',').map(p => p.trim()).filter(Boolean)
                  }
                })}
                placeholder="Ex: Goleiro, Zagueiro, Atacante"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label>Estados Aceitos (separados por vírgula)</Label>
              <Input
                value={formData.criteria.states?.join(', ') || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  criteria: {
                    ...formData.criteria,
                    states: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  }
                })}
                placeholder="Ex: SP, RJ, MG"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label>Gênero</Label>
              <Select 
                value={formData.criteria.gender} 
                onValueChange={(v) => setFormData({
                  ...formData,
                  criteria: {...formData.criteria, gender: v}
                })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="ambos">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Benefits & Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400">Benefícios e Requisitos</h3>
            
            <div>
              <Label>Benefícios (um por linha)</Label>
              <Textarea
                value={formData.benefits?.join('\n') || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  benefits: e.target.value.split('\n').filter(Boolean)
                })}
                placeholder="Ex: &#10;Avaliação com técnicos profissionais&#10;Possibilidade de contrato&#10;Certificado de participação"
                className="bg-gray-800 border-gray-700 text-white h-32"
              />
            </div>

            <div>
              <Label>Requisitos (um por linha)</Label>
              <Textarea
                value={formData.requirements?.join('\n') || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  requirements: e.target.value.split('\n').filter(Boolean)
                })}
                placeholder="Ex: &#10;Vídeo de jogo completo&#10;Atestado médico&#10;Documento de identidade"
                className="bg-gray-800 border-gray-700 text-white h-32"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Evento'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Application Modal Component
function ApplicationModal({ application, event, onClose, onUpdate }) {
  const [feedback, setFeedback] = useState(application.analyst_notes || '');
  const [rating, setRating] = useState(application.rating || 0);
  const [status, setStatus] = useState(application.status);
  const [feedbackText, setFeedbackText] = useState(application.feedback || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateStatus = async (newStatus) => {
    setIsSaving(true);
    try {
      await appClient.entities.SeletivaApplication.update(application.id, {
        status: newStatus,
        analyst_notes: feedback,
        rating: rating,
        feedback: feedbackText,
        reviewed_date: new Date().toISOString(),
        reviewed_by: 'admin' // TODO: Get actual admin user ID
      });
      
      toast.success('Candidatura atualizada com sucesso');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Erro ao atualizar candidatura');
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Análise de Candidatura
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Left Column - Athlete Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Athlete Details */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-yellow-400" />
                  Dados do Atleta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Nome Completo</p>
                    <p className="text-white font-medium">{application.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Data de Nascimento</p>
                    <p className="text-white font-medium">
                      {new Date(application.birth_date).toLocaleDateString('pt-BR')}
                      {' '}({calculateAge(application.birth_date)} anos)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Posição</p>
                    <p className="text-white font-medium">{application.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Cidade/Estado</p>
                    <p className="text-white font-medium">{application.city}/{application.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Altura / Peso</p>
                    <p className="text-white font-medium">{application.height}cm / {application.weight}kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Pé Preferido</p>
                    <p className="text-white font-medium">{application.preferred_foot}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Clube Atual</p>
                    <p className="text-white font-medium">{application.current_club || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Telefone</p>
                    <p className="text-white font-medium">{application.phone}</p>
                  </div>
                </div>

                {application.why_participate && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Por que quer participar</p>
                    <p className="text-white bg-gray-900 p-3 rounded-lg">{application.why_participate}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Videos */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-yellow-400" />
                  Vídeos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Vídeo Principal</p>
                  <a
                    href={application.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Assistir Vídeo
                  </a>
                </div>

                {application.additional_videos && application.additional_videos.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Vídeos Adicionais</p>
                    <div className="space-y-2">
                      {application.additional_videos.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Vídeo {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event Info */}
            {event && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Evento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-bold text-lg text-white mb-2">{event.title}</h3>
                  <p className="text-gray-400 text-sm">{event.description}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Analysis */}
          <div className="space-y-6">
            {/* Status */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm">Status Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`${getStatusColor(application.status)} w-full justify-center py-2`}>
                  {getStatusLabel(application.status)}
                </Badge>
              </CardContent>
            </Card>

            {/* Rating */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm">Avaliação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Nota:</span>
                  <span className="text-2xl font-bold text-yellow-400">{rating}/10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex gap-0.5">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setRating(i + 1)}
                      className={`flex-1 h-8 rounded cursor-pointer ${
                        i < rating ? 'bg-yellow-400' : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analyst Notes */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Observações Internas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Observações internas sobre o atleta..."
                  className="bg-gray-900 border-gray-700 text-white h-32"
                />
              </CardContent>
            </Card>

            {/* Feedback to Athlete */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Feedback para o Atleta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Feedback que será enviado ao atleta..."
                  className="bg-gray-900 border-gray-700 text-white h-32"
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => handleUpdateStatus('under_review')}
                  disabled={isSaving}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Em Análise
                </Button>
                <Button
                  onClick={() => handleUpdateStatus('approved')}
                  disabled={isSaving}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aprovar
                </Button>
                <Button
                  onClick={() => handleUpdateStatus('waitlist')}
                  disabled={isSaving}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Lista de Espera
                </Button>
                <Button
                  onClick={() => handleUpdateStatus('rejected')}
                  disabled={isSaving}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rejeitar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper functions
function getStatusColor(status) {
  const colors = {
    pending: 'bg-yellow-600',
    under_review: 'bg-blue-600',
    approved: 'bg-green-600',
    rejected: 'bg-red-600',
    waitlist: 'bg-purple-600'
  };
  return colors[status] || 'bg-gray-600';
}

function getStatusLabel(status) {
  const labels = {
    pending: 'Aguardando',
    under_review: 'Em Análise',
    approved: 'Aprovado',
    rejected: 'Não Aprovado',
    waitlist: 'Lista de Espera'
  };
  return labels[status] || status;
}

function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Athletes View Component
function AthletesView({ athletes, applications, events, isLoading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [showAthleteModal, setShowAthleteModal] = useState(false);

  const filteredAthletes = athletes.filter(athlete => {
    const name = athlete.user?.full_name || athlete.full_name || '';
    const email = athlete.user?.email || athlete.email || '';
    const search = searchTerm.toLowerCase();
    return name.toLowerCase().includes(search) || email.toLowerCase().includes(search);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Atletas Cadastrados</h2>
        <div className="flex-1 max-w-md ml-6">
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAthletes.map((athleteData, index) => {
          const athlete = athleteData.user || athleteData;
          const athleteApplications = athleteData.applications || [];
          
          return (
            <motion.div
              key={athleteData.id || athleteData.email || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="bg-gray-800 border-gray-700 hover:border-yellow-500/50 transition-colors cursor-pointer h-full"
                onClick={() => {
                  setSelectedAthlete(athleteData);
                  setShowAthleteModal(true);
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-8 h-8 text-black" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-white truncate">{athlete.full_name}</h3>
                      <p className="text-sm text-gray-400 truncate">{athlete.email}</p>
                      {!athleteData.user && (
                        <Badge className="bg-gray-600 text-xs mt-1">Sem conta criada</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {athlete.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{athlete.phone}</span>
                      </div>
                    )}

                    {athlete.position && (
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{athlete.position}</span>
                      </div>
                    )}

                    {(athlete.city || athlete.state) && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPinned className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">
                          {[athlete.city, athlete.state].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}

                    {athlete.birth_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">
                          {calculateAge(athlete.birth_date)} anos
                        </span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Candidaturas:</span>
                        <Badge className="bg-yellow-600">
                          {athleteApplications.length}
                        </Badge>
                      </div>
                      {athleteApplications.some(app => app.status === 'approved') && (
                        <div className="flex items-center gap-2 mt-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-400">Aprovado em seletiva</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-4 border-yellow-500/50 hover:bg-yellow-500/10"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredAthletes.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Nenhum atleta encontrado</p>
          </CardContent>
        </Card>
      )}

      {/* Athlete Detail Modal */}
      {showAthleteModal && selectedAthlete && (
        <AthleteDetailModal
          athlete={selectedAthlete}
          applications={selectedAthlete.applications || []}
          events={events}
          onClose={() => {
            setShowAthleteModal(false);
            setSelectedAthlete(null);
          }}
        />
      )}
    </div>
  );
}

// Athlete Detail Modal Component
function AthleteDetailModal({ athlete: athleteData, applications: allApplications, events, onClose }) {
  const athlete = athleteData.user || athleteData;
  const applications = athleteData.applications || allApplications;
  
  // Buscar dados da Seletiva para este atleta
  const [seletivaData, setSeletivaData] = React.useState(null);
  
  React.useEffect(() => {
    const fetchSeletivaData = async () => {
      if (athlete.id || athleteData.user?.id) {
        try {
          const userId = athleteData.user?.id || athlete.id;
          const registrations = await appClient.entities.Seletiva.filter({ user_id: userId });
          if (registrations.length > 0) {
            setSeletivaData(registrations[0]);
          }
        } catch (error) {
          console.error('Error fetching seletiva data:', error);
        }
      }
    };
    fetchSeletivaData();
  }, [athlete.id, athleteData.user]);
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <UserIcon className="w-6 h-6 text-yellow-400" />
            Perfil do Atleta
            {!athleteData.user && (
              <Badge className="bg-gray-600 text-sm">Sem conta criada</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Left Column - Athlete Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-yellow-400" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Nome Completo</p>
                    <p className="text-white font-medium">{athlete.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white font-medium">{athlete.email}</p>
                  </div>
                  {athlete.phone && (
                    <div>
                      <p className="text-sm text-gray-400">Telefone</p>
                      <p className="text-white font-medium">{athlete.phone}</p>
                    </div>
                  )}
                  {athlete.birth_date && (
                    <div>
                      <p className="text-sm text-gray-400">Idade</p>
                      <p className="text-white font-medium">
                        {calculateAge(athlete.birth_date)} anos
                      </p>
                    </div>
                  )}
                  {athlete.position && (
                    <div>
                      <p className="text-sm text-gray-400">Posição</p>
                      <p className="text-white font-medium">{athlete.position}</p>
                    </div>
                  )}
                  {(athlete.city || athlete.state) && (
                    <div>
                      <p className="text-sm text-gray-400">Localização</p>
                      <p className="text-white font-medium">
                        {[athlete.city, athlete.state].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  )}
                  {athlete.height && (
                    <div>
                      <p className="text-sm text-gray-400">Altura</p>
                      <p className="text-white font-medium">{athlete.height} cm</p>
                    </div>
                  )}
                  {athlete.weight && (
                    <div>
                      <p className="text-sm text-gray-400">Peso</p>
                      <p className="text-white font-medium">{athlete.weight} kg</p>
                    </div>
                  )}
                  {athlete.preferred_foot && (
                    <div>
                      <p className="text-sm text-gray-400">Pé Preferido</p>
                      <p className="text-white font-medium">{athlete.preferred_foot}</p>
                    </div>
                  )}
                  {athlete.current_club && (
                    <div>
                      <p className="text-sm text-gray-400">Clube Atual</p>
                      <p className="text-white font-medium">{athlete.current_club}</p>
                    </div>
                  )}
                </div>

                {athlete.created_date && (
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-1">Data de Cadastro</p>
                    <p className="text-white font-medium">
                      {new Date(athlete.created_date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vídeos da Seletiva Online */}
            {seletivaData && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-yellow-400" />
                    Vídeos da Seletiva Online
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {seletivaData.video_url_game && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-400">Vídeo de Jogo Completo</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(seletivaData.video_url_game, '_blank')}
                          className="text-yellow-400 border-yellow-500/50"
                        >
                          <ExternalLink className="w-3 h-3 mr-2" />
                          Assistir Vídeo
                        </Button>
                      </div>
                      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                        <iframe
                          src={seletivaData.video_url_game}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                  
                  {seletivaData.video_url_drills && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-400">Vídeo de Treinos/Habilidades</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(seletivaData.video_url_drills, '_blank')}
                          className="text-yellow-400 border-yellow-500/50"
                        >
                          <ExternalLink className="w-3 h-3 mr-2" />
                          Assistir Vídeo
                        </Button>
                      </div>
                      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                        <iframe
                          src={seletivaData.video_url_drills}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  {seletivaData.self_assessment && (
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-sm text-gray-400 mb-2">Autoavaliação do Atleta</p>
                      <p className="text-white bg-gray-900 p-3 rounded-lg">{seletivaData.self_assessment}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Applications History */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Histórico de Candidaturas ({applications.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">
                    Nenhuma candidatura ainda
                  </p>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => {
                      const event = events.find(e => e.id === app.event_id);
                      return (
                        <div 
                          key={app.id}
                          className="p-4 bg-gray-900 rounded-lg border border-gray-700"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-white">
                                {event?.title || 'Evento desconhecido'}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {new Date(app.created_date).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            <Badge className={getStatusColor(app.status)}>
                              {getStatusLabel(app.status)}
                            </Badge>
                          </div>
                          
                          {app.rating && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-gray-400">Avaliação:</span>
                              <div className="flex gap-0.5">
                                {[...Array(10)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-4 rounded ${
                                      i < app.rating ? 'bg-yellow-400' : 'bg-gray-700'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-yellow-400 font-bold text-sm ml-1">
                                {app.rating}/10
                              </span>
                            </div>
                          )}

                          {app.feedback && (
                            <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-700">
                              <p className="text-sm text-gray-400 mb-1">Feedback:</p>
                              <p className="text-white text-sm">{app.feedback}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total de Candidaturas</p>
                  <p className="text-3xl font-bold text-yellow-400">{applications.length}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Aprovações</p>
                  <p className="text-3xl font-bold text-green-400">
                    {applications.filter(a => a.status === 'approved').length}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Pendentes</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {applications.filter(a => a.status === 'pending').length}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Em Análise</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {applications.filter(a => a.status === 'under_review').length}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Access Info */}
            {athleteData.user && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-sm">Informações de Acesso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Revela Talentos</span>
                    <Badge className={athlete.has_revela_talentos_access ? 'bg-green-600' : 'bg-gray-600'}>
                      {athlete.has_revela_talentos_access ? 'Sim' : 'Não'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Plano Carreira</span>
                    <Badge className={athlete.has_plano_carreira_access ? 'bg-green-600' : 'bg-gray-600'}>
                      {athlete.has_plano_carreira_access ? 'Sim' : 'Não'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Aprovado</span>
                    <Badge className={athlete.is_approved ? 'bg-green-600' : 'bg-yellow-600'}>
                      {athlete.is_approved ? 'Sim' : 'Pendente'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
