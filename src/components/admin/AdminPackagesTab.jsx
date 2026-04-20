import React, { useState } from "react";
import { appClient } from "@/api/backendClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Edit,
  Plus,
  Trash2,
  DollarSign,
  Star,
  CheckCircle,
  Save,
  X
} from "lucide-react";
import { toast } from "sonner";

export default function AdminPackagesTab({ packages, onRefresh }) {
  const [editingPackage, setEditingPackage] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    price: 0,
    billing_period: 'monthly',
    features: '',
    is_popular: false,
    is_active: true,
    color_gradient: 'from-gray-500 to-gray-600',
    icon: 'Package'
  });

  const handleEditClick = (pkg) => {
    setEditingPackage(pkg);
    setFormState({
      ...pkg,
      features: pkg.features.join('\n')
    });
    setShowAddForm(true);
  };

  const handleAddNewClick = () => {
    setEditingPackage(null);
    setFormState({
      name: '',
      description: '',
      price: 0,
      billing_period: 'monthly',
      features: '',
      is_popular: false,
      is_active: true,
      color_gradient: 'from-gray-500 to-gray-600',
      icon: 'Package'
    });
    setShowAddForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    const payload = {
      ...formState,
      price: parseFloat(formState.price),
      features: formState.features.split('\n').filter(f => f.trim() !== '')
    };

    try {
      if (editingPackage) {
        await appClient.entities.SubscriptionPackage.update(editingPackage.id, payload);
        toast.success("Pacote atualizado com sucesso!");
      } else {
        await appClient.entities.SubscriptionPackage.create(payload);
        toast.success("Pacote criado com sucesso!");
      }
      resetAndRefresh();
    } catch (error) {
      toast.error("Erro ao salvar o pacote.");
      console.error(error);
    }
  };

  const handleDelete = async (packageId) => {
    if (window.confirm("Tem certeza que deseja apagar este pacote? Esta aÃ§Ã£o nÃ£o pode ser desfeita.")) {
      try {
        await appClient.entities.SubscriptionPackage.delete(packageId);
        toast.success("Pacote apagado com sucesso!");
        onRefresh();
      } catch (error) {
        toast.error("Erro ao apagar o pacote.");
      }
    }
  };

  const resetAndRefresh = () => {
    setShowAddForm(false);
    setEditingPackage(null);
    onRefresh();
  };

  const getBillingPeriodLabel = (period) => {
    const labels = {
      monthly: 'Mensal',
      quarterly: 'Trimestral',
      semiannual: 'Semestral',
      annual: 'Anual'
    };
    return labels[period] || period;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Gerenciar Pacotes de Assinatura</h3>
        <Button onClick={handleAddNewClick} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Pacote
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-gray-800 border-blue-400/50">
          <CardHeader>
            <CardTitle className="text-blue-400">
              {editingPackage ? 'Editando Pacote' : 'Criar Novo Pacote'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" value={formState.name} onChange={handleFormChange} placeholder="Nome do Pacote" className="bg-gray-700 text-white border-gray-600" />
              <Input type="number" name="price" value={formState.price} onChange={handleFormChange} placeholder="PreÃ§o (R$)" className="bg-gray-700 text-white border-gray-600" />
              <select name="billing_period" value={formState.billing_period} onChange={handleFormChange} className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2">
                <option value="monthly">Mensal</option>
                <option value="quarterly">Trimestral</option>
                <option value="semiannual">Semestral</option>
                <option value="annual">Anual</option>
              </select>
              <Input name="color_gradient" value={formState.color_gradient} onChange={handleFormChange} placeholder="Gradiente de Cor (from- to-)" className="bg-gray-700 text-white border-gray-600" />
            </div>
            <Textarea name="features" value={formState.features} onChange={handleFormChange} placeholder="Funcionalidades (uma por linha)" className="bg-gray-700 text-white border-gray-600 h-28" />
            <div className="flex items-center space-x-4">
              <label className="flex items-center gap-2 text-white"><Switch name="is_active" checked={formState.is_active} onCheckedChange={(c) => setFormState(p => ({...p, is_active: c}))} /> Ativo</label>
              <label className="flex items-center gap-2 text-white"><Switch name="is_popular" checked={formState.is_popular} onCheckedChange={(c) => setFormState(p => ({...p, is_popular: c}))} /> Popular</label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700"><Save className="w-4 h-4 mr-2" /> Salvar</Button>
              <Button variant="outline" onClick={resetAndRefresh}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map(pkg => (
          <Card key={pkg.id} className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  {pkg.name}
                  {pkg.is_popular && <Badge className="bg-green-500 text-white"><Star className="w-3 h-3 mr-1" />Popular</Badge>}
                </CardTitle>
                <div className="flex items-baseline gap-1 text-xl font-bold text-white">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  {pkg.price}
                  <span className="text-sm text-gray-400">/{getBillingPeriodLabel(pkg.billing_period).slice(0, 3).toLowerCase()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEditClick(pkg)}><Edit className="w-4 h-4 text-gray-400 hover:text-white" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(pkg.id)}><Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-300">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                {pkg.is_active ? (
                  <Badge className="bg-green-600/20 text-green-400">Ativo</Badge>
                ) : (
                  <Badge variant="destructive">Inativo</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

