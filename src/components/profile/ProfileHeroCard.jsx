import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Share2, Bookmark, Edit2, Star, ArrowLeft, Shield, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProfileHeroCard({ user, onEdit }) {
  const positionColors = {
    goleiro: "from-yellow-500 to-orange-500",
    zagueiro: "from-blue-600 to-blue-800",
    lateral: "from-green-500 to-emerald-600",
    volante: "from-purple-600 to-purple-800",
    meia: "from-cyan-500 to-blue-600",
    atacante: "from-red-600 to-red-800",
    default: "from-gray-600 to-gray-800",
  };

  const positionLabels = {
    goleiro: "GOLEIRO",
    zagueiro: "ZAGUEIRO",
    lateral: "LATERAL",
    volante: "VOLANTE",
    meia: "MEIA",
    atacante: "ATACANTE",
    default: "ATLETA",
  };

  const posKey = user?.athlete_position || "default";
  const posColor = positionColors[posKey] ?? positionColors.default;
  const posLabel = positionLabels[posKey] ?? positionLabels.default;

  const shirtNumber = user?.shirt_number ?? user?.number ?? null;
  const nationality = user?.nationality ?? user?.country ?? "Brasil";
  const currentClub = user?.current_club_name ?? user?.current_club ?? null;
  const crestUrl = user?.current_club_crest_url ?? null;
  const playerCutoutUrl = user?.player_cutout_url ?? user?.profile_picture_url;

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#070A12] shadow-2xl">
      {/* ========== BACKGROUND LAYERS ========== */}
      
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-[#00E5FF]/25 via-[#1A1F2E] to-[#070A12]" />
      
      {/* Stadium texture */}
      <div 
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px) grayscale(1)",
        }}
      />
      
      {/* Club crest watermark */}
      {crestUrl && (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <img
            src={crestUrl}
            alt="Club"
            className="w-[400px] h-[400px] object-contain grayscale"
            style={{ filter: "blur(2px)" }}
          />
        </div>
      )}
      
      {/* Shirt number watermark */}
      {shirtNumber && (
        <div className="absolute -right-12 top-20 select-none pointer-events-none">
          <div className="text-[240px] font-black text-white/[0.04] leading-none">
            {shirtNumber}
          </div>
        </div>
      )}
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />
      
      {/* Top gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

      {/* ========== CONTENT ========== */}
      <div className="relative px-5 pt-4 pb-6">
        
        {/* Top action bar */}
        <div className="flex items-center justify-between mb-6">
          <GlassButton>
            <ArrowLeft className="w-4 h-4 text-white/90" />
            <span className="text-xs font-bold text-white/90 uppercase tracking-wider ml-2">Voltar</span>
          </GlassButton>
          
          <div className="flex items-center gap-2">
            <GlassIconButton ariaLabel="Compartilhar">
              <Share2 className="w-4 h-4 text-white/90" />
            </GlassIconButton>
            <GlassIconButton ariaLabel="Favoritar">
              <Bookmark className="w-4 h-4 text-white/90" />
            </GlassIconButton>
            <GlassIconButton ariaLabel="Editar" onClick={onEdit}>
              <Edit2 className="w-4 h-4 text-white/90" />
            </GlassIconButton>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex items-end justify-between gap-6 mb-6">
          
          {/* Left: Identity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 z-10"
          >
            {/* Club + Country chips */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {crestUrl && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <img src={crestUrl} alt="Clube" className="w-4 h-4 object-contain" />
                  </div>
                  <span className="text-xs font-bold text-white/80">{currentClub}</span>
                </div>
              )}
              
              {nationality && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                  <Flag className="w-3 h-3 text-white/70" />
                  <span className="text-xs font-bold text-white/80">{nationality}</span>
                </div>
              )}
            </div>

            {/* Name */}
            <h1 className="text-[38px] font-black leading-[0.95] tracking-tight text-white mb-3 drop-shadow-lg">
              {user?.full_name || "Atleta"}
            </h1>

            {/* Subtitle */}
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/60 mb-4">
              {posLabel}
              {shirtNumber && ` • #${shirtNumber}`}
            </p>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`bg-gradient-to-r ${posColor} text-white font-black text-[11px] px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg`}>
                {posLabel}
              </Badge>
              
              {user?.level && (
                <motion.div 
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(0, 229, 255, 0.3)",
                      "0 0 30px rgba(0, 229, 255, 0.5)",
                      "0 0 20px rgba(0, 229, 255, 0.3)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative"
                >
                  <Badge className="relative bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 font-black text-[11px] px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
                    NÍVEL {user.level}
                  </Badge>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right: Player Cutout */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
            }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="relative w-[200px] h-[280px] shrink-0"
          >
            {/* Glow behind player */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.4)_0%,transparent_70%)] blur-3xl scale-150" />
            
            {/* Player image */}
            <motion.img
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              src={playerCutoutUrl}
              alt={user?.full_name}
              className="relative w-full h-full object-contain drop-shadow-[0_10px_40px_rgba(0,229,255,0.5)] z-10"
            />
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <AnimatedStatCard label="IDADE" value={user?.age ?? "—"} delay={0.3} />
          <AnimatedStatCard label="JOGOS" value={user?.total_games ?? 0} delay={0.4} />
          <AnimatedStatCard label="GOLS" value={user?.total_goals ?? 0} delay={0.5} />
        </div>

        {/* Platform Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative rounded-[24px] border border-[#00E5FF]/20 bg-gradient-to-r from-[#00E5FF]/10 via-[#0099CC]/10 to-[#006699]/10 p-5 backdrop-blur-md overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,229,255,0.15),transparent_70%)] pointer-events-none" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Star icon with glow */}
              <motion.div 
                animate={{ 
                  filter: [
                    "drop-shadow(0 0 10px rgba(0, 229, 255, 0.5))",
                    "drop-shadow(0 0 20px rgba(0, 229, 255, 0.8))",
                    "drop-shadow(0 0 10px rgba(0, 229, 255, 0.5))",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-14 h-14 rounded-[20px] bg-[#00E5FF] flex items-center justify-center shadow-lg"
              >
                <Star className="w-7 h-7 text-black fill-black" />
              </motion.div>
              
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/60 mb-1">
                  Pontuação Total
                </p>
                <AnimatedNumber value={user?.total_points ?? 0} className="text-3xl font-black text-[#00E5FF]" />
              </div>
            </div>

            <Button
              onClick={onEdit}
              className="rounded-2xl bg-transparent hover:bg-[#00E5FF]/10 border-2 border-[#00E5FF]/40 text-[#00E5FF] font-black uppercase tracking-widest text-xs px-5 py-2 transition-all hover:border-[#00E5FF]/60"
            >
              Editar
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ========== COMPONENTS ==========

function GlassButton({ children, onClick }) {
  return (
    <Button
      onClick={onClick}
      className="h-10 px-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-all"
    >
      {children}
    </Button>
  );
}

function GlassIconButton({ children, ariaLabel, onClick }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={ariaLabel}
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-all"
    >
      {children}
    </Button>
  );
}

function AnimatedStatCard({ label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      className="rounded-[22px] bg-white/5 backdrop-blur-md border border-[#00E5FF]/15 p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-[#00E5FF]/30 transition-all"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60 mb-2">
        {label}
      </p>
      <AnimatedNumber value={value} className="text-[32px] font-black text-white" />
    </motion.div>
  );
}

function AnimatedNumber({ value, className }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : 0;

  useEffect(() => {
    if (numericValue === 0) {
      setDisplayValue(0);
      return;
    }

    let start = 0;
    const duration = 1000;
    const increment = numericValue / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [numericValue]);

  return (
    <span className={className}>
      {typeof value === 'number' ? displayValue : value}
    </span>
  );
}