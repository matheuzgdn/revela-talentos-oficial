import { appClient } from '@/api/backendClient';

import React, { useState, useEffect, useCallback } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Loader2, BookOpen, Star, Trophy, Rss } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCareerFeedTab() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    post_type: 'devotional',
    title: '',
    content: '',
    image_url: '',
    reference: '',
    reflection: '',
    is_active: true,
  });

  const postTypes = [
    { value: 'devotional', label: 'Devocional', icon: BookOpen },
    { value: 'player_of_week', label: 'Jogador da Semana', icon: Star },
    { value: 'challenge', label: 'Desafio', icon: Trophy },
  ];

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const allPosts = await appClient.entities.CareerPost.list('-created_date');
      setPosts(allPosts || []);
    } catch (error) {
      console.error('Erro ao carregar posts do feed:', error);
      toast.error("Falha ao carregar posts.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleNew = () => {
    setEditingPost(null);
    setFormData({
      post_type: 'devotional', title: '', content: '', image_url: '',
      reference: '', reflection: '', is_active: true,
    });
    setShowModal(true);
  };
  
  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData(post);
    setShowModal(true);
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Tem certeza que deseja excluir este post?")) {
      try {
        await appClient.entities.CareerPost.delete(postId);
        toast.success("Post excluÃ­do com sucesso!");
        loadPosts();
      } catch (error) {
        toast.error("Falha ao excluir post.");
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingPost) {
        await appClient.entities.CareerPost.update(editingPost.id, formData);
        toast.success("Post atualizado com sucesso!");
      } else {
        await appClient.entities.CareerPost.create(formData);
        toast.success("Post criado com sucesso!");
      }
      setShowModal(false);
      loadPosts();
    } catch (error) {
      toast.error("Erro ao salvar post.");
    }
  };

  const getPostTypeIcon = (type) => {
    const postType = postTypes.find(p => p.value === type);
    return postType ? <postType.icon className="w-5 h-5 mr-2" /> : null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Gerenciador do Feed de Carreira</h3>
        <Button onClick={handleNew} className="bg-sky-500 hover:bg-sky-600">
          <Plus className="w-4 h-4 mr-2" />
          Novo Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => (
          <Card key={post.id} className="bg-gray-800 border-gray-700 text-white flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getPostTypeIcon(post.post_type)}
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${post.is_active ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}`}>
                  {post.is_active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-400 line-clamp-3">{post.content}</p>
              {post.reference && <p className="text-xs text-sky-400 mt-2">ReferÃªncia: {post.reference}</p>}
            </CardContent>
            <div className="flex gap-2 p-4 border-t border-gray-700">
              <Button variant="outline" size="sm" onClick={() => handleEdit(post)}><Edit className="w-3 h-3 mr-1"/> Editar</Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}><Trash2 className="w-3 h-3 mr-1"/> Excluir</Button>
            </div>
          </Card>
        ))}
      </div>
      
      {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
              <Rss className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Nenhum post no feed</h3>
              <p>Crie o primeiro post para engajar seus atletas.</p>
          </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Editar" : "Novo"} Post no Feed</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={formData.post_type} onValueChange={v => setFormData({...formData, post_type: v})}>
              <SelectTrigger className="bg-gray-800 border-gray-700"><SelectValue/></SelectTrigger>
              <SelectContent>
                {postTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="TÃ­tulo" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-gray-800 border-gray-700"/>
            <Textarea placeholder="ConteÃºdo Principal" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="bg-gray-800 border-gray-700 h-24"/>
            <Input placeholder="URL da Imagem (opcional)" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="bg-gray-800 border-gray-700"/>
            {formData.post_type === 'devotional' && (
              <>
                <Input placeholder="ReferÃªncia (ex: JoÃ£o 3:16)" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} className="bg-gray-800 border-gray-700"/>
                <Textarea placeholder="ReflexÃ£o" value={formData.reflection} onChange={e => setFormData({...formData, reflection: e.target.value})} className="bg-gray-800 border-gray-700 h-20"/>
              </>
            )}
            <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} id="is_active_check_feed"/>
                <label htmlFor="is_active_check_feed">Post Ativo</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


