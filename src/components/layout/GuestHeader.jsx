import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { User as UserIcon } from 'lucide-react';
import LoginModal from '@/components/auth/LoginModal';
import { appClient } from '@/api/backendClient';

export default function GuestHeader() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAccess = async () => {
    setIsLoading(true);
    try {
      await appClient.auth.me();
      window.location.href = createPageUrl("Hub");
    } catch (error) {
      setShowLoginModal(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-gray-800/50 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        <Link to={createPageUrl('Home')}>
          <img 
            src="https://static.wixstatic.com/media/933cdd_6a91d4f3263241aa82fc5e9345f6c522~mv2.png" 
            alt="EC10 Logo" 
            className="h-8 sm:h-10 w-auto" 
          />
        </Link>
        <Button 
          onClick={checkAccess}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg font-semibold"
        >
          <UserIcon className="w-4 h-4 mr-2" />
          {isLoading ? "Verificando..." : "Entrar / Registrar"}
        </Button>
      </header>
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          window.location.href = createPageUrl("Hub");
        }}
      />
    </>
  );
}

