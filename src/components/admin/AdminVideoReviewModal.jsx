import React, { useState, useRef } from "react";
import { appClient } from "@/api/backendClient";
import { motion } from "framer-motion";
import { 
  X, Play, Pause, Check, XCircle, Sparkles, Loader2,
  Volume2, VolumeX, Maximize
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export default function AdminVideoReviewModal({ video, isOpen, onClose, onUpdate }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [adminFeedback, setAdminFeedback] = useState(video?.admin_feedback || "");
  const [analysisResult, setAnalysisResult] = useState(video?.ai_analysis || null);
  const videoRef = useRef(null);

  if (!isOpen || !video) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `Você é um analista de desempenho esportivo especializado em futebol.

Analise este vídeo de futebol de forma EXTREMAMENTE DETALHADA:
- Atleta: ${video.athlete_name}
- Posição: ${video.position}
- Título: ${video.title}
- Descrição: ${video.description || 'Sem descrição'}

TAREFAS:
1. **Qualidade do Vídeo**: Avalie resolução, iluminação, ângulo da câmera e estabilidade (scores de 0-100)
2. **Análise de Performance**: Avalie habilidades técnicas, posicionamento, tomada de decisão e condição física (scores de 0-100)
3. **Detecção de Eventos**: Identifique gols, assistências, defesas, passes importantes, dribles, finalizações (com timestamp aproximado, descrição e qualidade)
4. **Pontos Fortes**: Liste 3-5 pontos fortes específicos observados
5. **Pontos Fracos**: Liste 2-4 áreas que precisam melhorar
6. **Recomendações**: Sugira 3-5 exercícios ou focos de treino específicos
7. **Nota Geral**: De 0 a 100
8. **Resumo**: Parágrafo completo e motivador sobre a performance

Seja ESPECÍFICO, T�0CNICO e CONSTRUTIVO. Use termos do futebol profissional.`;

      const response = await appClient.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false,
        file_urls: [video.video_url],
        response_json_schema: {
          type: "object",
          properties: {
            overall_score: { type: "number" },
            video_quality: {
              type: "object",
              properties: {
                score: { type: "number" },
                resolution: { type: "string" },
                lighting: { type: "string" },
                angle: { type: "string" },
                stability: { type: "string" }
              }
            },
            performance_analysis: {
              type: "object",
              properties: {
                technical_skills: { type: "number" },
                positioning: { type: "number" },
                decision_making: { type: "number" },
                physical_condition: { type: "number" }
              }
            },
            detected_events: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  timestamp: { type: "string" },
                  description: { type: "string" },
                  quality: { type: "string" }
                }
              }
            },
            strengths: {
              type: "array",
              items: { type: "string" }
            },
            weaknesses: {
              type: "array",
              items: { type: "string" }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            },
            summary: { type: "string" }
          }
        }
      });

      setAnalysisResult(response);
      toast.success("Análise de IA concluída!");
    } catch (error) {
      console.error("Erro na análise de IA:", error);
      toast.error("Erro ao analisar vídeo. Tente novamente.");
    }
    setIsAnalyzing(false);
  };

  const handleApprove = async () => {
    try {
      await appClient.entities.AthleteVideo.update(video.id, {
        status: "approved",
        is_approved: true,
        admin_feedback: adminFeedback,
        ai_analysis: analysisResult
      });

      // Criar notificação para o atleta
      await appClient.entities.Notification.create({
        user_id: video.athlete_id,
        title: "Vídeo Aprovado! �x}0",
        message: `Seu vídeo "${video.title}" foi aprovado e já está disponível com análise completa da IA!`,
        type: "upload",
        priority: "high"
      });

      toast.success("Vídeo aprovado com sucesso!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Erro ao aprovar:", error);
      toast.error("Erro ao aprovar vídeo");
    }
  };

  const handleReject = async () => {
    try {
      await appClient.entities.AthleteVideo.update(video.id, {
        status: "rejected",
        admin_feedback: adminFeedback || "Vídeo não atende aos critérios de qualidade."
      });

      // Notificar atleta
      await appClient.entities.Notification.create({
        user_id: video.athlete_id,
        title: "Vídeo Rejeitado",
        message: `Seu vídeo "${video.title}" não foi aprovado. Confira o feedback do analista.`,
        type: "upload",
        priority: "medium"
      });

      toast.success("Vídeo rejeitado");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Erro ao rejeitar:", error);
      toast.error("Erro ao rejeitar vídeo");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0A0A0A]"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-11 h-11 bg-[#111111] rounded-2xl flex items-center justify-center border border-[#222]"
          >
            <X className="w-5 h-5 text-white" />
          </motion.button>
          
          <h2 className="text-white font-bold">Análise de Vídeo</h2>

          <div className="flex items-center gap-2">
            <Badge className={`${
              video.status === 'approved' ? 'bg-green-500/20 text-green-400' :
              video.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {video.status === 'approved' ? 'Aprovado' :
               video.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
            </Badge>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative flex-shrink-0 aspect-video bg-black">
          <video
            ref={videoRef}
            src={video.video_url}
            className="w-full h-full object-contain"
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          
          {/* Video Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="w-12 h-12 bg-[#00E5FF] rounded-full flex items-center justify-center"
              >
                {isPlaying ? 
                  <Pause className="w-6 h-6 text-black" fill="black" /> : 
                  <Play className="w-6 h-6 text-black ml-1" fill="black" />
                }
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
              </motion.button>
              <div className="flex-1" />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleFullscreen}
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <Maximize className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>

          {!isPlaying && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="w-20 h-20 bg-[#00E5FF] rounded-full flex items-center justify-center"
              >
                <Play className="w-10 h-10 text-black ml-1" fill="black" />
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            {/* Video Info */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <h3 className="text-white font-bold text-lg mb-2">{video.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{video.description}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-[#00E5FF]/20 text-[#00E5FF]">{video.athlete_name}</Badge>
                <Badge className="bg-purple-500/20 text-purple-400">{video.position}</Badge>
                <Badge className="bg-green-500/20 text-green-400">{video.category}</Badge>
              </div>
            </div>

            {/* AI Analysis Button */}
            <Button
              onClick={handleAIAnalysis}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analisando com IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  {analysisResult ? 'Re-analisar com IA' : 'Analisar com IA'}
                </>
              )}
            </Button>

            {/* Analysis Result */}
            {analysisResult && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Resultado da Análise IA
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Nota Geral: </span>
                    <span className="text-white font-bold">{analysisResult.overall_score}/100</span>
                  </div>
                  {analysisResult.strengths && (
                    <div>
                      <span className="text-gray-400">Pontos Fortes: </span>
                      <span className="text-green-400">{analysisResult.strengths.length} identificados</span>
                    </div>
                  )}
                  {analysisResult.detected_events && (
                    <div>
                      <span className="text-gray-400">Eventos Detectados: </span>
                      <span className="text-[#00E5FF]">{analysisResult.detected_events.length} ações</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Admin Feedback */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <h4 className="text-white font-bold mb-3">Feedback do Analista</h4>
              <Textarea
                value={adminFeedback}
                onChange={(e) => setAdminFeedback(e.target.value)}
                placeholder="Escreva seu feedback para o atleta..."
                className="bg-white/5 border-white/10 text-white min-h-[120px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleReject}
                variant="outline"
                className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rejeitar
              </Button>
              <Button
                onClick={handleApprove}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Aprovar
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}
