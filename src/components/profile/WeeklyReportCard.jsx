import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Send } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function WeeklyReportCard({ user, assessments, onSuccess }) {
  const [formData, setFormData] = useState({
    games_played: 0,
    goals_scored: 0,
    assists: 0,
    minutes_played: 0,
    highlights: ""
  });

  const handleSubmit = async () => {
    try {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      
      await base44.entities.WeeklyAssessment.create({
        user_id: user.id,
        week_start_date: weekStart.toISOString().split('T')[0],
        ...formData
      });

      await base44.auth.updateMe({
        total_points: (user.total_points || 0) + 50
      });

      toast.success("Weekly report submitted! +50 points", {
        icon: "🎯",
        duration: 3000
      });

      setFormData({ games_played: 0, goals_scored: 0, assists: 0, minutes_played: 0, highlights: "" });
      onSuccess?.();
    } catch (error) {
      console.error("Weekly report error:", error);
    }
  };

  const lastAssessment = assessments[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      whileHover={{ scale: 0.98 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-[24px] p-5 shadow-2xl border border-white/10"
      style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
          Weekly Report
        </h2>
      </div>

      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block uppercase">Games</label>
            <Input
              type="number"
              value={formData.games_played}
              onChange={(e) => setFormData({ ...formData, games_played: parseInt(e.target.value) || 0 })}
              className="bg-gray-800 border-gray-700 text-white rounded-xl"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block uppercase">Goals</label>
            <Input
              type="number"
              value={formData.goals_scored}
              onChange={(e) => setFormData({ ...formData, goals_scored: parseInt(e.target.value) || 0 })}
              className="bg-gray-800 border-gray-700 text-white rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block uppercase">Assists</label>
            <Input
              type="number"
              value={formData.assists}
              onChange={(e) => setFormData({ ...formData, assists: parseInt(e.target.value) || 0 })}
              className="bg-gray-800 border-gray-700 text-white rounded-xl"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block uppercase">Minutes</label>
            <Input
              type="number"
              value={formData.minutes_played}
              onChange={(e) => setFormData({ ...formData, minutes_played: parseInt(e.target.value) || 0 })}
              className="bg-gray-800 border-gray-700 text-white rounded-xl"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block uppercase">Highlights</label>
          <Textarea
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
            placeholder="What went well this week?"
            className="bg-gray-800 border-gray-700 text-white rounded-xl min-h-[80px]"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl font-black text-white text-sm uppercase tracking-wider transition-all shadow-lg shadow-purple-500/20"
      >
        <Send className="inline-block w-5 h-5 mr-2" />
        Submit Report (+50 pts)
      </button>

      {lastAssessment?.admin_feedback && (
        <div className="mt-4 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-xl p-4">
          <p className="text-xs text-cyan-400 font-bold mb-2 uppercase">Admin Feedback</p>
          <p className="text-sm text-white">{lastAssessment.admin_feedback}</p>
        </div>
      )}
    </motion.div>
  );
}