import React, { useState, useEffect, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, User as UserIcon, Star, TrendingUp, Activity, Trophy, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import VideoPlayer from "../components/content/VideoPlayer";
import LiveStreamPlayer from "../components/content/LiveStreamPlayer";
import LiveMentorias from "../components/content/LiveMentorias";
import ContentProgressTracker from "../components/content/ContentProgressTracker";
import UpgradeCtaSection from "../components/hub/UpgradeCtaSection";
import SeletivaCtaSection from "../components/seletiva/SeletivaCtaSection";
import PlanosGrid from "../components/content/PlanosGrid";
import AtletasGrid from "../components/content/AtletasGrid";
import LivesCard from "../components/content/LivesCard";
import AthleteStories from "../components/content/AthleteStories";
import InstallBanner from "../components/pwa/InstallBanner";
import PendingApproval from "../components/auth/PendingApproval";
import RevelaTalentosLanding from "../components/revelatalentos/RevelaTalentosLanding";
import { createPageUrl } from "@/utils";

const translations = {
  pt: {
    languageName: "PT",
    featured: "Em Destaque",
    heroTitle: "Revela Talentos",
    heroDescription: "Desenvolva suas habilidades com nosso conteúdo exclusivo e mentorias de alto nível.",
    watchNow: "Assistir Agora",
    minutes: "min",
    liveNow: "Mentoria ao Vivo Agora",
    liveDescription: "Participe da sessão exclusiva com nossos especialistas que está acontecendo em tempo real.",
    liveStatus: "AO VIVO",
    viewers: "Espectadores",
    continueWatching: "Continue de Onde Parou",
    recentlyCompleted: "Concluídos Recentemente",
    categories: {
      all: "Todos",
      mentoria: "Mentorias",
      treino_tatico: "Treino Tático",
      preparacao_fisica: "Preparação Física",
      psicologia: "Psicologia",
      nutricao: "Nutrição",
      planos: "Plano",
      atletas: "Atletas",
      conteudos: "Conteúdos",
    },
    home: "Início",
    watch: "Assistir",
    explore: "Explorar",
    seletiva: "Seletiva",
  },
  es: {
    languageName: "ES",
    featured: "Destacado",
    heroTitle: "Revela Talentos",
    heroDescription: "Desarrolla tus habilidades con nuestro contenido exclusivo y mentorías de alto nivel.",
    watchNow: "Ver Ahora",
    minutes: "min",
    liveNow: "Mentoría en Vivo Ahora",
    liveDescription: "Participa en la sesión exclusiva con nuestros especialistas que está ocurriendo en tiempo real.",
    liveStatus: "EN VIVO",
    viewers: "Espectadores",
    continueWatching: "Continúa Viendo",
    recentlyCompleted: "Completados Recientemente",
    categories: {
      all: "Todos",
      mentoria: "Mentorías",
      treino_tatico: "Entrenamiento Táctico",
      preparacao_fisica: "Preparación Física",
      psicologia: "Psicología",
      nutricao: "Nutrición",
      planos: "Planes",
      atletas: "Atletas",
      conteudos: "Contenidos",
    },
    home: "Inicio",
    watch: "Ver",
    explore: "Explorar",
    seletiva: "Selectiva",
  }
};

const LanguageSwitcher = ({ language, setLanguage }) => (
  <div className="fixed top-4 right-4 z-30 flex items-center gap-1 bg-black/30 backdrop-blur-xl p-1 rounded-full border border-gray-700/50">
    <button
      onClick={() => setLanguage('pt')}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        language === 'pt' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black' : 'text-gray-400 hover:text-white'
      }`}
    >
      PT
    </button>
    <button
      onClick={() => setLanguage('es')}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        language === 'es' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black' : 'text-gray-400 hover:text-white'
      }`}
    >
      ES
    </button>
  </div>
);

export default function RevelaTalentosPage() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('pt');
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isPlatformRestricted, setIsPlatformRestricted] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);
  
  const [contents, setContents] = useState([]);
  const [athleteStories, setAthleteStories] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedLiveContent, setSelectedLiveContent] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const [liveCardImage, setLiveCardImage] = useState(null);
  const [liveCardSchedule, setLiveCardSchedule] = useState("Todas as segundas às 20h");
  const [showLiveSection, setShowLiveSection] = useState(true);

  const mentoriaScrollRef = React.useRef(null);
  const treinoScrollRef = React.useRef(null);
  const preparacaoScrollRef = React.useRef(null);
  const top10ScrollRef = React.useRef(null);
  const filteredScrollRef = React.useRef(null);

  const t = translations[language];

  const loadContentData = useCallback(async (currentUser) => {
    try {
      // Load only published content with limit
      const fetchedContents = await base44.entities.Content.filter({ 
        is_published: true 
      }, "-created_date", 50).catch(() => []);
      
      setContents(fetchedContents);
      
      // Load stories in background (limit to 10)
      base44.entities.AthleteStory.filter({ is_active: true }, "display_order", 10).then(stories => {
        setAthleteStories(stories);
      }).catch(() => {});
      
      // Load user progress only if user exists (limit to recent 20)
      if (currentUser) {
        base44.entities.UserProgress.filter({ user_id: currentUser.id }, "-updated_date", 20).then(progress => {
          setUserProgress(progress);
        }).catch(() => {});
      }
      
      // Check if live section should be shown
      base44.entities.PlatformSettings.filter({ setting_key: 'show_live_card' }).then(settings => {
        if (settings.length > 0) {
          setShowLiveSection(settings[0].setting_value === 'true');
        }
      }).catch(() => {});
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  const checkAccess = useCallback(async () => {
    try {
      // Check user first
      const currentUser = await base44.auth.me().catch(() => null);
      
      if (!currentUser) {
        // Not logged in - show landing page immediately
        setShowLandingPage(true);
        setIsCheckingAccess(false);
        // Load content in background for landing page
        loadContentData(null);
        return;
      }
      
      setUser(currentUser);
      setShowLandingPage(false);
      
      // Check platform settings in background
      base44.entities.PlatformSettings.list().then(platformSettings => {
        const restrictionSetting = platformSettings.find(s => s.setting_key === 'is_platform_restricted');
        const isRestricted = restrictionSetting?.setting_value === 'true';
        setIsPlatformRestricted(isRestricted);
      }).catch(() => {});
      
      // Load content for logged in user
      loadContentData(currentUser);
      setIsCheckingAccess(false);
      
    } catch (error) {
      console.error('Error checking access:', error);
      setUser(null);
      setShowLandingPage(true);
      setIsCheckingAccess(false);
      loadContentData(null);
    }
  }, [loadContentData]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);



  const handleContentSelect = useCallback((content) => {
    if (!user) {
      setShowLandingPage(true);
      return;
    }

    if (content.category === 'live' && content.status === 'live') {
      setSelectedLiveContent(content);
      setSelectedContent(null);
    } else {
      setSelectedContent(content);
      setSelectedLiveContent(null);
    }
  }, [user]);

  const categories = useMemo(() => [
    { id: "all", name: t.categories.all, icon: Star },
    { id: "mentoria", name: t.categories.mentoria, icon: UserIcon },
    { id: "treino_tatico", name: t.categories.treino_tatico, icon: TrendingUp },
    { id: "preparacao_fisica", name: t.categories.preparacao_fisica, icon: Activity }
  ], [t]);
  
  const mentoriaContents = useMemo(() => 
    contents.filter(c => c.category === 'mentoria' && c.is_published),
    [contents]
  );
  
  const heroSlides = useMemo(() => [
    {
      type: 'primary_video',
      url: 'https://video.wixstatic.com/video/933cdd_388c6e2a108d49f089ef70033306e785/1080p/mp4/file.mp4',
      title: t.heroTitle,
      description: t.heroDescription,
    },
    ...mentoriaContents.map(content => ({
      type: 'content',
      content,
    }))
  ], [mentoriaContents, t]);
  
  useEffect(() => {
      if (heroSlides.length > 1) {
          const timer = setInterval(() => {
              setCurrentSlideIndex(prevIndex => (prevIndex + 1) % heroSlides.length);
          }, 8000);
          return () => clearInterval(timer);
      }
  }, [heroSlides.length]);

  const liveContents = useMemo(() => contents.filter(c => c.category === 'live' && c.status === 'live'), [contents]);
  const allLiveContents = useMemo(() => contents.filter(c => c.category === 'live'), [contents]);
  const planoContents = useMemo(() => contents.filter(c => c.category === 'planos'), [contents]);
  const atletaContents = useMemo(() => contents.filter(c => c.category === 'atletas'), [contents]);
  
  const regularContents = useMemo(() => contents.filter(c => {
    if (c.category === 'live' && c.status === 'ended') {
      return true;
    }
    return !['live', 'planos', 'atletas'].includes(c.category);
  }), [contents]);

  const filteredContents = useMemo(() => {
    if (activeCategory === "all") return regularContents;
    if (activeCategory === "mentoria") {
      return regularContents.filter(content => 
        content.category === 'mentoria' || 
        (content.category === 'live' && content.status === 'ended')
      );
    }
    return regularContents.filter(content => content.category === activeCategory);
  }, [activeCategory, regularContents]);

  const top10Contents = useMemo(() => regularContents.filter(c => c.is_top_10).slice(0, 10), [regularContents]);
  
  const activeSlide = heroSlides.length > 0 ? heroSlides[currentSlideIndex] : null;
  const hasFeaturedContent = useMemo(() => contents.some(c => c.is_featured), [contents]);

  const contentsByCategory = useMemo(() => ({
    mentoria: regularContents.filter(c => c.category === 'mentoria'),
    treino_tatico: regularContents.filter(c => c.category === 'treino_tatico'),
    preparacao_fisica: regularContents.filter(c => c.category === 'preparacao_fisica'),
  }), [regularContents]);

  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Show landing page immediately while checking or if error
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show pending approval screen if restricted and not approved
  if (user && isPlatformRestricted && !user.is_approved) {
    return <PendingApproval user={user} />;
  }

  // Show landing page for non-logged users
  if (showLandingPage) {
    return <RevelaTalentosLanding onLoginClick={() => base44.auth.redirectToLogin()} />;
  }

  if (selectedLiveContent) {
    return (
      <LiveStreamPlayer
        content={selectedLiveContent}
        onClose={() => setSelectedLiveContent(null)}
      />
    );
  }

  if (selectedContent) {
    return (
      <VideoPlayer
        content={selectedContent}
        onClose={() => setSelectedContent(null)}
        onProgress={checkAccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <style>{`
        .no-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Fallback styles for older browsers */
        * {
          -webkit-tap-highlight-color: transparent;
        }
        html {
          -webkit-text-size-adjust: 100%;
        }
      `}</style>

      <InstallBanner />
      <LanguageSwitcher language={language} setLanguage={setLanguage} />

      {/* Hero Section */}
      {activeSlide && (
        <section className="relative h-[70vh] md:h-[90vh] flex items-end overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 pointer-events-none" />
          
          <AnimatePresence>
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 1.5 } }}
              exit={{ opacity: 0, transition: { duration: 1 } }}
              className="absolute inset-0"
            >
              {activeSlide.type === 'primary_video' ? (
                <>
                  <video
                    src={activeSlide.url}
                    autoPlay muted loop playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-blue-500/20" />
                </>
              ) : (
                <>
                  <img
                    src={activeSlide.content.thumbnail_url || "https://images.unsplash.com/photo-1599501656247-2856b3722514?q=80&w=2070"}
                    alt={activeSlide.content.title}
                    className="w-full h-full object-cover rounded-xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent rounded-xl" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-blue-500/20 rounded-xl" />
                </>
              )}
            </motion.div>
          </AnimatePresence>
          
          <div className="relative z-10 p-4 md:p-12 max-w-6xl mx-auto w-full pb-12 md:pb-20">
            {activeSlide.type === 'content' ? (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs mb-3 shadow-lg shadow-yellow-500/50">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {t.featured}
                </Badge>
                
                <h1 className="text-3xl md:text-6xl font-black leading-tight line-clamp-2 text-white mb-3 drop-shadow-2xl">
                  {activeSlide.content.title}
                </h1>
                
                <p className="text-gray-200 text-sm md:text-xl max-w-3xl leading-relaxed line-clamp-2 md:line-clamp-3 mb-4 drop-shadow-lg">
                  {activeSlide.content.description}
                </p>

                <div className="flex items-center gap-3 md:gap-6 text-xs md:text-base text-gray-300 mb-5">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                    <span className="font-medium">{activeSlide.content.duration || 25} {t.minutes}</span>
                  </div>
                  {activeSlide.content.instructor && (
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <UserIcon className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                      <span className="truncate max-w-40 font-medium">{activeSlide.content.instructor}</span>
                    </div>
                  )}
                </div>

                <Button 
                  size="lg"
                  onClick={() => handleContentSelect(activeSlide.content)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold px-8 md:px-12 py-5 md:py-7 rounded-xl text-base md:text-xl shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all w-full md:w-auto border border-cyan-300"
                >
                  <Play className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                  {t.watchNow}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-4xl md:text-7xl font-black leading-tight text-white mb-4 drop-shadow-2xl">
                  {activeSlide.title}
                </h1>
                
                <p className="text-gray-200 text-base md:text-2xl max-w-3xl leading-relaxed line-clamp-2 md:line-clamp-3 drop-shadow-lg">
                  {activeSlide.description}
                </p>
              </motion.div>
            )}
          </div>
          
          <div className="absolute bottom-6 md:bottom-10 left-0 right-0 z-20 flex justify-center gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlideIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlideIndex === index 
                    ? 'w-12 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50' 
                    : 'w-8 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Conteúdo Principal */}
      <section className="px-4 md:px-6 py-6 md:py-10 pb-24 md:pb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 relative">
          
          {athleteStories.length > 0 && (
            <AthleteStories stories={athleteStories} />
          )}

          {showLiveSection && allLiveContents.length > 0 && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-0 md:px-0">
                📡 Transmissões ao Vivo
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
                <LivesCard 
                  liveCount={allLiveContents.length}
                  isLiveActive={liveContents.length > 0}
                  image={liveCardImage}
                  schedule={liveCardSchedule}
                />
              </div>
            </div>
          )}
          
          {liveContents.length > 0 && (
            <div>
              <LiveMentorias 
                 user={user} 
                 onContentSelect={handleContentSelect} 
                 contents={liveContents} 
                 isLoading={false}
                 translations={{ liveNow: t.liveNow, liveDescription: t.liveDescription, liveStatus: t.liveStatus, viewers: t.viewers, watchNow: t.watchNow, minutes: t.minutes }}
             />
            </div>
          )}

          {userProgress.length > 0 && (
            <div data-section="progress">
              <ContentProgressTracker 
                contents={contents} 
                userProgress={userProgress}
                onContentSelect={handleContentSelect}
                translations={{ continueWatching: t.continueWatching, recentlyCompleted: t.recentlyCompleted }}
              />
            </div>
          )}

          {planoContents.length > 0 && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-0 md:px-0">
                {t.categories.planos}
              </h2>
              <PlanosGrid 
                planos={planoContents}
                isLoading={false}
              />
            </div>
          )}

          <UpgradeCtaSection />
          <SeletivaCtaSection onParticipateClick={() => window.location.href = createPageUrl("SeletivaOnline")} />

          {top10Contents.length > 0 && (
            <div className="relative group">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-0 md:px-0">
                🔥 Top 10 Mais Assistidos
              </h2>
              
              <button
                onClick={() => scrollCarousel(top10ScrollRef, 'left')}
                className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black/90 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => scrollCarousel(top10ScrollRef, 'right')}
                className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black/90 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              <div ref={top10ScrollRef} className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                {top10Contents.map((content, index) => (
                  <div key={content.id} className="relative flex-shrink-0 w-36 md:w-44">
                    <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-black font-black text-sm w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                      {index + 1}
                    </div>
                    <div 
                      onClick={() => handleContentSelect(content)}
                      className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer group/card hover:scale-105 transition-transform shadow-lg"
                    >
                      <img 
                        src={content.thumbnail_url} 
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                        <h3 className="text-white font-bold text-xs line-clamp-2 mb-1">{content.title}</h3>
                        <div className="flex flex-col gap-0.5 text-[10px] text-gray-300">
                          {content.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{content.duration} min</span>
                            </div>
                          )}
                          {content.instructor && (
                            <div className="flex items-center gap-1">
                              <UserIcon className="w-3 h-3" />
                              <span className="truncate">{content.instructor}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity z-10">
                        <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                          <Play className="w-5 h-5 text-black ml-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Filter */}
          <div data-section="categories" className="flex gap-2 mb-6 md:mb-8 mt-6 md:mt-10 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className={`rounded-xl px-5 md:px-8 py-3 md:py-4 text-sm md:text-sm font-bold transition-all duration-300 whitespace-nowrap border-2 ${
                  activeCategory === category.id 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black border-cyan-300 shadow-lg shadow-cyan-500/50 scale-105' 
                    : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 hover:border-cyan-500/50 backdrop-blur-sm'
                }`}
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            ))}
          </div>

          {/* Conteúdos por Categoria */}
          <div className="space-y-6 md:space-y-10">
            {activeCategory === "all" ? (
              <>
                {/* Mentorias */}
                {contentsByCategory.mentoria.length > 0 && (
                  <div className="relative group">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-0 md:px-0">
                      {t.categories.mentoria}
                    </h2>

                    <button
                      onClick={() => scrollCarousel(mentoriaScrollRef, 'left')}
                      className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black/90 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={() => scrollCarousel(mentoriaScrollRef, 'right')}
                      className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black/90 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>

                    <div ref={mentoriaScrollRef} className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                      {contentsByCategory.mentoria.map((content) => {
                        const isLocked = content.access_level === 'elite' && !user?.has_plano_carreira_access;
                        
                        return (
                          <div 
                            key={content.id}
                            onClick={() => !isLocked && handleContentSelect(content)}
                            className={`relative flex-shrink-0 w-36 md:w-44 ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-105'} transition-transform`}
                          >
                            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                              <img 
                                src={content.thumbnail_url} 
                                alt={content.title}
                                className="w-full h-full object-cover"
                              />
                              
                              {isLocked && (
                                <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold z-10">
                                  ELITE
                                </div>
                              )}
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                              
                              <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                                <h3 className="text-white font-bold text-xs line-clamp-2 mb-1">{content.title}</h3>
                                <div className="flex flex-col gap-0.5 text-[10px] text-gray-300">
                                  {content.duration && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{content.duration} min</span>
                                    </div>
                                  )}
                                  {content.instructor && (
                                    <div className="flex items-center gap-1">
                                      <UserIcon className="w-3 h-3" />
                                      <span className="truncate">{content.instructor}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {!isLocked && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                                    <Play className="w-5 h-5 text-black ml-0.5" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Treino Tático */}
                {contentsByCategory.treino_tatico.length > 0 && (
                  <div className="relative group">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-0 md:px-0">
                      {t.categories.treino_tatico}
                    </h2>

                    <button
                      onClick={() => scrollCarousel(treinoScrollRef, 'left')}
                      className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black/90 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={() => scrollCarousel(treinoScrollRef, 'right')}
                      className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black/90 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>

                    <div ref={treinoScrollRef} className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                      {contentsByCategory.treino_tatico.map((content) => {
                        const isLocked = content.access_level === 'elite' && !user?.has_plano_carreira_access;
                        
                        return (
                          <div 
                            key={content.id}
                            onClick={() => !isLocked && handleContentSelect(content)}
                            className={`relative flex-shrink-0 w-36 md:w-44 ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-105'} transition-transform`}
                          >
                            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                              <img 
                                src={content.thumbnail_url} 
                                alt={content.title}
                                className="w-full h-full object-cover"
                              />
                              
                              {isLocked && (
                                <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold z-10">
                                  ELITE
                                </div>
                              )}
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                              
                              <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                                <h3 className="text-white font-bold text-xs line-clamp-2 mb-1">{content.title}</h3>
                                <div className="flex flex-col gap-0.5 text-[10px] text-gray-300">
                                  {content.duration && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{content.duration} min</span>
                                    </div>
                                  )}
                                  {content.instructor && (
                                    <div className="flex items-center gap-1">
                                      <UserIcon className="w-3 h-3" />
                                      <span className="truncate">{content.instructor}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {!isLocked && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                                    <Play className="w-5 h-5 text-black ml-0.5" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Preparação Física */}
                {contentsByCategory.preparacao_fisica.length > 0 && (
                  <div className="relative group">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-0 md:px-0">
                      {t.categories.preparacao_fisica}
                    </h2>

                    <button
                      onClick={() => scrollCarousel(preparacaoScrollRef, 'left')}
                      className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black/90 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={() => scrollCarousel(preparacaoScrollRef, 'right')}
                      className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black/90 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>

                    <div ref={preparacaoScrollRef} className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                      {contentsByCategory.preparacao_fisica.map((content) => {
                        const isLocked = content.access_level === 'elite' && !user?.has_plano_carreira_access;
                        
                        return (
                          <div 
                            key={content.id}
                            onClick={() => !isLocked && handleContentSelect(content)}
                            className={`relative flex-shrink-0 w-36 md:w-44 ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-105'} transition-transform`}
                          >
                            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                              <img 
                                src={content.thumbnail_url} 
                                alt={content.title}
                                className="w-full h-full object-cover"
                              />
                              
                              {isLocked && (
                                <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold z-10">
                                  ELITE
                                </div>
                              )}
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                              
                              <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                                <h3 className="text-white font-bold text-xs line-clamp-2 mb-1">{content.title}</h3>
                                <div className="flex flex-col gap-0.5 text-[10px] text-gray-300">
                                  {content.duration && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{content.duration} min</span>
                                    </div>
                                  )}
                                  {content.instructor && (
                                    <div className="flex items-center gap-1">
                                      <UserIcon className="w-3 h-3" />
                                      <span className="truncate">{content.instructor}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {!isLocked && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                                    <Play className="w-5 h-5 text-black ml-0.5" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="relative group">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-0 md:px-0">
                    {categories.find(c => c.id === activeCategory)?.name || 'Conteúdos'}
                  </h2>

                  <button
                    onClick={() => scrollCarousel(filteredScrollRef, 'left')}
                    className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black/90 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={() => scrollCarousel(filteredScrollRef, 'right')}
                    className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black/90 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>

                  <div ref={filteredScrollRef} className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                    {filteredContents.map((content) => {
                      const isLocked = content.access_level === 'elite' && !user?.has_plano_carreira_access;
                      
                      return (
                        <div 
                          key={content.id}
                          onClick={() => !isLocked && handleContentSelect(content)}
                          className={`relative flex-shrink-0 w-36 md:w-44 ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-105'} transition-transform`}
                        >
                          <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                            <img 
                              src={content.thumbnail_url} 
                              alt={content.title}
                              className="w-full h-full object-cover"
                            />
                            
                            {isLocked && (
                              <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold z-10">
                                ELITE
                              </div>
                            )}
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                            
                            <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                              <h3 className="text-white font-bold text-xs line-clamp-2 mb-1">{content.title}</h3>
                              <div className="flex flex-col gap-0.5 text-[10px] text-gray-300">
                                {content.duration && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{content.duration} min</span>
                                  </div>
                                )}
                                {content.instructor && (
                                  <div className="flex items-center gap-1">
                                    <UserIcon className="w-3 h-3" />
                                    <span className="truncate">{content.instructor}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {!isLocked && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                                  <Play className="w-5 h-5 text-black ml-0.5" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {atletaContents.length > 0 && (
        <section className="px-4 md:px-6 py-6 md:py-12 bg-gray-950/50 mb-20 md:mb-0">
          <div className="max-w-7xl mx-auto">
            <AtletasGrid 
              atletas={atletaContents}
              isLoading={false}
            />
          </div>
        </section>
      )}

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-gray-800/50">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          <button 
            onClick={() => window.location.href = createPageUrl("RevelaTalentos")}
            className="flex flex-col items-center justify-center py-2 text-gray-400 hover:text-white transition-colors"
          >
            <Star className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Início</span>
          </button>

          <button 
            onClick={() => {
              const section = document.querySelector('[data-section="progress"]');
              section?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center py-2 text-gray-400 hover:text-white transition-colors"
          >
            <Play className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">{t.watch}</span>
          </button>

          <button 
            onClick={() => {
              const section = document.querySelector('[data-section="categories"]');
              section?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center py-2 text-gray-400 hover:text-white transition-colors"
          >
            <Trophy className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">{t.explore}</span>
          </button>

          <button 
            onClick={() => window.location.href = createPageUrl("SeletivaOnline")}
            className="flex flex-col items-center justify-center py-2 text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <Trophy className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">{t.seletiva}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}