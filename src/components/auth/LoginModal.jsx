import React, { useState } from "react";
import { User } from "@/entities/User";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User as UserIcon } from "lucide-react";

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      await User.login();
      // A página será recarregada após o login bem-sucedido
    } catch (err) {
      setError("Ocorreu um erro durante o login. Por favor, tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Acessar Plataforma
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-800">
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          <p className="text-center text-gray-400">
            Use sua conta Google para entrar ou criar seu acesso na EC10 Talentos.
          </p>

          <Button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Aguarde...
              </>
            ) : (
              <>
                <UserIcon className="mr-2 h-5 w-5" />
                Entrar com Google
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}