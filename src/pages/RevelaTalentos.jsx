import React, { useState, useEffect, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, User as UserIcon, Star, Bell, ChevronRight, Plus, TrendingUp, Flame, Target, Dumbbell, Brain, Activity, Apple } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import VideoPlayer from "../components/content/VideoPlayer";
import LiveStreamPlayer from "../components/content/LiveStreamPlayer";
import PendingApproval from "../components/auth/PendingApproval";
import RevelaTalentosLanding from "../components/revelatalentos/RevelaTalentosLanding";
import MobileBottomNav from "../components/mobile/MobileBottomNav";
import VideoUploadModal from "../components/mobile/VideoUploadModal";
import FifaAthleteCard from "../components/revelatalentos/FifaAthleteCard";
import NotificationsPanel from "../components/notifications/NotificationsPanel";
import { useLanguage } from "@/components/i18n/LanguageContext";
import LanguageToggle from "@/components/i18n/LanguageToggle";
import { createPageUrl } from "@/utils";

export default function RevelaTalentosPage() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isPlatformRestricted, setIsPlatformRestricted] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);
  
  const [contents, setContents] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedLiveContent, setSelectedLiveContent] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [athleteStories, setAthleteStories] = useState([]);

  const loadContentData = useCallback(async (currentUser) => {
    try {
      const fetchedContents = await base44.entities.Content.filter({ 
        is_published: true 
      }, "-created_date", 50).catch(() => []);
      setContents(fetchedContents);
      
      // Carregar atletas em destaque
      const stories = await base44.entities.AthleteStory.filter({ 
        is_active: true, 
        category: 'atleta' 
      }, "display_order", 20).catch(() => []);
      setAthleteStories(stories);
      
      if (currentUser) {
        base44.entities.UserProgress.filter({ user_id: currentUser.id }, "-updated_date", 20).then(progress => {
          setUserProgress(progress);
        }).catch(() => {});
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  const checkAccess = useCallback(async () => {
    try {
      const currentUser = await base44.auth.me().catch(() => null);
      
      if (!currentUser) {
        setShowLandingPage(true);
        setIsCheckingAccess(false);
        loadContentData(null);
        return;
      }
      
      setUser(currentUser);
      setShowLandingPage(false);
      
      base44.entities.PlatformSettings.list().then(platformSettings => {
        const restrictionSetting = platformSettings.find(s => s.setting_key === 'is_platform_restricted');
        const isRestricted = restrictionSetting?.setting_value === 'true';
        setIsPlatformRestricted(isRestricted);
      }).catch(() => {});
      
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

  useEffect(() => {
    // Create welcome notification for new users
    if (user && !user.has_seen_welcome) {
      createWelcomeNotification();
    }
  }, [user]);

  const createWelcomeNotification = async () => {
    try {
      await base44.entities.Notification.create({
        user_id: user.id,
        title: '🎉 Bem-vindo à EC10 Talentos!',
        message: 'Estamos muito felizes em ter você conosco! Explore todo o conteúdo exclusivo, participe das seletivas e acompanhe seu desenvolvimento como atleta.',
        type: 'general',
        priority: 'high',
        is_read: false
      });
      
      // Mark user as having seen welcome
      await base44.auth.updateMe({ has_seen_welcome: true });
    } catch (error) {
      console.error('Error creating welcome notification:', error);
    }
  };

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
    { id: "all", name: t('category.all') },
    { id: "mentoria", name: t('category.mentorship') },
    { id: "treino_tatico", name: t('category.tactical') },
    { id: "preparacao_fisica", name: t('category.physical') },
  ], [t]);

  const regularContents = useMemo(() => contents.filter(c => !['live', 'planos', 'atletas'].includes(c.category)), [contents]);
  
  // Hero: EC10 destaque + mentorias gravadas recentes
  const heroContents = useMemo(() => {
    const ec10Hero = {
      id: 'ec10-hero',
      title: t('home.hero.title'),
      thumbnail_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200',
      video_url: 'https://video.wixstatic.com/video/933cdd_388c6e2a108d49f089ef70033306e785/1080p/mp4/file.mp4',
      category: 'hero',
      is_featured: true
    };
    
    const mentoriasRecentes = contents
      .filter(c => c.category === 'mentoria' || (c.category === 'live' && c.status === 'ended'))
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, 9);
    
    return [ec10Hero, ...mentoriasRecentes];
  }, [contents, t]);

  const planosContents = useMemo(() => contents.filter(c => c.category === 'planos'), [contents]);
  
  // Conteúdos por categoria
  const mentoriaContents = useMemo(() => regularContents.filter(c => c.category === 'mentoria'), [regularContents]);
  const preparacaoFisicaContents = useMemo(() => regularContents.filter(c => c.category === 'preparacao_fisica'), [regularContents]);
  const treinoTaticoContents = useMemo(() => regularContents.filter(c => c.category === 'treino_tatico'), [regularContents]);
  const psicologiaContents = useMemo(() => regularContents.filter(c => c.category === 'psicologia'), [regularContents]);
  const nutricaoContents = useMemo(() => regularContents.filter(c => c.category === 'nutricao'), [regularContents]);
  
  const filteredContents = useMemo(() => {
    if (activeCategory === "all") return regularContents;
    return regularContents.filter(content => content.category === activeCategory);
  }, [activeCategory, regularContents]);

  const continueWatchingContents = useMemo(() => {
    if (!userProgress.length) return [];
    return userProgress
      .filter(p => p.progress_percent < 100)
      .map(p => contents.find(c => c.id === p.content_id))
      .filter(Boolean)
      .slice(0, 6);
  }, [userProgress, contents]);

  const top10Contents = useMemo(() => regularContents.filter(c => c.is_top_10).slice(0, 10), [regularContents]);

  useEffect(() => {
    if (heroContents.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlideIndex(prevIndex => (prevIndex + 1) % heroContents.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [heroContents.length]);

  // Loading State
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-[#00E5FF] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (user && isPlatformRestricted && !user.is_approved) {
    return <PendingApproval user={user} />;
  }

  if (showLandingPage) {
    return <RevelaTalentosLanding onLoginClick={() => base44.auth.redirectToLogin()} />;
  }

  if (selectedLiveContent) {
    return <LiveStreamPlayer content={selectedLiveContent} onClose={() => setSelectedLiveContent(null)} />;
  }

  if (selectedContent) {
    return <VideoPlayer content={selectedContent} onClose={() => setSelectedContent(null)} onProgress={checkAccess} />;
  }

  const activeSlide = heroContents[currentSlideIndex] || null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24 md:pb-0 overflow-x-hidden">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-2xl px-4 py-5 md:px-6 border-b border-[#1a1a1a]"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <p className="text-[#666] text-[10px] font-bold uppercase tracking-widest mb-0.5">{t('header.hello')}</p>
            <h1 className="text-xl font-black text-white tracking-tight">{user?.full_name || t('header.athlete')}</h1>
          </div>
          <div className="flex gap-2">
            <LanguageToggle variant="ghost" className="w-10 h-10 p-0 text-[#00E5FF] hover:bg-[#00E5FF]/10" />
            {user && <NotificationsPanel user={user} />}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadModal(true)}
              className="w-10 h-10 bg-gradient-to-br from-[#00E5FF] to-[#0066FF] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* HERO - EC10 + Mentorias Recentes */}
      <section className="px-4 md:px-6 pt-2 pb-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6 }}
              onClick={() => activeSlide?.id !== 'ec10-hero' && handleContentSelect(activeSlide)}
              className="relative aspect-[4/3] md:aspect-[16/9] rounded-[24px] overflow-hidden cursor-pointer group shadow-2xl"
            >
              {activeSlide?.id === 'ec10-hero' ? (
                <video
                  src={activeSlide.video_url}
                  autoPlay muted loop playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={activeSlide?.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200"}
                  alt={activeSlide?.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />
              
              {/* Neon glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/10 via-transparent to-[#0066FF]/10 opacity-60" />
              
              {/* Title with tech effect */}
              <div className="absolute bottom-6 left-6 right-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl">
                    {activeSlide?.title}
                  </h2>
                  {activeSlide?.id !== 'ec10-hero' && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 backdrop-blur-sm">
                        {t('category.mentorship').toUpperCase()}
                      </Badge>
                      <Play className="w-4 h-4 text-[#00E5FF]" />
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-5">
            {heroContents.slice(0, 10).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlideIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlideIndex === index 
                    ? 'w-8 bg-[#00E5FF] shadow-lg shadow-[#00E5FF]/50' 
                    : 'w-1.5 bg-[#333] hover:bg-[#555]'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map((cat, index) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                  activeCategory === cat.id 
                    ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/40' 
                    : 'bg-[#111111] text-[#666] border border-[#222] hover:border-[#00E5FF]/50 hover:text-white'
                }`}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Continue Watching */}
      {continueWatchingContents.length > 0 && (
        <section className="px-4 md:px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white tracking-tight">{t('home.continue')}</h3>
              <button className="text-[#666] text-sm hover:text-[#00E5FF] transition-colors flex items-center gap-1">
                {t('home.viewAll')} <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {continueWatchingContents.map((content, index) => (
                <ContentCard 
                  key={content.id} 
                  content={content} 
                  index={index}
                  onClick={() => handleContentSelect(content)}
                  progress={userProgress.find(p => p.content_id === content.id)?.progress_percent}
                  t={t}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Trending */}
      {top10Contents.length > 0 && (
        <section className="px-4 md:px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-black text-white tracking-tight">{t('home.top10')}</h3>
              </div>
              <button className="text-[#666] text-sm hover:text-[#00E5FF] transition-colors flex items-center gap-1">
                {t('home.viewAll')} <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {top10Contents.map((content, index) => (
                <ContentCard 
                  key={content.id} 
                  content={content} 
                  index={index}
                  onClick={() => handleContentSelect(content)}
                  showRank={true}
                  rank={index + 1}
                  t={t}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Planos Section */}
      {planosContents.length > 0 && (
        <section className="px-4 md:px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">{t('home.plans')}</h3>
                <p className="text-[#666] text-xs mt-1">{t('home.plans.subtitle')}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#00E5FF]" />
            </div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {planosContents.map((plano, index) => (
                <PlanCard 
                  key={plano.id} 
                  plano={plano} 
                  index={index}
                  onClick={() => handleContentSelect(plano)}
                  t={t}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Atletas em Destaque - FIFA Style Cards */}
      {athleteStories.length > 0 && (
        <section className="px-4 md:px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <Star className="w-6 h-6 text-[#FFD700]" fill="#FFD700" />
                  {t('home.featured')}
                </h3>
                <p className="text-[#666] text-xs mt-1">{t('home.featured.subtitle')}</p>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-4">
              {athleteStories.map((story, index) => (
                <FifaAthleteCard 
                  key={story.id} 
                  story={story} 
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mentoria Section */}
      {mentoriaContents.length > 0 && (
        <section className="px-4 md:px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-black text-white tracking-tight">{t('home.mentorship')}</h3>
              </div>
              <button className="text-[#666] text-sm hover:text-[#00E5FF] transition-colors flex items-center gap-1">
                {t('home.viewAll')} <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {mentoriaContents.map((content, index) => (
                <ContentCard 
                  key={content.id} 
                  content={content} 
                  index={index}
                  onClick={() => handleContentSelect(content)}
                  t={t}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Preparação Física Section */}
      {preparacaoFisicaContents.length > 0 && (
        <section className="px-4 md:px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-black text-white tracking-tight">{t('home.physical')}</h3>
              </div>
              <button className="text-[#666] text-sm hover:text-[#00E5FF] transition-colors flex items-center gap-1">
                {t('home.viewAll')} <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {preparacaoFisicaContents.map((content, index) => (
                <ContentCard 
                  key={content.id} 
                  content={content} 
                  index={index}
                  onClick={() => handleContentSelect(content)}
                  t={t}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Treino Tático Section */}
      {treinoTaticoContents.length > 0 && (
        <section className="px-4 md:px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-500" />
                <h3 className="text-lg font-black text-white tracking-tight">{t('home.tactical')}</h3>
              </div>
              <button className="text-[#666] text-sm hover:text-[#00E5FF] transition-colors flex items-center gap-1">
                {t('home.viewAll')} <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {treinoTaticoContents.map((content, index) => (
                <ContentCard 
                  key={content.id} 
                  content={content} 
                  index={index}
                  onClick={() => handleContentSelect(content)}
                  t={t}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Psicologia Section */}
      {psicologiaContents.length > 0 && (
        <section className="px-4 md:px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-black text-white tracking-tight">{t('home.psychology')}</h3>
              </div>
              <button className="text-[#666] text-sm hover:text-[#00E5FF] transition-colors flex items-center gap-1">
                {t('home.viewAll')} <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {psicologiaContents.map((content, index) => (
                <ContentCard 
                  key={content.id} 
                  content={content} 
                  index={index}
                  onClick={() => handleContentSelect(content)}
                  t={t}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nutrição Section */}
      {nutricaoContents.length > 0 && (
        <section className="px-4 md:px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Apple className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-black text-white tracking-tight">{t('home.nutrition')}</h3>
              </div>
              <button className="text-[#666] text-sm hover:text-[#00E5FF] transition-colors flex items-center gap-1">
                {t('home.viewAll')} <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {nutricaoContents.map((content, index) => (
                <ContentCard 
                  key={content.id} 
                  content={content} 
                  index={index}
                  onClick={() => handleContentSelect(content)}
                  t={t}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Content - Carousel Style */}
      <section className="px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-white tracking-tight">
              {activeCategory === "all" ? t('home.content') : categories.find(c => c.id === activeCategory)?.name}
            </h3>
            <button className="text-[#666] text-sm hover:text-[#00E5FF] transition-colors flex items-center gap-1">
              {t('home.viewAll')} <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {filteredContents.map((content, index) => (
              <ContentCard 
                key={content.id} 
                content={content} 
                index={index}
                onClick={() => handleContentSelect(content)}
                t={t}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <MobileBottomNav onUploadClick={() => setShowUploadModal(true)} />

      {/* Upload Modal */}
      <VideoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        user={user}
      />
    </div>
  );
}

// Content Card Component - Modern with Title Inside
function ContentCard({ content, index, onClick, progress, showRank, rank, t }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative flex-shrink-0 cursor-pointer group w-[150px] md:w-[180px]"
    >
      <div className="relative aspect-[2/3] rounded-[16px] overflow-hidden bg-[#111111] border border-[#222] shadow-lg hover:shadow-[#00E5FF]/20 transition-all duration-300">
        <img 
          src={content.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400"}
          alt={content.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent opacity-90" />
        
        {/* Neon accent on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/0 to-[#0066FF]/0 group-hover:from-[#00E5FF]/10 group-hover:to-[#0066FF]/10 transition-all duration-300" />
        
        {/* Rank Badge */}
        {showRank && (
          <div className="absolute top-3 left-3 w-8 h-8 bg-[#00E5FF] rounded-xl flex items-center justify-center shadow-lg shadow-[#00E5FF]/50">
            <span className="text-xs font-black text-black">{rank}</span>
          </div>
        )}

        {/* Progress Bar */}
        {progress && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#222]">
            <div 
              className="h-full bg-[#00E5FF] shadow-lg shadow-[#00E5FF]/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Duration Badge */}
        {content.duration && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-lg border border-[#333]">
            <span className="text-[10px] text-white font-bold">{content.duration}{t ? t('common.min') : 'min'}</span>
          </div>
        )}

        {/* Title Inside Card - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <h4 className="text-white font-bold text-sm leading-tight line-clamp-2 drop-shadow-lg">
            {content.title}
          </h4>
        </div>

        {/* Play icon on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 bg-[#00E5FF]/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl shadow-[#00E5FF]/50">
            <Play className="w-6 h-6 text-black fill-black ml-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Plan Card Component - Distinct Design
function PlanCard({ plano, index, onClick, t }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative flex-shrink-0 cursor-pointer group w-[280px] md:w-[320px]"
    >
      <div className="relative aspect-[16/10] rounded-[20px] overflow-hidden bg-gradient-to-br from-[#00E5FF]/20 via-[#0066FF]/20 to-[#0033FF]/20 border-2 border-[#00E5FF]/30 shadow-xl hover:shadow-[#00E5FF]/40 transition-all duration-300">
        <img 
          src={plano.thumbnail_url || "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600"}
          alt={plano.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
        
        {/* Neon glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/20 via-transparent to-[#0066FF]/20 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <Badge className="mb-3 bg-[#00E5FF] text-black font-black text-[10px] uppercase tracking-wider">
            {t ? t('home.plans').toUpperCase() : 'PLANO'}
          </Badge>
          <h4 className="text-white font-black text-xl leading-tight mb-2 drop-shadow-lg">
            {plano.title}
          </h4>
          {plano.description && (
            <p className="text-[#999] text-xs line-clamp-2">
              {plano.description}
            </p>
          )}
        </div>

        {/* Arrow icon */}
        <div className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#00E5FF]/30 group-hover:bg-[#00E5FF] group-hover:border-[#00E5FF] transition-all duration-300">
          <ChevronRight className="w-5 h-5 text-[#00E5FF] group-hover:text-black transition-colors" />
        </div>
      </div>
    </motion.div>
  );
}