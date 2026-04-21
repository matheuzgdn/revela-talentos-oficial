import React, { useState, useEffect } from 'react';
import { appClient } from '@/api/backendClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FileText,
  Target,
  Star,
  Zap,
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
  Radio
} from 'lucide-react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import AdminContentTab from '@/components/admin/AdminContentTab';
import AdminSeletivasTab from '@/components/admin/AdminSeletivasTab';
import AdminStoriesTab from '@/components/admin/AdminStoriesTab';
import AdminServicesTab from '@/components/admin/AdminServicesTab';
import AdminStoriesManagement from '@/components/admin/AdminStoriesManagement';
import AdminFeaturedAthletesTab from '@/components/admin/AdminFeaturedAthletesTab';
import AdminLivesTab from '@/components/admin/AdminLivesSettingsTab';

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
    id: 'featured_athletes',
    name: 'Figurinhas',
    icon: Star,
    component: AdminFeaturedAthletesTab,
    description: 'Atletas em destaque (figurinhas)',
    requiredRole: 'revela_admin',
    gradient: 'from-amber-500 to-yellow-600'
  },
  {
    id: 'stories_abertura',
    name: 'Stories',
    icon: Star,
    component: AdminStoriesManagement,
    description: 'Stories de abertura do app',
    requiredRole: 'admin',
    gradie: 'from-pink-500 to-rose-600'
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
  },
  {
    id: 'lives',
    name: 'Lives',
    icon: Radio,
    component: AdminLivesTab,
    description: 'Estúdio de transmissão ao vivo',
    requiredRole: 'admin',
    gradient: 'from-red-500 to-pink-600'
  }
];

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const user = await appClient.auth.me();

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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileSidebarOpen(false);
  };

  const renderTabButton = (tab, index, { mobile = false } = {}) => (
    <motion.button
      key={`${mobile ? 'mobile' : 'desktop'}-${tab.id}`}
      initial={{ opacity: 0, x: mobile ? 0 : -20, y: mobile ? 8 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => handleTabChange(tab.id)}
      title={sidebarCollapsed && !mobile ? tab.name : undefined}
      className={`w-full group relative overflow-hidden rounded-2xl text-left transition-all duration-300 ${
        activeTab === tab.id
          ? `bg-gradient-to-r ${tab.gradient}`
          : 'hover:bg-white/5'
      }`}
    >
      {activeTab === tab.id && (
        <motion.div
          layoutId={mobile ? 'activeTabMobile' : 'activeTabDesktop'}
          className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <div className={`relative flex items-center gap-4 p-4 ${sidebarCollapsed && !mobile ? 'justify-center' : ''}`}>
        <tab.icon className={`w-5 h-5 shrink-0 ${activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
        {(!sidebarCollapsed || mobile) && (
          <div className="min-w-0 flex-1">
            <p className={`font-bold text-sm ${activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
              {tab.name}
            </p>
            <p className={`text-xs leading-relaxed ${activeTab === tab.id ? 'text-white/70' : 'text-gray-600 group-hover:text-gray-400'}`}>
              {tab.description}
            </p>
          </div>
        )}
      </div>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.div
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        className="relative hidden shrink-0 bg-gradient-to-b from-[#0A0A0A] to-black border-r border-gray-800/50 lg:flex flex-col"
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
            {visibleTabs.map((tab, index) => renderTabButton(tab, index))}
          </div>
        </nav>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-24 w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/80 transition-shadow"
        >
          <motion.div animate={{ rotate: 0 }}>
            {sidebarCollapsed ? (
              <ChevronRight className="w-3 h-3 text-white" />
            ) : (
              <ChevronLeft className="w-3 h-3 text-white" />
            )}
          </motion.div>
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="min-w-0 flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-black/95 to-[#0A0A0A]/95 backdrop-blur-xl border-b border-gray-800/50 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex items-start justify-between gap-4 sm:items-center">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
                  aria-label="Abrir navegação do admin"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeTabConfig?.gradient}`}></div>
                <h2 className="truncate text-2xl font-black tracking-tight sm:text-3xl">
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
        <main className="flex-1 overflow-auto bg-gradient-to-b from-black to-[#0A0A0A] p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-w-0"
            >
              {ActiveComponent && <ActiveComponent />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Fechar navegação do admin"
            />

            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="relative flex h-full w-[min(86vw,320px)] flex-col bg-gradient-to-b from-[#0A0A0A] to-black border-r border-gray-800/60"
            >
              <div className="flex items-center justify-between border-b border-gray-800/50 p-5">
                <div>
                  <h1 className="text-lg font-black tracking-tight">EC10 Admin</h1>
                  <p className="text-xs text-gray-500">
                    {isRevelaAdmin ? 'Revela Talentos' : 'Gestão Premium'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 bg-white/5 text-white transition hover:bg-white/10"
                  aria-label="Fechar menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {currentUser && (
                <div className="border-b border-gray-800/50 p-5">
                  <div className="flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
                      <span className="text-sm font-bold">
                        {currentUser.full_name?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{currentUser.full_name}</p>
                      <p className="text-xs text-cyan-400">
                        {isRevelaAdmin ? 'Admin Revela' : 'Administrador'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {visibleTabs.map((tab, index) => renderTabButton(tab, index, { mobile: true }))}
                </div>
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
