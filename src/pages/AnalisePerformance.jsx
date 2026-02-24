import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { PerformanceData } from "@/entities/PerformanceData";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PerformanceChart from "../components/performance/PerformanceChart";
import PerformanceHistoryItem from "../components/performance/PerformanceHistoryItem";
import RegisterPerformanceForm from "../components/performance/RegisterPerformanceForm";
import {
  TrendingUp,
  Target,
  Trophy,
  ArrowLeft,
  Database,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AnalisePerformancePage() {
  const [user, setUser] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      if (currentUser) {
        const userPerformance = await PerformanceData.filter(
          { user_id: currentUser.id },
          "-game_date",
          50
        );
        setPerformanceData(userPerformance || []);
      } else {
        setPerformanceData([]);
      }
    } catch (error) {
      console.error("Error loading performance data:", error);
      setUser(null);
      setPerformanceData([]);
    }
    setIsLoading(false);
  };

  const completedAnalyses = performanceData.filter(d => d.status === 'completed' && d.game_date);
  
  const totalGames = completedAnalyses.length;
  const totalGoals = completedAnalyses.reduce((sum, game) => sum + (game.goals || 0), 0);
  const totalAssists = completedAnalyses.reduce((sum, game) => sum + (game.assists || 0), 0);
  const averageRating = totalGames > 0
    ? (completedAnalyses.reduce((sum, game) => sum + (game.rating || 0), 0) / totalGames).toFixed(1)
    : "0.0";

  const stats = [
    { label: "Jogos Analisados", value: totalGames, icon: Trophy, color: "text-blue-400" },
    { label: "Gols Marcados", value: totalGoals, icon: Target, color: "text-green-400" },
    { label: "Assistências", value: totalAssists, icon: TrendingUp, color: "text-yellow-400" },
    { label: "Nota Média", value: `${averageRating}/10`, icon: Star, color: "text-purple-400" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-400 font-medium">Carregando sua Análise...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Acesso Necessário</h2>
          <p className="text-gray-400 mb-6">
            Faça login para acessar sua Análise de Performance.
          </p>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-500">
             <Link to={createPageUrl("Hub")}>Voltar ao Hub</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
             <Button asChild variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Link to={createPageUrl("PlanoCarreira")}>
                  <ArrowLeft className="w-6 h-6" />
                </Link>
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Análise de Performance</h1>
              <p className="text-gray-400">Seu diário de futebol: registre suas partidas e receba feedbacks.</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-bold px-4 py-2 hidden md:flex">
            {completedAnalyses.length} Análises Concluídas
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <RegisterPerformanceForm user={user} onNewData={loadData} />
        </motion.div>

        {completedAnalyses.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">{stat.label}</p>
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-black border border-blue-400/30">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-3">
                     <TrendingUp className="w-6 h-6" />
                     Evolução da Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PerformanceChart data={[...completedAnalyses].reverse()} />
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : (
          performanceData.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center py-16"
            >
              <Card className="bg-black border border-blue-400/30 max-w-2xl mx-auto">
                <CardContent className="p-12">
                  <Database className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">Seu Diário de Futebol Começa Aqui</h3>
                  <p className="text-gray-400 mb-8">
                    Use o formulário acima para registrar sua primeira partida. Envie o vídeo,
                    suas impressões e aguarde o feedback dos nossos especialistas.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        )}

        {performanceData.length > 0 && (
           <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">Histórico de Partidas</h2>
              <div className="space-y-4">
                {performanceData.map((game) => (
                  <PerformanceHistoryItem key={game.id} game={game} />
                ))}
              </div>
            </motion.div>
        )}
      </div>
    </div>
  );
}