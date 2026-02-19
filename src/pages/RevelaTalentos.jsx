import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, Bell, ChevronRight, Star, Flame, Dumbbell, Brain, Trophy, Menu } from "lucide-react";
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
  const [showUploadModal, setShowUploadModal] = useState(false);

  const heroScrollRef = useRef(null);

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
  const featuredContents = useMemo(() => contents.filter(c => c.is_featured).slice(0, 8), [contents]);
  const mentoriaContents = useMemo(() => contents.filter(c => c.category === 'mentoria'), [contents]);
  const treinoContents = useMemo(() => contents.filter(c => c.category === 'treino_tatico'), [contents]);
  const fisicoContents = useMemo(() => contents.filter(c => c.category === 'preparacao_fisica'), [contents]);
  const psicologiaContents = useMemo(() => contents.filter(c => c.category === 'psicologia'), [contents]);
  const top10Contents = useMemo(() => contents.filter(c => c.is_top_10).slice(0, 10), [contents]);
  
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

  // Auto scroll hero
  useEffect(() => {
    if (featuredContents.length > 1) {
      const timer = setInterval(() => {
        setHeroIndex(prev => (prev + 1) % featuredContents.length);
      }, 4000);
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
        <div className="flex items-center gap-3">
          <img 
            src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" 
            alt="Logo" 
            className="w-10 h-10 object-contain"
          />
          <Menu className="w-6 h-6 text-white" />
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 bg-[#111] rounded-full flex items-center justify-center border border-[#222] relative"
        >
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#00E5FF] rounded-full" />
        </motion.button>
      </header>

      {/* Greeting */}
      <div className="px-4 mb-4">
        <p className="text-[#666] text-xs">Hello</p>
        <h1 className="text-xl font-bold text-white">{user?.full_name || "Atleta"}</h1>
      </div>

      {/* HERO CAROUSEL */}
      <section className="mb-6">
        <div 
          ref={heroScrollRef}
          className="flex gap-3 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory"
        >
          {featuredContents.map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleContentSelect(content)}
              className="relative flex-shrink-0 w-[80vw] md:w-[350px] aspect-[16/12] rounded-[16px] overflow-hidden cursor-pointer snap-center"
            >
              <img 
                src={content.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600"}
                alt={content.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              {/* Play Button */}
              <div className="absolute top-3 left-3">
                <div className="w-10 h-10 bg-[#00E5FF] rounded-full flex items-center justify-center shadow-lg shadow-[#00E5FF]/40">
                  <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
                </div>
              </div>

              {/* Rank Badge */}
              <div className="absolute top-3 right-3 w-7 h-7 bg-[#00E5FF] rounded-lg flex items-center justify-center">
                <span className="text-xs font-black text-black">{index + 1}</span>
              </div>

              {/* Title Inside Card */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-base line-clamp-2 uppercase tracking-wide">
                  {content.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-1.5 mt-3">
          {featuredContents.slice(0, 5).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                heroIndex === index ? 'w-6 bg-[#00E5FF]' : 'w-1.5 bg-[#333]'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Continue Watching */}
      {continueWatchingContents.length > 0 && (
        <ContentRow 
          title="Continue Assistindo"
          icon={<Clock className="w-4 h-4 text-[#00E5FF]" />}
          contents={continueWatchingContents}
          onSelect={handleContentSelect}
          showProgress
        />
      )}

      {/* Top 10 Trending */}
      {top10Contents.length > 0 && (
        <ContentRow 
          title="Top 10 Trending"
          icon={<Flame className="w-4 h-4 text-orange-500" />}
          contents={top10Contents}
          onSelect={handleContentSelect}
          showRank
        />
      )}

      {/* Mentorias */}
      {mentoriaContents.length > 0 && (
        <ContentRow 
          title="Mentorias"
          icon={<Brain className="w-4 h-4 text-purple-500" />}
          contents={mentoriaContents}
          onSelect={handleContentSelect}
        />
      )}

      {/* Treino Tático */}
      {treinoContents.length > 0 && (
        <ContentRow 
          title="Treino Tático"
          icon={<Trophy className="w-4 h-4 text-yellow-500" />}
          contents={treinoContents}
          onSelect={handleContentSelect}
        />
      )}

      {/* Preparação Física */}
      {fisicoContents.length > 0 && (
        <ContentRow 
          title="Preparação Física"
          icon={<Dumbbell className="w-4 h-4 text-green-500" />}
          contents={fisicoContents}
          onSelect={handleContentSelect}
        />
      )}

      {/* Psicologia */}
      {psicologiaContents.length > 0 && (
        <ContentRow 
          title="Psicologia"
          icon={<Brain className="w-4 h-4 text-pink-500" />}
          contents={psicologiaContents}
          onSelect={handleContentSelect}
        />
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

// Content Row Component
function ContentRow({ title, icon, contents, onSelect, showProgress, showRank }) {
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-bold text-white">{title}</h3>
        </div>
        <button className="text-[#00E5FF] text-xs font-medium flex items-center gap-0.5">
          Ver Todos <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
        {contents.map((content, index) => (
          <motion.div
            key={content.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(content)}
            className="relative flex-shrink-0 w-[120px] cursor-pointer group"
          >
            <div className="relative aspect-[3/4] rounded-[12px] overflow-hidden bg-[#111] border border-[#1a1a1a]">
              <img 
                src={content.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300"}
                alt={content.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Rank */}
              {showRank && (
                <div className="absolute top-2 left-2 w-6 h-6 bg-[#00E5FF] rounded-md flex items-center justify-center">
                  <span className="text-[10px] font-black text-black">{index + 1}</span>
                </div>
              )}

              {/* Play Icon */}
              <div className="absolute top-2 left-2">
                {!showRank && (
                  <div className="w-7 h-7 bg-[#00E5FF]/90 rounded-full flex items-center justify-center">
                    <Play className="w-3 h-3 text-black ml-0.5" fill="black" />
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {showProgress && content.progress && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#333]">
                  <div className="h-full bg-[#00E5FF]" style={{ width: `${content.progress}%` }} />
                </div>
              )}

              {/* Title Inside Card */}
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <h4 className="text-white font-semibold text-[10px] line-clamp-2 uppercase leading-tight">
                  {content.title}
                </h4>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}