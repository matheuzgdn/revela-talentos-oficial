
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { appClient } from '@/api/backendClient';
import { toast } from 'sonner';
import { 
  User, 
  Video, 
  Trophy, 
  Upload, 
  CheckCircle,
  Loader2,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AthletePanel({ user, applications, onUpdate }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [videos, setVideos] = useState([]);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', url: '', description: '', category: 'jogo' });

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        birth_date: user.birth_date || '',
        phone: user.phone || '',
        city: user.city || '',
        state: user.state || '',
        position: user.position || '',
        height: user.height || '',
        weight: user.weight || '',
        preferred_foot: user.preferred_foot || '',
        club: user.club || '',
        playing_style: user.playing_style || '',
        career_objectives: user.career_objectives || '',
        strengths: user.strengths ? user.strengths.join(', ') : '',
        areas_improvement: user.areas_improvement ? user.areas_improvement.join(', ') : ''
      });
      loadVideos();
    }
  }, [user]);

  const loadVideos = async () => {
    try {
      const athleteVideos = await appClient.entities.AthleteUpload.filter({ 
        user_id: user.id,
        file_type: 'video'
      }, '-created_date');
      setVideos(athleteVideos);
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await appClient.auth.updateMe({
        full_name: profileData.full_name,
        birth_date: profileData.birth_date,
        phone: profileData.phone,
        city: profileData.city,
        state: profileData.state,
        position: profileData.position,
        height: profileData.height ? parseFloat(profileData.height) : null,
        weight: profileData.weight ? parseFloat(profileData.weight) : null,
        preferred_foot: profileData.preferred_foot,
        club: profileData.club,
        playing_style: profileData.playing_style,
        career_objectives: profileData.career_objectives,
        strengths: profileData.strengths ? profileData.strengths.split(',').map(s => s.trim()) : [],
        areas_improvement: profileData.areas_improvement ? profileData.areas_improvement.split(',').map(s => s.trim()) : []
      });
      
      toast.success('Perfil atualizado com sucesso!');
      setIsEditingProfile(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Erro ao salvar perfil.');
    }
    setIsSaving(false);
  };

  const handleAddVideo = async () => {
    if (!newVideo.url || !newVideo.title) {
      toast.error('Preencha o título e a URL do vídeo');
      return;
    }

    setIsUploadingVideo(true);
    try {
      await appClient.entities.AthleteUpload.create({
        user_id: user.id,
        file_url: newVideo.url,
        file_name: newVideo.title,
        file_type: 'video',
        category: newVideo.category,
        description: newVideo.description,
        processing_status: 'completed'
      });
      
      toast.success('Vídeo adicionado com sucesso!');
      setNewVideo({ title: '', url: '', description: '', category: 'jogo' });
      loadVideos();
    } catch (error) {
      console.error('Error adding video:', error);
      toast.error('Erro ao adicionar vídeo.');
    }
    setIsUploadingVideo(false);
  };

  const handleDeleteVideo = async (videoId) => {
    if (!confirm('Tem certeza que deseja remover este vídeo?')) return;
    
    try {
      await appClient.entities.AthleteUpload.delete(videoId);
      toast.success('Vídeo removido com sucesso!');
      loadVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Erro ao remover vídeo.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      under_review: 'bg-blue-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500',
      waitlist: 'bg-purple-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Aguardando Análise',
      under_review: 'Em Análise',
      approved: 'Aprovado',
      rejected: 'Não Aprovado',
      waitlist: 'Lista de Espera'
    };
    return labels[status] || status;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <User className="w-6 h-6 text-yellow-400" />
            Meu Painel de Atleta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="profile" className="data-[state=active]:bg-yellow-500">
                <User className="w-4 h-4 mr-2" />
                Meu Perfil
              </TabsTrigger>
              <TabsTrigger value="videos" className="data-[state=active]:bg-yellow-500">
                <Video className="w-4 h-4 mr-2" />
                Meus Vídeos ({videos.length})
              </TabsTrigger>
              <TabsTrigger value="applications" className="data-[state=active]:bg-yellow-500">
                <Trophy className="w-4 h-4 mr-2" />
                Candidaturas ({applications.length})
              </TabsTrigger>
            </TabsList>

            {/* ABA PERFIL */}
            <TabsContent value="profile" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Dados Pessoais</h3>
                <Button
                  onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
                  disabled={isSaving}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</>
                  ) : isEditingProfile ? (
                    <><CheckCircle className="w-4 h-4 mr-2" />Salvar Alterações</>
                  ) : (
                    <><Edit className="w-4 h-4 mr-2" />Editar Perfil</>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Nome Completo</Label>
                  <Input
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                    disabled={!isEditingProfile}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Data de Nascimento</Label>
                  <Input
                    type="date"
                    value={profileData.birth_date}
                    onChange={(e) => setProfileData({...profileData, birth_date: e.target.value})}
                    disabled={!isEditingProfile}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Telefone/WhatsApp</Label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditingProfile}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Posição</Label>
                  <Input
                    value={profileData.position}
                    onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                    disabled={!isEditingProfile}
                    placeholder="Ex: Atacante, Meio-Campo, Zagueiro"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Cidade</Label>
                  <Input
                    value={profileData.city}
                    onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                    disabled={!isEditingProfile}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Estado</Label>
                  <Input
                    value={profileData.state}
                    onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                    disabled={!isEditingProfile}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Altura (cm)</Label>
                  <Input
                    type="number"
                    value={profileData.height}
                    onChange={(e) => setProfileData({...profileData, height: e.target.value})}
                    disabled={!isEditingProfile}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Peso (kg)</Label>
                  <Input
                    type="number"
                    value={profileData.weight}
                    onChange={(e) => setProfileData({...profileData, weight: e.target.value})}
                    disabled={!isEditingProfile}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Pé Preferido</Label>
                  <Select 
                    value={profileData.preferred_foot} 
                    onValueChange={(v) => setProfileData({...profileData, preferred_foot: v})}
                    disabled={!isEditingProfile}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direito">Direito</SelectItem>
                      <SelectItem value="esquerdo">Esquerdo</SelectItem>
                      <SelectItem value="ambidestro">Ambidestro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Clube Atual</Label>
                  <Input
                    value={profileData.club}
                    onChange={(e) => setProfileData({...profileData, club: e.target.value})}
                    disabled={!isEditingProfile}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-gray-300">Estilo de Jogo</Label>
                  <Textarea
                    value={profileData.playing_style}
                    onChange={(e) => setProfileData({...profileData, playing_style: e.target.value})}
                    disabled={!isEditingProfile}
                    className="bg-gray-800 border-gray-700 text-white h-20"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-gray-300">Objetivos de Carreira</Label>
                  <Textarea
                    value={profileData.career_objectives}
                    onChange={(e) => setProfileData({...profileData, career_objectives: e.target.value})}
                    disabled={!isEditingProfile}
                    className="bg-gray-800 border-gray-700 text-white h-20"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Pontos Fortes (separados por vírgula)</Label>
                  <Input
                    value={profileData.strengths}
                    onChange={(e) => setProfileData({...profileData, strengths: e.target.value})}
                    disabled={!isEditingProfile}
                    placeholder="Ex: Velocidade, Finalização"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Áreas para Melhoria (separados por vírgula)</Label>
                  <Input
                    value={profileData.areas_improvement}
                    onChange={(e) => setProfileData({...profileData, areas_improvement: e.target.value})}
                    disabled={!isEditingProfile}
                    placeholder="Ex: Marcação, Jogo aéreo"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </TabsContent>

            {/* ABA VÍDEOS */}
            <TabsContent value="videos" className="space-y-6 mt-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Upload className="w-5 h-5 text-yellow-400" />
                    Adicionar Novo Vídeo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Título do Vídeo</Label>
                      <Input
                        value={newVideo.title}
                        onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                        placeholder="Ex: Melhores Momentos - Final"
                        className="bg-gray-900 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Categoria</Label>
                      <Select 
                        value={newVideo.category} 
                        onValueChange={(v) => setNewVideo({...newVideo, category: v})}
                      >
                        <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jogo">Jogo</SelectItem>
                          <SelectItem value="treino">Treino</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">URL do Vídeo</Label>
                    <Input
                      value={newVideo.url}
                      onChange={(e) => setNewVideo({...newVideo, url: e.target.value})}
                      placeholder="https://youtube.com/watch?v=... ou https://drive.google.com/..."
                      className="bg-gray-900 border-gray-600 text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Cole o link do YouTube, Google Drive, Vimeo ou WeTransfer
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Descrição (opcional)</Label>
                    <Textarea
                      value={newVideo.description}
                      onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                      placeholder="Adicione detalhes sobre o vídeo..."
                      className="bg-gray-900 border-gray-600 text-white h-20"
                    />
                  </div>
                  <Button
                    onClick={handleAddVideo}
                    disabled={isUploadingVideo}
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                  >
                    {isUploadingVideo ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adicionando...</>
                    ) : (
                      <><Upload className="w-4 h-4 mr-2" />Adicionar Vídeo</>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Lista de Vídeos */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">Meus Vídeos ({videos.length})</h3>
                {videos.length === 0 ? (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-8 text-center">
                      <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Você ainda não adicionou nenhum vídeo.</p>
                      <p className="text-gray-500 text-sm mt-2">
                        Adicione seus melhores momentos para usar nas candidaturas!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                      {videos.map((video, index) => (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500/50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-white mb-1">{video.file_name}</h4>
                                  <Badge className="bg-yellow-600 text-black text-xs">
                                    {video.category}
                                  </Badge>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-white"
                                    onClick={() => window.open(video.file_url, '_blank')}
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-400 hover:text-red-500"
                                    onClick={() => handleDeleteVideo(video.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              {video.description && (
                                <p className="text-sm text-gray-400 mt-2">{video.description}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-2">
                                Adicionado em {new Date(video.created_date).toLocaleDateString('pt-BR')}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ABA CANDIDATURAS */}
            <TabsContent value="applications" className="space-y-6 mt-6">
              <h3 className="text-xl font-semibold text-white">Minhas Candidaturas ({applications.length})</h3>
              
              {applications.length === 0 ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Você ainda não se candidatou a nenhuma seletiva.</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Explore as oportunidades disponíveis abaixo!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <Card key={app.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-lg mb-2">
                              Seletiva #{app.event_id.slice(-8)}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span>Candidatura: {new Date(app.created_date).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(app.status)} text-white`}>
                            {getStatusLabel(app.status)}
                          </Badge>
                        </div>

                        {app.video_url && (
                          <div className="mb-3">
                            <Label className="text-gray-400 text-sm">Vídeo Enviado:</Label>
                            <a 
                              href={app.video_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm mt-1"
                            >
                              <Eye className="w-4 h-4" />
                              Ver Vídeo
                            </a>
                          </div>
                        )}

                        {app.analyst_notes && (
                          <div className="bg-gray-900 rounded-lg p-3 mt-3">
                            <p className="text-xs text-gray-500 mb-1">Observações do Analista:</p>
                            <p className="text-sm text-gray-300">{app.analyst_notes}</p>
                          </div>
                        )}

                        {app.feedback && (
                          <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-3 mt-3">
                            <p className="text-xs text-green-500 font-semibold mb-1">Feedback:</p>
                            <p className="text-sm text-green-300">{app.feedback}</p>
                          </div>
                        )}

                        {app.rating && (
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-sm text-gray-400">Avaliação:</span>
                            <div className="flex items-center gap-1">
                              {[...Array(10)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-6 rounded ${
                                    i < app.rating ? 'bg-yellow-400' : 'bg-gray-700'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 font-bold text-yellow-400">{app.rating}/10</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

