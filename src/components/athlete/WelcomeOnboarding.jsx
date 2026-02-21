import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { ChevronRight, User, Calendar, Globe, Target, Ruler, Trophy, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function WelcomeOnboarding({ isOpen, onClose, user, onComplete }) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState({
    full_name: "",
    profile_picture_url: "",
    birth_date: "",
    nationality: "🇧🇷",
    position: "",
    height: "",
    weight: "",
    foot: "direito",
    current_club_name: ""
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setData(prev => ({ ...prev, profile_picture_url: file_url }));
      toast.success("✅ Foto enviada!");
    } catch (error) {
      toast.error("❌ Erro ao enviar foto");
    }
    setUploading(false);
  };

  const handleFinish = async () => {
    try {
      setSaving(true);
      console.log("🚀 Salvando cadastro inicial:", data);

      // Validações
      if (!data.full_name?.trim()) {
        toast.error("⚠️ Nome é obrigatório");
        setSaving(false);
        return;
      }

      if (!data.birth_date) {
        toast.error("⚠️ Data de nascimento é obrigatória");
        setSaving(false);
        return;
      }

      if (!data.position) {
        toast.error("⚠️ Posição é obrigatória");
        setSaving(false);
        return;
      }

      // Preparar dados
      const saveData = {
        full_name: data.full_name.trim(),
        profile_picture_url: data.profile_picture_url || null,
        birth_date: data.birth_date,
        nationality: data.nationality || "🇧🇷",
        position: data.position,
        height: data.height ? Number(data.height) : null,
        weight: data.weight ? Number(data.weight) : null,
        foot: data.foot || "direito",
        current_club_name: data.current_club_name || null,
        total_points: 0,
        career_level: "iniciante"
      };

      console.log("💾 Dados para salvar:", saveData);

      // Salvar no banco
      await base44.auth.updateMe(saveData);
      
      console.log("✅ Cadastro salvo com sucesso!");
      toast.success("✅ Perfil criado com sucesso!", { duration: 2000 });

      // Marcar tutorial como completo
      localStorage.setItem('tutorial_completed', 'true');

      // Recarregar e fechar
      setTimeout(() => {
        onComplete?.();
        onClose();
      }, 500);

    } catch (error) {
      console.error("❌ Erro ao salvar cadastro:", error);
      toast.error("❌ Erro ao criar perfil");
      setSaving(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return data.full_name?.trim();
    if (step === 1) return data.birth_date;
    if (step === 2) return data.position;
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-sm flex items-end md:items-center justify-center">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        className="w-full max-w-md bg-[#0A0A0A] border-t-2 md:border-2 border-[#00E5FF]/30 md:rounded-3xl overflow-hidden max-h-[95vh] flex flex-col"
      >
        {/* Progress */}
        <div className="h-2 bg-white/10">
          <motion.div
            animate={{ width: `${((step + 1) / 6) * 100}%` }}
            className="h-full bg-[#00E5FF]"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#00E5FF] rounded-2xl flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Bem-vindo ao EC10! ⚽</h2>
                <p className="text-gray-400 text-sm">Vamos criar seu perfil de atleta</p>
              </div>

              <div>
                <label className="text-white text-xs uppercase mb-2 block font-bold">
                  <User className="w-3 h-3 inline mr-1" /> Qual seu nome completo? *
                </label>
                <Input
                  value={data.full_name}
                  onChange={(e) => setData({ ...data, full_name: e.target.value })}
                  placeholder="Digite seu nome completo"
                  className="bg-white/5 border-white/10 text-white rounded-xl h-12 text-base"
                  autoFocus
                />
              </div>

              <div className="flex flex-col items-center">
                <label className="text-gray-400 text-xs uppercase mb-2">
                  <Camera className="w-3 h-3 inline mr-1" /> Foto (opcional)
                </label>
                <div className="relative w-24 h-24">
                  <div className="w-full h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    {data.profile_picture_url ? (
                      <img src={data.profile_picture_url} alt="Você" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#00E5FF] rounded-lg flex items-center justify-center cursor-pointer">
                    <Camera className="w-4 h-4 text-black" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#00E5FF] rounded-2xl flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Quando você nasceu?</h2>
                <p className="text-gray-400 text-sm">Data de nascimento</p>
              </div>

              <div>
                <Input
                  type="date"
                  value={data.birth_date}
                  onChange={(e) => setData({ ...data, birth_date: e.target.value })}
                  className="bg-white/5 border-white/10 text-white rounded-xl h-12"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase mb-2 block">
                  <Globe className="w-3 h-3 inline mr-1" /> Nacionalidade
                </label>
                <Select value={data.nationality} onValueChange={(v) => setData({ ...data, nationality: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A0A0A] border-white/10">
                    <SelectItem value="🇧🇷">🇧🇷 Brasil</SelectItem>
                    <SelectItem value="🇦🇷">🇦🇷 Argentina</SelectItem>
                    <SelectItem value="🇵🇹">🇵🇹 Portugal</SelectItem>
                    <SelectItem value="🇪🇸">🇪🇸 Espanha</SelectItem>
                    <SelectItem value="🇮🇹">🇮🇹 Itália</SelectItem>
                    <SelectItem value="🇫🇷">🇫🇷 França</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#00E5FF] rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Qual sua posição?</h2>
                <p className="text-gray-400 text-sm">Onde você joga</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "goleiro", label: "🧤 Goleiro" },
                  { value: "zagueiro", label: "🛡️ Zagueiro" },
                  { value: "lateral", label: "🏃 Lateral" },
                  { value: "volante", label: "⚙️ Volante" },
                  { value: "meia", label: "🎯 Meia" },
                  { value: "atacante", label: "⚡ Atacante" }
                ].map(pos => (
                  <button
                    key={pos.value}
                    onClick={() => setData({ ...data, position: pos.value })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data.position === pos.value
                        ? 'bg-[#00E5FF] border-[#00E5FF] text-black font-bold'
                        : 'bg-white/5 border-white/10 text-white hover:border-[#00E5FF]/50'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#00E5FF] rounded-2xl flex items-center justify-center">
                  <Ruler className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Dados Físicos</h2>
                <p className="text-gray-400 text-sm">Altura e peso (opcional)</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs uppercase mb-2 block">Altura (cm)</label>
                  <Input
                    type="number"
                    value={data.height}
                    onChange={(e) => setData({ ...data, height: e.target.value })}
                    placeholder="175"
                    className="bg-white/5 border-white/10 text-white rounded-xl h-12"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase mb-2 block">Peso (kg)</label>
                  <Input
                    type="number"
                    value={data.weight}
                    onChange={(e) => setData({ ...data, weight: e.target.value })}
                    placeholder="70"
                    className="bg-white/5 border-white/10 text-white rounded-xl h-12"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase mb-2 block">Pé dominante</label>
                <Select value={data.foot} onValueChange={(v) => setData({ ...data, foot: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0A0A0A] border-white/10">
                    <SelectItem value="direito">Direito</SelectItem>
                    <SelectItem value="esquerdo">Esquerdo</SelectItem>
                    <SelectItem value="ambidestro">Ambidestro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#00E5FF] rounded-2xl flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Clube Atual</h2>
                <p className="text-gray-400 text-sm">Nome do time (opcional)</p>
              </div>

              <div>
                <Input
                  value={data.current_club_name}
                  onChange={(e) => setData({ ...data, current_club_name: e.target.value })}
                  placeholder="Ex: Santos FC"
                  className="bg-white/5 border-white/10 text-white rounded-xl h-12"
                />
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-black text-white mb-3">Tudo pronto! 🎉</h2>
              <p className="text-gray-300 mb-6">Seu perfil está configurado</p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#00E5FF]/20 p-4 bg-[#0A0A0A]">
          <div className="flex gap-3">
            {step > 0 && step < 5 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl"
              >
                Voltar
              </Button>
            )}
            <Button
              onClick={() => {
                if (step < 5) {
                  setStep(step + 1);
                } else {
                  handleFinish();
                }
              }}
              disabled={(step < 5 && !canProceed()) || saving || uploading}
              className={`flex-1 h-12 font-black rounded-xl disabled:opacity-50 ${
                step === 5
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                  : 'bg-[#00E5FF] hover:bg-[#00BFFF]'
              } text-black`}
            >
              {saving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
                  />
                  Salvando...
                </>
              ) : step === 5 ? (
                "Começar agora!"
              ) : step === 0 ? (
                "Vamos lá!"
              ) : (
                <>
                  Próximo
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
          {step > 0 && step < 5 && (
            <button
              onClick={() => setStep(step + 1)}
              className="w-full mt-3 text-gray-500 text-sm hover:text-white"
            >
              Pular
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}