
import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Video, Edit, Plus, Star,
  Loader2, Package, ExternalLink, Radio, Trash, GripVertical, Flame
} from "lucide-react";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import AdminLiveTab from "./content/AdminLiveTab";

const categories = [
  { value: 'mentoria', label: 'Mentoria' }, 
  { value: 'treino_tatico', label: 'Treino Tático' },
  { value: 'preparacao_fisica', label: 'Preparação Física' }, 
  { value: 'psicologia', label: 'Psicologia' },
  { value: 'nutricao', label: 'Nutrição' }, 
  { value: 'live', label: 'Live Ao Vivo' },
  { value: 'planos', label: 'Planos' }, 
  { value: 'atletas', label: 'Nossos Atletas' }
];

// Componente para item de plano com drag handle
function PlanoItem({ plano, onEdit, onDelete, dragHandleProps }) {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Drag Handle */}
          <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing mt-1 p-1">
            <GripVertical className="w-5 h-5 text-gray-500" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{plano.title}</h3>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              <Badge className="bg-purple-600 text-white text-xs">
                {categories.find(c => c.value === plano.category)?.label || plano.category}
              </Badge>
              <Badge className={`${plano.is_published ? 'bg-green-600' : 'bg-gray-600'} text-white text-xs`}>
                {plano.is_published ? 'Publicado' : 'Rascunho'}
              </Badge>
              {plano.is_featured && <Star className="w-4 h-4 text-yellow-400" />}
              {plano.is_top_10 && (
                <Badge className="bg-red-600 text-white text-xs flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Top 10
                </Badge>
              )}
              {plano.external_link && (
                <Badge className="bg-sky-600 text-white text-xs flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Link Externo
                </Badge>
              )}
              {plano.display_order !== undefined && (
                <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                  Ordem: {plano.display_order + 1}
                </Badge>
              )}
            </div>
            {plano.description && (
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">{plano.description}</p>
            )}
          </div>

          <div className="flex gap-1 ml-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(plano)} className="text-gray-400 hover:text-white h-8 w-8">
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => onDelete(plano.id)}
              className="h-8 w-8"
              title="Excluir Conteúdo"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminContentTab() {
  const [contents, setContents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingContent, setEditingContent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");
  const [activeSubTab, setActiveSubTab] = useState("videos");

  const loadContents = useCallback(async () => {
    setIsLoading(true);
    try {
      const allContents = await base44.entities.Content.list('-created_date');
      setContents(allContents || []);
    } catch (error) {
      console.error("Error loading contents:", error);
      toast.error("Erro ao carregar conteúdos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContents();
  }, [loadContents]);

  const handleEditContent = (content) => {
    setEditingContent(content);
    setEditForm({
      title: content.title,
      description: content.description || '',
      category: content.category,
      access_level: content.access_level,
      duration: content.duration || 0,
      instructor: content.instructor || '',
      is_published: content.is_published || false,
      is_featured: content.is_featured || false,
      is_top_10: content.is_top_10 || false,
      thumbnail_url: content.thumbnail_url || '',
      video_url: content.video_url || '',
      preview_video_url: content.preview_video_url || '',
      live_embed_code: content.live_embed_code || '',
      external_link: content.external_link || '',
      card_color: content.card_color || 'blue',
      status: content.status || 'draft',
      display_order: content.display_order || 0
    });
    setShowAddForm(true);
    
    if (content.category === 'planos') {
      setActiveTab('planos');
    } else {
      setActiveTab('videos');
    }
  };

  const handleSaveContent = async () => {
    try {
      const contentData = { ...editForm };
      
      if (contentData.category === 'live' && contentData.video_url && contentData.video_url.includes('youtube.com/watch?v=')) {
        if (!contentData.live_embed_code) {
          const videoId = new URLSearchParams(new URL(contentData.video_url).search).get('v');
          if (videoId) {
            contentData.live_embed_code = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
          }
        }
      }

      if (editingContent) {
        await base44.entities.Content.update(editingContent.id, contentData);
        toast.success("Conteúdo atualizado com sucesso!");
      } else {
        const newContentStatus = contentData.category === 'live' && contentData.is_published ? 'live' : 'draft';
        if (contentData.category === 'planos') {
          contentData.display_order = planoContents.length;
        }

        await base44.entities.Content.create({
          ...contentData,
          status: newContentStatus
        });
        toast.success("Conteúdo adicionado com sucesso!");
      }
      resetForm();
      loadContents();
    } catch (error) {
      toast.error("Erro ao salvar conteúdo");
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingContent(null);
    setShowAddForm(false);
    setEditForm({});
  };

  const togglePublished = async (content) => {
    try {
      await base44.entities.Content.update(content.id, { is_published: !content.is_published });
      toast.success(`Conteúdo ${!content.is_published ? 'publicado' : 'despublicado'} com sucesso!`);
      loadContents();
    } catch (error) {
      toast.error("Erro ao atualizar status de publicação");
    }
  };

  const handleDelete = async (contentId) => {
    if (!window.confirm("Tem certeza que deseja excluir este conteúdo?")) {
      return;
    }
    try {
      await base44.entities.Content.delete(contentId);
      toast.success("Conteúdo excluído com sucesso!");
      loadContents();
    } catch (error) {
      console.error("Erro ao excluir conteúdo:", error);
      toast.error("Erro ao excluir conteúdo");
    }
  };
  
  const videoContents = contents.filter(c => c && c.category !== 'planos');
  const planoContents = contents
    .filter(c => c && c.category === 'planos')
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  const handleDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(planoContents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Optimistic update
    const updatedContents = contents.map(content => {
      if (content.category !== 'planos') return content;
      const newIndex = items.findIndex(item => item.id === content.id);
      return { ...content, display_order: newIndex };
    });
    setContents(updatedContents);

    // Update backend
    try {
      await Promise.all(
        items.map((plano, index) =>
          base44.entities.Content.update(plano.id, { display_order: index })
        )
      );
      toast.success('Ordem dos planos atualizada!');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Erro ao atualizar ordem dos planos');
      loadContents(); // Revert on error
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-sky-400" /></div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Biblioteca de Conteúdo</h3>
        {activeSubTab === "videos" && (
          <Button 
            onClick={() => {
              setEditingContent(null);
              setEditForm(activeTab === 'planos' ? { category: 'planos', card_color: 'blue' } : { category: 'mentoria', status: 'draft' });
              setShowAddForm(true);
            }}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {activeTab === 'planos' ? 'Adicionar Plano' : 'Adicionar Conteúdo'}
          </Button>
        )}
      </div>

      {/* Sub-Tabs */}
      <div className="flex gap-2 border-b border-gray-800">
        <button
          onClick={() => setActiveSubTab("videos")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSubTab === "videos"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Video className="w-4 h-4 mr-2 inline-block" />Vídeos & Conteúdo
        </button>
        <button
          onClick={() => setActiveSubTab("lives")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSubTab === "lives"
              ? "text-red-500 border-b-2 border-red-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Radio className="w-4 h-4 mr-2 inline-block" />Lives
        </button>
      </div>

      {activeSubTab === "lives" ? (
        <AdminLiveTab />
      ) : (
        <>
          {showAddForm && (
            <Card className="bg-gray-800 border-purple-400/50 mt-6">
              <CardHeader>
                <CardTitle className="text-purple-400">{editingContent ? 'Editando Conteúdo' : 'Novo Conteúdo'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Título</label>
                  <Input 
                    value={editForm.title || ''} 
                    onChange={(e) => setEditForm(prev => ({...prev, title: e.target.value}))} 
                    className="bg-gray-700 border-gray-600 text-white" 
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Categoria</label>
                  <select 
                    value={editForm.category || ''} 
                    onChange={(e) => setEditForm(prev => ({...prev, category: e.target.value}))} 
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="">Selecione...</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2">URL da Thumbnail (Capa do Vídeo)</label>
                  <Input 
                    value={editForm.thumbnail_url || ''} 
                    onChange={(e) => setEditForm(prev => ({...prev, thumbnail_url: e.target.value}))} 
                    className="bg-gray-700 border-gray-600 text-white" 
                    placeholder="https://exemplo.com/imagem-capa.jpg"
                  />
                  {editForm.thumbnail_url && (
                    <div className="mt-2">
                      <img 
                        src={editForm.thumbnail_url} 
                        alt="Preview da thumbnail" 
                        className="w-32 h-18 object-cover rounded border border-gray-600"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white mb-2">URL do Clipe de Pré-visualização (5-10s, sem som)</label>
                  <Input 
                    value={editForm.preview_video_url || ''} 
                    onChange={(e) => setEditForm(prev => ({...prev, preview_video_url: e.target.value}))} 
                    className="bg-gray-700 border-gray-600 text-white" 
                    placeholder="https://exemplo.com/preview.mp4"
                  />
                  <p className="text-gray-400 text-xs mt-1">Este vídeo tocará automaticamente quando o usuário passar o mouse sobre o card.</p>
                </div>

                {editForm.category !== 'live' && editForm.category !== 'planos' && editForm.category !== 'atletas' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white mb-2">URL do Vídeo (para player customizado)</label>
                      <Input 
                        value={editForm.video_url || ''} 
                        onChange={(e) => setEditForm(prev => ({...prev, video_url: e.target.value}))} 
                        className="bg-gray-700 border-gray-600 text-white" 
                        placeholder="https://..."
                      />
                    </div>
                    
                    <div className="text-center text-gray-400">
                      <span>--- OU ---</span>
                    </div>
                    
                    <div>
                      <label className="block text-white mb-2">Código de Incorporação (Embed)</label>
                      <Textarea 
                        value={editForm.live_embed_code || ''} 
                        onChange={(e) => setEditForm(prev => ({...prev, live_embed_code: e.target.value}))} 
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 h-24 font-mono text-sm"
                        placeholder='<iframe width="560" height="315" src="..." frameborder="0" allowfullscreen></iframe>'
                      />
                      <p className="text-gray-400 text-xs mt-1">
                        Use esta opção para incorporar vídeos de YouTube, Vimeo, etc. diretamente
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-white mb-2">Descrição</label>
                  <Textarea 
                    value={editForm.description || ''} 
                    onChange={(e) => setEditForm(prev => ({...prev, description: e.target.value}))} 
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 h-24"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Instrutor/Mentor</label>
                  <Input 
                    value={editForm.instructor || ''} 
                    onChange={(e) => setEditForm(prev => ({...prev, instructor: e.target.value}))} 
                    className="bg-gray-700 border-gray-600 text-white" 
                    placeholder="Nome do instrutor"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Duração (em minutos)</label>
                  <Input 
                    type="number" 
                    value={editForm.duration || ''} 
                    onChange={(e) => setEditForm(prev => ({...prev, duration: e.target.value}))} 
                    className="bg-gray-700 border-gray-600 text-white" 
                    placeholder="Ex: 45"
                  />
                </div>

                {(editForm.category === 'planos' || editForm.category === 'atletas') && (
                  <div>
                    <label className="block text-white mb-2">Link Externo</label>
                    <Input 
                      value={editForm.external_link || ''} 
                      onChange={(e) => setEditForm(prev => ({...prev, external_link: e.target.value}))} 
                      className="bg-gray-700 border-gray-600 text-white" 
                      placeholder="https://exemplo.com/pagina-destino"
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      URL para onde o card irá redirecionar quando clicado
                    </p>
                  </div>
                )}

                {editForm.category === 'planos' && (
                  <div>
                    <label className="block text-white mb-2">Cor do Card (para efeito neon)</label>
                    <select 
                      value={editForm.card_color || 'blue'} 
                      onChange={(e) => setEditForm(prev => ({...prev, card_color: e.target.value}))} 
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                    >
                      <option value="blue">Azul</option>
                      <option value="green">Verde</option>
                      <option value="purple">Roxo</option>
                      <option value="pink">Rosa</option>
                      <option value="yellow">Amarelo</option>
                      <option value="red">Vermelho</option>
                      <option value="cyan">Ciano</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={editForm.is_published || false} 
                      onChange={(e) => setEditForm(prev => ({...prev, is_published: e.target.checked}))} 
                      className="w-4 h-4"
                    />
                    <span className="text-white">Publicado</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={editForm.is_featured || false} 
                      onChange={(e) => setEditForm(prev => ({...prev, is_featured: e.target.checked}))} 
                      className="w-4 h-4"
                    />
                    <span className="text-white">Destacado</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={editForm.is_top_10 || false} 
                      onChange={(e) => setEditForm(prev => ({...prev, is_top_10: e.target.checked}))} 
                      className="w-4 h-4"
                    />
                    <span className="text-white">Top 10</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSaveContent} className="bg-purple-600 hover:bg-purple-700">
                    Salvar Conteúdo
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="videos" className="flex items-center gap-2"><Video className="w-4 h-4" />Conteúdos & Lives</TabsTrigger>
              <TabsTrigger value="planos" className="flex items-center gap-2"><Package className="w-4 h-4" />Planos</TabsTrigger>
            </TabsList>

            <TabsContent value="videos">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {videoContents.map((content) => (
                  <Card key={content.id} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0"><h3 className="font-semibold text-white truncate">{content.title}</h3></div>
                        <div className="flex gap-1 ml-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditContent(content)} className="text-gray-400 hover:text-white h-8 w-8">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(content.id)}
                            className="h-8 w-8"
                            title="Excluir Conteúdo"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-purple-600 text-white text-xs">{categories.find(c => c.value === content.category)?.label || content.category}</Badge>
                        <Badge className={`${content.is_published ? 'bg-green-600' : 'bg-gray-600'} text-white text-xs`}>{content.is_published ? 'Publicado' : 'Rascunho'}</Badge>
                        {content.is_featured && <Star className="w-4 h-4 text-yellow-400" />}
                        {content.is_top_10 && (
                          <Badge className="bg-red-600 text-white text-xs flex items-center gap-1">
                            <Flame className="w-3 h-3" /> Top 10
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {videoContents.length === 0 && (<div className="text-center py-12 text-gray-500"><Video className="w-16 h-16 mx-auto mb-4" /><h3 className="text-lg font-medium text-white mb-2">Nenhum conteúdo encontrado</h3><p>Adicione conteúdos para começar.</p></div>)}
            </TabsContent>

            <TabsContent value="planos">
              <div className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-4">
                  <p className="text-blue-300 text-sm flex items-center gap-2">
                    <GripVertical className="w-4 h-4" />
                    <strong>Dica:</strong> Arraste os cards pelos três pontos para reordenar os planos
                  </p>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="planos">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                      >
                        {planoContents.map((plano, index) => (
                          <Draggable key={plano.id} draggableId={plano.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <PlanoItem
                                  plano={plano}
                                  onEdit={handleEditContent}
                                  onDelete={handleDelete}
                                  dragHandleProps={provided.dragHandleProps}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {planoContents.length === 0 && (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    <Package className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Nenhum plano encontrado</h3>
                    <p>Adicione planos para começar.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
