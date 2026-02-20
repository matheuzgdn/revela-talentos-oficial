import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Smile, Meh, Frown, Battery, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import confetti from "canvas-confetti";

export default function DailyCheckinModal({ isOpen, onClose, user }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mood: "",
    energy_level: 5,
    sleep_quality: "",
    had_training: false,
    training_intensity: "",
    hydration: false,
    nutrition: false,
    watched_mentorship: false,
    notes: ""
  });

  const moods = [
    { value: "excellent", label: "Excelente", icon: "😁", color: "from-green-500 to-emerald-500" },
    { value: "good", label: "Bem", icon: "😊", color: "from-blue-500 to-cyan-500" },
    { value: "neutral", label: "Normal", icon: "😐", color: "from-gray-500 to-slate-500" },
    { value: "tired", label: "Cansado", icon: "😴", color: "from-yellow-500 to-orange-500" },
    { value: "bad", label: "Mal", icon: "😞", color: "from-red-500 to-rose-500" }
  ];

  const handleSubmit = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await base44.entities.DailyCheckin.create({
        user_id: user.id,
        checkin_date: today,
        ...formData,
        points_earned: 10
      });

      // Update user points
      await base44.auth.updateMe({
        total_points: (user.total_points || 0) + 10
      });

      // Confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setStep(3);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Erro ao fazer check-in:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md bg-[#111111] border border-[#222] rounded-3xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#222]">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Check-in Diário
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-[#222] transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 1 && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <label className="text-white text-sm font-bold mb-3 block">Como você está se sentindo hoje?</label>
                  <div className="grid grid-cols-5 gap-2">
                    {moods.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => setFormData({ ...formData, mood: mood.value })}
                        className={`aspect-square rounded-2xl border-2 transition-all ${
                          formData.mood === mood.value
                            ? `border-white bg-gradient-to-br ${mood.color}`
                            : "border-[#333] bg-[#1a1a1a] hover:border-[#666]"
                        } flex flex-col items-center justify-center p-2`}
                      >
                        <span className="text-2xl mb-1">{mood.icon}</span>
                        <span className="text-[10px] text-white font-bold">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white text-sm font-bold mb-3 block flex items-center gap-2">
                    <Battery className="w-4 h-4" />
                    Nível de Energia: {formData.energy_level}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.energy_level}
                    onChange={(e) => setFormData({ ...formData, energy_level: parseInt(e.target.value) })}
                    className="w-full h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
                  />
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.mood}
                  className="w-full py-6 bg-[#00E5FF] hover:bg-[#00BFFF] text-black font-black text-lg rounded-2xl"
                >
                  Continuar
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-4"
              >
                <CheckboxCard
                  label="Treino Hoje"
                  checked={formData.had_training}
                  onChange={(checked) => setFormData({ ...formData, had_training: checked })}
                />
                <CheckboxCard
                  label="Hidratação OK"
                  checked={formData.hydration}
                  onChange={(checked) => setFormData({ ...formData, hydration: checked })}
                />
                <CheckboxCard
                  label="Alimentação Saudável"
                  checked={formData.nutrition}
                  onChange={(checked) => setFormData({ ...formData, nutrition: checked })}
                />
                <CheckboxCard
                  label="Assistiu Mentoria"
                  checked={formData.watched_mentorship}
                  onChange={(checked) => setFormData({ ...formData, watched_mentorship: checked })}
                />

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 py-6 rounded-2xl border-[#333]"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 py-6 bg-[#00E5FF] hover:bg-[#00BFFF] text-black font-black rounded-2xl"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Finalizar
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6"
                >
                  <Award className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-2xl font-black text-white mb-2">+10 Pontos!</h3>
                <p className="text-[#666]">Check-in realizado com sucesso</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function CheckboxCard({ label, checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
        checked
          ? "border-[#00E5FF] bg-[#00E5FF]/10"
          : "border-[#333] bg-[#1a1a1a] hover:border-[#666]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-white font-bold">{label}</span>
        <div className={`w-6 h-6 rounded-full border-2 transition-all ${
          checked ? "bg-[#00E5FF] border-[#00E5FF]" : "border-[#666]"
        }`}>
          {checked && <span className="text-black text-sm flex items-center justify-center">✓</span>}
        </div>
      </div>
    </button>
  );
}