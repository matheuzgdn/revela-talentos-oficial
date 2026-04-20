import React, { useState, useEffect } from 'react';
import { appClient } from '@/api/backendClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Star, Upload, Save, X, Users, Briefcase, Newspaper } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminStoriesTab() {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStory, setEditingStory] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    category: 'atleta',
    media_url: '',
    media_type: 'photo',
    thumbnail_url: '',
    description: '',
    link_url: '',
    is_featured: false,
    display_order: 0,
    is_active: true
  });

  const loadStories = async () => {
    setIsLoading(true);
    try {
      const data = await appClient.entities.AthleteStory.list('display_order');
      setStories(data);
    } catch (error) {
      console.error('Error loading stories:', error);
      toast.error('Erro ao carregar stories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStory) {
        await appClient.entities.AthleteStory.update(editingStory.id, formData);
        toast.success('Story atualizado!');
      } else {
        await appClient.entities.AthleteStory.create(formData);
        toast.success('Story criado!');
      }
      resetForm();
      loadStories();
    } catch (error) {
      console.error('Error saving story:', error);
      toast.error('Erro ao salvar story');
    }
  };

  const handleEdit = (story) => {
    setEditingStory(story);
    setFormData(story);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este story?')) return;
    try {
      await appClient.entities.AthleteStory.delete(id);
      toast.success('Story deletado!');
      loadStories();
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error('Erro ao deletar story');
    }
  };

  const resetForm = () => {
    setEditingStory(null);
    setFormData({
      title: '',
      category: 'atleta',
      media_url: '',
      media_type: 'photo',
      thumbnail_url: '',
      description: '',
      link_url: '',
      is_featured: false,
      display_order: 0,
      is_active: true
    });
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.info('Enviando arquivo...');
      const { file_url } = await appClient.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, [field]: file_url });
      toast.success('Arquivo enviado!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erro ao enviar arquivo');
    }
  };

  const categoryIcons = {
    atleta: Users,
    vaga: Briefcase,
    novidade: Newspaper
  };

  const categoryLabels = {
    atleta: 'Atleta',
    vaga: 'Vaga',
    novidade: 'Novidade'
  };

  const categoryColors = {
    atleta: 'text-cyan-400',
    vaga: 'text-green-400',
    novidade: 'text-yellow-400'
  };

  const filteredStories = filterCategory === 'all' 
    ? stories 
    : stories.filter(s => s.category === filterCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Destaques RT</h2>
          <p className="text-gray-400 text-sm">Stories de atletas, vagas e novidades</p>
        </div>
      </div>

      {/* Form */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-cyan-400" />
            {editingStory ? 'Editar Story' : 'Novo Story'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Título *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: João Silva, Vaga Lateral, Nova Parceria"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Categoria *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                  required
                >
                  <option value="atleta">Atleta</option>
                  <option value="vaga">Vaga</option>
                  <option value="novidade">Novidade</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Tipo de Mídia *</label>
                <select
                  value={formData.media_type}
                  onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                  required
                >
                  <option value="photo">Foto</option>
                  <option value="video">Vídeo</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Ordem</label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                {formData.media_type === 'video' ? 'URL do Vídeo' : 'URL da Foto'} *
              </label>
              <div className="flex gap-2">
                <Input
                  value={formData.media_url}
                  onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                  placeholder="Cole a URL ou faça upload"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept={formData.media_type === 'video' ? 'video/*' : 'image/*'}
                    onChange={(e) => handleFileUpload(e, 'media_url')}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" className="whitespace-nowrap">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </label>
              </div>
            </div>

            {formData.media_type === 'video' && (
              <div>
                <label className="block text-white text-sm font-medium mb-2">URL da Thumbnail</label>
                <div className="flex gap-2">
                  <Input
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    placeholder="Thumbnail para o vídeo"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'thumbnail_url')}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" className="whitespace-nowrap">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </label>
                </div>
              </div>
            )}

            <div>
              <label className="block text-white text-sm font-medium mb-2">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Adicione uma descrição"
                className="bg-gray-800 border-gray-700 text-white"
                rows={3}
              />
            </div>

            {(formData.category === 'vaga' || formData.category === 'novidade') && (
              <div>
                <label className="block text-white text-sm font-medium mb-2">Link Externo</label>
                <Input
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="https://..."
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            )}

            <div className="flex gap-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-cyan-600 bg-gray-800 border-gray-700 rounded"
                />
                <label htmlFor="is_featured" className="text-white text-sm cursor-pointer">
                  ⭐ Destaque
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-cyan-600 bg-gray-800 border-gray-700 rounded"
                />
                <label htmlFor="is_active" className="text-white text-sm cursor-pointer">
                  Ativo
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                <Save className="w-4 h-4 mr-2" />
                {editingStory ? 'Atualizar' : 'Criar Story'}
              </Button>
              {editingStory && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex gap-2">
        <Button
          variant={filterCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterCategory('all')}
          size="sm"
        >
          Todos ({stories.length})
        </Button>
        <Button
          variant={filterCategory === 'atleta' ? 'default' : 'outline'}
          onClick={() => setFilterCategory('atleta')}
          size="sm"
        >
          Atletas ({stories.filter(s => s.category === 'atleta').length})
        </Button>
        <Button
          variant={filterCategory === 'vaga' ? 'default' : 'outline'}
          onClick={() => setFilterCategory('vaga')}
          size="sm"
        >
          Vagas ({stories.filter(s => s.category === 'vaga').length})
        </Button>
        <Button
          variant={filterCategory === 'novidade' ? 'default' : 'outline'}
          onClick={() => setFilterCategory('novidade')}
          size="sm"
        >
          Novidades ({stories.filter(s => s.category === 'novidade').length})
        </Button>
      </div>

      {/* Stories Grid - FIFA Style Player Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : filteredStories.length === 0 ? (
          <p className="text-gray-400">Nenhum story encontrado</p>
        ) : (
          filteredStories.map((story, index) => {
            const Icon = categoryIcons[story.category];
            
            // Cores do gradiente baseadas na categoria
            const gradients = {
              atleta: 'from-[#FFD700] via-[#FFA500] to-[#FF6B00]', // Dourado/Laranja
              vaga: 'from-[#00FF87] via-[#00D9FF] to-[#0099FF]', // Verde/Ciano
              novidade: 'from-[#FF1493] via-[#FF69B4] to-[#FFB6C1]' // Rosa/Pink
            };

            return (
              <div
                key={story.id}
                className="relative group perspective-1000"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* FIFA Card Container */}
                <div className={`relative bg-gradient-to-br ${gradients[story.category]} p-[3px] rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:rotate-y-5`}>
                  <div className="relative bg-gradient-to-b from-black/95 via-[#0A1520] to-black rounded-2xl overflow-hidden">
                    
                    {/* Card Header - Rating & Position Style */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="flex flex-col items-center">
                        <div className={`text-5xl font-black bg-gradient-to-br ${gradients[story.category]} bg-clip-text text-transparent`}>
                          {story.display_order || 99}
                        </div>
                        <div className={`text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${gradients[story.category]} bg-clip-text text-transparent`}>
                          {categoryLabels[story.category]}
                        </div>
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {story.is_featured && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-2 shadow-xl animate-pulse">
                          <Star className="w-4 h-4 text-black" fill="black" />
                        </div>
                      </div>
                    )}

                    {/* Player Image/Media */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
                      
                      <img
                        src={story.thumbnail_url || story.media_url}
                        alt={story.title}
                        className="w-full h-full object-cover filter contrast-125 brightness-110"
                      />

                      {/* Holographic Overlay Effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Inactive Overlay */}
                      {!story.is_active && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-red-500 font-black text-2xl tracking-wider transform -rotate-12">
                            INATIVO
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Footer - Player Name & Details */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-4 pt-8">
                      <div className="relative">
                        {/* Name */}
                        <h3 className="text-white font-black text-xl mb-1 uppercase tracking-tight leading-tight line-clamp-1">
                          {story.title}
                        </h3>
                        
                        {/* Description */}
                        {story.description && (
                          <p className="text-gray-400 text-xs leading-snug line-clamp-2 mb-3">
                            {story.description}
                          </p>
                        )}

                        {/* Stats Bar */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`flex-1 h-1 bg-gradient-to-r ${gradients[story.category]} rounded-full`} />
                          <span className="text-xs text-gray-500 font-mono">
                            {story.media_type === 'video' ? 'Vídeo' : 'Foto'}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEdit(story)}
                            className={`flex-1 bg-gradient-to-r ${gradients[story.category]} hover:opacity-90 text-black font-bold border-none shadow-lg`}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(story.id)}
                            className="bg-red-600 hover:bg-red-700 border-none shadow-lg"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                         style={{ 
                           background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
                           backgroundSize: '200% 200%',
                           animation: 'shine 3s ease-in-out infinite'
                         }} 
                    />
                  </div>
                </div>

                {/* Shadow Effect */}
                <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4/5 h-4 bg-gradient-to-r ${gradients[story.category]} blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes shine {
          0%, 100% {
            background-position: 200% 0;
          }
          50% {
            background-position: -200% 0;
          }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .rotate-y-5:hover {
          transform: rotateY(5deg) scale(1.05);
        }
      `}</style>
    </div>
  );
}
