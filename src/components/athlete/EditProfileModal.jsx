import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Upload, Camera, Save, ChevronLeft, ChevronRight,
  User, Activity, Briefcase, Video, Check,
  Ruler, Calendar, Globe, Phone, Mail,
  MapPin, Award, TrendingUp, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function EditProfileModal({ isOpen, onClose, user, onUpdate }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Dados Pessoais
    full_name: user?.full_name || "",
    profile_picture_url: user?.profile_picture_url || "",
    cover_photo_url: user?.cover_photo_url || "",
    birth_date: user?.birth_date || "",
    nationality: user?.nationality || "",
    phone: user?.phone || "",
    email: user?.email || "",
    city: user?.city || "",
    state: user?.state || "",
    
    // Dados Biométricos
    height: user?.height || "",
    weight: user?.weight || "",
    foot: user?.foot || "direito",
    
    // Dados Profissionais
    position: user?.position || "",
    jersey_number: user?.jersey_number || "",
    current_club_name: user?.current_club_name || "",
    current_club_crest_url: user?.current_club_crest_url || "",
    previous_clubs: user?.previous_clubs || [],
    career_highlights: user?.career_highlights || "",
    achievements: user?.achievements || "",
    
    // Vídeo
    highlight_video_url: user?.highlight_video_url || ""
  });
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        profile_picture_url: user.profile_picture_url || "",
        cover_photo_url: user.cover_photo_url || "",
        birth_date: user.birth_date || "",
        nationality: user.nationality || "",
        phone: user.phone || "",
        email: user.email || "",
        city: user.city || "",
        state: user.state || "",
        height: user.height || "",
        weight: user.weight || "",
        foot: user.foot || "direito",
        position: user.position || "",
        jersey_number: user.jersey_number || "",
        current_club_name: user.current_club_name || "",
        current_club_crest_url: user.current_club_crest_url || "",
        previous_clubs: user.previous_clubs || [],
        career_highlights: user.career_highlights || "",
        achievements: user.achievements || "",
        highlight_video_url: user.highlight_video_url || ""
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await base44.auth.updateMe(formData);
      toast.success("Perfil atualizado com sucesso!");
      onUpdate();
      onClose();
      setCurrentStep(1);
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, [field]: file_url }));
      toast.success("Upload concluído!");
    } catch (error) {
      toast.error("Erro ao fazer upload");
    }
    setUploading(false);
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, highlight_video_url: file_url }));
      toast.success("Vídeo enviado com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar vídeo");
    }
    setUploading(false);
  };

  const steps = [
    { id: 1, title: "Dados Pessoais", icon: User },
    { id: 2, title: "Dados Biométricos", icon: Activity },
    { id: 3, title: "Carreira Profissional", icon: Briefcase },
    { id: 4, title: "Vídeo Destaque", icon: Video }
  ];

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-lg md:max-w-4xl bg-[#0A0A0A] rounded-3xl md:rounded-3xl rounded-t-3xl border border-white/10 overflow-hidden shadow-2xl"
      >
        {/* Header Cinematográfico */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#00E5FF]/10 via-[#0066FF]/10 to-transparent p-6 border-b border-white/10">
          <div className="absolute inset-0 opacity-5">
            <img 
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=200&fit=crop" 
              alt="Campo"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-white mb-1">Configurar Perfil</h3>
              <p className="text-gray-400 text-sm">Preencha suas informações de atleta</p>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="relative z-10 flex items-center gap-2 mt-6">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <motion.div
                  initial={false}
                  animate={{ 
                    scale: currentStep === step.id ? 1 : 0.9,
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                    currentStep === step.id 
                      ? 'bg-white/10 border border-white/20' 
                      : currentStep > step.id
                      ? 'bg-green-500/20 border border-green-500/30'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                    currentStep === step.id 
                      ? 'bg-[#00E5FF] text-black' 
                      : currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {currentStep > step.id ? <Check className="w-3 h-3" /> : step.id}
                  </div>
                  <span className={`text-xs font-bold hidden md:inline ${
                    currentStep === step.id ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </motion.div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-white/10 max-w-[20px]" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 max-h-[65vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#00E5FF]/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-[#00E5FF]" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-black text-white">Dados Pessoais</h4>
                    <p className="text-gray-400 text-xs md:text-sm">Informações básicas do atleta</p>
                  </div>
                </div>

                {/* Uploads de Imagem */}
                <div className="space-y-4">
                  {/* Foto de Perfil */}
                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block flex items-center gap-2">
                      <Camera className="w-3 h-3" /> Foto de Perfil
                    </Label>
                    <div className="relative w-32 h-32 mx-auto bg-white/5 border border-white/10 rounded-2xl overflow-hidden group cursor-pointer hover:border-[#00E5FF]/50 transition-colors">
                      {formData.profile_picture_url ? (
                        <>
                          <img src={formData.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <Camera className="w-8 h-8 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-500 mb-2" />
                          <p className="text-xs text-gray-500 text-center px-2">Clique aqui</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'profile_picture_url')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                    </div>
                  </div>

                  {/* Imagem de Capa */}
                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block flex items-center gap-2">
                      <Upload className="w-3 h-3" /> Imagem de Capa
                    </Label>
                    <div className="relative aspect-[16/9] bg-white/5 border border-white/10 rounded-2xl overflow-hidden group cursor-pointer hover:border-[#00E5FF]/50 transition-colors">
                      {formData.cover_photo_url ? (
                        <>
                          <img src={formData.cover_photo_url} alt="Capa" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Upload className="w-8 h-8 text-gray-500 mb-2" />
                          <p className="text-xs text-gray-500 text-center px-2">Adicione uma capa personalizada</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'cover_photo_url')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                    </div>
                  </div>
                </div>

                {/* Campos de Dados Pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <User className="w-3 h-3" /> Nome Completo *
                    </Label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11"
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Data de Nascimento *
                    </Label>
                    <Input
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                      className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-3 h-3" /> Nacionalidade
                    </Label>
                    <Input
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      placeholder="Ex: 🇧🇷"
                      className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Telefone
                    </Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(00) 00000-0000"
                      className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Mail className="w-3 h-3" /> E-mail
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu@email.com"
                      className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Cidade
                    </Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Sua cidade"
                      className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Estado
                    </Label>
                    <Input
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="UF"
                      maxLength={2}
                      className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <Activity className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-black text-white">Dados Biométricos</h4>
                    <p className="text-gray-400 text-xs md:text-sm">Medidas físicas do atleta</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Ruler className="w-3 h-3" /> Altura (cm)
                    </Label>
                    <Input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      placeholder="175"
                      className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Ruler className="w-3 h-3" /> Peso (kg)
                    </Label>
                    <Input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="70"
                      className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Target className="w-3 h-3" /> Pé Dominante
                    </Label>
                    <Select value={formData.foot} onValueChange={(v) => setFormData({ ...formData, foot: v })}>
                      <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0A0A0A] border-white/10">
                        <SelectItem value="direito">Direito</SelectItem>
                        <SelectItem value="esquerdo">Esquerdo</SelectItem>
                        <SelectItem value="ambidestro">Ambidestro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 mt-4 md:mt-6">
                  <div className="flex items-start gap-2 md:gap-3 text-sm text-gray-400">
                    <Activity className="w-4 h-4 md:w-5 md:h-5 text-[#00E5FF] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-white mb-1 text-xs md:text-sm">Por que esses dados são importantes?</p>
                      <p className="text-[10px] md:text-xs leading-relaxed">
                        Clubes e olheiros utilizam essas informações para avaliar o perfil físico do atleta e 
                        compatibilidade com suas necessidades táticas.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-black text-white">Carreira Profissional</h4>
                    <p className="text-gray-400 text-xs md:text-sm">Histórico e conquistas</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Target className="w-3 h-3" /> Posição Principal *
                    </Label>
                    <Select value={formData.position} onValueChange={(v) => setFormData({ ...formData, position: v })}>
                      <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0A0A0A] border-white/10">
                        <SelectItem value="goleiro">🧤 Goleiro</SelectItem>
                        <SelectItem value="zagueiro">🛡️ Zagueiro</SelectItem>
                        <SelectItem value="lateral">🏃 Lateral</SelectItem>
                        <SelectItem value="volante">⚙️ Volante</SelectItem>
                        <SelectItem value="meia">🎯 Meia</SelectItem>
                        <SelectItem value="atacante">⚡ Atacante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Award className="w-3 h-3" /> Número da Camisa
                    </Label>
                    <Input
                      type="number"
                      value={formData.jersey_number}
                      onChange={(e) => setFormData({ ...formData, jersey_number: parseInt(e.target.value) })}
                      placeholder="10"
                      className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" /> Clube Atual
                    </Label>
                    <Input
                      value={formData.current_club_name}
                      onChange={(e) => setFormData({ ...formData, current_club_name: e.target.value })}
                      placeholder="Nome do clube"
                      className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <Label className="text-gray-400 text-xs uppercase tracking-wider">URL do Escudo do Clube</Label>
                    <Input
                      value={formData.current_club_crest_url || ""}
                      onChange={(e) => setFormData({ ...formData, current_club_crest_url: e.target.value })}
                      placeholder="https://..."
                      className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <Label className="text-gray-400 text-xs uppercase tracking-wider">Destaques da Carreira</Label>
                    <Textarea
                      value={formData.career_highlights}
                      onChange={(e) => setFormData({ ...formData, career_highlights: e.target.value })}
                      placeholder="Ex: Artilheiro do campeonato sub-17, convocação para seleção estadual..."
                      className="mt-2 bg-white/5 border-white/10 text-white rounded-xl min-h-[80px] md:min-h-[100px]"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <Label className="text-gray-400 text-xs uppercase tracking-wider">Principais Conquistas</Label>
                    <Textarea
                      value={formData.achievements}
                      onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                      placeholder="Ex: Campeão municipal 2023, vice-campeão estadual 2024..."
                      className="mt-2 bg-white/5 border-white/10 text-white rounded-xl min-h-[80px] md:min-h-[100px]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <Video className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-black text-white">Vídeo Destaque</h4>
                    <p className="text-gray-400 text-xs md:text-sm">Mostre suas melhores jogadas</p>
                  </div>
                </div>

                <div className="relative aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-2xl overflow-hidden group cursor-pointer hover:border-[#00E5FF]/50 transition-colors">
                  {formData.highlight_video_url ? (
                    <>
                      <video 
                        src={formData.highlight_video_url} 
                        controls 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Button
                          size="sm"
                          className="bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/20"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Trocar vídeo
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4">
                        <Video className="w-10 h-10 text-red-500" />
                      </div>
                      <p className="text-white font-bold mb-1">Adicione seu vídeo destaque</p>
                      <p className="text-gray-400 text-sm mb-4">MP4, MOV ou AVI • Máx 100MB</p>
                      <Button className="bg-[#00E5FF] hover:bg-[#00BFFF] text-black">
                        <Upload className="w-4 h-4 mr-2" />
                        Selecionar vídeo
                      </Button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                </div>

                <div className="bg-gradient-to-br from-[#00E5FF]/10 to-[#0066FF]/10 border border-[#00E5FF]/20 rounded-2xl p-4 md:p-6">
                  <div className="flex items-start gap-2 md:gap-3">
                    <Video className="w-4 h-4 md:w-5 md:h-5 text-[#00E5FF] mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-bold text-white mb-2 text-xs md:text-sm">Dicas para um bom vídeo:</p>
                      <ul className="space-y-1 text-gray-300 text-[10px] md:text-xs">
                        <li>• Mostre suas melhores jogadas e habilidades</li>
                        <li>• Vídeo com boa qualidade e iluminação</li>
                        <li>• Duração ideal: 1-3 minutos</li>
                        <li>• Inclua diferentes situações de jogo</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer com Navegação */}
        <div className="p-4 md:p-6 border-t border-white/10 bg-white/5">
          <div className="flex items-center justify-between gap-2 md:gap-3">
            <Button 
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-1 md:gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 disabled:opacity-50 h-10 md:h-11 text-xs md:text-sm px-3 md:px-4"
            >
              <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </Button>

            <div className="text-xs md:text-sm text-gray-400 font-medium">
              {currentStep}/{steps.length}
            </div>

            {currentStep < steps.length ? (
              <Button 
                onClick={nextStep}
                className="flex items-center gap-1 md:gap-2 bg-[#00E5FF] hover:bg-[#00BFFF] text-black font-bold h-10 md:h-11 text-xs md:text-sm px-3 md:px-4"
              >
                <span className="hidden sm:inline">Próximo</span>
                <span className="sm:hidden">Avançar</span>
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSave}
                disabled={uploading}
                className="flex items-center gap-1 md:gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold shadow-lg h-10 md:h-11 text-xs md:text-sm px-3 md:px-4"
              >
                <Save className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Salvar Perfil</span>
                <span className="sm:hidden">Salvar</span>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}