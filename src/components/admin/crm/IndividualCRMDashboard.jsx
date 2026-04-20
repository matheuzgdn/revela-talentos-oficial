import { appClient } from '@/api/backendClient';
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';





import { Loader2, ArrowLeft, LayoutGrid, Briefcase, Calendar, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import PipelineView from './PipelineView';
import ToolsTab from './ToolsTab';
import CalendarTab from './CalendarTab';
import ReportsTab from './ReportsTab';

export default function IndividualCRMDashboard({ salesRep, onBack, services, unassignedLeads }) {
  const [pipelines, setPipelines] = useState([]);
  const [leads, setLeads] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pipelines');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pipelinesData, leadsData, materialsData, eventsData, tasksData] = await Promise.all([
        appClient.entities.CRMPipeline.filter({ sales_rep_id: salesRep.id }),
        appClient.entities.CRMLead.filter({ sales_rep_id: salesRep.id }),
        appClient.entities.SalesMaterial.list(),
        appClient.entities.Event.filter({ $or: [{ target_users: [] }, { target_users: salesRep.id }] }),
        appClient.entities.CustomTask.filter({ assigned_user_id: salesRep.id })
      ]);
      setPipelines(pipelinesData || []);
      setLeads(leadsData || []);
      setMaterials(materialsData || []);
      setEvents(eventsData || []);
      setTasks(tasksData || []);
    } catch (error) {
      console.error(`Error loading data for ${salesRep.name}:`, error);
      toast.error("Erro ao carregar dados do CRM.");
    } finally {
      setIsLoading(false);
    }
  }, [salesRep.id, salesRep.name]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-sky-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="border-gray-700"><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${salesRep.color} flex items-center justify-center text-white font-bold`}>{salesRep.initials}</div>
            <div>
              <h1 className="text-2xl font-bold text-white">CRM - {salesRep.name}</h1>
              <p className="text-gray-400 text-sm">Painel individual de vendas</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="pipelines"><LayoutGrid className="w-4 h-4 mr-2" />Pipelines</TabsTrigger>
          <TabsTrigger value="ferramentas"><Briefcase className="w-4 h-4 mr-2" />Ferramentas</TabsTrigger>
          <TabsTrigger value="calendario"><Calendar className="w-4 h-4 mr-2" />CalendÃ¡rio</TabsTrigger>
          <TabsTrigger value="relatorios"><BarChart className="w-4 h-4 mr-2" />RelatÃ³rios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pipelines" className="mt-6">
          <PipelineView
            pipelines={pipelines}
            leads={leads}
            salesRepId={salesRep.id}
            services={services}
            unassignedLeads={unassignedLeads}
            onRefresh={loadData}
          />
        </TabsContent>
        <TabsContent value="ferramentas" className="mt-6">
          <ToolsTab materials={materials} salesRep={salesRep} onNavigate={setActiveTab} />
        </TabsContent>
        <TabsContent value="calendario" className="mt-6">
          <CalendarTab events={events} leads={leads} salesRepId={salesRep.id} onRefresh={loadData}/>
        </TabsContent>
        <TabsContent value="relatorios" className="mt-6">
          <ReportsTab leads={leads} tasks={tasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}


