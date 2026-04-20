import React, { useState, useEffect } from "react";
import { appClient } from "@/api/backendClient";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Plus, Search, Edit, Trash2, Users, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminSchedulesTab() {
  const [schedules, setSchedules] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const [scheduleForm, setScheduleForm] = useState({
    user_id: "",
    opponent: "",
    game_date: "",
    venue: "",
    competition: "",
    status: "scheduled",
    home_away: "home",
    importance: "medium",
    preparation_notes: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [schedulesData, usersData] = await Promise.all([
        appClient.entities.GameSchedule.list("-game_date").catch(() => []),
        appClient.entities.User.list().catch(() => [])
      ]);

      // Garantir que sempre temos arrays, mesmo se a API falhar
      setSchedules(Array.isArray(schedulesData) ? schedulesData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar agenda");
      // Inicializar com arrays vazios em caso de erro
      setSchedules([]);
      setUsers([]);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSchedule) {
        await appClient.entities.GameSchedule.update(editingSchedule.id, scheduleForm);
        toast.success("Jogo atualizado com sucesso!");
      } else {
        await appClient.entities.GameSchedule.create(scheduleForm);
        toast.success("Jogo agendado com sucesso!");
      }
      
      setShowAddModal(false);
      setEditingSchedule(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Erro ao salvar jogo:", error);
      toast.error("Erro ao salvar jogo");
    }
  };

  const handleEdit = (schedule) => {
    setScheduleForm({
      user_id: schedule.user_id || "",
      opponent: schedule.opponent || "",
      game_date: schedule.game_date ? new Date(schedule.game_date).toISOString().slice(0, 16) : "",
      venue: schedule.venue || schedule.location || "",
      competition: schedule.competition || "",
      status: schedule.status || "scheduled",
      home_away: schedule.home_away || "home",
      importance: schedule.importance || "medium",
      preparation_notes: schedule.preparation_notes || ""
    });
    setEditingSchedule(schedule);
    setShowAddModal(true);
  };

  const handleDelete = async (scheduleId) => {
    if (confirm("Tem certeza que deseja excluir este jogo?")) {
      try {
        await appClient.entities.GameSchedule.delete(scheduleId);
        toast.success("Jogo excluÃ­do com sucesso!");
        loadData();
      } catch (error) {
        console.error("Erro ao excluir jogo:", error);
        toast.error("Erro ao excluir jogo");
      }
    }
  };

  const resetForm = () => {
    setScheduleForm({
      user_id: "",
      opponent: "",
      game_date: "",
      venue: "",
      competition: "",
      status: "scheduled",
      home_away: "home",
      importance: "medium",
      preparation_notes: ""
    });
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingSchedule(null);
    resetForm();
  };

  // Filtrar schedules com verificaÃ§Ã£o de seguranÃ§a
  const filteredSchedules = Array.isArray(schedules) ? schedules.filter(schedule => {
    if (!schedule) return false;
    
    const matchesSearch = !searchTerm || 
      (schedule.opponent && schedule.opponent.toLowerCase().includes(searchTerm.toLowerCase())) ||
      ((schedule.venue || schedule.location) && (schedule.venue || schedule.location).toLowerCase().includes(searchTerm.toLowerCase())) ||
      (schedule.competition && schedule.competition.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || schedule.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  }) : [];

  const getStatusBadge = (status) => {
    const statusStyles = {
      scheduled: "bg-blue-500",
      completed: "bg-green-500",
      cancelled: "bg-red-500"
    };
    
    const statusLabels = {
      scheduled: "Agendado",
      completed: "ConcluÃ­do", 
      cancelled: "Cancelado"
    };

    return (
      <Badge className={`${statusStyles[status] || statusStyles.scheduled} text-white`}>
        {statusLabels[status] || status}
      </Badge>
    );
  };

  const getImportanceBadge = (importance) => {
    const importanceStyles = {
      low: "bg-gray-500",
      medium: "bg-yellow-500",
      high: "bg-red-500"
    };
    
    const importanceLabels = {
      low: "Baixa",
      medium: "MÃ©dia",
      high: "Alta"
    };

    return (
      <Badge className={`${importanceStyles[importance] || importanceStyles.medium} text-white`}>
        {importanceLabels[importance] || importance}
      </Badge>
    );
  };

  const getUserName = (userId) => {
    if (!Array.isArray(users) || !userId) return "UsuÃ¡rio nÃ£o encontrado";
    const user = users.find(u => u && u.id === userId);
    return user ? user.full_name || user.email || "UsuÃ¡rio sem nome" : "UsuÃ¡rio nÃ£o encontrado";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p className="ml-2 text-gray-400">Carregando agenda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Gerenciamento de Agenda</h3>
          <p className="text-gray-400">Gerencie jogos e eventos dos atletas</p>
        </div>
        
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Agendar Jogo
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingSchedule ? "Editar Jogo" : "Agendar Novo Jogo"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Atleta</label>
                  <Select value={scheduleForm.user_id} onValueChange={(value) => setScheduleForm({...scheduleForm, user_id: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue placeholder="Selecione o atleta" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(users) && users.map((user) => (
                        user && user.id && (
                          <SelectItem key={user.id} value={user.id}>
                            {user.full_name || user.email || "UsuÃ¡rio sem nome"}
                          </SelectItem>
                        )
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">AdversÃ¡rio</label>
                  <Input
                    value={scheduleForm.opponent}
                    onChange={(e) => setScheduleForm({...scheduleForm, opponent: e.target.value})}
                    placeholder="Nome do adversÃ¡rio"
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Data e Hora</label>
                  <Input
                    type="datetime-local"
                    value={scheduleForm.game_date}
                    onChange={(e) => setScheduleForm({...scheduleForm, game_date: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Local</label>
                  <Input
                    value={scheduleForm.venue}
                    onChange={(e) => setScheduleForm({...scheduleForm, venue: e.target.value})}
                    placeholder="EstÃ¡dio ou local do jogo"
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">CompetiÃ§Ã£o</label>
                  <Input
                    value={scheduleForm.competition}
                    onChange={(e) => setScheduleForm({...scheduleForm, competition: e.target.value})}
                    placeholder="Ex: Campeonato Paulista"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Status</label>
                  <Select value={scheduleForm.status} onValueChange={(value) => setScheduleForm({...scheduleForm, status: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Agendado</SelectItem>
                      <SelectItem value="completed">ConcluÃ­do</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Casa/Fora</label>
                  <Select value={scheduleForm.home_away} onValueChange={(value) => setScheduleForm({...scheduleForm, home_away: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Casa</SelectItem>
                      <SelectItem value="away">Fora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-300 mb-1 block">ImportÃ¢ncia</label>
                  <Select value={scheduleForm.importance} onValueChange={(value) => setScheduleForm({...scheduleForm, importance: value})}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">MÃ©dia</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-1 block">Notas de PreparaÃ§Ã£o</label>
                <Input
                  value={scheduleForm.preparation_notes}
                  onChange={(e) => setScheduleForm({...scheduleForm, preparation_notes: e.target.value})}
                  placeholder="ObservaÃ§Ãµes sobre a preparaÃ§Ã£o para o jogo"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleModalClose}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingSchedule ? "Atualizar" : "Agendar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por adversÃ¡rio, local ou competiÃ§Ã£o..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="scheduled">Agendado</SelectItem>
            <SelectItem value="completed">ConcluÃ­do</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Schedules List */}
      <div className="space-y-4">
        {filteredSchedules.length > 0 ? (
          filteredSchedules.map((schedule) => (
            <motion.div
              key={schedule?.id || Math.random()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 border border-gray-800 rounded-lg p-6"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">
                      vs {schedule?.opponent || "AdversÃ¡rio desconhecido"}
                    </h4>
                    {getStatusBadge(schedule?.status)}
                    {getImportanceBadge(schedule?.importance)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{getUserName(schedule?.user_id)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {schedule?.game_date ? 
                          new Date(schedule.game_date).toLocaleString('pt-BR') : 
                          "Data nÃ£o definida"
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{schedule?.venue || schedule?.location || "Local nÃ£o definido"}</span>
                    </div>
                  </div>

                  {schedule?.competition && (
                    <p className="text-sm text-gray-500 mt-2">
                      CompetiÃ§Ã£o: {schedule.competition}
                    </p>
                  )}

                  {schedule?.preparation_notes && (
                    <p className="text-sm text-gray-400 mt-2">
                      Notas: {schedule.preparation_notes}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(schedule)}
                    className="border-gray-600 hover:bg-gray-800"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(schedule?.id)}
                    className="border-red-600 text-red-400 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-8 text-center">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhum jogo encontrado</h3>
              <p className="text-gray-400 mb-4">
                {searchTerm || filterStatus !== "all" 
                  ? "Nenhum jogo corresponde aos filtros aplicados."
                  : "Ainda nÃ£o hÃ¡ jogos agendados. Comece agendando o primeiro jogo."
                }
              </p>
              {(!searchTerm && filterStatus === "all") && (
                <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Agendar Primeiro Jogo
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}



