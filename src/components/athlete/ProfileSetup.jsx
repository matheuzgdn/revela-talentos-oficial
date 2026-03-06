import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Camera, Check, ChevronRight, ChevronLeft, Loader2 as Loader, Trophy, Calendar, MapPin, Activity } from "lucide-react";

// --- Translations ---
const T = {
  pt: {
    lang_title: "Escolha seu idioma",
    lang_sub: "Você poderá mudar depois.",
    welcome_badge: "Plataforma #1 de Talentos do Futebol",
    welcome_title: "Bem-vindo,",
    welcome_desc: "A plataforma mais completa para desenvolver, revelar e evoluir talentos do futebol.",
    stats_vid: "Vídeos analisados",
    stats_atl: "Atletas revelados",
    stats_pai: "Países",
    start_btn: "Começar",
    start_hint: "Leva menos de 2 minutos",

    step1_title: "Foto do Atleta",
    step1_sub: "Mostre o rosto dele ao mundo",
    step1_no_photo: "Sem foto",
    step1_desc: "Sua foto aparece no perfil público para olheiros e clubes",
    step1_chk1: "Olheiros veem o rosto",
    step1_chk2: "Perfil mais profissional",
    step1_chk3: "Maior visibilidade",
    btn_skip: "Pular por agora",
    btn_skip_short: "Pular",

    step2_title: "Dados Básicos",
    step2_sub: "Nome, cidade e idade",
    form_nationality: "Nacionalidade",
    form_age: "Idade",
    form_age_ph: "Ex: 17",
    form_city: "Cidade / Estado",
    form_city_ph: "Ex: São Paulo, SP",
    btn_continue: "Continuar",

    step3_title: "Físico",
    step3_sub: "Altura, peso e pé",
    form_height: "Altura (cm)",
    form_weight: "Peso (kg)",
    form_foot: "Pé Dominante",
    foot_r: "Destro",
    foot_r_sub: "Pé direito dominante",
    foot_l: "Canhoto",
    foot_l_sub: "Pé esquerdo dominante",
    foot_b: "Ambidestro",
    foot_b_sub: "Usa os dois pés",

    step4_title: "Posição em Campo",
    step4_sub: "Onde o atleta joga?",
    form_pos: "Posição principal",

    step5_title: "Clube",
    step5_sub: "Clube atual do atleta",
    form_club: "Clube Atual",
    form_club_ph: "Ex: EC Vitória Sub-17",
    form_prev_club: "Clube Anterior (Opcional)",
    form_prev_club_ph: "Ex: Escola de Futebol Santos",
    club_info_title: "Por que informar o clube?",
    club_info_desc: "Olheiros e clubes buscam atletas por posição e clube. Quanto mais completo, mais visível o perfil fica.",
    btn_save: "Salvar e Continuar",
    btn_saving: "Salvando...",
    logout: "Mudar Perfil"
  },
  es: {
    lang_title: "Elige tu idioma",
    lang_sub: "Podrás cambiar esto más tarde.",
    welcome_badge: "Plataforma #1 de Talentos de Fútbol",
    welcome_title: "Bienvenido,",
    welcome_desc: "La plataforma más completa para desarrollar, revelar y evolucionar talentos del fútbol.",
    stats_vid: "Videos analizados",
    stats_atl: "Atletas revelados",
    stats_pai: "Países",
    start_btn: "Comenzar",
    start_hint: "Toma menos de 2 minutos",

    step1_title: "Foto del Atleta",
    step1_sub: "Muestra su rostro al mundo",
    step1_no_photo: "Sin foto",
    step1_desc: "Su foto aparece en el perfil público para ojeadores y clubes",
    step1_chk1: "Los ojeadores ven el rostro",
    step1_chk2: "Perfil más profesional",
    step1_chk3: "Mayor visibilidad",
    btn_skip: "Saltar por ahora",
    btn_skip_short: "Saltar",

    step2_title: "Datos Básicos",
    step2_sub: "Nombre, ciudad y edad",
    form_nationality: "Nacionalidad",
    form_age: "Edad",
    form_age_ph: "Ej: 17",
    form_city: "Ciudad / Estado",
    form_city_ph: "Ej: Madrid",
    btn_continue: "Continuar",

    step3_title: "Físico",
    step3_sub: "Altura, peso y pie",
    form_height: "Altura (cm)",
    form_weight: "Peso (kg)",
    form_foot: "Pie Dominante",
    foot_r: "Diestro",
    foot_r_sub: "Pie derecho dominante",
    foot_l: "Zurdo",
    foot_l_sub: "Pie izquierdo dominante",
    foot_b: "Ambidiestro",
    foot_b_sub: "Usa ambos pies",

    step4_title: "Posición en Campo",
    step4_sub: "¿Dónde juega el atleta?",
    form_pos: "Posición principal",

    step5_title: "Club",
    step5_sub: "Club actual del atleta",
    form_club: "Club Actual",
    form_club_ph: "Ej: formativas Real Madrid",
    form_prev_club: "Club Anterior (Opcional)",
    form_prev_club_ph: "Ej: Escuela de Fútbol",
    club_info_title: "¿Por qué informar el club?",
    club_info_desc: "Los ojeadores buscan atletas por posición y club. Cuanto más completo, más visible es el perfil.",
    btn_save: "Guardar y Continuar",
    btn_saving: "Guardando...",
    logout: "Cambiar Perfil"
  }
};

const COUNTRIES = {
  pt: [
    "Brasil", "Portugal", "Argentina", "Espanha", "França",
    "Itália", "Alemanha", "Inglaterra", "Holanda", "Uruguai", "Colômbia"
  ],
  es: [
    "Brasil", "Portugal", "Argentina", "España", "Francia",
    "Italia", "Alemania", "Inglaterra", "Holanda", "Uruguay", "Colombia"
  ]
};

const POSITIONS = {
  pt: [
    { id: "goleiro", label: "🧤 Goleiro" },
    { id: "zagueiro", label: "🛡️ Zagueiro" },
    { id: "lateral", label: "🏃 Lateral" },
    { id: "volante", label: "⚙️ Volante" },
    { id: "meia", label: "🎯 Meia" },
    { id: "atacante", label: "⚡ Atacante" }
  ],
  es: [
    { id: "portero", label: "🧤 Portero" },
    { id: "defensa", label: "🛡️ Defensa" },
    { id: "lateral", label: "🏃 Lateral" },
    { id: "pivote", label: "⚙️ Pivote" },
    { id: "medio", label: "🎯 Medio" },
    { id: "delantero", label: "⚡ Delantero" }
  ]
};

// --- Components ---
const SVGBackground = () => (
  <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-20 z-0" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <rect width="100%" height="100%" fill="#020813" />
    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#00a8e1" strokeWidth="1" strokeOpacity="0.3" />
    <circle cx="50%" cy="50%" r="20%" fill="none" stroke="#00a8e1" strokeWidth="1" strokeOpacity="0.3" />
    <rect x="-10%" y="20%" width="20%" height="60%" fill="none" stroke="#00a8e1" strokeWidth="1" strokeOpacity="0.3" />
    <rect x="90%" y="20%" width="20%" height="60%" fill="none" stroke="#00a8e1" strokeWidth="1" strokeOpacity="0.3" />
  </svg>
);

const LogoSvg = () => (
  <div className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 mb-6 flex justify-center w-full">
    <svg viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 10 L80 30 L80 70 L50 90 L20 70 L20 30 Z" opacity="0.2" />
      <path d="M50 20 L70 35 L70 65 L50 80 L30 65 L30 35 Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="50" cy="50" r="15" />
      <path d="M40 0 L50 15 L60 0 Z" fill="currentColor" />
    </svg>
  </div>
);

const inputClass = "w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3.5 text-sm md:text-base outline-none focus:border-[#00a8e1] focus:ring-1 focus:ring-[#00a8e1]/30 transition placeholder:text-gray-500 font-medium";

// --- Main Wizard ---
export default function ProfileSetup({ isOpen, onClose, user, onSave }) {
  const [lang, setLang] = useState(null); // 'pt' or 'es'. null means Step 00
  const [step, setStep] = useState(0); // 0 = welcome, 1-5 forms
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [form, setForm] = useState({
    profile_picture_url: "",
    age: "", // Will translate to birth_date roughly for simplicity if API demands it, but user requested Age input "Ex: 17"
    nationality: "Brasil",
    cityState: "",
    height: "",
    weight: "",
    foot: "direito",
    position: "",
    current_club_name: "",
    previous_club_name: ""
  });

  useEffect(() => {
    if (user && isOpen) {
      setForm(prev => ({
        ...prev,
        profile_picture_url: user.profile_picture_url || "",
        nationality: user.nationality || "Brasil",
        cityState: user.city ? `${user.city}${user.state ? ` - ${user.state}` : ''}` : "",
        height: user.height || "",
        weight: user.weight || "",
        foot: user.foot || "direito",
        position: user.position || "",
        current_club_name: user.current_club_name || user.club || "",
      }));

      // Calculate age simply if birth_date exists:
      if (user.birth_date) {
        const bd = new Date(user.birth_date);
        const ageDifMs = Date.now() - bd.getTime();
        const ageDate = new Date(ageDifMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        setForm(prev => ({ ...prev, age: age.toString() }));
      }

      setLang(null);
      setStep(0);
    }
  }, [user, isOpen]);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const t = T[lang || 'pt'];

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.storage.uploadFile({ file });
      set("profile_picture_url", file_url);
    } catch {
      toast.error("Erro no upload.");
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Calculate a roughly approximate birth_date from Age, as API typically expects birth_date date format
      let birth_date = null;
      if (form.age) {
        const year = new Date().getFullYear() - parseInt(form.age);
        birth_date = `${year}-01-01`; // Approximation
      }

      let city = null;
      let state = null;
      if (form.cityState) {
        const parts = form.cityState.split(/[,-]/);
        city = parts[0].trim();
        state = parts[1] ? parts[1].trim() : null;
      }

      const updateData = {
        birth_date,
        position: form.position,
        nationality: form.nationality,
        foot: form.foot,
        profile_picture_url: form.profile_picture_url || null,
        city,
        state,
        height: form.height ? Number(form.height) : null,
        weight: form.weight ? Number(form.weight) : null,
        current_club_name: form.current_club_name || null,
        club: form.current_club_name || null,
        achievements: form.previous_club_name ? `Clube Anterior: ${form.previous_club_name}` : null,
        onboarding_completed: true
      };

      await base44.auth.updateMe(updateData);

      // Save lang preference locally
      if (lang) localStorage.setItem('lang_pref', lang);

      toast.success("Perfil configurado com sucesso!", { duration: 3000 });
      setTimeout(async () => {
        if (onSave) await onSave();
        setSaving(false);
        if (onClose) onClose();
      }, 600);
    } catch (error) {
      toast.error("Falha ao salvar.");
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const totalFormSteps = 5;

  return (
    <div className="fixed inset-0 z-[100] bg-[#020813] flex flex-col font-sans text-white overflow-hidden">
      <SVGBackground />

      {/* --- Top Nav --- */}
      <div className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="text-gray-400 hover:text-white p-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {step === 0 && <div className="w-10"></div>}

        {/* Dots Pagination */}
        {step > 0 && (
          <div className="flex gap-1.5 items-center">
            {[1, 2, 3, 4, 5].map(s => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-6 bg-[#00a8e1]' : s < step ? 'w-2 bg-[#00a8e1]' : 'w-2 bg-white/20'}`} />
            ))}
          </div>
        )}
        {step === 0 && <div />}

        <button onClick={onClose} className="text-sm font-semibold text-gray-400 flex items-center gap-2 hover:text-white transition">
          {lang ? t.logout : 'Sair'}
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <LogoSvg />
          </div>
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 w-full max-w-2xl mx-auto overflow-y-auto pb-20 no-scrollbar">

        <AnimatePresence mode="wait">

          {/* STEP 00: Language */}
          {!lang && (
            <motion.div key="step-lang" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full text-center space-y-8">
              <LogoSvg />
              <div>
                <h1 className="text-3xl font-bold mb-2">Escolha seu idioma / Elige tu idioma</h1>
                <p className="text-gray-400 text-sm">Você poderá mudar isso depois na edição do perfil.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <button onClick={() => setLang('pt')} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition flex items-center justify-center gap-3 text-xl font-bold">
                  🇧🇷 Português
                </button>
                <button onClick={() => setLang('es')} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition flex items-center justify-center gap-3 text-xl font-bold">
                  🇪🇸 Español
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 0: Welcome Stats */}
          {lang && step === 0 && (
            <motion.div key="step-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full text-center">
              <LogoSvg />
              <div className="mx-auto bg-transparent border border-[#00a8e1]/30 rounded-full py-1.5 px-4 inline-flex items-center gap-2 mb-8 shadow-[0_0_15px_rgba(0,168,225,0.15)] text-[#00a8e1] text-xs font-bold uppercase tracking-wide">
                ⚡ {t.welcome_badge}
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4">
                {t.welcome_title} <span className="text-[#00a8e1]">{user?.full_name?.split(' ')[0] || 'Usuário'}</span>
              </h1>
              <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed">
                {t.welcome_desc}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
                <div className="border border-white/20 rounded-2xl p-4 w-full sm:w-auto bg-transparent backdrop-blur-sm shadow-xl">
                  <h3 className="text-2xl font-black text-[#00e5ff]">500+</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t.stats_vid}</p>
                </div>
                <div className="border border-white/20 rounded-2xl p-4 w-full sm:w-auto bg-transparent backdrop-blur-sm shadow-xl">
                  <h3 className="text-2xl font-black text-purple-400">200+</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t.stats_atl}</p>
                </div>
                <div className="border border-white/20 rounded-2xl p-4 w-full sm:w-auto bg-transparent backdrop-blur-sm shadow-xl">
                  <h3 className="text-2xl font-black text-green-400">15+</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{t.stats_pai}</p>
                </div>
              </div>

              <div className="max-w-[280px] mx-auto">
                <button onClick={() => setStep(1)} className="w-full bg-[#00a8e1] hover:bg-cyan-400 text-black font-black text-xl py-4 rounded-2xl shadow-[0_0_40px_rgba(0,168,225,0.4)] transition-all flex justify-center items-center gap-3">
                  {t.start_btn} <ChevronRight className="w-6 h-6 stroke-[3]" />
                </button>
                <p className="text-xs text-gray-500 mt-4 font-medium">{t.start_hint}</p>
              </div>
            </motion.div>
          )}

          {/* STEP 1: Photo */}
          {lang && step === 1 && (
            <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-md mx-auto text-center">
              <div className="mb-8">
                <div className="inline-block bg-[#00a8e1]/10 border border-[#00a8e1]/30 text-[#00a8e1] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                  PASSO 1 DE 5
                </div>
                <h2 className="text-3xl font-black text-white">{t.step1_title}</h2>
                <p className="text-gray-400 text-sm mt-1">{t.step1_sub}</p>
              </div>

              {/* Photo Square Upload */}
              <div className="relative mx-auto w-40 h-40 border-2 border-white/10 rounded-[40px] flex items-center justify-center mb-8 overflow-hidden bg-white/5">
                {uploading ? (
                  <Loader className="w-8 h-8 text-[#00a8e1] animate-spin" />
                ) : form.profile_picture_url ? (
                  <img src={form.profile_picture_url} className="w-full h-full object-cover" alt="Avatar" />
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 border-2 border-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <div className="w-5 h-5 bg-gray-600 rounded-full mt-4" />
                    </div>
                    <span className="text-xs text-gray-500 font-semibold">{t.step1_no_photo}</span>
                  </div>
                )}
                <label className="absolute bottom-4 right-4 bg-[#00a8e1] w-10 h-10 rounded-xl flex justify-center items-center cursor-pointer shadow-lg hover:scale-105 transition-transform">
                  <Camera className="text-black w-5 h-5" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
              </div>

              <p className="text-white text-sm mb-4">{t.step1_desc}</p>
              <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 font-medium mb-10">
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#00a8e1]" /> {t.step1_chk1}</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#00a8e1]" /> {t.step1_chk2}</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#00a8e1]" /> {t.step1_chk3}</span>
              </div>

              <button onClick={() => setStep(2)} className="w-full bg-[#00a8e1] text-black font-black text-lg py-4 rounded-xl shadow-[0_0_30px_rgba(0,168,225,0.3)] transition-all flex justify-center items-center">
                {t.btn_skip} &rarr;
              </button>
            </motion.div>
          )}

          {/* STEP 2: Basic Data */}
          {lang && step === 2 && (
            <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-lg mx-auto text-center space-y-6">
              <div className="mb-4">
                <div className="inline-block bg-[#00a8e1]/10 border border-[#00a8e1]/30 text-[#00a8e1] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                  PASSO 2 DE 5
                </div>
                <h2 className="text-3xl font-black text-white">{t.step2_title}</h2>
                <p className="text-gray-400 text-sm mt-1">{t.step2_sub}</p>
              </div>

              <div className="text-left space-y-6">
                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-3">{t.form_nationality}</label>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {COUNTRIES[lang].map(c => {
                      const active = form.nationality === c;
                      return (
                        <button key={c} onClick={() => set("nationality", c)} className={`px-4 py-2 rounded-full border text-sm transition-colors font-medium ${active ? 'bg-[#00a8e1]/20 border-[#00a8e1] text-[#00a8e1]' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="text-left">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2 mb-2">
                    <Calendar className="w-3 h-3" /> {t.form_age}
                  </label>
                  <input type="number" value={form.age} onChange={e => set("age", e.target.value)} placeholder={t.form_age_ph} className={inputClass} />
                </div>

                <div className="text-left">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2 mb-2">
                    <MapPin className="w-3 h-3" /> {t.form_city}
                  </label>
                  <input type="text" value={form.cityState} onChange={e => set("cityState", e.target.value)} placeholder={t.form_city_ph} className={inputClass} />
                </div>
              </div>

              <button onClick={() => setStep(3)} className="w-full bg-[#006699] text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all flex justify-center items-center mt-6 hover:bg-[#0077b3]">
                {t.btn_continue} &rarr;
              </button>
            </motion.div>
          )}

          {/* STEP 3: Physical */}
          {lang && step === 3 && (
            <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-lg mx-auto text-center space-y-8">
              <div className="mb-4">
                <div className="inline-block bg-[#00a8e1]/10 border border-[#00a8e1]/30 text-[#00a8e1] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                  PASSO 3 DE 5
                </div>
                <h2 className="text-3xl font-black text-white">{t.step3_title}</h2>
                <p className="text-gray-400 text-sm mt-1">{t.step3_sub}</p>
              </div>

              <div className="flex gap-4 text-left">
                <div className="flex-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2 mb-2">
                    <Activity className="w-3 h-3" /> {t.form_height}
                  </label>
                  <div className="relative">
                    <input type="number" value={form.height} onChange={e => set("height", e.target.value)} placeholder="175" className={inputClass} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold text-sm">cm</span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2 mb-2">
                    <Activity className="w-3 h-3" /> {t.form_weight}
                  </label>
                  <div className="relative">
                    <input type="number" value={form.weight} onChange={e => set("weight", e.target.value)} placeholder="70" className={inputClass} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold text-sm">kg</span>
                  </div>
                </div>
              </div>

              <div className="text-left">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2 mb-3">
                  <img src="https://img.icons8.com/color/48/000000/cleats.png" alt="shoe" className="w-4 h-4 opacity-50 sepia grayscale" /> {t.form_foot}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[{ id: 'direito', l: t.foot_r, s: t.foot_r_sub }, { id: 'esquerdo', l: t.foot_l, s: t.foot_l_sub }, { id: 'ambidestro', l: t.foot_b, s: t.foot_b_sub }].map(foot => (
                    <button key={foot.id} onClick={() => set("foot", foot.id)} className={`p-4 rounded-2xl border text-center transition-all ${form.foot === foot.id ? 'bg-[#00a8e1]/10 border-[#00a8e1]' : 'bg-transparent border-white/10 hover:border-white/30'}`}>
                      <h4 className={`font-bold text-sm sm:text-base ${form.foot === foot.id ? 'text-white' : 'text-gray-300'}`}>{foot.l}</h4>
                      <p className="text-[10px] text-gray-500 mt-1 leading-tight">{foot.s}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep(4)} className="w-full bg-[#006699] text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all flex justify-center items-center hover:bg-[#0077b3]">
                {t.btn_continue} &rarr;
              </button>
            </motion.div>
          )}

          {/* STEP 4: Position */}
          {lang && step === 4 && (
            <motion.div key="step-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-lg mx-auto text-center space-y-8">
              <div className="mb-4">
                <div className="inline-block bg-[#00a8e1]/10 border border-[#00a8e1]/30 text-[#00a8e1] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                  PASSO 4 DE 5
                </div>
                <h2 className="text-3xl font-black text-white">{t.step4_title}</h2>
                <p className="text-gray-400 text-sm mt-1">{t.step4_sub}</p>
              </div>

              <div className="text-left">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-3">{t.form_pos}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {POSITIONS[lang].map(pos => (
                    <button key={pos.id} onClick={() => set("position", pos.id)} className={`px-4 py-4 rounded-2xl border text-center transition-all ${form.position === pos.id ? 'bg-[#00a8e1]/10 border-[#00a8e1] shadow-inner font-bold text-white' : 'bg-transparent border-white/10 hover:border-white/30 text-gray-300 font-medium'}`}>
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep(5)} className="w-full bg-[#006699] text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all flex justify-center items-center hover:bg-[#0077b3]">
                {t.btn_continue} &rarr;
              </button>
            </motion.div>
          )}

          {/* STEP 5: Club */}
          {lang && step === 5 && (
            <motion.div key="step-5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-lg mx-auto text-center space-y-6">
              <div className="mb-4">
                <div className="inline-block bg-[#00a8e1]/10 border border-[#00a8e1]/30 text-[#00a8e1] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                  PASSO 5 DE 5
                </div>
                <h2 className="text-3xl font-black text-white">{t.step5_title}</h2>
                <p className="text-gray-400 text-sm mt-1">{t.step5_sub}</p>
              </div>

              <div className="text-left space-y-5">
                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2">{t.form_club}</label>
                  <input type="text" value={form.current_club_name} onChange={e => set("current_club_name", e.target.value)} placeholder={t.form_club_ph} className={inputClass} />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2">{t.form_prev_club}</label>
                  <input type="text" value={form.previous_club_name} onChange={e => set("previous_club_name", e.target.value)} placeholder={t.form_prev_club_ph} className={inputClass} />
                </div>
              </div>

              <div className="bg-[#00a8e1]/5 border border-[#00a8e1]/20 rounded-2xl p-4 text-left flex gap-4">
                <Trophy className="w-6 h-6 text-[#00a8e1] flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight mb-1">{t.club_info_title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{t.club_info_desc}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={handleSave} className="px-6 py-4 rounded-xl border border-white/10 text-gray-400 font-medium text-sm hover:text-white transition-colors bg-white/5">
                  {t.btn_skip_short}
                </button>
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#00a8e1] text-black font-black text-lg py-4 rounded-xl shadow-[0_0_30px_rgba(0,168,225,0.3)] transition-all flex justify-center items-center hover:scale-[1.02]">
                  {saving ? <Loader className="w-6 h-6 animate-spin" /> : t.btn_save + " ->"}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
