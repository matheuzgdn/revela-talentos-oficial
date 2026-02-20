import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Share2, Bookmark, Edit3, Trophy, Target, 
  TrendingUp, Calendar, CheckCircle2, Zap, Award,
  Clock, Activity, Heart, Droplet, Brain, Users,
  ChevronRight, Plus, Star, Flame, Shield
} from "lucide-react";
import { createPageUrl } from "@/utils";
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
      {/* HERO SECTION - PREMIUM MINIMALISTA */}
      <section className="relative overflow-hidden pb-6">
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
                onClick={() => setShowEditModal(true)}
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

          {/* Player Card Premium */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <div className="relative">
              {/* Moldura com cantos */}
              <div className="relative p-0.5 bg-gradient-to-br from-[#00E5FF] to-[#0066FF] rounded-2xl">
                <div className="bg-black rounded-[14px] p-1">
                  <div className="w-32 h-32 rounded-xl overflow-hidden">
                    {user.profile_picture_url || user.player_cutout_url ? (
                      <img 
                        src={user.profile_picture_url || user.player_cutout_url}
                        alt={user.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#00E5FF]/20 to-[#0066FF]/20 flex items-center justify-center">
                        <span className="text-4xl font-black text-[#00E5FF]">
                          {user.full_name?.charAt(0) || "A"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Cantos decorativos */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#00E5FF]" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#00E5FF]" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#00E5FF]" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#00E5FF]" />
            </div>
          </motion.div>

          {/* Nome */}
          <h1 className="text-2xl font-black text-white text-center mb-3">
            {user.full_name || "SEU NOME"}
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
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm">
              <p className="text-[8px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Idade</p>
              <p className="text-xl font-black text-white">{age || "--"}</p>
            </div>
            
            {/* Nacionalidade */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm">
              <p className="text-[8px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">País</p>
              <p className="text-2xl">{user.nationality || "🌍"}</p>
            </div>
            
            {/* Jogos */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm">
              <p className="text-[8px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Jogos</p>
              <p className="text-xl font-black text-white">{totalGames}</p>
            </div>
          </div>

          {/* Clube atual */}
          {user.current_club_name && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 max-w-sm mx-auto mb-3 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                {user.current_club_crest_url && (
                  <div className="w-10 h-10 bg-white/5 rounded-lg p-1.5 flex-shrink-0">
                    <img src={user.current_club_crest_url} alt="Clube" className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Clube Atual</p>
                  <p className="text-white font-bold text-sm">{user.current_club_name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Clubes anteriores */}
          {user.previous_clubs && user.previous_clubs.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 max-w-sm mx-auto backdrop-blur-sm">
              <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-2">Clubes Anteriores</p>
              <div className="flex flex-wrap gap-2">
                {user.previous_clubs.map((club, idx) => (
                  <span key={idx} className="text-xs text-gray-300 bg-white/5 px-2 py-1 rounded-lg">
                    {club}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* STATS CARDS */}
      <section className="px-3 md:px-4 mb-3 md:mb-4">
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



      {/* TABS NAVIGATION */}
      <section className="px-3 mb-3">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar max-w-sm mx-auto">
          {[
            { id: "overview", label: "Geral", icon: Activity },
            { id: "assessoria", label: "Diário", icon: Calendar },
            { id: "tasks", label: "Tarefas", icon: CheckCircle2 },
            { id: "trophies", label: "Troféus", icon: Trophy },
            { id: "stats", label: "FIFA", icon: TrendingUp }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-3 py-2 rounded-full font-bold text-[10px] whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#00E5FF] text-black'
                  : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* TAB CONTENT */}
      <section className="px-3">
        <div className="max-w-sm mx-auto">
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

      {/* Seletiva Card Destaque */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#00E5FF]/20 via-[#0066FF]/20 to-[#00E5FF]/20 border-2 border-[#00E5FF] rounded-2xl p-4"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-[#00E5FF]/10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#00E5FF] rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-black" />
              </div>
              <div>
                <h4 className="text-white font-black text-sm">Seletiva Online</h4>
                <p className="text-[#00E5FF] text-[10px] font-bold">VAGAS LIMITADAS</p>
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-red-500 rounded-full"
            />
          </div>
          
          <p className="text-gray-300 text-xs mb-3">
            Participe da nossa próxima seletiva e seja visto por clubes profissionais
          </p>
          
          <Button 
            onClick={() => window.location.href = createPageUrl("SeletivaOnline")}
            className="w-full bg-[#00E5FF] hover:bg-[#00BFFF] text-black font-black text-sm"
          >
            INSCREVER-SE AGORA
          </Button>
        </div>
      </motion.div>

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