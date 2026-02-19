import React, { useState, useEffect, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, Bell, ChevronRight, Star, Flame, Dumbbell, Brain, Trophy } from "lucide-react";
import VideoPlayer from "../components/content/VideoPlayer";
import LiveStreamPlayer from "../components/content/LiveStreamPlayer";
import PendingApproval from "../components/auth/PendingApproval";
import RevelaTalentosLanding from "../components/revelatalentos/RevelaTalentosLanding";
import MobileBottomNav from "../components/mobile/MobileBottomNav";
import VideoUploadModal from "../components/mobile/VideoUploadModal";

export default function RevelaTalentosPage() {
  const [user, setUser] = useState(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isPlatformRestricted, setIsPlatformRestricted] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);
  
  const [contents, setContents] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedLiveContent, setSelectedLiveContent] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const loadContentData = useCallback(async (currentUser) => {
    try {
      const fetchedContents = await base44.entities.Content.filter({ 
        is_published: true 
      }, "-created_date", 100).catch(() => []);
      setContents(fetchedContents);
      
      if (currentUser) {
        base44.entities.UserProgress.filter({ user_id: currentUser.id }, "-updated_date", 30).then(progress => {
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
      loadContentData(currentUser);
      setIsCheckingAccess(false);
      
    } catch (error) {
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

  // Content Categories
  const featuredContents = useMemo(() => contents.filter(c => c.is_featured).slice(0, 5), [contents]);
  const activeHeroContent = featuredContents[heroIndex] || featuredContents[0];
  
  const filters = [
    { id: "all", label: "All" },
    { id: "mentoria", label: "Mentorias" },
    { id: "treino_tatico", label: "Tático" },
    { id: "preparacao_fisica", label: "Físico" },
    { id: "psicologia", label: "Psicologia" },
  ];

  const filteredContents = useMemo(() => {
    if (activeFilter === "all") return contents;
    return contents.filter(c => c.category === activeFilter);
  }, [contents, activeFilter]);

  const continueWatchingContents = useMemo(() => {
    if (!userProgress.length) return [];
    return userProgress
      .filter(p => p.progress_percentage > 0 && p.progress_percentage < 100)
      .map(p => {
        const content = contents.find(c => c.id === p.content_id);
        return content ? { ...content, progress: p.progress_percentage } : null;
      })
      .filter(Boolean)
      .slice(0, 10);
  }, [userProgress, contents]);

  const topTrendingContents = useMemo(() => contents.filter(c => c.is_top_10).slice(0, 10), [contents]);

  // Auto rotate hero
  useEffect(() => {
    if (featuredContents.length > 1) {
      const timer = setInterval(() => {
        setHeroIndex(prev => (prev + 1) % featuredContents.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredContents.length]);

  // Loading
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

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24 md:pb-6 overflow-x-hidden">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4">
        <div>
          <p className="text-[#888] text-xs">Hello</p>
          <h1 className="text-lg font-bold text-white">{user?.full_name || "Atleta"}</h1>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center relative"
        >
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </motion.button>
      </header>

      {/* HERO BANNER */}
      <section className="px-4 mb-4">
        <AnimatePresence mode="wait">
          {activeHeroContent && (
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleContentSelect(activeHeroContent)}
              className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer"
            >
              <img 
                src={activeHeroContent.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800"}
                alt={activeHeroContent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* Title overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-xl font-bold text-white line-clamp-2">{activeHeroContent.title}</h2>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-3">
          {featuredContents.map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                heroIndex === index ? 'w-6 bg-white' : 'w-2 bg-[#444]'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Category Filters */}
      <section className="px-4 mb-6">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`relative pb-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter.id ? 'text-white' : 'text-[#666]'
              }`}
            >
              {filter.label}
              {activeFilter === filter.id && (
                <motion.div 
                  layoutId="filterIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Continue Watching */}
      {continueWatchingContents.length > 0 && (
        <ContentSection 
          title="Continue Watching"
          contents={continueWatchingContents}
          onSelect={handleContentSelect}
          showProgress
        />
      )}

      {/* Top Trending */}
      {topTrendingContents.length > 0 && (
        <ContentSection 
          title="Top Trending"
          contents={topTrendingContents}
          onSelect={handleContentSelect}
        />
      )}

      {/* Filtered Content */}
      {activeFilter !== "all" && filteredContents.length > 0 && (
        <ContentSection 
          title={filters.find(f => f.id === activeFilter)?.label || "Conteúdos"}
          contents={filteredContents}
          onSelect={handleContentSelect}
        />
      )}

      {/* All Content when filter is "all" */}
      {activeFilter === "all" && (
        <>
          <ContentSection 
            title="Mentorias"
            contents={contents.filter(c => c.category === 'mentoria')}
            onSelect={handleContentSelect}
          />
          <ContentSection 
            title="Treino Tático"
            contents={contents.filter(c => c.category === 'treino_tatico')}
            onSelect={handleContentSelect}
          />
          <ContentSection 
            title="Preparação Física"
            contents={contents.filter(c => c.category === 'preparacao_fisica')}
            onSelect={handleContentSelect}
          />
        </>
      )}

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

// Content Section Component
function ContentSection({ title, contents, onSelect, showProgress }) {
  if (!contents || contents.length === 0) return null;
  
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <button className="text-[#888] text-xs flex items-center gap-0.5">
          View All <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
        {contents.slice(0, 10).map((content, index) => (
          <motion.div
            key={content.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(content)}
            className="relative flex-shrink-0 w-[140px] cursor-pointer"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1a1a1a]">
              <img 
                src={content.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300"}
                alt={content.title}
                className="w-full h-full object-cover"
              />
              
              {/* Duration badge */}
              {content.duration && (
                <div className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-white">
                  {content.duration}min
                </div>
              )}

              {/* Progress Bar */}
              {showProgress && content.progress && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#333]">
                  <div className="h-full bg-red-500" style={{ width: `${content.progress}%` }} />
                </div>
              )}
            </div>
            
            <h4 className="text-white text-xs font-medium mt-2 line-clamp-2">
              {content.title}
            </h4>
          </motion.div>
        ))}
      </div>
    </section>
  );
}