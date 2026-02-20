import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";

export default function EditProfileModal({ isOpen, onClose, user }) {
  const [formData, setFormData] = useState({
    current_club_name: user?.current_club_name || "",
    current_club_crest_url: user?.current_club_crest_url || "",
    shirt_number: user?.shirt_number || "",
    age: user?.age || "",
    nationality: user?.nationality || "",
    height: user?.height || "",
    weight: user?.weight || "",
    preferred_foot: user?.preferred_foot || "",
    athlete_position: user?.athlete_position || "",
    bio: user?.bio || "",
    social_instagram: user?.social_instagram || "",
    whatsapp: user?.whatsapp || ""
  });
  const [uploading, setUploading] = useState(false);

  const handleUploadCrest = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, current_club_crest_url: file_url });
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await base44.auth.updateMe(formData);
      onClose();
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-xl overflow-y-auto"
      >
        <div className="min-h-screen p-4 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-[#111111] border border-[#222] rounded-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#222]">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Editar Perfil</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Club info */}
              <div>
                <label className="text-[#666] text-xs font-bold mb-2 block">Clube Atual</label>
                <Input
                  value={formData.current_club_name}
                  onChange={(e) => setFormData({ ...formData, current_club_name: e.target.value })}
                  placeholder="Ex: Santos FC"
                  className="bg-[#1a1a1a] border-[#333] text-white rounded-xl"
                />
              </div>

              {/* Club crest */}
              <div>
                <label className="text-[#666] text-xs font-bold mb-2 block">Escudo do Clube</label>
                <div className="flex gap-3">
                  {formData.current_club_crest_url && (
                    <div className="w-16 h-16 bg-[#1a1a1a] border border-[#333] rounded-xl p-2">
                      <img src={formData.current_club_crest_url} alt="Crest" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <label className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] border-2 border-dashed border-[#333] rounded-xl p-4 cursor-pointer hover:border-[#00E5FF]/50 transition-colors">
                    <Upload className="w-5 h-5 text-[#666]" />
                    <span className="text-[#666] text-sm">{uploading ? "Enviando..." : "Upload"}</span>
                    <input type="file" accept="image/*" onChange={handleUploadCrest} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Basic info grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#666] text-xs font-bold mb-2 block">Número</label>
                  <Input
                    type="number"
                    value={formData.shirt_number}
                    onChange={(e) => setFormData({ ...formData, shirt_number: parseInt(e.target.value) })}
                    placeholder="10"
                    className="bg-[#1a1a1a] border-[#333] text-white rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[#666] text-xs font-bold mb-2 block">Idade</label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    placeholder="20"
                    className="bg-[#1a1a1a] border-[#333] text-white rounded-xl"
                  />
                </div>
              </div>

              {/* Position */}
              <div>
                <label className="text-[#666] text-xs font-bold mb-2 block">Posição</label>
                <Select
                  value={formData.athlete_position}
                  onValueChange={(value) => setFormData({ ...formData, athlete_position: value })}
                >
                  <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white rounded-xl">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-[#333]">
                    <SelectItem value="goleiro" className="text-white">Goleiro</SelectItem>
                    <SelectItem value="zagueiro" className="text-white">Zagueiro</SelectItem>
                    <SelectItem value="lateral" className="text-white">Lateral</SelectItem>
                    <SelectItem value="volante" className="text-white">Volante</SelectItem>
                    <SelectItem value="meia" className="text-white">Meia</SelectItem>
                    <SelectItem value="atacante" className="text-white">Atacante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Physical */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#666] text-xs font-bold mb-2 block">Altura (cm)</label>
                  <Input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
                    placeholder="180"
                    className="bg-[#1a1a1a] border-[#333] text-white rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[#666] text-xs font-bold mb-2 block">Peso (kg)</label>
                  <Input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })}
                    placeholder="75"
                    className="bg-[#1a1a1a] border-[#333] text-white rounded-xl"
                  />
                </div>
              </div>

              {/* Foot */}
              <div>
                <label className="text-[#666] text-xs font-bold mb-2 block">Pé Preferido</label>
                <Select
                  value={formData.preferred_foot}
                  onValueChange={(value) => setFormData({ ...formData, preferred_foot: value })}
                >
                  <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white rounded-xl">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-[#333]">
                    <SelectItem value="right" className="text-white">Direito</SelectItem>
                    <SelectItem value="left" className="text-white">Esquerdo</SelectItem>
                    <SelectItem value="both" className="text-white">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nationality */}
              <div>
                <label className="text-[#666] text-xs font-bold mb-2 block">Nacionalidade</label>
                <Input
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  placeholder="Brasil"
                  className="bg-[#1a1a1a] border-[#333] text-white rounded-xl"
                />
              </div>

              {/* Social */}
              <div>
                <label className="text-[#666] text-xs font-bold mb-2 block">Instagram</label>
                <Input
                  value={formData.social_instagram}
                  onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                  placeholder="@usuario"
                  className="bg-[#1a1a1a] border-[#333] text-white rounded-xl"
                />
              </div>

              <div>
                <label className="text-[#666] text-xs font-bold mb-2 block">WhatsApp</label>
                <Input
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+55 11 99999-9999"
                  className="bg-[#1a1a1a] border-[#333] text-white rounded-xl"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#222]">
              <Button
                onClick={handleSave}
                className="w-full py-6 bg-[#00E5FF] hover:bg-[#00BFFF] text-black font-black text-lg rounded-2xl"
              >
                <Save className="w-5 h-5 mr-2" />
                Salvar
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}