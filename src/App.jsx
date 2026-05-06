import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import MojibakeTextGuard from '@/lib/MojibakeTextGuard'
import { pagesConfig } from './pages.config'
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { redirectToPlatformLogin } from '@/lib/auth-routing';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const EmptyPage = () => null;
const MainPage = mainPageKey ? Pages[mainPageKey] : EmptyPage;
const CheckoutSuccess = lazy(() => import('./pages/checkout'));
const LoginPage = lazy(() => import('./pages/Login'));

const PageFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#040507]">
    <div className="w-8 h-8 border-4 border-cyan-300/20 border-t-cyan-300 rounded-full animate-spin"></div>
  </div>
);

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const SuspendedPage = ({ children }) => (
  <Suspense fallback={<PageFallback />}>
    {children}
  </Suspense>
);

// Helper to redirect to login when hitting a protected route
const LoginRedirect = () => {
  useEffect(() => {
    redirectToPlatformLogin(window.location.href);
  }, []);
  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children, isPublic }) => {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) return null; // Let the main loader handle it

  if (!isAuthenticated && !isPublic) {
    return <LoginRedirect />;
  }

  return children;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={
        <SuspendedPage>
          <LoginPage />
        </SuspendedPage>
      } />
      <Route path="/" element={
        <SuspendedPage>
          <LayoutWrapper currentPageName={mainPageKey}>
            <MainPage />
          </LayoutWrapper>
        </SuspendedPage>
      } />
      <Route path="/thanks" element={
        <ProtectedRoute isPublic={true}>
          <SuspendedPage>
            <LayoutWrapper currentPageName="checkout">
              <CheckoutSuccess isPending={true} />
            </LayoutWrapper>
          </SuspendedPage>
        </ProtectedRoute>
      } />
      <Route path="/thanks1" element={
        <ProtectedRoute isPublic={true}>
          <SuspendedPage>
            <LayoutWrapper currentPageName="checkout">
              <CheckoutSuccess platformUrlOverride="https://revelatalentos.com/login?from_url=https%3A%2F%2Frevelatalentos.com%2F" />
            </LayoutWrapper>
          </SuspendedPage>
        </ProtectedRoute>
      } />
      <Route path="/checkout" element={<Navigate to="/thanks" replace />} />
      {Object.entries(Pages).map(([path, Page]) => {
        const isPublicPage = [
          'cases-sucesso-atletas',
          'escola-parceira',
          'escolas-parceiras',
          'pais-atletas',
          'pais-e-atletas',
          'vsl-escola-parceira',
          'evento',
          'vsl-evento'
        ].includes(path);
        return (
          <Route
            key={path}
            path={`/${path}`}
            element={
              <ProtectedRoute isPublic={isPublicPage}>
                <SuspendedPage>
                  <LayoutWrapper currentPageName={path}>
                    <Page />
                  </LayoutWrapper>
                </SuspendedPage>
              </ProtectedRoute>
            }
          />
        );
      })}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


const QueryRedirector = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/' && location.search.includes('page=')) {
      const searchParams = new URLSearchParams(location.search);
      const page = searchParams.get('page');
      if (page) {
        searchParams.delete('page');
        const qs = searchParams.toString();
        // Use replace to prevent the redirect from adding to history stack
        navigate(`/${page}${qs ? '?' + qs : ''}`, { replace: true });
      }
    }
  }, [location, navigate]);

  return null;
};

const BrowserThemeManager = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const isEscolaFlow = [
      '/escola-parceira',
      '/escolas-parceiras',
      '/pais-atletas',
      '/pais-e-atletas',
      '/vsl-escola-parceira',
      '/evento',
      '/vsl-evento'
    ].includes(location.pathname);
    const themeColor = isEscolaFlow ? '#07111f' : '#040507';
    const background = isEscolaFlow
      ? 'linear-gradient(180deg, #040507 0%, #07111f 100%)'
      : '#040507';

    const ensureMeta = (name) => {
      let element = document.querySelector(`meta[name="${name}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }

      return element;
    };

    ensureMeta('theme-color').setAttribute('content', themeColor);
    ensureMeta('msapplication-navbutton-color').setAttribute('content', themeColor);

    document.documentElement.style.background = background;
    document.body.style.background = background;
  }, [location.pathname]);

  return null;
};

function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <QueryRedirector />
          <BrowserThemeManager />
          <MojibakeTextGuard />
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
