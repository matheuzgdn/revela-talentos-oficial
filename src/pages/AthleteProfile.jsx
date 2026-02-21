import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Share2, Bookmark, Edit3, Trophy, Target, 
  TrendingUp, Calendar, CheckCircle2, Zap, Award,
  Clock, Activity, Heart, Droplet, Brain, Users,
  ChevronRight, Plus, Star, Flame, Shield, BarChart3, 
  TrendingDown, Footprints, Wind, Eye, Ruler, Sparkles, Video
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import MobileBottomNav from "@/components/mobile/MobileBottomNav";
import VideoUploadModal from "@/components/mobile/VideoUploadModal";
import ProfileSetup from "@/components/athlete/ProfileSetup";
import DailyCheckinModal from "@/components/athlete/DailyCheckinModal";
import WeeklyAssessmentChat from "@/components/athlete/WeeklyAssessmentChat";
import WeeklyAssessmentNotification from "@/components/athlete/WeeklyAssessmentNotification";

export default function AthleteProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showWeeklyAssessment, setShowWeeklyAssessment] = useState(false);
  const [dailyCheckins, setDailyCheckins] = useState([]);
  const [weeklyAssessments, setWeeklyAssessments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [trophies, setTrophies] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadUserData();
    
    // Listener para abrir upload modal via evento
    const handleOpenUpload = () => setShowUploadModal(true);
    const handleOpenWeekly = () => setShowWeeklyAssessment(true);
    
    window.addEventListener('openUploadModal', handleOpenUpload);
    window.addEventListener('openWeeklyAssessment', handleOpenWeekly);
    
    return () => {
      window.removeEventListener('openUploadModal', handleOpenUpload);
      window.removeEventListener('openWeeklyAssessment', handleOpenWeekly);
    };
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await base44.auth.me();
      console.log("📥 Usuário:", currentUser);
      setUser(currentUser);

      // Verificar se precisa configurar perfil
      const needsSetup = !currentUser.birth_date || !currentUser.position;
      if (needsSetup) {
        console.log("⚠️ Perfil incompleto");
        setShowProfileSetup(true);
      }

      // Carregar dados relacionados
      const [checkinsData, assessmentsData, tasksData, trophiesData] = await Promise.all([
        base44.entities.DailyCheckin.filter({ user_id: currentUser.id }, '-checkin_date', 7),
        base44.entities.WeeklyAssessment.filter({ user_id: currentUser.id }, '-week_start_date', 4),
        base44.entities.AthleteTask.filter({ user_id: currentUser.id, status: 'pendente' }),
        base44.entities.AthleteTrophy.filter({ user_id: currentUser.id })
      ]);

      setDailyCheckins(checkinsData);
      setWeeklyAssessments(assessmentsData);
      setTasks(tasksData);
      setTrophies(trophiesData);
      setLoading(false);
    } catch (error) {
      console.error("❌ Erro ao carregar:", error);
      setLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getPositionBadgeColor = (position) => {
    const colors = {
      goleiro: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
      zagueiro: "bg-blue-500/20 text-blue-400 border-blue-500/40",
      lateral: "bg-green-500/20 text-green-400 border-green-500/40",
      volante: "bg-purple-500/20 text-purple-400 border-purple-500/40",
      meia: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
      atacante: "bg-red-500/20 text-red-400 border-red-500/40"
    };
    return colors[position] || colors.meia;
  };

  const getLevelBadge = (level) => {
    const badges = {
      iniciante: { label: "Iniciante", color: "from-gray-500 to-gray-600" },
      promessa: { label: "Promessa", color: "from-green-500 to-emerald-600" },
      destaque: { label: "Destaque", color: "from-blue-500 to-cyan-600" },
      elite: { label: "Elite", color: "from-purple-500 to-pink-600" }
    };
    return badges[level] || badges.iniciante;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#00E5FF] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-black text-white mb-2">Faça Login</h2>
          <p className="text-gray-400 mb-6">Para acessar seu perfil de atleta</p>
          <Button 
            onClick={() => base44.auth.redirectToLogin()}
            className="bg-[#00E5FF] hover:bg-[#00BFFF] text-black font-bold"
          >
            Entrar
          </Button>
        </div>
      </div>
    );
  }

  const age = calculateAge(user.birth_date);
  const levelBadge = getLevelBadge(user.career_level);
  
  // Calcular estatísticas dos assessments
  const totalGames = user.career_stats?.total_games || weeklyAssessments.reduce((sum, w) => sum + (w.had_game ? 1 : 0), 0);
  const totalGoals = user.career_stats?.total_goals || weeklyAssessments.reduce((sum, w) => sum + (w.goals || 0), 0);
  const lastFeedback = user.career_stats?.last_assessment_feedback;
  
  const checkinStreak = dailyCheckins.length > 0 ? dailyCheckins[0].streak_days : 0;



  return (
    <div className="min-h-screen bg-[#070A12] pb-24 md:pb-8">
      {/* HERO SECTION - PREMIUM MINIMALISTA */}
      <section id="profile-card" className="relative overflow-hidden pb-6">
        {/* Background simples */}
        <div className="absolute inset-0 h-[50vh]">
          <img 
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=800&fit=crop"
            alt="Campo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-[#070A12]" />
        </div>

        {/* Content */}
        <div className="relative z-10 pt-3 px-4">
          {/* Top nav minimalista */}
          <div className="flex items-center justify-between mb-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="w-8 h-8 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.button>

            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 flex items-center justify-center"
              >
                <Share2 className="w-4 h-4 text-white" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileSetup(true)}
                className="w-8 h-8 bg-[#00E5FF] rounded-full flex items-center justify-center"
              >
                <Edit3 className="w-3.5 h-3.5 text-black" />
              </motion.button>
            </div>
          </div>

          {/* Logo pequeno */}
          <div className="flex justify-center mb-4">
            <img 
              src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" 
              alt="EC10" 
              className="h-8 w-auto opacity-90"
            />
          </div>

          {/* Player Card - Football Sticker Style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex justify-center mb-4"
          >
            <div className="relative" style={{ perspective: "1000px" }}>
              {/* Glow effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF] via-[#0066FF] to-[#FFD700] rounded-[24px] blur-xl opacity-40 animate-pulse" />
              
              {/* Main card with hexagonal style cuts */}
              <div 
                className="relative w-36 h-44 overflow-hidden"
                style={{
                  clipPath: "polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)",
                  filter: "drop-shadow(0 10px 30px rgba(0, 229, 255, 0.4))"
                }}
              >
                {/* Border gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF] via-[#0066FF] to-[#FFD700] p-[3px]"
                  style={{
                    clipPath: "polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)"
                  }}
                >
                  {/* Inner background */}
                  <div className="w-full h-full bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A] relative overflow-hidden"
                    style={{
                      clipPath: "polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)"
                    }}
                  >
                    {/* Player photo */}
                    {user.profile_picture_url || user.player_cutout_url ? (
                      <img 
                        src={user.profile_picture_url || user.player_cutout_url}
                        alt={user.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#00E5FF]/20 to-[#0066FF]/20 flex items-center justify-center">
                        <span className="text-5xl font-black text-[#00E5FF]">
                          {user.full_name?.charAt(0) || "A"}
                        </span>
                      </div>
                    )}
                    
                    {/* Holographic overlay effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/10 via-transparent to-[#FFD700]/10 opacity-60 mix-blend-overlay pointer-events-none" />
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full animate-shine pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Corner accent details */}
              <div className="absolute top-2 left-2 w-6 h-[2px] bg-gradient-to-r from-[#00E5FF] to-transparent" />
              <div className="absolute top-2 left-2 h-6 w-[2px] bg-gradient-to-b from-[#00E5FF] to-transparent" />
              <div className="absolute bottom-2 right-2 w-6 h-[2px] bg-gradient-to-l from-[#FFD700] to-transparent" />
              <div className="absolute bottom-2 right-2 h-6 w-[2px] bg-gradient-to-t from-[#FFD700] to-transparent" />
              
              {/* Star rating badge */}
              <div className="absolute -top-2 -right-2 w-9 h-9 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-xl flex items-center justify-center shadow-xl shadow-[#FFD700]/40 border border-white/20">
                <Star className="w-5 h-5 text-white fill-white drop-shadow-lg" />
              </div>
            </div>
          </motion.div>

          <style>{`
            @keyframes shine {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            .animate-shine {
              animation: shine 3s infinite;
            }
          `}</style>

          {/* Nome */}
          <h1 className="text-2xl font-black text-white text-center mb-3">
            {user?.full_name || user?.name || "Atleta"}
          </h1>

          {/* Posição badge */}
          <div className="flex justify-center mb-4">
            <div className="px-4 py-1.5 bg-[#00E5FF]/20 border border-[#00E5FF] rounded-full backdrop-blur-sm">
              <span className="text-[#00E5FF] text-xs font-black uppercase tracking-wider">
                {user.position || "POSIÇÃO"}
              </span>
            </div>
          </div>

          {/* Info grid - estilo campo de futebol */}
          <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto mb-4">
            {/* Idade */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileSetup(true)}
              className="bg-white/5 border border-white/10 hover:border-[#00E5FF]/30 rounded-xl p-2.5 text-center backdrop-blur-sm transition-colors"
            >
              <p className="text-[8px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Idade</p>
              <p className="text-xl font-black text-white">{age || "--"}</p>
            </motion.button>
            
            {/* Nacionalidade */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileSetup(true)}
              className="bg-white/5 border border-white/10 hover:border-[#00E5FF]/30 rounded-xl p-2.5 text-center backdrop-blur-sm transition-colors"
            >
              <p className="text-[8px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">País</p>
              <p className="text-2xl">{user.nationality || "🌍"}</p>
            </motion.button>
            
            {/* Jogos */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileSetup(true)}
              className="bg-white/5 border border-white/10 hover:border-[#00E5FF]/30 rounded-xl p-2.5 text-center backdrop-blur-sm transition-colors"
            >
              <p className="text-[8px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Jogos</p>
              <p className="text-xl font-black text-white">{totalGames}</p>
            </motion.button>
          </div>

          {/* Segunda linha de info cards */}
          <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto mb-4">
            {/* Pé Dominante */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileSetup(true)}
              className="bg-white/5 border border-white/10 hover:border-[#00E5FF]/30 rounded-xl p-2.5 text-center backdrop-blur-sm transition-colors"
            >
              <p className="text-[8px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Pé</p>
              <p className="text-xs font-black text-white capitalize">{user.foot || "Direito"}</p>
            </motion.button>

            {/* Altura */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileSetup(true)}
              className="bg-white/5 border border-white/10 hover:border-[#00E5FF]/30 rounded-xl p-2.5 text-center backdrop-blur-sm transition-colors"
            >
              <p className="text-[8px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Altura</p>
              <p className="text-xl font-black text-white">{user.height || "--"}<span className="text-xs text-gray-400">cm</span></p>
            </motion.button>

            {/* Peso */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileSetup(true)}
              className="bg-white/5 border border-white/10 hover:border-[#00E5FF]/30 rounded-xl p-2.5 text-center backdrop-blur-sm transition-colors"
            >
              <p className="text-[8px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Peso</p>
              <p className="text-xl font-black text-white">{user.weight || "--"}<span className="text-xs text-gray-400">kg</span></p>
            </motion.button>
          </div>

          {/* Clube atual */}
          {user.current_club_name && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfileSetup(true)}
              className="w-full bg-white/5 border border-white/10 hover:border-[#00E5FF]/30 rounded-xl p-3 max-w-sm mx-auto mb-3 backdrop-blur-sm transition-colors"
            >
              <div className="flex items-center gap-3">
                {user.current_club_crest_url && (
                  <div className="w-10 h-10 bg-white/5 rounded-lg p-1.5 flex-shrink-0">
                    <img src={user.current_club_crest_url} alt="Clube" className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="flex-1 text-left">
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Clube Atual</p>
                  <p className="text-white font-bold text-sm">{user.current_club_name}</p>
                </div>
                <Edit3 className="w-4 h-4 text-gray-500" />
              </div>
            </motion.button>
          )}

          {/* Clubes anteriores */}
          {user.previous_clubs && user.previous_clubs.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfileSetup(true)}
              className="w-full bg-white/5 border border-white/10 hover:border-[#00E5FF]/30 rounded-xl p-3 max-w-sm mx-auto mb-3 backdrop-blur-sm transition-colors text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-2">Clubes Anteriores</p>
                  <div className="flex flex-wrap gap-2">
                    {user.previous_clubs.map((club, idx) => (
                      <span key={idx} className="text-xs text-gray-300 bg-white/5 px-2 py-1 rounded-lg">
                        {club}
                      </span>
                    ))}
                  </div>
                </div>
                <Edit3 className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
              </div>
            </motion.button>
          )}

          {/* Últimas Conquistas */}
          {user.achievements && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfileSetup(true)}
              className="w-full bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 hover:border-yellow-500/50 rounded-xl p-3 max-w-sm mx-auto backdrop-blur-sm transition-colors text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <p className="text-[9px] text-yellow-400 uppercase tracking-wider font-bold">Últimos Campeonatos</p>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">{user.achievements}</p>
                </div>
                <Edit3 className="w-4 h-4 text-yellow-500/50 flex-shrink-0 ml-2" />
              </div>
            </motion.button>
          )}
        </div>
      </section>

      {/* STATS CARDS */}
      <section id="stats-section" className="px-3 md:px-4 mb-3 md:mb-4">
        <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
          <StatCard 
            label="Gols" 
            value={totalGoals} 
            delay={0}
          />
          <StatCard 
            label="Pontos" 
            value={user.total_points || 0} 
            delay={0.1}
          />
        </div>
      </section>





      {/* TAB CONTENT */}
      <section className="px-3">
        <div className="max-w-sm mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && <OverviewTab user={user} checkinStreak={checkinStreak} lastFeedback={lastFeedback} onCheckinClick={() => setShowCheckinModal(true)} onNavigate={(tab) => setActiveTab(tab)} />}
            {activeTab === "performance" && <PerformanceTab user={user} weeklyAssessments={weeklyAssessments} dailyCheckins={dailyCheckins} />}
            {activeTab === "assessoria" && <AssessoriaTab userId={user.id} dailyCheckins={dailyCheckins} weeklyAssessments={weeklyAssessments} onUpdate={loadUserData} onCheckinClick={() => setShowCheckinModal(true)} />}
            {activeTab === "tasks" && <TasksTab tasks={tasks} userId={user.id} onUpdate={loadUserData} />}
            {activeTab === "trophies" && <TrophiesTab trophies={trophies} />}
            {activeTab === "stats" && <StatsTab user={user} weeklyAssessments={weeklyAssessments} />}
          </AnimatePresence>
        </div>
      </section>

      <div id="bottom-nav">
        <MobileBottomNav onUploadClick={() => setShowUploadModal(true)} />
      </div>
      <VideoUploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
        user={user} 
      />
      <ProfileSetup
        isOpen={showProfileSetup}
        onClose={() => setShowProfileSetup(false)}
        user={user}
        onSave={loadUserData}
      />
      <DailyCheckinModal
        isOpen={showCheckinModal}
        onClose={() => setShowCheckinModal(false)}
        userId={user?.id}
        onComplete={loadUserData}
      />
      <WeeklyAssessmentChat
        isOpen={showWeeklyAssessment}
        onClose={() => setShowWeeklyAssessment(false)}
        userId={user?.id}
        userName={user?.full_name?.split(' ')[0] || 'Atleta'}
        onComplete={loadUserData}
      />
      <WeeklyAssessmentNotification
        user={user}
        onOpen={() => setShowWeeklyAssessment(true)}
      />
    </div>
  );
}

// STAT CARD COMPONENT
function StatCard({ label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm"
    >
      <p className="text-[8px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
        {label}
      </p>
      <p className="text-xl font-black text-white">
        {value}
      </p>
    </motion.div>
  );
}

// OVERVIEW TAB
function OverviewTab({ user, checkinStreak, lastFeedback, onCheckinClick, onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {/* Daily streak */}
      <div id="daily-checkin" className="bg-white/5 border border-white/10 rounded-[20px] p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 md:w-12 h-10 md:h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Flame className="w-5 md:w-6 h-5 md:h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-white font-bold text-sm md:text-base">Sequência de Check-ins</p>
              <p className="text-gray-400 text-xs md:text-sm">{checkinStreak} dias consecutivos</p>
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-orange-500">{checkinStreak}</p>
        </div>
        <Progress value={(checkinStreak / 30) * 100} className="h-2" />
      </div>

      {/* Profile info card */}
      {user.current_club_name && (
        <div className="bg-white/5 border border-white/10 rounded-[20px] p-4 md:p-6">
          <h4 className="text-white font-bold mb-3 text-sm">Informações do Perfil</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Clube Atual:</span>
              <span className="text-white font-bold">{user.current_club_name}</span>
            </div>
            {user.nationality && (
              <div className="flex justify-between">
                <span className="text-gray-400">Nacionalidade:</span>
                <span className="text-white font-bold">{user.nationality}</span>
              </div>
            )}
            {user.jersey_number && (
              <div className="flex justify-between">
                <span className="text-gray-400">Camisa:</span>
                <span className="text-white font-bold">#{user.jersey_number}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Último Feedback da Assessoria */}
      {lastFeedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#00E5FF]/10 to-[#0066FF]/10 border border-[#00E5FF]/30 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#00E5FF]/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <h4 className="text-white font-bold text-sm">Feedback do Analista</h4>
          </div>
          <p className="text-gray-300 text-xs leading-relaxed">{lastFeedback}</p>
        </motion.div>
      )}

      {/* Seletiva Card - Premium Minimalista */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
      >
        {/* Background image sutil */}
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop" 
            alt="Campo"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Seletiva Online</h4>
                <p className="text-gray-400 text-[10px] font-medium">Vagas limitadas</p>
              </div>
            </div>
            <div className="px-2 py-0.5 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm">
              <span className="text-white text-[8px] font-bold">NOVO</span>
            </div>
          </div>
          
          <p className="text-gray-300 text-xs mb-3">
            Participe da nossa próxima seletiva e seja visto por clubes profissionais
          </p>
          
          <Button 
            onClick={() => window.location.href = createPageUrl("SeletivaOnline")}
            className="w-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm backdrop-blur-sm"
          >
            Inscrever-se agora
          </Button>
        </div>
      </motion.div>

      {/* Ferramentas */}
      <div className="space-y-3">
        <h4 className="text-white font-bold text-sm">Ferramentas</h4>
        
        <div className="grid grid-cols-3 gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate("performance")}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-3 text-center"
          >
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-2 mx-auto">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-white font-bold text-[10px]">Performance</p>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onCheckinClick}
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-3 text-center"
          >
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-2 mx-auto">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-white font-bold text-[10px]">Diário</p>
          </motion.button>

          <motion.button
            id="tasks-card"
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate("tasks")}
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-3 text-center"
          >
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-2 mx-auto">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-white font-bold text-[10px]">Tarefas</p>
          </motion.button>

          <motion.button
            id="trophies-card"
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate("trophies")}
            className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-3 text-center"
          >
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-2 mx-auto">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-white font-bold text-[10px]">Troféus</p>
          </motion.button>

          <motion.button
            id="weekly-assessment"
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Abrir chat de assessoria semanal
              const event = new CustomEvent('openWeeklyAssessment');
              window.dispatchEvent(event);
            }}
            className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-3 text-center relative"
          >
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-2 mx-auto">
              <Target className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-white font-bold text-[10px]">Relatório</p>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate("stats")}
            className="bg-gradient-to-br from-gray-500/20 to-slate-500/20 border border-gray-500/30 rounded-2xl p-3 text-center"
          >
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-2 mx-auto">
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-white font-bold text-[10px]">Ver mais</p>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}



// ASSESSORIA TAB
function AssessoriaTab({ userId, dailyCheckins, weeklyAssessments, onUpdate, onCheckinClick }) {
  const [showWeeklyForm, setShowWeeklyForm] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-xl font-black text-white">Ferramentas de Assessoria</h3>
        <Badge className="bg-purple-500/20 text-purple-400">
          {weeklyAssessments.length} semanas
        </Badge>
      </div>

      {/* Daily check-in card */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onCheckinClick}
        className="w-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-[20px] p-6 text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-bold mb-1">Check-in Diário</p>
              <p className="text-gray-400 text-sm">Registre seu dia a dia</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-blue-400" />
        </div>
      </motion.button>

      {/* Weekly assessment */}
      <div className="bg-white/5 border border-white/10 rounded-[20px] p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-purple-400" />
            <h4 className="text-white font-bold">Relatório Semanal</h4>
          </div>
          <Button
            onClick={() => setShowWeeklyForm(!showWeeklyForm)}
            size="sm"
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Novo
          </Button>
        </div>

        {weeklyAssessments.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">Nenhum relatório ainda</p>
        ) : (
          <div className="space-y-2">
            {weeklyAssessments.map((assessment) => (
              <div key={assessment.id} className="bg-[#1a1a1a] rounded-xl p-3 border border-[#333]">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-white text-sm font-bold">
                    {new Date(assessment.week_start_date).toLocaleDateString('pt-BR')}
                  </p>
                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                    +{assessment.points_earned} pts
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">Gols</p>
                    <p className="text-white font-bold">{assessment.goals || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Assists</p>
                    <p className="text-white font-bold">{assessment.assists || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Treinos</p>
                    <p className="text-white font-bold">{assessment.training_sessions || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent check-ins */}
      <div className="bg-white/5 border border-white/10 rounded-[20px] p-4 md:p-6">
        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Últimos Check-ins
        </h4>
        {dailyCheckins.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">Nenhum check-in ainda</p>
        ) : (
          <div className="space-y-2">
            {dailyCheckins.map((checkin) => (
              <div key={checkin.id} className="bg-[#1a1a1a] rounded-xl p-3 border border-[#333] flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-bold">{new Date(checkin.checkin_date).toLocaleDateString('pt-BR')}</p>
                  <p className="text-gray-400 text-xs capitalize">{checkin.mood}</p>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                  Energia: {checkin.energy_level}/5
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// TASKS TAB
function TasksTab({ tasks, userId, onUpdate }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black text-white">Minhas Tarefas</h3>
        <Badge className="bg-[#00E5FF]/20 text-[#00E5FF]">
          {tasks.length} pendentes
        </Badge>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-[20px] p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-white font-bold mb-2">Tudo em dia!</p>
          <p className="text-gray-400 text-sm">Você não tem tarefas pendentes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function TaskCard({ task }) {
  const priorityColors = {
    baixa: "text-gray-400",
    media: "text-blue-400",
    alta: "text-orange-400",
    urgente: "text-red-400"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 border border-white/10 rounded-[16px] p-4"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-white font-bold">{task.task_title}</h4>
        <Badge className={`${priorityColors[task.priority]} border-0 text-xs`}>
          {task.priority}
        </Badge>
      </div>
      <p className="text-gray-400 text-sm mb-3">{task.task_description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">+{task.points_reward} pts</span>
        <Button size="sm" className="bg-[#00E5FF] text-black hover:bg-[#00BFFF]">
          Completar
        </Button>
      </div>
    </motion.div>
  );
}

// TROPHIES TAB
function TrophiesTab({ trophies }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <h3 className="text-xl font-black text-white mb-4">Troféus e Conquistas</h3>
      
      {trophies.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-[20px] p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-white font-bold mb-2">Nenhum troféu ainda</p>
          <p className="text-gray-400 text-sm">Continue evoluindo para conquistar prêmios</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {trophies.map(trophy => (
            <TrophyCard key={trophy.id} trophy={trophy} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function TrophyCard({ trophy }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/5 border border-white/10 rounded-[16px] p-4 text-center"
    >
      {trophy.trophy_icon_url ? (
        <img src={trophy.trophy_icon_url} alt={trophy.trophy_name} className="w-16 h-16 mx-auto mb-3" />
      ) : (
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-3" />
      )}
      <p className="text-white font-bold text-sm mb-1">{trophy.trophy_name}</p>
      <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
        {trophy.quantity}x
      </Badge>
    </motion.div>
  );
}

// STATS TAB
function StatsTab({ user, weeklyAssessments }) {
  const fifaAttributes = user.fifa_attributes || {};
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <h3 className="text-xl font-black text-white mb-4">Estatísticas FIFA</h3>
      
      <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 space-y-4">
        <FifaStat label="Velocidade" value={fifaAttributes.pace || 50} color="text-green-400" />
        <FifaStat label="Finalização" value={fifaAttributes.shooting || 50} color="text-red-400" />
        <FifaStat label="Passe" value={fifaAttributes.passing || 50} color="text-yellow-400" />
        <FifaStat label="Drible" value={fifaAttributes.dribbling || 50} color="text-purple-400" />
        <FifaStat label="Defesa" value={fifaAttributes.defending || 50} color="text-blue-400" />
        <FifaStat label="Físico" value={fifaAttributes.physicality || 50} color="text-orange-400" />
      </div>
    </motion.div>
  );
}

function FifaStat({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-gray-400 text-sm font-bold">{label}</span>
        <span className={`${color} font-black`}>{value}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color.replace('text-', 'bg-')} shadow-lg`}
        />
      </div>
    </div>
  );
}

// PERFORMANCE TAB
function PerformanceTab({ user, weeklyAssessments, dailyCheckins }) {
  // Calcular IMC
  const calculateIMC = () => {
    if (!user.weight || !user.height) return null;
    const heightInMeters = user.height / 100;
    const imc = user.weight / (heightInMeters * heightInMeters);
    return imc.toFixed(1);
  };

  const getIMCStatus = (imc) => {
    if (!imc) return { label: "N/A", color: "text-gray-400" };
    if (imc < 18.5) return { label: "Abaixo", color: "text-blue-400" };
    if (imc < 25) return { label: "Ideal", color: "text-green-400" };
    if (imc < 30) return { label: "Acima", color: "text-yellow-400" };
    return { label: "Obesidade", color: "text-red-400" };
  };

  const imc = calculateIMC();
  const imcStatus = getIMCStatus(imc);

  // Calcular estatísticas de performance
  const totalGames = weeklyAssessments.filter(w => w.had_game).length;
  const totalGoals = weeklyAssessments.reduce((sum, w) => sum + (w.goals || 0), 0);
  const totalAssists = weeklyAssessments.reduce((sum, w) => sum + (w.assists || 0), 0);
  const totalTraining = weeklyAssessments.reduce((sum, w) => sum + (w.training_sessions || 0), 0);
  const avgRating = weeklyAssessments.length > 0 
    ? (weeklyAssessments.reduce((sum, w) => sum + (w.self_rating || 0), 0) / weeklyAssessments.length).toFixed(1)
    : 0;

  // Estilo de jogo baseado em posição e stats
  const getPlayingStyle = () => {
    const position = user.position || "";
    const goalsPerGame = totalGames > 0 ? (totalGoals / totalGames) : 0;
    const assistsPerGame = totalGames > 0 ? (totalAssists / totalGames) : 0;

    if (position === "atacante") {
      if (goalsPerGame > 0.7) return { style: "Finalizador Nato", icon: Target, color: "from-red-500 to-orange-500" };
      return { style: "Artilheiro", icon: Zap, color: "from-orange-500 to-yellow-500" };
    } else if (position === "meia") {
      if (assistsPerGame > 0.5) return { style: "Criador de Jogadas", icon: Brain, color: "from-cyan-500 to-blue-500" };
      return { style: "Organizador", icon: Eye, color: "from-blue-500 to-purple-500" };
    } else if (position === "zagueiro" || position === "lateral") {
      return { style: "Defensor Sólido", icon: Shield, color: "from-blue-500 to-indigo-500" };
    } else if (position === "volante") {
      return { style: "Equilibrador", icon: Activity, color: "from-purple-500 to-pink-500" };
    }
    return { style: "Versátil", icon: Star, color: "from-gray-500 to-gray-600" };
  };

  const playingStyle = getPlayingStyle();

  // Dados para gráficos (últimas 8 semanas)
  const chartData = weeklyAssessments.slice(0, 8).reverse().map((w, idx) => ({
    week: `S${idx + 1}`,
    goals: w.goals || 0,
    assists: w.assists || 0,
    rating: w.self_rating || 0,
    training: w.training_sessions || 0
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {/* Header com Estilo de Jogo */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${playingStyle.color} rounded-2xl p-4`}>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <playingStyle.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-wider">Estilo de Jogo</p>
              <p className="text-white text-lg font-black">{playingStyle.style}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-xs">Avaliação</p>
            <p className="text-white text-2xl font-black">{avgRating}</p>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop" 
            alt="Campo"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-gray-400 text-xs font-bold">Gols</p>
          </div>
          <p className="text-white text-2xl font-black">{totalGoals}</p>
          <p className="text-gray-500 text-[10px] mt-1">{totalGames} jogos</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-gray-400 text-xs font-bold">Assistências</p>
          </div>
          <p className="text-white text-2xl font-black">{totalAssists}</p>
          <p className="text-gray-500 text-[10px] mt-1">Total</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-gray-400 text-xs font-bold">Treinos</p>
          </div>
          <p className="text-white text-2xl font-black">{totalTraining}</p>
          <p className="text-gray-500 text-[10px] mt-1">Sessões</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-gray-400 text-xs font-bold">Média</p>
          </div>
          <p className="text-white text-2xl font-black">{avgRating}</p>
          <p className="text-gray-500 text-[10px] mt-1">Avaliação</p>
        </div>
      </div>

      {/* Dados Biométricos e IMC */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Ruler className="w-5 h-5 text-[#00E5FF]" />
          <h4 className="text-white font-bold text-sm">Dados Biométricos</h4>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Altura</p>
            <p className="text-white text-lg font-black">{user.height || "--"}<span className="text-xs text-gray-400">cm</span></p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Peso</p>
            <p className="text-white text-lg font-black">{user.weight || "--"}<span className="text-xs text-gray-400">kg</span></p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Pé</p>
            <p className="text-white text-lg font-black capitalize">{user.foot?.charAt(0) || "D"}</p>
          </div>
        </div>

        {imc && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-xs font-bold">Índice de Massa Corporal</p>
              <p className={`${imcStatus.color} text-xs font-bold`}>{imcStatus.label}</p>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-white text-3xl font-black">{imc}</p>
              <p className="text-gray-400 text-sm">kg/m²</p>
            </div>
            <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((imc / 30) * 100, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${imcStatus.color.replace('text-', 'bg-')}`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Gráfico de Performance */}
      {chartData.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#00E5FF]" />
              <h4 className="text-white font-bold text-sm">Evolução Semanal</h4>
            </div>
            <Badge className="bg-[#00E5FF]/20 text-[#00E5FF] text-[10px]">
              {chartData.length} semanas
            </Badge>
          </div>

          {/* Mini Chart - Goals & Assists */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs font-bold">Gols</span>
                <span className="text-red-400 text-xs font-bold">{totalGoals}</span>
              </div>
              <div className="flex items-end gap-1 h-16">
                {chartData.map((data, idx) => (
                  <div key={idx} className="flex-1 bg-white/5 rounded-t-lg relative group">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.goals / Math.max(...chartData.map(d => d.goals || 1))) * 100}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-red-500 to-orange-500 rounded-t-lg"
                    />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-[10px] font-bold">{data.goals}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs font-bold">Assistências</span>
                <span className="text-blue-400 text-xs font-bold">{totalAssists}</span>
              </div>
              <div className="flex items-end gap-1 h-16">
                {chartData.map((data, idx) => (
                  <div key={idx} className="flex-1 bg-white/5 rounded-t-lg relative group">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.assists / Math.max(...chartData.map(d => d.assists || 1))) * 100}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg"
                    />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-[10px] font-bold">{data.assists}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-3 px-1">
            {chartData.map((data, idx) => (
              <span key={idx} className="text-gray-500 text-[9px] font-bold">{data.week}</span>
            ))}
          </div>
        </div>
      )}

      {/* Conquistas Recentes */}
      <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h4 className="text-white font-bold text-sm">Destaques da Carreira</h4>
        </div>
        {user.career_highlights ? (
          <p className="text-gray-300 text-xs leading-relaxed">{user.career_highlights}</p>
        ) : (
          <p className="text-gray-500 text-xs italic">Nenhum destaque registrado ainda</p>
        )}
      </div>
    </motion.div>
  );
}