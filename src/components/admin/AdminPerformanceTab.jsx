import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart3,
  Target,
  Calendar,
  Edit,
  Plus,
  Trophy,
  TrendingUp,
  Video,
  EyeOff,
  Eye
} from "lucide-react";
import { toast } from "sonner";

export default function AdminPerformanceTab({ performanceData, users, onRefresh }) {
  const [editingPerformance, setEditingPerformance] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [collapsedUsers, setCollapsedUsers] = useState(new Set());

  const getUserById = (userId) => {
    return users.find(user => user.id === userId);
  };

  // Agrupar performances por usuário
  const performancesByUser = useMemo(() => {
    const grouped = {};
    base44.entities.PerformanceData.forEach(performance => {
      const userId = performance.user_id;
      if (!grouped[userId]) {
        grouped[userId] = [];
      }
      grouped[userId].push(performance);
    });
    
    // Ordenar performances de cada usuário por data
    Object.keys(grouped).forEach(userId => {
      grouped[userId].sort((a, b) => new Date(b.game_date) - new Date(a.game_date));
    });
    
    return grouped;
  }, [performanceData]);

  const toggleUserVisibility = (userId) => {
    const newCollapsed = new Set(collapsedUsers);
    if (newCollapsed.has(userId)) {
      newCollapsed.delete(userId);
    } else {
      newCollapsed.add(userId);
    }
    setCollapsedUsers(newCollapsed);
  };

  const handleEditPerformance = (performance) => {
    setEditingPerformance(performance);
    setEditForm({
      opponent: performance.opponent,
      game_date: performance.game_date,
      minutes_played: performance.minutes_played,
      goals: performance.goals || 0,
      assists: performance.assists || 0,
      rating: performance.rating,
      analyst_notes: performance.analyst_notes || ""
    });
  };

  const handleSavePerformance = async () => {
    try {
      const payload = editingPerformance
        ? { ...editForm, status: 'completed' }
        : { user_id: selectedUserId, ...editForm, status: 'completed' };

      if (!payload.game_date) {
        toast.error("A data do jogo é obrigatória.");
        return;
      }

      if (editingPerformance) {
        await base44.entities.PerformanceData.update(editingPerformance.id, payload);
        toast.success("Performance atualizada com sucesso!");
      } else {
        await base44.entities.PerformanceData.create(payload);
        toast.success("Performance adicionada com sucesso!");
      }
      resetForm();
      onRefresh();
    } catch (error) {
      toast.error("Erro ao salvar performance");
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingPerformance(null);
    setShowAddForm(false);
    setEditForm({});
    setSelectedUserId("");
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'text-green-400';
    if (rating >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusBadge = (status) => {
    return status === 'pending_analysis' ? (
      <Badge className="bg-yellow-600 text-white">Pendente</Badge>
    ) : (
      <Badge className="bg-green-600 text-white">Concluído</Badge>
    );
  };

  const getPendingCount = (userPerformances) => {
    return userPerformances.filter(p => p.status === 'pending_analysis').length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Análise de Performance dos Atletas</h3>
        <Button 
          onClick={() => { setShowAddForm(true); setEditingPerformance(null); }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Análise Manual
        </Button>
      </div>

      {/* Add/Edit Performance Form */}
      {(editingPerformance || showAddForm) && (
        <Card className="bg-black border-green-400/50">
          <CardHeader>
            <CardTitle className="text-green-400">
              {editingPerformance ? `Analisando: ${getUserById(editingPerformance.user_id)?.full_name}` : 'Nova Análise Manual'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editingPerformance?.associated_video_url && (
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <h4 className="text-sm font-semibold text-white mb-3">Diário do Atleta</h4>
                <div className="space-y-3 text-sm">
                  <p><strong className="text-gray-400">Sentimento na Partida:</strong> <span className="text-gray-200 italic">"{editingPerformance.athlete_feeling || 'N/A'}"</span></p>
                  <p><strong className="text-gray-400">Resumo da Semana:</strong> <span className="text-gray-200 italic">"{editingPerformance.athlete_weekly_summary || 'N/A'}"</span></p>
                </div>
                <Button asChild size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700">
                  <a href={editingPerformance.associated_video_url} target="_blank" rel="noopener noreferrer">
                    <Video className="w-4 h-4 mr-2"/> Ver Vídeo da Partida
                  </a>
                </Button>
              </div>
            )}
            
            {!editingPerformance && (
              <div>
                <label className="block text-white mb-2">Selecionar Usuário</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2"
                  required
                >
                  <option value="">Selecione um usuário...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name} - {user.email}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Adversário</label>
                <Input
                  value={editForm.opponent || ''}
                  onChange={(e) => setEditForm(prev => ({...prev, opponent: e.target.value}))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Nome do time adversário"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Data do Jogo</label>
                <Input
                  type="date"
                  value={editForm.game_date || ''}
                  onChange={(e) => setEditForm(prev => ({...prev, game_date: e.target.value}))}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Minutos Jogados</label>
                <Input
                  type="number"
                  value={editForm.minutes_played || ''}
                  onChange={(e) => setEditForm(prev => ({...prev, minutes_played: parseInt(e.target.value)}))}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Gols</label>
                <Input
                  type="number"
                  value={editForm.goals || 0}
                  onChange={(e) => setEditForm(prev => ({...prev, goals: parseInt(e.target.value)}))}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Assistências</label>
                <Input
                  type="number"
                  value={editForm.assists || 0}
                  onChange={(e) => setEditForm(prev => ({...prev, assists: parseInt(e.target.value)}))}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Nota (1-10)</label>
                <Input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  value={editForm.rating || ''}
                  onChange={(e) => setEditForm(prev => ({...prev, rating: parseFloat(e.target.value)}))}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-white mb-2">Observações do Analista</label>
              <textarea
                value={editForm.analyst_notes || ''}
                onChange={(e) => setEditForm(prev => ({...prev, analyst_notes: e.target.value}))}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 h-24"
                placeholder="Observações sobre a performance..."
              />
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleSavePerformance} 
                className="bg-green-600 hover:bg-green-700"
                disabled={!editingPerformance && !selectedUserId}
              >
                {editingPerformance ? 'Atualizar' : 'Adicionar'} Performance
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Cards by User */}
      <div className="space-y-6">
        {Object.entries(performancesByUser).map(([userId, userPerformances]) => {
          const user = getUserById(userId);
          if (!user) return null;
          
          const isCollapsed = collapsedUsers.has(userId);
          const pendingCount = getPendingCount(userPerformances);

          return (
            <div key={userId} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.profile_picture_url} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-white text-lg">{user.full_name}</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-400 text-sm">{userPerformances.length} performance(s) registrada(s)</p>
                      {pendingCount > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">
                          {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleUserVisibility(userId)}
                  className="text-gray-400 hover:text-white"
                >
                  {isCollapsed ? (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Mostrar
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Ocultar
                    </>
                  )}
                </Button>
              </div>

              {!isCollapsed && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userPerformances.map((performance) => (
                    <Card key={performance.id} className="bg-black border-gray-800 hover:border-gray-600 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="font-medium text-white">vs {performance.opponent}</h5>
                              {getStatusBadge(performance.status)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="w-4 h-4" />
                              {new Date(performance.game_date).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPerformance(performance)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                            <Target className="w-5 h-5 text-green-400 mx-auto mb-1" />
                            <p className="text-2xl font-bold text-white">{performance.goals || 0}</p>
                            <p className="text-xs text-gray-400">Gols</p>
                          </div>
                          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                            <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                            <p className="text-2xl font-bold text-white">{performance.assists || 0}</p>
                            <p className="text-xs text-gray-400">Assistências</p>
                          </div>
                          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                            <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                            <p className={`text-2xl font-bold ${getRatingColor(performance.rating)}`}>
                              {performance.rating ? `${performance.rating}/10` : '-'}
                            </p>
                            <p className="text-xs text-gray-400">Nota</p>
                          </div>
                        </div>

                        <div className="text-sm">
                          <p className="text-gray-400">Minutos: {performance.minutes_played}</p>
                          {performance.analyst_notes && (
                            <p className="text-gray-300 mt-2 italic">"{performance.analyst_notes}"</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {base44.entities.PerformanceData.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <BarChart3 className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Nenhuma performance registrada</h3>
          <p>Adicione dados de performance para começar as análises.</p>
        </div>
      )}
    </div>
  );
}
