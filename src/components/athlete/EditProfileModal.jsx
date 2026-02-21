import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { X, Camera, User, Calendar, Globe, MapPin, Phone, Ruler, Target, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function EditProfileModal({ isOpen, onClose, user, onUpdate }) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState({
    full_name: "",
    profile_picture_url: "",
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
    career_highlights: "",
    achievements: ""
  });

  useEffect(() => {
    if (user && isOpen) {
      console.log("🔄 Carregando dados do usuário:", user);
      setData({
        full_name: user.full_name || "",
        profile_picture_url: user.profile_picture_url || "",
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
        career_highlights: user.career_highlights || "",
        achievements: user.achievements || ""
      });
    }
  }, [user, isOpen]);

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

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validações
      if (!data.full_name?.trim()) {
        toast.error("⚠️ Nome completo é obrigatório");
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

      // Preparar dados para salvar
      const saveData = {
        full_name: data.full_name.trim(),
        profile_picture_url: data.profile_picture_url || null,
        birth_date: data.birth_date || null,
        nationality: data.nationality || null,
        phone: data.phone || null,
        email: data.email || null,
        city: data.city || null,
        state: data.state || null,
        height: data.height ? Number(data.height) : null,
        weight: data.weight ? Number(data.weight) : null,
        foot: data.foot || "direito",
        position: data.position,
        jersey_number: data.jersey_number ? Number(data.jersey_number) : null,
        current_club_name: data.current_club_name || null,
        career_highlights: data.career_highlights || null,
        achievements: data.achievements || null
      };

      console.log("💾 Salvando dados:", saveData);

      // Salvar
      await base44.auth.updateMe(saveData);
      
      console.log("✅ Dados salvos com sucesso!");
      toast.success("✅ Perfil atualizado com sucesso!", {
        duration: 2000
      });

      // Aguardar e recarregar
      setTimeout(async () => {
        await onUpdate();
        onClose();
      }, 500);

    } catch (error) {
      console.error("❌ Erro ao salvar:", error);
      toast.error("❌ Erro ao salvar perfil");
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
        transition={{ type: "spring", damping: 30 }}
        className="w-full max-w-lg bg-[#0A0A0A] border-t-2 md:border-2 border-[#00E5FF]/30 md:rounded-3xl overflow-hidden max-h-[95vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A1A2A] to-[#05111A] border-b border-[#00E5FF]/20 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00E5FF] rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-white font-black text-base">Editar Perfil</h3>
              <p className="text-[#00E5FF] text-[10px]">Configure suas informações</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Foto */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-20 h-20">
              <div className="w-full h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                {data.profile_picture_url ? (
                  <img src={data.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-gray-500" />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#00E5FF] rounded-lg flex items-center justify-center cursor-pointer">
                <Camera className="w-3.5 h-3.5 text-black" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Nome */}
          <div>
            <Label className="text-white text-[10px] uppercase mb-1.5 flex items-center gap-1">
              <User className="w-3 h-3" /> Nome Completo *
            </Label>
            <Input
              value={data.full_name}
              onChange={(e) => setData({ ...data, full_name: e.target.value })}
              placeholder="Digite seu nome"
              className="bg-white/5 border-white/10 text-white rounded-xl h-11"
            />
          </div>

          {/* Data e País */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-gray-400 text-[10px] uppercase mb-1.5 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Nascimento *
              </Label>
              <Input
                type="date"
                value={data.birth_date}
                onChange={(e) => setData({ ...data, birth_date: e.target.value })}
                className="bg-white/5 border-white/10 text-white rounded-xl h-11"
              />
            </div>
            <div>
              <Label className="text-gray-400 text-[10px] uppercase mb-1.5 flex items-center gap-1">
                <Globe className="w-3 h-3" /> País
              </Label>
              <Select value={data.nationality} onValueChange={(v) => setData({ ...data, nationality: v })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-11">
                  <SelectValue placeholder="🌍" />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0A] border-white/10">
                  <SelectItem value="🇧🇷">🇧🇷 Brasil</SelectItem>
                  <SelectItem value="🇦🇷">🇦🇷 Argentina</SelectItem>
                  <SelectItem value="🇵🇹">🇵🇹 Portugal</SelectItem>
                  <SelectItem value="🇪🇸">🇪🇸 Espanha</SelectItem>
                  <SelectItem value="🇮🇹">🇮🇹 Itália</SelectItem>
                  <SelectItem value="🇫🇷">🇫🇷 França</SelectItem>
                  <SelectItem value="🇩🇪">🇩🇪 Alemanha</SelectItem>
                  <SelectItem value="🇬🇧">🇬🇧 Inglaterra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Telefone e Email */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-gray-400 text-[10px] uppercase mb-1.5">Telefone</Label>
              <Input
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="bg-white/5 border-white/10 text-white rounded-xl h-11"
              />
            </div>
            <div>
              <Label className="text-gray-400 text-[10px] uppercase mb-1.5">Email</Label>
              <Input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="email@exemplo.com"
                className="bg-white/5 border-white/10 text-white rounded-xl h-11"
              />
            </div>
          </div>

          {/* Cidade e Estado */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-gray-400 text-[10px] uppercase mb-1.5">Cidade</Label>
              <Input
                value={data.city}
                onChange={(e) => setData({ ...data, city: e.target.value })}
                placeholder="Sua cidade"
                className="bg-white/5 border-white/10 text-white rounded-xl h-11"
              />
            </div>
            <div>
              <Label className="text-gray-400 text-[10px] uppercase mb-1.5">Estado</Label>
              <Input
                value={data.state}
                onChange={(e) => setData({ ...data, state: e.target.value })}
                placeholder="UF"
                maxLength={2}
                className="bg-white/5 border-white/10 text-white rounded-xl h-11 uppercase"
              />
            </div>
          </div>

          {/* Altura, Peso, Pé */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-gray-400 text-[10px] uppercase mb-1.5">Altura</Label>
              <Input
                type="number"
                value={data.height}
                onChange={(e) => setData({ ...data, height: e.target.value })}
                placeholder="175"
                className="bg-white/5 border-white/10 text-white rounded-xl h-11"
              />
            </div>
            <div>
              <Label className="text-gray-400 text-[10px] uppercase mb-1.5">Peso</Label>
              <Input
                type="number"
                value={data.weight}
                onChange={(e) => setData({ ...data, weight: e.target.value })}
                placeholder="70"
                className="bg-white/5 border-white/10 text-white rounded-xl h-11"
              />
            </div>
            <div>
              <Label className="text-gray-400 text-[10px] uppercase mb-1.5">Pé</Label>
              <Select value={data.foot} onValueChange={(v) => setData({ ...data, foot: v })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0A] border-white/10">
                  <SelectItem value="direito">Direito</SelectItem>
                  <SelectItem value="esquerdo">Esquerdo</SelectItem>
                  <SelectItem value="ambidestro">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Posição e Número */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-white text-[10px] uppercase mb-1.5 flex items-center gap-1">
                <Target className="w-3 h-3" /> Posição *
              </Label>
              <Select value={data.position} onValueChange={(v) => setData({ ...data, position: v })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-11">
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
              <Label className="text-gray-400 text-[10px] uppercase mb-1.5">Camisa</Label>
              <Input
                type="number"
                value={data.jersey_number}
                onChange={(e) => setData({ ...data, jersey_number: e.target.value })}
                placeholder="10"
                className="bg-white/5 border-white/10 text-white rounded-xl h-11"
              />
            </div>
          </div>

          {/* Clube */}
          <div>
            <Label className="text-gray-400 text-[10px] uppercase mb-1.5">Clube Atual</Label>
            <Input
              value={data.current_club_name}
              onChange={(e) => setData({ ...data, current_club_name: e.target.value })}
              placeholder="Nome do clube"
              className="bg-white/5 border-white/10 text-white rounded-xl h-11"
            />
          </div>

          {/* Destaques */}
          <div>
            <Label className="text-gray-400 text-[10px] uppercase mb-1.5">Destaques</Label>
            <Textarea
              value={data.career_highlights}
              onChange={(e) => setData({ ...data, career_highlights: e.target.value })}
              placeholder="Principais destaques da sua carreira..."
              className="bg-white/5 border-white/10 text-white rounded-xl min-h-[60px] text-sm"
            />
          </div>

          {/* Conquistas */}
          <div>
            <Label className="text-gray-400 text-[10px] uppercase mb-1.5">Conquistas</Label>
            <Textarea
              value={data.achievements}
              onChange={(e) => setData({ ...data, achievements: e.target.value })}
              placeholder="Principais títulos e conquistas..."
              className="bg-white/5 border-white/10 text-white rounded-xl min-h-[60px] text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#00E5FF]/20 p-4 bg-[#0A0A0A] flex-shrink-0">
          <Button
            onClick={handleSave}
            disabled={saving || uploading}
            className="w-full h-12 bg-[#00E5FF] hover:bg-[#00BFFF] text-black font-black rounded-xl disabled:opacity-50"
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