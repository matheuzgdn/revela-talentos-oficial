import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
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
      const data = await base44.entities.AthleteStory.list('display_order');
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
        await base44.entities.AthleteStory.update(editingStory.id, formData);
        toast.success('Story atualizado!');
      } else {
        await base44.entities.AthleteStory.create(formData);
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
      await base44.entities.AthleteStory.delete(id);
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
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
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
                  <option value="atleta">👤 Atleta</option>
                  <option value="vaga">💼 Vaga</option>
                  <option value="novidade">📰 Novidade</option>
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
                  <option value="photo">📷 Foto</option>
                  <option value="video">🎥 Vídeo</option>
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
                  ✅ Ativo
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
          👤 Atletas ({stories.filter(s => s.category === 'atleta').length})
        </Button>
        <Button
          variant={filterCategory === 'vaga' ? 'default' : 'outline'}
          onClick={() => setFilterCategory('vaga')}
          size="sm"
        >
          💼 Vagas ({stories.filter(s => s.category === 'vaga').length})
        </Button>
        <Button
          variant={filterCategory === 'novidade' ? 'default' : 'outline'}
          onClick={() => setFilterCategory('novidade')}
          size="sm"
        >
          📰 Novidades ({stories.filter(s => s.category === 'novidade').length})
        </Button>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : filteredStories.length === 0 ? (
          <p className="text-gray-400">Nenhum story encontrado</p>
        ) : (
          filteredStories.map((story) => {
            const Icon = categoryIcons[story.category];
            return (
              <Card key={story.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                <div className="relative aspect-[9/16] bg-gray-800">
                  <img
                    src={story.thumbnail_url || story.media_url}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  {!story.is_active && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">INATIVO</span>
                    </div>
                  )}
                  {story.is_featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                      ⭐ DESTAQUE
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <Icon className={`w-3 h-3 ${categoryColors[story.category]}`} />
                    <span className="text-white">{categoryLabels[story.category]}</span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-white font-bold mb-1">{story.title}</h3>
                  <p className="text-gray-400 text-xs mb-2">
                    {story.media_type === 'video' ? '🎥 Vídeo' : '📷 Foto'} • Ordem: {story.display_order}
                  </p>
                  {story.description && (
                    <p className="text-gray-500 text-xs line-clamp-2 mb-3">{story.description}</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(story)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(story.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}