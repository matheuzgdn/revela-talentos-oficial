import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, Star, Trophy, Target, Zap,
  User, Calendar, Globe, MapPin, Phone, Mail,
  Ruler, Activity, Award, TrendingUp, Video,
  Camera, Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const countries = [
  { code: "🇧🇷", name: "Brasil" }, { code: "🇦🇷", name: "Argentina" },
  { code: "🇵🇹", name: "Portugal" }, { code: "🇪🇸", name: "Espanha" },
  { code: "🇮🇹", name: "Itália" }, { code: "🇫🇷", name: "França" },
  { code: "🇩🇪", name: "Alemanha" }, { code: "🇬🇧", name: "Inglaterra" },
  { code: "🇳🇱", name: "Holanda" }, { code: "🇧🇪", name: "Bélgica" },
  { code: "🇺🇾", name: "Uruguai" }, { code: "🇨🇴", name: "Colômbia" },
  { code: "🇲🇽", name: "México" }, { code: "🇺🇸", name: "EUA" }
];

export default function WelcomeOnboarding({ isOpen, onClose, user, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    birth_date: user?.birth_date || "",
    nationality: user?.nationality || "",
    phone: user?.phone || "",
    email: user?.email || "",
    city: user?.city || "",
    state: user?.state || "",
    height: user?.height || "",
    weight: user?.weight || "",
    foot: user?.foot || "direito",
    position: user?.position || "",
    jersey_number: user?.jersey_number || "",
    current_club_name: user?.current_club_name || "",
    profile_picture_url: user?.profile_picture_url || ""
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, profile_picture_url: file_url }));
      toast.success("Foto enviada!");
    } catch (error) {
      toast.error("Erro ao enviar foto");
    }
    setUploading(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    try {
      await base44.auth.updateMe(formData);
      toast.success("Perfil configurado com sucesso!");
      onComplete?.();
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar perfil");
    }
  };

  const steps = [
    {
      id: "welcome",
      title: "Bem-vindo ao EC10 Talentos! ⚽",
      subtitle: "Vamos configurar seu perfil de atleta",
      icon: Star,
      gradient: "from-yellow-500 to-orange-500",
      content: (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#00E5FF] to-[#0066FF] rounded-[30px] flex items-center justify-center shadow-2xl shadow-[#00E5FF]/50"
          >
            <Trophy className="w-16 h-16 text-white" />
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-3">Pronto para brilhar?</h2>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">
            Complete seu perfil em poucos passos e comece sua jornada rumo ao sucesso no futebol! 🚀
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <Target className="w-6 h-6 text-[#00E5FF] mx-auto mb-2" />
              <p className="text-xs text-gray-400">Defina metas</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Evolua</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Destaque-se</p>
            </div>
          </div>
        </motion.div>
      )
    },
    {
      id: "photo",
      title: "Adicione sua foto",
      subtitle: "Mostre seu rosto de campeão!",
      icon: Camera,
      gradient: "from-purple-500 to-pink-500",
      field: "profile_picture_url",
      content: (
        <div className="space-y-6">
          <div className="relative w-40 h-40 mx-auto">
            <div className="w-full h-full rounded-[30px] overflow-hidden border-4 border-[#00E5FF] shadow-2xl shadow-[#00E5FF]/50">
              {formData.profile_picture_url ? (
                <img src={formData.profile_picture_url} alt="Você" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#00E5FF]/20 to-[#0066FF]/20 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-gray-500" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-14 h-14 bg-gradient-to-br from-[#00E5FF] to-[#0066FF] rounded-2xl flex items-center justify-center cursor-pointer shadow-xl hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
          <p className="text-center text-gray-400 text-sm">
            {formData.profile_picture_url ? "Foto carregada! Você pode mudar depois." : "Toque no ícone para adicionar"}
          </p>
        </div>
      ),
      canSkip: true
    },
    {
      id: "name",
      title: "Como você se chama?",
      subtitle: "Seu nome completo",
      icon: User,
      gradient: "from-blue-500 to-cyan-500",
      field: "full_name",
      required: true,
      content: (
        <Input
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          placeholder="Ex: Neymar da Silva Santos Júnior"
          className="bg-white/5 border-2 border-[#00E5FF]/30 text-white rounded-2xl h-14 text-lg text-center font-bold focus:border-[#00E5FF]"
          autoFocus
        />
      )
    },
    {
      id: "birth_date",
      title: "Quando você nasceu?",
      subtitle: "Data de nascimento",
      icon: Calendar,
      gradient: "from-green-500 to-emerald-500",
      field: "birth_date",
      required: true,
      content: (
        <Input
          type="date"
          value={formData.birth_date}
          onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
          className="bg-white/5 border-2 border-[#00E5FF]/30 text-white rounded-2xl h-14 text-lg text-center font-bold focus:border-[#00E5FF]"
          autoFocus
        />
      )
    },
    {
      id: "nationality",
      title: "Qual sua nacionalidade?",
      subtitle: "Escolha sua bandeira",
      icon: Globe,
      gradient: "from-indigo-500 to-purple-500",
      field: "nationality",
      content: (
        <Select value={formData.nationality} onValueChange={(v) => setFormData({ ...formData, nationality: v })}>
          <SelectTrigger className="bg-white/5 border-2 border-[#00E5FF]/30 text-white rounded-2xl h-14 text-3xl text-center hover:border-[#00E5FF]">
            <SelectValue placeholder="Selecione sua bandeira" />
          </SelectTrigger>
          <SelectContent className="bg-[#0A1A2A] border-2 border-[#00E5FF]/50">
            {countries.map(country => (
              <SelectItem key={country.code} value={country.code} className="text-white text-lg py-3 cursor-pointer hover:bg-[#00E5FF]/20">
                <span className="text-3xl mr-3">{country.code}</span>
                <span>{country.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
    {
      id: "position",
      title: "Qual sua posição?",
      subtitle: "Onde você joga melhor?",
      icon: Target,
      gradient: "from-red-500 to-orange-500",
      field: "position",
      required: true,
      content: (
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "goleiro", label: "Goleiro", emoji: "🧤" },
            { value: "zagueiro", label: "Zagueiro", emoji: "🛡️" },
            { value: "lateral", label: "Lateral", emoji: "🏃" },
            { value: "volante", label: "Volante", emoji: "⚙️" },
            { value: "meia", label: "Meia", emoji: "🎯" },
            { value: "atacante", label: "Atacante", emoji: "⚡" }
          ].map(pos => (
            <motion.button
              key={pos.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFormData({ ...formData, position: pos.value })}
              className={`p-4 rounded-2xl border-2 transition-all ${
                formData.position === pos.value
                  ? 'bg-gradient-to-br from-[#00E5FF] to-[#0066FF] border-[#00E5FF] shadow-xl shadow-[#00E5FF]/50'
                  : 'bg-white/5 border-white/10 hover:border-[#00E5FF]/50'
              }`}
            >
              <div className="text-4xl mb-2">{pos.emoji}</div>
              <div className={`text-sm font-bold ${formData.position === pos.value ? 'text-black' : 'text-white'}`}>
                {pos.label}
              </div>
            </motion.button>
          ))}
        </div>
      )
    },
    {
      id: "height",
      title: "Qual sua altura?",
      subtitle: "Em centímetros",
      icon: Ruler,
      gradient: "from-cyan-500 to-blue-500",
      field: "height",
      content: (
        <div className="space-y-4">
          <Input
            type="number"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            placeholder="175"
            className="bg-white/5 border-2 border-[#00E5FF]/30 text-white rounded-2xl h-14 text-2xl text-center font-bold focus:border-[#00E5FF]"
            autoFocus
          />
          <p className="text-center text-gray-400 text-sm">cm</p>
        </div>
      )
    },
    {
      id: "weight",
      title: "Qual seu peso?",
      subtitle: "Em quilogramas",
      icon: Activity,
      gradient: "from-green-500 to-emerald-500",
      field: "weight",
      content: (
        <div className="space-y-4">
          <Input
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            placeholder="70"
            className="bg-white/5 border-2 border-[#00E5FF]/30 text-white rounded-2xl h-14 text-2xl text-center font-bold focus:border-[#00E5FF]"
            autoFocus
          />
          <p className="text-center text-gray-400 text-sm">kg</p>
        </div>
      )
    },
    {
      id: "foot",
      title: "Qual seu pé dominante?",
      subtitle: "Com qual pé você joga melhor?",
      icon: Award,
      gradient: "from-purple-500 to-pink-500",
      field: "foot",
      content: (
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "direito", label: "Direito", emoji: "👟" },
            { value: "esquerdo", label: "Esquerdo", emoji: "👟" },
            { value: "ambidestro", label: "Ambos", emoji: "👟👟" }
          ].map(foot => (
            <motion.button
              key={foot.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFormData({ ...formData, foot: foot.value })}
              className={`p-6 rounded-2xl border-2 transition-all ${
                formData.foot === foot.value
                  ? 'bg-gradient-to-br from-[#00E5FF] to-[#0066FF] border-[#00E5FF] shadow-xl shadow-[#00E5FF]/50'
                  : 'bg-white/5 border-white/10 hover:border-[#00E5FF]/50'
              }`}
            >
              <div className="text-4xl mb-2">{foot.emoji}</div>
              <div className={`text-sm font-bold ${formData.foot === foot.value ? 'text-black' : 'text-white'}`}>
                {foot.label}
              </div>
            </motion.button>
          ))}
        </div>
      )
    },
    {
      id: "club",
      title: "Qual seu clube atual?",
      subtitle: "Nome do time (opcional)",
      icon: TrendingUp,
      gradient: "from-yellow-500 to-orange-500",
      field: "current_club_name",
      canSkip: true,
      content: (
        <Input
          value={formData.current_club_name}
          onChange={(e) => setFormData({ ...formData, current_club_name: e.target.value })}
          placeholder="Ex: Santos FC"
          className="bg-white/5 border-2 border-[#00E5FF]/30 text-white rounded-2xl h-14 text-lg text-center font-bold focus:border-[#00E5FF]"
          autoFocus
        />
      )
    },
    {
      id: "complete",
      title: "Tudo pronto! 🎉",
      subtitle: "Seu perfil está configurado",
      icon: Star,
      gradient: "from-green-500 to-emerald-500",
      content: (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50"
          >
            <Trophy className="w-16 h-16 text-white" />
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-3">Bem-vindo à família EC10!</h2>
          <p className="text-gray-300 mb-6">
            Agora você pode acessar todas as funcionalidades da plataforma
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-sm mx-auto">
            <p className="text-sm text-gray-400 mb-2">Próximos passos:</p>
            <ul className="text-sm text-white space-y-2 text-left">
              <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-[#00E5FF]" /> Faça seu primeiro check-in diário</li>
              <li className="flex items-center gap-2"><Video className="w-4 h-4 text-[#00E5FF]" /> Envie vídeos dos seus jogos</li>
              <li className="flex items-center gap-2"><Trophy className="w-4 h-4 text-[#00E5FF]" /> Complete sua assessoria semanal</li>
            </ul>
          </div>
        </motion.div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const canProceed = currentStepData.required ? formData[currentStepData.field] : true;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{
      background: "radial-gradient(circle at center, #0A2E0A 0%, #051505 50%, #000000 100%)"
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-gradient-to-b from-[#0A1A2A] to-[#05111A] rounded-3xl border-2 border-[#00E5FF]/30 shadow-2xl overflow-hidden"
      >
        {/* Progress */}
        <div className="h-1.5 bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-[#00E5FF] to-[#0066FF]"
          />
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${currentStepData.gradient} rounded-2xl flex items-center justify-center shadow-xl`}
                >
                  <currentStepData.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-black text-white mb-2">{currentStepData.title}</h2>
                <p className="text-gray-400 text-sm">{currentStepData.subtitle}</p>
              </div>

              {/* Content */}
              <div className="mb-8">
                {currentStepData.content}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {currentStep > 0 && currentStep < steps.length - 1 && (
                  <Button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    variant="outline"
                    className="flex-1 h-12 bg-white/5 border-2 border-white/10 text-white hover:bg-white/10 rounded-xl"
                  >
                    Voltar
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={!canProceed || uploading}
                  className={`flex-1 h-12 font-black rounded-xl shadow-xl transition-all ${
                    currentStep === steps.length - 1
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-500/50'
                      : 'bg-gradient-to-r from-[#00E5FF] to-[#0066FF] hover:from-[#00BFFF] hover:to-[#0088FF] shadow-[#00E5FF]/50'
                  } disabled:opacity-50`}
                >
                  {currentStep === 0 ? "Vamos lá!" : currentStep === steps.length - 1 ? "Começar agora!" : "Próximo"}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {currentStepData.canSkip && currentStep > 0 && currentStep < steps.length - 1 && (
                <button
                  onClick={handleNext}
                  className="w-full mt-3 text-gray-500 text-sm hover:text-white transition-colors"
                >
                  Pular por enquanto
                </button>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Step indicator */}
          <div className="flex justify-center gap-1.5 mt-6">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep ? 'w-8 bg-[#00E5FF]' : idx < currentStep ? 'w-4 bg-green-500' : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}