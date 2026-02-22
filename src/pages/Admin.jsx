import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar,
  Settings, 
  BadgeDollarSign, 
  ShieldCheck, 
  UploadCloud, 
  MessageSquare, 
  Package, 
  Megaphone,
  Star, // Added Star icon
  Zap // Added Zap icon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import AdminContentTab from '@/components/admin/AdminContentTab';
import AdminMarketingTab from '@/components/admin/AdminMarketingTab'; 
import AdminSchedulesTab from '@/components/admin/AdminSchedulesTab';
import AdminSeletivasTab from '@/components/admin/AdminSeletivasTab'; 
import RevelaDashboard from '@/components/admin/RevelaDashboard';
import AdminStoriesTab from '@/components/admin/AdminStoriesTab'; // Imported new component
import AdminServicesTab from '@/components/admin/AdminServicesTab'; // Imported new component
import AdminStoriesManagement from '@/components/admin/AdminStoriesManagement';

const AdminUploadsTab = () => <div className="p-6 text-gray-300">Conteúdo da aba Uploads em desenvolvimento.</div>;
const AdminMessagesTab = () => <div className="p-6 text-gray-300">Conteúdo da aba Mensagens em desenvolvimento.</div>;
const AdminPackagesTab = () => <div className="p-6 text-gray-300">Conteúdo da aba Pacotes em desenvolvimento.</div>;
const AdminSettingsTab = () => <div className="p-6 text-gray-300">Conteúdo da aba Configurações Gerais em desenvolvimento.</div>;
const AdminInscricoesTab = () => <div className="p-6 text-gray-300">Conteúdo da aba Inscrições em desenvolvimento.</div>;

const adminTabsConfig = [
  { 
    id: 'dashboard', 
    name: 'Dashboard', 
    icon: LayoutDashboard, 
    component: AdminDashboard,
    description: 'Visão geral e métricas principais',
    requiredRole: 'admin' // Apenas admin completo
  },
  { 
    id: 'revela_dashboard', 
    name: 'Dashboard Revela', 
    icon: LayoutDashboard, 
    component: RevelaDashboard,
    description: 'Métricas de Seletivas e Conteúdos',
    requiredRole: 'revela_admin' // Admin revela também vê este
  },
  { 
    id: 'users', 
    name: 'Usuários', 
    icon: Users, 
    component: AdminUsersTab,
    description: 'Gerenciar atletas e usuários da plataforma',
    requiredRole: 'admin' // APENAS admin completo
  },
  { 
    id: 'inscricoes', 
    name: 'Inscrições', 
    icon: BadgeDollarSign, 
    component: AdminInscricoesTab, 
    description: 'Gestão de inscrições e funil de vendas',
    requiredRole: 'admin'
  },
  { 
    id: 'seletivas', 
    name: 'Seletivas', 
    icon: ShieldCheck, 
    component: AdminSeletivasTab,
    description: 'Gerenciar seletivas online e testes de avaliação',
    requiredRole: 'revela_admin' // Admin revela tem acesso
  },
  { 
    id: 'stories', // New tab for stories
    name: 'Destaques RT', 
    icon: Star, 
    component: AdminStoriesTab,
    description: 'Stories de atletas para Revela Talentos',
    requiredRole: 'revela_admin' // Admin revela tem acesso
  },
  { 
    id: 'stories_abertura', // Stories de abertura do app
    name: 'Stories de Abertura', 
    icon: Star, 
    component: AdminStoriesManagement,
    description: 'Vídeos verticais exibidos ao abrir o app',
    requiredRole: 'admin' // Apenas admin completo
  },
  { 
    id: 'services', // New tab for services
    name: 'Serviços', 
    icon: Zap, 
    component: AdminServicesTab,
    description: 'Gerenciar serviços em destaque',
    requiredRole: 'admin'
  },
  { 
    id: 'content', 
    name: 'Conteúdo', 
    icon: FileText, 
    component: AdminContentTab,
    description: 'Gerenciar vídeos, artigos e materiais',
    requiredRole: 'revela_admin' // Admin revela tem acesso
  },
  { 
    id: 'uploads', 
    name: 'Uploads', 
    icon: UploadCloud, 
    component: AdminUploadsTab,
    description: 'Gerenciar uploads de arquivos e mídias',
    requiredRole: 'admin'
  },
  { 
    id: 'agenda', 
    name: 'Agenda', 
    icon: Calendar, 
    component: AdminSchedulesTab,
    description: 'Gerenciar agendamentos e eventos',
    requiredRole: 'admin'
  },
  { 
    id: 'mensagens', 
    name: 'Mensagens', 
    icon: MessageSquare, 
    component: AdminMessagesTab,
    description: 'Comunicação interna e gestão de mensagens',
    requiredRole: 'admin'
  },
  { 
    id: 'packages', 
    name: 'Pacotes', 
    icon: Package, 
    component: AdminPackagesTab,
    description: 'Gerenciar pacotes e assinaturas',
    requiredRole: 'admin'
  },
  { 
    id: 'marketing', 
    name: 'Marketing', 
    icon: Megaphone, 
    component: AdminMarketingTab,
    description: 'Campanhas e redes sociais',
    requiredRole: 'admin'
  },
  { 
    id: 'settings', 
    name: 'Configurações', 
    icon: Settings, 
    component: AdminSettingsTab, 
    description: 'Ajustes gerais da plataforma',
    requiredRole: 'admin'
  }
];

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const user = await base44.auth.me();
        
        const isFullAdmin = user?.role === 'admin';
        const isRevelaAdmin = user?.is_revela_admin === true && user?.role !== 'admin';
        
        if (!isFullAdmin && !isRevelaAdmin) {
          window.location.href = '/Hub';
          return;
        }
        
        setCurrentUser(user);
        
        if (isRevelaAdmin) {
          setActiveTab('revela_dashboard');
        } else if (isFullAdmin) {
          setActiveTab('dashboard');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to check admin access:', error);
        window.location.href = '/Hub';
      }
    };
    checkAccess();
  }, []);

  // Filtrar abas baseadas no tipo de usuário
  const getVisibleTabs = () => {
    if (!currentUser) return [];
    
    const isFullAdmin = currentUser.role === 'admin';
    const isRevelaAdmin = currentUser.is_revela_admin === true && currentUser.role !== 'admin';
    
    // Case 1: Full Admin (role === 'admin')
    // Vê todas as abas EXCETO 'revela_dashboard'
    if (isFullAdmin) {
      return adminTabsConfig.filter(tab => tab.id !== 'revela_dashboard');
    }
    
    // Case 2: Revela Admin (is_revela_admin === true e role !== 'admin')
    // Vê APENAS as abas com requiredRole === 'revela_admin'
    if (isRevelaAdmin) {
      return adminTabsConfig.filter(tab => tab.requiredRole === 'revela_admin');
    }
    
    return [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p>Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  const visibleTabs = getVisibleTabs();

  // Helper function para renderizar o componente da aba ativa
  const renderActiveTabComponent = () => {
    const tab = visibleTabs.find(t => t.id === activeTab);
    if (tab) {
      const Component = tab.component;
      return <Component />;
    }
    // Fallback: se activeTab não for encontrado, usa a primeira aba visível
    const firstTab = visibleTabs[0];
    if (firstTab) {
      const Component = firstTab.component;
      return <Component />;
    }
    return <div className="p-6 text-gray-300">Nenhuma aba disponível para seu perfil de usuário.</div>;
  };

  // Helper function para pegar info da aba ativa (nome e descrição para header)
  const getActiveTabInfo = (property) => {
    const tab = visibleTabs.find(t => t.id === activeTab);
    return tab ? tab[property] : null;
  };

  // Determinar tipo de admin para exibição
  const isFullAdmin = currentUser?.role === 'admin';
  const isRevelaAdmin = currentUser?.is_revela_admin === true && currentUser?.role !== 'admin';

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar de navegação */}
      <div className="w-80 bg-gray-950 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" 
              alt="EC10" 
              className="h-8 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold">Central Admin EC10</h1>
              <p className="text-xs text-gray-400">
                {isRevelaAdmin 
                  ? 'Gestão Revela Talentos' 
                  : isFullAdmin
                    ? 'Gestão & Vendas'
                    : 'Administração'}
              </p>
            </div>
          </div>
          
          {currentUser && (
            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-black">
                  {currentUser.full_name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{currentUser.full_name}</p>
                <Badge className={`${isRevelaAdmin ? 'bg-purple-500/20 text-purple-300' : 'bg-red-500/20 text-red-300'} text-xs`}>
                  {isRevelaAdmin ? 'Admin Revela' : 'Administrador'}
                </Badge>
              </div>
            </div>
          )}
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {visibleTabs.map(tab => (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full justify-start text-left h-auto p-4 ${
                  activeTab === tab.id
                    ? 'bg-sky-500/20 text-sky-300 border-r-4 border-sky-400'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{tab.name}</p>
                  <p className="text-xs opacity-75 truncate">{tab.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </nav>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-950/50 border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {getActiveTabInfo('name') || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-400">
                {getActiveTabInfo('description') || 'Painel principal'}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          {renderActiveTabComponent()}
        </main>
      </div>
    </div>
  );
}