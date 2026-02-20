import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Zap, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TasksPanel({ tasks }) {
  const pendingTasks = tasks?.filter(t => t.status === "pending") || [];
  const completedTasks = tasks?.filter(t => t.status === "completed") || [];

  const priorityColors = {
    low: "bg-blue-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    urgent: "bg-red-500"
  };

  const typeIcons = {
    training: "💪",
    video_analysis: "🎥",
    mentorship: "🎓",
    physical: "🏃",
    tactical: "⚽",
    personal: "🎯"
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-[#111111] border border-[#222] rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-[#00E5FF]" />
          <h3 className="text-white text-lg font-black uppercase tracking-tight">Tarefas</h3>
        </div>
        <p className="text-[#666] text-sm">Nenhuma tarefa pendente</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111111] border border-[#222] rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-[#00E5FF]" />
          <h3 className="text-white text-lg font-black uppercase tracking-tight">Tarefas</h3>
        </div>
        <Badge className="bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40">
          {pendingTasks.length} pendentes
        </Badge>
      </div>

      <div className="space-y-3">
        {pendingTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#1a1a1a]/50 border border-[#333] rounded-2xl p-4 hover:border-[#00E5FF]/30 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#222] rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">{typeIcons[task.task_type] || "📋"}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-white font-bold text-sm line-clamp-2">{task.task_title}</h4>
                  <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]} flex-shrink-0 mt-1.5`} />
                </div>
                
                {task.task_description && (
                  <p className="text-[#666] text-xs line-clamp-2 mb-3">{task.task_description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  {task.due_date && (
                    <div className="flex items-center gap-1 text-[#666] text-xs">
                      <Clock className="w-3 h-3" />
                      {new Date(task.due_date).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  {task.points_reward && (
                    <div className="flex items-center gap-1 text-[#00E5FF] text-xs font-bold">
                      <Zap className="w-3 h-3" />
                      +{task.points_reward}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {completedTasks.length > 0 && (
          <div className="pt-4 mt-4 border-t border-[#333]">
            <p className="text-[#666] text-xs font-bold mb-3 uppercase tracking-wider">Concluídas</p>
            {completedTasks.slice(0, 3).map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 py-2 opacity-50"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-white text-sm line-clamp-1">{task.task_title}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}