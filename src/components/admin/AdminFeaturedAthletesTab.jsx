import React, { useState, useEffect } from 'react';
import { appClient } from '@/api/backendClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Star, Edit, Trash2, Eye, Video, Upload, Loader2 } from 'lucide-react';

export default function AdminFeaturedAthletesTab() {
  const [athletes, setAthletes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    athlete_name: '',
    position: '',
    club_name: '',
    club_crest_url: '',
    photo_url: '',
    video_url: '',
    bio: '',
    stats: { games: 0, goals: 0, assists: 0 },
    is_active: true,
    display_order: 0,
    category: 'atleta'
  });

  useEffect(() => {
    loadAthletes();
  }, []);

  const loadAthletes = async () => {
    setIsLoading(true);
    try {
      const data = await appClient.entities.AthleteStory.filter(
        { category: 'atleta' },
        'display_order',
        100
      );
      setAthletes(data || []);
    } catch (error) {
      console.error('Erro ao carregar atletas:', error);
      toast.error('Erro ao carregar atletas em destaque');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAthlete(null);
    setFormData({
      athlete_name: '',
      position: '',
      club_name: '',
      club_crest_url: '',
      photo_url: '',
      video_url: '',
      bio: '',
      stats: { games: 0, goals: 0, assists: 0 },
      is_active: true,
      display_order: athletes.length,
      category: 'atleta'
    });
    setShowModal(true);
  };

  const handleEdit = (athlete) => {
    setEditingAthlete(athlete);
    setFormData({
      athlete_name: athlete.athlete_name || '',
      position: athlete.position || '',
      club_name: athlete.club_name || '',
      club_crest_url: athlete.club_crest_url || '',
      photo_url: athlete.photo_url || '',
      video_url: athlete.video_url || '',
      bio: athlete.bio || '',
      stats: athlete.stats || { games: 0, goals: 0, assists: 0 },
      is_active: athlete.is_active !== false,
      display_order: athlete.display_order || 0,
      category: 'atleta'
    });
    setShowModal(true);
  };

  const handleDelete = async (athlete) => {
    if (!confirm(`Remover ${athlete.athlete_name} dos destaques?`)) return;
    try {
      await appClient.entities.AthleteStory.delete(athlete.id);
      toast.success('Atleta removido com sucesso!');
      loadAthletes();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao remover atleta');
    }
  };

  const handleFileUpload = async (file, field) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await appClient.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, [field]: file_url }));
      toast.success('Upload concluído!');
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao fazer upload');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.athlete_name || !formData.position || !formData.photo_url) {
      toast.error('Preencha nome, posição e foto');
      return;
    }

    try {
      if (editingAthlete) {
        await appClient.entities.AthleteStory.update(editingAthlete.id, formData);
        toast.success('Atleta atualizado!');
      } else {
        await appClient.entities.AthleteStory.create(formData);
        toast.success('Atleta criado!');
      }
      setShowModal(false);
      loadAthletes();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar atleta');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="w-6 h-6 text-yellow-400" fill="#FFD700" />
          <div>
            <h2 className="text-2xl font-bold text-white">Atletas em Destaque</h2>
            <p className="text-sm text-gray-400">Figurinhas de futebol exibidas na página inicial</p>
          </div>
        </div>
        <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400">
          <Plus className="w-4 h-4 mr-2" />
          Novo Atleta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{athletes.length}</p>
            <p className="text-xs text-gray-400">Total de Atletas</p>
          </CardContent>
        </Card>
        <Card className="bg-green-900/20 border-green-800">
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{athletes.filter(a => a.is_active).length}</p>
            <p className="text-xs text-gray-400">Ativos</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-900/20 border-blue-800">
          <CardContent className="p-4 text-center">
            <Video className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{athletes.filter(a => a.video_url).length}</p>
            <p className="text-xs text-gray-400">Com Vídeo</p>
          </CardContent>
        </Card>
      </div>

      {/* Athletes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {athletes.map((athlete, index) => (
            <motion.div
              key={athlete.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all"
            >
              {/* Athlete Photo */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
                {athlete.photo_url ? (
                  <img 
                    src={athlete.photo_url} 
                    alt={athlete.athlete_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Star className="w-16 h-16 text-gray-600" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className={athlete.is_active ? 'bg-green-500/80 text-white' : 'bg-gray-500/80 text-white'}>
                    {athlete.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>

                {/* Video Badge */}
                {athlete.video_url && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-purple-500/80 text-white flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      Vídeo
                    </Badge>
                  </div>
                )}

                {/* Club Crest */}
                {athlete.club_crest_url && (
                  <div className="absolute bottom-2 left-2 w-10 h-10 bg-white/90 rounded-lg p-1">
                    <img src={athlete.club_crest_url} alt={athlete.club_name} className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-white font-bold text-lg truncate">{athlete.athlete_name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                      {athlete.position || 'Sem posição'}
                    </Badge>
                    {athlete.club_name && (
                      <span className="text-xs text-gray-400 truncate">{athlete.club_name}</span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                {athlete.stats && (
                  <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                    <div className="bg-white/5 rounded-lg p-2">
                      <p className="text-xs text-gray-400">Jogos</p>
                      <p className="text-white font-bold">{athlete.stats.games || 0}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                      <p className="text-xs text-gray-400">Gols</p>
                      <p className="text-white font-bold">{athlete.stats.goals || 0}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                      <p className="text-xs text-gray-400">Assists</p>
                      <p className="text-white font-bold">{athlete.stats.assists || 0}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleEdit(athlete)}
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-gray-600 hover:border-cyan-500"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    onClick={() => handleDelete(athlete)}
                    variant="outline" 
                    size="sm"
                    className="border-gray-600 hover:border-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {athletes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Star className="w-16 h-16 mx-auto mb-4 text-gray-700" />
          <h3 className="text-lg font-medium text-white mb-2">Nenhum atleta em destaque</h3>
          <p className="mb-4">Crie atletas em destaque para exibir na página inicial</p>
          <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-600 to-cyan-500">
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Atleta
          </Button>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              {editingAthlete ? 'Editar Atleta em Destaque' : 'Novo Atleta em Destaque'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Nome do Atleta *</Label>
                <Input
                  value={formData.athlete_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, athlete_name: e.target.value }))}
                  placeholder="Ex: Cristiano Ronaldo"
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div>
                <Label className="text-gray-400">Posição *</Label>
                <Select 
                  value={formData.position} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, position: v }))}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="goleiro">Goleiro</SelectItem>
                    <SelectItem value="zagueiro">Zagueiro</SelectItem>
                    <SelectItem value="lateral">Lateral</SelectItem>
                    <SelectItem value="volante">Volante</SelectItem>
                    <SelectItem value="meia">Meia</SelectItem>
                    <SelectItem value="atacante">Atacante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Club Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Nome do Clube</Label>
                <Input
                  value={formData.club_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, club_name: e.target.value }))}
                  placeholder="Ex: Real Madrid"
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div>
                <Label className="text-gray-400">Escudo do Clube</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.club_crest_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, club_crest_url: e.target.value }))}
                    placeholder="URL do escudo"
                    className="bg-gray-800 border-gray-700 flex-1"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    disabled={uploading}
                    onClick={() => document.getElementById('club-crest-upload').click()}
                    className="border-gray-700"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <input
                    id="club-crest-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'club_crest_url')}
                  />
                </div>
              </div>
            </div>

            {/* Photo */}
            <div>
              <Label className="text-gray-400">Foto do Atleta * (Estilo Recortado)</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.photo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, photo_url: e.target.value }))}
                  placeholder="URL da foto recortada"
                  className="bg-gray-800 border-gray-700 flex-1"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => document.getElementById('photo-upload').click()}
                  className="border-gray-700"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files[0], 'photo_url')}
                />
              </div>
              {formData.photo_url && (
                <div className="mt-2 w-24 h-32 bg-gray-800 rounded-lg overflow-hidden">
                  <img src={formData.photo_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Video */}
            <div>
              <Label className="text-gray-400">Vídeo do Atleta</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder="URL do vídeo"
                  className="bg-gray-800 border-gray-700 flex-1"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => document.getElementById('video-upload').click()}
                  className="border-gray-700"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files[0], 'video_url')}
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <Label className="text-gray-400">Biografia / Descrição</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Breve biografia ou conquistas do atleta..."
                className="bg-gray-800 border-gray-700 h-20"
              />
            </div>

            {/* Stats */}
            <div>
              <Label className="text-gray-400 mb-2 block">Estatísticas</Label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-gray-500">Jogos</Label>
                  <Input
                    type="number"
                    value={formData.stats.games}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      stats: { ...prev.stats, games: parseInt(e.target.value) || 0 }
                    }))}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Gols</Label>
                  <Input
                    type="number"
                    value={formData.stats.goals}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      stats: { ...prev.stats, goals: parseInt(e.target.value) || 0 }
                    }))}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Assistências</Label>
                  <Input
                    type="number"
                    value={formData.stats.assists}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      stats: { ...prev.stats, assists: parseInt(e.target.value) || 0 }
                    }))}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Ordem de Exibição</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-400">Ativo na página inicial</span>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={uploading} className="bg-blue-600 hover:bg-blue-700">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : editingAthlete ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
