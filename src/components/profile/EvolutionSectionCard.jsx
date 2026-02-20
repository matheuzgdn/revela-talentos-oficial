import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function EvolutionSectionCard({ performanceData, checkins }) {
  // Prepare data for charts
  const last5Games = performanceData.slice(0, 5).reverse().map((game, index) => ({
    name: `G${index + 1}`,
    rating: game.rating || 0,
    goals: game.goals || 0
  }));

  const monthlyData = [
    { month: "Jan", performance: 75 },
    { month: "Feb", performance: 78 },
    { month: "Mar", performance: 82 },
    { month: "Apr", performance: 85 },
    { month: "May", performance: 88 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      whileHover={{ scale: 0.98 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-[24px] p-5 shadow-2xl border border-white/10"
      style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
    >
      <h2 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-5">
        Evolução de Performance
      </h2>

      {/* MonthlyLineChart */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-3 font-medium">Progresso Mensal</p>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={monthlyData}>
            <XAxis 
              dataKey="month" 
              stroke="#6b7280" 
              style={{ fontSize: '10px' }}
            />
            <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Line
              type="monotone"
              dataKey="performance"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ fill: '#06b6d4', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Last5MatchesBarChart */}
      {last5Games.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-3 font-medium">Últimas 5 Partidas</p>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={last5Games}>
              <XAxis 
                dataKey="name" 
                stroke="#6b7280" 
                style={{ fontSize: '10px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="rating" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Mini progress indicators */}
      <div className="grid grid-cols-2 gap-3">
        <MiniProgressCard label="Físico" value={85} color="from-green-500 to-emerald-500" />
        <MiniProgressCard label="Técnico" value={78} color="from-cyan-500 to-blue-500" />
      </div>
    </motion.div>
  );
}

function MiniProgressCard({ label, value, color }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
      <p className="text-xs text-gray-400 mb-2 font-medium uppercase">{label}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-full bg-gradient-to-r ${color}`}
          />
        </div>
        <span className="text-sm font-bold text-white">{value}%</span>
      </div>
    </div>
  );
}