import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Send, Loader2, CheckCircle2, Calendar, Trophy, 
  MessageCircle, Target, Upload, Star, Sparkles,
  ThumbsUp, ThumbsDown, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function WeeklyAssessmentChat({ isOpen, onClose, userId, userName, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const messagesEndRef = useRef(null);

  const questions = [
    {
      id: "has_club",
      type: "yesno",
      question: `Oi ${userName}! 👋 Vamos começar nossa conversa semanal. Você está em algum clube atualmente?`,
      icon: Trophy,
      color: "from-blue-500 to-cyan-500",
      field: "current_club_status"
    },
    {
      id: "club_name",
      type: "text",
      question: "Qual o nome do seu clube? ⚽",
      icon: Star,
      color: "from-purple-500 to-pink-500",
      field: "club_name",
      condition: (resp) => resp.has_club === "sim"
    },
    {
      id: "had_game",
      type: "yesno",
      question: "Você jogou alguma partida oficial nesta semana? 🏆",
      icon: Target,
      color: "from-green-500 to-emerald-500",
      field: "had_game"
    },
    {
      id: "game_performance",
      type: "performance",
      question: "Me conta sobre a partida! ⚡",
      icon: Zap,
      color: "from-orange-500 to-red-500",
      field: "game_stats",
      condition: (resp) => resp.had_game === "sim"
    },
    {
      id: "training",
      type: "number",
      question: "Quantos treinos você fez esta semana? 💪",
      icon: Calendar,
      color: "from-yellow-500 to-orange-500",
      field: "training_sessions",
      placeholder: "Ex: 3"
    },
    {
      id: "training_quality",
      type: "rating",
      question: "Como você avalia a qualidade dos seus treinos? 🎯",
      icon: Star,
      color: "from-cyan-500 to-blue-500",
      field: "training_quality"
    },
    {
      id: "life_status",
      type: "textarea",
      question: "Como está sua vida no geral? Alimentação, sono, estudos? 📚",
      icon: MessageCircle,
      color: "from-indigo-500 to-purple-500",
      field: "life_status",
      placeholder: "Conte um pouco sobre sua rotina..."
    },
    {
      id: "has_videos",
      type: "yesno",
      question: "Você tem vídeos de jogos ou treinos para fazer upload? 🎥",
      icon: Upload,
      color: "from-pink-500 to-rose-500",
      field: "has_videos"
    },
    {
      id: "notes",
      type: "textarea",
      question: "Alguma observação adicional? Algo que queira compartilhar? 💭",
      icon: MessageCircle,
      color: "from-gray-500 to-slate-500",
      field: "notes",
      placeholder: "Opcional..."
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentStep, responses]);

  const handleResponse = (value) => {
    const currentQuestion = questions[currentStep];
    setResponses(prev => ({ ...prev, [currentQuestion.id]: value }));
    
    // Auto-avançar após pequeno delay
    setTimeout(() => {
      const nextStep = getNextStep(currentStep, { ...responses, [currentQuestion.id]: value });
      if (nextStep !== null) {
        setCurrentStep(nextStep);
      } else {
        handleSubmit({ ...responses, [currentQuestion.id]: value });
      }
    }, 500);
  };

  const getNextStep = (current, allResponses) => {
    for (let i = current + 1; i < questions.length; i++) {
      const question = questions[i];
      if (!question.condition || question.condition(allResponses)) {
        return i;
      }
    }
    return null;
  };

  const handleSubmit = async (finalResponses) => {
    setIsProcessing(true);
    
    try {
      // Processar respostas com IA para gerar feedback personalizado
      const prompt = `Você é um analista de futebol. Baseado nas seguintes informações do atleta, gere um feedback motivacional e construtivo (máximo 100 palavras):

Clube: ${finalResponses.has_club === 'sim' ? finalResponses.club_name || 'Sim' : 'Não está em clube'}
Jogou partida: ${finalResponses.had_game === 'sim' ? 'Sim' : 'Não'}
${finalResponses.game_performance ? `Performance: ${finalResponses.game_performance}` : ''}
Treinos na semana: ${finalResponses.training}
Qualidade dos treinos: ${finalResponses.training_quality}/5
Vida geral: ${finalResponses.life_status || 'Não informado'}
Tem vídeos: ${finalResponses.has_videos}
Observações: ${finalResponses.notes || 'Nenhuma'}

Gere um feedback personalizado, motivacional e com dicas práticas.`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: false
      });

      // Salvar assessment no banco
      const assessmentData = {
        user_id: userId,
        week_start_date: new Date().toISOString().split('T')[0],
        had_game: finalResponses.had_game === 'sim',
        goals: finalResponses.game_performance?.goals || 0,
        assists: finalResponses.game_performance?.assists || 0,
        minutes_played: finalResponses.game_performance?.minutes || 0,
        training_sessions: parseInt(finalResponses.training) || 0,
        self_rating: finalResponses.training_quality || 5,
        physical_condition: getPhysicalCondition(finalResponses.life_status),
        notes: `${finalResponses.life_status || ''}\n\nObservações: ${finalResponses.notes || 'Nenhuma'}`,
        admin_feedback: aiResponse,
        points_earned: 50
      };

      await base44.entities.WeeklyAssessment.create(assessmentData);

      // Atualizar pontos do usuário
      const currentUser = await base44.auth.me();
      await base44.auth.updateMe({
        total_points: (currentUser.total_points || 0) + 50,
        last_weekly_assessment: new Date().toISOString()
      });

      // Criar notificação para admin
      await base44.entities.AdminNotification.create({
        notification_type: "performance_pending",
        title: "Nova Assessoria Semanal",
        message: `${userName} completou a assessoria semanal`,
        related_id: userId,
        tab_name: "Assessoria"
      });

      // Se tem vídeos, mostrar prompt de upload
      if (finalResponses.has_videos === 'sim') {
        setShowUploadPrompt(true);
        toast.success("Assessoria concluída! +50 pontos", {
          description: "Não esqueça de fazer upload dos seus vídeos!"
        });
      } else {
        toast.success("Assessoria concluída! +50 pontos");
        setTimeout(() => {
          onComplete?.();
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast.error("Erro ao salvar assessoria");
    }
    
    setIsProcessing(false);
  };

  const getPhysicalCondition = (lifeStatus) => {
    if (!lifeStatus) return "regular";
    const lower = lifeStatus.toLowerCase();
    if (lower.includes("ótim") || lower.includes("excelen") || lower.includes("muito bem")) return "excelente";
    if (lower.includes("bom") || lower.includes("bem")) return "boa";
    if (lower.includes("ruim") || lower.includes("mal") || lower.includes("cansad")) return "ruim";
    return "regular";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-lg flex items-end md:items-center justify-center">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full md:max-w-md bg-[#0A0A0A] md:rounded-3xl rounded-t-3xl border-t md:border border-white/10 overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh]"
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#00E5FF]/10 via-[#0066FF]/10 to-transparent p-4 border-b border-white/10">
          <div className="absolute inset-0 opacity-5">
            <img 
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop" 
              alt="Campo"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00E5FF]/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#00E5FF]" />
              </div>
              <div>
                <h3 className="text-white font-black text-lg">Assessoria Semanal</h3>
                <p className="text-gray-400 text-xs">Responda com sinceridade</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="relative z-10 mt-4">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 100 }}
                className="h-full bg-gradient-to-r from-[#00E5FF] to-[#0066FF]"
              />
            </div>
            <p className="text-gray-400 text-xs mt-2">{currentStep + 1} de {questions.length}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {questions.slice(0, currentStep + 1).map((question, idx) => {
              if (question.condition && !question.condition(responses)) return null;
              
              const CurrentIcon = question.icon;
              const hasResponse = responses[question.id] !== undefined;

              return (
                <React.Fragment key={question.id}>
                  {/* Question */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-3"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${question.color} flex items-center justify-center flex-shrink-0`}>
                      <CurrentIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-3">
                      <p className="text-white text-sm">{question.question}</p>
                    </div>
                  </motion.div>

                  {/* Response */}
                  {hasResponse && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex gap-3 justify-end"
                    >
                      <div className="bg-[#00E5FF]/20 border border-[#00E5FF]/30 rounded-2xl rounded-tr-none p-3 max-w-[80%]">
                        <p className="text-white text-sm font-medium">
                          {formatResponse(question, responses[question.id])}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Input (só no step atual) */}
                  {idx === currentStep && !hasResponse && (
                    <QuestionInput
                      question={question}
                      onResponse={handleResponse}
                      isProcessing={isProcessing}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </AnimatePresence>

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 bg-gradient-to-r from-[#00E5FF]/20 to-[#0066FF]/20 border border-[#00E5FF]/30 rounded-2xl p-4"
            >
              <Loader2 className="w-5 h-5 text-[#00E5FF] animate-spin" />
              <div>
                <p className="text-white font-bold text-sm">Processando suas respostas...</p>
                <p className="text-gray-400 text-xs">Gerando feedback personalizado</p>
              </div>
            </motion.div>
          )}

          {showUploadPrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-4 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-white font-bold mb-2">Assessoria Concluída!</p>
              <p className="text-gray-300 text-sm mb-4">+50 pontos adicionados</p>
              <Button
                onClick={() => {
                  onClose();
                  // Trigger upload modal
                  window.dispatchEvent(new CustomEvent('openUploadModal'));
                }}
                className="w-full bg-[#00E5FF] hover:bg-[#00BFFF] text-black font-bold"
              >
                <Upload className="w-4 h-4 mr-2" />
                Fazer Upload de Vídeos
              </Button>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </motion.div>
    </div>
  );
}

function QuestionInput({ question, onResponse, isProcessing }) {
  const [value, setValue] = useState("");

  if (question.type === "yesno") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 justify-end"
      >
        <Button
          onClick={() => onResponse("sim")}
          disabled={isProcessing}
          className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-green-400"
        >
          <ThumbsUp className="w-4 h-4 mr-2" />
          Sim
        </Button>
        <Button
          onClick={() => onResponse("não")}
          disabled={isProcessing}
          className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400"
        >
          <ThumbsDown className="w-4 h-4 mr-2" />
          Não
        </Button>
      </motion.div>
    );
  }

  if (question.type === "rating") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 justify-end flex-wrap"
      >
        {[1, 2, 3, 4, 5].map(rating => (
          <Button
            key={rating}
            onClick={() => onResponse(rating)}
            disabled={isProcessing}
            className="bg-white/5 hover:bg-[#00E5FF]/20 border border-white/10 hover:border-[#00E5FF]/40 text-white"
          >
            {rating}
          </Button>
        ))}
      </motion.div>
    );
  }

  if (question.type === "performance") {
    return (
      <PerformanceInput onSubmit={onResponse} />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2"
    >
      {question.type === "textarea" ? (
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={question.placeholder}
          className="flex-1 bg-white/5 border-white/10 text-white rounded-xl resize-none"
          rows={3}
        />
      ) : (
        <Input
          type={question.type === "number" ? "number" : "text"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={question.placeholder}
          className="flex-1 bg-white/5 border-white/10 text-white rounded-xl"
        />
      )}
      <Button
        onClick={() => {
          if (value.trim() || question.type === "textarea") {
            onResponse(value.trim());
            setValue("");
          }
        }}
        disabled={isProcessing || (!value.trim() && question.type !== "textarea")}
        className="bg-[#00E5FF] hover:bg-[#00BFFF] text-black"
      >
        <Send className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

function PerformanceInput({ onSubmit }) {
  const [stats, setStats] = useState({ goals: "", assists: "", minutes: "" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2 w-full"
    >
      <div className="grid grid-cols-3 gap-2">
        <Input
          type="number"
          placeholder="Gols"
          value={stats.goals}
          onChange={(e) => setStats({ ...stats, goals: e.target.value })}
          className="bg-white/5 border-white/10 text-white rounded-xl text-center"
        />
        <Input
          type="number"
          placeholder="Assists"
          value={stats.assists}
          onChange={(e) => setStats({ ...stats, assists: e.target.value })}
          className="bg-white/5 border-white/10 text-white rounded-xl text-center"
        />
        <Input
          type="number"
          placeholder="Min"
          value={stats.minutes}
          onChange={(e) => setStats({ ...stats, minutes: e.target.value })}
          className="bg-white/5 border-white/10 text-white rounded-xl text-center"
        />
      </div>
      <Button
        onClick={() => onSubmit({
          goals: parseInt(stats.goals) || 0,
          assists: parseInt(stats.assists) || 0,
          minutes: parseInt(stats.minutes) || 0
        })}
        className="w-full bg-[#00E5FF] hover:bg-[#00BFFF] text-black font-bold"
      >
        Confirmar
      </Button>
    </motion.div>
  );
}

function formatResponse(question, response) {
  if (question.type === "yesno") return response;
  if (question.type === "rating") return `${response}/5 ⭐`;
  if (question.type === "number") return response;
  if (question.type === "performance") {
    return `${response.goals} gols, ${response.assists} assistências, ${response.minutes} min`;
  }
  return response || "Sem resposta";
}