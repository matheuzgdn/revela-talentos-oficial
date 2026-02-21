import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, User, Calendar, Globe, MapPin, Phone, Ruler, Target, TrendingUp, Video, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
  { code: "🇨🇴", name: "Colômbia" }
];

export default function EditProfileModal({ isOpen, onClose, user, onUpdate }) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    profile_picture_url: "",
    cover_photo_url: "",
    birth_date: "",
    nationality: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    height: "",
    weight: "",
    foot: "direito",
    position: "",
    jersey_number: "",
    current_club_name: "",
    current_club_crest_url: "",
    career_highlights: "",
    achievements: "",
    highlight_video_url: ""
  });

  useEffect(() => {
    if (user && isOpen) {
      console.log("Loading user data into form:", user);
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
        career_highlights: user.career_highlights || "",
        achievements: user.achievements || "",
        highlight_video_url: user.highlight_video_url || ""
      });
    }
  }, [user, isOpen]);

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, [field]: file_url }));
      toast.success("✅ Imagem enviada!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("❌ Erro ao enviar imagem");
    }
    setUploading(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log("Salvando dados do perfil:", formData);

      // Validações
      if (!formData.full_name?.trim()) {
        toast.error("⚠️ Nome completo é obrigatório");
        setSaving(false);
        return;
      }

      if (!formData.birth_date) {
        toast.error("⚠️ Data de nascimento é obrigatória");
        setSaving(false);
        return;
      }

      if (!formData.position) {
        toast.error("⚠️ Posição é obrigatória");
        setSaving(false);
        return;
      }

      // Preparar dados limpos (remover strings vazias)
      const cleanData = {};
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (value !== "" && value !== null && value !== undefined) {
          // Converter números
          if (key === "height" || key === "weight" || key === "jersey_number") {
            cleanData[key] = value ? Number(value) : null;
          } else {
            cleanData[key] = value;
          }
        }
      });

      console.log("Dados limpos para salvar:", cleanData);

      // Salvar no banco
      await base44.auth.updateMe(cleanData);
      
      console.log("✅ Perfil atualizado com sucesso!");
      toast.success("✅ Perfil atualizado com sucesso!", {
        duration: 3000,
        position: "top-center"
      });

      // Aguardar um pouco antes de fechar
      setTimeout(async () => {
        await onUpdate();
        onClose();
      }, 800);

    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast.error("❌ Erro ao salvar: " + (error.message || "Tente novamente"));
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-end md:items-center justify-center">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-2xl bg-[#0A0A0A] border-t-2 md:border-2 border-[#00E5FF]/30 md:rounded-3xl overflow-hidden max-h-[95vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A1A2A] to-[#05111A] border-b border-[#00E5FF]/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF] to-[#0066FF] rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-white font-black text-lg">Editar Perfil</h3>
              <p className="text-[#00E5FF] text-xs">Configure suas informações</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Foto de Perfil */}
          <div>
            <Label className="text-gray-400 text-xs uppercase mb-2 flex items-center gap-2">
              <Camera className="w-3 h-3" /> Foto de Perfil
            </Label>
            <div className="relative w-24 h-24 mx-auto">
              <div className="w-full h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                {formData.profile_picture_url ? (
                  <img src={formData.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-500" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#00E5FF] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#00BFFF] transition-colors">
                <Camera className="w-4 h-4 text-black" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'profile_picture_url')}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Nome Completo */}
          <div>
            <Label className="text-white text-xs uppercase mb-2 flex items-center gap-2">
              <User className="w-3 h-3" /> Nome Completo *
            </Label>
            <Input
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Seu nome completo"
              className="bg-white/5 border-white/10 text-white rounded-xl h-12 text-base"
            />
          </div>

          {/* Data de Nascimento e Nacionalidade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-gray-400 text-xs uppercase mb-2 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Nascimento *
              </Label>
              <Input
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                className="bg-white/5 border-white/10 text-white rounded-xl h-12"
              />
            </div>
            <div>
              <Label className="text-gray-400 text-xs uppercase mb-2 flex items-center gap-2">
                <Globe className="w-3 h-3" /> País
              </Label>
              <Select value={formData.nationality} onValueChange={(v) => setFormData({ ...formData, nationality: v })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-12">
                  <SelectValue placeholder="🌍" />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0A] border-white/10">
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code} className="text-white">
                      <span className="text-xl mr-2">{country.code}</span> {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Telefone e Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-gray-400 text-xs uppercase mb-2 flex items-center gap-2">
                <Phone className="w-3 h-3" /> Telefone
              </Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="bg-white/5 border-white/10 text-white rounded-xl h-12"
              />
            </div>
            <div>
              <Label className="text-gray-400 text-xs uppercase mb-2">E-mail</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                className="bg-white/5 border-white/10 text-white rounded-xl h-12"
              />
            </div>
          </div>

          {/* Cidade e Estado */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-gray-400 text-xs uppercase mb-2 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Cidade
              </Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Sua cidade"
                className="bg-white/5 border-white/10 text-white rounded-xl h-12"
              />
            </div>
            <div>
              <Label className="text-gray-400 text-xs uppercase mb-2">Estado</Label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="UF"
                maxLength={2}
                className="bg-white/5 border-white/10 text-white rounded-xl h-12"
              />
            </div>
          </div>

          {/* Altura, Peso e Pé */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-gray-400 text-xs uppercase mb-2 flex items-center gap-2">
                <Ruler className="w-3 h-3" /> Altura
              </Label>
              <Input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                placeholder="175"
                className="bg-white/5 border-white/10 text-white rounded-xl h-12"
              />
            </div>
            <div>
              <Label className="text-gray-400 text-xs uppercase mb-2">Peso</Label>
              <Input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="70"
                className="bg-white/5 border-white/10 text-white rounded-xl h-12"
              />
            </div>
            <div>
              <Label className="text-gray-400 text-xs uppercase mb-2">Pé</Label>
              <Select value={formData.foot} onValueChange={(v) => setFormData({ ...formData, foot: v })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0A] border-white/10">
                  <SelectItem value="direito" className="text-white">Direito</SelectItem>
                  <SelectItem value="esquerdo" className="text-white">Esquerdo</SelectItem>
                  <SelectItem value="ambidestro" className="text-white">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Posição e Número */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-white text-xs uppercase mb-2 flex items-center gap-2">
                <Target className="w-3 h-3" /> Posição *
              </Label>
              <Select value={formData.position} onValueChange={(v) => setFormData({ ...formData, position: v })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-12">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0A] border-white/10">
                  <SelectItem value="goleiro" className="text-white">🧤 Goleiro</SelectItem>
                  <SelectItem value="zagueiro" className="text-white">🛡️ Zagueiro</SelectItem>
                  <SelectItem value="lateral" className="text-white">🏃 Lateral</SelectItem>
                  <SelectItem value="volante" className="text-white">⚙️ Volante</SelectItem>
                  <SelectItem value="meia" className="text-white">🎯 Meia</SelectItem>
                  <SelectItem value="atacante" className="text-white">⚡ Atacante</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-400 text-xs uppercase mb-2">Camisa</Label>
              <Input
                type="number"
                value={formData.jersey_number}
                onChange={(e) => setFormData({ ...formData, jersey_number: e.target.value })}
                placeholder="10"
                className="bg-white/5 border-white/10 text-white rounded-xl h-12"
              />
            </div>
          </div>

          {/* Clube Atual */}
          <div>
            <Label className="text-gray-400 text-xs uppercase mb-2 flex items-center gap-2">
              <TrendingUp className="w-3 h-3" /> Clube Atual
            </Label>
            <Input
              value={formData.current_club_name}
              onChange={(e) => setFormData({ ...formData, current_club_name: e.target.value })}
              placeholder="Nome do clube"
              className="bg-white/5 border-white/10 text-white rounded-xl h-12"
            />
          </div>

          {/* Destaques */}
          <div>
            <Label className="text-gray-400 text-xs uppercase mb-2">Destaques da Carreira</Label>
            <Textarea
              value={formData.career_highlights}
              onChange={(e) => setFormData({ ...formData, career_highlights: e.target.value })}
              placeholder="Ex: Artilheiro do campeonato sub-17..."
              className="bg-white/5 border-white/10 text-white rounded-xl min-h-[80px]"
            />
          </div>

          {/* Conquistas */}
          <div>
            <Label className="text-gray-400 text-xs uppercase mb-2">Principais Conquistas</Label>
            <Textarea
              value={formData.achievements}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
              placeholder="Ex: Campeão municipal 2023..."
              className="bg-white/5 border-white/10 text-white rounded-xl min-h-[80px]"
            />
          </div>
        </div>

        {/* Footer - Botão de Salvar */}
        <div className="border-t border-[#00E5FF]/20 p-4 bg-[#0A0A0A]">
          <Button
            onClick={handleSave}
            disabled={saving || uploading}
            className="w-full h-12 bg-gradient-to-r from-[#00E5FF] to-[#0066FF] hover:from-[#00BFFF] hover:to-[#0088FF] text-black font-black rounded-xl shadow-xl disabled:opacity-50"
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
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Salvar Perfil
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}