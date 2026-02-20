import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Share2, Bookmark, Edit3, Trophy, Target, 
  TrendingUp, Calendar, CheckCircle2, Zap, Award,
  Clock, Activity, Heart, Droplet, Brain, Users,
  ChevronRight, Plus, Star, Flame, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import MobileBottomNav from "@/components/mobile/MobileBottomNav";
import VideoUploadModal from "@/components/mobile/VideoUploadModal";
import EditProfileModal from "@/components/athlete/EditProfileModal";
import DailyCheckinModal from "@/components/athlete/DailyCheckinModal";

export default function AthleteProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [dailyCheckins, setDailyCheckins] = useState([]);
  const [weeklyAssessments, setWeeklyAssessments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [trophies, setTrophies] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      // Load related data
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
      console.error("Error loading user data:", error);
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
  const totalGames = weeklyAssessments.reduce((sum, w) => sum + (w.had_game ? 1 : 0), 0);
  const totalGoals = weeklyAssessments.reduce((sum, w) => sum + (w.goals || 0), 0);
  const checkinStreak = dailyCheckins.length > 0 ? dailyCheckins[0].streak_days : 0;

  return (
    <div className="min-h-screen bg-[#070A12] pb-24 md:pb-8">
      {/* HERO SECTION - CINEMATOGRÁFICO */}
      <section className="relative overflow-hidden min-h-[60vh] md:min-h-[70vh]">
        {/* Background layers */}
        <div className="absolute inset-0">
          {/* Gradient base */}
          <div className="absolute inset-0 bg-gradient-radial from-[#00E5FF]/20 via-[#0A0F1A] to-[#070A12]" />
          
          {/* Club crest watermark */}
          {user.current_club_crest_url && (
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.06 }}
              transition={{ duration: 1 }}
              src={user.current_club_crest_url}
              alt="Club crest"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 object-contain grayscale blur-sm"
            />
          )}
          
          {/* Jersey number watermark */}
          {user.jersey_number && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[280px] font-black text-white opacity-[0.04] pointer-events-none">
              {user.jersey_number}
            </div>
          )}
          
          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#070A12]" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 pt-4 pb-8">
          {/* Top actions */}
          <div className="flex items-center justify-between mb-8">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-bold">BACK</span>
            </motion.button>

            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center"
              >
                <Share2 className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center"
              >
                <Bookmark className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEditModal(true)}
                className="w-11 h-11 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Edit3 className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>

          {/* Hero content */}
          <div className="flex items-end justify-between gap-6 max-w-4xl mx-auto">
            {/* Left side - Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 space-y-4"
            >
              {/* Club and nationality */}
              <div className="flex items-center gap-3">
                {user.current_club_crest_url && (
                  <img 
                    src={user.current_club_crest_url} 
                    alt="Club" 
                    className="w-10 h-10 object-contain"
                  />
                )}
                {user.nationality && (
                  <span className="text-2xl">{user.nationality}</span>
                )}
              </div>

              {/* Name */}
              <h1 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tighter">
                {user.full_name || "Atleta"}
              </h1>

              {/* Subtitle */}
              <div className="flex items-center gap-2 text-gray-400 text-xs md:text-sm uppercase tracking-widest">
                <span>{user.position || "Posição"}</span>
                {user.jersey_number && (
                  <>
                    <span>•</span>
                    <span>#{user.jersey_number}</span>
                  </>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {user.position && (
                  <Badge className={`${getPositionBadgeColor(user.position)} border font-bold uppercase text-xs px-3 py-1`}>
                    {user.position}
                  </Badge>
                )}
                
                <Badge className={`bg-gradient-to-r ${levelBadge.color} text-white border-0 font-bold uppercase text-xs px-3 py-1 shadow-lg shadow-[#00E5FF]/30 animate-pulse`}>
                  ⚡ {levelBadge.label}
                </Badge>
              </div>
            </motion.div>

            {/* Right side - Player image */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden sm:block"
            >
              {user.player_cutout_url ? (
                <>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-radial from-[#00E5FF]/40 via-[#00E5FF]/10 to-transparent blur-3xl scale-110" />
                  
                  {/* Player image */}
                  <img 
                    src={user.player_cutout_url}
                    alt={user.full_name}
                    className="relative z-10 h-[220px] md:h-[280px] w-auto object-contain drop-shadow-2xl"
                    style={{ filter: 'drop-shadow(0 20px 60px rgba(0, 229, 255, 0.5))' }}
                  />
                </>
              ) : user.profile_picture_url ? (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#00E5FF]/30 shadow-2xl">
                  <img 
                    src={user.profile_picture_url}
                    alt={user.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-[#0066FF]/20 border-4 border-[#00E5FF]/30 flex items-center justify-center">
                  <span className="text-5xl font-black text-[#00E5FF]">
                    {user.full_name?.charAt(0) || "A"}
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS CARDS */}
      <section className="px-3 md:px-4 -mt-4 mb-4 md:mb-6">
        <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-4xl mx-auto">
          <StatCard 
            label="Idade" 
            value={age || "--"} 
            delay={0}
          />
          <StatCard 
            label="Jogos" 
            value={totalGames} 
            delay={0.1}
          />
          <StatCard 
            label="Gols" 
            value={totalGoals} 
            delay={0.2}
          />
        </div>
      </section>

      {/* TOTAL POINTS CARD */}
      <section className="px-3 md:px-4 mb-4 md:mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-[#00E5FF]/20 to-[#0066FF]/20 border border-[#00E5FF]/30 rounded-[20px] md:rounded-[24px] p-4 md:p-6 shadow-xl shadow-[#00E5FF]/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 md:w-14 h-12 md:h-14 bg-[#00E5FF]/20 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Star className="w-6 md:w-7 h-6 md:h-7 text-[#00E5FF]" fill="#00E5FF" />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider font-bold mb-1">Pontuação Total</p>
                <motion.p 
                  className="text-2xl md:text-3xl font-black text-[#00E5FF]"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  {user.total_points?.toLocaleString() || "0"}
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* TABS NAVIGATION */}
      <section className="px-3 md:px-4 mb-4 md:mb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-4xl mx-auto pb-2">
          {[
            { id: "overview", label: "Visão Geral", icon: Activity },
            { id: "assessoria", label: "Assessoria", icon: Calendar },
            { id: "tasks", label: "Tarefas", icon: CheckCircle2 },
            { id: "trophies", label: "Troféus", icon: Trophy },
            { id: "stats", label: "FIFA", icon: TrendingUp }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/40'
                  : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              <tab.icon className="w-3.5 md:w-4 h-3.5 md:h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* TAB CONTENT */}
      <section className="px-3 md:px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && <OverviewTab user={user} checkinStreak={checkinStreak} onCheckinClick={() => setShowCheckinModal(true)} onAssessClick={() => setActiveTab("assessoria")} />}
            {activeTab === "assessoria" && <AssessoriaTab userId={user.id} dailyCheckins={dailyCheckins} weeklyAssessments={weeklyAssessments} onUpdate={loadUserData} onCheckinClick={() => setShowCheckinModal(true)} />}
            {activeTab === "tasks" && <TasksTab tasks={tasks} userId={user.id} onUpdate={loadUserData} />}
            {activeTab === "trophies" && <TrophiesTab trophies={trophies} />}
            {activeTab === "stats" && <StatsTab user={user} weeklyAssessments={weeklyAssessments} />}
          </AnimatePresence>
        </div>
      </section>

      <MobileBottomNav onUploadClick={() => setShowUploadModal(true)} />
      <VideoUploadModal 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
        user={user} 
      />
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onUpdate={loadUserData}
      />
      <DailyCheckinModal
        isOpen={showCheckinModal}
        onClose={() => setShowCheckinModal(false)}
        userId={user?.id}
        onComplete={loadUserData}
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
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur-xl border border-[#00E5FF]/15 rounded-[16px] md:rounded-[22px] p-3 md:p-4 text-center"
    >
      <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1 md:mb-2">
        {label}
      </p>
      <motion.p 
        className="text-2xl md:text-[32px] font-black text-white"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: delay + 0.2 }}
      >
        {value}
      </motion.p>
    </motion.div>
  );
}

// OVERVIEW TAB
function OverviewTab({ user, checkinStreak, onCheckinClick, onAssessClick }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {/* Daily streak */}
      <div className="bg-white/5 border border-white/10 rounded-[20px] p-4 md:p-6">
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

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <QuickActionCard 
          icon={Calendar}
          label="Check-in Diário"
          color="from-blue-500 to-cyan-500"
          onClick={onCheckinClick}
        />
        <QuickActionCard 
          icon={Target}
          label="Assessoria Semanal"
          color="from-purple-500 to-pink-500"
          onClick={onAssessClick}
        />
      </div>
    </motion.div>
  );
}

function QuickActionCard({ icon: Icon, label, color, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${color} rounded-[16px] md:rounded-[20px] p-4 md:p-6 text-left shadow-lg hover:shadow-xl transition-shadow`}
    >
      <Icon className="w-6 md:w-8 h-6 md:h-8 text-white mb-2 md:mb-3" />
      <p className="text-white font-bold text-xs md:text-sm">{label}</p>
    </motion.button>
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