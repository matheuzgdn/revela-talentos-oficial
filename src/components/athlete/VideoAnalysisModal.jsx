import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Play, Pause, Volume2, VolumeX, Maximize, Send, 
  TrendingUp, Target, Zap, Shield, Brain, Award,
  MessageCircle, Sparkles, ChevronRight, BarChart3,
  Trophy, AlertCircle, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VideoAnalysisModal({ video, isOpen, onClose, user }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState("analysis");
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const videoRef = useRef(null);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (isOpen && video?.ai_analysis) {
      // Mensagem inicial da IA
      setChatMessages([{
        role: "assistant",
        content: `Olá! Assisti seu vídeo "${video.title}" e fiz uma análise completa. ${video.ai_analysis.summary || 'Estou aqui para te ajudar a evoluir! Pode me perguntar qualquer coisa sobre sua performance.'}`
      }]);
    }
  }, [isOpen, video]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  if (!isOpen || !video) return null;

  const analysis = video.ai_analysis || {};
  const hasAnalysis = Object.keys(analysis).length > 0;

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
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSendingMessage) return;

    const userMsg = newMessage.trim();
    setNewMessage("");
    
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsSendingMessage(true);

    try {
      const context = `Você é um analista de desempenho esportivo especializado em futebol. 
      Você está conversando com ${video.athlete_name}, um ${video.position}.
      
      ${hasAnalysis ? `
      Análise do vídeo:
      - Nota geral: ${analysis.overall_score}/100
      - Pontos fortes: ${analysis.strengths?.join(', ')}
      - Pontos fracos: ${analysis.weaknesses?.join(', ')}
      - Eventos detectados: ${analysis.detected_events?.map(e => `${e.type} (${e.quality})`).join(', ')}
      ` : ''}
      
      Responda de forma motivadora, construtiva e específica. Use dados da análise quando relevante.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${context}\n\nPergunta do atleta: ${userMsg}`,
        add_context_from_internet: false
      });

      setChatMessages(prev => [...prev, { 
        role: "assistant", 
        content: response 
      }]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setChatMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Desculpe, tive um problema ao processar sua mensagem. Tente novamente!" 
      }]);
    }

    setIsSendingMessage(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
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
        <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-11 h-11 bg-[#111111] rounded-2xl flex items-center justify-center border border-[#222]"
          >
            <X className="w-5 h-5 text-white" />
          </motion.button>
          
          <div className="flex items-center gap-2">
            {video.status === 'approved' && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Aprovado
              </Badge>
            )}
            {hasAnalysis && (
              <Badge className="bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Análise IA
              </Badge>
            )}
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
          
          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="w-12 h-12 bg-[#00E5FF] rounded-full flex items-center justify-center shadow-lg"
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
                {isMuted ? 
                  <VolumeX className="w-5 h-5 text-white" /> : 
                  <Volume2 className="w-5 h-5 text-white" />
                }
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

          {/* Play button when paused */}
          {!isPlaying && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="w-20 h-20 bg-[#00E5FF] rounded-full flex items-center justify-center shadow-2xl shadow-[#00E5FF]/50"
              >
                <Play className="w-10 h-10 text-black ml-1" fill="black" />
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full bg-[#111111] border-b border-[#222] rounded-none">
              <TabsTrigger value="analysis" className="flex-1">
                <BarChart3 className="w-4 h-4 mr-2" />
                Análise
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-1">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat com IA
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="flex-1 overflow-auto p-4 space-y-4 mt-0">
              {/* Video Info */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <h3 className="text-white font-bold text-lg mb-2">{video.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{video.description}</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#00E5FF]/20 text-[#00E5FF]">
                    {video.position?.toUpperCase()}
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-400">
                    {video.category}
                  </Badge>
                </div>
              </div>

              {hasAnalysis ? (
                <>
                  {/* Overall Score */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#00E5FF]/20 to-[#0066FF]/20 border border-[#00E5FF]/30 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-bold text-lg">Nota Geral</h4>
                      <Trophy className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <div className="flex items-end gap-2">
                      <span className={`text-5xl font-black ${getScoreColor(analysis.overall_score)}`}>
                        {analysis.overall_score || 0}
                      </span>
                      <span className="text-gray-400 text-xl mb-1">/100</span>
                    </div>
                    <Progress value={analysis.overall_score || 0} className="h-3 mt-4" />
                  </motion.div>

                  {/* Performance Metrics */}
                  {analysis.performance_analysis && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#00E5FF]" />
                        Análise de Performance
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(analysis.performance_analysis).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-300 text-sm capitalize">
                                {key.replace(/_/g, ' ')}
                              </span>
                              <span className={`font-bold ${getScoreColor(value)}`}>{value}/100</span>
                            </div>
                            <Progress value={value} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detected Events */}
                  {analysis.detected_events && analysis.detected_events.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Eventos Detectados
                      </h4>
                      <div className="space-y-2">
                        {analysis.detected_events.map((event, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/5 rounded-xl p-3 flex items-start gap-3"
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              event.type === 'gol' ? 'bg-green-500/20' :
                              event.type === 'assistencia' ? 'bg-blue-500/20' :
                              'bg-purple-500/20'
                            }`}>
                              {event.type === 'gol' ? '⚽' :
                               event.type === 'assistencia' ? '🎯' :
                               event.type === 'drible' ? '✨' :
                               event.type === 'defesa' ? '🛡️' : '⚡'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-bold text-sm capitalize">{event.type}</span>
                                <Badge className={`text-[10px] ${
                                  event.quality === 'excelente' ? 'bg-green-500/20 text-green-400' :
                                  event.quality === 'boa' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {event.quality}
                                </Badge>
                              </div>
                              <p className="text-gray-400 text-xs">{event.description}</p>
                              {event.timestamp && (
                                <p className="text-[#00E5FF] text-xs mt-1">⏱️ {event.timestamp}</p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.strengths && analysis.strengths.length > 0 && (
                      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-4">
                        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          Pontos Fortes
                        </h4>
                        <ul className="space-y-2">
                          {analysis.strengths.map((strength, idx) => (
                            <li key={idx} className="text-green-300 text-sm flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">•</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                      <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-4">
                        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-orange-400" />
                          Pontos a Melhorar
                        </h4>
                        <ul className="space-y-2">
                          {analysis.weaknesses.map((weakness, idx) => (
                            <li key={idx} className="text-orange-300 text-sm flex items-start gap-2">
                              <span className="text-orange-500 mt-0.5">•</span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Recommendations */}
                  {analysis.recommendations && analysis.recommendations.length > 0 && (
                    <div className="bg-gradient-to-br from-[#00E5FF]/10 to-[#0066FF]/10 border border-[#00E5FF]/30 rounded-2xl p-4">
                      <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-[#00E5FF]" />
                        Recomendações de Treino
                      </h4>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-[#00E5FF] mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Admin Feedback */}
                  {video.admin_feedback && (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4">
                      <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-400" />
                        Feedback do Analista
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{video.admin_feedback}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                  <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-white font-bold mb-2">Análise em Andamento</p>
                  <p className="text-gray-400 text-sm">
                    Nossa IA está analisando seu vídeo. Você receberá uma notificação quando estiver pronta!
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
              {/* Chat Messages */}
              <ScrollArea ref={chatScrollRef} className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-4 ${
                        msg.role === 'user' 
                          ? 'bg-[#00E5FF] text-black' 
                          : 'bg-white/5 border border-white/10 text-white'
                      }`}>
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-[#00E5FF] to-[#0066FF] rounded-full flex items-center justify-center">
                              <Brain className="w-3 h-3 text-black" />
                            </div>
                            <span className="text-xs text-gray-400 font-bold">Analista IA</span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isSendingMessage && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#00E5FF] rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-[#00E5FF] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 bg-[#00E5FF] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Pergunte sobre sua performance..."
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    disabled={isSendingMessage}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSendingMessage}
                    className="bg-[#00E5FF] hover:bg-[#00BFFF] text-black"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}