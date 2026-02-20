import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import MobileBottomNav from "../components/mobile/MobileBottomNav";
import VideoUploadModal from "../components/mobile/VideoUploadModal";
import ProfileHeroCard from "../components/profile/ProfileHeroCard";
import PerformanceStatsCard from "../components/profile/PerformanceStatsCard";
import FifaOverallCard from "../components/profile/FifaOverallCard";
import EvolutionSectionCard from "../components/profile/EvolutionSectionCard";
import DailyCheckinCard from "../components/profile/DailyCheckinCard";
import WeeklyReportCard from "../components/profile/WeeklyReportCard";
import TasksCard from "../components/profile/TasksCard";
import PlatformScoreCard from "../components/profile/PlatformScoreCard";
import CareerTimelineCard from "../components/profile/CareerTimelineCard";

export default function ProfileScreenContainer() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsLoading(false);
    } catch {
      setUser(null);
      setIsLoading(false);
    }
  };

  // Fetch all data
  const { data: trophies = [] } = useQuery({
    queryKey: ['trophies', user?.id],
    queryFn: () => base44.entities.AthleteTrophy.filter({ user_id: user.id }, "-created_date", 50),
    enabled: !!user?.id,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: () => base44.entities.AthleteTask.filter({ user_id: user.id }, "-created_date", 20),
    enabled: !!user?.id,
  });

  const { data: weeklyAssessments = [] } = useQuery({
    queryKey: ['assessments', user?.id],
    queryFn: () => base44.entities.WeeklyAssessment.filter({ user_id: user.id }, "-week_start_date", 10),
    enabled: !!user?.id,
  });

  const { data: checkins = [] } = useQuery({
    queryKey: ['checkins', user?.id],
    queryFn: () => base44.entities.DailyCheckin.filter({ user_id: user.id }, "-checkin_date", 30),
    enabled: !!user?.id,
  });

  const { data: performanceData = [] } = useQuery({
    queryKey: ['performance', user?.id],
    queryFn: () => base44.entities.PerformanceData.filter({ user_id: user.id }, "-game_date", 20),
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-950 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">Acesso Restrito</h2>
          <button
            onClick={() => base44.auth.redirectToLogin()}
            className="px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-gray-900 font-black rounded-full text-lg transition-all shadow-lg shadow-cyan-400/20"
          >
            Entrar
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-950 to-purple-950 relative overflow-hidden pb-24">
      {/* Stadium texture background */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200')",
          backgroundSize: "cover",
          filter: "blur(8px)"
        }}
      />

      {/* Club watermark behind hero */}
      {user?.current_club_crest_url && (
        <div 
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url(${user.current_club_crest_url})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center top",
            filter: "grayscale(100%)"
          }}
        />
      )}

      {/* Scroll container */}
      <div className="relative z-10 overflow-y-auto px-4 pt-safe space-y-4">
        {/* 1️⃣ HERO SECTION */}
        <ProfileHeroCard 
          user={user} 
          onEdit={() => setShowEditModal(true)}
          onBack={() => window.history.back()}
        />

        {/* 2️⃣ PERFORMANCE SNAPSHOT */}
        <PerformanceStatsCard performanceData={performanceData} />

        {/* 3️⃣ FIFA EVOLUTION CARD */}
        {user.fifa_stats && (
          <FifaOverallCard stats={user.fifa_stats} />
        )}

        {/* 4️⃣ EVOLUTION GRAPH SECTION */}
        <EvolutionSectionCard performanceData={performanceData} checkins={checkins} />

        {/* 5️⃣ DAILY CHECK-IN SECTION */}
        <DailyCheckinCard user={user} checkins={checkins} onSuccess={loadUser} />

        {/* 6️⃣ WEEKLY REPORT SECTION */}
        <WeeklyReportCard user={user} assessments={weeklyAssessments} onSuccess={loadUser} />

        {/* 7️⃣ TASKS & TRAINING SECTION */}
        <TasksCard tasks={tasks} />

        {/* 8️⃣ GAMIFICATION SECTION */}
        <PlatformScoreCard user={user} />

        {/* 9️⃣ HISTORY TIMELINE */}
        {user.club_history && user.club_history.length > 0 && (
          <CareerTimelineCard clubHistory={user.club_history} />
        )}
      </div>

      {/* Bottom Nav */}
      <MobileBottomNav onUploadClick={() => setShowUploadModal(true)} />
      
      {/* Modals */}
      <VideoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        user={user}
      />
    </div>
  );
}