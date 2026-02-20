import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, CheckSquare, TrendingUp, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MobileBottomNav from "../components/mobile/MobileBottomNav";
import VideoUploadModal from "../components/mobile/VideoUploadModal";
import AthleteProfileHero from "../components/athlete/AthleteProfileHero";
import FIFAStatsRadar from "../components/athlete/FIFAStatsRadar";
import CareerTimeline from "../components/athlete/CareerTimeline";
import TrophyShowcase from "../components/athlete/TrophyShowcase";
import DailyCheckinModal from "../components/athlete/DailyCheckinModal";
import WeeklyAssessmentForm from "../components/athlete/WeeklyAssessmentForm";
import TasksPanel from "../components/athlete/TasksPanel";
import EditProfileModal from "../components/athlete/EditProfileModal";

export default function AthleteProfile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

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

  // Fetch data
  const { data: trophies = [] } = useQuery({
    queryKey: ['trophies', user?.id],
    queryFn: () => base44.entities.AthleteTrophy.filter({ user_id: user.id }, "-created_date", 50),
    enabled: !!user?.id,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: () => base44.entities.AthleteTask.filter({ user_id: user.id, status: { $in: ["pending", "in_progress"] } }, "-created_date", 20),
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

  // Check if can checkin today
  const canCheckinToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return !checkins.some(c => c.checkin_date === today);
  };

  // Stats
  const totalGames = performanceData.length;
  const totalGoals = performanceData.reduce((sum, p) => sum + (p.goals || 0), 0);
  const totalAssists = performanceData.reduce((sum, p) => sum + (p.assists || 0), 0);
  const avgRating = performanceData.length > 0 
    ? (performanceData.reduce((sum, p) => sum + (p.rating || 0), 0) / performanceData.length).toFixed(1)
    : 0;

  if (isLoading) {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-black text-white mb-4">FAÇA LOGIN</h2>
          <Button
            onClick={() => base44.auth.redirectToLogin()}
            className="bg-[#00E5FF] hover:bg-[#00BFFF] text-black font-black px-8 py-6 rounded-2xl"
          >
            Entrar com Google
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>

      {/* Hero Section */}
      <AthleteProfileHero user={user} onEdit={() => setShowEditModal(true)} />

      {/* Quick Actions */}
      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowCheckinModal(true)}
          disabled={!canCheckinToday()}
          className={`relative p-4 rounded-2xl border-2 transition-all ${
            canCheckinToday()
              ? "bg-gradient-to-br from-[#00E5FF]/20 to-[#0066FF]/20 border-[#00E5FF]/40"
              : "bg-[#1a1a1a] border-[#333] opacity-50"
          }`}
        >
          <CheckSquare className="w-6 h-6 text-[#00E5FF] mb-2" />
          <p className="text-white font-bold text-sm">Check-in Diário</p>
          {canCheckinToday() && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#00E5FF] rounded-full animate-pulse" />
          )}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setActiveTab("assessment")}
          className="relative p-4 rounded-2xl border-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/40 transition-all"
        >
          <Calendar className="w-6 h-6 text-green-500 mb-2" />
          <p className="text-white font-bold text-sm">Assessoria</p>
        </motion.button>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4 py-2">
        <TabsList className="w-full bg-[#111111] border border-[#222] p-1 rounded-2xl grid grid-cols-4 gap-1">
          <TabsTrigger 
            value="overview" 
            className="rounded-xl data-[state=active]:bg-[#00E5FF] data-[state=active]:text-black font-bold text-xs"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger 
            value="stats" 
            className="rounded-xl data-[state=active]:bg-[#00E5FF] data-[state=active]:text-black font-bold text-xs"
          >
            Stats
          </TabsTrigger>
          <TabsTrigger 
            value="tasks" 
            className="rounded-xl data-[state=active]:bg-[#00E5FF] data-[state=active]:text-black font-bold text-xs"
          >
            Tarefas
          </TabsTrigger>
          <TabsTrigger 
            value="assessment" 
            className="rounded-xl data-[state=active]:bg-[#00E5FF] data-[state=active]:text-black font-bold text-xs"
          >
            Assessoria
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Performance Overview */}
          <div className="bg-[#111111] border border-[#222] rounded-3xl p-6">
            <h3 className="text-white text-lg font-black uppercase tracking-tight mb-4">Desempenho</h3>
            <div className="grid grid-cols-4 gap-3">
              <PerformanceCard label="Jogos" value={totalGames} />
              <PerformanceCard label="Gols" value={totalGoals} />
              <PerformanceCard label="Assists" value={totalAssists} />
              <PerformanceCard label="Nota" value={avgRating} />
            </div>
          </div>

          {/* FIFA Stats */}
          {user.fifa_stats && <FIFAStatsRadar stats={user.fifa_stats} />}

          {/* Trophies */}
          <TrophyShowcase trophies={trophies} />

          {/* Career History */}
          {user.club_history && <CareerTimeline clubHistory={user.club_history} />}

          {/* Streak */}
          <StreakCard checkins={checkins} />
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="mt-6 space-y-6">
          {user.fifa_stats && <FIFAStatsRadar stats={user.fifa_stats} />}
          
          <PerformanceChart performanceData={performanceData} />
          
          <DisciplineStats performanceData={performanceData} />
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-6">
          <TasksPanel tasks={tasks} />
        </TabsContent>

        {/* Assessment Tab */}
        <TabsContent value="assessment" className="mt-6">
          <WeeklyAssessmentForm user={user} onSuccess={loadUser} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <MobileBottomNav onUploadClick={() => setShowUploadModal(true)} />
      
      <VideoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        user={user}
      />

      <DailyCheckinModal
        isOpen={showCheckinModal}
        onClose={() => setShowCheckinModal(false)}
        user={user}
      />

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          loadUser();
        }}
        user={user}
      />
    </div>
  );
}

function PerformanceCard({ label, value }) {
  return (
    <div className="bg-[#1a1a1a]/50 border border-[#333] rounded-xl p-3 text-center">
      <p className="text-2xl font-black text-[#00E5FF]">{value}</p>
      <p className="text-[#666] text-[10px] font-bold uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

function StreakCard({ checkins }) {
  const currentStreak = checkins.length;
  
  return (
    <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-500/40 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <div>
            <p className="text-white font-black text-2xl">{currentStreak}</p>
            <p className="text-orange-200 text-xs font-bold">Dias Consecutivos</p>
          </div>
        </div>
        <Award className="w-8 h-8 text-orange-500" />
      </div>
      
      <div className="flex gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full ${
              i < Math.min(currentStreak, 7) ? "bg-orange-500" : "bg-[#333]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function PerformanceChart({ performanceData }) {
  const last5Games = performanceData.slice(0, 5).reverse();
  
  return (
    <div className="bg-[#111111] border border-[#222] rounded-3xl p-6">
      <h3 className="text-white text-lg font-black uppercase tracking-tight mb-6">Últimas Performances</h3>
      
      <div className="space-y-4">
        {last5Games.map((game, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-white text-sm font-bold mb-1">{game.opponent}</p>
              <div className="flex gap-2 text-xs text-[#666]">
                <span>{game.goals || 0}G</span>
                <span>{game.assists || 0}A</span>
                <span>{game.minutes_played}min</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-[#333]">
              <span className="text-[#00E5FF] font-black">{game.rating || "-"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DisciplineStats({ performanceData }) {
  const totalFouls = performanceData.reduce((sum, p) => sum + (p.fouls || 0), 0);
  const yellowCards = performanceData.reduce((sum, p) => sum + (p.yellow_cards || 0), 0);
  const redCards = performanceData.reduce((sum, p) => sum + (p.red_cards || 0), 0);
  
  return (
    <div className="bg-[#111111] border border-[#222] rounded-3xl p-6">
      <h3 className="text-white text-lg font-black uppercase tracking-tight mb-6">Disciplina</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-3xl font-black text-white mb-1">{totalFouls}</p>
          <p className="text-[#666] text-xs font-bold">Faltas</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-yellow-500 mb-1">{yellowCards}</p>
          <p className="text-[#666] text-xs font-bold">Amarelos</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-red-500 mb-1">{redCards}</p>
          <p className="text-[#666] text-xs font-bold">Vermelhos</p>
        </div>
      </div>
    </div>
  );
}