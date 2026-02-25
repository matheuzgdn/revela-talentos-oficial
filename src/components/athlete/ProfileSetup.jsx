import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { UploadFile } from "@/integrations/Core";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// ─── Ícones SVG inline para evitar problemas de importação ────────────────────
const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
);
const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
);
const Check = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);
const Camera = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><circle cx="12" cy="13" r="3" /></svg>
);
const Loader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="animate-spin"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8" /></svg>
);

// ─── Configuração dos passos ───────────────────────────────────────────────────
const STEPS = [
  {
    id: 1,
    icon: "📸",
    title: "Sua Foto",
    subtitle: "Primeira impressão conta!",
    description: "Scouts e clubes vão ver sua foto. Use uma foto de rosto nítida, de preferência com equipamento esportivo."
  },
  {
    id: 2,
    icon: "👤",
    title: "Dados Pessoais",
    subtitle: "Quem é você?",
    description: "Precisamos saber sua data de nascimento para calcular sua categoria. Preencha cidade e estado para localização nos campeonatos."
  },
  {
    id: 3,
    icon: "⚽",
    title: "Dados Esportivos",
    subtitle: "Seu perfil atlético",
    description: "Posição, altura, peso e pé dominante são os primeiros dados que os olheiros consultam. Preencha com cuidado!"
  },
  {
    id: 4,
    icon: "🏆",
    title: "Clube & Conquistas",
    subtitle: "Sua carreira até aqui",
    description: "Informe seu clube atual e suas principais conquistas. Isso dá credibilidade ao seu perfil."
  }
];

const POSITIONS = [
  { value: "goleiro", label: "🧤 Goleiro" },
  { value: "zagueiro", label: "🛡️ Zagueiro" },
  { value: "lateral", label: "🏃 Lateral" },
  { value: "volante", label: "⚙️ Volante" },
  { value: "meia", label: "🎯 Meia" },
  { value: "atacante", label: "⚡ Atacante" }
];

const FEET = [
  { value: "direito", label: "Direito" },
  { value: "esquerdo", label: "Esquerdo" },
  { value: "ambidestro", label: "Ambidestro" }
];

const COUNTRIES = [
  { value: "Brasil", label: "🇧🇷 Brasil" },
  { value: "Argentina", label: "🇦🇷 Argentina" },
  { value: "Portugal", label: "🇵🇹 Portugal" },
  { value: "Espanha", label: "🇪🇸 Espanha" },
  { value: "Itália", label: "🇮🇹 Itália" },
  { value: "França", label: "🇫🇷 França" },
  { value: "Alemanha", label: "🇩🇪 Alemanha" },
  { value: "Inglaterra", label: "🇬🇧 Inglaterra" },
  { value: "EUA", label: "🇺🇸 EUA" },
  { value: "Outro", label: "🌍 Outro" }
];

// ─── Componente auxiliar de campo ─────────────────────────────────────────────
function Field({ label, required, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
        {label}
        {required && <span className="text-cyan-400 text-base leading-none">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-gray-600">{hint}</p>}
    </div>
  );
}

// ─── Estilo padronizado de input ──────────────────────────────────────────────
const inputClass =
  "w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 transition placeholder:text-gray-600";
const selectClass =
  "w-full bg-[#111] border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500/70 appearance-none transition";

// ─── Componente principal ──────────────────────────────────────────────────────
export default function ProfileSetup({ isOpen, onClose, user, onSave }) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    profile_picture_url: "",
    birth_date: "",
    nationality: "Brasil",
    phone: "",
    city: "",
    state: "",
    height: "",
    weight: "",
    foot: "direito",
    position: "",
    jersey_number: "",
    current_club_name: "",
    career_highlights: "",
    achievements: ""
  });

  // Preenche formulário ao abrir
  useEffect(() => {
    if (user && isOpen) {
      setForm({
        profile_picture_url: user.profile_picture_url || "",
        birth_date: user.birth_date || "",
        nationality: user.nationality || "Brasil",
        phone: user.phone || "",
        city: user.city || "",
        state: user.state || "",
        height: user.height || "",
        weight: user.weight || "",
        foot: user.foot || "direito",
        position: user.position || "",
        jersey_number: user.jersey_number || "",
        current_club_name: user.current_club_name || user.club || "",
        career_highlights: user.career_highlights || "",
        achievements: user.achievements || ""
      });
      setStep(1);
    }
  }, [user, isOpen]);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      set("profile_picture_url", file_url);
      toast.success("✅ Foto enviada com sucesso!");
    } catch {
      toast.error("❌ Erro ao enviar foto. Tente novamente.");
    }
    setUploading(false);
  };

  const validateStep = () => {
    if (step === 2 && !form.birth_date) {
      toast.error("⚠️ Data de nascimento é obrigatória");
      return false;
    }
    if (step === 3 && !form.position) {
      toast.error("⚠️ Selecione sua posição");
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep(s => Math.min(s + 1, STEPS.length));
  };

  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleSave = async () => {
    if (!form.birth_date) { toast.error("⚠️ Data de nascimento é obrigatória"); return; }
    if (!form.position) { toast.error("⚠️ Posição é obrigatória"); return; }

    setSaving(true);
    try {
      const updateData = {
        birth_date: form.birth_date,
        position: form.position,
        nationality: form.nationality || "Brasil",
        foot: form.foot || "direito",
        profile_picture_url: form.profile_picture_url || null,
        phone: form.phone || null,
        city: form.city || null,
        state: form.state || null,
        height: form.height ? Number(form.height) : null,
        weight: form.weight ? Number(form.weight) : null,
        jersey_number: form.jersey_number ? Number(form.jersey_number) : null,
        current_club_name: form.current_club_name || null,
        club: form.current_club_name || null,
        career_highlights: form.career_highlights || null,
        achievements: form.achievements || null,
        onboarding_completed: true
      };

      await base44.auth.updateMe(updateData);
      toast.success("🎉 Perfil salvo! Bem-vindo à EC10 Talentos!", { duration: 3000 });

      setTimeout(async () => {
        if (onSave) await onSave();
        setSaving(false);
        if (onClose) onClose();
      }, 600);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("❌ Erro ao salvar perfil. Tente novamente.");
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const currentStep = STEPS[step - 1];
  const progress = (step / STEPS.length) * 100;
  const isLastStep = step === STEPS.length;

  return (
    <div className="fixed inset-0 z-[100] bg-black/98 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        key="profile-setup"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="w-full sm:max-w-md bg-[#0D0D0D] border-t-2 sm:border-2 border-cyan-500/40 sm:rounded-3xl flex flex-col max-h-[96vh] overflow-hidden"
        style={{ boxShadow: "0 -20px 80px rgba(0,229,255,0.08)" }}
      >
        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4 border-b border-white/5 flex-shrink-0">
          {/* Barra de progresso */}
          <div className="flex items-center gap-2 mb-4">
            {STEPS.map(s => (
              <div
                key={s.id}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${s.id <= step ? "bg-cyan-500" : "bg-white/10"}`}
              />
            ))}
          </div>

          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{currentStep.icon}</span>
                <span className="text-[11px] font-bold text-cyan-500 uppercase tracking-widest">
                  Passo {step} de {STEPS.length}
                </span>
              </div>
              <h2 className="text-xl font-black text-white">{currentStep.title}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{currentStep.subtitle}</p>
            </div>
            {/* Avatar do usuário */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/10 bg-white/5 flex items-center justify-center">
                {form.profile_picture_url ? (
                  <img src={form.profile_picture_url} alt="foto" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">{user?.full_name?.charAt(0) || "?"}</span>
                )}
              </div>
            </div>
          </div>

          {/* Dica do passo */}
          <div className="mt-3 p-3 bg-cyan-500/5 border border-cyan-500/15 rounded-xl">
            <p className="text-xs text-gray-400 leading-relaxed">{currentStep.description}</p>
          </div>
        </div>

        {/* ── Conteúdo do passo ── */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.18 }}
              className="p-6 space-y-4"
            >

              {/* ── PASSO 1: Foto ── */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex flex-col items-center py-4">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-3xl border-2 border-dashed border-cyan-500/40 overflow-hidden bg-white/5 flex items-center justify-center">
                        {uploading ? (
                          <div className="text-cyan-400 animate-pulse text-4xl">⏳</div>
                        ) : form.profile_picture_url ? (
                          <img src={form.profile_picture_url} alt="foto" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4">
                            <div className="text-4xl mb-2">📷</div>
                            <p className="text-[10px] text-gray-600">Sem foto</p>
                          </div>
                        )}
                      </div>
                      <label className="absolute -bottom-2 -right-2 w-9 h-9 bg-cyan-500 rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition">
                        <Camera />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-6 text-center max-w-[220px]">
                      {form.profile_picture_url
                        ? "✅ Foto carregada! Você pode trocá-la clicando no ícone."
                        : "Toque no ícone de câmera para adicionar sua foto."}
                    </p>
                  </div>

                  {/* Nome (read-only) */}
                  <div className="p-4 bg-white/3 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-gray-600 uppercase font-bold mb-1">Seu nome na plataforma</p>
                    <p className="text-white font-semibold text-lg">{user?.full_name || "—"}</p>
                    <p className="text-[10px] text-gray-600 mt-1">Definido pela conta Google. Não pode ser alterado aqui.</p>
                  </div>
                </div>
              )}

              {/* ── PASSO 2: Dados Pessoais ── */}
              {step === 2 && (
                <div className="space-y-4">
                  <Field label="Data de Nascimento" required hint="Usada para calcular sua categoria de idade">
                    <input
                      type="date"
                      value={form.birth_date}
                      onChange={e => set("birth_date", e.target.value)}
                      className={inputClass}
                      style={{ colorScheme: "dark" }}
                    />
                  </Field>

                  <Field label="País / Nacionalidade">
                    <select
                      value={form.nationality}
                      onChange={e => set("nationality", e.target.value)}
                      className={selectClass}
                    >
                      {COUNTRIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Cidade">
                      <input
                        type="text"
                        value={form.city}
                        onChange={e => set("city", e.target.value)}
                        placeholder="Ex: São Paulo"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Estado (UF)">
                      <input
                        type="text"
                        value={form.state}
                        onChange={e => set("state", e.target.value.toUpperCase())}
                        placeholder="SP"
                        maxLength={2}
                        className={`${inputClass} uppercase`}
                      />
                    </Field>
                  </div>

                  <Field label="Telefone / WhatsApp">
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => set("phone", e.target.value)}
                      placeholder="(11) 99999-9999"
                      className={inputClass}
                    />
                  </Field>
                </div>
              )}

              {/* ── PASSO 3: Dados Esportivos ── */}
              {step === 3 && (
                <div className="space-y-4">
                  <Field label="Posição em Campo" required hint="Escolha sua posição principal">
                    <div className="grid grid-cols-2 gap-2">
                      {POSITIONS.map(pos => (
                        <button
                          key={pos.value}
                          type="button"
                          onClick={() => set("position", pos.value)}
                          className={`px-3 py-3 rounded-xl text-sm font-semibold border transition-all text-left ${form.position === pos.value
                              ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                              : "bg-white/3 border-white/10 text-gray-400 hover:bg-white/8 hover:text-white"
                            }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Pé Dominante">
                    <div className="flex gap-2">
                      {FEET.map(f => (
                        <button
                          key={f.value}
                          type="button"
                          onClick={() => set("foot", f.value)}
                          className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${form.foot === f.value
                              ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                              : "bg-white/3 border-white/10 text-gray-400 hover:bg-white/8"
                            }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Altura (cm)" hint="Ex: 178">
                      <input
                        type="number"
                        value={form.height}
                        onChange={e => set("height", e.target.value)}
                        placeholder="175"
                        min={100}
                        max={230}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Peso (kg)" hint="Ex: 72">
                      <input
                        type="number"
                        value={form.weight}
                        onChange={e => set("weight", e.target.value)}
                        placeholder="70"
                        min={30}
                        max={150}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Camisa nº">
                      <input
                        type="number"
                        value={form.jersey_number}
                        onChange={e => set("jersey_number", e.target.value)}
                        placeholder="10"
                        min={1}
                        max={99}
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </div>
              )}

              {/* ── PASSO 4: Clube & Conquistas ── */}
              {step === 4 && (
                <div className="space-y-4">
                  <Field label="Clube Atual" hint="Deixe em branco se está sem clube">
                    <input
                      type="text"
                      value={form.current_club_name}
                      onChange={e => set("current_club_name", e.target.value)}
                      placeholder="Nome do seu clube atual"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Principais Destaques" hint="Cite partidas, gols, assistências, participações em seletivas...">
                    <textarea
                      value={form.career_highlights}
                      onChange={e => set("career_highlights", e.target.value)}
                      placeholder="Ex: Artilheiro do campeonato regional 2023, participei de seletiva da CBF..."
                      className={`${inputClass} min-h-[90px] resize-none`}
                      rows={3}
                    />
                  </Field>

                  <Field label="Títulos & Conquistas" hint="Campeonatos, premiações, reconhecimentos...">
                    <textarea
                      value={form.achievements}
                      onChange={e => set("achievements", e.target.value)}
                      placeholder="Ex: Campeão Estadual Sub-17 pelo Santos FC (2022)"
                      className={`${inputClass} min-h-[70px] resize-none`}
                      rows={2}
                    />
                  </Field>

                  {/* Resumo final */}
                  <div className="p-4 bg-white/3 rounded-2xl border border-white/5 space-y-2 mt-2">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Resumo do seu perfil</p>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <span className="text-gray-500">Nascimento:</span>
                      <span className="text-white">{form.birth_date || "—"}</span>
                      <span className="text-gray-500">Posição:</span>
                      <span className="text-white">{POSITIONS.find(p => p.value === form.position)?.label || "—"}</span>
                      <span className="text-gray-500">Pé:</span>
                      <span className="text-white">{FEET.find(f => f.value === form.foot)?.label || "—"}</span>
                      <span className="text-gray-500">Altura:</span>
                      <span className="text-white">{form.height ? `${form.height} cm` : "—"}</span>
                      <span className="text-gray-500">Peso:</span>
                      <span className="text-white">{form.weight ? `${form.weight} kg` : "—"}</span>
                      <span className="text-gray-500">Clube:</span>
                      <span className="text-white">{form.current_club_name || "Sem clube"}</span>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Footer com botões ── */}
        <div className="px-6 pb-6 pt-4 border-t border-white/5 flex gap-3 flex-shrink-0">
          {step > 1 && (
            <button
              type="button"
              onClick={prev}
              className="flex items-center gap-1 px-5 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition text-sm font-medium"
            >
              <ChevronLeft />
              Voltar
            </button>
          )}

          {!isLastStep ? (
            <button
              type="button"
              onClick={next}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-sm transition shadow-lg shadow-cyan-500/30"
            >
              Continuar
              <ChevronRight />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm transition shadow-lg shadow-cyan-500/20 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader />
                  Salvando...
                </>
              ) : (
                <>
                  <Check />
                  Salvar Perfil
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}