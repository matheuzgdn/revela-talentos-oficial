
import React, { useState, useEffect, useCallback } from 'react';
import { CRMPipeline } from '@/entities/CRMPipeline';
import { CRMLead } from '@/entities/CRMLead';
import { Lead } from '@/entities/Lead';
import { InternationalLead } from '@/entities/InternationalLead';
import { CustomTask } from '@/entities/CustomTask'; // Added CustomTask import
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import IndividualCRMDashboard from './crm/IndividualCRMDashboard'; // Novo componente
import { CheckCircle, BarChart3, Users, DollarSign, Target, Loader2,
  Building2, Trophy, Plane, TrendingUp, Star, UserPlus
} from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import _ from 'lodash';

// Vendedores da EC10
const SALES_REPS = [
  { id: 'igor', name: 'Igor', color: 'bg-blue-500', initials: 'IG' },
  { id: 'pablo', name: 'Pablo', color: 'bg-green-500', initials: 'PB' },
  { id: 'eric', name: 'Eric', color: 'bg-purple-500', initials: 'ER' },
  { id: 'lucas', name: 'Lucas', color: 'bg-orange-500', initials: 'LC' }
];

// Serviços da EC10
const EC10_SERVICES = [
  {
    id: 'plano_carreira',
    name: 'Plano de Carreira EC10',
    description: 'Captação e acompanhamento de atletas',
    icon: TrendingUp,
    color: 'bg-green-500'
  },
  {
    id: 'revela_talentos', 
    name: 'Plataforma Revela Talentos',
    description: 'Cadastro e exposição de jogadores',
    icon: Star,
    color: 'bg-yellow-500'
  },
  {
    id: 'campeonatos',
    name: 'Campeonatos & Eventos',
    description: 'Libertacademy, Sudacademy, Talentos Cup, Eurocamp',
    icon: Trophy,
    color: 'bg-red-500'  
  },
  {
    id: 'intercambios',
    name: 'Intercâmbios Internacionais',
    description: 'Experiências de treinamento na Europa',
    icon: Plane,
    color: 'bg-blue-500'
  },
  {
    id: 'gestao_atletas',
    name: 'Gestão Individual de Atletas',
    description: 'Dados completos, vídeos e estatísticas',
    icon: Users,
    color: 'bg-purple-500'
  },
  {
    id: 'gestao_clubes',
    name: 'Gestão de Clubes e Parceiros',
    description: 'Propostas, contratos e relacionamento',
    icon: Building2,
    color: 'bg-cyan-500'
  }
];

// Dashboard Principal do CRM
const CRMMainDashboard = ({ onSelectRep, allLeads, allPipelines, generalLeads, intlLeads, allTasks }) => {
  const getStatsForRep = (repId) => {
    const repLeads = allLeads.filter(lead => lead.sales_rep_id === repId);
    const activeLeads = repLeads.filter(lead => !['won', 'lost'].includes(lead.current_stage));
    const wonLeads = repLeads.filter(lead => lead.current_stage === 'won');
    const totalValue = wonLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    
    return {
      activeLeads: activeLeads.length,
      wonLeads: wonLeads.length,
      totalValue,
      conversionRate: repLeads.length > 0 ? (wonLeads.length / repLeads.length * 100).toFixed(1) : 0
    };
  };

  const unassignedLeads = [...generalLeads, ...intlLeads].filter(
    l => !allLeads.find(cl => cl.email === l.email)
  );

  const closedLeads = allLeads.filter(l => l.current_stage === 'Fechado');

  const activityData = _.chain(allTasks)
    .groupBy(t => format(new Date(t.created_date), 'yyyy-MM-dd'))
    .map((value, key) => ({ date: format(new Date(key), 'dd/MM'), count: value.length }))
    .orderBy('date', 'asc')
    .slice(-30) // Last 30 days
    .value();
    
  const closingsData = _.chain(closedLeads)
    .groupBy(l => format(new Date(l.updated_date), 'yyyy-MM-dd'))
    .map((value, key) => ({ date: format(new Date(key), 'dd/MM'), count: value.length }))
    .orderBy('date', 'asc')
    .slice(-30)
    .value();

  const vendorLeaderboard = _.chain(closedLeads)
    .groupBy('sales_rep_id')
    .map((leads, repId) => {
      const rep = SALES_REPS.find(r => r.id === repId);
      return {
        name: rep ? rep.name : 'N/A',
        deals: leads.length,
        revenue: _.sumBy(leads, 'value')
      };
    })
    .orderBy('revenue', 'desc')
    .value();


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          CRM Central <span className="text-blue-400">EC10 Talentos</span>
        </h1>
        <p className="text-gray-400">
          Plataforma completa de gestão comercial integrada
        </p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-900/20 border-blue-800">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{allLeads.length}</p>
            <p className="text-xs text-blue-300">Total de Leads no CRM</p>
          </CardContent>
        </Card>
        <Card className="bg-green-900/20 border-green-800">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {allLeads.filter(l => l.current_stage === 'Fechado').length}
            </p>
            <p className="text-xs text-green-300">Vendas Fechadas</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-900/20 border-purple-800">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {allPipelines.length}
            </p>
            <p className="text-xs text-purple-300">Pipelines Ativos</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-900/20 border-yellow-800">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              R$ {allLeads.filter(l => l.current_stage === 'Fechado').reduce((sum, l) => sum + (l.value || 0), 0).toLocaleString()}
            </p>
            <p className="text-xs text-yellow-300">Faturamento Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos do Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gray-800/70 border-gray-700 text-white">
            <CardHeader>
                <CardTitle>Atividades por Dia (Últimos 30 dias)</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                        <XAxis dataKey="date" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}/>
                        <Bar dataKey="count" fill="#38bdf8" name="Atividades" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="bg-gray-800/70 border-gray-700 text-white">
            <CardHeader>
                <CardTitle>Ranking de Vendedores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendorLeaderboard.map((v, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : 'text-gray-500'}`}>#{i + 1}</span>
                      <p className="text-sm font-medium">{v.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-400">R$ {v.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{v.deals} vendas</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
        </Card>
      </div>

      {/* Todos os Leads Capturados */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Leads Não Atribuídos ({unassignedLeads.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-1">
            {unassignedLeads.length > 0 ? unassignedLeads.map(lead => (
              <div key={lead.id} className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-white text-sm truncate">{lead.full_name}</h4>
                    <p className="text-xs text-gray-400 truncate">{lead.email}</p>
                  </div>
                  <Badge className="text-xs bg-blue-600/70 whitespace-nowrap">
                    {lead.source_page || lead.lead_category || 'N/A'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-3">
                   <Button size="sm" variant="outline" className="text-xs h-7">Atribuir Lead</Button>
                </div>
              </div>
            )) : <p className="text-gray-400 col-span-full text-center py-4">Nenhum lead novo para atribuir.</p>}
          </div>
        </CardContent>
      </Card>

      {/* Vendedores */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Equipe de Vendas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SALES_REPS.map(rep => {
              const stats = getStatsForRep(rep.id);
              return (
                <Card
                  key={rep.id}
                  className="bg-gray-700/50 border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => onSelectRep(rep)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full ${rep.color} flex items-center justify-center text-white font-bold`}>
                        {rep.initials}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{rep.name}</h3>
                        <p className="text-xs text-gray-400">Consultor</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Leads Ativos:</span>
                        <span className="text-white font-semibold">{stats.activeLeads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Vendas:</span>
                        <span className="text-white font-semibold">{stats.wonLeads}</span>
                      </div>
                       <div className="flex justify-between">
                        <span className="text-gray-400">Conversão:</span>
                        <span className="text-white font-semibold">{stats.conversionRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Faturado:</span>
                        <span className="text-green-400 font-semibold">R$ {stats.totalValue.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function AdvancedCRM() {
  const [selectedRep, setSelectedRep] = useState(null);
  const [allCrmLeads, setAllCrmLeads] = useState([]);
  const [generalLeads, setGeneralLeads] = useState([]);
  const [intlLeads, setIntlLeads] = useState([]);
  const [allPipelines, setAllPipelines] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [crmLeadsData, generalLeadsData, intlLeadsData, pipelinesData, tasksData] = await Promise.all([
        CRMLead.list('-created_date').catch(() => []),
        Lead.list('-created_date').catch(() => []),
        InternationalLead.list('-created_date').catch(() => []),
        CRMPipeline.list().catch(() => []),
        CustomTask.list().catch(() => [])
      ]);

      setAllCrmLeads(crmLeadsData);
      setGeneralLeads(generalLeadsData);
      setIntlLeads(intlLeadsData);
      setAllPipelines(pipelinesData);
      setAllTasks(tasksData || []);
    } catch (error) {
      console.error('Error loading CRM data:', error);
      toast.error('Erro ao carregar dados do CRM');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
      </div>
    );
  }

  if (!selectedRep) {
    return (
      <CRMMainDashboard 
        onSelectRep={setSelectedRep}
        allLeads={allCrmLeads}
        allPipelines={allPipelines}
        generalLeads={generalLeads}
        intlLeads={intlLeads}
        allTasks={allTasks}
      />
    );
  }

  return (
    <IndividualCRMDashboard 
      salesRep={selectedRep}
      onBack={() => setSelectedRep(null)}
      services={EC10_SERVICES}
      unassignedLeads={[...generalLeads, ...intlLeads]}
    />
  );
}
