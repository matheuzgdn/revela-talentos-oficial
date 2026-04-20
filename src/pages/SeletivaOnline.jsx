
import React, { useState, useEffect } from 'react';
import { appClient } from '@/api/backendClient';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle,
  AlertCircle,
  Video,
  Search,
  User // Added User icon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ManualRegistrationModal from '../components/revelatalentos/ManualRegistrationModal';
import SeletivaEventModal from '../components/seletiva/SeletivaEventModal';
import MinhasSeletivasModal from '../components/seletiva/MinhasSeletivasModal';
import AthletePanel from '../components/seletiva/AthletePanel'; // Added AthletePanel import

export default function SeletivaOnlinePage() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showMyApplications, setShowMyApplications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [view, setView] = useState('opportunities'); // Added state for view management: 'opportunities' or 'panel'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await appClient.auth.me();
      setUser(currentUser);

      const [seletivaEvents, applications] = await Promise.all([
        appClient.entities.SeletivaEvent.filter({ is_published: true, status: 'open' }, '-created_date'),
        currentUser ? appClient.entities.SeletivaApplication.filter({ user_id: currentUser.id }, '-created_date') : Promise.resolve([])
      ]);

      setEvents(seletivaEvents);
      setMyApplications(applications);
    } catch (error) {
      setUser(null);
      const seletivaEvents = await appClient.entities.SeletivaEvent.filter({ is_published: true, status: 'open' }, '-created_date');
      setEvents(seletivaEvents);
    }
    setIsLoading(false);
  };

  const handleEventClick = (event) => {
    // Verificar se precisa completar cadastro
    if (!user || !user.onboarding_completed) {
      setShowRegistrationModal(true);
      return;
    }

    // Verificar se jÃ¡ se candidatou
    const hasApplied = myApplications.some(app => app.event_id === event.id);
    if (hasApplied) {
      setShowMyApplications(true); // Still show MinhasSeletivasModal for individual event application status
      return;
    }

    setSelectedEvent(event);
  };

  // FunÃ§Ã£o para lidar com clique no botÃ£o principal do hero
  const handleParticipateClick = () => {
    // Se nÃ£o estÃ¡ logado OU nÃ£o completou o cadastro
    if (!user || !user.onboarding_completed) {
      setShowRegistrationModal(true);
    } else {
      // Se jÃ¡ estÃ¡ logado e cadastrado, rola para as oportunidades
      setView('opportunities'); // Ensure we are on opportunities view
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  const checkEligibility = (event) => {
    if (!user) return { eligible: false, reasons: ['VocÃª precisa estar logado'] };

    const reasons = [];
    const criteria = event.criteria || {};

    if (criteria.min_age && user.age < criteria.min_age) {
      reasons.push(`Idade mÃ­nima: ${criteria.min_age} anos`);
    }
    if (criteria.max_age && user.age > criteria.max_age) {
      reasons.push(`Idade mÃ¡xima: ${criteria.max_age} anos`);
    }
    if (criteria.positions && criteria.positions.length > 0 && !criteria.positions.includes(user.position)) {
      reasons.push(`PosiÃ§Ãµes aceitas: ${criteria.positions.join(', ')}`);
    }
    if (criteria.states && criteria.states.length > 0 && !criteria.states.includes(user.state)) {
      reasons.push(`Estados aceitos: ${criteria.states.join(', ')}`);
    }

    return { eligible: reasons.length === 0, reasons };
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.event_type === filterType;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const featuredEvents = filteredEvents.filter(e => e.is_featured);
  const regularEvents = filteredEvents.filter(e => !e.is_featured);

  // Verificar se usuÃ¡rio tem cadastro completo
  const hasCompletedProfile = user && user.onboarding_completed;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/20 via-black to-black"></div>
        <img
          src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1920&q=80"
          alt="Seletiva EC10"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full mb-6 shadow-2xl shadow-yellow-500/50"
          >
            <Trophy className="w-16 h-16 text-black" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 text-white"
            style={{
              textShadow: '0 0 30px rgba(251, 191, 36, 0.5)'
            }}
          >
            SELETIVA ONLINE <span className="text-yellow-400">EC10</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
          >
            Esta Ã© a sua chance de ser visto por nossa equipe de especialistas. <br />
            Envie seus vÃ­deos, preencha seus dados e dÃª o primeiro passo para uma carreira de sucesso.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {hasCompletedProfile ? (
              // UsuÃ¡rio jÃ¡ tem cadastro completo
              <>
                <Button
                  size="lg"
                  onClick={() => setView('panel')} // Changed to setView('panel')
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold text-lg px-10 py-7 rounded-xl shadow-lg"
                >
                  <User className="w-6 h-6 mr-2" /> {/* Changed icon */}
                  Meu Painel
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setView('opportunities')} // Changed to setView('opportunities')
                  className="bg-white border-2 border-white text-black hover:bg-gray-100 font-bold text-lg px-10 py-7 rounded-xl"
                >
                  <Search className="w-6 h-6 mr-2" />
                  Explorar Oportunidades
                </Button>
              </>
            ) : (
              // UsuÃ¡rio nÃ£o tem cadastro completo (ou nÃ£o estÃ¡ logado)
              <Button
                size="lg"
                onClick={handleParticipateClick}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold text-lg px-10 py-7 rounded-xl shadow-lg animate-pulse"
              >
                <Trophy className="w-6 h-6 mr-2" />
                {user ? 'Completar Cadastro e Participar' : 'Participar da Seletiva'}
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* ConteÃºdo Principal */}
      {hasCompletedProfile && view === 'panel' ? (
        // Painel do Atleta
        <AthletePanel 
          user={user} 
          applications={myApplications}
          onUpdate={loadData} // Prop to reload data if something changes in the panel
        />
      ) : (
        // Oportunidades de Seletivas (existing content)
        <>
          {/* Filters & Search */}
          <section className="px-4 md:px-8 py-8 bg-gray-900/50">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar seletivas e oportunidades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white h-12"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white h-12">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="clube">Clubes</SelectItem>
                    <SelectItem value="evento">Eventos</SelectItem>
                    <SelectItem value="eurocamp">EuroCamp</SelectItem>
                    <SelectItem value="showcase">Showcase</SelectItem>
                    <SelectItem value="geral">Geral</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white h-12">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="open">Abertas</SelectItem>
                    <SelectItem value="closing_soon">Encerrando em Breve</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Featured Events */}
          {featuredEvents.length > 0 && (
            <section className="px-4 md:px-8 py-12">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <Star className="w-8 h-8 text-yellow-400" />
                  Oportunidades em Destaque
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredEvents.map((event, index) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      user={user}
                      applications={myApplications}
                      onClick={() => handleEventClick(event)}
                      checkEligibility={() => checkEligibility(event)}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All Events */}
          <section className="px-4 md:px-8 py-12">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-cyan-400" />
                Todas as Oportunidades ({regularEvents.length})
              </h2>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-800 rounded-lg h-96 animate-pulse"></div>
                  ))}
                </div>
              ) : regularEvents.length === 0 ? (
                <div className="text-center py-20">
                  <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Nenhuma seletiva disponÃ­vel no momento.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularEvents.map((event, index) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      user={user}
                      applications={myApplications}
                      onClick={() => handleEventClick(event)}
                      checkEligibility={() => checkEligibility(event)}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Modals */}
      <ManualRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onComplete={() => {
          setShowRegistrationModal(false);
          loadData();
        }}
      />

      {selectedEvent && (
        <SeletivaEventModal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          event={selectedEvent}
          user={user}
          onSuccess={() => {
            setSelectedEvent(null);
            loadData();
          }}
        />
      )}

      {showMyApplications && (
        <MinhasSeletivasModal
          isOpen={showMyApplications}
          onClose={() => setShowMyApplications(false)}
          applications={myApplications}
          events={events}
        />
      )}
    </div>
  );
}

function EventCard({ event, user, applications, onClick, checkEligibility, index }) {
  const hasApplied = user && applications.some(app => app.event_id === event.id);
  const myApplication = applications.find(app => app.event_id === event.id);
  const eligibility = user ? checkEligibility() : { eligible: false, reasons: [] };

  const spotsLeft = event.max_participants ? event.max_participants - event.current_participants : null;
  const isAlmostFull = spotsLeft && spotsLeft <= 10;
  const isFull = spotsLeft === 0;

  // Verificar se tem cadastro completo
  const hasCompletedProfile = user && user.onboarding_completed;

  const getStatusBadge = () => {
    if (hasApplied) {
      const statusColors = {
        pending: 'bg-yellow-500',
        under_review: 'bg-blue-500',
        approved: 'bg-green-500',
        rejected: 'bg-red-500',
        waitlist: 'bg-purple-500'
      };
      const statusLabels = {
        pending: 'Pendente',
        under_review: 'Em AnÃ¡lise',
        approved: 'Aprovado',
        rejected: 'NÃ£o Aprovado',
        waitlist: 'Lista de Espera'
      };
      return (
        <Badge className={`${statusColors[myApplication.status]} text-white`}>
          {statusLabels[myApplication.status]}
        </Badge>
      );
    }
    return null;
  };

  const getButtonText = () => {
    if (hasApplied) {
      return (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Ver Status
        </>
      );
    }
    
    // If not logged in or profile not completed, prompt for registration/completion
    if (!user || !hasCompletedProfile) {
      return (
        <>
          <Trophy className="w-4 h-4 mr-2" />
          {user ? 'Completar Cadastro para Participar' : 'Fazer Login para Participar'}
        </>
      );
    }
    
    if (isFull) {
      return 'Vagas Esgotadas';
    }
    
    if (!eligibility.eligible) {
      return 'NÃ£o ElegÃ­vel';
    }
    
    return (
      <>
        <Trophy className="w-4 h-4 mr-2" />
        Candidatar-se
      </>
    );
  };

  const isButtonDisabled = () => {
    if (hasApplied) return false; // Can always view status
    if (!user || !hasCompletedProfile) return false; // Clicks lead to registration modal, so not disabled
    if (isFull) return true; // No spots left, truly disabled
    if (!eligibility.eligible) return true; // Not eligible, truly disabled
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.03, zIndex: 10 }}
      className="cursor-pointer group"
      onClick={onClick}
    >
      <Card className="bg-gray-900 border-gray-800 overflow-hidden h-full">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={event.thumbnail_url || `https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80`}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          
          {event.is_featured && (
            <div className="absolute top-3 right-3 bg-yellow-500 p-2 rounded-lg">
              <Star className="w-5 h-5 text-black" />
            </div>
          )}

          {isFull && (
            <div className="absolute top-3 left-3 bg-red-600 px-3 py-1 rounded-full text-xs font-bold">
              VAGAS ESGOTADAS
            </div>
          )}

          {isAlmostFull && !isFull && (
            <div className="absolute top-3 left-3 bg-orange-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              ÃšLTIMAS VAGAS
            </div>
          )}

          <div className="absolute bottom-3 left-3">
            {getStatusBadge()}
          </div>
        </div>

        <CardContent className="p-5 space-y-4">
          <div>
            <h3 className="font-bold text-xl text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
              {event.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2">{event.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {event.event_type === 'clube' ? 'âš½ Clube' : 
               event.event_type === 'evento' ? 'ðŸŽ¯ Evento' :
               event.event_type === 'eurocamp' ? 'ðŸŒ EuroCamp' :
               event.event_type === 'showcase' ? 'â­ Showcase' : 'ðŸ† Geral'}
            </Badge>
            {event.is_virtual && (
              <Badge variant="outline" className="text-xs">
                <Video className="w-3 h-3 mr-1" />
                Virtual
              </Badge>
            )}
          </div>

          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>InscriÃ§Ãµes atÃ©: {new Date(event.end_date).toLocaleDateString('pt-BR')}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}
            {spotsLeft !== null && ( // Display only if max_participants is defined
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{spotsLeft} vagas restantes</span>
              </div>
            )}
          </div>

          {!hasApplied && !eligibility.eligible && hasCompletedProfile && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-xs font-semibold mb-1">CritÃ©rios nÃ£o atendidos:</p>
              <ul className="text-red-300 text-xs space-y-1">
                {eligibility.reasons.map((reason, i) => (
                  <li key={i}>â€¢ {reason}</li>
                ))}
              </ul>
            </div>
          )}

          <Button
            className={`w-full ${
              hasApplied || !isButtonDisabled()
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400'
                : 'bg-gray-700 cursor-not-allowed'
            }`}
            disabled={isButtonDisabled()}
          >
            {getButtonText()}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

