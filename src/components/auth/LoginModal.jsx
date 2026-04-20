import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AuthCredentialsForm from "@/components/auth/AuthCredentialsForm";

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Acessar Plataforma
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <AuthCredentialsForm
            submitLabel="Entrar na Plataforma"
            helperText="Entre com o e-mail e a senha da sua conta para acessar a plataforma."
            onSuccess={async (user) => {
              await onSuccess?.(user);
              onClose?.(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
