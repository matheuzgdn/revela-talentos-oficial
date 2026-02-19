import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { User } from "@/entities/User";
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
  Shield } from
"lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider } from
"@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
{ title: "Revela Talentos", url: createPageUrl("RevelaTalentos"), icon: Star },
{ title: "Plano de Carreira", url: createPageUrl("PlanoCarreira"), icon: TrendingUp },
{ title: "Plano Internacional", url: createPageUrl("PlanoInternacional"), icon: Globe },
{ title: "Meus Serviços", url: createPageUrl("MeusServicos"), icon: Settings, requiresAuth: true }];


const getNavigationItems = (user) => {
  const items = [...navigationItems];

  if (user?.role === 'admin' || user?.is_revela_admin === true) {
    items.push({
      title: "Admin",
      url: createPageUrl("Admin"),
      icon: Shield,
      requiresAuth: true,
      isAdmin: true
    });
  }

  return items;
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userPackageName, setUserPackageName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [hasLiveContent, setHasLiveContent] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setUserPackageName(currentUser.has_plano_carreira_access ? "Plano de Carreira" : "Revela Talentos");
      setIsLoading(false);
    } catch (error) {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

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

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await User.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    window.location.href = createPageUrl("RevelaTalentos");
  };

  const handleNavClick = (item) => {
    setShowMobileMenu(false);
  };

  const handleLoginClick = () => {
    base44.auth.redirectToLogin();
  };

  const navigationItemsToRender = getNavigationItems(user);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>);

  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-black">
        {/* Desktop Sidebar */}
        <div
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
                            className={`group relative flex items-center w-full transition-all duration-300 rounded-xl ${sidebarExpanded ? 'gap-4 p-4' : 'justify-center p-3'} ${
                            isActive ?
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
                        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-900"><LogOut className="w-4 h-4 mr-2" />Sair</Button>
                      </> :

                  <div className="flex flex-col items-center space-y-2">
                        <Avatar className="h-8 w-8"><AvatarImage src={user.profile_picture_url} /><AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm">{user.full_name?.charAt(0) || 'A'}</AvatarFallback></Avatar>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-white hover:bg-gray-900 p-2"><LogOut className="w-4 h-4" /></Button>
                      </div>
                  }
                  </div> :

                <Button onClick={handleLoginClick} className={`${sidebarExpanded ? 'w-full' : 'p-2'} bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg`}>
                    <UserIcon className={`w-4 h-4 ${sidebarExpanded ? 'mr-2' : ''}`} />{sidebarExpanded && 'Entrar'}
                  </Button>
                }
              </div>
            </SidebarContent>
          </Sidebar>
        </div>

        {/* Mobile Glass Header */}
        <header className="md:hidden fixed top-0 left-0 right-0 h-16 z-40 bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between h-full px-4">
            <Link to={createPageUrl('RevelaTalentos')} className="flex items-center gap-2">
              <img src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" alt="EC10 Logo" className="h-8 w-auto" />
              {hasLiveContent && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(true)} className="text-white/80 hover:text-white hover:bg-white/10 rounded-full">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {showMobileMenu &&
        <div className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex flex-col p-6">
            <div className="flex items-center justify-between mb-12">
              <img src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" alt="EC10 Logo" className="h-8 w-auto" />
              <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(false)} className="rounded-full">
                <X className="w-6 h-6 text-white" />
              </Button>
            </div>

            <nav className="flex-1 flex flex-col items-center justify-center space-y-6">
              {navigationItemsToRender.map((item) =>
            <Link
              key={item.title}
              to={item.url}
              onClick={() => handleNavClick(item)}
              className="text-2xl font-bold text-gray-300 hover:text-white transition-colors">

                  {item.title}
                </Link>
            )}
            </nav>

            <div className="mt-auto space-y-4">
              {user ?
            <>
                  <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profile_picture_url} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                        {user.full_name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{user.full_name}</p>
                      {userPackageName && (
                        <Badge className="text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                          {userPackageName}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout} 
                    className="w-full text-lg py-6 rounded-2xl border-white/20 hover:bg-white/10 backdrop-blur-sm"
                  >
                    <LogOut className="w-5 h-5 mr-2" />Sair
                  </Button>
                </> :

            <Button 
              onClick={() => {
                setShowMobileMenu(false);
                handleLoginClick();
              }} 
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-lg py-6 rounded-2xl shadow-lg shadow-blue-500/25"
            >
              <UserIcon className="w-5 h-5 mr-2" /> Entrar com Google
            </Button>
            }
            </div>
          </div>
        }

        {/* Main content */}
        <main className={`flex-1 overflow-auto bg-black transition-all duration-300 ${sidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
          <div className="pt-16 md:pt-0">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>);

}