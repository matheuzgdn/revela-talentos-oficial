import React from "react";
import { motion } from "framer-motion";
import { Share2, Bookmark, Edit2, Star, Shield, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProfileHeroCard({ user, onEdit }) {
  const positionColors = {
    goleiro: "bg-yellow-500/90",
    zagueiro: "bg-blue-600/90",
    lateral: "bg-green-500/90",
    volante: "bg-purple-600/90",
    meia: "bg-cyan-500/90",
    atacante: "bg-red-600/90",
    default: "bg-white/10",
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
  const nationality = user?.nationality ?? user?.country ?? null;
  const currentClub = user?.current_club_name ?? user?.current_club ?? null;
  const crestUrl = user?.current_club_crest_url ?? null;

  const subtitleParts = [
    user?.athlete_position ? posLabel : null,
    nationality ? nationality : null,
    shirtNumber ? `#${shirtNumber}` : null,
    currentClub ? currentClub : null,
  ].filter(Boolean);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#070A12]">
      {/* 1) BACKGROUND LAYERS */}
      {/* Club crest watermark */}
      {crestUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.08] grayscale"
          style={{ backgroundImage: `url(${crestUrl})` }}
        />
      )}

      {/* Stadium texture (very subtle) */}
      <div className="absolute inset-0 opacity-[0.08] mix-blend-screen">
        <div className="absolute -inset-20 bg-[radial-gradient(circle_at_30%_20%,rgba(0,229,255,0.35),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(102,51,255,0.25),transparent_55%)]" />
      </div>

      {/* Shirt number watermark */}
      {shirtNumber && (
        <div className="pointer-events-none absolute -right-8 top-8 select-none">
          <div className="text-[160px] leading-none font-black tracking-tighter text-white/[0.06]">
            {shirtNumber}
          </div>
        </div>
      )}

      {/* Cinematic vignette + gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.06),transparent_45%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/70 to-black/95" />
      <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]" />

      {/* 2) CONTENT */}
      <div className="relative px-4 pt-5 pb-6">
        {/* Top actions */}
        <div className="flex items-center justify-between">
          <IconCircleButton ariaLabel="Compartilhar">
            <Share2 className="h-4 w-4 text-white/90" />
          </IconCircleButton>

          <div className="flex gap-2">
            <IconCircleButton ariaLabel="Editar perfil" onClick={onEdit}>
              <Edit2 className="h-4 w-4 text-white/90" />
            </IconCircleButton>

            <IconCircleButton ariaLabel="Favoritar">
              <Bookmark className="h-4 w-4 text-white/90" />
            </IconCircleButton>
          </div>
        </div>

        {/* Hero row */}
        <div className="mt-4 flex items-start gap-4">
          {/* Left identity stack */}
          <div className="flex-1">
            {/* Club + nationality mini chips */}
            <div className="mb-3 flex items-center gap-2 flex-wrap">
              {crestUrl ? (
                <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3 py-2 backdrop-blur">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/10">
                    <img
                      src={crestUrl}
                      alt="Clube"
                      className="h-6 w-6 object-contain"
                    />
                  </div>
                  <div className="leading-tight">
                    <p className="text-[10px] uppercase tracking-wider text-white/60">
                      Clube
                    </p>
                    <p className="text-sm font-bold text-white">
                      {currentClub || "—"}
                    </p>
                  </div>
                </div>
              ) : (
                currentClub && (
                  <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3 py-2 backdrop-blur">
                    <Shield className="h-4 w-4 text-white/70" />
                    <p className="text-sm font-bold text-white/80">
                      {currentClub}
                    </p>
                  </div>
                )
              )}

              {nationality && (
                <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3 py-2 backdrop-blur">
                  <Flag className="h-4 w-4 text-white/70" />
                  <p className="text-sm font-bold text-white/80">
                    {nationality}
                  </p>
                </div>
              )}
            </div>

            {/* Name */}
            <h1 className="text-[34px] font-black leading-[1.02] tracking-tight text-white">
              {user?.full_name || "Atleta"}
            </h1>

            {/* Subtitle line (reference-like) */}
            {subtitleParts.length > 0 && (
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.20em] text-white/60">
                {subtitleParts.join(" • ")}
              </p>
            )}

            {/* Position badge + level badge */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge
                className={`${posColor} border border-white/10 text-white font-black text-[11px] px-3 py-1 uppercase tracking-widest`}
              >
                {posLabel}
              </Badge>

              {user?.level && (
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(0,229,255,0.45),transparent_60%)] blur-md" />
                  <Badge className="relative border border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#BDF7FF] font-black text-[11px] px-3 py-1 uppercase tracking-widest">
                    LVL {user.level}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Avatar block */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: -6 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative w-[124px] h-[124px] -mt-6 shrink-0"
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(0,229,255,0.55),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(102,51,255,0.30),transparent_55%)] blur-xl" />
            {/* Ring */}
            <div className="absolute inset-0 rounded-full border border-white/20 bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]" />
            <img
              src={
                user?.profile_picture_url ||
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400"
              }
              alt={user?.full_name || "Atleta"}
              className="relative h-full w-full rounded-full object-cover border-4 border-[#00E5FF]/25 shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Stats row (cinematic cards) */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <StatCard label="IDADE" value={user?.age ?? "—"} />
          <StatCard label="JOGOS" value={user?.total_games ?? 0} />
          <StatCard label="GOLS" value={user?.total_goals ?? 0} />
        </div>

        {/* Platform score strip */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.45 }}
          className="mt-4 flex items-center justify-between rounded-2xl border border-[#00E5FF]/18 bg-gradient-to-r from-[#00E5FF]/10 via-white/5 to-[#6633FF]/10 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-2 rounded-2xl bg-[#00E5FF]/20 blur-lg" />
              <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-[#00E5FF]">
                <Star className="h-6 w-6 text-black" />
              </div>
            </div>
            <div className="leading-tight">
              <p className="text-[10px] font-bold uppercase tracking-[0.20em] text-white/60">
                Pontuação Total
              </p>
              <p className="text-xl font-black text-white">
                {user?.total_points ?? 0} pts
              </p>
            </div>
          </div>

          <Button
            onClick={onEdit}
            className="rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-black uppercase tracking-widest text-xs px-4 transition-all"
          >
            Editar
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function IconCircleButton({ children, ariaLabel, onClick }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={ariaLabel}
      onClick={onClick}
      className="h-10 w-10 rounded-full border border-white/10 bg-black/35 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-black/45"
    >
      {children}
    </Button>
  );
}

function StatCard({ label, value }) {
  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-center backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">
        {label}
      </p>
      <p className="mt-1 text-3xl font-black text-white">{value}</p>
    </motion.div>
  );
}