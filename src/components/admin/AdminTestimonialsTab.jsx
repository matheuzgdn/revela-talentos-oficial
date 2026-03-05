import { base44 } from '@/api/base44Client';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminTestimonialsTab() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    video_url: '',
    thumbnail_url: '',
    is_active: true
  });

  const loadTestimonials = async () => {
    setIsLoading(true);
    try {
      const data = await base44.entities.Testimonial.list();
      setTestimonials(data);
    } catch (error) {
      toast.error("Falha ao carregar depoimentos.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleEditClick = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      position: testimonial.position,
      video_url: testimonial.video_url,
      thumbnail_url: testimonial.thumbnail_url,
      is_active: testimonial.is_active
    });
    setIsFormOpen(true);
  };

  const handleNewClick = () => {
    setEditingTestimonial(null);
    setFormData({ name: '', position: '', video_url: '', thumbnail_url: '', is_active: true });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja apagar este depoimento?")) {
      try {
        await base44.entities.Testimonial.delete(id);
        toast.success("Depoimento apagado com sucesso!");
        loadTestimonials();
      } catch (error) {
        toast.error("Falha ao apagar depoimento.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        await base44.entities.Testimonial.update(editingTestimonial.id, formData);
        toast.success("Depoimento atualizado com sucesso!");
      } else {
        await base44.entities.Testimonial.create(formData);
        toast.success("Depoimento criado com sucesso!");
      }
      setIsFormOpen(false);
      loadTestimonials();
    } catch (error) {
      toast.error("Falha ao salvar depoimento.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gerenciar Depoimentos</h2>
        <Button onClick={handleNewClick}>
          <Plus className="mr-2 h-4 w-4" /> Novo Depoimento
        </Button>
      </div>

      {isFormOpen && (
        <Card className="mb-8 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>{editingTestimonial ? 'Editar' : 'Novo'} Depoimento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Nome do Atleta" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <Input placeholder="Posição (ex: Atleta Profissional)" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
              <Input placeholder="URL do Vídeo" value={formData.video_url} onChange={(e) => setFormData({...formData, video_url: e.target.value})} required />
              <Input placeholder="URL da Thumbnail (imagem de capa)" value={formData.thumbnail_url} onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})} required />
              <label className="flex items-center gap-2 text-sm text-white">
                <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
                Ativo (aparece no site)
              </label>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-gray-900 border-gray-800">
              <img src={testimonial.thumbnail_url} alt={testimonial.name} className="w-full h-40 object-cover rounded-t-lg" />
              <CardContent className="p-4">
                <h3 className="font-bold">{testimonial.name}</h3>
                <p className="text-sm text-gray-400">{testimonial.position}</p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(testimonial)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(testimonial.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
