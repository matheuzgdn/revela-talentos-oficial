import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Mail, UserPlus, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function CreateMemberUserModal({ open, onOpenChange, onInvited }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!email) {
      toast.error("Informe o e-mail do usuário");
      return;
    }
    setIsSending(true);
    try {
      await base44.users.inviteUser(email, "user");
      const code = Array.from(crypto.getRandomValues(new Uint8Array(8)))
        .map(n => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[n % 62])
        .join("");
      const loginLink = 'https://revelatalentos.com/login?from_url=' + encodeURIComponent('https://revelatalentos.com/');
      const msg = `Olá${fullName ? ' ' + fullName : ''}!\n\nSeu acesso à Zona de Membros (Revela Talentos) foi criado.\nAcesse: ${loginLink}\nNo primeiro acesso, cadastre sua própria senha.\nSenha sugerida: ${code}\n\n— Equipe EC10 Talentos`;
      setInviteMessage(msg);
      setCopied(false);

      // Enviar e-mail profissional em PT-BR
      await base44.integrations.Core.SendEmail({
        to: email,
        from_name: 'EC10 Talentos',
        subject: 'Bem-vindo à Zona de Membros - EC10 Talentos',
        body: `Olá${fullName ? ' ' + fullName : ''}!\n\nSeu acesso à Zona de Membros foi criado.\n\nComo acessar:\n1) Clique neste link: ${loginLink}\n2) Crie sua senha no primeiro acesso (use a senha sugerida abaixo apenas como referência).\n\nSenha sugerida: ${code}\n\nSe precisar de ajuda, responda este e-mail.\n\n— EC10 Talentos`
      });

      // Ajustar flags para pular onboarding e liberar acesso
      try {
        const users = await base44.entities.User.list('-created_date', 200);
        const created = (users || []).find(u => (u.email || '').toLowerCase() === email.toLowerCase());
        if (created) {
          await base44.entities.User.update(created.id, {
            has_zona_membros_access: true,
            onboarding_completed: true,
            language: 'pt'
          });
        }
      } catch {}

      toast.success('Usuário criado e e-mail enviado em português.');
      onInvited?.();
    } catch {
      toast.error("Falha ao criar usuário. Verifique o e-mail.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-950 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-cyan-400" />
            Cadastrar Usuário Zona de Membros
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="text-gray-400">Nome completo (opcional)</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: João Silva"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-400">E-mail</Label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@email.com"
                className="pl-9 bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Enviaremos um e-mail profissional em português do EC10 Talentos com instruções e senha sugerida. Você também pode copiar a mensagem abaixo.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-gray-300 border-gray-700 hover:bg-gray-800">
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={isSending} className="bg-cyan-600 hover:bg-cyan-500">
            {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
            Cadastrar
          </Button>
        </DialogFooter>

        {inviteMessage && (
          <div className="mt-4 bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-300">Mensagem para enviar ao usuário</p>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => { await navigator.clipboard.writeText(inviteMessage); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}
                className="h-8"
              >
                <Copy className="w-4 h-4 mr-1" />
                {copied ? "Copiado!" : "Copiar"}
              </Button>
            </div>
            <Textarea readOnly value={inviteMessage} className="min-h-[140px] text-sm" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}