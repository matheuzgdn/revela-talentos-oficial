
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Megaphone, Upload, AlertCircle, CheckCircle, Plus, Clock, Loader2, History, ChevronDown } from 'lucide-react';
import { CustomTask } from '@/entities/CustomTask';
import { PerformanceData } from '@/entities/PerformanceData';
import { Marketing } from '@/entities/Marketing';
import { AthleteUpload } from '@/entities/AthleteUpload';
import { toast } from 'sonner';

// --- MODAIS DE EDIÇÃO ---

const EditPerformanceModal = ({ request, onRefresh, onClose }) => {
  const [formState, setFormState] = useState({
    analyst_notes: request.analyst_notes || '',
    rating: request.rating || 0,
    goals: request.goals || 0,
    assists: request.assists || 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await PerformanceData.update(request.id, { ...formState, status: 'completed' });
      toast.success("Análise de performance salva!");
      onRefresh();
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar análise.");
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Analisar Performance: vs {request.opponent}</DialogTitle>
      </DialogHeader>
      {request.associated_video_url && (
        <div className="p-4 bg-gray-900/50 rounded-lg">
          <h4 className="text-sm font-semibold text-white mb-3">Diário do Atleta</h4>
          <div className="space-y-3 text-sm">
            <p><strong className="text-gray-400">Sentimento:</strong> <span className="text-gray-200 italic">"{request.athlete_feeling || 'N/A'}"</span></p>
            <p><strong className="text-gray-400">Resumo:</strong> <span className="text-gray-200 italic">"{request.athlete_weekly_summary || 'N/A'}"</span></p>
          </div>
          <Button asChild size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700">
            <a href={request.associated_video_url} target="_blank" rel="noopener noreferrer">
              <BarChart3 className="w-4 h-4 mr-2"/> Ver Vídeo da Partida
            </a>
          </Button>
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        <Input type="number" value={formState.rating} onChange={e => setFormState(s=>({...s, rating: parseFloat(e.target.value)}))} placeholder="Nota" className="bg-gray-800 border-gray-700"/>
        <Input type="number" value={formState.goals} onChange={e => setFormState(s=>({...s, goals: parseInt(e.target.value)}))} placeholder="Gols" className="bg-gray-800 border-gray-700"/>
        <Input type="number" value={formState.assists} onChange={e => setFormState(s=>({...s, assists: parseInt(e.target.value)}))} placeholder="Assist." className="bg-gray-800 border-gray-700"/>
      </div>
      <Textarea value={formState.analyst_notes} onChange={e => setFormState(s=>({...s, analyst_notes: e.target.value}))} placeholder="Observações do analista..." className="bg-gray-800 border-gray-700" />
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} disabled={isSaving}>{isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>} Salvar Análise</Button>
      </DialogFooter>
    </div>
  )
}

const EditMarketingModal = ({ request, onRefresh, onClose }) => {
    // Similar to the one in AdminMarketingTab
    const [formState, setFormState] = useState({
        status: request.status || 'in_progress',
        feedback_from_team: request.feedback_from_team || '',
        result_url: request.result_url || ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await Marketing.update(request.id, formState);
            toast.success("Solicitação de marketing atualizada!");
            onRefresh();
            onClose();
        } catch (error) {
            toast.error("Erro ao atualizar solicitação.");
        }
        setIsSaving(false);
    };

    return (
      <div className="space-y-4">
        <DialogHeader><DialogTitle>Gerenciar Solicitação de Marketing</DialogTitle></DialogHeader>
        <p className="text-sm text-gray-400">Tipo: {request.request_type}</p>
        <Select value={formState.status} onValueChange={v => setFormState(s=>({...s, status: v}))}>
            <SelectTrigger className="bg-gray-800 border-gray-700"><SelectValue/></SelectTrigger>
            <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in_progress">Em Produção</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
            </SelectContent>
        </Select>
        <Input value={formState.result_url} onChange={e=>setFormState(s=>({...s, result_url: e.target.value}))} placeholder="URL do resultado final" className="bg-gray-800 border-gray-700"/>
        <Textarea value={formState.feedback_from_team} onChange={e=>setFormState(s=>({...s, feedback_from_team: e.target.value}))} placeholder="Feedback para o atleta..." className="bg-gray-800 border-gray-700"/>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isSaving}>{isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>} Salvar</Button>
        </DialogFooter>
      </div>
    )
}

const TaskCard = ({ item, user, type, onComplete, onClick }) => {
  const getIcon = () => {
    switch (type) {
      case 'performance': return <BarChart3 className="w-5 h-5 text-yellow-400" />;
      case 'marketing': return <Megaphone className="w-5 h-5 text-fuchsia-400" />;
      case 'upload': return <Upload className="w-5 h-5 text-blue-400" />;
      case 'custom': return <Clock className="w-5 h-5 text-gray-400" />;
      default: return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'performance': return `Analisar: vs ${item.opponent}`;
      case 'marketing': return `Marketing: ${item.request_type === 'flyer' ? 'Flyer' : 'Vídeo Destaque'}`;
      case 'upload': return `Upload: ${item.category}`;
      case 'custom': return item.title;
      default: return 'Tarefa Desconhecida';
    }
  };

  return (
    <Card className="bg-black/50 border-gray-800 hover:border-gray-700 transition-colors mb-3">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 cursor-pointer flex-1" onClick={onClick}>
            {getIcon()}
            <div>
              <p className="text-sm font-medium text-white">{getTitle()}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={user?.profile_picture_url} />
                  <AvatarFallback className="text-xs bg-gray-600">
                    {user?.full_name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <span>{user?.full_name || 'Desconhecido'}</span>
              </div>
            </div>
          </div>
          <Button size="icon" variant="ghost" onClick={() => onComplete(item.id, type)} className="text-green-400 hover:bg-green-500/10">
            <CheckCircle className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CompletedTaskItem = ({ task, user }) => (
    <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-md">
        <div className="flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-green-500"/>
            <div>
                <p className="text-sm text-gray-300">{task.title || `Tarefa de ${task.request_type || 'performance'}`}</p>
                <p className="text-xs text-gray-500">Concluída por {user?.full_name || 'Admin'} em {new Date(task.updated_date).toLocaleDateString()}</p>
            </div>
        </div>
    </div>
)

export default function AdminActionCenter({ performanceData, marketingRequests, uploads, messages, events, users, onRefresh }) {
  const [customTasks, setCustomTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // {item, type}
  const [showHistory, setShowHistory] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    related_user_id: '',
    priority: 'medium',
    category: 'Geral',
    due_date: ''
  });

  useEffect(() => {
    loadCustomTasks();
  }, []);
  
  useEffect(() => {
      if (showHistory) {
          loadCompletedTasks();
      }
  }, [showHistory]);

  const loadCustomTasks = async () => {
    const tasks = await CustomTask.filter({ status: 'pending' });
    setCustomTasks(tasks || []);
  };
  
  const loadCompletedTasks = async () => {
    const [perf, mark, up, cust] = await Promise.all([
        PerformanceData.filter({ status: 'completed' }, '-updated_date', 20),
        Marketing.filter({ status: 'completed' }, '-updated_date', 20),
        AthleteUpload.filter({ processing_status: 'completed' }, '-updated_date', 20),
        CustomTask.filter({ status: 'completed' }, '-updated_date', 20),
    ]);
    const allCompleted = [
        ...(perf || []).map(i => ({...i, title: `Análise: vs ${i.opponent}`, type: 'performance', user_id: i.user_id, updated_date: i.updated_date})),
        ...(mark || []).map(i => ({...i, title: `Marketing: ${i.request_type}`, type: 'marketing', user_id: i.user_id, updated_date: i.updated_date})),
        ...(up || []).map(i => ({...i, title: `Upload: ${i.file_name}`, type: 'upload', user_id: i.user_id, updated_date: i.updated_date})),
        ...(cust || []).map(i => ({...i, type: 'custom', related_user_id: i.related_user_id, updated_date: i.updated_date}))
    ].sort((a,b) => new Date(b.updated_date) - new Date(a.updated_date));
    setCompletedTasks(allCompleted);
  };
  
  const handleCompleteTask = async (taskId, type) => {
    try {
      switch (type) {
        case 'performance':
          await PerformanceData.update(taskId, { status: 'completed' });
          break;
        case 'marketing':
          await Marketing.update(taskId, { status: 'completed' });
          break;
        case 'upload':
          await AthleteUpload.update(taskId, { processing_status: 'completed' });
          break;
        case 'custom':
          await CustomTask.update(taskId, { status: 'completed' });
          break;
        default:
          throw new Error("Tipo de tarefa desconhecido");
      }
      toast.success("Tarefa concluída com sucesso!");
      onRefresh();
      loadCompletedTasks();
      if (type === 'custom') {
        loadCustomTasks();
      }
    } catch (error) {
      toast.error("Erro ao concluir tarefa.");
      console.error(error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) {
      toast.error("O título da tarefa é obrigatório.");
      return;
    }
    try {
      await CustomTask.create(newTask);
      toast.success("Nova tarefa criada!");
      setShowTaskForm(false);
      setNewTask({
        title: '',
        description: '',
        related_user_id: '',
        priority: 'medium',
        category: 'Geral',
        due_date: ''
      });
      loadCustomTasks();
    } catch (error) {
      toast.error("Erro ao criar tarefa.");
    }
  };

  const getUserById = (userId) => users.find(u => u.id === userId);

  const pendingPerformance = performanceData.filter(p => p.status === 'pending_analysis');
  const pendingMarketing = marketingRequests.filter(m => m.status === 'pending');
  const pendingUploads = uploads.filter(u => u.processing_status === 'pending');
  const pendingCustom = customTasks.filter(t => t.status === 'pending');

  return (
    <div className="p-4 bg-black/20 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Central de Ações</h2>
        <Button onClick={() => setShowTaskForm(true)} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Tarefa
        </Button>
      </div>

      <Dialog open={showTaskForm || !!editingItem} onOpenChange={(isOpen) => {
          if(!isOpen) {
              setShowTaskForm(false);
              setEditingItem(null);
          }
      }}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
            {showTaskForm && (
              <>
                <DialogHeader><DialogTitle>Criar Nova Tarefa</DialogTitle></DialogHeader>
                <form onSubmit={handleCreateTask} className="space-y-4 py-4">
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask(p => ({ ...p, title: e.target.value }))}
                    placeholder="Título da tarefa"
                    className="bg-gray-800 border-gray-700"
                    required
                  />
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(p => ({ ...p, description: e.target.value }))}
                    placeholder="Descrição..."
                    className="bg-gray-800 border-gray-700"
                  />
                  <Select
                    onValueChange={(v) => setNewTask(p => ({ ...p, related_user_id: v }))}
                    value={newTask.related_user_id}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Atribuir a um atleta (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      onValueChange={(v) => setNewTask(p => ({ ...p, priority: v }))}
                      defaultValue="medium"
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask(p => ({ ...p, due_date: e.target.value }))}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowTaskForm(false)}>Cancelar</Button>
                    <Button type="submit">Criar Tarefa</Button>
                  </DialogFooter>
                </form>
              </>
            )}
            {editingItem?.type === 'performance' && <EditPerformanceModal request={editingItem.item} onRefresh={onRefresh} onClose={() => setEditingItem(null)}/>}
            {editingItem?.type === 'marketing' && <EditMarketingModal request={editingItem.item} onRefresh={onRefresh} onClose={() => setEditingItem(null)}/>}
            {/* Add other modals if needed */}

        </DialogContent>
      </Dialog>
      
      {(pendingPerformance.length + pendingMarketing.length + pendingUploads.length + pendingCustom.length) > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna de Análises de Performance */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-yellow-400">Análise de Performance ({pendingPerformance.length})</h3>
            {pendingPerformance.map(item => (
              <TaskCard key={item.id} item={item} user={getUserById(item.user_id)} type="performance" onComplete={handleCompleteTask} onClick={() => setEditingItem({item, type: 'performance'})} />
            ))}
          </div>

          {/* Coluna de Solicitações de Marketing */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-fuchsia-400">Marketing ({pendingMarketing.length})</h3>
            {pendingMarketing.map(item => (
              <TaskCard key={item.id} item={item} user={getUserById(item.user_id)} type="marketing" onComplete={handleCompleteTask} onClick={() => setEditingItem({item, type: 'marketing'})} />
            ))}
          </div>

          {/* Coluna de Uploads e Tarefas */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-blue-400">Uploads & Tarefas ({pendingUploads.length + pendingCustom.length})</h3>
            {pendingUploads.map(item => (
              <TaskCard key={item.id} item={item} user={getUserById(item.user_id)} type="upload" onComplete={handleCompleteTask} onClick={() => {}} />
            ))}
            {pendingCustom.map(item => (
              <TaskCard key={item.id} item={item} user={getUserById(item.related_user_id)} type="custom" onComplete={handleCompleteTask} onClick={() => {}} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h3 className="text-xl font-bold text-white">Tudo em dia!</h3>
          <p>Nenhuma tarefa pendente no momento.</p>
        </div>
      )}
      
      <div className="mt-8 border-t border-gray-800 pt-6">
        <Button variant="outline" onClick={() => setShowHistory(!showHistory)} className="w-full justify-between">
            <div className="flex items-center gap-2">
                <History className="w-4 h-4"/>
                Histórico de Tarefas Concluídas
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''}`}/>
        </Button>
        {showHistory && (
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {completedTasks.length > 0 ? (
                    completedTasks.map(task => (
                        <CompletedTaskItem key={task.id + task.type} task={task} user={getUserById(task.user_id || task.related_user_id)}/>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">Nenhuma tarefa concluída recentemente.</p>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
