import { appClient } from '@/api/backendClient';
import React, { useState, useEffect } from 'react';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Trophy, Clock, CheckCircle, AlertCircle, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function RevelaDashboard() {
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
    totalContents: 0,
    publishedContents: 0,
    liveEvents: 0,
    featuredContents: 0,
  });
  const [submissionsByDay, setSubmissionsByDay] = useState([]);
  const [submissionsByStatus, setSubmissionsByStatus] = useState([]);
  const [contentsByCategory, setContentsByCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [submissions, contents] = await Promise.all([
        appClient.entities.Seletiva.list('-created_date').catch(() => []),
        appClient.entities.Content.list('-created_date').catch(() => [])
      ]);

      // Calcular estatÃ­sticas de submissÃµes
      const totalSubmissions = submissions?.length || 0;
      const pendingReview = submissions?.filter(s => s.status === 'pending_review').length || 0;
      const approved = submissions?.filter(s => s.status === 'approved').length || 0;
      const rejected = submissions?.filter(s => s.status === 'rejected').length || 0;

      // Calcular estatÃ­sticas de conteÃºdo
      const totalContents = contents?.length || 0;
      const publishedContents = contents?.filter(c => c.is_published).length || 0;
      const liveEvents = contents?.filter(c => c.category === 'live' && c.status === 'live').length || 0;
      const featuredContents = contents?.filter(c => c.is_featured).length || 0;

      setStats({
        totalSubmissions,
        pendingReview,
        approved,
        rejected,
        totalContents,
        publishedContents,
        liveEvents,
        featuredContents,
      });

      // Preparar dados para grÃ¡fico de submissÃµes por dia (Ãºltimos 7 dias)
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStr = date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
        const count = submissions?.filter(s => {
          const subDate = new Date(s.created_date);
          return subDate.toDateString() === date.toDateString();
        }).length || 0;
        last7Days.push({ day: dayStr, inscricoes: count });
      }
      setSubmissionsByDay(last7Days);

      // Dados para grÃ¡fico de pizza de status
      const statusData = [
        { name: 'Aguardando', value: pendingReview, color: '#eab308' },
        { name: 'Aprovados', value: approved, color: '#22c55e' },
        { name: 'Rejeitados', value: rejected, color: '#ef4444' },
        { name: 'Em AnÃ¡lise', value: submissions?.filter(s => s.status === 'under_review').length || 0, color: '#3b82f6' },
      ];
      setSubmissionsByStatus(statusData);

      // Dados para grÃ¡fico de conteÃºdos por categoria
      const categories = ['mentoria', 'treino_tatico', 'preparacao_fisica', 'psicologia', 'nutricao', 'live'];
      const categoryData = categories.map(cat => ({
        name: cat.replace('_', ' ').charAt(0).toUpperCase() + cat.slice(1).replace('_', ' '),
        quantidade: contents?.filter(c => c.category === cat).length || 0
      }));
      setContentsByCategory(categoryData);

    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de MÃ©tricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de InscriÃ§Ãµes</CardTitle>
            <Trophy className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalSubmissions}</div>
            <p className="text-xs text-white/80 mt-1">Atletas na seletiva</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando AnÃ¡lise</CardTitle>
            <Clock className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingReview}</div>
            <p className="text-xs text-white/80 mt-1">Precisam de revisÃ£o</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ConteÃºdos Publicados</CardTitle>
            <Video className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.publishedContents}</div>
            <p className="text-xs text-white/80 mt-1">De {stats.totalContents} total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-pink-500 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lives Ativas</CardTitle>
            <Star className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.liveEvents}</div>
            <p className="text-xs text-white/80 mt-1">TransmissÃµes ao vivo</p>
          </CardContent>
        </Card>
      </div>

      {/* GrÃ¡ficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GrÃ¡fico de InscriÃ§Ãµes por Dia */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">InscriÃ§Ãµes nos Ãšltimos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={submissionsByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Line type="monotone" dataKey="inscricoes" stroke="#eab308" strokeWidth={3} dot={{ fill: '#eab308', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* GrÃ¡fico de Pizza - Status das InscriÃ§Ãµes */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Status das InscriÃ§Ãµes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={submissionsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {submissionsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* GrÃ¡fico de Barras - ConteÃºdos por Categoria */}
        <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">ConteÃºdos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contentsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    cursor={{ fill: '#374151' }}
                  />
                  <Bar dataKey="quantidade" fill="#22c55e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards de MÃ©tricas SecundÃ¡rias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Taxa de AprovaÃ§Ã£o</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalSubmissions > 0 
                ? ((stats.approved / stats.totalSubmissions) * 100).toFixed(1) 
                : 0}%
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {stats.approved} de {stats.totalSubmissions} aprovados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">ConteÃºdos em Destaque</CardTitle>
            <Star className="h-5 w-5 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.featuredContents}</div>
            <p className="text-xs text-gray-400 mt-1">ConteÃºdos destacados</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">PendÃªncias</CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pendingReview}</div>
            <p className="text-xs text-gray-400 mt-1">InscriÃ§Ãµes para revisar</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

