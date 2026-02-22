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
    'home.top10': '🔥 Top 10 Mais Assistidos',
    'home.plans': 'Nossos Planos',
    'home.plans.subtitle': 'Escolha o melhor para sua carreira',
    'home.featured': 'Atletas em Destaque',
    'home.featured.subtitle': 'Jogadores EC10 em teste e negociação',
    'home.mentorship': '🎯 Mentoria',
    'home.physical': '💪 Preparação Física',
    'home.tactical': '⚽ Treino Tático',
    'home.psychology': '🧠 Psicologia Esportiva',
    'home.nutrition': '🥗 Nutrição',
    'home.content': 'Conteúdos',
    'home.viewAll': 'Ver Todos',
    
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
    'home.top10': '🔥 Top 10 Más Vistos',
    'home.plans': 'Nuestros Planes',
    'home.plans.subtitle': 'Elige el mejor para tu carrera',
    'home.featured': 'Atletas Destacados',
    'home.featured.subtitle': 'Jugadores EC10 en prueba y negociación',
    'home.mentorship': '🎯 Mentoría',
    'home.physical': '💪 Preparación Física',
    'home.tactical': '⚽ Entrenamiento Táctico',
    'home.psychology': '🧠 Psicología Deportiva',
    'home.nutrition': '🥗 Nutrición',
    'home.content': 'Contenidos',
    'home.viewAll': 'Ver Todos',
    
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