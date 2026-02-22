import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'pt' ? 'es' : 'pt');
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['pt']?.[key] || key;
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  pt: {
    // Navigation
    'nav.revela': 'Revela Talentos',
    'nav.career': 'Plano de Carreira',
    'nav.international': 'Plano Internacional',
    'nav.services': 'Meus Serviços',
    'nav.admin': 'Admin',
    'nav.logout': 'Sair',
    'nav.login': 'Entrar',
    'nav.logout.account': 'Sair da Conta',
    'nav.login.google': 'Entrar com Google',
    
    // Header
    'header.hello': 'Olá',
    'header.athlete': 'Atleta',
    
    // Home sections
    'home.hero.title': 'EC10 TALENTOS',
    'home.continue': 'Continue Assistindo',
    'home.top10': 'Top 10 Mais Assistidos',
    'home.plans': 'Nossos Planos',
    'home.plans.subtitle': 'Escolha o melhor para sua carreira',
    'home.featured': 'Atletas em Destaque',
    'home.featured.subtitle': 'Jogadores EC10 em teste e negociação',
    'home.mentorship': 'Mentoria',
    'home.physical': 'Preparação Física',
    'home.tactical': 'Treino Tático',
    'home.psychology': 'Psicologia Esportiva',
    'home.nutrition': 'Nutrição',
    'home.content': 'Conteúdos',
    'home.viewAll': 'Ver Todos',
    
    // Profile page
    'profile.age': 'Idade',
    'profile.country': 'País',
    'profile.games': 'Jogos',
    'profile.foot': 'Pé',
    'profile.height': 'Altura',
    'profile.weight': 'Peso',
    'profile.currentClub': 'Clube Atual',
    'profile.previousClubs': 'Clubes Anteriores',
    'profile.achievements': 'Últimos Campeonatos',
    'profile.goals': 'Gols',
    'profile.points': 'Pontos',
    'profile.streak': 'Sequência de Check-ins',
    'profile.consecutiveDays': 'dias consecutivos',
    'profile.profileInfo': 'Informações do Perfil',
    'profile.analystFeedback': 'Feedback do Analista',
    'profile.onlineTryout': 'Seletiva Online',
    'profile.limitedSpots': 'Vagas limitadas',
    'profile.tryoutDescription': 'Participe da nossa próxima seletiva e seja visto por clubes profissionais',
    'profile.registerNow': 'Inscrever-se agora',
    'profile.tools': 'Ferramentas',
    'profile.performance': 'Performance',
    'profile.diary': 'Diário',
    'profile.tasks': 'Tarefas',
    'profile.trophies': 'Troféus',
    'profile.report': 'Relatório',
    'profile.viewMore': 'Ver mais',
    'profile.myVideos': 'Meus Vídeos',
    'profile.login': 'Faça Login',
    'profile.loginDescription': 'Para acessar seu perfil de atleta',
    'profile.enter': 'Entrar',
    
    // Search page
    'search.topTeams': 'TOP TEAMS',
    'search.athletesFound': 'atletas encontrados',
    'search.searchAthlete': 'Buscar atleta...',
    'search.noResults': 'Nenhum atleta encontrado',
    'search.adjustFilters': 'Tente ajustar os filtros',
    'search.allPositions': 'Todas',
    'search.goalkeeper': 'Goleiro',
    'search.defender': 'Zagueiro',
    'search.fullback': 'Lateral',
    'search.midfielder': 'Volante',
    'search.attacking': 'Meia',
    'search.forward': 'Atacante',
    
    // Videos page
    'videos.title': 'VÍDEOS',
    'videos.available': 'vídeos disponíveis',
    'videos.all': 'Todos',
    'videos.highlights': 'Destaques',
    'videos.training': 'Treino',
    'videos.matches': 'Jogos',
    'videos.skills': 'Skills',
    'videos.featured': 'DESTAQUES',
    'videos.allVideos': 'Todos os Vídeos',
    'videos.count': 'vídeos',
    'videos.noVideos': 'Nenhum vídeo encontrado',
    
    // Categories
    'category.all': 'All',
    'category.mentorship': 'Mentorias',
    'category.tactical': 'Tático',
    'category.physical': 'Físico',
    
    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.athletes': 'Atletas',
    'admin.tryouts': 'Seletivas',
    'admin.highlights': 'Destaques',
    'admin.cards': 'Figurinhas',
    'admin.stories': 'Stories',
    'admin.services': 'Serviços',
    'admin.content': 'Conteúdo',
    'admin.users': 'Usuários',
    
    // Common
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    'common.create': 'Criar',
    'common.add': 'Adicionar',
    'common.upload': 'Upload',
    'common.loading': 'Carregando...',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.active': 'Ativo',
    'common.inactive': 'Inativo',
    'common.min': 'min',
    
    // Positions
    'position.goalkeeper': 'Goleiro',
    'position.defender': 'Zagueiro',
    'position.fullback': 'Lateral',
    'position.midfielder': 'Volante',
    'position.attacking_mid': 'Meia',
    'position.forward': 'Atacante',
    
    // Stats
    'stats.games': 'Jogos',
    'stats.goals': 'Gols',
    'stats.assists': 'Assistências',
    
    // Package names
    'package.career': 'Plano de Carreira',
    'package.revela': 'Revela Talentos',
  },
  
  es: {
    // Navigation
    'nav.revela': 'Revela Talentos',
    'nav.career': 'Plan de Carrera',
    'nav.international': 'Plan Internacional',
    'nav.services': 'Mis Servicios',
    'nav.admin': 'Admin',
    'nav.logout': 'Salir',
    'nav.login': 'Entrar',
    'nav.logout.account': 'Cerrar Sesión',
    'nav.login.google': 'Entrar con Google',
    
    // Header
    'header.hello': 'Hola',
    'header.athlete': 'Atleta',
    
    // Home sections
    'home.hero.title': 'EC10 TALENTOS',
    'home.continue': 'Continuar Viendo',
    'home.top10': 'Top 10 Más Vistos',
    'home.plans': 'Nuestros Planes',
    'home.plans.subtitle': 'Elige el mejor para tu carrera',
    'home.featured': 'Atletas Destacados',
    'home.featured.subtitle': 'Jugadores EC10 en prueba y negociación',
    'home.mentorship': 'Mentoría',
    'home.physical': 'Preparación Física',
    'home.tactical': 'Entrenamiento Táctico',
    'home.psychology': 'Psicología Deportiva',
    'home.nutrition': 'Nutrición',
    'home.content': 'Contenidos',
    'home.viewAll': 'Ver Todos',
    
    // Profile page
    'profile.age': 'Edad',
    'profile.country': 'País',
    'profile.games': 'Partidos',
    'profile.foot': 'Pie',
    'profile.height': 'Altura',
    'profile.weight': 'Peso',
    'profile.currentClub': 'Club Actual',
    'profile.previousClubs': 'Clubes Anteriores',
    'profile.achievements': 'Últimos Campeonatos',
    'profile.goals': 'Goles',
    'profile.points': 'Puntos',
    'profile.streak': 'Racha de Check-ins',
    'profile.consecutiveDays': 'días consecutivos',
    'profile.profileInfo': 'Información del Perfil',
    'profile.analystFeedback': 'Feedback del Analista',
    'profile.onlineTryout': 'Selectivo Online',
    'profile.limitedSpots': 'Cupos limitados',
    'profile.tryoutDescription': 'Participa en nuestro próximo selectivo y sé visto por clubes profesionales',
    'profile.registerNow': 'Registrarse ahora',
    'profile.tools': 'Herramientas',
    'profile.performance': 'Rendimiento',
    'profile.diary': 'Diario',
    'profile.tasks': 'Tareas',
    'profile.trophies': 'Trofeos',
    'profile.report': 'Informe',
    'profile.viewMore': 'Ver más',
    'profile.myVideos': 'Mis Videos',
    'profile.login': 'Iniciar Sesión',
    'profile.loginDescription': 'Para acceder a tu perfil de atleta',
    'profile.enter': 'Entrar',
    
    // Search page
    'search.topTeams': 'TOP TEAMS',
    'search.athletesFound': 'atletas encontrados',
    'search.searchAthlete': 'Buscar atleta...',
    'search.noResults': 'Ningún atleta encontrado',
    'search.adjustFilters': 'Intenta ajustar los filtros',
    'search.allPositions': 'Todas',
    'search.goalkeeper': 'Portero',
    'search.defender': 'Defensa',
    'search.fullback': 'Lateral',
    'search.midfielder': 'Volante',
    'search.attacking': 'Mediocampista',
    'search.forward': 'Delantero',
    
    // Videos page
    'videos.title': 'VIDEOS',
    'videos.available': 'videos disponibles',
    'videos.all': 'Todos',
    'videos.highlights': 'Destacados',
    'videos.training': 'Entrenamiento',
    'videos.matches': 'Partidos',
    'videos.skills': 'Habilidades',
    'videos.featured': 'DESTACADOS',
    'videos.allVideos': 'Todos los Videos',
    'videos.count': 'videos',
    'videos.noVideos': 'Ningún video encontrado',
    
    // Categories
    'category.all': 'Todos',
    'category.mentorship': 'Mentorías',
    'category.tactical': 'Táctico',
    'category.physical': 'Físico',
    
    // Admin
    'admin.dashboard': 'Panel',
    'admin.athletes': 'Atletas',
    'admin.tryouts': 'Selectivos',
    'admin.highlights': 'Destacados',
    'admin.cards': 'Tarjetas',
    'admin.stories': 'Historias',
    'admin.services': 'Servicios',
    'admin.content': 'Contenido',
    'admin.users': 'Usuarios',
    
    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.create': 'Crear',
    'common.add': 'Agregar',
    'common.upload': 'Subir',
    'common.loading': 'Cargando...',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.active': 'Activo',
    'common.inactive': 'Inactivo',
    'common.min': 'min',
    
    // Positions
    'position.goalkeeper': 'Portero',
    'position.defender': 'Defensa',
    'position.fullback': 'Lateral',
    'position.midfielder': 'Volante',
    'position.attacking_mid': 'Mediocampista',
    'position.forward': 'Delantero',
    
    // Stats
    'stats.games': 'Partidos',
    'stats.goals': 'Goles',
    'stats.assists': 'Asistencias',
    
    // Package names
    'package.career': 'Plan de Carrera',
    'package.revela': 'Revela Talentos',
  }
};