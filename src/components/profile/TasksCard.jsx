import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TasksCard({ tasks }) {
  const pendingTasks = tasks?.filter(t => t.status === "pending") || [];

  if (pendingTasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-[24px] p-5 shadow-2xl border border-white/10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
      >
        <h2 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-4">
          Tarefas e Treinos
        </h2>
        <p className="text-sm text-gray-500 text-center py-4">Nenhuma tarefa pendente</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      whileHover={{ scale: 0.98 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-[24px] p-5 shadow-2xl border border-white/10"
      style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
          Tarefas e Treinos
        </h2>
        <Badge className="bg-cyan-500/20 text-cyan-400 border-0">
          {pendingTasks.length} pendentes
        </Badge>
      </div>

      <div className="space-y-3">
        {pendingTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.05 }}
            className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 hover:border-cyan-400/50 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-700/50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Circle className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm mb-1">{task.task_title}</h3>
                {task.task_description && (
                  <p className="text-gray-400 text-xs mb-2 line-clamp-2">{task.task_description}</p>
                )}
                
                <div className="flex items-center gap-2">
                  {task.priority === "high" && (
                    <Badge className="bg-red-500/20 text-red-400 border-0 text-[10px]">HIGH</Badge>
                  )}
                  {task.points_reward && (
                    <span className="text-cyan-400 text-xs font-bold">+{task.points_reward} pts</span>
                  )}
                </div>
              </div>

              <button className="w-10 h-10 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-full flex items-center justify-center transition-colors flex-shrink-0">
                <Upload className="w-5 h-5 text-cyan-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}