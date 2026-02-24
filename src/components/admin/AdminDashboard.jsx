import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { Lead } from '@/entities/Lead';
import { InternationalLead } from '@/entities/InternationalLead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Globe, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    newLeads: 0,
    internationalLeads: 0,
    planoCarreira: 0,
  });
  const [leadsByStatus, setLeadsByStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [users, leads, intlLeads] = await Promise.all([
          User.list(),
          Lead.list(),
          InternationalLead.list()
        ]);

        const totalUsers = users?.length || 0;
        const allLeads = [...(leads || []), ...(intlLeads || [])];
        
        const newLeads = allLeads.filter(l => l.status === 'novo').length;
        const internationalLeads = intlLeads?.length || 0;
        const planoCarreira = (users || []).filter(u => u.has_plano_carreira_access).length;
        
        setStats({ totalUsers, newLeads, internationalLeads, planoCarreira });

        // Process data for chart
        const statusCounts = allLeads.reduce((acc, lead) => {
          const status = lead.status || 'novo';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        
        const chartData = [
            { name: 'Novos', leads: statusCounts['novo'] || 0 },
            { name: 'Contatados', leads: statusCounts['contatado'] || 0 },
            { name: 'Qualificados', leads: statusCounts['qualificado'] || 0 },
            { name: 'Proposta', leads: statusCounts['proposta_enviada'] || 0 },
            { name: 'Fechados', leads: statusCounts['fechado'] || 0 },
            { name: 'Perdidos', leads: statusCounts['perdido'] || 0 },
        ];
        setLeadsByStatus(chartData);

      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      }
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Atletas</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-gray-400">Atletas cadastrados na plataforma</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Leads (Total)</CardTitle>
            <UserPlus className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newLeads}</div>
            <p className="text-xs text-gray-400">Aguardando primeiro contato</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads (Internacional)</CardTitle>
            <Globe className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.internationalLeads}</div>
            <p className="text-xs text-gray-400">Atletas buscando oportunidades fora</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atletas Plano de Carreira</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.planoCarreira}</div>
            <p className="text-xs text-gray-400">Com acesso ao serviço premium</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Visão Geral do Funil de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="name" stroke="#9CA3B0" />
                <YAxis stroke="#9CA3B0" />
                <Tooltip 
                  cursor={{fill: '#374151'}}
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }}
                />
                <Legend />
                <Bar dataKey="leads" fill="#38BDF8" name="Nº de Leads" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}