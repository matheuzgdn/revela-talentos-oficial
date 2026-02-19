import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  ChevronLeft, Share2, Flag, Video, Eye, Heart, 
  Play, Settings, LogOut, Trophy, Target, Zap,
  TrendingUp, DollarSign, Award, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MobileBottomNav from "../components/mobile/MobileBottomNav";
import VideoUploadModal from "../components/mobile/VideoUploadModal";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function AthleteProfile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    base44.auth.me()
      .then(u => {
        setUser(u);
        setIsLoading(false);
      })
      .catch(() => {
        setUser(null);
        setIsLoading(false);
      });
  }, []);

  const { data: myVideos = [] } = useQuery({
    queryKey: ['myVideos', user?.id],
    queryFn: () => base44.entities.AthleteVideo.filter({ athlete_id: user.id }, "-created_date", 50),
    enabled: !!user?.id,
  });

  const totalViews = myVideos.reduce((acc, v) => acc + (v.views_count || 0), 0);
  const totalLikes = myVideos.reduce((acc, v) => acc + (v.likes_count || 0), 0);
  const approvedVideos = myVideos.filter(v => v.status === "approved");

  const handleLogout = () => {
    base44.auth.logout(createPageUrl("RevelaTalentos"));
  };

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
      <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-28 h-28 bg-[#111111] rounded-3xl flex items-center justify-center mb-6 border border-[#222] shadow-lg shadow-[#00E5FF]/10"
          >
            <Zap className="w-14 h-14 text-[#00E5FF]" />
          </motion.div>
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">FAÇA LOGIN</h2>
          <p className="text-[#B3B3B3] text-center mb-8 text-sm">
            Entre para acessar seu perfil e estatísticas
          </p>
          <Button
            onClick={() => base44.auth.redirectToLogin()}
            className="bg-[#00E5FF] hover:bg-[#00BFFF] text-black font-bold px-10 py-6 rounded-2xl shadow-lg shadow-[#00E5FF]/30 transition-all hover:shadow-[#00E5FF]/50"
          >
            Entrar com Google
          </Button>
        </div>
        <MobileBottomNav onUploadClick={() => base44.auth.redirectToLogin()} />
      </div>
    );
  }

  // Stats data
  const stats = {
    games: myVideos.length,
    goals: totalLikes,
    penalty: `${approvedVideos.length}/${myVideos.length}`,
    impact: Math.min(Math.round((approvedVideos.length / Math.max(myVideos.length, 1)) * 100), 100),
    earnings: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24 overflow-x-hidden">
      {/* Watermark Background */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[600px] h-[600px] opacity-[0.03]">
          <img 
            src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png"
            alt=""
            className="w-full h-full object-contain blur-sm"
          />
        </div>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 flex items-center justify-between p-4 pt-6"
      >
        <Link to={createPageUrl("RevelaTalentos")}>
          <motion.div 
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 bg-[#111111] rounded-2xl flex items-center justify-center border border-[#222]"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </motion.div>
        </Link>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="w-11 h-11 bg-[#111111] rounded-2xl flex items-center justify-center border border-[#222]"
        >
          <Share2 className="w-5 h-5 text-white" />
        </motion.button>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 px-4 pb-6"
      >
        {/* Profile Image Container */}
        <div className="relative flex flex-col items-center">
          {/* Club Badge - Floating */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="absolute -top-2 z-20 w-16 h-16"
          >
            <img 
              src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png"
              alt="Club Badge"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </motion.div>

          {/* Main Profile Card */}
          <div className="relative mt-10">
            {/* Number Badge */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -right-4 top-4 z-30"
            >
              <div className="relative">
                <div className="w-20 h-24 bg-[#111111] rounded-[20px] flex flex-col items-center justify-center border border-[#222] shadow-lg shadow-[#00E5FF]/20">
                  <span className="text-5xl font-black text-white tracking-tighter">10</span>
                  <span className="text-[8px] text-[#B3B3B3] uppercase tracking-widest mt-1">GOL</span>
                </div>
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-[20px] bg-[#00E5FF]/10 blur-xl -z-10" />
              </div>
            </motion.div>

            {/* Profile Image */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative w-44 h-56 rounded-[24px] overflow-hidden border-2 border-[#222] shadow-2xl"
            >
              {user.profile_picture_url ? (
                <img 
                  src={user.profile_picture_url} 
                  alt={user.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#00E5FF] to-[#0066FF] flex items-center justify-center">
                  <span className="text-6xl font-black text-white">{user.full_name?.charAt(0)}</span>
                </div>
              )}
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />
            </motion.div>
          </div>

          {/* Name & Country */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">
              {user.full_name}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-lg">🇧🇷</span>
              <span className="text-[#B3B3B3] text-sm font-medium tracking-wide">BRAZIL</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Grid */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 px-4 py-4"
      >
        {/* Main Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <StatCard label="GAMES" value={stats.games} icon={<Trophy className="w-4 h-4" />} />
          <StatCard label="GOALS" value={stats.goals} icon={<Target className="w-4 h-4" />} />
          <StatCard label="PENALTY" value={stats.penalty} icon={<Award className="w-4 h-4" />} />
        </div>

        {/* Impact & Earnings Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Impact Card */}
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="relative bg-gradient-to-br from-[#00E5FF]/20 to-[#00E5FF]/5 rounded-[20px] p-5 border border-[#00E5FF]/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#00E5FF]/5 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-[#B3B3B3] uppercase tracking-widest font-bold">IMPACTFUL</span>
                <Star className="w-4 h-4 text-[#00E5FF]" />
              </div>
              <p className="text-4xl font-black text-[#00E5FF] mb-4">{stats.impact}%</p>
              
              {/* Mini Bar Chart */}
              <div className="flex items-end gap-1.5 h-10">
                {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex-1 bg-[#00E5FF] rounded-sm opacity-80"
                    style={{ boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[8px] text-[#666]">
                <span>MON</span>
                <span>WED</span>
                <span>FRI</span>
              </div>
            </div>
          </motion.div>

          {/* Earnings Card */}
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="relative bg-[#111111] rounded-[20px] p-5 border border-[#222] overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-[#B3B3B3] uppercase tracking-widest font-bold">EARNINGS</span>
                <DollarSign className="w-4 h-4 text-[#00E5FF]" />
              </div>
              <p className="text-4xl font-black text-white mb-4">{stats.earnings}</p>
              
              {/* Mini Line Chart */}
              <div className="relative h-10">
                <svg viewBox="0 0 100 40" className="w-full h-full">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#00E5FF" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M 0 30 Q 20 25, 35 20 T 60 15 T 85 8 T 100 5"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 1.5 }}
                  />
                  {/* Glow Point */}
                  <motion.circle
                    cx="100"
                    cy="5"
                    r="4"
                    fill="#00E5FF"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    style={{ filter: 'drop-shadow(0 0 6px #00E5FF)' }}
                  />
                </svg>
              </div>
              <div className="text-right text-[10px] text-[#00E5FF] mt-1 font-medium">
                {stats.earnings}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* My Videos Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 px-4 py-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Meus Vídeos</h2>
          <Badge className="bg-[#00E5FF]/20 text-[#00E5FF] border-0 text-[10px] font-bold">
            {myVideos.length}
          </Badge>
        </div>

        {myVideos.length === 0 ? (
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUploadModal(true)}
            className="bg-[#111111] rounded-[20px] p-8 text-center border border-[#222] border-dashed cursor-pointer hover:border-[#00E5FF]/50 transition-colors"
          >
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#222]">
              <Video className="w-8 h-8 text-[#00E5FF]" />
            </div>
            <p className="text-[#B3B3B3] mb-2 text-sm">Nenhum vídeo enviado</p>
            <span className="text-[#00E5FF] text-xs font-bold">TOQUE PARA ENVIAR</span>
          </motion.div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {myVideos.slice(0, 6).map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative aspect-[3/4] rounded-[16px] overflow-hidden bg-[#111111] border border-[#222]"
              >
                <img
                  src={video.thumbnail_url || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                {video.status === "pending" && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-yellow-500/90 rounded-lg">
                    <span className="text-[8px] font-black text-black">PENDING</span>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[9px] text-white/80">
                    <Eye className="w-3 h-3" /> {video.views_count || 0}
                  </div>
                  <div className="w-6 h-6 bg-[#00E5FF]/20 backdrop-blur rounded-full flex items-center justify-center">
                    <Play className="w-3 h-3 text-[#00E5FF] ml-0.5" fill="#00E5FF" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Settings Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 px-4 py-4"
      >
        <div className="bg-[#111111] rounded-[20px] overflow-hidden border border-[#222]">
          <Link
            to={createPageUrl("MeusServicos")}
            className="flex items-center gap-4 p-4 border-b border-[#1a1a1a] active:bg-[#1a1a1a] transition-colors"
          >
            <div className="w-11 h-11 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-[#222]">
              <Settings className="w-5 h-5 text-[#B3B3B3]" />
            </div>
            <span className="text-white flex-1 text-sm font-medium">Configurações</span>
            <ChevronLeft className="w-5 h-5 text-[#444] rotate-180" />
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 p-4 w-full active:bg-[#1a1a1a] transition-colors"
          >
            <div className="w-11 h-11 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
              <LogOut className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-red-400 text-sm font-medium">Sair da conta</span>
          </button>
        </div>
      </motion.section>

      <MobileBottomNav onUploadClick={() => setShowUploadModal(true)} />

      <VideoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        user={user}
      />
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, icon }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      className="bg-[#111111] rounded-[18px] p-4 border border-[#222] text-center"
    >
      <div className="flex items-center justify-center mb-2 text-[#444]">
        {icon}
      </div>
      <p className="text-2xl font-black text-white mb-1">{value}</p>
      <p className="text-[9px] text-[#666] uppercase tracking-widest font-bold">{label}</p>
    </motion.div>
  );
}