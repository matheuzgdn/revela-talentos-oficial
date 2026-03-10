import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";

import StoriesModal from "@/components/stories/StoriesModal";
import ProfileSetup from "@/components/athlete/ProfileSetup";
import { LanguageProvider, useLanguage } from "@/components/i18n/LanguageContext";
import LanguageToggle from "@/components/i18n/LanguageToggle";
import {
  Star,
  TrendingUp,
  Globe,
  Settings,
  User as UserIcon,
  LogOut,
  Lock,
  Menu,
  X,
  Shield,
  CalendarDays
} from
  "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider
} from
  "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const getNavigationItems = (user, t) => {
  const items = [
    { title: t('nav.revela'), url: createPageUrl("RevelaTalentos"), icon: Star },
    { title: t('nav.career'), url: createPageUrl("PlanoCarreira"), icon: TrendingUp },
    { title: t('nav.international'), url: createPageUrl("PlanoInternacional"), icon: Globe },
    { title: t('nav.events'), url: createPageUrl("Eventos"), icon: CalendarDays, requiresAuth: true },
    { title: t('nav.services'), url: createPageUrl("MeusServicos"), icon: Settings, requiresAuth: true }
  ];

  if (user?.role === 'admin' || user?.is_revela_admin === true) {
    items.push({
      title: t('nav.admin'),
      url: createPageUrl("Admin"),
      icon: Shield,
      requiresAuth: true,
      isAdmin: true
    });
  }

  return items;
};

function LayoutInner({ children, currentPageName }) {
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userPackageName, setUserPackageName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [hasLiveContent, setHasLiveContent] = useState(false);
  const [stories, setStories] = useState([]);
  const [showStories, setShowStories] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setUserPackageName(currentUser.has_plano_carreira_access ? t('package.career') : t('package.revela'));
      // Abre onboarding automaticamente para novos usuários
      if (currentUser && !currentUser.onboarding_completed && !currentUser.position) {
        setShowOnboarding(true);
      }
      setIsLoading(false);
    } catch (error) {
      setUser(null);
      setIsLoading(false);
    }
  }, [t]);

  const loadStories = useCallback(async () => {
    try {
      const activeStories = await base44.entities.Story.filter({ is_active: true }, "order", 20);
      if (activeStories?.length > 0) {
        // Filtrar por público-alvo
        const filteredStories = activeStories.filter(story => {
          if (story.target_audience === "all") return true;
          if (story.target_audience === "athletes" && user) return true;
          if (story.target_audience === "guests" && !user) return true;
          return false;
        });

        if (filteredStories.length > 0) {
          setStories(filteredStories);

          // Verificar se já viu os stories hoje
          const lastStorySeen = localStorage.getItem("lastStorySeen");
          const today = new Date().toDateString();
          if (lastStorySeen !== today) {
            setShowStories(true);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao carregar stories:", error);
    }
  }, [user]);

  useEffect(() => {
    loadUser();

    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [loadUser]);

  useEffect(() => {
    if (!isLoading) {
      loadStories();
    }
  }, [isLoading, loadStories]);

  // Redirect new users to BemVindo for onboarding
  useEffect(() => {
    if (!isLoading && user && !user.onboarding_completed && currentPageName !== 'BemVindo') {
      navigate(createPageUrl('BemVindo'), { replace: true });
    }
  }, [isLoading, user, currentPageName, navigate]);

  // Force redirect to login when unauthenticated
  useEffect(() => {
    if (!isLoading && !user) {
      const nextUrl = window.location.href;
      base44.auth.redirectToLogin(nextUrl);
    }
  }, [isLoading, user]);

  const handleCloseStories = () => {
    setShowStories(false);
    localStorage.setItem("lastStorySeen", new Date().toDateString());
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  const handleNavClick = (item) => {
    setShowMobileMenu(false);
  };

  const handleLoginClick = () => {
    base44.auth.redirectToLogin();
  };

  const navigationItemsToRender = getNavigationItems(user, t);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>);

  }

  // ZonaMembros tem seu proprio sidebar — nao aplicar o Layout.jsx
  if (currentPageName === 'ZonaMembros') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <StoriesModal stories={stories} isOpen={showStories} onClose={handleCloseStories} />
      {user && currentPageName !== 'BemVindo' && (
        <ProfileSetup
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          user={user}
          onSave={loadUser}
        />
      )}
      <div className="min-h-screen flex w-full bg-black">
        {/* Desktop Sidebar */}
        {user && <div
          className={`hidden md:block fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out ${sidebarExpanded ? 'w-64' : 'w-20'}`}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}>

          <Sidebar className={`border-r border-gray-900 bg-black h-full transition-all duration-300 ${sidebarExpanded ? 'w-64' : 'w-20'}`}>
            <SidebarHeader className={`border-b border-gray-900 bg-black transition-all duration-300 h-20 flex items-center ${sidebarExpanded ? 'px-6' : 'px-4 justify-center'}`}>
              <div className="flex items-center gap-3">
                <Link to={createPageUrl('RevelaTalentos')}>
                  {sidebarExpanded ?
                    <div className="flex items-center gap-2">
                      <img src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" alt="EC10 Talentos" className="h-10 w-auto" />
                      {hasLiveContent &&
                        <Badge className="bg-red-600 text-white text-[10px] px-2 py-0.5 animate-pulse">
                          LIVE
                        </Badge>
                      }
                    </div> :

                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">EC</span>
                      </div>
                      {hasLiveContent &&
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse border-2 border-black"></div>
                      }
                    </div>
                  }
                </Link>
              </div>
            </SidebarHeader>

            <SidebarContent className={`flex flex-col bg-black transition-all duration-300 ${sidebarExpanded ? 'p-4' : 'p-2'}`}>
              <SidebarGroup className="flex-grow">
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-2">
                    {navigationItemsToRender.map((item) => {
                      const isActive = location.pathname === item.url;

                      return (
                        <SidebarMenuItem key={item.title}>
                          <Link
                            to={item.url}
                            onClick={() => handleNavClick(item)}
                            className={`group relative flex items-center w-full transition-all duration-300 rounded-xl ${sidebarExpanded ? 'gap-4 p-4' : 'justify-center p-3'} ${isActive ?
                              item.isAdmin ?
                                'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/25' :
                                'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25' :
                              'hover:bg-gray-900 text-gray-300 hover:text-white'}`
                            }>

                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {sidebarExpanded && <span className="font-medium">{item.title}</span>}
                            {item.requiresAuth && !user && !sidebarExpanded &&
                              <Lock className="w-3 h-3 absolute -top-1 -right-1 text-gray-500" />
                            }
                          </Link>
                        </SidebarMenuItem>);

                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* User Section */}
              <div className={`mt-auto border-t border-gray-900 transition-all duration-300 ${sidebarExpanded ? 'p-4' : 'p-2'}`}>
                {user ?
                  <div className="space-y-4">
                    {sidebarExpanded ?
                      <>
                        <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-gray-800">
                          <Avatar className="h-10 w-10 flex-shrink-0"><AvatarImage src={user.profile_picture_url} /><AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">{user.full_name?.charAt(0) || 'A'}</AvatarFallback></Avatar>
                          <div className="flex-1 min-w-0"><p className="font-medium text-white text-sm truncate">{user.full_name}</p>{userPackageName && <Badge className={`text-xs ${userPackageName === 'Plano de Carreira' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'}`}>{userPackageName}</Badge>}</div>
                        </div>
                        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-900"><LogOut className="w-4 h-4 mr-2" />{t('nav.logout')}</Button>
                      </> :

                      <div className="flex flex-col items-center space-y-2">
                        <Avatar className="h-8 w-8"><AvatarImage src={user.profile_picture_url} /><AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm">{user.full_name?.charAt(0) || 'A'}</AvatarFallback></Avatar>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-white hover:bg-gray-900 p-2"><LogOut className="w-4 h-4" /></Button>
                      </div>
                    }
                  </div> :

                  <>
                    <Button onClick={handleLoginClick} className={`${sidebarExpanded ? 'w-full' : 'p-2'} bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg`}>
                      <UserIcon className={`w-4 h-4 ${sidebarExpanded ? 'mr-2' : ''}`} />{sidebarExpanded && t('nav.login')}
                    </Button>
                    {sidebarExpanded && (
                      <div className="mt-3">
                        <LanguageToggle variant="outline" className="w-full border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800" />
                      </div>
                    )}
                  </>
                }
              </div>
            </SidebarContent>
          </Sidebar>
        </div>}

        {/* Mobile Header */}
        {user && <header className="md:hidden fixed top-0 left-0 right-0 h-14 z-40 bg-gradient-to-b from-black via-black/95 to-black/80 backdrop-blur-xl border-b border-cyan-500/20">
          <div className="flex items-center justify-end h-full px-4">
            {hasLiveContent && (
              <div className="absolute left-4 flex items-center gap-2 bg-red-600/20 border border-red-500 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-red-400 uppercase">Live</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileMenu(true)}
              className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 hover:border-cyan-500/50 transition-all shadow-lg shadow-cyan-500/20"
            >
              <Menu className="w-5 h-5 text-cyan-400" />
            </Button>
          </div>
        </header>}

        {/* Mobile Menu Overlay */}
        {showMobileMenu &&
          <div className="md:hidden fixed inset-0 bg-gradient-to-b from-black via-[#0A1A2A] to-black z-50 flex flex-col">
            {/* Header do Menu */}
            <div className="relative p-6 border-b border-cyan-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" alt="EC10 Logo" className="h-10 w-auto" />
                  {hasLiveContent && (
                    <Badge className="bg-red-600 text-white text-xs px-2 py-1 animate-pulse">
                      LIVE
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileMenu(false)}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
                >
                  <X className="w-5 h-5 text-white" />
                </Button>
              </div>
            </div>

            {/* User Info */}
            {user && (
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20">
                  <Avatar className="h-12 w-12 border-2 border-cyan-500/50">
                    <AvatarImage src={user.profile_picture_url} />
                    <AvatarFallback className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold">
                      {user.full_name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{user.full_name}</p>
                    {userPackageName && (
                      <Badge className="text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white mt-1">
                        {userPackageName}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {navigationItemsToRender.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={() => handleNavClick(item)}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive
                      ? item.isAdmin
                        ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/25'
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-white/5'
                      }`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{item.title}</p>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/5 space-y-3">
              {user ? (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full text-base py-6 rounded-2xl border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  {t('nav.logout.account')}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleLoginClick();
                  }}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-base py-6 rounded-2xl shadow-xl shadow-cyan-500/30"
                >
                  <UserIcon className="w-5 h-5 mr-2" />
                  {t('nav.login.google')}
                </Button>
              )}
              <LanguageToggle variant="outline" className="w-full border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20" />
            </div>
          </div>
        }

        {/* Main content */}
        <main className={`flex-1 overflow-auto bg-black transition-all duration-300 ${user ? (sidebarExpanded ? 'md:ml-64' : 'md:ml-20') : ''}`}>
          <div className={user ? 'pt-16 md:pt-0' : ''}>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>);

}

export default function Layout({ children, currentPageName }) {
  return (
    <LanguageProvider>
      <LayoutInner children={children} currentPageName={currentPageName} />
    </LanguageProvider>
  );
}