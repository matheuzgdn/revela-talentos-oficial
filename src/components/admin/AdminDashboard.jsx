import React, { useState, useEffect } from 'react';
import { appClient } from '@/api/backendClient';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Globe, Target, ArrowUp, ArrowDown, Activity } from 'lucide-react';
import moment from 'moment';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    planoCarreira: 0,
    revelaTalentos: 0,
    growth: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [users, activities] = await Promise.all([
          appClient.entities.User.list(),
          appClient.entities.ActivityLog.list('-created_date', 20)
        ]);

        const totalUsers = users?.length || 0;
        const planoCarreira = (users || []).filter(u => u.has_plano_carreira_access).length;
        const revelaTalentos = (users || []).filter(u => u.has_revela_talentos_access && !u.has_plano_carreira_access).length;

        // Calcular crescimento (mock - em produção seria baseado em dados históricos)
        const growth = 12.5;

        setStats({ totalUsers, planoCarreira, revelaTalentos, growth });
        setRecentActivities(activities || []);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      }
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total de Atletas',
      value: stats.totalUsers,
      icon: Users,
      gradient: 'from-cyan-500 to-blue-600',
      description: 'Atletas na plataforma',
      trend: stats.growth > 0 ? 'up' : 'down',
      trendValue: Math.abs(stats.growth)
    },
    {
      title: 'Plano de Carreira',
      value: stats.planoCarreira,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-600',
      description: 'Premium members',
      trend: 'up',
      trendValue: 8.2
    },
    {
      title: 'Revela Talentos',
      value: stats.revelaTalentos,
      icon: Target,
      gradient: 'from-yellow-500 to-orange-600',
      description: 'Base members',
      trend: 'up',
      trendValue: 15.3
    },
    {
      title: 'Taxa de Conversão',
      value: stats.totalUsers > 0 ? ((stats.planoCarreira / stats.totalUsers) * 100).toFixed(1) + '%' : '0%',
      icon: Globe,
      gradient: 'from-purple-500 to-pink-600',
      description: 'Para premium',
      trend: 'up',
      trendValue: 3.1
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-8 border border-cyan-500/20"
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Dashboard EC10
          </h1>
          <p className="text-gray-400">Visão geral da plataforma em tempo real</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

            <div className="relative p-6">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>

              {/* Value */}
              <div className="mb-2">
                <h3 className="text-4xl font-black text-white mb-1">
                  {card.value}
                </h3>
                <p className="text-sm text-gray-500">{card.title}</p>
              </div>

              {/* Trend */}
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${card.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                  {card.trend === 'up' ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  <span className="text-xs font-bold">{card.trendValue}%</span>
                </div>
                <span className="text-xs text-gray-600">{card.description}</span>
              </div>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          </motion.div>
        ))}
      </div>

      {/* Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-black text-white">Atividade Recente</h2>
          </div>
          <span className="text-sm text-gray-500">{recentActivities.length} atividades</span>
        </div>

        {recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.slice(0, 10).map((activity, index) => {
              const colorMap = {
                account: 'cyan',
                profile: 'green',
                seletiva: 'yellow',
                upload: 'purple',
                content: 'blue',
                performance: 'orange',
                other: 'gray'
              };
              const color = colorMap[activity.action_type] || 'gray';

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full bg-${color}-500 flex-shrink-0`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{activity.user_name}</p>
                    <p className="text-sm text-gray-500 truncate">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-600 whitespace-nowrap">
                    {moment(activity.created_date).fromNow()}
                  </span>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma atividade registrada ainda</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
