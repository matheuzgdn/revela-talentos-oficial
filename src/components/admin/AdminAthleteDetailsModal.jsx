import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Play, Pause, Volume2, VolumeX, Maximize, Check,
  TrendingUp, Target, Shield, Trophy, Crown, Star,
  BarChart3, Activity, Zap, Lock, Unlock, Users,
  Upload, Eye, Heart, Sparkles, MessageCircle,
  ChevronRight, Video, CircleDot, Footprints, Wind,
  Crosshair, UserPlus, Gauge, Move, Dumbbell, MapPin, Clock
} from
  "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, AreaChart, Area } from 'recharts';

export default function AdminAthleteDetailsModal({ user, isOpen, onClose, onSave }) {
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [weeklyAssessments, setWeeklyAssessments] = useState([]);
  const [adminVideoFeedback, setAdminVideoFeedback] = useState("");
  const [isProcessingAnalysis, setIsProcessingAnalysis] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (user && isOpen) {
      setEditingUser({ ...user });
      loadAthleteData(user.id);
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (selectedVideo) {
      setAdminVideoFeedback(selectedVideo.admin_feedback || "");
    }
  }, [selectedVideo]);

  const loadAthleteData = async (userId) => {
    try {
      const [videosData, assessmentsData] = await Promise.all([
        base44.entities.AthleteVideo.filter({ athlete_id: userId }, '-created_date', 20),
        base44.entities.WeeklyAssessment.filter({ user_id: userId }, '-week_start_date', 8)]
      );
      setVideos(videosData || []);
      setWeeklyAssessments(assessmentsData || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    setEditingUser((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleRoleChange = (roleValue) => {
    if (roleValue === 'revela_admin') {
      setEditingUser((prev) => ({ ...prev, role: 'user', is_revela_admin: true }));
    } else if (roleValue === 'admin') {
      setEditingUser((prev) => ({ ...prev, role: 'admin', is_revela_admin: false }));
    } else {
      setEditingUser((prev) => ({ ...prev, role: 'user', is_revela_admin: false }));
    }
  };

  const handleSave = async () => {
    if (!editingUser) return;
    try {
      const { id, ...updateData } = editingUser;
      await base44.entities.User.update(id, updateData);

      await base44.entities.Notification.create({
        user_id: id,
        title: "Perfil Atualizado",
        message: "Seu perfil foi atualizado pela administração.",
        type: "general",
        priority: "medium"
      });

      toast.success("Atleta atualizado com sucesso!");
      onSave();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao atualizar atleta.");
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProcessAIAnalysis = async () => {
    if (!selectedVideo) return;
    setIsProcessingAnalysis(true);

    try {
      const prompt = `Você é um analista de desempenho esportivo especializado em futebol. Analise este vídeo de ${selectedVideo.athlete_name}, ${selectedVideo.position}.

Título: ${selectedVideo.title}
Descrição: ${selectedVideo.description || 'Sem descrição'}
Categoria: ${selectedVideo.category}

Forneça uma análise DETALHADA no seguinte formato JSON:
{
  "overall_score": número de 0 a 100,
  "video_quality": {
    "score": número de 0 a 100,
    "resolution": "boa/média/ruim",
    "lighting": "boa/média/ruim",
    "angle": "boa/média/ruim",
    "stability": "boa/média/ruim"
  },
  "performance_analysis": {
    "technical_skills": número de 0 a 100,
    "positioning": número de 0 a 100,
    "decision_making": número de 0 a 100,
    "physical_condition": número de 0 a 100
  },
  "detected_events": [
    {
      "type": "gol/assistencia/defesa/passe/drible/finalizacao",
      "timestamp": "00:00",
      "description": "descrição do evento",
      "quality": "excelente/boa/regular"
    }
  ],
  "strengths": ["ponto forte 1", "ponto forte 2", "ponto forte 3"],
  "weaknesses": ["ponto fraco 1", "ponto fraco 2"],
  "recommendations": ["recomendação 1", "recomendação 2", "recomendação 3"],
  "summary": "resumo completo da análise"
}`;

      const analysisResult = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            overall_score: { type: "number" },
            video_quality: { type: "object" },
            performance_analysis: { type: "object" },
            detected_events: { type: "array" },
            strengths: { type: "array" },
            weaknesses: { type: "array" },
            recommendations: { type: "array" },
            summary: { type: "string" }
          }
        }
      });

      await base44.entities.AthleteVideo.update(selectedVideo.id, {
        ai_analysis: analysisResult,
        status: 'approved'
      });

      toast.success("Análise de IA processada com sucesso!");

      // Recarregar dados
      await loadAthleteData(user.id);
      const updatedVideos = await base44.entities.AthleteVideo.filter({ athlete_id: user.id }, '-created_date', 20);
      setVideos(updatedVideos || []);
      setSelectedVideo(updatedVideos.find((v) => v.id === selectedVideo.id));

    } catch (error) {
      console.error("Erro ao processar análise:", error);
      toast.error("Erro ao processar análise de IA");
    }

    setIsProcessingAnalysis(false);
  };

  const handleSaveVideoFeedback = async () => {
    if (!selectedVideo) return;

    try {
      await base44.entities.AthleteVideo.update(selectedVideo.id, {
        admin_feedback: adminVideoFeedback,
        status: adminVideoFeedback ? 'approved' : selectedVideo.status
      });

      toast.success("Feedback salvo com sucesso!");

      // Atualizar o vídeo selecionado
      setSelectedVideo({ ...selectedVideo, admin_feedback: adminVideoFeedback });

      // Recarregar lista de vídeos
      const updatedVideos = await base44.entities.AthleteVideo.filter({ athlete_id: user.id }, '-created_date', 20);
      setVideos(updatedVideos || []);

    } catch (error) {
      console.error("Erro ao salvar feedback:", error);
      toast.error("Erro ao salvar feedback");
    }
  };

  const handleApproveVideo = async (videoId, status) => {
    try {
      await base44.entities.AthleteVideo.update(videoId, { status });
      toast.success(`Vídeo ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso!`);

      // Recarregar dados
      const updatedVideos = await base44.entities.AthleteVideo.filter({ athlete_id: user.id }, '-created_date', 20);
      setVideos(updatedVideos || []);
      if (selectedVideo?.id === videoId) {
        setSelectedVideo(updatedVideos.find((v) => v.id === videoId));
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status do vídeo");
    }
  };

  if (!editingUser) return null;

  // Preparar dados para gráficos
  const fifaData = [
    { attribute: 'VEL', value: editingUser.fifa_attributes?.pace || 50 },
    { attribute: 'FIN', value: editingUser.fifa_attributes?.shooting || 50 },
    { attribute: 'PAS', value: editingUser.fifa_attributes?.passing || 50 },
    { attribute: 'DRI', value: editingUser.fifa_attributes?.dribbling || 50 },
    { attribute: 'DEF', value: editingUser.fifa_attributes?.defending || 50 },
    { attribute: 'FÍS', value: editingUser.fifa_attributes?.physicality || 50 }];


  const performanceChartData = weeklyAssessments.slice(0, 6).reverse().map((w, idx) => ({
    week: `S${idx + 1}`,
    gols: w.goals || 0,
    assists: w.assists || 0,
    rating: (w.self_rating || 0) * 10,
    treinos: w.training_sessions || 0
  }));

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || m === 0 && today.getDate() < birth.getDate()) age--;
    return age;
  };

  const age = calculateAge(editingUser.birth_date);
  const overallRating = Math.round(
    Object.values(editingUser.fifa_attributes || {}).reduce((a, b) => a + b, 0) / (
      Object.keys(editingUser.fifa_attributes || {}).length || 1)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full md:w-[1400px] max-h-[95vh] bg-gradient-to-br from-[#0A0A0A] via-[#0D1117] to-[#0A0A0A] border-2 border-[#00E5FF]/30 text-white p-0 overflow-hidden flex flex-col">
        {/* HEADER ESTILO FIFA */}
        <div className="relative overflow-hidden">
          {/* BackgroundPattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00E5FF 2px, #00E5FF 4px)',
              backgroundSize: '100% 40px'
            }} />
          </div>

          <div className="relative p-4 md:p-6 pb-4">
            <div className="flex flex-col md:flex-row items-start justify-between mb-4 gap-4">
              <div className="flex items-center gap-3 md:gap-6 w-full md:w-auto">
                {/* Player Card Style */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF] to-[#0066FF] blur-xl opacity-40" />
                  <Avatar className="relative h-16 md:h-24 w-16 md:w-24 border-4 border-[#00E5FF] shadow-2xl shadow-[#00E5FF]/50">
                    <AvatarImage src={editingUser.profile_picture_url} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white text-2xl md:text-3xl font-black">
                      {editingUser.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {/* Overall Rating Badge */}
                  <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-xl flex items-center justify-center border-2 md:border-4 border-[#0A0A0A] shadow-xl">
                    <span className="text-black font-black text-base md:text-lg">{overallRating}</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-3xl font-black text-white mb-1 tracking-tight uppercase truncate">
                    {editingUser.full_name}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge className="bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 font-bold text-[10px] md:text-xs">
                      {editingUser.position?.toUpperCase() || 'SEM POSIÇÃO'}
                    </Badge>
                    {editingUser.current_club_name &&
                      <Badge className="bg-white/10 text-white border border-white/20 text-[10px] md:text-xs">
                        {editingUser.current_club_name}
                      </Badge>
                    }
                    {editingUser.nationality &&
                      <span className="text-xl md:text-2xl">{editingUser.nationality}</span>
                    }
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm truncate">{editingUser.email}</p>
                </div>

                {/* Quick Stats FIFA Style */}
                <div className="grid grid-cols-3 gap-2 md:gap-3 w-full md:w-auto">
                  <div className="bg-white/5 border border-white/10 rounded-lg md:rounded-xl p-2 md:p-3 text-center backdrop-blur-sm">
                    <p className="text-[#00E5FF] text-lg md:text-2xl font-black">{age || '--'}</p>
                    <p className="text-gray-400 text-[8px] md:text-[10px] uppercase tracking-wider font-bold">Idade</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg md:rounded-xl p-2 md:p-3 text-center backdrop-blur-sm">
                    <p className="text-green-400 text-lg md:text-2xl font-black">{editingUser.height || '--'}</p>
                    <p className="text-gray-400 text-[8px] md:text-[10px] uppercase tracking-wider font-bold">Altura</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg md:rounded-xl p-2 md:p-3 text-center backdrop-blur-sm">
                    <p className="text-purple-400 text-lg md:text-2xl font-black">{editingUser.weight || '--'}</p>
                    <p className="text-gray-400 text-[8px] md:text-[10px] uppercase tracking-wider font-bold">Peso</p>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center border border-white/10 transition-colors">

                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Tabs FIFA Style */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-white/5 border border-white/10 p-1 grid grid-cols-4 gap-1">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00E5FF] data-[state=active]:to-[#0066FF] data-[state=active]:text-black font-bold text-xs md:text-sm">

                  <BarChart3 className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                  <span className="hidden md:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="videos"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00E5FF] data-[state=active]:to-[#0066FF] data-[state=active]:text-black font-bold text-xs md:text-sm">

                  <Video className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                  <span className="hidden md:inline">Vídeos ({videos.length})</span>
                  <span className="md:hidden">({videos.length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="attributes"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00E5FF] data-[state=active]:to-[#0066FF] data-[state=active]:text-black font-bold text-xs md:text-sm">

                  <Trophy className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                  <span className="hidden md:inline">Atributos</span>
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00E5FF] data-[state=active]:to-[#0066FF] data-[state=active]:text-black font-bold text-xs md:text-sm">

                  <Shield className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                  <span className="hidden md:inline">Permissões</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* CONTENT AREA */}
        <ScrollArea className="flex-1 px-3 md:px-6">
          <Tabs value={activeTab} className="w-full">
            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="mt-0 space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                {/* FIFA Stats Radar */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-[#00E5FF]/10 to-[#0066FF]/10 border border-[#00E5FF]/30 rounded-2xl p-6">

                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#FFD700]" />
                    Atributos FIFA
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={fifaData}>
                      <PolarGrid stroke="#ffffff20" />
                      <PolarAngleAxis dataKey="attribute" stroke="#fff" tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#ffffff20" tick={{ fill: '#6B7280' }} />
                      <Radar name="Atributos" dataKey="value" stroke="#00E5FF" fill="#00E5FF" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="text-center mt-4">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-6 py-3 rounded-xl">
                      <Trophy className="w-5 h-5 text-black" />
                      <span className="text-black font-black text-2xl">{overallRating}</span>
                      <span className="text-black/70 text-sm font-bold">OVR</span>
                    </div>
                  </div>
                </motion.div>

                {/* Performance Timeline */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">

                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    Evolução de Performance
                  </h3>
                  {performanceChartData.length > 0 ?
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={performanceChartData}>
                        <defs>
                          <linearGradient id="colorGols" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorAssists" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey="week" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                        <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                          labelStyle={{ color: '#fff', fontWeight: 'bold' }} />

                        <Area type="monotone" dataKey="gols" stroke="#10B981" fillOpacity={1} fill="url(#colorGols)" strokeWidth={2} />
                        <Area type="monotone" dataKey="assists" stroke="#3B82F6" fillOpacity={1} fill="url(#colorAssists)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer> :

                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                      <p>Sem dados de performance ainda</p>
                    </div>
                  }
                </motion.div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {[
                  { label: 'Gols', value: weeklyAssessments.reduce((s, w) => s + (w.goals || 0), 0), icon: CircleDot, color: 'from-red-500 to-orange-500' },
                  { label: 'Assistências', value: weeklyAssessments.reduce((s, w) => s + (w.assists || 0), 0), icon: Footprints, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Jogos', value: weeklyAssessments.filter((w) => w.had_game).length, icon: Trophy, color: 'from-purple-500 to-pink-500' },
                  { label: 'Vídeos', value: videos.length, icon: Video, color: 'from-green-500 to-emerald-500' }].
                  map((stat, idx) =>
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`bg-gradient-to-br ${stat.color} bg-opacity-10 border border-white/10 rounded-xl p-3 md:p-4 text-center relative overflow-hidden`}>

                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
                      <stat.icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-white relative z-10" />
                      <p className="text-2xl md:text-3xl font-black text-white relative z-10">{stat.value}</p>
                      <p className="text-[10px] md:text-xs text-white/70 uppercase tracking-wider font-bold relative z-10">{stat.label}</p>
                    </motion.div>
                  )}
              </div>
            </TabsContent>

            {/* VIDEOS TAB */}
            <TabsContent value="videos" className="mt-0 space-y-3 md:space-y-4">
              {selectedVideo ?
                <div className="space-y-3 md:space-y-4">
                  {/* Video Info Header */}
                  <div className="bg-gradient-to-r from-[#00E5FF]/10 to-[#0066FF]/10 border border-[#00E5FF]/30 rounded-2xl p-4">
                    <h3 className="text-white font-bold text-base md:text-lg mb-2">{selectedVideo.title}</h3>
                    {selectedVideo.description &&
                      <p className="text-gray-400 text-xs md:text-sm mb-3">{selectedVideo.description}</p>
                    }
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30">
                        {selectedVideo.position?.toUpperCase() || 'POSIÇÃO'}
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {selectedVideo.category}
                      </Badge>
                      {selectedVideo.status === 'approved' ?
                        <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                          <Check className="w-3 h-3 mr-1" />
                          Aprovado
                        </Badge> :
                        selectedVideo.status === 'pending' ?
                          <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                            <Clock className="w-3 h-3 mr-1" />
                            Em Análise
                          </Badge> :

                          <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                            <X className="w-3 h-3 mr-1" />
                            Rejeitado
                          </Badge>
                      }
                    </div>
                  </div>

                  {/* Video Player Cinematográfico */}
                  <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border-2 border-[#00E5FF]/30">
                    <video
                      ref={videoRef}
                      src={selectedVideo.video_url}
                      className="w-full h-full object-contain"
                      onClick={togglePlay}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)} />


                    {/* Controles Modernos */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={togglePlay}
                          className="w-12 h-12 md:w-14 md:h-14 bg-[#00E5FF] rounded-full flex items-center justify-center shadow-2xl">

                          {isPlaying ?
                            <Pause className="w-6 h-6 md:w-7 md:h-7 text-black" fill="black" /> :
                            <Play className="w-6 h-6 md:w-7 md:h-7 text-black ml-1" fill="black" />
                          }
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={toggleMute}
                          className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">

                          {isMuted ? <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-white" /> : <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-white" />}
                        </motion.button>
                        <div className="flex-1" />
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => videoRef.current?.requestFullscreen()}
                          className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">

                          <Maximize className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </motion.button>
                      </div>
                    </div>

                    {!isPlaying &&
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={togglePlay}
                          className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#00E5FF] to-[#0066FF] rounded-full flex items-center justify-center shadow-2xl shadow-[#00E5FF]/50">

                          <Play className="w-10 h-10 md:w-12 md:h-12 text-black ml-1 md:ml-2" fill="black" />
                        </motion.button>
                      </motion.div>
                    }
                  </div>

                  {/* Overall Score Card */}
                  {selectedVideo.ai_analysis && selectedVideo.ai_analysis.overall_score &&
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 border-2 border-[#FFD700]/30 rounded-2xl p-6 text-center">

                      <Trophy className="w-12 h-12 md:w-16 md:h-16 text-[#FFD700] mx-auto mb-4" />
                      <h4 className="text-white font-bold text-lg md:text-xl mb-2">Nota Geral da Performance</h4>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-6xl md:text-7xl font-black text-[#FFD700]">
                          {selectedVideo.ai_analysis.overall_score}
                        </span>
                        <span className="text-3xl md:text-4xl text-gray-400">/100</span>
                      </div>
                      <Progress value={selectedVideo.ai_analysis.overall_score} className="h-4 mt-4" />
                    </motion.div>
                  }

                  {/* Video Analysis */}
                  {selectedVideo.ai_analysis &&
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-4 md:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold flex items-center gap-2 text-sm md:text-base">
                          <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                          Análise da IA
                        </h3>
                        <Badge className="bg-purple-500/20 text-purple-300 text-base md:text-lg px-3 md:px-4 py-1">
                          {selectedVideo.ai_analysis.overall_score}/100
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4">
                        {selectedVideo.ai_analysis.performance_analysis && Object.entries(selectedVideo.ai_analysis.performance_analysis).map(([key, value]) => {
                          const icon = key === 'technical_skills' ? Target :
                            key === 'positioning' ? MapPin :
                              key === 'decision_making' ? Activity :
                                key === 'physical_condition' ? Dumbbell : Wind;
                          return (
                            <div key={key} className="bg-white/5 rounded-xl p-3 border border-[#00E5FF]/20">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                  {React.createElement(icon, { className: "w-4 h-4 text-[#00E5FF]" })}
                                  <span className="text-gray-300 text-xs md:text-sm capitalize font-medium">{key.replace(/_/g, ' ')}</span>
                                </div>
                                <span className="text-white font-black text-sm md:text-base">{value}/100</span>
                              </div>
                              <Progress value={value} className="h-2" />
                            </div>);

                        })}
                      </div>

                      {selectedVideo.ai_analysis.detected_events && selectedVideo.ai_analysis.detected_events.length > 0 &&
                        <div className="mb-4">
                          <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[#00E5FF]" />
                            Eventos Detectados
                          </h4>
                          <div className="space-y-2">
                            {selectedVideo.ai_analysis.detected_events.map((event, idx) => {
                              const eventIcon = event.type === 'gol' ? CircleDot :
                                event.type === 'assistencia' ? Footprints :
                                  event.type === 'defesa' ? Shield :
                                    event.type === 'passe' ? Move :
                                      event.type === 'drible' ? Wind :
                                        Crosshair;
                              return (
                                <div key={idx} className="bg-white/5 rounded-lg p-3 flex items-center gap-3 border border-white/10">
                                  <div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF] to-[#0066FF] rounded-lg flex items-center justify-center flex-shrink-0">
                                    {React.createElement(eventIcon, { className: "w-5 h-5 text-black" })}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white text-xs md:text-sm font-bold capitalize">{event.type}</p>
                                    <p className="text-gray-400 text-[10px] md:text-xs truncate">{event.description}</p>
                                  </div>
                                  <Badge className="bg-[#00E5FF]/20 text-[#00E5FF] text-[10px] md:text-xs flex-shrink-0">
                                    {event.timestamp}
                                  </Badge>
                                </div>);

                            })}
                          </div>
                        </div>
                      }

                      {selectedVideo.ai_analysis.summary &&
                        <div className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
                          <p className="text-gray-300 text-xs md:text-sm leading-relaxed">{selectedVideo.ai_analysis.summary}</p>
                        </div>
                      }
                    </div>
                  }

                  {/* Admin Feedback & Analysis Controls */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-4 md:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-bold flex items-center gap-2 text-sm md:text-base">
                        <Shield className="w-5 h-5 text-purple-400" />
                        Painel do Analista
                      </h4>
                      <div className="flex gap-2">
                        {selectedVideo.status !== 'approved' &&
                          <Button
                            onClick={() => handleApproveVideo(selectedVideo.id, 'approved')}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white">

                            <Check className="w-4 h-4 mr-1" />
                            Aprovar
                          </Button>
                        }
                        {selectedVideo.status !== 'rejected' &&
                          <Button
                            onClick={() => handleApproveVideo(selectedVideo.id, 'rejected')}
                            size="sm"
                            variant="destructive">

                            <X className="w-4 h-4 mr-1" />
                            Rejeitar
                          </Button>
                        }
                      </div>
                    </div>

                    {!selectedVideo.ai_analysis &&
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-gray-300 text-sm">Este vídeo ainda não foi analisado pela IA</p>
                          <Button
                            onClick={handleProcessAIAnalysis}
                            disabled={isProcessingAnalysis}
                            size="sm"
                            className="bg-gradient-to-r from-[#00E5FF] to-[#0066FF] hover:from-[#00BFFF] hover:to-[#0055EE] text-black font-bold">

                            {isProcessingAnalysis ?
                              <>
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                                Processando...
                              </> :

                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Processar Análise IA
                              </>
                            }
                          </Button>
                        </div>
                      </div>
                    }

                    <div className="space-y-3">
                      <Label className="text-white font-medium text-sm">Feedback do Analista</Label>
                      <Textarea
                        value={adminVideoFeedback}
                        onChange={(e) => setAdminVideoFeedback(e.target.value)}
                        placeholder="Escreva seu feedback sobre a performance do atleta neste vídeo..."
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 min-h-[120px] focus:border-[#00E5FF]" />

                      <Button
                        onClick={handleSaveVideoFeedback}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white">

                        <Check className="w-4 h-4 mr-2" />
                        Salvar Feedback
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedVideo(null)}
                    variant="outline"
                    className="w-full border-white/10 text-white hover:bg-white/10">

                    ← Voltar aos Vídeos
                  </Button>
                </div> :

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                  {videos.map((video, idx) =>
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedVideo(video)}
                      className="relative aspect-video bg-gradient-to-br from-white/5 to-white/10 border-2 border-[#00E5FF]/20 rounded-xl overflow-hidden cursor-pointer group shadow-lg shadow-[#00E5FF]/10 hover:shadow-[#00E5FF]/30 transition-all">

                      <video src={video.video_url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#00E5FF] to-[#0066FF] rounded-full flex items-center justify-center shadow-xl shadow-[#00E5FF]/50">
                            <Play className="w-6 h-6 md:w-8 md:h-8 text-black ml-1" fill="black" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 right-2 md:right-3">
                          <p className="text-white text-[10px] md:text-xs font-bold line-clamp-2">{video.title}</p>
                          {video.ai_analysis &&
                            <Badge className="bg-purple-500/90 text-white text-[8px] md:text-[9px] mt-1 border border-purple-400/50">
                              <Sparkles className="w-2 h-2 md:w-2.5 md:h-2.5 mr-1" />
                              IA: {video.ai_analysis.overall_score}/100
                            </Badge>
                          }
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className={`text-[8px] md:text-[9px] ${video.status === 'approved' ? 'bg-green-500/90 text-white border border-green-400/50' :
                          video.status === 'pending' ? 'bg-yellow-500/90 text-black border border-yellow-400/50' :
                            'bg-red-500/90 text-white border border-red-400/50'}`
                        }>
                          {video.status === 'approved' ? <Check className="w-2.5 h-2.5" /> : video.status === 'pending' ? <Clock className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                        </Badge>
                      </div>
                    </motion.div>
                  )}
                  {videos.length === 0 &&
                    <div className="col-span-full bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 text-center">
                      <Video className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-sm md:text-base">Nenhum vídeo enviado ainda</p>
                    </div>
                  }
                </div>
              }
            </TabsContent>

            {/* ATTRIBUTES TAB */}
            <TabsContent value="attributes" className="mt-0 space-y-4">
              {/* Dados Pessoais */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#00E5FF]" />
                  Dados Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400 text-xs mb-2 block">Data de Nascimento</Label>
                    <Input
                      type="date"
                      value={editingUser.birth_date || ""}
                      onChange={(e) => handleFieldChange('birth_date', e.target.value)}
                      className="bg-white/5 border-white/20 text-white focus:border-[#00E5FF]" />

                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs mb-2 block">Nacionalidade</Label>
                    <Select value={editingUser.nationality || ""} onValueChange={(v) => handleFieldChange('nationality', v)}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-white/10">
                        <SelectItem value="🇧🇷">🇧🇷 Brasil</SelectItem>
                        <SelectItem value="🇦🇷">🇦🇷 Argentina</SelectItem>
                        <SelectItem value="🇵🇹">🇵🇹 Portugal</SelectItem>
                        <SelectItem value="🇪🇸">🇪🇸 Espanha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs mb-2 block">Telefone</Label>
                    <Input
                      value={editingUser.phone || ""}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      className="bg-white/5 border-white/20 text-white focus:border-[#00E5FF]" />

                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs mb-2 block">Cidade / Estado</Label>
                    <div className="flex gap-2">
                      <Input
                        value={editingUser.city || ""}
                        onChange={(e) => handleFieldChange('city', e.target.value)}
                        placeholder="Cidade"
                        className="bg-white/5 border-white/20 text-white focus:border-[#00E5FF]" />

                      <Input
                        value={editingUser.state || ""}
                        onChange={(e) => handleFieldChange('state', e.target.value.toUpperCase())}
                        maxLength={2}
                        placeholder="SP"
                        className="bg-white/5 border-white/20 text-white focus:border-[#00E5FF] w-20 uppercase" />

                    </div>
                  </div>
                </div>
              </div>

              {/* Dados de Atleta */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#FFD700]" />
                  Dados de Atleta
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-400 text-xs mb-2 block">Posição</Label>
                    <Select value={editingUser.position || ""} onValueChange={(v) => handleFieldChange('position', v)}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-white/10">
                        <SelectItem value="goleiro">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Goleiro
                          </div>
                        </SelectItem>
                        <SelectItem value="zagueiro">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Zagueiro
                          </div>
                        </SelectItem>
                        <SelectItem value="lateral">
                          <div className="flex items-center gap-2">
                            <Wind className="w-4 h-4" />
                            Lateral
                          </div>
                        </SelectItem>
                        <SelectItem value="volante">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Volante
                          </div>
                        </SelectItem>
                        <SelectItem value="meia">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Meia
                          </div>
                        </SelectItem>
                        <SelectItem value="atacante">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Atacante
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs mb-2 block">Pé Dominante</Label>
                    <Select value={editingUser.foot || "direito"} onValueChange={(v) => handleFieldChange('foot', v)}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-white/10">
                        <SelectItem value="direito">Direito</SelectItem>
                        <SelectItem value="esquerdo">Esquerdo</SelectItem>
                        <SelectItem value="ambidestro">Ambos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs mb-2 block">Camisa</Label>
                    <Input
                      type="number"
                      value={editingUser.jersey_number || ""}
                      onChange={(e) => handleFieldChange('jersey_number', parseInt(e.target.value))}
                      className="bg-white/5 border-white/20 text-white focus:border-[#00E5FF]" />

                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs mb-2 block">Altura (cm)</Label>
                    <Input
                      type="number"
                      value={editingUser.height || ""}
                      onChange={(e) => handleFieldChange('height', parseInt(e.target.value))}
                      className="bg-white/5 border-white/20 text-white focus:border-[#00E5FF]" />

                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs mb-2 block">Peso (kg)</Label>
                    <Input
                      type="number"
                      value={editingUser.weight || ""}
                      onChange={(e) => handleFieldChange('weight', parseInt(e.target.value))}
                      className="bg-white/5 border-white/20 text-white focus:border-[#00E5FF]" />

                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs mb-2 block">Nível</Label>
                    <Select value={editingUser.career_level || "iniciante"} onValueChange={(v) => handleFieldChange('career_level', v)}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-white/10">
                        <SelectItem value="iniciante">Iniciante</SelectItem>
                        <SelectItem value="promessa">Promessa</SelectItem>
                        <SelectItem value="destaque">Destaque</SelectItem>
                        <SelectItem value="elite">Elite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* FIFA Attributes Editor */}
              <div className="bg-gradient-to-br from-[#00E5FF]/5 to-[#0066FF]/5 border border-[#00E5FF]/20 rounded-2xl p-4 md:p-6">
                <h3 className="text-white font-bold mb-4 md:mb-6 flex items-center gap-2 text-base md:text-lg">
                  <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-[#00E5FF]" />
                  Editar Atributos FIFA
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {[
                    { key: 'pace', label: 'Velocidade', icon: Wind, color: 'green' },
                    { key: 'shooting', label: 'Finalização', icon: CircleDot, color: 'red' },
                    { key: 'passing', label: 'Passe', icon: Move, color: 'blue' },
                    { key: 'dribbling', label: 'Drible', icon: Footprints, color: 'purple' },
                    { key: 'defending', label: 'Defesa', icon: Shield, color: 'cyan' },
                    { key: 'physicality', label: 'Físico', icon: Dumbbell, color: 'orange' }].
                    map((attr) =>
                      <div key={attr.key} className="space-y-2 bg-white/5 rounded-xl p-3 md:p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                          <Label className="text-white font-bold flex items-center gap-2 text-sm md:text-base">
                            {React.createElement(attr.icon, { className: "w-4 h-4 md:w-5 md:h-5 text-[#00E5FF]" })}
                            {attr.label}
                          </Label>
                          <span className="text-xl md:text-2xl font-black text-[#00E5FF]">
                            {editingUser.fifa_attributes?.[attr.key] || 50}
                          </span>
                        </div>
                        <Input
                          type="range"
                          min="0"
                          max="99"
                          value={editingUser.fifa_attributes?.[attr.key] || 50}
                          onChange={(e) => handleFieldChange('fifa_attributes', {
                            ...editingUser.fifa_attributes,
                            [attr.key]: parseInt(e.target.value)
                          })}
                          className="w-full" />

                        <Progress
                          value={editingUser.fifa_attributes?.[attr.key] || 50}
                          className="h-2 md:h-3" />

                      </div>
                    )}
                </div>
              </div>

              {/* Destaques */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Destaques & Conquistas
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-400 text-xs mb-2 block">Destaques da Carreira</Label>
                    <Textarea
                      value={editingUser.career_highlights || ""}
                      onChange={(e) => handleFieldChange('career_highlights', e.target.value)}
                      className="bg-white/5 border-white/20 text-white min-h-[100px] focus:border-[#00E5FF]" />

                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs mb-2 block">Conquistas & Títulos</Label>
                    <Textarea
                      value={editingUser.achievements || ""}
                      onChange={(e) => handleFieldChange('achievements', e.target.value)}
                      className="bg-white/5 border-white/20 text-white min-h-[100px] focus:border-[#00E5FF]" />

                  </div>
                </div>
              </div>
            </TabsContent>

            {/* SETTINGS/PERMISSIONS TAB */}
            <TabsContent value="settings" className="mt-0 space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-white font-bold text-lg mb-4">Controle de Acesso</h3>

                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl">
                  <Label className="flex items-center gap-3 text-white font-medium">
                    {editingUser.is_approved ?
                      <Unlock className="w-5 h-5 text-green-400" /> :
                      <Lock className="w-5 h-5 text-red-400" />
                    }
                    <span>Acesso Aprovado à Plataforma</span>
                  </Label>
                  <Switch
                    checked={!!editingUser.is_approved}
                    onCheckedChange={(c) => handleFieldChange('is_approved', c)}
                    className="data-[state=checked]:bg-green-500" />

                </div>

                <div className="flex items-center justify-between p-5 bg-white/5 border border-white/20 rounded-xl">
                  <Label className="flex items-center gap-3 text-white font-medium">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span>Acesso ao Revela Talentos</span>
                  </Label>
                  <Switch
                    checked={!!editingUser.has_revela_talentos_access}
                    onCheckedChange={(c) => handleFieldChange('has_revela_talentos_access', c)}
                    className="data-[state=checked]:bg-yellow-500" />

                </div>

                {/* Toggle: Bloquear Conteúdo */}
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl">
                  <Label className="flex items-center gap-3 text-white font-medium">
                    {editingUser.has_revela_talentos_access === false
                      ? <Lock className="w-5 h-5 text-red-400" />
                      : <Unlock className="w-5 h-5 text-green-400" />
                    }
                    <div>
                      <span className="block">Bloquear Conteúdo da Plataforma</span>
                      <span className="text-xs text-gray-400 font-normal">
                        {editingUser.has_revela_talentos_access === false
                          ? "Ativo — usuário vê cadeado em todos os conteúdos"
                          : "Inativo — usuário acessa normalmente"}
                      </span>
                    </div>
                  </Label>
                  <Switch
                    checked={editingUser.has_revela_talentos_access === false}
                    onCheckedChange={(c) => handleFieldChange('has_revela_talentos_access', !c)}
                    className="data-[state=checked]:bg-red-500" />
                </div>

                {/* Toggle: Área de Membros */}
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#00a8e1]/10 to-blue-500/10 border border-[#00a8e1]/30 rounded-xl">
                  <Label className="flex items-center gap-3 text-white font-medium">
                    {editingUser.has_zona_membros_access
                      ? <Unlock className="w-5 h-5 text-[#00a8e1]" />
                      : <Lock className="w-5 h-5 text-gray-400" />
                    }
                    <div>
                      <span className="block">Área de Membros</span>
                      <span className="text-xs text-gray-400 font-normal">
                        {editingUser.has_zona_membros_access
                          ? "Ativo — usuário é direcionado à Zona de Membros"
                          : "Inativo — usuário acessa normalmente"}
                      </span>
                    </div>
                  </Label>
                  <Switch
                    checked={!!editingUser.has_zona_membros_access}
                    onCheckedChange={(c) => handleFieldChange('has_zona_membros_access', c)}
                    className="data-[state=checked]:bg-[#00a8e1]" />
                </div>


                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl">
                  <Label className="flex items-center gap-3 text-green-300 font-medium">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span>Acesso ao Plano de Carreira</span>
                  </Label>
                  <Switch
                    checked={!!editingUser.has_plano_carreira_access}
                    onCheckedChange={(c) => handleFieldChange('has_plano_carreira_access', c)}
                    className="data-[state=checked]:bg-green-500" />

                </div>

                <div className="flex items-center justify-between p-5 bg-white/5 border border-white/20 rounded-xl">
                  <Label className="flex items-center gap-3 text-white font-medium">
                    <Crown className="w-5 h-5 text-cyan-400" />
                    <span>Promover a Atleta em Destaque</span>
                  </Label>
                  <Switch
                    checked={!!editingUser.is_featured}
                    onCheckedChange={(c) => handleFieldChange('is_featured', c)}
                    className="data-[state=checked]:bg-cyan-500" />

                </div>

                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl">
                  <Label className="flex items-center gap-3 text-white font-medium">
                    <Shield className="w-5 h-5 text-red-400" />
                    <span>Função / Permissão</span>
                  </Label>
                  <Select
                    value={editingUser.role === 'admin' ? 'admin' : editingUser.is_revela_admin ? 'revela_admin' : 'user'}
                    onValueChange={handleRoleChange}>

                    <SelectTrigger className="w-56 bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-white/10">
                      <SelectItem value="user">Usuário Padrão</SelectItem>
                      <SelectItem value="revela_admin">Admin Revela</SelectItem>
                      <SelectItem value="admin">Admin Geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clube & URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#00E5FF]" />
                    Clube Atual
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-400 text-xs mb-2 block">Nome do Clube</Label>
                      <Input
                        value={editingUser.current_club_name || ""}
                        onChange={(e) => handleFieldChange('current_club_name', e.target.value)}
                        className="bg-white/5 border-white/20 text-white focus:border-[#00E5FF]" />

                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs mb-2 block">URL do Escudo</Label>
                      <Input
                        value={editingUser.current_club_crest_url || ""}
                        onChange={(e) => handleFieldChange('current_club_crest_url', e.target.value)}
                        className="bg-white/5 border-white/20 text-white focus:border-[#00E5FF]" />

                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-[#00E5FF]" />
                    Mídias
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-400 text-xs mb-2 block">Foto de Perfil</Label>
                      <Input
                        value={editingUser.profile_picture_url || ""}
                        onChange={(e) => handleFieldChange('profile_picture_url', e.target.value)}
                        className="bg-white/5 border-white/20 text-white focus:border-[#00E5FF]" />

                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs mb-2 block">Imagem Recortada</Label>
                      <Input
                        value={editingUser.player_cutout_url || ""}
                        onChange={(e) => handleFieldChange('player_cutout_url', e.target.value)}
                        className="bg-white/5 border-white/20 text-white focus:border-[#00E5FF]" />

                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>


          </Tabs>
        </ScrollArea>

        {/* FOOTER ESTILO FIFA */}
        <div className="border-t border-[#00E5FF]/20 bg-gradient-to-r from-[#0A0A0A] to-[#0D1117] p-3 md:p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-400 text-xs md:text-sm">Última atualização: {new Date(editingUser.updated_date || Date.now()).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex gap-2 md:gap-3 w-full md:w-auto">
              <Button
                onClick={onClose}
                variant="outline" className="bg-red-600 text-white px-4 py-2 text-sm font-medium rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border shadow-sm hover:text-accent-foreground h-9 border-white/20 hover:bg-white/10 flex-1 md:flex-none md:px-8">


                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-[#00E5FF] to-[#0066FF] hover:from-[#00BFFF] hover:to-[#0055EE] text-black font-black flex-1 md:flex-none md:px-8 shadow-xl shadow-[#00E5FF]/30">

                <Check className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>);

}