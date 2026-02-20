import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { X, Upload, Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function EditProfileModal({ isOpen, onClose, user, onUpdate }) {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    position: user?.position || "",
    nationality: user?.nationality || "",
    jersey_number: user?.jersey_number || "",
    current_club_name: user?.current_club_name || "",
    birth_date: user?.birth_date || ""
  });
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    try {
      await base44.auth.updateMe(formData);
      toast.success("Perfil atualizado!");
      onUpdate();
      onClose();
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
      toast.success("Imagem enviada!");
    } catch (error) {
      toast.error("Erro ao enviar imagem");
    }
    setUploading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-[#0F1419] rounded-[24px] border border-[#00E5FF]/20 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#222]">
          <h3 className="text-2xl font-black text-white">Editar Perfil</h3>
          <button onClick={onClose} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Images Upload */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Foto de Perfil</Label>
              <div className="relative aspect-square bg-[#1a1a1a] rounded-2xl border-2 border-dashed border-[#333] overflow-hidden">
                {formData.profile_picture_url ? (
                  <img src={formData.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-600 mb-2" />
                    <p className="text-xs text-gray-600">Adicionar Foto</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'profile_picture_url')}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Imagem Recortada</Label>
              <div className="relative aspect-square bg-[#1a1a1a] rounded-2xl border-2 border-dashed border-[#333] overflow-hidden">
                {formData.player_cutout_url ? (
                  <img src={formData.player_cutout_url} alt="Cutout" className="w-full h-full object-contain" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-600 mb-2" />
                    <p className="text-xs text-gray-600 text-center px-2">PNG Transparente</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/png"
                  onChange={(e) => handleImageUpload(e, 'player_cutout_url')}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-gray-400 text-xs uppercase tracking-wider">Nome Completo</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="mt-2 bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>

            <div>
              <Label className="text-gray-400 text-xs uppercase tracking-wider">Posição</Label>
              <Select value={formData.position} onValueChange={(v) => setFormData({ ...formData, position: v })}>
                <SelectTrigger className="mt-2 bg-[#1a1a1a] border-[#333] text-white">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#333]">
                  <SelectItem value="goleiro">Goleiro</SelectItem>
                  <SelectItem value="zagueiro">Zagueiro</SelectItem>
                  <SelectItem value="lateral">Lateral</SelectItem>
                  <SelectItem value="volante">Volante</SelectItem>
                  <SelectItem value="meia">Meia</SelectItem>
                  <SelectItem value="atacante">Atacante</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-400 text-xs uppercase tracking-wider">Número da Camisa</Label>
              <Input
                type="number"
                value={formData.jersey_number}
                onChange={(e) => setFormData({ ...formData, jersey_number: parseInt(e.target.value) })}
                className="mt-2 bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>

            <div>
              <Label className="text-gray-400 text-xs uppercase tracking-wider">Nacionalidade</Label>
              <Input
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                placeholder="Ex: 🇧🇷 ou Brasil"
                className="mt-2 bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>

            <div>
              <Label className="text-gray-400 text-xs uppercase tracking-wider">Data de Nascimento</Label>
              <Input
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                className="mt-2 bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>

            <div className="col-span-2">
              <Label className="text-gray-400 text-xs uppercase tracking-wider">Clube Atual</Label>
              <Input
                value={formData.current_club_name}
                onChange={(e) => setFormData({ ...formData, current_club_name: e.target.value })}
                className="mt-2 bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>

            <div className="col-span-2">
              <Label className="text-gray-400 text-xs uppercase tracking-wider">URL do Escudo do Clube</Label>
              <Input
                value={formData.current_club_crest_url || ""}
                onChange={(e) => setFormData({ ...formData, current_club_crest_url: e.target.value })}
                placeholder="https://..."
                className="mt-2 bg-[#1a1a1a] border-[#333] text-white"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#222] flex gap-3">
          <Button 
            onClick={onClose} 
            className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-[#333]"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={uploading}
            className="flex-1 bg-[#00E5FF] hover:bg-[#00BFFF] text-black font-bold"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </motion.div>
    </div>
  );
}