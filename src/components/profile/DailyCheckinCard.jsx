import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function DailyCheckinCard({ user, checkins, onSuccess }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    had_training: false,
    training_intensity: "moderate",
    energy_level: 7,
    mood: "good"
  });

  const canCheckinToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return !checkins.some(c => c.checkin_date === today);
  };

  const handleSubmit = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await base44.entities.DailyCheckin.create({
        user_id: user.id,
        checkin_date: today,
        ...formData,
        points_earned: 10
      });

      await base44.auth.updateMe({
        total_points: (user.total_points || 0) + 10
      });

      toast.success("Check-in realizado! +10 pontos", {
        icon: "⚡",
        duration: 3000
      });

      setIsExpanded(false);
      onSuccess?.();
    } catch (error) {
      console.error("Check-in error:", error);
    }
  };

  const canCheckin = canCheckinToday();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      whileHover={{ scale: 0.98 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-[24px] p-5 shadow-2xl border border-white/10"
      style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
          Daily Check-In
        </h2>
        
        {canCheckin ? (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">
            AVAILABLE
          </span>
        ) : (
          <span className="px-3 py-1 bg-gray-700/50 text-gray-400 rounded-full text-xs font-bold">
            COMPLETED
          </span>
        )}
      </div>

      {canCheckin && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-black text-white text-sm uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20"
        >
          <Zap className="inline-block w-5 h-5 mr-2" />
          Start Check-in (+10 pts)
        </button>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {/* TrainedToggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 font-medium">Trained today?</span>
              <button
                onClick={() => setFormData({ ...formData, had_training: !formData.had_training })}
                className={`w-14 h-8 rounded-full transition-all ${
                  formData.had_training ? "bg-cyan-500" : "bg-gray-700"
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                  formData.had_training ? "translate-x-7" : "translate-x-1"
                } mt-1`} />
              </button>
            </div>

            {/* IntensitySlider */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Training Intensity</label>
              <select
                value={formData.training_intensity}
                onChange={(e) => setFormData({ ...formData, training_intensity: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              >
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="intense">Intense</option>
                <option value="very_intense">Very Intense</option>
              </select>
            </div>

            {/* EnergySlider */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Energy Level: {formData.energy_level}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.energy_level}
                onChange={(e) => setFormData({ ...formData, energy_level: parseInt(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-black text-white text-sm uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20"
            >
              <CheckCircle2 className="inline-block w-5 h-5 mr-2" />
              Submit Check-in
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!canCheckin && (
        <div className="flex items-center gap-3 py-3">
          <CheckCircle2 className="w-8 h-8 text-green-400" />
          <div>
            <p className="text-sm text-white font-bold">Today's check-in completed!</p>
            <p className="text-xs text-gray-400">Come back tomorrow for +10 points</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}