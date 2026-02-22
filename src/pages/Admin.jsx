import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Target,
  Star,
  Zap,
  X
} from 'lucide-react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import AdminContentTab from '@/components/admin/AdminContentTab';
import AdminSeletivasTab from '@/components/admin/AdminSeletivasTab'; 
import AdminStoriesTab from '@/components/admin/AdminStoriesTab';
import AdminServicesTab from '@/components/admin/AdminServicesTab';
import AdminStoriesManagement from '@/components/admin/AdminStoriesManagement';

const adminTabsConfig = [
  { 
    id: 'dashboard', 
    name: 'Dashboard', 
    icon: LayoutDashboard, 
    component: AdminDashboard,
    description: 'Visão geral da plataforma',
    requiredRole: 'admin',
    gradient: 'from-cyan-500 to-blue-600'
  },
  { 
    id: 'users', 
    name: 'Atletas', 
    icon: Users, 
    component: AdminUsersTab,
    description: 'Gestão de atletas e usuários',
    requiredRole: 'admin',
    gradient: 'from-purple-500 to-pink-600'
  },
  { 
    id: 'seletivas', 
    name: 'Seletivas', 
    icon: Target, 
    component: AdminSeletivasTab,
    description: 'Peneiras e avaliações',
    requiredRole: 'revela_admin',
    gradient: 'from-green-500 to-emerald-600'
  },
  { 
    id: 'stories', 
    name: 'Destaques', 
    icon: Star, 
    component: AdminStoriesTab,
    description: 'Atletas em evidência',
    requiredRole: 'revela_admin',
    gradient: 'from-yellow-500 to-orange-600'
  },
  { 
    id: 'stories_abertura', 
    name: 'Stories', 
    icon: Star, 
    component: AdminStoriesManagement,
    description: 'Stories de abertura do app',
    requiredRole: 'admin',
    gradient: 'from-pink-500 to-rose-600'
  },
  { 
    id: 'services', 
    name: 'Serviços', 
    icon: Zap, 
    component: AdminServicesTab,
    description: 'Serviços em destaque',
    requiredRole: 'admin',
    gradient: 'from-indigo-500 to-purple-600'
  },
  { 
    id: 'content', 
    name: 'Conteúdo', 
    icon: FileText, 
    component: AdminContentTab,
    description: 'Vídeos e materiais',
    requiredRole: 'revela_admin',
    gradient: 'from-blue-500 to-cyan-600'
  }
];

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const user = await base44.auth.me();
        
        const isFullAdmin = user?.role === 'admin';
        const isRevelaAdmin = user?.is_revela_admin === true && user?.role !== 'admin';
        
        if (!isFullAdmin && !isRevelaAdmin) {
          window.location.href = '/RevelaTalentos';
          return;
        }
        
        setCurrentUser(user);
        setActiveTab(isFullAdmin ? 'dashboard' : 'seletivas');
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to check admin access:', error);
        window.location.href = '/RevelaTalentos';
      }
    };
    checkAccess();
  }, []);

  const getVisibleTabs = () => {
    if (!currentUser) return [];
    
    const isFullAdmin = currentUser.role === 'admin';
    const isRevelaAdmin = currentUser.is_revela_admin === true && currentUser.role !== 'admin';
    
    if (isFullAdmin) {
      return adminTabsConfig.filter(tab => tab.requiredRole === 'admin' || tab.requiredRole === 'revela_admin');
    }
    
    if (isRevelaAdmin) {
      return adminTabsConfig.filter(tab => tab.requiredRole === 'revela_admin');
    }
    
    return [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const visibleTabs = getVisibleTabs();
  const activeTabConfig = visibleTabs.find(t => t.id === activeTab) || visibleTabs[0];
  const ActiveComponent = activeTabConfig?.component;

  const isFullAdmin = currentUser?.role === 'admin';
  const isRevelaAdmin = currentUser?.is_revela_admin === true && currentUser?.role !== 'admin';

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      {/* Sidebar */}
      <motion.div 
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        className="relative bg-gradient-to-b from-[#0A0A0A] to-black border-r border-gray-800/50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800/50">
          <motion.div 
            animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <img 
                  src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" 
                  alt="EC10" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-black tracking-tight">EC10 Admin</h1>
                <p className="text-xs text-gray-500">
                  {isRevelaAdmin ? 'Revela Talentos' : 'Gestão Premium'}
                </p>
              </div>
            )}
          </motion.div>
          
          {!sidebarCollapsed && currentUser && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {currentUser.full_name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{currentUser.full_name}</p>
                  <p className="text-xs text-cyan-400">
                    {isRevelaAdmin ? 'Admin Revela' : 'Administrador'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {visibleTabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r ' + tab.gradient
                    : 'hover:bg-white/5'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={`relative flex items-center gap-4 p-4 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  {!sidebarCollapsed && (
                    <div className="flex-1 text-left">
                      <p className={`font-bold text-sm ${activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                        {tab.name}
                      </p>
                      <p className={`text-xs ${activeTab === tab.id ? 'text-white/70' : 'text-gray-600 group-hover:text-gray-400'}`}>
                        {tab.description}
                      </p>
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </nav>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-24 w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/80 transition-shadow"
        >
          <motion.div animate={{ rotate: sidebarCollapsed ? 0 : 180 }}>
            <X className="w-3 h-3 text-white" />
          </motion.div>
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-black/95 to-[#0A0A0A]/95 backdrop-blur-xl border-b border-gray-800/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeTabConfig?.gradient}`}></div>
                <h2 className="text-3xl font-black tracking-tight">
                  {activeTabConfig?.name || 'Dashboard'}
                </h2>
              </div>
              <p className="text-sm text-gray-500">
                {activeTabConfig?.description || 'Painel principal'}
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-black to-[#0A0A0A] p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {ActiveComponent && <ActiveComponent />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}