
import React, { useState } from "react";
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Edit,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Package
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSubscriptionsTab({ subscriptions, users, packages, onRefresh }) {
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [editForm, setEditForm] = useState({});

  const getUserById = (userId) => {
    return users.find(user => user.id === userId);
  };

  const getPackageById = (packageId) => {
    return packages.find(p => p.id === packageId);
  }

  const handleEditSubscription = (subscription) => {
    setEditingSubscription(subscription);
    const pkg = getPackageById(subscription.package_id);
    setEditForm({
      package_id: subscription.package_id,
      status: subscription.status,
      renewal_date: subscription.renewal_date ? new Date(subscription.renewal_date).toISOString().split('T')[0] : '',
      price_at_subscription: subscription.price_at_subscription || pkg?.price || 0,
    });
  };

  const handleSaveSubscription = async () => {
    try {
      await UserSubscription.update(editingSubscription.id, editForm);
      toast.success("Assinatura atualizada com sucesso!");
      setEditingSubscription(null);
      onRefresh();
    } catch (error) {
      toast.error("Erro ao atualizar assinatura");
      console.error(error);
    }
  };
  
  const getBillingPeriodLabel = (period) => {
    const labels = {
      monthly: '/mês',
      quarterly: '/trimestre',
      semiannual: '/semestre',
      annual: '/ano'
    };
    return labels[period] || '';
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'trial':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'failed':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Edit Subscription Modal */}
      {editingSubscription && (
        <Card className="bg-gray-800 border-yellow-400/50">
          <CardHeader>
            <CardTitle className="text-yellow-400">
              Editando Assinatura: {getUserById(editingSubscription.user_id)?.full_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Pacote de Assinatura</label>
                <select
                  value={editForm.package_id}
                  onChange={(e) => setEditForm(prev => ({...prev, package_id: e.target.value}))}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                >
                  <option value="">Selecione um Pacote</option>
                  {packages.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (R$ {p.price})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white mb-2">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({...prev, status: e.target.value}))}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="expired">Expirado</option>
                  <option value="trial">Trial</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2">Data de Renovação</label>
                 <input
                  type="date"
                  value={editForm.renewal_date}
                  onChange={(e) => setEditForm(prev => ({...prev, renewal_date: e.target.value}))}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Preço (R$)</label>
                <input
                  type="number"
                  value={editForm.price_at_subscription}
                  onChange={(e) => setEditForm(prev => ({...prev, price_at_subscription: parseFloat(e.target.value)}))}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSaveSubscription} className="bg-green-600 hover:bg-green-700">
                Salvar Alterações
              </Button>
              <Button variant="outline" onClick={() => setEditingSubscription(null)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscriptions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {subscriptions.map((subscription) => {
          const user = getUserById(subscription.user_id);
          const pkg = getPackageById(subscription.package_id);
          if (!user || !pkg) return null;

          return (
            <Card key={subscription.id} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profile_picture_url} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {user.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-white">{user.full_name}</h3>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSubscription(subscription)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Plano:</span>
                    <Badge className={`bg-blue-600 text-white`}>
                        <Package className="w-3 h-3 mr-1" />
                        {pkg.name}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status:</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(subscription.status)}
                      <span className="text-white capitalize">{subscription.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Pagamento:</span>
                    <Badge className={`${getPaymentStatusColor(subscription.payment_status)} text-white text-xs`}>
                      {subscription.payment_status === 'paid' ? 'Pago' :
                       subscription.payment_status === 'pending' ? 'Pendente' : 'Falhou'}
                    </Badge>
                  </div>

                  {subscription.price_at_subscription && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Valor Cobrado:</span>
                      <div className="flex items-center gap-1 text-green-400">
                        <DollarSign className="w-3 h-3" />
                        <span>R$ {subscription.price_at_subscription} {getBillingPeriodLabel(pkg.billing_period)}</span>
                      </div>
                    </div>
                  )}

                  {subscription.renewal_date && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Renovação:</span>
                      <div className="flex items-center gap-1 text-gray-300">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(subscription.renewal_date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
