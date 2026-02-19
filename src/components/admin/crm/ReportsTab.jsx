import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import _ from 'lodash';
import { Users, Target, CheckCircle, XCircle, DollarSign } from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, description }) => (
  <Card className="bg-gray-800/70 border-gray-700">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
      <Icon className="h-4 w-4 text-gray-400" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">{value}</div>
      <p className="text-xs text-gray-400">{description}</p>
    </CardContent>
  </Card>
);

export default function ReportsTab({ leads, tasks }) {
  const stats = useMemo(() => {
    const wonLeads = leads.filter(l => l.current_stage === 'Fechado');
    const lostLeads = leads.filter(l => l.current_stage === 'Perdido');
    const activeLeads = leads.length - wonLeads.length - lostLeads.length;
    const totalRevenue = _.sumBy(wonLeads, 'value');
    const conversionRate = (wonLeads.length / (wonLeads.length + lostLeads.length || 1) * 100).toFixed(1);
    
    return { wonLeads, lostLeads, activeLeads, totalRevenue, conversionRate };
  }, [leads]);

  const leadByStageData = useMemo(() => {
    const stages = _.groupBy(leads, 'current_stage');
    return Object.keys(stages).map(stage => ({ name: stage, value: stages[stage].length }));
  }, [leads]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const activityData = useMemo(() => {
    return _.chain(tasks)
      .groupBy(t => format(new Date(t.created_date), 'yyyy-MM-dd'))
      .map((value, key) => ({ date: format(new Date(key), 'dd/MM'), count: value.length }))
      .orderBy('date', 'asc')
      .slice(-30)
      .value();
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Leads Ativos" value={stats.activeLeads} icon={Users} description="Leads no funil" />
        <KPICard title="Vendas Ganhas" value={stats.wonLeads.length} icon={CheckCircle} description="Negócios fechados" />
        <KPICard title="Vendas Perdidas" value={stats.lostLeads.length} icon={XCircle} description="Negócios perdidos" />
        <KPICard title="Taxa de Conversão" value={`${stats.conversionRate}%`} icon={Target} description="Ganhos / (Ganhos + Perdidos)" />
        <KPICard title="Faturamento Total" value={`R$ ${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} description="Soma das vendas ganhas" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/70 border-gray-700 text-white">
            <CardHeader><CardTitle>Leads por Etapa</CardTitle></CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={leadByStageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                            {leadByStageData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}/>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="bg-gray-800/70 border-gray-700 text-white">
            <CardHeader><CardTitle>Atividades Recentes</CardTitle></CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                        <XAxis dataKey="date" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}/>
                        <Bar dataKey="count" fill="#8884d8" name="Atividades" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}