import React, { useState } from "react";
import { appClient } from "@/api/backendClient";
import { motion } from "framer-motion";
import { X, Heart, Droplet, Moon, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function DailyCheckinModal({ isOpen, onClose, userId, onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mood: "",
    energy_level: 3,
    sleep_hours: 8,
    hydration_liters: 2,
    trained_today: false,
    notes: ""
  });

  const moods = [
    { id: "excelente", label: "Excelente", emoji: ":D", color: "from-green-500 to-emerald-500" },
    { id: "bom", label: "Bom", emoji: ":)", color: "from-blue-500 to-cyan-500" },
    { id: "neutro", label: "Neutro", emoji: ":|", color: "from-gray-500 to-slate-500" },
    { id: "cansado", label: "Cansado", emoji: ":/", color: "from-orange-500 to-amber-500" },
    { id: "desmotivado", label: "Desmotivado", emoji: ":(", color: "from-red-500 to-rose-500" }
  ];

  const handleSubmit = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if already checked in today
      const existing = await appClient.entities.DailyCheckin.filter({
        user_id: userId,
        checkin_date: today
      });

      if (existing.length > 0) {
        toast.error("Você já fez o check-in hoje!");
        onClose();
        return;
      }

      // Calculate streak
      const allCheckins = await appClient.entities.DailyCheckin.filter({ user_id: userId }, '-checkin_date', 30);
      const streakDays = calculateStreak(allCheckins);

      await appClient.entities.DailyCheckin.create({
        user_id: userId,
        checkin_date: today,
        ...formData,
        streak_days: streakDays + 1
      });

      // Update user points
      const currentUser = await appClient.auth.me();
      await appClient.auth.updateMe({
        total_points: (currentUser.total_points || 0) + 10
      });

      setStep(3);
      setTimeout(() => {
        onComplete();
        onClose();
      }, 2000);
    } catch (error) {
      toast.error("Erro ao fazer check-in");
    }
  };

  const calculateStreak = (checkins) => {
    if (checkins.length === 0) return 0;
    const sorted = checkins.sort((a, b) => new Date(b.checkin_date) - new Date(a.checkin_date));
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sorted.length; i++) {
      const checkinDate = new Date(sorted[i].checkin_date);
      const daysDiff = Math.floor((today - checkinDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-[#0F1419] rounded-[24px] border border-[#00E5FF]/20 overflow-hidden"
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-[#00E5FF]/10 to-[#0066FF]/10">
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
            <X className="w-5 h-5 text-white" />
          </button>
          <h3 className="text-2xl font-black text-white">Check-in Diário</h3>
          <p className="text-gray-400 text-sm mt-1">+10 pontos</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <Label className="text-white text-sm mb-3 block">Como você está se sentindo?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setFormData({ ...formData, mood: mood.id })}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        formData.mood === mood.id
                          ? `bg-gradient-to-br ${mood.color} border-white shadow-lg scale-105`
                          : 'bg-[#1a1a1a] border-[#333] hover:border-[#00E5FF]/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{mood.emoji}</div>
                      <p className={`text-xs font-bold ${formData.mood === mood.id ? 'text-white' : 'text-gray-400'}`}>
                        {mood.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!formData.mood}
                className="w-full bg-[#00E5FF] hover:bg-[#00BFFF] text-black font-bold py-6"
              >
                Continuar
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400 text-xs flex items-center gap-2 mb-2">
                    <Moon className="w-4 h-4" /> Horas de Sono
                  </Label>
                  <Input
                    type="number"
                    value={formData.sleep_hours}
                    onChange={(e) => setFormData({ ...formData, sleep_hours: parseFloat(e.target.value) })}
                    className="bg-[#1a1a1a] border-[#333] text-white"
                  />
                </div>

                <div>
                  <Label className="text-gray-400 text-xs flex items-center gap-2 mb-2">
                    <Droplet className="w-4 h-4" /> Litros de Água
                  </Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.hydration_liters}
                    onChange={(e) => setFormData({ ...formData, hydration_liters: parseFloat(e.target.value) })}
                    className="bg-[#1a1a1a] border-[#333] text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-400 text-xs flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4" /> Nível de Energia (1-5)
                </Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFormData({ ...formData, energy_level: level })}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                        formData.energy_level >= level
                          ? 'bg-[#00E5FF] text-black'
                          : 'bg-[#1a1a1a] text-gray-600 border border-[#333]'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => setFormData({ ...formData, trained_today: !formData.trained_today })}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    formData.trained_today
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-[#1a1a1a] border-[#333] text-gray-400'
                  }`}
                >
                  <Heart className="w-5 h-5 mx-auto mb-2" />
                  <p className="text-sm font-bold">Treinou Hoje?</p>
                </button>
              </div>

              <div>
                <Label className="text-gray-400 text-xs mb-2 block">Observações (opcional)</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Como foi seu dia?"
                  className="bg-[#1a1a1a] border-[#333] text-white min-h-[80px]"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-[#00E5FF] hover:bg-[#00BFFF] text-black font-bold"
                >
                  Finalizar Check-in
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
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Check-in Completo!</h3>
              <p className="text-gray-400">+10 pontos adicionados</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
