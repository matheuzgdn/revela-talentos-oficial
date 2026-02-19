import React, { useState, useEffect, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, User as UserIcon, Star, Bell, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import VideoPlayer from "../components/content/VideoPlayer";
import LiveStreamPlayer from "../components/content/LiveStreamPlayer";
import PendingApproval from "../components/auth/PendingApproval";
import RevelaTalentosLanding from "../components/revelatalentos/RevelaTalentosLanding";
import MobileBottomNav from "../components/mobile/MobileBottomNav";
import VideoUploadModal from "../components/mobile/VideoUploadModal";
import { createPageUrl } from "@/utils";

export default function RevelaTalentosPage() {
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

  const loadContentData = useCallback(async (currentUser) => {
    try {
      const fetchedContents = await base44.entities.Content.filter({ 
        is_published: true 
      }, "-created_date", 50).catch(() => []);
      setContents(fetchedContents);
      
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
    { id: "all", name: "All" },
    { id: "mentoria", name: "Mentorias" },
    { id: "treino_tatico", name: "Tático" },
    { id: "preparacao_fisica", name: "Físico" },
  ], []);

  const featuredContents = useMemo(() => contents.filter(c => c.is_featured).slice(0, 5), [contents]);
  const regularContents = useMemo(() => contents.filter(c => !['live', 'planos', 'atletas'].includes(c.category)), [contents]);
  
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
    if (featuredContents.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlideIndex(prevIndex => (prevIndex + 1) % featuredContents.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [featuredContents.length]);

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

  const activeSlide = featuredContents[currentSlideIndex] || null;

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
        className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl px-4 py-4 md:px-6"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <p className="text-[#666] text-xs font-medium">Hello</p>
            <h1 className="text-lg font-bold text-white">{user?.full_name || "Atleta"}</h1>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 bg-[#111111] rounded-full flex items-center justify-center border border-[#222] relative"
          >
            <Bell className="w-5 h-5 text-white" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#00E5FF] rounded-full" />
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Carousel - Netflix/OTT Style */}
      <section className="px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {featuredContents.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlideIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => activeSlide && handleContentSelect(activeSlide)}
                  className="relative aspect-[4/3] md:aspect-[16/9] rounded-[20px] overflow-hidden cursor-pointer group"
                >
                  <img 
                    src={activeSlide?.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200"}
                    alt={activeSlide?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                  
                  {/* Title Overlay at Bottom */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <motion.h2 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-2xl md:text-4xl font-black text-white tracking-tight"
                    >
                      {activeSlide?.title}
                    </motion.h2>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Carousel Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {featuredContents.slice(0, 5).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlideIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlideIndex === index 
                        ? 'w-6 bg-[#00E5FF]' 
                        : 'w-2 bg-[#444]'
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            /* Default Hero when no featured content */
            <div className="relative aspect-[4/3] md:aspect-[16/9] rounded-[20px] overflow-hidden bg-gradient-to-br from-[#00E5FF]/20 to-[#0066FF]/20 border border-[#222]">
              <video
                src="https://video.wixstatic.com/video/933cdd_388c6e2a108d49f089ef70033306e785/1080p/mp4/file.mp4"
                autoPlay muted loop playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h2 className="text-2xl md:text-4xl font-black text-white">REVELA TALENTOS</h2>
              </div>
              <div className="flex justify-center gap-2 absolute bottom-[-20px] left-0 right-0">
                <div className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                <div className="w-2 h-2 rounded-full bg-[#444]" />
                <div className="w-2 h-2 rounded-full bg-[#444]" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map((cat, index) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveCategory(cat.id)}
                className="relative whitespace-nowrap"
              >
                <span className={`text-sm font-medium transition-colors ${
                  activeCategory === cat.id ? 'text-white' : 'text-[#666]'
                }`}>
                  {cat.name}
                </span>
                {activeCategory === cat.id && (
                  <motion.div 
                    layoutId="categoryIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#00E5FF] rounded-full shadow-lg shadow-[#00E5FF]/50"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Continue Watching */}
      {continueWatchingContents.length > 0 && (
        <section className="px-4 md:px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Continue Watching</h3>
              <button className="text-[#666] text-sm hover:text-[#00E5FF] transition-colors">View All</button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {continueWatchingContents.map((content, index) => (
                <ContentCard 
                  key={content.id} 
                  content={content} 
                  index={index}
                  onClick={() => handleContentSelect(content)}
                  progress={userProgress.find(p => p.content_id === content.id)?.progress_percent}
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">🔥 Top Trending</h3>
              <button className="text-[#666] text-sm hover:text-[#00E5FF] transition-colors">View All</button>
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
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Content - Carousel Style */}
      <section className="px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">
              {activeCategory === "all" ? "Conteúdos" : categories.find(c => c.id === activeCategory)?.name}
            </h3>
            <button className="text-[#666] text-sm hover:text-[#00E5FF] transition-colors">View All</button>
          </div>
          
          {/* Always Carousel Style */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {filteredContents.map((content, index) => (
              <ContentCard 
                key={content.id} 
                content={content} 
                index={index}
                onClick={() => handleContentSelect(content)}
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

// Content Card Component - Compact Carousel Style
function ContentCard({ content, index, onClick, progress, showRank, rank }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative flex-shrink-0 cursor-pointer group w-[140px] md:w-[160px]"
    >
      <div className="relative aspect-[2/3] rounded-[12px] overflow-hidden bg-[#111111]">
        <img 
          src={content.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400"}
          alt={content.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Rank Badge */}
        {showRank && (
          <div className="absolute top-2 left-2 w-6 h-6 bg-[#00E5FF] rounded-md flex items-center justify-center">
            <span className="text-[10px] font-black text-black">{rank}</span>
          </div>
        )}

        {/* Progress Bar */}
        {progress && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#333]">
            <div 
              className="h-full bg-[#00E5FF]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Duration Badge */}
        {content.duration && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[9px] text-white font-medium">
            {content.duration}:00
          </div>
        )}
      </div>
      
      {/* Title Below Card */}
      <h4 className="text-white font-medium text-xs mt-2 line-clamp-1">{content.title}</h4>
    </motion.div>
  );
}