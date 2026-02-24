import React, { useState } from "react";
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Upload, Trash2, Eye, EyeOff, Video, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminStoriesManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    video_url: "",
    thumbnail_url: "",
    link_url: "",
    duration: 10,
    is_active: true,
    order: 0,
    target_audience: "all"
  });
  const [isUploading, setIsUploading] = useState(false);

  const queryClient = useQueryClient();

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["stories"],
    queryFn: () => base44.entities.Story.list("order", 50)
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Story.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      toast.success("Story criado com sucesso!");
      resetForm();
    },
    onError: () => toast.error("Erro ao criar story")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Story.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      toast.success("Story atualizado com sucesso!");
      resetForm();
    },
    onError: () => toast.error("Erro ao atualizar story")
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Story.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      toast.success("Story deletado com sucesso!");
    },
    onError: () => toast.error("Erro ao deletar story")
  });

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, video_url: file_url });
      toast.success("Vídeo enviado com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar vídeo");
    }
    setIsUploading(false);
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, thumbnail_url: file_url });
      toast.success("Thumbnail enviada com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar thumbnail");
    }
    setIsUploading(false);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.video_url) {
      toast.error("Preencha título e vídeo");
      return;
    }

    if (editingStory) {
      updateMutation.mutate({ id: editingStory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (story) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      video_url: story.video_url,
      thumbnail_url: story.thumbnail_url || "",
      link_url: story.link_url || "",
      duration: story.duration || 10,
      is_active: story.is_active,
      order: story.order || 0,
      target_audience: story.target_audience || "all"
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      video_url: "",
      thumbnail_url: "",
      link_url: "",
      duration: 10,
      is_active: true,
      order: 0,
      target_audience: "all"
    });
    setEditingStory(null);
    setIsDialogOpen(false);
  };

  const toggleActive = async (story) => {
    await updateMutation.mutateAsync({
      id: story.id,
      data: { ...story, is_active: !story.is_active }
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Stories de Abertura</h2>
          <p className="text-gray-400 text-sm">Vídeos verticais exibidos ao iniciar o app</p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Story
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stories.map((story, idx) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="bg-white/5 border-white/10 overflow-hidden">
              <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-sm mb-1">{story.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Ordem: {story.order}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{story.duration}s</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => toggleActive(story)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    {story.is_active ? (
                      <Eye className="w-4 h-4 text-green-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-[9/16] bg-black relative overflow-hidden">
                  {story.thumbnail_url ? (
                    <img src={story.thumbnail_url} alt={story.title} className="w-full h-full object-cover" />
                  ) : (
                    <video src={story.video_url} className="w-full h-full object-cover" muted />
                  )}
                  {story.link_url && (
                    <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                      <LinkIcon className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-3 flex gap-2">
                  <Button
                    onClick={() => handleEdit(story)}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => deleteMutation.mutate(story.id)}
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="bg-[#0A1A2A] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStory ? "Editar Story" : "Novo Story"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Nova Temporada 2026"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>

            <div>
              <Label>Vídeo Vertical (9:16) *</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="URL do vídeo"
                  className="bg-white/5 border-white/20 text-white flex-1"
                />
                <Button
                  onClick={() => document.getElementById("video-upload").click()}
                  disabled={isUploading}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <Label>Thumbnail (opcional)</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="URL da thumbnail"
                  className="bg-white/5 border-white/20 text-white flex-1"
                />
                <Button
                  onClick={() => document.getElementById("thumb-upload").click()}
                  disabled={isUploading}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <input
                  id="thumb-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <Label>Link de Destino (opcional)</Label>
              <Input
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                placeholder="https://exemplo.com"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duração (segundos)</Label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>

            <div>
              <Label>Público-Alvo</Label>
              <Select
                value={formData.target_audience}
                onValueChange={(value) => setFormData({ ...formData, target_audience: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="athletes">Apenas Atletas</SelectItem>
                  <SelectItem value="guests">Apenas Visitantes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Story Ativo</Label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={resetForm} variant="outline" className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600"
              >
                {editingStory ? "Atualizar" : "Criar"} Story
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}