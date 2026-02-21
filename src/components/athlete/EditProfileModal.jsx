import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Upload, Camera, Save, ChevronLeft, ChevronRight,
  User, Activity, Briefcase, Video, Check,
  Ruler, Calendar, Globe, Phone, Mail,
  MapPin, Award, TrendingUp, Target } from
"lucide-react";
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
      console.log("Saving profile data:", formData);
      await base44.auth.updateMe(formData);
      toast.success("Perfil atualizado com sucesso!");
      await onUpdate();
      onClose();
      setCurrentStep(1);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erro ao atualizar perfil");
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData((prev) => ({ ...prev, [field]: file_url }));
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
      setFormData((prev) => ({ ...prev, highlight_video_url: file_url }));
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
  { id: 4, title: "Vídeo Destaque", icon: Video }];


  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  const countries = [
  { code: "🇧🇷", name: "Brasil" },
  { code: "🇦🇷", name: "Argentina" },
  { code: "🇵🇹", name: "Portugal" },
  { code: "🇪🇸", name: "Espanha" },
  { code: "🇮🇹", name: "Itália" },
  { code: "🇫🇷", name: "França" },
  { code: "🇩🇪", name: "Alemanha" },
  { code: "🇬🇧", name: "Inglaterra" },
  { code: "🇳🇱", name: "Holanda" },
  { code: "🇧🇪", name: "Bélgica" },
  { code: "🇺🇾", name: "Uruguai" },
  { code: "🇨🇴", name: "Colômbia" },
  { code: "🇲🇽", name: "México" },
  { code: "🇺🇸", name: "EUA" },
  { code: "🇨🇱", name: "Chile" },
  { code: "🇵🇪", name: "Peru" },
  { code: "🇪🇨", name: "Equador" },
  { code: "🇻🇪", name: "Venezuela" },
  { code: "🇵🇾", name: "Paraguai" },
  { code: "🇧🇴", name: "Bolívia" }];


  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{
      background: "radial-gradient(circle at center, #0A2E0A 0%, #051505 50%, #000000 100%)"
    }}>
      {/* Campo de futebol pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="field-lines" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="none" stroke="#00E5FF" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#field-lines)" />
          <circle cx="50%" cy="50%" r="15%" fill="none" stroke="#00E5FF" strokeWidth="2" opacity="0.3" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#00E5FF" strokeWidth="2" opacity="0.2" />
        </svg>
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-lg md:max-w-4xl rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #0A1A2A 0%, #05111A 50%, #000810 100%)",
          border: "2px solid",
          borderImageSource: "linear-gradient(135deg, #00E5FF, #0066FF, #00E5FF)",
          borderImageSlice: 1
        }}>

        {/* Header Estilo Campo */}
        <div className="relative overflow-hidden p-6 border-b-2 border-[#00E5FF]/30">
          {/* Campo background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/20 via-transparent to-[#0066FF]/20" />
            <div className="absolute top-0 left-1/2 w-px h-full bg-[#00E5FF]/30 transform -translate-x-1/2" />
            <div className="absolute top-1/2 left-0 w-full h-px bg-[#00E5FF]/30 transform -translate-y-1/2" />
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00E5FF] to-[#0066FF] rounded-2xl flex items-center justify-center shadow-xl shadow-[#00E5FF]/50">
                <User className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-1 tracking-tight">PERFIL DO ATLETA</h3>
                <p className="text-[#00E5FF] text-xs font-bold uppercase tracking-wider">Configure suas informações</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50 rounded-xl flex items-center justify-center transition-colors">

              <X className="w-5 h-5 text-red-400" />
            </motion.button>
          </div>

          {/* Progress Steps - Campo Style */}
          <div className="relative z-10 flex items-center gap-2 mt-6">
            {steps.map((step, idx) =>
            <React.Fragment key={step.id}>
                <motion.div
                initial={false}
                animate={{ scale: currentStep === step.id ? 1.05 : 0.95 }}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-2xl transition-all ${
                currentStep === step.id ?
                'bg-gradient-to-r from-[#00E5FF]/20 to-[#0066FF]/20 border-2 border-[#00E5FF]' :
                currentStep > step.id ?
                'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500' :
                'bg-white/5 border-2 border-white/10'}`
                }>

                  {/* Corner accents */}
                  {currentStep === step.id &&
                <>
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00E5FF]" />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00E5FF]" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00E5FF]" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00E5FF]" />
                    </>
                }
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shadow-lg ${
                currentStep === step.id ?
                'bg-gradient-to-br from-[#00E5FF] to-[#0066FF] text-black shadow-[#00E5FF]/50' :
                currentStep > step.id ?
                'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-green-500/50' :
                'bg-white/10 text-gray-500'}`
                }>
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className={`text-xs font-black hidden md:inline uppercase tracking-wider ${
                currentStep === step.id ? 'text-[#00E5FF]' : 'text-gray-500'}`
                }>
                    {step.title}
                  </span>
                </motion.div>
                {idx < steps.length - 1 &&
              <div className="flex-1 h-1 bg-gradient-to-r from-white/20 to-white/5 max-w-[20px] rounded-full" />
              }
              </React.Fragment>
            )}
          </div>
        </div>

        {/* Content com padrão de campo */}
        <div className="relative p-4 md:p-6 max-h-[65vh] overflow-y-auto bg-gradient-to-b from-[#0A1A2A]/50 to-[#05111A]/50">
          {/* Campo background subtle */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-1/2 left-0 w-full h-px bg-[#00E5FF]" />
            <div className="absolute top-0 left-1/2 w-px h-full bg-[#00E5FF]" />
          </div>
          <AnimatePresence mode="wait">
            {currentStep === 1 &&
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6">

                <div className="relative flex items-center gap-3 mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#00E5FF]/10 to-[#0066FF]/10 border-2 border-[#00E5FF]/30">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute left-1/4 top-0 w-px h-full bg-[#00E5FF]/50" />
                    <div className="absolute left-1/2 top-0 w-px h-full bg-[#00E5FF]/50" />
                    <div className="absolute left-3/4 top-0 w-px h-full bg-[#00E5FF]/50" />
                  </div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-[#00E5FF] to-[#0066FF] rounded-2xl flex items-center justify-center shadow-xl shadow-[#00E5FF]/50">
                    <User className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white tracking-tight">DADOS PESSOAIS</h4>
                    <p className="text-[#00E5FF] text-xs font-bold">Informações básicas do atleta</p>
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
                      {formData.profile_picture_url ?
                    <>
                          <img src={formData.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <Camera className="w-8 h-8 text-white" />
                          </div>
                        </> :

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-500 mb-2" />
                          <p className="text-xs text-gray-500 text-center px-2">Clique aqui</p>
                        </div>
                    }
                      <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'profile_picture_url')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={uploading} />

                    </div>
                  </div>

                  {/* Imagem de Capa */}
                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block flex items-center gap-2">
                      <Upload className="w-3 h-3" /> Imagem de Capa
                    </Label>
                    <div className="relative aspect-[16/9] bg-white/5 border border-white/10 rounded-2xl overflow-hidden group cursor-pointer hover:border-[#00E5FF]/50 transition-colors">
                      {formData.cover_photo_url ?
                    <>
                          <img src={formData.cover_photo_url} alt="Capa" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                        </> :

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Upload className="w-8 h-8 text-gray-500 mb-2" />
                          <p className="text-xs text-gray-500 text-center px-2">Adicione uma capa personalizada</p>
                        </div>
                    }
                      <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'cover_photo_url')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={uploading} />

                    </div>
                  </div>
                </div>

                {/* Campos de Dados Pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <Label className="text-[#00E5FF] text-xs uppercase tracking-wider font-black flex items-center gap-2">
                      <User className="w-3 h-3" /> Nome Completo *
                    </Label>
                    <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="bg-gradient-to-r text-slate-950 mt-2 px-3 py-1 text-base font-bold rounded-xl flex w-full shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm from-[#00E5FF]/10 to-[#0066FF]/10 border-2 border-[#00E5FF]/30 h-12 hover:border-[#00E5FF] transition-colors focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/50"

                    placeholder="Digite seu nome completo" />

                  </div>

                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Data de Nascimento *
                    </Label>
                    <Input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11" />

                  </div>

                  <div>
                    <Label className="text-[#00E5FF] text-xs uppercase tracking-wider font-black flex items-center gap-2">
                      <Globe className="w-3 h-3" /> Nacionalidade
                    </Label>
                    <Select value={formData.nationality} onValueChange={(v) => setFormData({ ...formData, nationality: v })}>
                      <SelectTrigger className="mt-2 bg-gradient-to-r from-[#00E5FF]/10 to-[#0066FF]/10 border-2 border-[#00E5FF]/30 text-white rounded-xl h-11 text-2xl hover:border-[#00E5FF] transition-colors">
                        <SelectValue placeholder="Selecione sua bandeira" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0A1A2A] border-2 border-[#00E5FF]/50 max-h-[300px]">
                        {countries.map((country) =>
                      <SelectItem
                        key={country.code}
                        value={country.code}
                        className="text-white hover:bg-[#00E5FF]/20 cursor-pointer py-3 text-lg">

                            <span className="text-2xl mr-3">{country.code}</span>
                            <span className="text-sm">{country.name}</span>
                          </SelectItem>
                      )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Telefone
                    </Label>
                    <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11" />

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
                    className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11" />

                  </div>

                  <div>
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Cidade
                    </Label>
                    <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Sua cidade"
                    className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11" />

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
                    className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11" />

                  </div>
                </div>
              </motion.div>
            }

            {currentStep === 2 &&
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6">

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
                    className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11" />

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
                    className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11" />

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
            }

            {currentStep === 3 &&
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6">

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
                    className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11" />

                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <Label className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" /> Clube Atual
                    </Label>
                    <Input
                    value={formData.current_club_name}
                    onChange={(e) => setFormData({ ...formData, current_club_name: e.target.value })}
                    placeholder="Nome do clube"
                    className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11" />

                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <Label className="text-gray-400 text-xs uppercase tracking-wider">URL do Escudo do Clube</Label>
                    <Input
                    value={formData.current_club_crest_url || ""}
                    onChange={(e) => setFormData({ ...formData, current_club_crest_url: e.target.value })}
                    placeholder="https://..."
                    className="mt-2 bg-white/5 border-white/10 text-white rounded-xl h-11" />

                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <Label className="text-gray-400 text-xs uppercase tracking-wider">Destaques da Carreira</Label>
                    <Textarea
                    value={formData.career_highlights}
                    onChange={(e) => setFormData({ ...formData, career_highlights: e.target.value })}
                    placeholder="Ex: Artilheiro do campeonato sub-17, convocação para seleção estadual..."
                    className="mt-2 bg-white/5 border-white/10 text-white rounded-xl min-h-[80px] md:min-h-[100px]" />

                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <Label className="text-gray-400 text-xs uppercase tracking-wider">Principais Conquistas</Label>
                    <Textarea
                    value={formData.achievements}
                    onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                    placeholder="Ex: Campeão municipal 2023, vice-campeão estadual 2024..."
                    className="mt-2 bg-white/5 border-white/10 text-white rounded-xl min-h-[80px] md:min-h-[100px]" />

                  </div>
                </div>
              </motion.div>
            }

            {currentStep === 4 &&
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6">

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
                  {formData.highlight_video_url ?
                <>
                      <video
                    src={formData.highlight_video_url}
                    controls
                    className="w-full h-full object-cover" />

                      <div className="absolute top-4 right-4">
                        <Button
                      size="sm"
                      className="bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/20">

                          <Upload className="w-4 h-4 mr-2" />
                          Trocar vídeo
                        </Button>
                      </div>
                    </> :

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
                }
                  <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading} />

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
            }
          </AnimatePresence>
        </div>

        {/* Footer com Navegação - Estilo linha de campo */}
        <div className="relative p-4 md:p-6 border-t-2 border-[#00E5FF]/30 bg-gradient-to-r from-[#0A1A2A] to-[#05111A]">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent" />
          <div className="flex items-center justify-between gap-2 md:gap-3">
            <Button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 bg-gradient-to-r from-[#00E5FF]/20 to-[#0066FF]/20 hover:from-[#00E5FF]/30 hover:to-[#0066FF]/30 text-white border-2 border-[#00E5FF]/50 disabled:opacity-30 h-11 font-black uppercase tracking-wider px-4 rounded-xl shadow-lg hover:shadow-[#00E5FF]/50 transition-all">

              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </Button>

            <div className="text-xs md:text-sm text-gray-400 font-medium">
              {currentStep}/{steps.length}
            </div>

            {currentStep < steps.length ?
            <Button
              onClick={nextStep}
              className="flex items-center gap-2 bg-gradient-to-r from-[#00E5FF] to-[#0066FF] hover:from-[#00BFFF] hover:to-[#0088FF] text-black font-black h-11 uppercase tracking-wider px-5 rounded-xl shadow-xl shadow-[#00E5FF]/50 hover:shadow-[#00E5FF]/70 transition-all">

                <span className="hidden sm:inline">Próximo</span>
                <span className="sm:hidden">Avançar</span>
                <ChevronRight className="w-4 h-4" />
              </Button> :

            <Button
              onClick={handleSave}
              disabled={uploading}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black shadow-2xl h-11 uppercase tracking-wider px-5 rounded-xl shadow-green-500/50 hover:shadow-green-500/70 transition-all disabled:opacity-50">

                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Salvar Perfil</span>
                <span className="sm:hidden">Salvar</span>
              </Button>
            }
          </div>
        </div>
      </motion.div>
    </div>);

}