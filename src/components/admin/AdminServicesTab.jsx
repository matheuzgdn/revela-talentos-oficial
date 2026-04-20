import React, { useState, useEffect } from 'react';
import { appClient } from '@/api/backendClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Crown, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminServicesTab() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    title_highlight: '',
    description: '',
    icon_name: 'Crown',
    button_text: 'Ver BenefÃ­cios',
    button_url: 'PlanoCarreira',
    card_color: 'green',
    features: [
      { icon: 'TrendingUp', text: 'GestÃ£o de Carreira Personalizada' },
      { icon: 'Users', text: 'Chat Direto com Especialistas' },
      { icon: 'Shield', text: 'AnÃ¡lises Individuais Detalhadas' }
    ],
    is_active: true,
    display_order: 0
  });

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const data = await appClient.entities.ServiceHighlight.list('display_order');
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Erro ao carregar serviÃ§os');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await appClient.entities.ServiceHighlight.update(editingService.id, formData);
        toast.success('ServiÃ§o atualizado!');
      } else {
        await appClient.entities.ServiceHighlight.create(formData);
        toast.success('ServiÃ§o criado!');
      }
      resetForm();
      loadServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Erro ao salvar serviÃ§o');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData(service);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este serviÃ§o?')) return;
    try {
      await appClient.entities.ServiceHighlight.delete(id);
      toast.success('ServiÃ§o deletado!');
      loadServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Erro ao deletar serviÃ§o');
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      title: '',
      title_highlight: '',
      description: '',
      icon_name: 'Crown',
      button_text: 'Ver BenefÃ­cios',
      button_url: 'PlanoCarreira',
      card_color: 'green',
      features: [
        { icon: 'TrendingUp', text: 'GestÃ£o de Carreira Personalizada' },
        { icon: 'Users', text: 'Chat Direto com Especialistas' },
        { icon: 'Shield', text: 'AnÃ¡lises Individuais Detalhadas' }
      ],
      is_active: true,
      display_order: 0
    });
  };

  const iconOptions = [
    'Crown', 'Trophy', 'Star', 'TrendingUp', 'Target', 'Award', 'Sparkles', 
    'Shield', 'Users', 'MessageCircle', 'Zap', 'Rocket', 'CheckCircle'
  ];

  const colorOptions = [
    { value: 'green', label: 'Verde', preview: 'bg-green-500' },
    { value: 'blue', label: 'Azul', preview: 'bg-blue-500' },
    { value: 'purple', label: 'Roxo', preview: 'bg-purple-500' },
    { value: 'orange', label: 'Laranja', preview: 'bg-orange-500' },
    { value: 'red', label: 'Vermelho', preview: 'bg-red-500' },
    { value: 'cyan', label: 'Ciano', preview: 'bg-cyan-500' },
    { value: 'yellow', label: 'Amarelo', preview: 'bg-yellow-500' },
    { value: 'pink', label: 'Rosa', preview: 'bg-pink-500' }
  ];

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { icon: 'TrendingUp', text: '' }]
    });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const updateFeature = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index][field] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">ServiÃ§os Premium</h2>
        <p className="text-gray-400 text-sm">Configure o card de serviÃ§os premium (estilo Plano de Carreira)</p>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-green-400" />
            {editingService ? 'Editar ServiÃ§o' : 'Novo ServiÃ§o'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">TÃ­tulo (primeira parte) *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Eleve seu Jogo com o"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">TÃ­tulo em Destaque (verde) *</label>
                <Input
                  value={formData.title_highlight}
                  onChange={(e) => setFormData({ ...formData, title_highlight: e.target.value })}
                  placeholder="Ex: Plano de Carreira"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">DescriÃ§Ã£o *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Tenha uma equipe de especialistas dedicados..."
                className="bg-gray-800 border-gray-700 text-white"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Ãcone Principal</label>
                <select
                  value={formData.icon_name}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Cor do Card</label>
                <select
                  value={formData.card_color}
                  onChange={(e) => setFormData({ ...formData, card_color: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                >
                  {colorOptions.map(color => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 mt-2">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, card_color: color.value })}
                      className={`w-8 h-8 rounded ${color.preview} ${
                        formData.card_color === color.value ? 'ring-2 ring-white' : ''
                      }`}
                    />
                  ))}
                </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Texto do BotÃ£o</label>
                <Input
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  placeholder="Ver BenefÃ­cios"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">URL do BotÃ£o</label>
                <Input
                  value={formData.button_url}
                  onChange={(e) => setFormData({ ...formData, button_url: e.target.value })}
                  placeholder="PlanoCarreira"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-white text-sm font-medium">Features (Cards Laterais)</label>
                <Button type="button" size="sm" onClick={addFeature} variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Feature
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 p-3 bg-gray-800 rounded-lg">
                    <select
                      value={feature.icon}
                      onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                      className="bg-gray-900 border border-gray-700 text-white rounded px-2 py-1 text-sm"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                    <Input
                      value={feature.text}
                      onChange={(e) => updateFeature(index, 'text', e.target.value)}
                      placeholder="Nome da feature"
                      className="bg-gray-900 border-gray-700 text-white flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-green-600 bg-gray-800 border-gray-700 rounded"
              />
              <label htmlFor="is_active" className="text-white text-sm cursor-pointer">
                âœ… Ativo
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                {editingService ? 'Atualizar' : 'Criar ServiÃ§o'}
              </Button>
              {editingService && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : services.length === 0 ? (
          <p className="text-gray-400">Nenhum serviÃ§o criado ainda</p>
        ) : (
          services.map((service) => (
            <Card key={service.id} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-bold text-xl">
                        {service.title} <span className="text-green-400">{service.title_highlight}</span>
                      </h3>
                      <span className={`w-3 h-3 rounded-full bg-${service.card_color || 'green'}-500`}></span>
                    </div>
                    <p className="text-gray-400 mb-4">{service.description}</p>
                    <div className="space-y-2">
                      {service.features?.map((feature, idx) => (
                        <div key={idx} className="text-sm text-gray-300">
                          âœ“ {feature.text}
                        </div>
                      ))}
                    </div>
                    {!service.is_active && (
                      <span className="text-xs text-red-400 mt-2 block">INATIVO</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(service)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(service.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
