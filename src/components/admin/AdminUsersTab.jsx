import React, { useState, useMemo, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { Pipeline } from "@/entities/Pipeline";
import { UserPipeline } from "@/entities/UserPipeline";
import { Notification } from "@/entities/Notification";
import { AthleteUpload } from "@/entities/AthleteUpload";
import { ChatMessage } from "@/entities/ChatMessage";
import { PerformanceData } from "@/entities/PerformanceData";
import { UserProgress } from "@/entities/UserProgress";
import { PlatformSettings } from "@/entities/PlatformSettings";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Edit, Search, Check, Star, Shield, TrendingUp, X, BarChart3, Upload, Eye, Target, Trophy,
  Send, Loader2, Megaphone, Crown, Plus, Users,
  GitBranch, EyeOff, Lock, Unlock } from
"lucide-react";

const AthleteCard = ({ user, userData, onEdit, pipelines, userPipelines }) => {
  const pendingAnalysis = userData.performance.filter((p) => p.status === 'pending_analysis').length;
  const pendingMarketing = userData.marketing?.filter((p) => p.status === 'pending').length || 0;
  const hasNotifications = pendingAnalysis > 0 || pendingMarketing > 0;

  const userPipelineInfo = userPipelines.find((up) => up.user_id === user.id);
  const currentPipeline = userPipelineInfo ? pipelines.find((p) => p.id === userPipelineInfo.pipeline_id) : null;

  const getAccessBadges = () => {
    const badges = [];
    if (!user.is_approved) {
      badges.push(<Badge key="pending" className="bg-red-600/20 text-red-400 border-red-600/50">Aguardando Aprovação</Badge>);
    }
    if (user.has_revela_talentos_access && !user.has_plano_carreira_access) {
      badges.push(<Badge key="revela" className="bg-blue-600/20 text-blue-400 border-blue-600/50">Revela Talentos</Badge>);
    }
    if (user.has_plano_carreira_access) {
      badges.push(<Badge key="carreira" className="bg-green-600/20 text-green-400 border-green-600/50">Plano de Carreira</Badge>);
    }
    if (user.role === 'admin') {
      badges.push(<Badge key="admin" className="bg-red-600/20 text-red-400 border-red-600/50">Admin Geral</Badge>);
    } else if (user.is_revela_admin) {
      badges.push(<Badge key="revela_admin" className="bg-purple-600/20 text-purple-400 border-purple-600/50">Admin Revela</Badge>);
    }
    if (user.is_featured) {
      badges.push(<Badge key="featured" className="bg-yellow-600/20 text-yellow-400 border-yellow-600/50">Destaque</Badge>);
    }
    return badges;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-black/50 border border-gray-800 rounded-lg p-4 space-y-3 hover:border-gray-600 transition-colors">

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="h-10 w-10 border-2 border-gray-700">
            <AvatarImage src={user.profile_picture_url} />
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
              {user.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">{user.full_name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white flex-shrink-0" onClick={() => onEdit(user)}>
          <Edit className="w-4 h-4" />
        </Button>
      </div>
      
      {user.position && <p className="text-xs text-gray-500">{user.position} • {user.club || 'Sem clube'}</p>}

      <div className="flex flex-wrap gap-2">
        {getAccessBadges()}
      </div>

      {currentPipeline &&
      <div className="flex items-center gap-2 text-sm text-gray-300">
          <GitBranch className="w-4 h-4 text-purple-400" />
          <span className="truncate">{currentPipeline.name}</span>
          {userPipelineInfo.current_stage &&
        <Badge variant="outline" className="text-xs whitespace-nowrap">
              {userPipelineInfo.current_stage}
            </Badge>
        }
        </div>
      }

      {hasNotifications &&
      <div className="flex items-center gap-2">
          {pendingAnalysis > 0 &&
        <Badge variant="destructive" className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" /> {pendingAnalysis}
            </Badge>
        }
          {pendingMarketing > 0 &&
        <Badge variant="destructive" className="flex items-center gap-1">
              <Megaphone className="w-3 h-3" /> {pendingMarketing}
            </Badge>
        }
        </div>
      }
    </motion.div>);

};

const PipelineManager = ({ pipelines, onRefresh }) => {
  const [showCreatePipeline, setShowCreatePipeline] = useState(false);
  const [newPipeline, setNewPipeline] = useState({
    name: '',
    description: '',
    color: 'blue',
    stages: [{ name: 'Novo Lead', description: 'Atleta recém cadastrado', order: 1 }]
  });

  const handleCreatePipeline = async () => {
    try {
      await Pipeline.create(newPipeline);
      toast.success('Pipeline criado com sucesso!');
      setShowCreatePipeline(false);
      setNewPipeline({
        name: '',
        description: '',
        color: 'blue',
        stages: [{ name: 'Novo Lead', description: 'Atleta recém cadastrado', order: 1 }]
      });
      onRefresh();
    } catch (error) {
      toast.error('Erro ao criar pipeline');
    }
  };

  const addStage = () => {
    setNewPipeline((prev) => ({
      ...prev,
      stages: [...prev.stages, {
        name: '',
        description: '',
        order: prev.stages.length + 1
      }]
    }));
  };

  const removeStage = (index) => {
    setNewPipeline((prev) => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index)
    }));
  };

  const updateStage = (index, field, value) => {
    setNewPipeline((prev) => ({
      ...prev,
      stages: prev.stages.map((stage, i) =>
      i === index ? { ...stage, [field]: value } : stage
      )
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Pipelines de CRM</h3>
        <Button onClick={() => setShowCreatePipeline(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Pipeline
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(pipelines || []).map((pipeline) =>
        <Card key={pipeline.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-${pipeline.color}-500`} />
                {pipeline.name}
              </CardTitle>
              <p className="text-xs text-gray-400">{pipeline.description}</p>
            </CardHeader>
            <CardContent>
              {/* Content can be added here if needed */}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showCreatePipeline} onOpenChange={setShowCreatePipeline}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Criar Novo Pipeline</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome do Pipeline</Label>
                <Input
                  value={newPipeline.name}
                  onChange={(e) => setNewPipeline((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-800 border-gray-700" />

              </div>
              <div>
                <Label>Cor</Label>
                <Select value={newPipeline.color} onValueChange={(v) => setNewPipeline((prev) => ({ ...prev, color: v }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Azul</SelectItem>
                    <SelectItem value="green">Verde</SelectItem>
                    <SelectItem value="purple">Roxo</SelectItem>
                    <SelectItem value="red">Vermelho</SelectItem>
                    <SelectItem value="yellow">Amarelo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={newPipeline.description}
                onChange={(e) => setNewPipeline((prev) => ({ ...prev, description: e.target.value }))}
                className="bg-gray-800 border-gray-700" />

            </div>
            
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label>Estágios do Pipeline</Label>
                <Button type="button" onClick={addStage} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-3 h-3 mr-1" />
                  Adicionar Estágio
                </Button>
              </div>
              <div className="space-y-3">
                {newPipeline.stages.map((stage, index) =>
                <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input
                      placeholder="Nome do estágio"
                      value={stage.name}
                      onChange={(e) => updateStage(index, 'name', e.target.value)}
                      className="bg-gray-800 border-gray-700" />

                      <Input
                      placeholder="Descrição"
                      value={stage.description}
                      onChange={(e) => updateStage(index, 'description', e.target.value)}
                      className="bg-gray-800 border-gray-700" />

                    </div>
                    {index > 0 &&
                  <Button type="button" onClick={() => removeStage(index)} size="icon" variant="ghost" className="text-red-400 hover:text-red-300">
                        <X className="w-4 h-4" />
                      </Button>
                  }
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleCreatePipeline} disabled={!newPipeline.name}>
              Criar Pipeline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);

};

export default function AdminUsersTab() {
  const [data, setData] = useState({ users: [], uploads: [], messages: [], performance: [], progress: [], pipelines: [], userPipelines: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("crm");
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [replyAs, setReplyAs] = useState("analyst_01");
  const [editingPerformanceItem, setEditingPerformanceItem] = useState(null);
  const [performanceForm, setPerformanceForm] = useState({});
  const [showAllAthletes, setShowAllAthletes] = useState(true);
  const [isPlatformRestricted, setIsPlatformRestricted] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  const personas = [
  { id: "analyst_01", name: "Analista de Desempenho" },
  { id: "physio_01", name: "Preparador Físico" },
  { id: "mentor_01", name: "Mentor de Carreira" },
  { id: "marketing_01", name: "Equipe de Marketing" }];


  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load only users initially
      const users = await User.list('-created_date', 100);
      setData({
        users: users || [],
        uploads: [],
        messages: [],
        performance: [],
        progress: [],
        pipelines: [],
        userPipelines: []
      });
      setIsLoading(false);

      // Load other data only when needed (in background)
      Pipeline.filter({ is_active: true }).then((pipelines) => {
        setData((prev) => ({ ...prev, pipelines }));
      }).catch(() => {});

      UserPipeline.list().then((userPipelines) => {
        setData((prev) => ({ ...prev, userPipelines }));
      }).catch(() => {});
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Erro ao carregar dados dos usuários.');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
    loadPlatformSettings();
  }, [loadAllData]);

  const loadPlatformSettings = async () => {
    setIsLoadingSettings(true);
    try {
      const settings = await PlatformSettings.list();
      const restrictionSetting = settings.find((s) => s.setting_key === 'is_platform_restricted');
      setIsPlatformRestricted(restrictionSetting?.setting_value === 'true');
    } catch (error) {
      console.error('Error loading platform settings:', error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const togglePlatformRestriction = async () => {
    try {
      const settings = await PlatformSettings.list();
      const restrictionSetting = settings.find((s) => s.setting_key === 'is_platform_restricted');

      const newValue = !isPlatformRestricted;

      if (restrictionSetting) {
        await PlatformSettings.update(restrictionSetting.id, {
          setting_value: newValue.toString()
        });
      } else {
        await PlatformSettings.create({
          setting_key: 'is_platform_restricted',
          setting_value: newValue.toString()
        });
      }

      setIsPlatformRestricted(newValue);
      toast.success(newValue ? 'Plataforma bloqueada para novos usuários' : 'Plataforma liberada para todos');
    } catch (error) {
      console.error('Error toggling platform restriction:', error);
      toast.error('Erro ao alterar configuração');
    }
  };

  const filteredUsers = useMemo(() => {
    return data.users.
    filter((user) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
      user.full_name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term);


      const matchesFilter =
      filter === "all" ||
      filter === "revela_only" && user.has_revela_talentos_access && !user.has_plano_carreira_access ||
      filter === "plano_carreira" && user.has_plano_carreira_access ||
      filter === "admin" && user.role === 'admin' ||
      filter === "revela_admin" && user.is_revela_admin && user.role !== 'admin' ||
      filter === "featured" && user.is_featured;

      return matchesSearch && matchesFilter;
    });
  }, [data.users, searchTerm, filter]);

  const { revelaTalentosUsers, planoCarreiraUsers, adminUsers, revelaAdminUsers } = useMemo(() => {
    const allUsers = data.users;
    const revela = allUsers.filter((u) => u.has_revela_talentos_access && !u.has_plano_carreira_access && (searchTerm ? u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()) : true));
    const carreira = allUsers.filter((u) => u.has_plano_carreira_access && (searchTerm ? u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()) : true));
    const admin = allUsers.filter((u) => u.role === 'admin' && (searchTerm ? u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()) : true));
    const revelaAdmin = allUsers.filter((u) => u.is_revela_admin && u.role !== 'admin' && (searchTerm ? u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()) : true));

    return {
      revelaTalentosUsers: revela,
      planoCarreiraUsers: carreira,
      adminUsers: admin,
      revelaAdminUsers: revelaAdmin
    };
  }, [data.users, searchTerm]);

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
    setIsModalOpen(true);
    // Load user details only when opening modal
    loadUserDetails(user.id);
  };

  const handleFieldChange = (fieldName, value) => {
    setEditingUser((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleRoleChange = (roleValue) => {
    if (roleValue === 'revela_admin') {
      setEditingUser((prev) => ({
        ...prev,
        role: 'user', // Actual role in DB for revela_admin is 'user' but with is_revela_admin true
        is_revela_admin: true
      }));
    } else if (roleValue === 'admin') {
      setEditingUser((prev) => ({
        ...prev,
        role: 'admin',
        is_revela_admin: false
      }));
    } else {// 'user'
      setEditingUser((prev) => ({
        ...prev,
        role: 'user',
        is_revela_admin: false
      }));
    }
  };

  const handleModalSave = async () => {
    if (!editingUser) return;
    try {
      const { id, ...updateData } = editingUser;

      // The logic for role and is_revela_admin is now handled by handleRoleChange
      // so we can directly use updateData without further modification here.

      await User.update(id, updateData);

      await Notification.create({
        user_id: id,
        title: "Perfil Atualizado",
        message: "Seu perfil foi atualizado pela administração.",
        type: "general",
        priority: "medium"
      });

      toast.success("Usuário atualizado com sucesso!");
      setIsModalOpen(false);
      setEditingUser(null);
      loadAllData();
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Falha ao atualizar usuário.");
    }
  };

  const handleToggleFeatureUpload = async (upload) => {
    try {
      await AthleteUpload.update(upload.id, { is_featured: !upload.is_featured });
      toast.success(`Upload ${!upload.is_featured ? 'destacado' : 'não destacado'} com sucesso!`);
      loadAllData();
    } catch (error) {
      toast.error("Erro ao destacar upload.");
      console.error(error);
    }
  };

  const handleSendMessageInModal = async () => {
    if (!newMessage.trim() || !editingUser) return;
    setIsSending(true);
    try {
      const conversationId = `conv_${editingUser.id}_${Date.now()}`;

      await ChatMessage.create({
        sender_id: replyAs,
        receiver_id: editingUser.id,
        conversation_id: conversationId,
        content: newMessage,
        message_type: "text",
        read: false
      });

      setNewMessage("");
      toast.success("Mensagem enviada!");
      loadAllData();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erro ao enviar mensagem.");
    }
    setIsSending(false);
  };

  const handleStartEditPerformance = (perf) => {
    setEditingPerformanceItem(perf);
    setPerformanceForm({
      opponent: perf.opponent || "",
      game_date: perf.game_date ? new Date(perf.game_date).toISOString().split('T')[0] : "",
      minutes_played: perf.minutes_played || 0,
      goals: perf.goals || 0,
      assists: perf.assists || 0,
      rating: perf.rating || 0,
      analyst_notes: perf.analyst_notes || "",
      athlete_feeling: perf.athlete_feeling || "",
      athlete_weekly_summary: perf.athlete_weekly_summary || "",
      associated_video_url: perf.associated_video_url || ""
    });
  };

  const handleSavePerformanceUpdate = async () => {
    if (!editingPerformanceItem) return;
    try {
      await PerformanceData.update(editingPerformanceItem.id, {
        ...performanceForm,
        status: 'completed'
      });
      toast.success("Performance atualizada!");
      setEditingPerformanceItem(null);
      loadAllData();
    } catch (error) {
      console.error("Erro ao atualizar performance:", error);
      toast.error("Erro ao atualizar performance.");
    }
  };

  const getUserData = (userId) => {
    return {
      uploads: [],
      messages: [],
      performance: [],
      progress: [],
      marketing: []
    };
  };

  const loadUserDetails = async (userId) => {
    try {
      const [uploads, messages, performance, progress] = await Promise.all([
      AthleteUpload.filter({ user_id: userId }, "-created_date", 20),
      ChatMessage.filter({
        $or: [{ sender_id: userId }, { receiver_id: userId }]
      }, "-created_date", 50),
      PerformanceData.filter({ user_id: userId }, "-game_date", 20),
      UserProgress.filter({ user_id: userId }, null, 50)]
      );

      setData((prev) => ({
        ...prev,
        uploads: [...prev.uploads, ...uploads],
        messages: [...prev.messages, ...messages],
        performance: [...prev.performance, ...performance],
        progress: [...prev.progress, ...progress]
      }));
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
          </div>);

  }

  return (
    <div className="space-y-6">
      {/* Platform Access Control */}
      <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-800">
        <CardContent className="bg-slate-950 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isPlatformRestricted ?
              <div className="p-3 bg-red-500/20 rounded-lg">
                  <Lock className="w-8 h-8 text-red-400" />
                </div> :

              <div className="p-3 bg-green-500/20 rounded-lg">
                  <Unlock className="w-8 h-8 text-green-400" />
                </div>
              }
              <div>
                <h3 className="text-xl font-bold text-white">
                  {isPlatformRestricted ? 'Plataforma Restrita' : 'Plataforma Aberta'}
                </h3>
                <p className="text-sm text-gray-400">
                  {isPlatformRestricted ?
                  'Apenas usuários aprovados podem acessar. Novos usuários verão tela de aguardando aprovação.' :
                  'Todos os usuários têm acesso automático ao Revela Talentos após login.'}
                </p>
              </div>
            </div>
            <Button
              onClick={togglePlatformRestriction}
              disabled={isLoadingSettings}
              className={isPlatformRestricted ?
              'bg-green-600 hover:bg-green-700' :
              'bg-red-600 hover:bg-red-700'}>

              {isPlatformRestricted ?
              <>
                  <Unlock className="w-4 h-4 mr-2" />
                  Liberar Plataforma
                </> :

              <>
                  <Lock className="w-4 h-4 mr-2" />
                  Restringir Plataforma
                </>
              }
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Header with Search and Filters */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white pl-10" />

            </div>
            <div className="flex gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Atletas ({data.users.length || 0})</SelectItem>
                  <SelectItem value="plano_carreira">Plano de Carreira</SelectItem>
                  <SelectItem value="revela_only">Apenas Revela Talentos</SelectItem>
                  <SelectItem value="admin">Administradores Gerais</SelectItem>
                  <SelectItem value="revela_admin">Administradores Revela</SelectItem>
                  <SelectItem value="featured">Destaques</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setView(view === "crm" ? "pipelines" : "crm")}
                variant="outline"
                className="border-gray-700">

                {view === "crm" ?
                <>
                    <GitBranch className="w-4 h-4 mr-2" />
                    Pipelines
                  </> :

                <>
                    <Users className="w-4 h-4 mr-2" />
                    CRM
                  </>
                }
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {view === "pipelines" ?
      <PipelineManager
        pipelines={data.pipelines}
        onRefresh={loadAllData} /> :


      <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-900/20 border-blue-800">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{data.users.length || 0}</p>
                <p className="text-xs text-blue-300">Total de Atletas</p>
              </CardContent>
            </Card>
            <Card className="bg-green-900/20 border-green-800">
              <CardContent className="p-4 text-center">
                <Crown className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{planoCarreiraUsers.length}</p>
                <p className="text-xs text-green-300">Plano de Carreira</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-900/20 border-yellow-800">
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{revelaTalentosUsers.length}</p>
                <p className="text-xs text-yellow-300">Revela Talentos</p>
              </CardContent>
            </Card>
            <Card className="bg-red-900/20 border-red-800">
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{adminUsers.length + revelaAdminUsers.length}</p>
                <p className="text-xs text-red-300">Administradores</p>
              </CardContent>
            </Card>
          </div>

          {/* All Athletes Grid */}
          {filter === "all" &&
        <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-bold text-white">Todos os Atletas Cadastrados ({data.users.length || 0})</h3>
                    <Badge className="bg-cyan-600/20 text-cyan-400">Lista Completa</Badge>
                  </div>
                  <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllAthletes(!showAllAthletes)}
                className="text-gray-400 hover:text-white">

                    {showAllAthletes ?
                <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Ocultar
                      </> :

                <>
                        <Eye className="w-4 h-4 mr-2" />
                        Mostrar
                      </>
                }
                  </Button>
                </div>
                
                {showAllAthletes &&
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {data.users.map((user) =>
                <AthleteCard
                  key={user.id}
                  user={user}
                  userData={getUserData(user.id)}
                  onEdit={handleEditClick}
                  pipelines={data.pipelines}
                  userPipelines={data.userPipelines} />

                )}
                    </AnimatePresence>
                  </div>
            }
                
                {(!data.users || data.users.length === 0) && showAllAthletes &&
            <p className="text-gray-500 text-center py-8">
                    Nenhum atleta cadastrado no sistema.
                  </p>
            }
              </div>

              <div className="border-t border-gray-800 my-8"></div>

              <div className="space-y-4 mb-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Visão CRM por Categoria</h3>
                  <Badge className="bg-purple-600/20 text-purple-400">Organizada por Acesso</Badge>
                </div>
              </div>

              {adminUsers.length > 0 &&
          <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-red-400" />
                    <h3 className="text-lg font-bold text-white">Administradores Gerais ({adminUsers.length})</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {adminUsers.map((user) =>
                <AthleteCard
                  key={user.id}
                  user={user}
                  userData={getUserData(user.id)}
                  onEdit={handleEditClick}
                  pipelines={data.pipelines}
                  userPipelines={data.userPipelines} />

                )}
                    </AnimatePresence>
                  </div>
                </div>
          }

              {revelaAdminUsers.length > 0 &&
          <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg font-bold text-white">Administradores Revela ({revelaAdminUsers.length})</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {revelaAdminUsers.map((user) =>
                <AthleteCard
                  key={user.id}
                  user={user}
                  userData={getUserData(user.id)}
                  onEdit={handleEditClick}
                  pipelines={data.pipelines}
                  userPipelines={data.userPipelines} />

                )}
                    </AnimatePresence>
                  </div>
                </div>
          }

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Crown className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-bold text-white">Plano de Carreira ({planoCarreiraUsers.length})</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {planoCarreiraUsers.map((user) =>
                <AthleteCard
                  key={user.id}
                  user={user}
                  userData={getUserData(user.id)}
                  onEdit={handleEditClick}
                  pipelines={data.pipelines}
                  userPipelines={data.userPipelines} />

                )}
                  </AnimatePresence>
                </div>
                {planoCarreiraUsers.length === 0 && <p className="text-gray-500 text-center py-4">Nenhum atleta no Plano de Carreira.</p>}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-bold text-white">Apenas Revela Talentos ({revelaTalentosUsers.length})</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {revelaTalentosUsers.map((user) =>
                <AthleteCard
                  key={user.id}
                  user={user}
                  userData={getUserData(user.id)}
                  onEdit={handleEditClick}
                  pipelines={data.pipelines}
                  userPipelines={data.userPipelines} />

                )}
                  </AnimatePresence>
                </div>
                {revelaTalentosUsers.length === 0 && <p className="text-gray-500 text-center py-4">Nenhum atleta apenas neste plano.</p>}
              </div>
            </div>
        }

          {filter !== "all" &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredUsers.map((user) =>
            <AthleteCard
              key={user.id}
              user={user}
              userData={getUserData(user.id)}
              onEdit={handleEditClick}
              pipelines={data.pipelines}
              userPipelines={data.userPipelines} />

            )}
              </AnimatePresence>
            </div>
        }

          {filteredUsers.length === 0 && filter !== "all" &&
        <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhum atleta encontrado</h3>
              <p>Ajuste os filtros de busca para encontrar atletas.</p>
            </div>
        }
        </>
      }

      {editingUser &&
      <Dialog open={isModalOpen} onOpenChange={(isOpen) => {if (!isOpen) setEditingPerformanceItem(null);setIsModalOpen(isOpen);}}>
          <DialogContent className="sm:max-w-[900px] bg-[#0A0A0A] border border-[#00E5FF]/30 text-white max-h-[95vh] overflow-hidden">
            <DialogHeader className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-[#00E5FF]">
                  <AvatarImage src={editingUser.profile_picture_url} />
                  <AvatarFallback className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xl">
                    {editingUser.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-black text-white">{editingUser.full_name}</DialogTitle>
                  <p className="text-gray-400 text-sm">{editingUser.email}</p>
                </div>
              </div>
            </DialogHeader>
            
            <ScrollArea className="max-h-[calc(95vh-180px)]">
              <div className="space-y-6 p-1 pr-4">
                
                {/* Dados Pessoais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#00E5FF] flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Dados Pessoais
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-400 text-xs">Data de Nascimento *</Label>
                      <Input 
                        type="date" 
                        value={editingUser.birth_date || ""} 
                        onChange={(e) => handleFieldChange('birth_date', e.target.value)} 
                        className="bg-white/5 border-white/10 text-white" 
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Nacionalidade</Label>
                      <Select value={editingUser.nationality || ""} onValueChange={(v) => handleFieldChange('nationality', v)}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A1A] border-white/10">
                          <SelectItem value="🇧🇷">🇧🇷 Brasil</SelectItem>
                          <SelectItem value="🇦🇷">🇦🇷 Argentina</SelectItem>
                          <SelectItem value="🇵🇹">🇵🇹 Portugal</SelectItem>
                          <SelectItem value="🇪🇸">🇪🇸 Espanha</SelectItem>
                          <SelectItem value="🇮🇹">🇮🇹 Itália</SelectItem>
                          <SelectItem value="🇫🇷">🇫🇷 França</SelectItem>
                          <SelectItem value="🇩🇪">🇩🇪 Alemanha</SelectItem>
                          <SelectItem value="🇬🇧">🇬🇧 Inglaterra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Telefone</Label>
                      <Input 
                        value={editingUser.phone || ""} 
                        onChange={(e) => handleFieldChange('phone', e.target.value)} 
                        placeholder="(00) 00000-0000"
                        className="bg-white/5 border-white/10 text-white" 
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Email</Label>
                      <Input 
                        disabled
                        value={editingUser.email || ""} 
                        className="bg-white/5 border-white/10 text-gray-500 cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Cidade</Label>
                      <Input 
                        value={editingUser.city || ""} 
                        onChange={(e) => handleFieldChange('city', e.target.value)} 
                        className="bg-white/5 border-white/10 text-white" 
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Estado (UF)</Label>
                      <Input 
                        value={editingUser.state || ""} 
                        onChange={(e) => handleFieldChange('state', e.target.value.toUpperCase())} 
                        maxLength={2}
                        placeholder="SP"
                        className="bg-white/5 border-white/10 text-white uppercase" 
                      />
                    </div>
                  </div>
                </div>

                {/* Dados de Atleta */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#00E5FF] flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Dados de Atleta
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-400 text-xs">Posição *</Label>
                      <Select value={editingUser.position || ""} onValueChange={(v) => handleFieldChange('position', v)}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A1A] border-white/10">
                          <SelectItem value="goleiro">🧤 Goleiro</SelectItem>
                          <SelectItem value="zagueiro">🛡️ Zagueiro</SelectItem>
                          <SelectItem value="lateral">🏃 Lateral</SelectItem>
                          <SelectItem value="volante">⚙️ Volante</SelectItem>
                          <SelectItem value="meia">🎯 Meia</SelectItem>
                          <SelectItem value="atacante">⚡ Atacante</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Pé Dominante</Label>
                      <Select value={editingUser.foot || "direito"} onValueChange={(v) => handleFieldChange('foot', v)}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A1A] border-white/10">
                          <SelectItem value="direito">Direito</SelectItem>
                          <SelectItem value="esquerdo">Esquerdo</SelectItem>
                          <SelectItem value="ambidestro">Ambos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Camisa</Label>
                      <Input 
                        type="number" 
                        value={editingUser.jersey_number || ""} 
                        onChange={(e) => handleFieldChange('jersey_number', parseInt(e.target.value))} 
                        placeholder="10"
                        className="bg-white/5 border-white/10 text-white" 
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Altura (cm)</Label>
                      <Input 
                        type="number" 
                        value={editingUser.height || ""} 
                        onChange={(e) => handleFieldChange('height', parseInt(e.target.value))} 
                        placeholder="175"
                        className="bg-white/5 border-white/10 text-white" 
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Peso (kg)</Label>
                      <Input 
                        type="number" 
                        value={editingUser.weight || ""} 
                        onChange={(e) => handleFieldChange('weight', parseInt(e.target.value))} 
                        placeholder="70"
                        className="bg-white/5 border-white/10 text-white" 
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Nível</Label>
                      <Select value={editingUser.career_level || "iniciante"} onValueChange={(v) => handleFieldChange('career_level', v)}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A1A] border-white/10">
                          <SelectItem value="iniciante">Iniciante</SelectItem>
                          <SelectItem value="promessa">Promessa</SelectItem>
                          <SelectItem value="destaque">Destaque</SelectItem>
                          <SelectItem value="elite">Elite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Clube Atual */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#00E5FF] flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Clube Atual
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label className="text-gray-400 text-xs">Nome do Clube</Label>
                      <Input 
                        value={editingUser.current_club_name || ""} 
                        onChange={(e) => handleFieldChange('current_club_name', e.target.value)} 
                        placeholder="Nome do clube"
                        className="bg-white/5 border-white/10 text-white" 
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-gray-400 text-xs">URL do Escudo</Label>
                      <Input 
                        value={editingUser.current_club_crest_url || ""} 
                        onChange={(e) => handleFieldChange('current_club_crest_url', e.target.value)} 
                        placeholder="https://..."
                        className="bg-white/5 border-white/10 text-white" 
                      />
                    </div>
                  </div>
                </div>

                {/* URLs & Mídias */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#00E5FF] flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    URLs & Mídias
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-400 text-xs">URL Foto de Perfil</Label>
                      <Input 
                        value={editingUser.profile_picture_url || ""} 
                        onChange={(e) => handleFieldChange('profile_picture_url', e.target.value)} 
                        placeholder="https://..."
                        className="bg-white/5 border-white/10 text-white" 
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">URL Imagem Recortada (PNG sem fundo)</Label>
                      <Input 
                        value={editingUser.player_cutout_url || ""} 
                        onChange={(e) => handleFieldChange('player_cutout_url', e.target.value)} 
                        placeholder="https://..."
                        className="bg-white/5 border-white/10 text-white" 
                      />
                    </div>
                  </div>
                </div>

                {/* Destaques & Conquistas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#00E5FF] flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Destaques & Conquistas
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-400 text-xs">Destaques da Carreira</Label>
                      <Textarea 
                        value={editingUser.career_highlights || ""} 
                        onChange={(e) => handleFieldChange('career_highlights', e.target.value)} 
                        placeholder="Principais destaques..."
                        className="bg-white/5 border-white/10 text-white min-h-[80px]" 
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Conquistas & Títulos</Label>
                      <Textarea 
                        value={editingUser.achievements || ""} 
                        onChange={(e) => handleFieldChange('achievements', e.target.value)} 
                        placeholder="Títulos e conquistas..."
                        className="bg-white/5 border-white/10 text-white min-h-[80px]" 
                      />
                    </div>
                  </div>
                </div>

                {/* Atributos FIFA */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#00E5FF] flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Atributos FIFA
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { key: 'pace', label: 'Velocidade', icon: '⚡' },
                      { key: 'shooting', label: 'Finalização', icon: '🎯' },
                      { key: 'passing', label: 'Passe', icon: '🎯' },
                      { key: 'dribbling', label: 'Drible', icon: '⚽' },
                      { key: 'defending', label: 'Defesa', icon: '🛡️' },
                      { key: 'physicality', label: 'Físico', icon: '💪' }
                    ].map((attr) => (
                      <div key={attr.key}>
                        <Label className="text-gray-400 text-xs">{attr.icon} {attr.label}</Label>
                        <Input
                          type="number"
                          min="0"
                          max="99"
                          value={editingUser.fifa_attributes?.[attr.key] || 50}
                          onChange={(e) => handleFieldChange('fifa_attributes', { ...editingUser.fifa_attributes, [attr.key]: parseInt(e.target.value) })}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Controle de Acesso */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#00E5FF] flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Controle de Acesso & Permissões
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-cyan-500/30 rounded-xl">
                      <Label className="flex items-center gap-2">
                        {editingUser.is_approved ? <Unlock className="w-4 h-4 text-green-400" /> : <Lock className="w-4 h-4 text-red-400" />}
                        <span>Acesso Aprovado à Plataforma</span>
                      </Label>
                      <Switch checked={!!editingUser.is_approved} onCheckedChange={(c) => handleFieldChange('is_approved', c)} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                      <Label className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>Acesso ao Revela Talentos</span>
                      </Label>
                      <Switch checked={!!editingUser.has_revela_talentos_access} onCheckedChange={(c) => handleFieldChange('has_revela_talentos_access', c)} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-green-500/30 rounded-xl">
                      <Label className="flex items-center gap-2 text-green-300">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span>Acesso ao Plano de Carreira</span>
                      </Label>
                      <Switch checked={!!editingUser.has_plano_carreira_access} onCheckedChange={(c) => handleFieldChange('has_plano_carreira_access', c)} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                      <Label className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-cyan-400" />
                        <span>Promover a Atleta em Destaque</span>
                      </Label>
                      <Switch checked={!!editingUser.is_featured} onCheckedChange={(c) => handleFieldChange('is_featured', c)} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-red-500/30 rounded-xl">
                      <Label className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-red-400" />
                        <span>Função / Permissão</span>
                      </Label>
                      <Select
                        value={editingUser.role === 'admin' ? 'admin' : editingUser.is_revela_admin ? 'revela_admin' : 'user'}
                        onValueChange={handleRoleChange}
                      >
                        <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A1A] border-white/10">
                          <SelectItem value="user">Usuário Padrão</SelectItem>
                          <SelectItem value="revela_admin">Admin Revela</SelectItem>
                          <SelectItem value="admin">Admin Geral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

            </ScrollArea>

            <DialogFooter className="border-t border-white/10 pt-4">
              <DialogClose asChild>
                <Button variant="ghost" className="text-gray-400 hover:text-white">Cancelar</Button>
              </DialogClose>
              <Button 
                onClick={handleModalSave}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold"
              >
                <Check className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }

      <Dialog open={!!editingPerformanceItem} onOpenChange={() => setEditingPerformanceItem(null)}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl">
          <DialogHeader><DialogTitle>Analisar Performance</DialogTitle></DialogHeader>
          {editingPerformanceItem &&
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
              {editingPerformanceItem.associated_video_url &&
            <div className="space-y-3">
                  <video key={editingPerformanceItem.associated_video_url} controls className="w-full rounded-lg" src={editingPerformanceItem.associated_video_url}></video>
                  <div className="p-4 bg-gray-800 rounded-lg space-y-2">
                    <h4 className="font-semibold text-white">Diário do Atleta</h4>
                    <p className="text-sm text-gray-400"><strong className="text-gray-300">Sentimento:</strong> "{editingPerformanceItem.athlete_feeling || 'N/A'}"</p>
                    <p className="text-sm text-gray-400"><strong className="text-gray-300">Resumo da Semana:</strong> "{editingPerformanceItem.athlete_weekly_summary || 'N/A'}"</p>
                  </div>
                </div>
            }
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-gray-400">Adversário</Label><Input value={performanceForm.opponent} onChange={(e) => setPerformanceForm((p) => ({ ...p, opponent: e.target.value }))} className="bg-gray-800 border-gray-700" /></div>
                <div><Label className="text-gray-400">Data</Label><Input type="date" value={performanceForm.game_date} onChange={(e) => setPerformanceForm((p) => ({ ...p, game_date: e.target.value }))} className="bg-gray-800 border-gray-700" /></div>
                <div><Label className="text-gray-400">Minutos Jogados</Label><Input type="number" value={performanceForm.minutes_played} onChange={(e) => setPerformanceForm((p) => ({ ...p, minutes_played: parseInt(e.target.value) }))} className="bg-gray-800 border-gray-700" /></div>
                <div><Label className="text-gray-400">Gols</Label><Input type="number" value={performanceForm.goals} onChange={(e) => setPerformanceForm((p) => ({ ...p, goals: parseInt(e.target.value) }))} className="bg-gray-800 border-gray-700" /></div>
                <div><Label className="text-gray-400">Assistências</Label><Input type="number" value={performanceForm.assists} onChange={(e) => setPerformanceForm((p) => ({ ...p, assists: parseInt(e.target.value) }))} className="bg-gray-800 border-gray-700" /></div>
                <div><Label className="text-gray-400">Nota (1-10)</Label><Input type="number" step="0.1" value={performanceForm.rating} onChange={(e) => setPerformanceForm((p) => ({ ...p, rating: parseFloat(e.target.value) }))} className="bg-gray-800 border-gray-700" /></div>
              </div>
              <div><Label className="text-gray-400">Observações do Analista</Label><Textarea value={performanceForm.analyst_notes} onChange={(e) => setPerformanceForm((p) => ({ ...p, analyst_notes: e.target.value }))} className="bg-gray-800 border-gray-700 h-24" /></div>
              <DialogFooter><Button variant="outline" onClick={() => setEditingPerformanceItem(null)}>Cancelar</Button><Button onClick={handleSavePerformanceUpdate}>Salvar Performance</Button></DialogFooter>
            </div>
          }
        </DialogContent>
      </Dialog>
    </div>);

}
                  const userData = getUserData(editingUser.id);
                  return (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Performance do Atleta</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <Card className="bg-gray-800 border-gray-700"><CardContent className="p-4 text-center"><Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" /><p className="text-2xl font-bold text-white">{userData.performance.length}</p><p className="text-xs text-gray-300">Total de Jogos</p></CardContent></Card>
                          <Card className="bg-gray-800 border-gray-700"><CardContent className="p-4 text-center"><Target className="w-8 h-8 text-green-400 mx-auto mb-2" /><p className="text-2xl font-bold text-white">{userData.performance.reduce((sum, p) => sum + (p.goals || 0), 0)}</p><p className="text-xs text-gray-300">Total de Gols</p></CardContent></Card>
                          <Card className="bg-gray-800 border-gray-700"><CardContent className="p-4 text-center"><BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" /><p className="text-2xl font-bold text-white">{userData.performance.length > 0 ? (userData.performance.reduce((sum, p) => sum + (p.rating || 0), 0) / userData.performance.length).toFixed(1) : '0.0'}</p><p className="text-xs text-gray-300">Nota Média</p></CardContent></Card>
                        </div>
                        <div className="space-y-2"><h4 className="font-medium">Últimas Performances</h4><div className="space-y-2 max-h-40 overflow-y-auto">{userData.performance.map((perf) => <div key={perf.id} className="p-2 bg-gray-800 rounded text-sm flex justify-between items-center"><div><p className="text-white">vs {perf.opponent}</p><p className="text-gray-400">{new Date(perf.game_date).toLocaleDateString()} - Nota: {perf.rating}/10</p></div><Button variant="ghost" size="icon" onClick={() => handleStartEditPerformance(perf)}><Edit className="w-4 h-4 text-gray-400 hover:text-white" /></Button></div>)}{userData.performance.length === 0 && <p className="text-gray-500 text-sm">Nenhuma performance registrada.</p>}</div></div>
                      </div>);

                })()}
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  {(() => {
                  const userData = getUserData(editingUser.id);
                  return (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Progresso nos Conteúdos</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="bg-gray-800 border-gray-700"><CardContent className="p-4 text-center"><Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" /><p className="text-2xl font-bold text-white">{userData.progress.length}</p><p className="text-xs text-gray-300">Conteúdos Acessados</p></CardContent></Card>
                          <Card className="bg-gray-800 border-gray-700"><CardContent className="p-4 text-center"><Check className="w-8 h-8 text-green-400 mx-auto mb-2" /><p className="text-2xl font-bold text-white">{userData.progress.filter((p) => p.completed).length}</p><p className="text-xs text-gray-300">Concluídos</p></CardContent></Card>
                        </div>
                        <div className="space-y-2"><h4 className="font-medium">Progresso Recente</h4><div className="space-y-2 max-h-40 overflow-y-auto">{userData.progress.slice(0, 10).map((prog) => <div key={prog.id} className="p-2 bg-gray-800 rounded text-sm"><div className="flex justify-between items-center"><p className="text-white">Conteúdo ID: {prog.content_id.slice(-8)}</p><Badge className={prog.completed ? 'bg-green-600' : 'bg-yellow-600'}>{prog.completed ? 'Concluído' : `${prog.progress_percentage}%`}</Badge></div></div>)}{userData.progress.length === 0 && <p className="text-gray-500 text-sm">Nenhum progresso de conteúdo registrado.</p>}</div></div>
                      </div>);

                })()}
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  {(() => {
                  const userData = getUserData(editingUser.id);
                  return (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Uploads do Atleta</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <Card className="bg-gray-800 border-gray-700"><CardContent className="p-4 text-center"><Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" /><p className="text-2xl font-bold text-white">{userData.uploads.length}</p><p className="text-xs text-gray-300">Total Uploads</p></CardContent></Card>
                          <Card className="bg-gray-800 border-gray-700"><CardContent className="p-4 text-center"><Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" /><p className="text-2xl font-bold text-white">{userData.uploads.filter((u) => u.is_featured).length}</p><p className="text-xs text-gray-300">Em Destaque</p></CardContent></Card>
                        </div>
                        <div className="space-y-2"><h4 className="font-medium">Últimos Uploads</h4><div className="space-y-2 max-h-60 overflow-y-auto">{userData.uploads.slice(0, 10).map((upload) => <div key={upload.id} className="p-2 bg-gray-800 rounded text-sm"><div className="flex justify-between items-center"><div><p className="text-white">{upload.file_name}</p><p className="text-gray-400">{upload.category} - {new Date(upload.created_date).toLocaleDateString()}</p></div><div className="flex items-center gap-2"><Badge className={upload.processing_status === 'completed' ? 'bg-green-600' : upload.processing_status === 'processing' ? 'bg-yellow-600' : upload.processing_status === 'pending' ? 'bg-blue-600' : 'bg-red-600'}>{upload.processing_status}</Badge><Button variant="ghost" size="icon" onClick={() => handleToggleFeatureUpload(upload)} className={upload.is_featured ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-500 hover:text-yellow-400'}><Star className="w-4 h-4" /></Button></div></div></div>)}{userData.uploads.length === 0 && <p className="text-gray-500 text-sm">Nenhum upload encontrado.</p>}</div></div>
                      </div>);

                })()}
                </TabsContent>
                
                <TabsContent value="messages" className="space-y-4">
                  {(() => {
                  const userMessages = data.messages.
                  filter((m) => m.sender_id === editingUser.id || m.receiver_id === editingUser.id).
                  sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime());

                  return (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Histórico de Mensagens</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto rounded-lg bg-black/20 p-2">{userMessages.map((msg) => <div key={msg.id} className={`flex ${msg.sender_id === editingUser.id ? 'justify-end' : 'justify-start'}`}><div className={`max-w-md p-3 rounded-lg ${msg.sender_id === editingUser.id ? 'bg-blue-600' : 'bg-gray-700'}`}><p className="text-sm text-white">{msg.content}</p><p className={`text-xs mt-1 ${msg.sender_id === editingUser.id ? 'text-blue-200' : 'text-gray-400'}`}>{new Date(msg.created_date).toLocaleString('pt-BR')}</p></div></div>)}{userMessages.length === 0 && <p className="text-gray-500 text-center py-4 text-sm">Nenhuma mensagem encontrada.</p>}</div>
                        <div className="pt-4 space-y-2"><Textarea placeholder={`Responder para ${editingUser.full_name}...`} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="bg-gray-800 border-gray-700 text-white resize-none" rows={2} /><div className="flex justify-between items-center"><div className="flex items-center gap-2"><span className="text-xs text-gray-400">Como:</span><Select value={replyAs} onValueChange={setReplyAs}><SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{personas.map((p) => <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>)}</SelectContent></Select></div><Button onClick={handleSendMessageInModal} disabled={isSending || !newMessage} size="sm">{isSending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}Enviar</Button></div></div>
                      </div>);

                })()}
                </TabsContent>
              </ScrollArea>
            </Tabs>

            <DialogFooter className="mt-4">
              <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
              <Button type="button" onClick={handleModalSave}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }

      <Dialog open={!!editingPerformanceItem} onOpenChange={() => setEditingPerformanceItem(null)}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl">
          <DialogHeader><DialogTitle>Analisar Performance</DialogTitle></DialogHeader>
          {editingPerformanceItem &&
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
              {editingPerformanceItem.associated_video_url &&
            <div className="space-y-3">
                  <video key={editingPerformanceItem.associated_video_url} controls className="w-full rounded-lg" src={editingPerformanceItem.associated_video_url}></video>
                  <div className="p-4 bg-gray-800 rounded-lg space-y-2">
                    <h4 className="font-semibold text-white">Diário do Atleta</h4>
                    <p className="text-sm text-gray-400"><strong className="text-gray-300">Sentimento:</strong> "{editingPerformanceItem.athlete_feeling || 'N/A'}"</p>
                    <p className="text-sm text-gray-400"><strong className="text-gray-300">Resumo da Semana:</strong> "{editingPerformanceItem.athlete_weekly_summary || 'N/A'}"</p>
                  </div>
                </div>
            }
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-gray-400">Adversário</Label><Input value={performanceForm.opponent} onChange={(e) => setPerformanceForm((p) => ({ ...p, opponent: e.target.value }))} className="bg-gray-800 border-gray-700" /></div>
                <div><Label className="text-gray-400">Data</Label><Input type="date" value={performanceForm.game_date} onChange={(e) => setPerformanceForm((p) => ({ ...p, game_date: e.target.value }))} className="bg-gray-800 border-gray-700" /></div>
                <div><Label className="text-gray-400">Minutos Jogados</Label><Input type="number" value={performanceForm.minutes_played} onChange={(e) => setPerformanceForm((p) => ({ ...p, minutes_played: parseInt(e.target.value) }))} className="bg-gray-800 border-gray-700" /></div>
                <div><Label className="text-gray-400">Gols</Label><Input type="number" value={performanceForm.goals} onChange={(e) => setPerformanceForm((p) => ({ ...p, goals: parseInt(e.target.value) }))} className="bg-gray-800 border-gray-700" /></div>
                <div><Label className="text-gray-400">Assistências</Label><Input type="number" value={performanceForm.assists} onChange={(e) => setPerformanceForm((p) => ({ ...p, assists: parseInt(e.target.value) }))} className="bg-gray-800 border-gray-700" /></div>
                <div><Label className="text-gray-400">Nota (1-10)</Label><Input type="number" step="0.1" value={performanceForm.rating} onChange={(e) => setPerformanceForm((p) => ({ ...p, rating: parseFloat(e.target.value) }))} className="bg-gray-800 border-gray-700" /></div>
              </div>
              <div><Label className="text-gray-400">Observações do Analista</Label><Textarea value={performanceForm.analyst_notes} onChange={(e) => setPerformanceForm((p) => ({ ...p, analyst_notes: e.target.value }))} className="bg-gray-800 border-gray-700 h-24" /></div>
              <DialogFooter><Button variant="outline" onClick={() => setEditingPerformanceItem(null)}>Cancelar</Button><Button onClick={handleSavePerformanceUpdate}>Salvar Performance</Button></DialogFooter>
            </div>
          }
        </DialogContent>
      </Dialog>
    </div>);

}