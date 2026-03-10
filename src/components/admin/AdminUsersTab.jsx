import React, { useState, useMemo, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";





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
import AdminAthleteDetailsModal from "./AdminAthleteDetailsModal";
import InviteAthleteModal from "./InviteAthleteModal";
import CreateMemberUserModal from "./CreateMemberUserModal";
import {
  Edit, Search, Check, Star, Shield, TrendingUp, X, BarChart3, Upload, Eye, Target, Trophy,
  Send, Loader2, Megaphone, Crown, Plus, Users,
  GitBranch, EyeOff, Lock, Unlock, Bell, MessageCircle, Trash2
} from
  "lucide-react";

const NON_EDITABLE_KEYS = new Set([
  'id', 'created_date', 'updated_date', 'role', 'password', 'token',
  'provider', 'email_verified', 'auth_provider', 'email'
]);

const AthleteCard = ({ user, userData, onEdit, onSave, pipelines, userPipelines, onSendNotification, onProfileVisit, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [draft, setDraft] = useState({});
  const [jsonErrors, setJsonErrors] = useState({});

  const openModal = () => {
    setDraft({ ...user });
    setJsonErrors({});
    setShowEditModal(true);
  };

  const handleFieldChange = (key, value) => {
    setDraft(d => ({ ...d, [key]: value }));
    setJsonErrors(e => ({ ...e, [key]: null }));
  };

  const handleJsonChange = (key, raw) => {
    try {
      const parsed = JSON.parse(raw);
      setDraft(d => ({ ...d, [key]: parsed }));
      setJsonErrors(e => ({ ...e, [key]: null }));
    } catch {
      setJsonErrors(e => ({ ...e, [key]: 'JSON invalido' }));
    }
  };

  const hasJsonError = Object.values(jsonErrors).some(Boolean);

  const handleSaveModal = async () => {
    if (hasJsonError) return;
    try {
      const updateData = Object.fromEntries(
        Object.entries(draft).filter(([k]) => !NON_EDITABLE_KEYS.has(k))
      );
      await base44.entities.User.update(user.id, updateData);
      toast.success('Atleta atualizado com sucesso!');
      setShowEditModal(false);
      onSave?.();
    } catch {
      toast.error('Erro ao salvar.');
    }
  };

  const pendingAnalysis = userData.performance.filter((p) => p.status === 'pending_analysis').length;
  const pendingMarketing = userData.marketing?.filter((p) => p.status === 'pending').length || 0;
  const hasNotifications = pendingAnalysis > 0 || pendingMarketing > 0;

  const userPipelineInfo = userPipelines.find((up) => up.user_id === user.id);
  const currentPipeline = userPipelineInfo ? pipelines.find((p) => p.id === userPipelineInfo.pipeline_id) : null;

  const getAccessBadges = () => {
    const badges = [];
    if (!user.is_approved) {
      badges.push(<Badge key="pending" className="bg-red-600/20 text-red-400 border-red-600/50">Aguardando Aprovacao</Badge>);
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
    <>
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
          <div className="flex gap-1 flex-shrink-0">
            <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20" onClick={() => onSendNotification(user)} title="Enviar notificacao">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20" onClick={() => onProfileVisit(user)} title="Notificar visita ao perfil">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={() => onEdit(user)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/20" onClick={() => onDelete(user)} title="Excluir Atleta">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {user.position && <p className="text-xs text-gray-500">{user.position} - {user.club || 'Sem clube'}</p>}

        <div className="flex flex-wrap gap-2">
          {getAccessBadges()}
        </div>

        {currentPipeline &&
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <GitBranch className="w-4 h-4 text-purple-400" />
            <span className="truncate">{currentbase44.entities.Pipeline.name}</span>
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

        <Button
          size="sm"
          variant="outline"
          className="w-full border-cyan-700/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500"
          onClick={openModal}
        >
          <Edit className="w-3 h-3 mr-2" /> Editar Atleta
        </Button>
      </motion.div>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-gray-950 border-gray-800 text-white max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Edit className="w-4 h-4 text-cyan-400" />
              Editar: {user.full_name}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-2">
            <div className="space-y-3 py-2">
              {Object.entries(draft)
                .filter(([key]) => !NON_EDITABLE_KEYS.has(key))
                .map(([key, value]) => {
                  const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                  const valType = value === null || value === undefined ? 'null'
                    : typeof value === 'boolean' ? 'boolean'
                      : typeof value === 'number' ? 'number'
                        : typeof value === 'string' ? 'string'
                          : 'json';
                  return (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs text-gray-400 font-medium">{label}</Label>
                      {valType === 'boolean' ? (
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={!!draft[key]}
                            onCheckedChange={(c) => handleFieldChange(key, c)}
                            className="data-[state=checked]:bg-cyan-500"
                          />
                          <span className="text-xs text-gray-500">{draft[key] ? 'Sim' : 'Nao'}</span>
                        </div>
                      ) : valType === 'json' ? (
                        <div>
                          <Textarea
                            defaultValue={JSON.stringify(value, null, 2)}
                            onChange={(e) => handleJsonChange(key, e.target.value)}
                            className="bg-gray-900 border-gray-700 text-white text-xs font-mono min-h-[80px]"
                          />
                          {jsonErrors[key] && <p className="text-red-400 text-xs mt-1">{jsonErrors[key]}</p>}
                        </div>
                      ) : (
                        <Input
                          type={valType === 'number' ? 'number' : 'text'}
                          value={draft[key] ?? ''}
                          onChange={(e) => handleFieldChange(key, valType === 'number' ? Number(e.target.value) : e.target.value)}
                          className="bg-gray-900 border-gray-700 text-white h-8 text-sm"
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          </ScrollArea>

          <DialogFooter className="pt-3 border-t border-gray-800">
            <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button
              disabled={hasJsonError}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
              onClick={handleSaveModal}
            >
              <Check className="w-4 h-4 mr-2" /> Salvar Alteracoes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );

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
      await base44.entities.Pipeline.create(newPipeline);
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
          <Card key={base44.entities.Pipeline.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-${base44.entities.Pipeline.color}-500`} />
                {base44.entities.Pipeline.name}
              </CardTitle>
              <p className="text-xs text-gray-400">{base44.entities.Pipeline.description}</p>
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
                  value={newbase44.entities.Pipeline.name}
                  onChange={(e) => setNewPipeline((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-800 border-gray-700" />

              </div>
              <div>
                <Label>Cor</Label>
                <Select value={newbase44.entities.Pipeline.color} onValueChange={(v) => setNewPipeline((prev) => ({ ...prev, color: v }))}>
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
                value={newbase44.entities.Pipeline.description}
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
                {newbase44.entities.Pipeline.stages.map((stage, index) =>
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
            <Button onClick={handleCreatePipeline} disabled={!newbase44.entities.Pipeline.name}>
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
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTarget, setNotificationTarget] = useState(null);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'message',
    priority: 'medium'
  });
  const [userToDelete, setUserToDelete] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateMemberModal, setShowCreateMemberModal] = useState(false);

  const personas = [
    { id: "analyst_01", name: "Analista de Desempenho" },
    { id: "physio_01", name: "Preparador Físico" },
    { id: "mentor_01", name: "Mentor de Carreira" },
    { id: "marketing_01", name: "Equipe de Marketing" }];


  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load only users initially
      const users = await base44.entities.User.list('-created_date', 100);
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
      base44.entities.Pipeline.filter({ is_active: true }).then((pipelines) => {
        setData((prev) => ({ ...prev, pipelines }));
      }).catch(() => { });

      base44.entities.UserPipeline.list().then((userPipelines) => {
        setData((prev) => ({ ...prev, userPipelines }));
      }).catch(() => { });
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
      const settings = await base44.entities.PlatformSettings.list();
      const restrictionSetting = settings.find((s) => s.setting_key === 'is_platform_restricted');
      setIsPlatformRestricted(restrictionSetting?.setting_value === 'true');
    } catch (error) {
      console.error('Error loading platform settings:', error);
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleSendNotification = (user) => {
    setNotificationTarget(user);
    setNotificationForm({
      title: '',
      message: '',
      type: 'message',
      priority: 'medium'
    });
    setShowNotificationModal(true);
  };

  const handleProfileVisit = async (user) => {
    try {
      await base44.entities.Notification.create({
        user_id: user.id,
        title: 'Visita ao Perfil',
        message: 'Eric Cena visitou seu perfil',
        type: 'profile_visit',
        priority: 'medium'
      });
      toast.success(`Notificação de visita enviada para ${user.full_name}`);
    } catch (error) {
      console.error('Error sending visit notification:', error);
      toast.error('Erro ao enviar notificação');
    }
  };

  const handleSubmitNotification = async () => {
    if (!notificationForm.title || !notificationForm.message) {
      toast.error('Preencha título e mensagem');
      return;
    }

    try {
      await base44.entities.Notification.create({
        user_id: notificationTarget.id,
        title: notificationForm.title,
        message: notificationForm.message,
        type: notificationForm.type,
        priority: notificationForm.priority
      });
      toast.success(`Notificação enviada para ${notificationTarget.full_name}`);
      setShowNotificationModal(false);
      setNotificationTarget(null);
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Erro ao enviar notificação');
    }
  };

  const togglePlatformRestriction = async () => {
    try {
      const settings = await base44.entities.PlatformSettings.list();
      const restrictionSetting = settings.find((s) => s.setting_key === 'is_platform_restricted');

      const newValue = !isPlatformRestricted;

      if (restrictionSetting) {
        await base44.entities.PlatformSettings.update(restrictionSetting.id, {
          setting_value: newValue.toString()
        });
      } else {
        await base44.entities.PlatformSettings.create({
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

      await base44.entities.User.update(id, updateData);

      await base44.entities.Notification.create({
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

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await base44.entities.User.delete(userToDelete.id);
      toast.success("Atleta excluído com sucesso.");
      setUserToDelete(null);
      loadAllData();
    } catch (error) {
      console.error("Erro ao excluir atleta:", error);
      toast.error("Erro ao excluir o atleta. Tente novamente.");
    }
  };

  const handleToggleFeatureUpload = async (upload) => {
    try {
      await base44.entities.AthleteUpload.update(upload.id, { is_featured: !upload.is_featured });
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

      await base44.entities.ChatMessage.create({
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
      await base44.entities.PerformanceData.update(editingPerformanceItem.id, {
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
        base44.entities.AthleteUpload.filter({ user_id: userId }, "-created_date", 20),
        base44.entities.ChatMessage.filter({
          $or: [{ sender_id: userId }, { receiver_id: userId }]
        }, "-created_date", 50),
        base44.entities.PerformanceData.filter({ user_id: userId }, "-game_date", 20),
        base44.entities.UserProgress.filter({ user_id: userId }, null, 50)]
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
              <Button onClick={() => setShowInviteModal(true)} className="bg-cyan-600 hover:bg-cyan-500">
              <Plus className="w-4 h-4 mr-2" /> Cadastrar Atleta
              </Button>
              <Button onClick={() => setShowCreateMemberModal(true)} className="bg-emerald-600 hover:bg-emerald-500">
              <Plus className="w-4 h-4 mr-2" /> Cadastrar Usu e1rio Zona de Membros
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
                          onDelete={handleDeleteUser}
                          onSendNotification={handleSendNotification}
                          onProfileVisit={handleProfileVisit}
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
                          onDelete={handleDeleteUser}
                          onSendNotification={handleSendNotification}
                          onProfileVisit={handleProfileVisit}
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
                          onDelete={handleDeleteUser}
                          onSendNotification={handleSendNotification}
                          onProfileVisit={handleProfileVisit}
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
                        onDelete={handleDeleteUser}
                        onSendNotification={handleSendNotification}
                        onProfileVisit={handleProfileVisit}
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
                        onDelete={handleDeleteUser}
                        onSendNotification={handleSendNotification}
                        onProfileVisit={handleProfileVisit}
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
                    onDelete={handleDeleteUser}
                    onSendNotification={handleSendNotification}
                    onProfileVisit={handleProfileVisit}
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

      <InviteAthleteModal
        open={showInviteModal}
        onOpenChange={setShowInviteModal}
        onInvited={() => {
          setShowInviteModal(false);
          toast.success("Convite enviado com sucesso!");
          loadAllData();
        }}
      />
      <CreateMemberUserModal
        open={showCreateMemberModal}
        onOpenChange={setShowCreateMemberModal}
        onInvited={() => {
          setShowCreateMemberModal(false);
          loadAllData();
        }}
      />
      <AdminAthleteDetailsModal
        user={editingUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSave={loadAllData}
      />

      <Dialog open={showNotificationModal} onOpenChange={setShowNotificationModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" />
              Enviar Notificação para {notificationTarget?.full_name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-gray-400">Tipo</Label>
              <Select value={notificationForm.type} onValueChange={(v) => setNotificationForm((prev) => ({ ...prev, type: v }))}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="message">Mensagem</SelectItem>
                  <SelectItem value="profile_visit">Visita ao Perfil</SelectItem>
                  <SelectItem value="achievement">Conquista</SelectItem>
                  <SelectItem value="general">Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-400">Prioridade</Label>
              <Select value={notificationForm.priority} onValueChange={(v) => setNotificationForm((prev) => ({ ...prev, priority: v }))}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-400">Título</Label>
              <Input value={notificationForm.title} onChange={(e) => setNotificationForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Ex: Nova mensagem" className="bg-gray-800 border-gray-700" />
            </div>
            <div>
              <Label className="text-gray-400">Mensagem</Label>
              <Textarea value={notificationForm.message} onChange={(e) => setNotificationForm((prev) => ({ ...prev, message: e.target.value }))} placeholder="Digite sua mensagem aqui..." className="bg-gray-800 border-gray-700 h-24" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotificationModal(false)}>Cancelar</Button>
            <Button onClick={handleSubmitNotification} className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4 mr-2" />
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent className="bg-gray-950 border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <Trash2 className="w-5 h-5" />
              Excluir Atleta
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-gray-300">
            Tem certeza de que deseja excluir permanentemente o atleta <strong>{userToDelete?.full_name}</strong>? Esta ação não pode ser desfeita e todos os dados serão perdidos.
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" className="text-gray-400 border-gray-700 hover:bg-gray-800" onClick={() => setUserToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser} className="bg-red-600 hover:bg-red-700">
              <Trash2 className="w-4 h-4 mr-2" /> Excluir Definitivamente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);

}