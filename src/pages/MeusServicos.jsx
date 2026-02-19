
import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { UserSubscription } from "@/entities/UserSubscription";
import { SubscriptionPackage } from "@/entities/SubscriptionPackage";
import { UploadFile } from "@/integrations/Core";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings, 
  Crown, 
  Calendar, 
  CreditCard,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Check,
  Star,
  Package,
  TrendingUp,
  ShieldCheck,
  Camera
} from "lucide-react";
import { toast } from "sonner";

export default function MeusServicosPage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [userSubscription, setUserSubscription] = useState(null);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [availablePackages, setAvailablePackages] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setProfileData({
        full_name: currentUser.full_name || "",
        phone: currentUser.phone || "",
        position: currentUser.position || "",
        age: currentUser.age || "",
        club: currentUser.club || ""
      });

      // Load subscription data
      const subscriptions = await UserSubscription.filter({ user_id: currentUser.id });
      if (subscriptions.length > 0) {
        const sub = subscriptions[0];
        setUserSubscription(sub);
        if (sub.package_id) {
          const pkg = await SubscriptionPackage.get(sub.package_id);
          setCurrentPackage(pkg);
        }
      }

      // Load all available packages
      const allPackages = await SubscriptionPackage.filter({ is_active: true });
      setAvailablePackages(allPackages);

    } catch (error) {
      console.error("Error loading user data:", error);
    }
    setIsLoading(false);
  };

  const handleUpdateProfile = async () => {
    try {
      await User.updateMyUserData(profileData);
      setUser(prev => ({ ...prev, ...profileData }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione apenas arquivos de imagem");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const { file_url } = await UploadFile({ file });
      await User.updateMyUserData({ profile_picture_url: file_url });
      setUser(prev => ({ ...prev, profile_picture_url: file_url }));
      toast.success("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Erro ao fazer upload da foto");
    }
    setIsUploadingPhoto(false);
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
  
  const getIconComponent = (iconName) => {
    const icons = { Star, Crown, Package };
    return icons[iconName] || Package;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex items-center justify-center">
        <div className="animate-pulse text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative h-64 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://static.wixstatic.com/media/933cdd_3b676d68d7c645bea831a0717eccbe12~mv2.png"
            alt="Meus Serviços"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>
        
        <div className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Settings className="w-3 h-3 mr-1" />
              Minha Conta
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold">
              Gerencie seus <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Serviços</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl">
              Controle sua assinatura, atualize seus dados e acompanhe seu progresso
            </p>
          </motion.div>
        </div>
      </section>

      <div className="px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="h-24 w-24 mx-auto">
                      <AvatarImage src={user?.profile_picture_url} />
                      <AvatarFallback className="bg-purple-600 text-white text-2xl">
                        {user?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Photo Upload Button */}
                    <div className="absolute -bottom-2 -right-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                        disabled={isUploadingPhoto}
                      />
                      <label
                        htmlFor="photo-upload"
                        className={`flex items-center justify-center w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full cursor-pointer transition-colors shadow-lg ${
                          isUploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isUploadingPhoto ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Camera className="w-4 h-4 text-white" />
                        )}
                      </label>
                    </div>
                  </div>
                  
                  <CardTitle className="text-white">{user?.full_name}</CardTitle>
                  {currentPackage && (
                    <Badge 
                      className={`bg-gradient-to-r ${currentPackage.color_gradient || 'from-gray-500 to-gray-600'} text-white`}
                    >
                      <Package className="w-3 h-3 mr-1" />
                      {currentPackage.name}
                    </Badge>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        placeholder="Nome completo"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <Input
                        placeholder="Telefone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <Input
                        placeholder="Posição"
                        value={profileData.position}
                        onChange={(e) => setProfileData(prev => ({ ...prev, position: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <Input
                        placeholder="Idade"
                        type="number"
                        value={profileData.age}
                        onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <Input
                        placeholder="Clube atual"
                        value={profileData.club}
                        onChange={(e) => setProfileData(prev => ({ ...prev, club: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateProfile} className="flex-1 bg-green-600">
                          <Check className="w-4 h-4 mr-2" />
                          Salvar
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{user?.email}</span>
                      </div>
                      {user?.phone && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{user.phone}</span>
                        </div>
                      )}
                      {user?.position && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <UserIcon className="w-4 h-4" />
                          <span className="text-sm">{user.position}</span>
                        </div>
                      )}
                      {user?.club && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{user.club}</span>
                        </div>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(true)}
                        className="w-full mt-4"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Editar Perfil
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Módulos Ativos Card */}
            {user && (
               <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <ShieldCheck className="w-5 h-5 text-purple-400" />
                      Módulos Ativos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                           <Star className="w-5 h-5 text-yellow-400"/>
                           <span className="text-white font-medium">Revela Talentos</span>
                        </div>
                        <Badge className={user.has_revela_talentos_access ? "bg-green-600" : "bg-gray-600"}>
                           {user.has_revela_talentos_access ? "Ativo" : "Inativo"}
                        </Badge>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                           <TrendingUp className="w-5 h-5 text-green-400"/>
                           <span className="text-white font-medium">Plano de Carreira</span>
                        </div>
                        <Badge className={user.has_plano_carreira_access ? "bg-green-600" : "bg-gray-600"}>
                           {user.has_plano_carreira_access ? "Ativo" : "Inativo"}
                        </Badge>
                     </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}


            {/* Subscription Status */}
            {userSubscription && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      Status da Assinatura
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Status:</span>
                      <Badge className="bg-green-600 text-white capitalize">{userSubscription.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Próxima renovação:</span>
                      <span className="text-white">{userSubscription.renewal_date ? new Date(userSubscription.renewal_date).toLocaleDateString('pt-BR') : "N/A"}</span>
                    </div>
                    <Button variant="outline" className="w-full">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Gerenciar Pagamento
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Plans Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Planos Disponíveis</h2>
                <p className="text-gray-400">
                  Escolha o plano ideal para acelerar sua carreira no futebol
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availablePackages.map((plan, index) => {
                  const Icon = getIconComponent(plan.icon);
                  const isCurrent = currentPackage?.id === plan.id;
                  
                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className={`relative border-2 transition-all ${
                        isCurrent
                          ? 'border-green-500 bg-gray-900/70' 
                          : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                      }`}>
                        {plan.is_popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Mais Popular
                            </Badge>
                          </div>
                        )}
                        
                        <CardHeader className="text-center pb-4">
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.color_gradient} flex items-center justify-center mx-auto mb-4`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-3xl font-bold text-white">R$ {plan.price}</span>
                            <span className="text-gray-400">{getBillingPeriodLabel(plan.billing_period)}</span>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <ul className="space-y-2">
                            {plan.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-center gap-2 text-sm">
                                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                                <span className="text-gray-300">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          
                          {isCurrent ? (
                            <Button disabled className="w-full bg-green-600">
                              <Check className="w-4 h-4 mr-2" />
                              Plano Atual
                            </Button>
                          ) : (
                            <Button 
                              className={`w-full bg-gradient-to-r ${plan.color_gradient} hover:opacity-90`}
                            >
                              {currentPackage ? 'Mudar Plano' : 'Selecionar Plano'}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
