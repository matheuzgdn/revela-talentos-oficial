import React, { useState, useRef } from "react";
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Video, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function VideoUploadModal({ isOpen, onClose, user }) {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    position: "",
    category: "destaque"
  });
  const fileInputRef = useRef(null);

  const positions = [
    { value: "goleiro", label: "Goleiro", icon: "🧤" },
    { value: "zagueiro", label: "Zagueiro", icon: "🛡️" },
    { value: "lateral", label: "Lateral", icon: "🏃" },
    { value: "volante", label: "Volante", icon: "⚙️" },
    { value: "meia", label: "Meia", icon: "🎯" },
    { value: "atacante", label: "Atacante", icon: "⚡" },
  ];

  const categories = [
    { value: "destaque", label: "Destaque", icon: "🔥" },
    { value: "treino", label: "Treino", icon: "💪" },
    { value: "jogo", label: "Jogo", icon: "🏆" },
    { value: "habilidade", label: "Habilidade", icon: "✨" },
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!videoFile || !formData.title) return;

    setUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 300);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: videoFile });

      clearInterval(progressInterval);
      setUploadProgress(100);

      await base44.entities.AthleteVideo.create({
        title: formData.title,
        description: formData.description,
        video_url: file_url,
        thumbnail_url: file_url,
        athlete_name: user?.full_name || "Atleta",
        athlete_id: user?.id,
        position: formData.position,
        category: formData.category,
        status: "pending"
      });

      setTimeout(() => {
        setStep(3);
        setTimeout(() => {
          onClose();
          resetForm();
          // Recarregar a página para mostrar o novo vídeo
          window.location.reload();
        }, 2000);
      }, 500);

    } catch (error) {
      console.error("Upload error:", error);
      clearInterval(progressInterval);
      setUploading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setVideoFile(null);
    setVideoPreview(null);
    setFormData({ title: "", description: "", position: "", category: "destaque" });
    setUploading(false);
    setUploadProgress(0);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-[#0A0A0A] flex flex-col"
      >
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between p-4 border-b border-[#1a1a1a]"
        >
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => { onClose(); resetForm(); }} 
            className="w-11 h-11 bg-[#111111] rounded-2xl flex items-center justify-center border border-[#222]"
          >
            <X className="w-5 h-5 text-white" />
          </motion.button>
          <h2 className="text-lg font-black text-white uppercase tracking-wider">
            {step === 1 && "Novo Vídeo"}
            {step === 2 && "Detalhes"}
            {step === 3 && "Sucesso!"}
          </h2>
          <div className="w-11" />
        </motion.div>

        {/* Step Indicator */}
        {step < 3 && (
          <div className="px-4 py-3">
            <div className="flex gap-2">
              {[1, 2].map((s) => (
                <div 
                  key={s}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    s <= step ? 'bg-[#00E5FF] shadow-lg shadow-[#00E5FF]/30' : 'bg-[#222]'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-sm aspect-video bg-[#111111] border-2 border-dashed border-[#333] rounded-[24px] flex flex-col items-center justify-center gap-4 hover:border-[#00E5FF]/50 transition-colors"
              >
                <div className="w-24 h-24 bg-[#00E5FF] rounded-[20px] flex items-center justify-center shadow-lg shadow-[#00E5FF]/30">
                  <Video className="w-12 h-12 text-black" />
                </div>
                <div className="text-center">
                  <p className="text-white font-bold mb-1">Selecionar Vídeo</p>
                  <p className="text-[#666] text-sm">Toque para escolher</p>
                </div>
              </motion.button>

              <p className="text-[#444] text-xs mt-8 text-center max-w-xs">
                Envie seus melhores momentos para ser descoberto por olheiros e clubes
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              {videoPreview && (
                <div className="aspect-video bg-[#111111] rounded-[20px] overflow-hidden border border-[#222]">
                  <video
                    src={videoPreview}
                    className="w-full h-full object-cover"
                    controls
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-[#666] mb-2 block uppercase tracking-widest font-bold">Título *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Gol de falta no campeonato"
                    className="bg-[#111111] border-[#222] text-white placeholder:text-[#444] rounded-2xl py-6 focus:border-[#00E5FF]/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#666] mb-2 block uppercase tracking-widest font-bold">Descrição</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o momento..."
                    className="bg-[#111111] border-[#222] text-white placeholder:text-[#444] min-h-[80px] rounded-2xl focus:border-[#00E5FF]/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-[#666] mb-2 block uppercase tracking-widest font-bold">Posição</label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) => setFormData({ ...formData, position: value })}
                    >
                      <SelectTrigger className="bg-[#111111] border-[#222] text-white rounded-2xl h-12">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111111] border-[#222] z-[70]">
                        {positions.map((pos) => (
                          <SelectItem key={pos.value} value={pos.value} className="text-white hover:bg-[#1a1a1a] focus:bg-[#1a1a1a]">
                            {pos.icon} {pos.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#666] mb-2 block uppercase tracking-widest font-bold">Categoria</label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="bg-[#111111] border-[#222] text-white rounded-2xl h-12">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111111] border-[#222] z-[70]">
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-[#1a1a1a] focus:bg-[#1a1a1a]">
                            {cat.icon} {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="relative"
              >
                <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-emerald-400 rounded-[24px] flex items-center justify-center shadow-lg shadow-green-500/30">
                  <Check className="w-14 h-14 text-white" strokeWidth={3} />
                </div>
                <div className="absolute inset-0 bg-green-500/20 rounded-[24px] blur-2xl -z-10" />
              </motion.div>
              <h3 className="text-2xl font-black text-white mt-8 mb-2 uppercase tracking-tight">Enviado!</h3>
              <p className="text-[#666] text-center text-sm">
                Seu vídeo está em análise e será publicado em breve
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        {step === 2 && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-4 border-t border-[#1a1a1a]"
          >
            {uploading ? (
              <div className="space-y-3">
                <div className="h-3 bg-[#111111] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#00E5FF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    style={{ boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)' }}
                  />
                </div>
                <p className="text-center text-[#666] text-sm font-bold">
                  Enviando... {uploadProgress}%
                </p>
              </div>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.title}
                className="w-full py-7 bg-[#00E5FF] hover:bg-[#00BFFF] text-black font-black text-lg rounded-2xl uppercase tracking-wider disabled:opacity-50 shadow-lg shadow-[#00E5FF]/30 transition-all hover:shadow-[#00E5FF]/50"
              >
                <Zap className="w-5 h-5 mr-2" />
                Publicar
              </Button>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}