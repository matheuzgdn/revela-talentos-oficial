import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, User as UserIcon, Bell, ChevronRight, Heart, Bookmark, Star, Flame, Dumbbell, Brain, Trophy } from "lucide-react";
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
  const [favorites, setFavorites] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedLiveContent, setSelectedLiveContent] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const heroRef = useRef(null);

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
  const featuredContents = useMemo(() => contents.filter(c => c.is_featured).slice(0, 6), [contents]);
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

  // Auto-rotate hero
  useEffect(() => {
    if (featuredContents.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlideIndex(prev => (prev + 1) % featuredContents.length);
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

  const activeSlide = featuredContents[currentSlideIndex] || null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24 md:pb-0 overflow-x-hidden">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .glow-cyan { box-shadow: 0 0 20px rgba(0, 229, 255, 0.3); }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl px-4 py-4 md:px-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <p className="text-[#666] text-xs font-medium tracking-wide">Hello</p>
            <h1 className="text-xl font-bold text-white">{user?.full_name || "Atleta"}</h1>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-[#111] rounded-full flex items-center justify-center border border-[#222] relative"
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#00E5FF] rounded-full border-2 border-[#0A0A0A]" />
          </motion.button>
        </div>
      </header>

      {/* Hero Carousel - Horizontal Scroll */}
      <section className="py-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 md:px-6 snap-x snap-mandatory">
          {featuredContents.map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleContentSelect(content)}
              className="relative flex-shrink-0 w-[85%] md:w-[400px] aspect-[16/10] rounded-[20px] overflow-hidden cursor-pointer group snap-center"
            >
              <img 
                src={content.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800"}
                alt={content.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
              
              {/* Title Inside Card */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-xl md:text-2xl font-black text-white line-clamp-2 mb-2">
                  {content.title}
                </h2>
                <div className="flex items-center gap-3 text-[#999] text-xs">
                  {content.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#00E5FF]" />
                      {content.duration} min
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" fill="#EAB308" />
                    4.8
                  </span>
                </div>
              </div>

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 bg-[#00E5FF]/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg shadow-[#00E5FF]/30">
                  <Play className="w-6 h-6 text-black ml-0.5" fill="black" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {featuredContents.slice(0, 6).map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === 0 ? 'w-6 bg-[#00E5FF]' : 'w-2 bg-[#333]'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Continue Watching */}
      {continueWatchingContents.length > 0 && (
        <ContentSection 
          title="Continue Assistindo"
          icon={<Clock className="w-5 h-5 text-[#00E5FF]" />}
          contents={continueWatchingContents}
          onSelect={handleContentSelect}
          showProgress
        />
      )}

      {/* Top 10 Trending */}
      {top10Contents.length > 0 && (
        <ContentSection 
          title="Top 10 Trending"
          icon={<Flame className="w-5 h-5 text-orange-500" />}
          contents={top10Contents}
          onSelect={handleContentSelect}
          showRank
        />
      )}

      {/* Mentorias */}
      {mentoriaContents.length > 0 && (
        <ContentSection 
          title="Mentorias"
          icon={<Brain className="w-5 h-5 text-purple-500" />}
          contents={mentoriaContents}
          onSelect={handleContentSelect}
        />
      )}

      {/* Treino Tático */}
      {treinoContents.length > 0 && (
        <ContentSection 
          title="Treino Tático"
          icon={<Trophy className="w-5 h-5 text-yellow-500" />}
          contents={treinoContents}
          onSelect={handleContentSelect}
        />
      )}

      {/* Preparação Física */}
      {fisicoContents.length > 0 && (
        <ContentSection 
          title="Preparação Física"
          icon={<Dumbbell className="w-5 h-5 text-green-500" />}
          contents={fisicoContents}
          onSelect={handleContentSelect}
        />
      )}

      {/* Psicologia */}
      {psicologiaContents.length > 0 && (
        <ContentSection 
          title="Psicologia Esportiva"
          icon={<Brain className="w-5 h-5 text-pink-500" />}
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

// Content Section Component
function ContentSection({ title, icon, contents, onSelect, showProgress, showRank }) {
  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 md:px-6 mb-3">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-base font-bold text-white">{title}</h3>
          </div>
          <button className="text-[#00E5FF] text-sm font-medium flex items-center gap-1 hover:underline">
            Ver Todos <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 md:px-6">
          {contents.map((content, index) => (
            <ContentCard 
              key={content.id} 
              content={content} 
              index={index}
              onClick={() => onSelect(content)}
              showProgress={showProgress}
              showRank={showRank}
              rank={index + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Content Card Component
function ContentCard({ content, index, onClick, showProgress, showRank, rank }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative flex-shrink-0 cursor-pointer group w-[140px] md:w-[165px]"
    >
      <div className="relative aspect-[2/3] rounded-[14px] overflow-hidden bg-[#111] border border-[#1a1a1a] group-hover:border-[#00E5FF]/50 transition-colors">
        <img 
          src={content.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400"}
          alt={content.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
        
        {/* Rank Badge */}
        {showRank && (
          <div className="absolute top-2 left-2 w-7 h-7 bg-gradient-to-br from-[#00E5FF] to-[#0066FF] rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-xs font-black text-black">{rank}</span>
          </div>
        )}

        {/* Play Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-[#00E5FF]/90 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
          </div>
        </div>

        {/* Duration Badge */}
        {content.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded-md text-[10px] text-white font-medium">
            {content.duration}:00
          </div>
        )}

        {/* Progress Bar */}
        {showProgress && content.progress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#333]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${content.progress}%` }}
              className="h-full bg-[#00E5FF]"
            />
          </div>
        )}
      </div>
      
      {/* Title */}
      <h4 className="text-white font-medium text-xs mt-2 line-clamp-2 leading-tight">{content.title}</h4>
      {content.instructor && (
        <p className="text-[#666] text-[10px] mt-0.5 truncate">{content.instructor}</p>
      )}
    </motion.div>
  );
}