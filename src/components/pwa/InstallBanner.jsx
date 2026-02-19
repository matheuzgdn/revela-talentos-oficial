import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Check, Smartphone, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Detecta a plataforma do dispositivo com fallback para versões antigas
 * @returns {'ios' | 'android' | 'mobile' | 'desktop'}
 */
function detectPlatform() {
  try {
    const ua = (navigator.userAgent || '').toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) return 'ios';
    if (/android/.test(ua)) return 'android';
    if (/mobile/.test(ua)) return 'mobile';
    return 'desktop';
  } catch (e) {
    return 'desktop';
  }
}

/**
 * Verifica se o app já está instalado (modo standalone) com fallback
 */
function isAppInstalled() {
  try {
    return (
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      (window.navigator && window.navigator.standalone) ||
      (document.referrer && document.referrer.includes('android-app://'))
    );
  } catch (e) {
    return false;
  }
}

/**
 * Verifica se o usuário marcou para não mostrar o banner com fallback
 */
function isDismissed() {
  try {
    if (!window.localStorage) return false;
    return localStorage.getItem('pwa-install-dismissed') === 'true';
  } catch (e) {
    return false;
  }
}

/**
 * Marca o banner como dispensado com fallback
 */
function markAsDismissed() {
  try {
    if (window.localStorage) {
      localStorage.setItem('pwa-install-dismissed', 'true');
    }
  } catch (e) {
    // Silent fail para navegadores antigos
  }
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function InstallBanner() {
  // Estado do banner principal
  const [showBanner, setShowBanner] = useState(false);
  const [platform, setPlatform] = useState('desktop');
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Estados dos modais
  const [showIOSTutorial, setShowIOSTutorial] = useState(false);
  const [showAndroidTutorial, setShowAndroidTutorial] = useState(false);
  const [showDesktopMessage, setShowDesktopMessage] = useState(false);

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * Handler para o botão "Instalar"
   */
  const handleInstallClick = useCallback(async () => {
    if (platform === 'android') {
      if (deferredPrompt) {
        // Android com suporte PWA: abrir prompt nativo
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
          setShowBanner(false);
          markAsDismissed();
        }

        setDeferredPrompt(null);
      } else {
        // Android sem evento PWA: mostrar tutorial manual
        setShowAndroidTutorial(true);
      }
    } else if (platform === 'ios') {
      // iOS: mostrar tutorial
      setShowIOSTutorial(true);
    } else {
      // Desktop: mostrar aviso
      setShowDesktopMessage(true);
    }
  }, [platform, deferredPrompt]);

  /**
   * Handler para dispensar o banner permanentemente
   */
  const handleDismiss = useCallback(() => {
    setShowBanner(false);
    markAsDismissed();
  }, []);

  /**
   * Handler para fechar o tutorial iOS (NÃO marca como dismissed)
   */
  const handleIOSTutorialClose = useCallback(() => {
    setShowIOSTutorial(false);
  }, []);

  /**
   * Handler para fechar tutorial Android
   */
  const handleAndroidTutorialClose = useCallback(() => {
    setShowAndroidTutorial(false);
  }, []);

  /**
   * Handler para fechar mensagem do Desktop
   */
  const handleDesktopClose = useCallback(() => {
    setShowDesktopMessage(false);
  }, []);

  // ============================================
  // EFFECTS
  // ============================================

  /**
   * Effect principal: configura detecção de plataforma e eventos PWA com suporte para versões antigas
   */
  useEffect(() => {
    try {
      // Detectar plataforma
      const detectedPlatform = detectPlatform();
      setPlatform(detectedPlatform);

      // Verificar se deve mostrar o banner
      const shouldShow =
        !isAppInstalled() &&
        !isDismissed() &&
        (detectedPlatform === 'ios' || detectedPlatform === 'android');

      setShowBanner(shouldShow);

      // Handler para o evento de instalação disponível (Android/Chrome)
      const handleBeforeInstallPrompt = (e) => {
        try {
          e.preventDefault();
          setDeferredPrompt(e);
        } catch (err) {
          // Silent fail
        }
      };

      // Handler para quando o app é instalado
      const handleAppInstalled = () => {
        try {
          setShowBanner(false);
          markAsDismissed();
          setDeferredPrompt(null);
        } catch (err) {
          // Silent fail
        }
      };

      // Adicionar listeners com verificação de suporte
      if (window.addEventListener) {
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // Cleanup
        return () => {
          try {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
          } catch (e) {
            // Silent fail
          }
        };
      }
    } catch (e) {
      // Silent fail para navegadores muito antigos
      console.log('PWA banner not supported');
    }
  }, []);

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      {/* BANNER PRINCIPAL */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-[60px] md:top-0 left-0 right-0 z-30 bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
              {/* Conteúdo do banner */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm md:text-base">Instale o Revela Talentos</p>
                  <p className="text-xs md:text-sm text-cyan-100 truncate">
                    Acesso rápido direto da sua tela inicial
                  </p>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  onClick={handleInstallClick}
                  className="bg-white text-cyan-600 hover:bg-cyan-50 font-bold text-xs md:text-sm whitespace-nowrap"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Instalar
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-white hover:bg-white/20 text-xs md:text-sm whitespace-nowrap hidden sm:flex"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Já instalei
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: TUTORIAL iOS */}
      <AnimatePresence>
        {showIOSTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleIOSTutorialClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full text-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Como instalar no iPhone</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleIOSTutorialClose}
                  className="text-gray-500 hover:text-gray-900"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Passos */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Abra no Safari</p>
                    <p className="text-sm text-gray-600">
                      Se não estiver no Safari, copie o link e cole no navegador Safari
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Toque em "Compartilhar"</p>
                    <p className="text-sm text-gray-600">Ícone de compartilhamento na barra inferior</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Selecione "Adicionar à Tela de Início"</p>
                    <p className="text-sm text-gray-600">
                      Role para baixo no menu até encontrar esta opção
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-semibold">Confirme</p>
                    <p className="text-sm text-gray-600">Toque em "Adicionar" para concluir a instalação</p>
                  </div>
                </div>
              </div>

              {/* Dica */}
              <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <p className="text-sm text-cyan-800">
                  <strong>Dica:</strong> Após instalar, abra o app pela tela inicial para uma experiência
                  completa!
                </p>
              </div>

              {/* Botão */}
              <Button
                onClick={handleIOSTutorialClose}
                className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold"
              >
                Entendi
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: TUTORIAL ANDROID */}
      <AnimatePresence>
        {showAndroidTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleAndroidTutorialClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full text-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-cyan-500" />
                  <h3 className="text-xl font-bold">Como instalar no Android</h3>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleAndroidTutorialClose}
                  className="text-gray-500 hover:text-gray-900"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <p className="text-gray-700 mb-4">
                No seu Android, toque nos <strong>três pontinhos</strong> do navegador e escolha{' '}
                <strong>"Adicionar à tela inicial"</strong> para criar o atalho do Revela Talentos.
              </p>

              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <p className="text-sm text-cyan-800">
                  <strong>Dica:</strong> O atalho ficará disponível na tela do seu celular, igual aos outros
                  aplicativos.
                </p>
              </div>

              <Button
                onClick={handleAndroidTutorialClose}
                className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold"
              >
                Entendi
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: DESKTOP */}
      <AnimatePresence>
        {showDesktopMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleDesktopClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full text-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-cyan-500" />
                  <h3 className="text-xl font-bold">Instale no celular</h3>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDesktopClose}
                  className="text-gray-500 hover:text-gray-900"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <p className="text-gray-700 mb-4">
                Para instalar o app, abra esta página pelo seu <strong>celular</strong>.
              </p>

              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <p className="text-sm text-cyan-800">
                  <strong>Dica:</strong> Você pode continuar usando pelo navegador normalmente.
                </p>
              </div>

              <Button
                onClick={handleDesktopClose}
                className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold"
              >
                Entendi
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}