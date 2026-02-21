import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { X, Camera, User, Calendar, Globe, Target, Ruler, Trophy, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function ProfileSetup({ isOpen, onClose, user, onSave }) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    profile_picture_url: "",
    birth_date: "",
    nationality: "🇧🇷",
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
      setForm({
        full_name: user.full_name || "",
        profile_picture_url: user.profile_picture_url || "",
        birth_date: user.birth_date || "",
        nationality: user.nationality || "🇧🇷",
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

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm({ ...form, profile_picture_url: file_url });
      toast.success("✅ Foto enviada!");
    } catch {
      toast.error("❌ Erro ao enviar foto");
    }
    setUploading(false);
  };

  const handleSubmit = async () => {
    setSaving(true);
    
    try {
      // Validações
      if (!form.birth_date) {
        toast.error("⚠️ Data de nascimento é obrigatória");
        setSaving(false);
        return;
      }

      if (!form.position) {
        toast.error("⚠️ Posição é obrigatória");
        setSaving(false);
        return;
      }

      // Preparar dados (removendo full_name pois é read-only)
      const updateData = {
        birth_date: form.birth_date,
        position: form.position,
        nationality: form.nationality || "🇧🇷",
        foot: form.foot || "direito"
      };

      // Adicionar campos opcionais apenas se preenchidos
      if (form.profile_picture_url) updateData.profile_picture_url = form.profile_picture_url;
      if (form.phone) updateData.phone = form.phone;

      if (form.city) updateData.city = form.city;
      if (form.state) updateData.state = form.state;
      if (form.height) updateData.height = Number(form.height);
      if (form.weight) updateData.weight = Number(form.weight);
      if (form.jersey_number) updateData.jersey_number = Number(form.jersey_number);
      if (form.current_club_name) updateData.current_club_name = form.current_club_name;
      if (form.career_highlights) updateData.career_highlights = form.career_highlights;
      if (form.achievements) updateData.achievements = form.achievements;

      console.log("💾 Salvando perfil:", updateData);

      await base44.auth.updateMe(updateData);

      console.log("✅ Perfil salvo no banco!");
      
      toast.success("✅ Perfil atualizado!", { duration: 2000 });
      
      // Aguardar um momento e recarregar
      setTimeout(async () => {
        await onSave();
        console.log("✅ Dados recarregados!");
        setSaving(false);
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
    <div className="fixed inset-0 z-[90] bg-black/95 flex items-end md:items-center justify-center">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        className="w-full max-w-md bg-[#0A0A0A] border-t-2 md:border-2 border-[#00E5FF] md:rounded-3xl max-h-[95vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#00E5FF]/20 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00E5FF] rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-white font-black text-base">Configurar Perfil</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Foto */}
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20">
              <div className="w-full h-full bg-white/5 border-2 border-white/10 rounded-2xl overflow-hidden">
                {form.profile_picture_url ? (
                  <img src={form.profile_picture_url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-gray-500" />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#00E5FF] rounded-lg flex items-center justify-center cursor-pointer">
                <Camera className="w-3.5 h-3.5 text-black" />
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="text-white text-[10px] uppercase mb-1.5 block font-bold flex items-center gap-1">
              <User className="w-3 h-3" /> Nome Completo
            </label>
            <Input
              value={form.full_name}
              disabled
              placeholder="Seu nome completo"
              className="bg-white/5 border-white/10 text-gray-400 rounded-xl h-11 cursor-not-allowed opacity-60"
            />
            <p className="text-[9px] text-gray-500 mt-1">Nome definido pela sua conta Google</p>
          </div>

          {/* Data e País */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-gray-400 text-[10px] uppercase mb-1.5 block">
                <Calendar className="w-3 h-3 inline mr-1" /> Nascimento *
              </label>
              <Input
                type="date"
                value={form.birth_date}
                onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
                className="bg-white/5 border-white/10 text-white rounded-xl h-11"
              />
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase mb-1.5 block">
                <Globe className="w-3 h-3 inline mr-1" /> País
              </label>
              <Select value={form.nationality} onValueChange={(v) => setForm({ ...form, nationality: v })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-11">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0A] border-white/10 text-white">
                  <SelectItem value="🇧🇷" className="text-white">🇧🇷 Brasil</SelectItem>
                  <SelectItem value="🇦🇷" className="text-white">🇦🇷 Argentina</SelectItem>
                  <SelectItem value="🇵🇹" className="text-white">🇵🇹 Portugal</SelectItem>
                  <SelectItem value="🇪🇸" className="text-white">🇪🇸 Espanha</SelectItem>
                  <SelectItem value="🇮🇹" className="text-white">🇮🇹 Itália</SelectItem>
                  <SelectItem value="🇫🇷" className="text-white">🇫🇷 França</SelectItem>
                  <SelectItem value="🇩🇪" className="text-white">🇩🇪 Alemanha</SelectItem>
                  <SelectItem value="🇬🇧" className="text-white">🇬🇧 Inglaterra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Telefone e Email */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-gray-400 text-[10px] uppercase mb-1.5 block">Telefone</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="bg-white/5 border-white/10 text-white rounded-xl h-11"
              />
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase mb-1.5 block">Email</label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@email.com"
                className="bg-white/5 border-white/10 text-white rounded-xl h-11"
              />
            </div>
          </div>

          {/* Cidade e Estado */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-gray-400 text-[10px] uppercase mb-1.5 block">Cidade</label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Sua cidade"
                className="bg-white/5 border-white/10 text-white rounded-xl h-11"
              />
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase mb-1.5 block">UF</label>
              <Input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })}
                placeholder="SP"
                maxLength={2}
                className="bg-white/5 border-white/10 text-white rounded-xl h-11 uppercase"
              />
            </div>
          </div>

          {/* Altura, Peso, Pé */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-gray-400 text-[10px] uppercase mb-1.5 block">Altura</label>
              <Input
                type="number"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
                placeholder="175"
                className="bg-white/5 border-white/10 text-white rounded-xl h-11"
              />
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase mb-1.5 block">Peso</label>
              <Input
                type="number"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="70"
                className="bg-white/5 border-white/10 text-white rounded-xl h-11"
              />
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase mb-1.5 block">Pé</label>
              <Select value={form.foot} onValueChange={(v) => setForm({ ...form, foot: v })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-11 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0A]">
                  <SelectItem value="direito">Dir</SelectItem>
                  <SelectItem value="esquerdo">Esq</SelectItem>
                  <SelectItem value="ambidestro">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Posição e Número */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-white text-[10px] uppercase mb-1.5 block font-bold flex items-center gap-1">
                <Target className="w-3 h-3" /> Posição *
              </label>
              <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-11">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0A]">
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
              <label className="text-gray-400 text-[10px] uppercase mb-1.5 block">Camisa</label>
              <Input
                type="number"
                value={form.jersey_number}
                onChange={(e) => setForm({ ...form, jersey_number: e.target.value })}
                placeholder="10"
                className="bg-white/5 border-white/10 text-white rounded-xl h-11"
              />
            </div>
          </div>

          {/* Clube */}
          <div>
            <label className="text-gray-400 text-[10px] uppercase mb-1.5 block">Clube Atual</label>
            <Input
              value={form.current_club_name}
              onChange={(e) => setForm({ ...form, current_club_name: e.target.value })}
              placeholder="Nome do clube"
              className="bg-white/5 border-white/10 text-white rounded-xl h-11"
            />
          </div>

          {/* Destaques */}
          <div>
            <label className="text-gray-400 text-[10px] uppercase mb-1.5 block">Destaques</label>
            <textarea
              value={form.career_highlights}
              onChange={(e) => setForm({ ...form, career_highlights: e.target.value })}
              placeholder="Principais destaques..."
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 text-sm min-h-[60px] resize-none"
            />
          </div>

          {/* Conquistas */}
          <div>
            <label className="text-gray-400 text-[10px] uppercase mb-1.5 block">Conquistas</label>
            <textarea
              value={form.achievements}
              onChange={(e) => setForm({ ...form, achievements: e.target.value })}
              placeholder="Títulos e conquistas..."
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 text-sm min-h-[60px] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#00E5FF]/20 p-4 flex-shrink-0">
          <Button
            onClick={handleSubmit}
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