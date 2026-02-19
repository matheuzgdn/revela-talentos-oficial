import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Video, Check, ChevronLeft } from "lucide-react";
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
    { value: "goleiro", label: "Goleiro" },
    { value: "zagueiro", label: "Zagueiro" },
    { value: "lateral", label: "Lateral" },
    { value: "volante", label: "Volante" },
    { value: "meia", label: "Meia" },
    { value: "atacante", label: "Atacante" },
  ];

  const categories = [
    { value: "destaque", label: "Destaque" },
    { value: "treino", label: "Treino" },
    { value: "jogo", label: "Jogo" },
    { value: "habilidade", label: "Habilidade" },
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
        className="fixed inset-0 z-[60] bg-[#0a0a0a] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
          <button onClick={() => { onClose(); resetForm(); }} className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
            <X className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-lg font-black text-white uppercase tracking-wider">
            {step === 1 && "Novo Vídeo"}
            {step === 2 && "Detalhes"}
            {step === 3 && "Sucesso!"}
          </h2>
          <div className="w-10" />
        </div>

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
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-sm aspect-video bg-[#1a1a1a] border-2 border-dashed border-gray-700 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-cyan-500 transition-colors"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-2xl flex items-center justify-center">
                  <Video className="w-10 h-10 text-black" />
                </div>
                <div className="text-center">
                  <p className="text-white font-bold mb-1">Selecionar Vídeo</p>
                  <p className="text-gray-500 text-sm">Toque para escolher</p>
                </div>
              </button>

              <p className="text-gray-600 text-xs mt-6 text-center max-w-xs">
                Envie seus melhores momentos para ser descoberto por olheiros
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {videoPreview && (
                <div className="aspect-video bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800/50">
                  <video
                    src={videoPreview}
                    className="w-full h-full object-cover"
                    controls
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 mb-2 block uppercase tracking-wider font-bold">Título *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Gol de falta no campeonato"
                    className="bg-[#1a1a1a] border-gray-800/50 text-white placeholder:text-gray-600 rounded-xl py-6 focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-2 block uppercase tracking-wider font-bold">Descrição</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o momento..."
                    className="bg-[#1a1a1a] border-gray-800/50 text-white placeholder:text-gray-600 min-h-[80px] rounded-xl focus:border-cyan-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-2 block uppercase tracking-wider font-bold">Posição</label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) => setFormData({ ...formData, position: value })}
                    >
                      <SelectTrigger className="bg-[#1a1a1a] border-gray-800/50 text-white rounded-xl">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-gray-800">
                        {positions.map((pos) => (
                          <SelectItem key={pos.value} value={pos.value} className="text-white">
                            {pos.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-2 block uppercase tracking-wider font-bold">Categoria</label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="bg-[#1a1a1a] border-gray-800/50 text-white rounded-xl">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-gray-800">
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value} className="text-white">
                            {cat.label}
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
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-400 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                <Check className="w-12 h-12 text-white" strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 uppercase">Enviado!</h3>
              <p className="text-gray-500 text-center">
                Seu vídeo está em análise
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        {step === 2 && (
          <div className="p-4 border-t border-gray-800/50">
            {uploading ? (
              <div className="space-y-3">
                <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-center text-gray-500 text-sm font-bold">
                  Enviando... {uploadProgress}%
                </p>
              </div>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.title}
                className="w-full py-6 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black font-black text-lg rounded-2xl uppercase tracking-wider disabled:opacity-50"
              >
                <Upload className="w-5 h-5 mr-2" />
                Publicar
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}